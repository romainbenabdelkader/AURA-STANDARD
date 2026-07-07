# AURA Manifest Schemas

Canonical JSON Schemas for the AURA manifest. A conformant issuer emits
manifests that validate against these; an independent verifier (AURA-VERIFIER)
uses them to check structure.

## Versions

| File | Status | Notes |
|------|--------|-------|
| `aura-manifest-v1.0.0.json` | **Canonical — FROZEN** | The real emitted shape: `aura_version: "1.0"`, ULID `aura_uid`, `issuer` object, Ed25519 + RFC-8785-JCS signature. No field is ever removed or repurposed. |
| `aura-manifest-v1.1.0.json` | **Current evolution** | `v1.0.0` **plus** a mandatory `reference_anchor` (in the signed payload) and an optional `prior_evidence` backward chain. |
| `reference-anchor.template.json` | Template | Placeholder scaffold for the v1.1 `reference_anchor`. Not a valid emitted fragment. |
| `aura_manifest_v0.1.schema.json` | **Legacy — superseded** | Earlier draft using `origin_proof_version: "0.1"`. Kept for historical reference only; **not** the canonical schema. |

## Rules

- **v1.0 is frozen.** Evolution is additive and explicitly versioned (v1.1, v1.2, …); v1.0 is never modified silently.
- A **verifier MUST accept both v1.0 and v1.1** manifests.
- `reference_anchor` (v1.1) is part of the **signed payload** — an unsigned anchor proves nothing.
- **Revocation / lifecycle** data is **never** part of the signed manifest; it is carried out of band.
- Emitted proofs contain **no placeholder values**: if a real value (digest, DOI, commit) is unavailable, emission fails.

## Digests

Anchor digests are `sha3-256:` followed by 64 lowercase hex characters, computed
over the exact published artifact (schema file, verifier source archive, issuer
public-key PEM).
