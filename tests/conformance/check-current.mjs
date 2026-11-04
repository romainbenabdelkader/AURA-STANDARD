// Replay fixed evidence against the separately pinned current reference release.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const standard = path.resolve(root, '../..');
const evidence = path.join(root, '2026-11-03');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const lock = readJson(path.join(root, 'verifier-v1.2.2.lock.json'));
assert.ok(process.env.AURA_VERIFIER_DIR, 'Set AURA_VERIFIER_DIR to the pinned v1.2.2 checkout.');
const verifier = path.resolve(process.env.AURA_VERIFIER_DIR);
const output = path.resolve(process.env.AURA_RESULTS_DIR || path.join(root, 'run-results'));
assert.ok(output !== evidence && !output.startsWith(evidence + path.sep), 'Keep new results outside the historical dossier.');
fs.mkdirSync(output, { recursive: true });

function checkFiles(folder, files) {
  for (const [file, expected] of Object.entries(files))
    assert.equal(sha256(fs.readFileSync(path.join(folder, file))), expected, 'Pinned input differs: ' + file);
}
const historicalLock = readJson(path.join(evidence, 'source-lock.json'));
checkFiles(standard, historicalLock.standard_files);
checkFiles(verifier, lock.files);
const checksums = fs.readFileSync(path.join(evidence, 'CHECKSUMS.sha256'), 'utf8').trim().split('\n');
for (const line of checksums) {
  const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
  assert.ok(match, 'Malformed evidence checksum line');
  checkFiles(evidence, { [match[2]]: match[1] });
}
const quickstart = path.join(standard, 'examples/quickstart-v1.1');
assert.equal(readJson(path.join(quickstart, 'manifest.json')).reference_anchor.standard.schema_digest,
  'sha3-256:' + createHash('sha3-256').update(fs.readFileSync(path.join(standard, 'schema/aura-manifest-v1.1.0.json'))).digest('hex'));

const moduleUrl = name => pathToFileURL(path.join(verifier, 'src', name)).href;
const { verifyAuraPackage } = await import(moduleUrl('verify-node.js'));
const { verifyAuraPackageBrowser } = await import(moduleUrl('verify-web.js'));
const { canonicalize } = await import(moduleUrl('jcs.js'));
const engines = [['node', verifyAuraPackage], ['webcrypto_in_node', verifyAuraPackageBrowser]];
const field = (object, name) => name.split('.').reduce((value, key) => value?.[key], object);
const dimensions = ['status', 'schemaValidation.status', 'signatureOk', 'integrityStatus',
  'issuerKeyPinOk', 'keyRevoked', 'historicalValidity', 'tdmRightsReservation.profileVerified', 'thrown'];
const compact = report => Object.fromEntries(dimensions.filter(name => field(report, name) !== undefined)
  .map(name => [name, field(report, name)]));
const results = [], failures = [];
async function check(id, pkg, expectedSchema, expected) {
  const reports = {};
  for (const [engine, verify] of engines) {
    let report;
    try { report = await verify(pkg); }
    catch (error) { report = { thrown: error.message, code: error.code, field: error.field }; }
    reports[engine] = report;
    try {
      if (expected.throws) assert.match(report.thrown ?? '', new RegExp(expected.throws));
      else {
        assert.ok(!report.thrown, report.thrown);
        if (expectedSchema === 'unsupported') {
          assert.equal(report.schemaValidation.status, 'not_checked');
          assert.ok(report.errors.some(error => /Unsupported AURA manifest version/.test(error)));
        } else assert.equal(report.schemaValidation.status, expectedSchema);
        for (const [name, value] of Object.entries(expected))
          assert.deepEqual(field(report, name), value, id + '/' + engine + '/' + name);
      }
    } catch (error) { failures.push({ id, engine, error: error.message }); }
  }
  try { assert.deepEqual(compact(reports.node), compact(reports.webcrypto_in_node), id + ': engine parity'); }
  catch (error) { failures.push({ id, error: error.message }); }
  results.push({ id, engines: Object.fromEntries(Object.entries(reports).map(([name, report]) => [name, compact(report)])) });
}
const bundle = readJson(path.join(evidence, 'vectors.json'));
for (const vector of bundle.vectors) {
  await check(vector.id, {
    manifestText: vector.manifestText, publicKeyPem: vector.publicKeyPem,
    issuerText: vector.issuerText,
    assetBytes: vector.assetHex === null ? null : Buffer.from(vector.assetHex, 'hex'),
  }, vector.expectedSchema, vector.expectedReference);
}
function packageAt(folder, manifest = 'manifest.json') {
  return { manifestText: fs.readFileSync(path.join(folder, manifest), 'utf8'),
    publicKeyPem: fs.readFileSync(path.join(folder, 'public-key.pem'), 'utf8'),
    issuerText: fs.readFileSync(path.join(folder, 'issuer.json'), 'utf8'),
    assetBytes: fs.readFileSync(path.join(folder, 'asset.txt')) };
}
await check('current-quickstart', packageAt(quickstart), 'pass',
  { status: 'valid', signatureOk: true, integrityStatus: 'verified', issuerKeyPinOk: true });

