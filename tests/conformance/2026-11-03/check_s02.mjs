// Replay received fixtures, run the supplied signer with a fresh key, then verify.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { evidenceRoot, verifierModule, resultFile } from './source-paths.mjs';

const { verifyAuraPackage } = await import(verifierModule('src/verify-node.js'));
const { verifyAuraPackageBrowser } = await import(verifierModule('src/verify-web.js'));
const { canonicalize } = await import(verifierModule('src/jcs.js'));
const received = path.join(evidenceRoot, 's02/received');
const checks = JSON.parse(fs.readFileSync(path.join(evidenceRoot, 's02/received-checks.json')));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
for (const file of checks.files) assert.equal(hash(fs.readFileSync(path.join(received, file.name))), file.sha256, file.name);
const fresh = path.dirname(resultFile('s02-regenerated/placeholder'));
fs.mkdirSync(fresh, { recursive: true });
const standard = path.resolve(evidenceRoot, '../../..');
const python = process.env.AURA_PYTHON || 'python3';
const run = spawnSync(python, [path.join(received, 's02_sign.py'), fresh, path.join(standard, 'examples/quickstart-v1.1')], { encoding: 'utf8' });
if (run.status !== 0) throw new Error('Supplied signer failed: ' + run.stderr);
assert.notEqual(fs.readFileSync(path.join(fresh, 'public-key.pem'), 'utf8'), fs.readFileSync(path.join(received, 'public-key.pem'), 'utf8'));
assert.deepEqual(fs.readdirSync(fresh).sort(), ['asset.txt', 'issuer.json', 'manifest.json', 'manifest.tampered.json', 'public-key.pem']);

const out = {
  runtime: process.version,
  verifier_commit: 'e1fa13c4fb253c2e07a99538524b869028bb62b4',
  received_archive_sha256: checks.archive_sha256,
  recorded_claim: 'Supplied README names v1.2.1-2-gd05c3de and Node 22.23.4; that earlier execution is not independently observed here.',
  scope: 'Received and freshly generated S02/S01 fixtures. Two reference paths share code; browser path runs in Node. No external organizational validation or general JCS implementation is established.',
  fresh_key_differs: true,
  results: [],
};
for (const [label, folder] of [['received', received], ['regenerated', fresh]]) {
  for (const [id, name, signature, status] of [['S02', 'manifest.json', true, 'valid'], ['S01', 'manifest.tampered.json', false, 'invalid']]) {
    const manifestText = fs.readFileSync(path.join(folder, name), 'utf8');
    const manifest = JSON.parse(manifestText);
    const unsigned = Object.fromEntries(Object.entries(manifest).filter(([key]) => key !== 'signature'));
    const py = spawnSync(python, ['-c', 'import sys,json; m=json.load(open(sys.argv[1])); m.pop("signature"); print(json.dumps(m,sort_keys=True,separators=(",",":"),ensure_ascii=False),end="")', path.join(folder, name)], { encoding: 'utf8' });
    assert.equal(py.status, 0);
    assert.equal(canonicalize(unsigned), py.stdout, label + '/' + id + ': bounded Python preimage equals reference JCS');
    assert.match(manifest.aura_uid, /^aura:v1:[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    const pkg = { manifestText,
      publicKeyPem: fs.readFileSync(path.join(folder, 'public-key.pem'), 'utf8'),
      issuerText: fs.readFileSync(path.join(folder, 'issuer.json'), 'utf8'),
      assetBytes: fs.readFileSync(path.join(folder, 'asset.txt')) };
    const item = { package: label, row: id, manifest_sha256: hash(manifestText), canonical_unsigned_sha256: hash(py.stdout), canonical_preimage_matches: true, engines: {} };
    for (const [engine, verify] of [['node', verifyAuraPackage], ['webcrypto_in_node', verifyAuraPackageBrowser]]) {
      const r = await verify(pkg);
      assert.equal(r.status, status, label + '/' + id + '/' + engine);
      assert.equal(r.schemaValidation.status, 'pass');
      assert.equal(r.signatureOk, signature);
      assert.equal(r.integrityStatus, 'verified');
      assert.equal(r.issuerKeyOk, true);
      assert.equal(r.issuerKeyPinOk, true);
      item.engines[engine] = r;
    }
    out.results.push(item);
  }
}
out.passed = true;
fs.writeFileSync(resultFile('s02-results.json'), JSON.stringify(out, null, 2)+'\n');
console.log(JSON.stringify({ packages: 2, cases: out.results.length, reference_path_runs: out.results.length*2, fresh_key_differs: true, passed: true }));
