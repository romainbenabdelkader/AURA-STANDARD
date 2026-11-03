# AURA specification and implementation architecture

This non-normative overview separates the published specification, the evidence
being checked and the software that performs a check. No application, identifier
vendor or hosted registry is a prerequisite for local AURA verification.

## Specification

`AURA-STANDARD` publishes manifest schemas, optional profiles, conformance
requirements and documentation. The current base schemas are v1.0.0 and v1.1.0;
standard release numbers and verifier release numbers are separate coordinates.
See [implementation status](IMPLEMENTATION_STATUS.md).

The schemas define `aura_uid` syntax. They do not provide a global identifier
allocation service or establish the uniqueness of a supplied value. The
[TPKR document](TPKR.md) is a conceptual registry model; the reference verifier's
implemented local registry input is documented separately.

## Evidence package

An issuer produces a signed manifest. Verification uses that manifest and a
public key, plus the asset bytes when checking an asset binding. Optional
materials include a local issuer-key snapshot and detached timestamp evidence.
They serve different purposes:

- A signature checks the signed statement against a supplied key.
- An asset hash checks the exact supplied bytes.
- A registry snapshot supplies key-status assertions whose source and freshness
  require separate assessment.
- A timestamp checks a time binding under an explicitly supported timestamp
  profile and caller-supplied trust material.

None of these checks establishes the truth of an origin declaration, civil
identity, rightsholder authority or ownership. Application-specific identifiers
and declarations may be carried as extensions; a signed extension is not
automatically a standardized or validated AURA profile.

## Implementations and applications

`AURA-VERIFIER` v1.2.2 implements local checks for manifests 1.0 and 1.1 through
Node and WebCrypto. Detached RFC 3161 verification uses Node and OpenSSL. Its
implementation policies and limits are documented in its
[pinned integrator guide](https://github.com/romainbenabdelkader/AURA-VERIFIER/blob/08d7c70404bab16e2e3b09bb9e59aefaf6fa5391/INTEGRATORS.md).

Other implementations can use the published schemas and conformance requirements
independently. Applications may add catalogues, rights workflows or identifiers;
those services do not become normative AURA dependencies through their use of
AURA. A package passing a reference-verifier check does not certify the complete
application that produced it.

| Repository | Role |
|---|---|
| `AURA-STANDARD` | Published schemas, profiles, conformance requirements and documentation |
| `AURA-VERIFIER` | Current v1.0/v1.1 verification implementation; release and archive published separately |
| `aura-core` | Historical v0.1 educational primitives in Python; not a current-format JCS signing SDK |
| `aura-cli` | Historical v0.1 proof demonstrator in Python |

The [Charter](CHARTER.md) and [conformance requirements](CONFORMANCE.md) govern
scope and implementation independence. This overview introduces no new
conformance level, registry dependency or application endorsement.
