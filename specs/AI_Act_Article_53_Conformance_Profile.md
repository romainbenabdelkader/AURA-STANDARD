# AURA TDM Rights-Reservation Documentation Profile v1.0

**Status:** Optional normative profile for AURA v1.0 and v1.1 manifests

**Profile identifier:** `AURA_TDM_RIGHTS_RESERVATION_V1`

This profile defines a signed, machine-interpretable declaration intended to
support documentation and audit workflows concerning reservations of rights for
text and data mining (TDM). It may support workflows related to Article 4(3) of
Directive (EU) 2019/790 and Article 53(1)(c) of Regulation (EU) 2024/1689.

Profile conformance establishes the syntax, integrity and issuer signature of
the declaration. It does not establish the issuer's legal authority, ownership
of rights, discoverability by a data collector, receipt by a model provider, or
legal effect in a particular jurisdiction.

## 1. Base-manifest conformance

A manifest claiming this profile MUST:

1. validate against the canonical AURA schema selected by `aura_version`;
2. validate against
   `schema/profiles/aura-tdm-rights-reservation-v1.0.json`; and
3. use the exact profile identifier
   `AURA_TDM_RIGHTS_RESERVATION_V1`.

The profile uses the current canonical AURA field model. Legacy v0.1 paths such
as top-level `issuer_id` and `rights.tdm_opt_out` MUST NOT be used to claim this
profile.

## 2. Required signed fields

In addition to the requirements of the selected base schema, a conformant
manifest MUST include:

- `aura_version` (`"1.0"` or `"1.1"`);
- `profile: "AURA_TDM_RIGHTS_RESERVATION_V1"`;
- `aura_uid`;
- `issuer.id`;
- `issued_at`;
- `asset.hash_algorithm: "SHA3-256"`;
- `asset.hash` containing the lowercase SHA3-256 digest of the exact asset
  bytes;
- `declarations.tdm_opt_out: true`;
- `signature.algorithm: "Ed25519"`;
- `signature.canonicalization: "RFC-8785-JCS"`; and
- `signature.value`.

An AURA v1.1 manifest MUST additionally carry the `reference_anchor` required
by the v1.1 base schema.

All profile fields above form part of the signed payload.

## 3. Declaration semantics

`declarations.tdm_opt_out: true` means only:

> The issuer declares that rights are reserved against text and data mining for
> the asset identified by `asset.hash`, where and to the extent applicable.

The field MUST be the JSON boolean `true`. Strings, numbers, `null`, objects and
the boolean `false` are non-conformant with this reservation profile.

Absence of this profile or field means that no TDM reservation is expressed by
this AURA profile. It MUST NOT be interpreted as permission, a licence, a waiver,
public-domain status, or absence of rights.

Cryptographic validity proves control of the signing key, not that the issuer is
the rightsholder or is authorised to act for the rightsholder. Implementations
MUST NOT present a conformant result as proof of ownership, authority or legal
enforceability.

## 4. Discovery and receipt

AURA manifests may be detached from assets. This profile does not define a web
crawler exclusion protocol or guarantee that a data collector will discover the
manifest.

A deployment relying on the declaration in an online TDM workflow SHOULD expose
it through an appropriate machine-readable discovery mechanism applicable to
its publication context. The mechanism and the asset-to-manifest binding MUST be
documented separately. A verifier MUST distinguish:

- profile and signature conformance;
- asset binding;
- discovery or receipt evidence; and
- legal interpretation.

No central registry, proprietary platform or online lookup is required for
cryptographic verification when the manifest, asset and trust material are
provided locally.

## 5. Time and later changes

`issued_at` is issuer-declared. A deployment requiring independently established
time SHOULD provide separate trusted timestamp evidence.

Signed evidence is immutable. A later withdrawal, replacement or change of a
reservation MUST be represented by new signed evidence; an existing signed
manifest MUST NOT be rewritten. Where available, AURA v1.1 `prior_evidence`
SHOULD link the later evidence to the earlier declaration.

## 6. Privacy and identity

Civil identity and personal data are not required. Issuer identifiers MAY be
institutional, role-based, scoped or pseudonymous. Any private identity or
authority assurance remains outside AURA cryptographic validity and MUST be
described separately.

## 7. Verification requirements

A verifier claiming support for this profile MUST reject a profile claim when:

- any required profile field is absent;
- `declarations.tdm_opt_out` is not exactly the boolean `true`;
- the asset hash does not match supplied asset bytes; or
- the manifest signature is invalid.

The verification result MUST state that issuer authority, discovery and legal
effect were not established unless those matters were assessed by a separate,
explicit process.
