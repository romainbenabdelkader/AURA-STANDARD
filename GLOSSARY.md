# AURA Glossary

## AURA

Authenticated Universal Registration for Assets. An open technical specification for verifiable origin and integrity declarations for digital assets.

## AURA-ID

General label for an AURA declaration identifier. In manifest schemas 1.0 and
1.1, the required field is `aura_uid`, with the `aura:v1:` prefix and a
26-character ULID-shaped value. The separate `aura_id` field is optional; it
does not replace `aura_uid`. Schema validation checks syntax, not global
uniqueness, allocation or legal ownership.

## AURA Manifest

Structured document containing the technical proof fields required for verification.

## Asset

Digital object being declared or verified, such as audio, video, image, text, dataset, model or AI output.

## Asset Hash

Cryptographic digest of the exact asset bytes. The published AURA-VERIFIER
v1.2.2 accepts an asset binding with `asset.hash_algorithm: "SHA3-256"` and a
64-character lowercase hexadecimal `asset.hash`. Matching bytes do not identify
a creative work independently of its file representation.

## Manifest Hash

A digest whose algorithm and exact input bytes must be identified for its use.
Do not substitute one recipe for another:

- The Ed25519 signature covers UTF-8 RFC 8785 JCS of the manifest with its
  top-level `signature` object removed. This defines the signed payload, not a
  universal manifest-hash recipe.
- The verifier's optional RFC 3161 timestamp binds SHA-256 of UTF-8 JCS of the
  **complete signed manifest**, including `signature`. Its companion SHA3-256
  digest uses the same canonical input. See the
  [timestamp preimage](https://github.com/romainbenabdelkader/AURA-VERIFIER/blob/6b1a631a9febdd724cfa819c67ec9d285179c27c/docs/RFC3161_TIMESTAMP.md#exact-canonical-preimage).
- `prior_evidence[].manifest_hash` in schema 1.1 remains a string without a
  shared normative algorithm or input-byte rule. The corrected quickstart
  hashes the complete original target file bytes with SHA3-256. Preserve that
  convention for those examples; the general verifier does not validate a
  linked evidence chain. See [open specification work](IMPLEMENTATION_STATUS.md#open-specification-work).

## Issuer

Entity or role declaring and signing the manifest.

## issuer_id

Identifier for the declaring signer. It may be institutional, role-based or
pseudonymous. Current manifests use `issuer.id` and, in v1.1,
`reference_anchor.issuer_key.issuer_id`. Agreement between these fields does
not establish civil identity, authority or registry membership.

## TPKR

Trusted Public Keys Registry: the conceptual model described in [TPKR.md](TPKR.md).
The reference verifier instead accepts the caller-supplied local issuer snapshot
documented in [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md#current-local-issuerjson-profile).
It does not establish the authenticity or freshness of that snapshot.

## Signature

Cryptographic signature over the canonical unsigned manifest.

## issued_at

Declared timestamp of manifest issuance. It is not equivalent to a third-party trusted timestamp unless separately verified.

## Trusted Timestamp

Optional third-party timestamp binding a specified digest to a time authority
response. The supported RFC 3161 recipe is described under Manifest Hash above.
Verification depends on the supplied trust material and does not establish the
creation date or authorship of the underlying work.

## declarations.tdm_opt_out

In the optional `AURA_TDM_RIGHTS_RESERVATION_V1` profile, the JSON boolean
`true` is a signed declaration by the issuer that rights are reserved against
text and data mining for the asset identified by `asset.hash`, where and to the
extent applicable. It does not prove that the issuer owns or is authorised to
exercise those rights, that a data collector discovered the declaration, or
that the declaration has a particular legal effect.

The earlier `rights.tdm_opt_out` path belongs to the superseded v0.1 draft and
MUST NOT be used to claim the current profile.

## Proof Scope

Explicit statement of what the manifest proves and what it does not prove.

## Verification Result

Outcome of a technical verification process, such as `VALID` or `INVALID`.

## Legal Scope

Boundary between technical proof and legal interpretation. AURA does not decide legal ownership, infringement, liability or copyright validity.

## UID_AUTH

Independent work-identifier format that may optionally be referenced by AURA
manifests. `uid_auth` is a declared work identifier; `aura_uid` identifies an
AURA declaration, and an asset hash binds exact file bytes. Neither UID_AUTH nor
an institutional work or contributor identifier is required by the AURA core.
