import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const evidenceRoot = fileURLToPath(new URL('.', import.meta.url));
const lock = JSON.parse(fs.readFileSync(new URL('source-lock.json', import.meta.url)));
if (!process.env.AURA_VERIFIER_DIR) throw new Error('Set AURA_VERIFIER_DIR to a local checkout of AURA-VERIFIER v1.2.1.');
export const verifierRoot = path.resolve(process.env.AURA_VERIFIER_DIR);
for (const [name, expected] of Object.entries(lock.verifier_files)) {
  const actual = createHash('sha256').update(fs.readFileSync(path.join(verifierRoot, name))).digest('hex');
  if (actual !== expected) throw new Error('Pinned verifier file differs: ' + name);
}
export const verifierModule = name => pathToFileURL(path.join(verifierRoot, name)).href;
export function resultFile(name) {
  const dir = process.env.AURA_RESULTS_DIR || path.join(evidenceRoot, 'run-results');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, name);
}
