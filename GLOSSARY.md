# AURA Glossary

## AURA

Authenticated Universal Registration for Assets. An open technical specification for verifiable origin and integrity declarations for digital assets.

## AURA-ID

Identifier for an origin event or proof declaration. It does not itself prove legal ownership.

## AURA Manifest

Structured document containing the technical proof fields required for verification.

## Asset

Digital object being declared or verified, such as audio, video, image, text, dataset, model or AI output.

## Asset Hash

Cryptographic digest of the asset bytes. AURA v0.1 uses SHA3-256 in the draft standard profile.

## Manifest Hash

Cryptographic digest of the canonical unsigned manifest.

## Issuer

Entity or role declaring and signing the manifest.

## issuer_id

Stable identifier for the issuer. It may be institutional, role-based or pseudonymous.

## TPKR

Trusted Public Keys Registry. Registry profile mapping issuer identifiers to public keys and key status metadata.

## Signature

Cryptographic signature over the canonical unsigned manifest.

## issued_at

Declared timestamp of manifest issuance. It is not equivalent to a third-party trusted timestamp unless separately verified.

## Trusted Timestamp

Optional third-party timestamp binding a manifest hash to a time authority response.

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

Independent work identifier standard that may optionally be referenced by AURA manifests. `uid_auth` identifies a work; `aura_id` identifies an AURA proof declaration.
