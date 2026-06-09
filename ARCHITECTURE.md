# Ecosystem Architecture

This project belongs to a layered, intentionally separated ecosystem. Each
layer is independent and can be adopted on its own.

## The three layers

1. **AURA** — the open, neutral *evidentiary standard*. It defines how to
   produce and verify technical proof of origin and integrity of a digital
   asset (AURA-ID, signed JSON-LD manifest, SHA3-256 hashing, Ed25519
   signatures, TPKR). AURA is non-capturable and depends on no other layer.

2. **UID_AUTH** — a sovereign, verifiable *identifier* for creative works. It
   links a work to an origin declaration, timestamp, integrity hash and
   machine-readable AI / TDM rights signals. It may use AURA-compatible
   concepts.

3. **AUTHENTICA** — an *application profile* (and its maintaining entity) for
   *declaring rights*: rights reservation, AI-training restrictions and TDM
   opt-out signals on top of identified works.

## Independence rules (binding)

- AURA does not depend on UID_AUTH or AUTHENTICA.
- UID_AUTH and AUTHENTICA may use AURA-compatible concepts, but neither
  controls AURA.
- None of these layers performs DRM, watermarking, fingerprinting,
  surveillance or automated legal decisions. They provide verifiable technical
  artifacts only; legal qualification is for courts, regulators and competent
  authorities.

## Which repository is which

| Layer | Repository | Role |
|-------|------------|------|
| AURA | `AURA-STANDARD` | The evidentiary standard (spec, schema, test vectors) |
| AURA | `aura-core` | Reference primitives (Python) |
| AURA | `aura-cli` | Proof demonstrator (Python) |
| UID_AUTH | `uid-auth` | The sovereign identifier standard |
| AUTHENTICA | `authentica-ai-rights` | The AI rights & origin manifest profile |
