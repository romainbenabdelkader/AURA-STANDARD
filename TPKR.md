# Trusted Public Keys Registry (TPKR)

Status: conceptual registry model. This document does not describe a deployed
registry, an implemented remote resolver or the JSON input contract of
AURA-VERIFIER v1.2.2. Its implemented caller-supplied `issuer.json` snapshot is
documented in [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md#current-local-issuerjson-profile).

The Trusted Public Keys Registry (TPKR) model describes a possible AURA registry
for resolving issuer public keys.

TPKR does not decide legal ownership, copyright validity, infringement, liability or institutional legitimacy. The model concerns a technical mapping between issuer identifiers and public keys; authenticity and freshness require a separately established trust process.

## Purpose

The model is intended to enable verifiers to:

- resolve `issuer_id`
- retrieve issuer public keys
- check key status
- check revocation status
- check authority level metadata
- verify manifest signatures

## Minimal Registry Entry

```json
{
  "issuer_id": "AURA-TEST-ISSUER-001",
  "public_key": "A6EHv_POEL4dcN0Y50vAmWfk1jCbpQ1fHdyGZBJVMbg",
  "algorithm": "ed25519",
  "status": "active",
  "authority_level": "test",
  "registered_at": "2026-01-01T00:00:00Z",
  "revoked_at": null,
  "replaced_by": null
}
```

## Required Fields

- `issuer_id`
- `public_key`
- `algorithm`
- `status`
- `registered_at`

## Status Values

- `active`
- `revoked`
- `expired`
- `superseded`
- `suspended`

## Authority Levels

Draft authority levels:

- `test`
- `self_declared`
- `registered_platform`
- `certified_institution`
- `collective_management_organization`
- `public_authority`

Authority level is informative unless a verifier policy explicitly requires it.

## Revocation

The options below are conceptual policy choices, not a description of current
verifier behavior and not an override of [AURA conformance](CONFORMANCE.md).
AURA-VERIFIER v1.2.2 rejects a key matched as revoked in the supplied snapshot,
regardless of the manifest's declared date. Historical validity is not assessed.
A declared `issued_at` value alone does not establish that signing preceded
revocation or compromise; such an assessment needs independent evidence.

If a key is revoked, verifiers SHOULD reject manifests signed after `revoked_at`.

For manifests signed before `revoked_at`, verifier policy MAY choose to:

- accept the manifest
- require trusted timestamping
- mark the result as `VALID_WITH_REVOKED_KEY_AT_VERIFICATION_TIME`
- reject the manifest

The policy MUST be explicit.

## Key Rotation

Issuer key rotation SHOULD use:

- `status: "superseded"`
- `replaced_by`
- new `registered_at`
- optional overlap period

## Privacy

TPKR does not require personal data.

Issuer identifiers MAY be institutional, role-based or pseudonymous. A public TPKR entry MUST NOT require publication of a natural person's civil identity as a condition of AURA conformance or cryptographic verification.

A registry operator MAY perform private identity or authority checks under a separately documented onboarding policy. Those checks are an external trust-assurance process, not part of AURA cryptographic validity, and MUST be distinguished from the technical mapping provided by TPKR.

If a registry operator stores personal data, that operator is responsible for its own GDPR and privacy compliance obligations.

## Governance

TPKR governance remains outside the core AURA v1.1 specification, but future versions SHOULD define:

- registry operator rules
- issuer onboarding
- audit process
- revocation procedure
- dispute procedure
- registry anchoring
- public transparency reports
