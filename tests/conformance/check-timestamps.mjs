// Map the pinned reference implementation's RFC 3161 checks to T02/T03.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const standard = path.resolve(here, '../..');
const output = path.resolve(process.env.AURA_RESULTS_DIR || path.join(here, 'run-results'));
const historical = path.join(here, '2026-11-03');
assert.ok(output !== historical && !output.startsWith(historical + path.sep),
  'Keep new results outside the historical dossier.');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const lock = readJson(path.join(here, 'verifier-v1.2.2.lock.json'));
const verifier = process.env.AURA_VERIFIER_DIR && path.resolve(process.env.AURA_VERIFIER_DIR);
const report = {
  checked_at: new Date().toISOString(), runtime: process.version,
  verifier_version: lock.version, verifier_commit: lock.commit,
  runner_sha256: sha256(fs.readFileSync(fileURLToPath(import.meta.url))),
  lock_sha256: sha256(fs.readFileSync(path.join(here, 'verifier-v1.2.2.lock.json'))),
  source_files_checked: 0, fixture_sha256: {}, commands: [], cases: [], failures: [],
  limitations: [
    'Node CLI and OpenSSL 3.x only; this is a reference-implementation replay, not a second independent implementation.',
    'The preserved FreeTSA response is verified locally; no new timestamp or private issuer key is requested.',
    'Trust is relative to the supplied CA. Anchor authenticity, TSA-policy acceptability, revocation, long-term validation and qualified eIDAS status are not established.',
    'Certificate validation uses the current system time. Expiry is a failure, not a skipped test.',
    'The synthetic upstream suite tests TSA binding with a placeholder signature; the mapped T02/T03 cases below use complete signed AURA packages.',
    'This recipe hashes the complete signed manifest in JCS with SHA-256; it does not define prior_evidence or every possible timestamp profile.',
  ],
};
const portable = text => {
  let result = String(text);
  for (const [from, to] of [[verifier, '$VERIFIER'], [standard, '$STANDARD'],
    [process.execPath, 'node'], [os.tmpdir(), '$TMP'], [os.homedir(), '$USER_HOME']])
    if (from) result = result.replaceAll(from, to);
  return result;
};
function checkFiles(folder, files) {
  for (const [file, expected] of Object.entries(files)) {
    const actual = sha256(fs.readFileSync(path.join(folder, file)));
    assert.equal(actual, expected, 'Pinned input differs: ' + file);
  }
}
function run(command, args, expectedExit = 0) {
  const result = spawnSync(command, args, {
    cwd: verifier, encoding: 'utf8', timeout: 120000, maxBuffer: 4 * 1024 * 1024,
  });
  report.commands.push({ command: portable(command), args: args.map(portable),
    expected_exit: expectedExit, exit_code: result.status,
    stdout: portable(result.stdout || ''), stderr: portable(result.stderr || ''),
    error: result.error ? portable(result.error.message) : null });
  assert.equal(result.status, expectedExit, portable(result.stderr || result.error?.message || result.stdout));
  return result.stdout;
}
function corePass(result, expectedPin) {
  assert.equal(result.schemaValidation.status, 'pass');
  assert.equal(result.signatureOk, true);
  assert.equal(result.integrityStatus, 'verified');
  assert.equal(result.issuerKeyPinOk, expectedPin);
  assert.equal(result.issuerKeyOk, true);
}
try {
  assert.ok(verifier, 'Set AURA_VERIFIER_DIR to the pinned v1.2.2 checkout.');
  checkFiles(verifier, lock.files);
  report.source_files_checked = Object.keys(lock.files).length;
  const standardLock = readJson(path.join(historical, 'source-lock.json'));
  checkFiles(standard, standardLock.standard_files);
  report.openssl = run('openssl', ['version']).trim();
  assert.match(report.openssl, /^OpenSSL 3\./, 'OpenSSL 3.x must be available as openssl on PATH (not LibreSSL).');
  report.openssl_configuration = process.env.OPENSSL_CONF ? portable(process.env.OPENSSL_CONF) : 'system default';

  // Run the existing suites unchanged, including trust, nonce and corrupt-token negatives.
  for (const suite of ['tests/test-timestamp-rfc3161.js', 'tests/test-timestamp-public.js'])
    run(process.execPath, [path.join(verifier, suite)]);

  const tsa = path.join(verifier, 'examples/rfc3161-freetsa');
  const quickstart = path.join(standard, 'examples/quickstart-v1.1');
  for (const [label, folder, names] of [
    ['freetsa', tsa, ['manifest.json', 'public-key.pem', 'issuer.json', 'asset.txt',
      'manifest.canonical.json', 'manifest.tsr', 'manifest.tsq', 'cacert.pem', 'tsa.crt']],
    ['quickstart', quickstart, ['manifest.json', 'public-key.pem', 'issuer.json', 'asset.txt']],
  ]) for (const name of names) report.fixture_sha256[label + '/' + name] = sha256(fs.readFileSync(path.join(folder, name)));
  const { canonicalSignedManifestDigest } = await import(pathToFileURL(path.join(verifier, 'src/manifest-digest.js')));
  const digest = folder => canonicalSignedManifestDigest(fs.readFileSync(path.join(folder, 'manifest.json'), 'utf8')).sha256;
  const tsaDigest = digest(tsa), targetDigest = digest(quickstart);
  assert.equal(tsaDigest, readJson(path.join(tsa, 'expected.json')).timestampImprintSha256);
  assert.notEqual(targetDigest, tsaDigest, 'T03 requires two different complete signed-manifest digests.');
  const timestampArgs = ['--timestamp-response', path.join(tsa, 'manifest.tsr'),
    '--timestamp-query', path.join(tsa, 'manifest.tsq'), '--tsa-ca', path.join(tsa, 'cacert.pem'),
    '--tsa-untrusted', path.join(tsa, 'tsa.crt')];
  const cli = (folder, withTimestamp, exit) => JSON.parse(run(process.execPath,
    [path.join(verifier, 'bin/aura.js'), 'verify', '--manifest', path.join(folder, 'manifest.json'),
      '--public-key', path.join(folder, 'public-key.pem'), '--issuer', path.join(folder, 'issuer.json'),
      '--asset', path.join(folder, 'asset.txt'), ...(withTimestamp ? timestampArgs : []), '--json'], exit));

  // Positive control: the same token, original request and trust material are valid together.
  const positive = cli(tsa, true, 0);
  corePass(positive, null); // The preserved FreeTSA package is v1.0, without a v1.1 anchor.
  assert.equal(positive.status, 'valid');
  assert.equal(positive.timestamp.status, 'verified');
  assert.equal(positive.timestamp.timestampImprintSha256, tsaDigest);
  assert.equal(positive.timestamp.nonceCheck, 'passed_against_supplied_request');
  assert.equal(positive.timestamp.trustBasis, 'supplied_ca_file');
  assert.equal(positive.timestamp.qualifiedEidas, 'not_assessed');
  assert.equal(positive.auraTimestampedChecks, 'technical_checks_passed');
  report.cases.push({ id: 'T02-valid-detached-token', row: 'T02', manifest_version: '1.0', status: 'passed',
    matrix_result: { independentTimestamp: 'pass' }, observed: positive });

  // Establish that the target package is valid before attaching the unrelated token.
  const baseline = cli(quickstart, false, 0);
  corePass(baseline, true);
  assert.equal(baseline.status, 'valid');
  assert.equal(baseline.timestamp.status, 'not_provided');
  assert.equal(baseline.auraTimestampedChecks, 'not_established');
  report.cases.push({ id: 'T03-target-without-token', row: 'T03', manifest_version: '1.1', role: 'control',
    status: 'passed', observed: baseline });

  const negative = cli(quickstart, true, 2);
  corePass(negative, true);
  assert.equal(negative.status, 'invalid');
  assert.equal(negative.timestamp.status, 'invalid');
  assert.equal(negative.timestamp.timestampImprintSha256, targetDigest);
  assert.match(negative.timestamp.error, /message imprint mismatch/i);
  assert.equal(negative.auraTimestampedChecks, 'not_established');
  report.cases.push({ id: 'T03-valid-signature-wrong-token', row: 'T03', manifest_version: '1.1', status: 'passed',
    matrix_result: { timestampBinding: 'fail' }, token_imprint_sha256: tsaDigest,
    target_imprint_sha256: targetDigest, observed: negative });
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.failures.push(portable(error.message));
  process.exitCode = 1;
}
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'timestamp-results.json'), portable(JSON.stringify(report, null, 2)) + '\n');
console.log(JSON.stringify({ status: report.status, mapped_cases: report.cases.length,
  matrix_rows: [...new Set(report.cases.filter(c => c.matrix_result).map(c => c.row))], failures: report.failures }));
