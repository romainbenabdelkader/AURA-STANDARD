# AURA Conformance

This document defines draft conformance levels for implementations claiming compatibility with AURA.

Conformance levels are cumulative unless explicitly stated otherwise.

## AURA-Minimal

An implementation is AURA-Minimal conformant if it can:

- parse an AURA manifest
- identify `aura_id`
- identify `issuer_id`
- identify `issued_at`
- identify `origin.type`
- identify `asset.hash`
- identify `rights.tdm_opt_out`
- distinguish technical proof claims from legal claims

AURA-Minimal does not require cryptographic verification.

## AURA-Integrity

An implementation is AURA-Integrity conformant if it satisfies AURA-Minimal and can:

- compute the declared asset hash
- compare the computed hash with `asset.hash`
- report `VALID` only when the asset hash matches
- report `INVALID` when the asset hash does not match

## AURA-Signed

An implementation is AURA-Signed conformant if it satisfies AURA-Integrity and can:

- canonicalize the unsigned manifest
- verify an Ed25519 signature
- report signature mismatch separately from file hash mismatch
- refuse manifests with unsupported signature algorithms

## AURA-Timestamped

An implementation is AURA-Timestamped conformant if it satisfies AURA-Signed and can:

- parse trusted timestamp fields when present
- verify the timestamp binding to the manifest hash when supported
- distinguish declared timestamps from third-party trusted timestamps

Trusted timestamping is optional in AURA v0.1.

## AURA-Registry-Verified

An implementation is AURA-Registry-Verified conformant if it satisfies AURA-Signed and can:

- resolve `issuer_id` through a Trusted Public Keys Registry (TPKR)
- reject revoked issuer keys
- reject unknown issuer keys where registry verification is required
- support key rotation metadata

## AURA-Institutional

An implementation is AURA-Institutional conformant if it satisfies AURA-Registry-Verified and can:

- distinguish issuer authority levels
- expose registry provenance
- produce audit logs for verification events without monitoring asset usage
- document privacy and data-minimization measures

## Non-Conformant Claims

An implementation MUST NOT claim AURA conformance if it presents AURA as:

- DRM
- watermarking
- fingerprinting
- content recognition
- usage monitoring
- automated enforcement
- automated legal decision-making
- a system requiring a proprietary vendor, AI service, repository host, software assistant or platform to create, verify, implement or audit AURA manifests

## Compatibility Labels

Suggested public labels:

- `AURA-compatible`
- `AURA-Minimal`
- `AURA-Integrity`
- `AURA-Signed`
- `AURA-Timestamped`
- `AURA-Registry-Verified`
- `AURA-Institutional`

If an implementation modifies core semantics, it SHOULD describe itself as `AURA-derived`, not `AURA-compatible`.