const python = process.env.AURA_PYTHON || 'python3';
const received = path.join(evidence, 's02/received');
const fresh = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-conformance-'));
try {
  const signer = spawnSync(python, [path.join(received, 's02_sign.py'), fresh, quickstart], { encoding: 'utf8' });
  assert.equal(signer.status, 0, signer.stderr || 'Python signer failed');
  assert.deepEqual(fs.readdirSync(fresh).sort(), ['asset.txt', 'issuer.json', 'manifest.json', 'manifest.tampered.json', 'public-key.pem']);
  assert.notEqual(fs.readFileSync(path.join(fresh, 'public-key.pem'), 'utf8'), fs.readFileSync(path.join(received, 'public-key.pem'), 'utf8'));
  for (const [label, folder] of [['received', received], ['fresh', fresh]]) {
    for (const [name, signatureOk, status] of [['manifest.json', true, 'valid'], ['manifest.tampered.json', false, 'invalid']]) {
      const pkg = packageAt(folder, name);
      const manifest = JSON.parse(pkg.manifestText);
      assert.match(manifest.aura_uid, /^aura:v1:[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
      const py = spawnSync(python, ['-c',
        'import sys,json; m=json.load(sys.stdin); m.pop("signature"); print(json.dumps(m,sort_keys=True,separators=(",",":"),ensure_ascii=False),end="")'],
        { input: pkg.manifestText, encoding: 'utf8' });
      assert.equal(py.status, 0, py.stderr);
      const unsigned = Object.fromEntries(Object.entries(manifest).filter(([key]) => key !== 'signature'));
      assert.equal(canonicalize(unsigned), py.stdout, 'S02 bounded Python/JCS preimage');
      await check('s02/' + label + '/' + name, pkg, 'pass',
        { status, signatureOk, integrityStatus: 'verified', issuerKeyPinOk: true });
    }
  }
  fs.cpSync(fresh, path.join(output, 's02-fresh'), { recursive: true });
} finally { fs.rmSync(fresh, { recursive: true, force: true }); }

const report = {
  runtime: process.version, verifier_version: lock.version, verifier_commit: lock.commit,
  source_files_checked: Object.keys(lock.files).length,
  historical_checksum_files_checked: checksums.length,
  fixed_vectors: bundle.vectors.length, matrix_rows: new Set(bundle.vectors.map(v => v.row)).size,
  quickstart_cases: 1, s02_s01_cases: 4, reference_path_runs: results.length * engines.length,
  limitations: [
    'Reference paths share implementation code; WebCrypto runs in Node, not a browser.',
    'Python signing/serialization covers these fixture values, not general JCS.',
    'T02/T03 timestamps are not exercised here; P05/P06 remain partial reporting checks.',
    'No archive resolution, registry authenticity/freshness, legal effect or external organizational review is established.',
  ],
  failures, results,
};
fs.writeFileSync(path.join(output, 'current-reference-results.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ verifier: lock.version, fixed_vectors: bundle.vectors.length,
  reference_path_runs: report.reference_path_runs, failures }));
if (failures.length) process.exitCode = 1;
