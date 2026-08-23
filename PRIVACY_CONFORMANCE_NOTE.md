# Privacy And Offline Verification Conformance Note

Status: Non-normative implementation note for AURA v1.1.1.

The normative requirements remain in `CONFORMANCE.md`, `PRIVACY.md`, `TPKR.md`,
the published schemas and the applicable proof profiles. This note summarizes how
those requirements can be evaluated without changing the AURA manifest format.

## Verifiable Properties

When the asset where applicable, manifest, public key and required trust material
are supplied locally, AURA cryptographic verification can be completed without:

- a platform account;
- a remote manifest, key or registry resolver;
- an analytics or telemetry service;
- a central record of the verification event;
- publication of a natural person's civil identity.

A conformant verifier must evaluate the supplied bytes, canonical signed payload,
signature and applicable trust material. Optional remote loading is a convenience
feature, not a prerequisite for cryptographic verification.

The independent verifier test suite exercises both its Node and browser engines
with network access blocked. It also checks rejection of modified signed content
and modified asset bytes.

## Identity And Trust Boundaries

A valid signature proves that the supplied private key signed the canonical
manifest. It does not, by itself, prove civil identity, legal authority,
authorship, ownership or the truth of a declaration.

TPKR material can associate a key with an issuer identifier and key status. That
identifier may be institutional, pseudonymous, scoped or role-based. Publishing a
natural person's civil identity cannot be required merely to obtain AURA
cryptographic validity or core conformance.

## Linkability And Continuity

Stable issuer identifiers, signing keys, key fingerprints, evidence identifiers,
asset hashes and prior-evidence links can improve continuity, accountability and
institutional attribution. The same stability can allow correlation across
manifests or with external data.

Scoped or rotated identifiers and keys may reduce direct linkability in a
privacy-sensitive deployment. They can also reduce evidentiary continuity and
complicate historical trust evaluation. A deployment should document which
property it prioritizes and why.

## Limits

Local verification cannot guarantee anonymity. Rare metadata, small user groups,
repeated timing patterns and external datasets can still narrow an anonymity set.

An offline result that uses a local registry or revocation snapshot reflects the
freshness of that snapshot. A current status check may require separately updated
trust material, but it is not part of the cryptographic signature check itself.

An implementation may maintain operational or security logs for a separately
justified purpose. Those logs are not required by AURA and do not become AURA
evidence merely because the implementation also verifies AURA manifests.

AURA currently has no independent enforcement body. Public requirements and tests
make conformance claims reviewable, but they cannot prevent a non-conformant
deployment from adding identity, logging or gatekeeping systems outside AURA.
