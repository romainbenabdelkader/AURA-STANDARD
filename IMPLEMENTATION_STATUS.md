# Implementation status and registry profile

Documentation preparation, 2026-11-01. This note does not change the frozen
manifest schemas, historical examples, conformance levels or archived releases.

## Keep these coordinates separate

- Standard archive v1.2.1: https://doi.org/10.5281/zenodo.22071523
- Manifest schemas: 1.0 and 1.1 (schema files v1.0.0 and v1.1.0).
- Historical verifier archive v1.1.0: https://doi.org/10.5281/zenodo.22069698
- Verifier source v1.2.0: preparation; source metadata is not a release or DOI.

Historical manifest anchors refer to their original artifacts. Do not rewrite a
signed anchor to point to new code. Record the actually executed verifier commit
and test report separately. A passing package is not certification of its issuer
or of every behavior of the implementation that created it.

## Current local issuer.json profile

TPKR.md describes a conceptual registry model. It is not directly the JSON input
contract of AURA-VERIFIER. That implementation accepts one caller-supplied issuer
snapshot with these fields:

- public_key_fingerprint_sha256 and public_key_fingerprint_sha3_256: both digests
  of the provided public key's DER/SPKI bytes; both must match.
- status: active for a warning-free current record. A matching record marked
  revoked is refused by the pending follow-up. Other non-active states warn.
- revoked_keys: optional array of key records. A matching SHA-256 OR SHA3-256
  fingerprint is a hard failure, independent of the declared issuance date.
- issuer: optional issuer identifier (issuer_id also recognized by the pending
  consistency checks). Present identifiers must agree with the signed metadata.
- key_id: informational current-key label. It is not a substitute for fingerprint
  verification and may differ from an old key's label after rotation.

The public key is supplied separately; a signed embedded key, when present, must
match it. Copying TPKR's illustrative public_key field into issuer.json is not an
implemented resolver or an interoperability test. No remote registry is required
when the key and snapshot are supplied locally.

Snapshot authenticity and freshness are not established by these checks. The
pending keyStatusCheck/registryTrust report fields expose that boundary. A false
legacy keyRevoked flag without a supplied registry is not evidence of current
non-revocation. An unknown issuer identity is not a failed mathematical signature.

## Pending local verifier policy

Duplicate names in raw manifest/registry JSON are rejected, recognized asset-hash
aliases must agree, and missing asset bytes are never reported as verified.
Null legacy hash aliases remain absence of a hash. Declared dates receive syntax,
calendar and offset checks independently of the base-schema result. Leap-second
validity is explicitly unassessed. Present issuer identifiers and signed key
labels must agree. These are documented local acceptance policies, not a new
normative schema or a guarantee that a declared date or identity is true.

## Publication and review

A reviewed release must identify an exact source commit, archive and checksum.
Preserve old archives. Publish a version-specific DOI only when that version
exists. Browser/platform tests and maintainer tests do not replace an independent
review. No claim of institutional standardization follows from this preparation.
