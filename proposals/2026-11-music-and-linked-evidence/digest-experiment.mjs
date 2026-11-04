// Non-normative experiment. No input evidence is written or re-signed.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const verifierCommit = '6b1a631a9febdd724cfa819c67ec9d285179c27c';
const standardCommit = '2ef46b04aae922eeb576606fa9b2ccb8c802a28a';
assert.ok(process.argv[2], 'Pass a local AURA-VERIFIER checkout at the pinned release commit.');
const verifier = path.resolve(process.argv[2]);
const root = fileURLToPath(new URL('../../', import.meta.url));
const git = (cwd, args) => execFileSync('git', ['-C', cwd, ...args]);
assert.equal(git(verifier, ['rev-parse', 'HEAD']).toString().trim(), verifierCommit);
for (const rel of ['src/manifest-digest.js', 'src/jcs.js', 'src/strict-json.js', 'src/sha3.js', 'package.json']) {
  assert.deepEqual(fs.readFileSync(path.join(verifier, rel)), git(verifier, ['show', `${verifierCommit}:${rel}`]), rel);
}
const { canonicalSignedManifestDigest } = await import(pathToFileURL(path.join(verifier, 'src/manifest-digest.js')));
const { canonicalize, unsignedManifest } = await import(pathToFileURL(path.join(verifier, 'src/jcs.js')));
const { parseUniqueJson } = await import(pathToFileURL(path.join(verifier, 'src/strict-json.js')));
const sourcePath = 'examples/quickstart-v1.1/superseded/2026-08-23/manifest.json';
const referringPath = 'examples/quickstart-v1.1/manifest.json';
for (const rel of [sourcePath, referringPath]) {
  assert.deepEqual(fs.readFileSync(path.join(root, rel)), git(root, ['show', `${standardCommit}:${rel}`]), rel);
}
const original = fs.readFileSync(path.join(root, sourcePath));
const originalText = new TextDecoder('utf-8', { fatal: true }).decode(original);
const manifest = parseUniqueJson(originalText);
const referring = parseUniqueJson(fs.readFileSync(path.join(root, referringPath), 'utf8'));
const hash = (bytes, algorithm = 'sha3-256') => crypto.createHash(algorithm).update(bytes).digest('hex');
assert.equal(referring.prior_evidence[0].manifest_hash, 'sha3-256:' + hash(original));
assert.equal(referring.prior_evidence[0].aura_uid, manifest.aura_uid);
const variants = [
  ['original_file', original],
  ['compact_json', Buffer.from(JSON.stringify(manifest), 'utf8')],
  ['reordered_pretty_json', Buffer.from(JSON.stringify(Object.fromEntries(Object.entries(manifest).reverse()), null, 4) + '\n', 'utf8')],
  ['crlf_json', Buffer.from(originalText.replace(/\r?\n/g, '\r\n'), 'utf8')],
  ['utf8_bom_json', Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), original])],
];
const results = variants.map(([name, bytes]) => {
  // Preserve the marker during decoding, then explicitly remove at most one
  // for parsing. The original bytes above remain the file-hash input.
  const decoded = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
  const text = decoded.startsWith('\ufeff') ? decoded.slice(1) : decoded;
  const digests = canonicalSignedManifestDigest(text);
  const canonicalBytes = Buffer.from(canonicalize(parseUniqueJson(text)), 'utf8');
  assert.equal(digests.sha3_256, 'sha3-256:' + hash(canonicalBytes));
  assert.equal(digests.sha256, hash(canonicalBytes, 'sha256'));
  return { name, byte_length: bytes.length, file_sha3_256: 'sha3-256:' + hash(bytes), canonical_signed_sha3_256: digests.sha3_256, canonical_signed_sha256: digests.sha256 };
});
assert.equal(new Set(results.map(x => x.file_sha3_256)).size, variants.length);
assert.equal(new Set(results.map(x => x.canonical_signed_sha3_256)).size, 1);
assert.notEqual(results[0].file_sha3_256, results[0].canonical_signed_sha3_256);
const unsignedHash = 'sha3-256:' + hash(Buffer.from(canonicalize(unsignedManifest(manifest)), 'utf8'));
assert.notEqual(unsignedHash, results[0].canonical_signed_sha3_256);
const changedSignature = structuredClone(manifest);
changedSignature.signature.value = (changedSignature.signature.value[0] === 'A' ? 'B' : 'A') + changedSignature.signature.value.slice(1);
const changedSignatureHash = canonicalSignedManifestDigest(JSON.stringify(changedSignature)).sha3_256;
assert.notEqual(changedSignatureHash, results[0].canonical_signed_sha3_256);
assert.throws(() => parseUniqueJson('{"name":1,"\\u006eame":2}'), /Duplicate JSON property/);
// Text-loading observations, not a new verifier input policy.
const bomBytes = variants.find(([name]) => name === 'utf8_bom_json')[1];
assert.throws(() => parseUniqueJson(bomBytes.toString('utf8')), SyntaxError);
assert.deepEqual(parseUniqueJson(await new Blob([bomBytes]).text()), manifest);
const invalidUtf8 = Buffer.concat([Buffer.from('{"note":"'), Buffer.from([0xff]), Buffer.from('"}')]);
const replacementUtf8 = Buffer.from('{"note":"\ufffd"}', 'utf8');
assert.notDeepEqual(invalidUtf8, replacementUtf8);
assert.equal(await new Blob([invalidUtf8]).text(), await new Blob([replacementUtf8]).text());
assert.throws(() => new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(invalidUtf8), TypeError);
const doubleBom = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), bomBytes]);
const decodedDoubleBom = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(doubleBom);
assert.throws(() => parseUniqueJson(decodedDoubleBom.slice(1)), SyntaxError);
const report = {
  kind: 'non_normative_hash_input_experiment', standard_commit: standardCommit,
  verifier_commit: verifierCommit, source_path: sourcePath, referring_path: referringPath,
  variants: results, unsigned_payload_sha3_256: unsignedHash,
  changed_signature_canonical_sha3_256: changedSignatureHash,
  escaped_duplicate_property_rejected: true,
  input_conversion_observations: {
    bom_retained_by_buffer_text_and_rejected_by_released_parser: true,
    bom_removed_by_blob_text: true,
    distinct_byte_inputs_can_have_identical_blob_text: true,
    invalid_utf8_rejected_by_fatal_decoder: true,
    second_bom_rejected_after_removing_one: true,
  },
  limits: 'Uses the released canonicalizer; does not implement proposed extension validation, verify target signatures, or establish issuer trust or historical validity.',
};
if (process.argv[3] !== '--print') {
  const expected = JSON.parse(fs.readFileSync(new URL('./expected-digests.json', import.meta.url), 'utf8'));
  assert.deepEqual(report, expected, 'Hash-input experiment differs from the recorded values.');
}
process.stdout.write(JSON.stringify(report, null, 2) + '\n');
