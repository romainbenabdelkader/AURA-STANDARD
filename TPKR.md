# Trusted Public Keys Registry (TPKR)

The Trusted Public Keys Registry (TPKR) is the AURA registry profile for resolving issuer public keys.

TPKR does not decide legal ownership, copyright validity, infringement, liability or institutional legitimacy. It provides a verifiable technical mapping between issuer identifiers and public keys.

## Purpose

TPKR enables verifiers to:

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

Issuer identifiers MAY be institutional, role-based or pseudonymous. If a registry operator stores personal data, that operator is responsible for its own GDPR and privacy compliance obligations.

## Governance

TPKR governance is out of scope for AURA v0.1, but future versions SHOULD define:

- registry operator rules
- issuer onboarding
- audit process
- revocation procedure
- dispute procedure
- registry anchoring
- public transparency reports
