# AURA Conformance

This document defines conformance levels for implementations claiming compatibility with AURA v1.0 or v1.1. The published schemas remain the normative reference for manifest fields and structure.

Conformance levels are cumulative except where this document states that a capability is conditional on the evidence type.

## AURA-Minimal

An implementation is AURA-Minimal conformant if it can:

- parse a supported AURA v1.0 or v1.1 manifest
- identify `aura_uid`, issuer metadata, `issued_at` and signature metadata
- distinguish asset-backed evidence from a fileless signed catalogue declaration
- identify the declared asset hash when one is present
- identify profile-specific declarations without presenting them as independently proven facts
- distinguish technical verification results from legal conclusions

AURA-Minimal does not require cryptographic verification.

## AURA-Integrity

An implementation is AURA-Integrity conformant if it satisfies AURA-Minimal and, when an asset and its hash are part of the evidence, can:

- compute the asset hash using the declared supported algorithm
- compare the computed hash with the manifest's declared asset hash
- report a match only when the hashes are equal
- report a mismatch when the hashes are not equal

For a fileless signed catalogue declaration with no declared asset hash, asset integrity is not applicable and MUST NOT be reported as verified.

## AURA-Signed

An implementation is AURA-Signed conformant if it satisfies AURA-Minimal and can:

- canonicalize the unsigned manifest using the declared supported canonicalization
- verify an Ed25519 signature
- report signature mismatch separately from any asset-hash mismatch
- refuse manifests with unsupported signature algorithms

When an implementation also claims to verify asset integrity, it must satisfy AURA-Integrity for that evidence.

## AURA-Timestamped

An implementation is AURA-Timestamped conformant if it satisfies AURA-Signed and can:

- parse independent trusted timestamp evidence when present
- verify the timestamp binding to the manifest hash when the timestamp format is supported
- distinguish the issuer-declared `issued_at` value from independent trusted timestamp evidence

Independent trusted timestamp evidence is optional in AURA v1.0 and v1.1. The `issued_at` value alone MUST NOT be presented as an independently trusted timestamp.

## AURA-Registry-Verified

An implementation is AURA-Registry-Verified conformant if it satisfies AURA-Signed and can:

- evaluate the issuer key against supplied Trusted Public Keys Registry (TPKR) material
- reject revoked issuer keys
- reject unknown issuer keys where registry verification is required
- support key-rotation metadata
- expose the source and freshness of registry material when known

Registry material MAY be supplied as a local trusted snapshot or obtained through an optional remote resolution mechanism. AURA-Registry-Verified conformance does not require a network request or a particular registry host.

## AURA-Institutional

An implementation is AURA-Institutional conformant if it satisfies AURA-Registry-Verified and can:

- distinguish documented issuer authority levels
- expose registry provenance
- document privacy and data-minimization measures
- distinguish any independently required operational records from AURA verification results

## Optional TDM Rights-Reservation Profile

An implementation claiming support for
`AURA_TDM_RIGHTS_RESERVATION_V1` MUST:

- validate the manifest against both its canonical base schema and
  `schema/profiles/aura-tdm-rights-reservation-v1.0.json`
- require `declarations.tdm_opt_out` to be exactly the JSON boolean `true`
- verify the manifest signature and, when the asset is supplied, its SHA3-256
  binding
- report profile conformance separately from issuer authority, automated
  discoverability, receipt by a data collector and legal effect
- avoid interpreting an absent or non-conformant profile as permission, a
  licence, a waiver or absence of rights

Support for this optional profile does not alter the AURA-Minimal through
AURA-Institutional levels and does not require a central registry or network
request.

## Identity Separation

A natural person's civil identity MUST NOT be required as a condition of AURA cryptographic validity or core AURA conformance. An AURA profile MUST NOT require publication of a natural person's civil identity merely to claim AURA conformance.

An institution or profile MAY define separate identity or authority assurance for a particular operational context. That assurance MUST be distinguished from AURA cryptographic verification, and its absence MUST NOT cause an otherwise valid AURA signature to be reported as invalid.

## Verification-Event Privacy

AURA conformance MUST NOT require logging verification events.

A conformant implementation MUST NOT make creation of a record linking an identifiable verifier or user to the specific asset, manifest or evidence object being verified a condition of AURA verification.

This requirement does not prohibit an institution from maintaining logs for a separate lawful operational, cybersecurity or regulatory purpose. Such logging is outside AURA conformance, is not evidence of AURA conformance, and SHOULD be separately justified, disclosed and minimized.

When all evidence and trust material required for a cryptographic check is supplied locally, a conformant verifier MUST NOT require remote resolution, an account, analytics or telemetry to complete that check.

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
- a system requiring a particular remote resolver, registry host, analytics service or central platform when the required evidence and trust material is supplied locally

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
