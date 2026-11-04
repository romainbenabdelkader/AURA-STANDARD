# S02 / S01 — independent signing test (2026-11-03)

Signer: independent Python script (`s02_sign.py`, `cryptography` library), not AURA code.
Verifier: AURA-VERIFIER at tag v1.2.1-2-gd05c3de, Node 22.23.4, local files only.

- `manifest.json`: new v1.1 manifest, fresh test-only Ed25519 key (private key never written to disk),
  JCS preimage = manifest without top-level `signature`. UID first character in 0-7 (canonical ULID range, C-01).
  Result: VALID (signature OK, integrity verified, key pin OK).
- `manifest.tampered.json`: same manifest, `declarations.origin` changed without re-signing.
  Result: INVALID (Signature: FAIL, integrity still verified, reported separately).

Limit: JCS is produced with Python `json.dumps(sort_keys=True, separators=(',',':'), ensure_ascii=False)`.
This matches RFC 8785 for this data (no floats, ASCII keys) but is not a general JCS implementation.
`reference_anchor.standard` / `.verifier` are copied from the quickstart; only `issuer_key` is new.
Test-only material: not a trust anchor, no person, no rights.
