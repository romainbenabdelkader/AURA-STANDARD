import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = new URL('./', import.meta.url);
const digest = (data, algorithm = 'sha3-256') => crypto.createHash(algorithm).update(data).digest('hex');
const read = path => fs.readFileSync(new URL(path, root));
for (const prefix of ['', 'superseded/2026-08-23/']) {
  let algorithm;
  for (const line of read(prefix + 'CHECKSUMS.txt').toString().split('\n')) {
    if (line.startsWith('# ')) { algorithm = line.includes('SHA3') ? 'sha3-256' : 'sha256'; continue; }
    if (!line.trim()) continue;
    const [expected, filename] = line.split(/\s+/);
    assert.equal(digest(read(prefix + filename), algorithm), expected, prefix + filename);
  }
}
const manifest = JSON.parse(read('manifest.json'));
assert.equal(manifest.prior_evidence[0].manifest_hash,
  'sha3-256:' + digest(read('superseded/2026-08-23/manifest.json')));
assert.notEqual(manifest.aura_uid, JSON.parse(read('superseded/2026-08-23/manifest.json')).aura_uid);
if (process.argv[2]) {
  const zip = fs.readFileSync(process.argv[2]);
  assert.equal('sha3-256:' + digest(zip), manifest.reference_anchor.verifier.source_digest);
  console.log('Archive ZIP digest matches signed reference.');
}
console.log('Current and superseded checksums and evidence chain verified.');
