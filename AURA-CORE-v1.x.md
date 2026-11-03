# AURA Core v1.x — consolidated technical reference

**Status: REVIEW DRAFT — informative consolidation, not a new normative release.**  
**Prepared:** 2026-11-03. **Baseline:** AURA-STANDARD `4ab99117604f7a064a12471d9a2a6081b5ea74ed` (main).  
**Published specification release:** v1.2.1; **supported base manifest formats:** `aura_version` `"1.0"` and `"1.1"`.

This document gives implementers one reading path through AURA Core. **It does not add, remove, strengthen, loosen, or reinterpret any published requirement.** The existing files remain authoritative until a separately reviewed, versioned change is adopted. When this summary differs from them, follow the published schemas and applicable profile/conformance documents, and open an issue. Do not silently resolve contradictions by changing verification behavior.

## 1. Source-of-truth map

| Question | Current authoritative or relevant source |
| --- | --- |
| Base manifest structure | [schema/aura-manifest-v1.0.0.json](schema/aura-manifest-v1.0.0.json) or [schema/aura-manifest-v1.1.0.json](schema/aura-manifest-v1.1.0.json), selected by `aura_version` |
| Optional TDM overlay | [schema/profiles/aura-tdm-rights-reservation-v1.0.json](schema/profiles/aura-tdm-rights-reservation-v1.0.json) plus [specs/AI_Act_Article_53_Conformance_Profile.md](specs/AI_Act_Article_53_Conformance_Profile.md) |
| Conformance claims and privacy requirements | [CONFORMANCE.md](CONFORMANCE.md) and [PRIVACY.md](PRIVACY.md) |
| Signature preimage and distinct manifest-digest conventions | [GLOSSARY.md](GLOSSARY.md), [schema/README.md](schema/README.md), and the separately documented verifier's timestamp recipe |
| Versioning and compatibility | [specs/Standard_Status_and_Versioning.md](specs/Standard_Status_and_Versioning.md) |
| Implementation capabilities vs. conceptual models | [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md), [TPKR.md](TPKR.md), [ARCHITECTURE.md](ARCHITECTURE.md) |
| Scope and governance | [CHARTER.md](CHARTER.md), [GOVERNANCE.md](GOVERNANCE.md), [PUBLIC_POSITION.md](PUBLIC_POSITION.md) |
| Current acceptance example | [examples/quickstart-v1.1/](examples/quickstart-v1.1/README.md); historical `v0.1` tests are not v1.x acceptance tests |

The terms **MUST**, **MUST NOT**, **SHOULD**, and **MAY** used here *summarize* requirements already present in the cited sources. They have no independent force until this consolidation is explicitly promoted in a subsequent normative publication.

## 2. Scope and claims

AURA carries signed **declarations** about digital assets or fileless catalogue records. A verification result can support: integrity of supplied exact asset bytes, integrity of a signed declaration, and its relationship to a supplied signing key or separately supplied trust material.

AURA does **not**, merely from a signature or hash, establish the issuer's civil identity, authority, authorship, copyright ownership, legal effect, originality, time of creation, or truth of a human/AI origin declaration. The self-declared issuance date is not a trusted timestamp. AURA is not DRM, fingerprinting, content recognition, tracking, or automated rights enforcement.

Domain-specific metadata may be carried as signed extensions. This does not make the extension a normative AURA profile or prove the identifier's allocation, association, or ownership. Core AURA can apply to audio, image, video, text, datasets, model artifacts and other digital files.

## 3. Published base structures

### 3.1 Selection and minimum schema fields

The `aura_version` property selects exactly one published base JSON Schema, using JSON Schema 2020-12:

- **Manifest 1.0:** top-level `aura_version`, `aura_uid`, `issuer`, `issued_at` and `signature` are required.
- **Manifest 1.1:** all five above plus `reference_anchor` are required; `prior_evidence` is optional.
- Both schemas intentionally allow additional properties; the base schema alone is **not** a complete proof-assurance or trust policy.

`aura_uid` has the published regex `^aura:v1:[0-9A-HJKMNP-TV-Z]{26}$`. It is *ULID-shaped*, not independently guaranteed unique and, as currently written, not a complete canonical-ULID range check. See `C-01` in the [open-issues register](CONSOLIDATION_REVIEW.md). Existing signed identifiers are not to be rewritten.

A base `issuer` object is required, but `issuer.id` is **not** required by either base schema. `asset` and `catalog_claim` are **not** individually mandatory in the base schema. Some specific profiles and verifier acceptance paths impose further requirements. Do not present mere schema validation as proof that an asset was bound or an issuer identified.

### 3.2 Asset-bound and fileless evidence

Where a supplied asset is cryptographically checked by the published reference verifier, the implemented asset binding uses `asset.hash_algorithm: "SHA3-256"` and a lowercase 64-hex-character `asset.hash` over the **exact supplied bytes**. The base schemas themselves do not universally enforce this field combination; the TDM overlay does.

For a fileless signed catalogue declaration without a declared asset hash, report asset-integrity verification as **not applicable** rather than verified. Absence of asset bytes cannot be reported as a successful asset match.

Changing the bytes (including transcoding or metadata alteration) changes the scope of an exact-byte hash check. AURA Core does not itself identify perceptually equivalent content.

### 3.3 Signature and canonicalization

The published signature fields are `signature.algorithm: "Ed25519"`, `signature.canonicalization: "RFC-8785-JCS"`, and nonempty `signature.value`. The signing/checking preimage documented for current AURA v1.x is **UTF-8 RFC 8785 JCS of the manifest with its entire top-level `signature` member removed**. The signature is verified against the caller-supplied or otherwise properly resolved public key.

Separate failures for invalid signature, mismatching supplied asset, and unsupported algorithm/version. A mathematically valid signature does not authenticate the asserted real-world identity or ensure that a key is trusted. The published schemas do not, on their own, specify complete signature encoding, key-distribution, or issuer-assurance policy; do not infer requirements from a single example.

**Important:** `signature.value` is itself present in the complete signed-manifest *document*, but `signature` is excluded from the signature **preimage**. This wording avoids the ambiguous phrase "every field is signed".

## 4. Reference anchors and linked evidence

Manifest 1.1 includes a **signed** `reference_anchor` containing `standard`, `verifier` and `issuer_key`. The *published* 1.1 schema currently fixes `reference_anchor.verifier.name` to `"AURA-VERIFIER"`, even though independent tools may verify AURA evidence. This is a known neutrality/design question, not a reason to invalidate old packages retroactively.

Digest-shaped fields in `reference_anchor` use `sha3-256:` followed by 64 lowercase hex characters. The documented issuer public-key digest covers DER/SPKI **binary key bytes**, not PEM text bytes. An anchor or DOI string does **not** itself establish that a remote artifact was fetched and checked.

`prior_evidence[].manifest_hash` is a string in the 1.1 schema, **without a normative hash algorithm or preimage rule**. The corrected quickstart references SHA3-256 of the preceding complete original manifest *file bytes*. This example-specific convention is not a general validator rule; the reference verifier does not validate linked-evidence chains.

The detached RFC 3161 timestamp verification recipe is *different*: the published verifier describes SHA-256 over UTF-8 JCS of the **complete signed manifest including `signature`**. Never silently use that timestamp recipe as a historical `prior_evidence` interpretation.

Keep all pre-existing signed evidence and its original digest convention. Any new link-recipe field must be designed, reviewed and versioned explicitly.

## 5. Optional TDM rights-reservation profile

A manifest claiming `profile: "AURA_TDM_RIGHTS_RESERVATION_V1"` must validate against **both** the selected base schema and the corresponding [TDM overlay](schema/profiles/aura-tdm-rights-reservation-v1.0.json). The overlay requires:

- nonempty `issuer.id`;
- `asset.hash_algorithm` exactly `"SHA3-256"`;
- `asset.hash` as exactly 64 lowercase hexadecimal characters;
- `declarations.tdm_opt_out` exactly the JSON boolean `true`;
- the base `aura_uid`, `issued_at`, `signature` and (for 1.1) `reference_anchor`.

The reservation signal semantically maps **one way** to TDMRep's rights-reserved value `1`. A missing or invalid profile must **never** be translated into permission, waiver, or rights-not-reserved `0`.

The profile's declaration is within the signature preimage when `signature` is removed; `signature` metadata/value itself is not. Signature validity, asset-byte match, authority to reserve rights, discoverability by collectors, receipt and legal enforceability are distinct questions. Profile validity alone proves none of the last four.

## 6. Conformance and operational trust

Refer to [CONFORMANCE.md](CONFORMANCE.md) for the cumulative levels and exceptions:

| Label | What it adds or assesses |
| --- | --- |
| `AURA-Minimal` | Parse supported manifests and distinguish declarations from legal conclusions; no cryptographic check required |
| `AURA-Integrity` | For asset-bound evidence, recompute and compare the declared supported hash |
| `AURA-Signed` | Canonicalize unsigned payload and verify Ed25519; report signature mismatch distinctly |
| `AURA-Timestamped` | Verify supported independent trusted timestamp evidence when provided; separate it from `issued_at` |
| `AURA-Registry-Verified` | Apply supplied registry material, revoked/unknown-key policy and provenance/freshness reporting |
| `AURA-Institutional` | Expose documented authority levels, provenance, privacy measures and separate operational records |

The conceptual TPKR specification is **not** a deployed global trusted-key registry. The reference verifier's local `issuer.json` input is an implementation-specific caller-supplied snapshot whose authenticity and freshness are not established merely by using it.

A conformant local verification path MUST NOT require an account, remote resolver, telemetry or logging when the manifest, asset (if applicable), key and required trust material are supplied locally. Civil identity MUST NOT be a prerequisite for Core cryptographic validity.

## 7. Security and result reporting boundaries

A robust implementation must distinguish at least these dimensions when it claims them: schema support, canonicalization/signature, supplied asset hash, issuer-key match and trust status, profile-specific constraints, linked-evidence resolution and timestamp verification. A skipped, unsupported or unperformed dimension is not a positive verification.

The released verifier has additional *documented local policies* for duplicate JSON keys, recognized hash aliases, date syntax and issuer-identifier consistency. These are not silently promoted here into published JSON Schema requirements. See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

A valid signature proves only that the relevant private key signed the specified bytes. A compromised issuer key, self-asserted backdate, stale registry snapshot, copied package or false authority claim can still create misleading evidence. These cases must not be conflated with mathematical signature failure.

## 8. Compatibility and release discipline

- Keep published `aura_version` 1.0 and 1.1 schemas, archived releases and signed examples **byte-for-byte unchanged** in this consolidation.
- Preserve historical `v0.1` material as historical; it is not interchangeable with current manifest models.
- Do not change wire semantics or signed-input interpretation without explicit compatibility assessment and appropriate release version.
- A breaking change to required format or signature semantics requires a major version under [the current versioning policy](specs/Standard_Status_and_Versioning.md). An additive feature is **not automatically** backward-compatible if it narrows previously accepted input.
- New proposals must identify their own normative authority and provide positive/negative independent conformance vectors before adoption.

## 9. Unresolved items — not decided by this document

The [consolidation review register](CONSOLIDATION_REVIEW.md) records the questions that must be resolved in a separate normative process: canonical ULID range, neutral verifier anchoring, linked evidence digest recipes, permissive base schemas, signature-field wording, evidence-type semantics, source/encoding constraints, conformance vectors, security reporting, profile relationships and governance/branding.

In particular, this draft **does not** create `aura_version` `1.2`, a schema `v1.2.0` or a standard release `v1.3.0`. It does not implement the proposed music/linked-evidence extensions or alter the existing draft [PR #21](https://github.com/romainbenabdelkader/AURA-STANDARD/pull/21).

## 10. Review checklist

Before promoting this into a normative core document:

1. Confirm each statement against the published schema, conformance and profile sources.
2. Resolve conflicts using written decisions, not undocumented verifier changes.
3. Publish versioned positive and negative vectors, with independently executed test reports.
4. Assess compatibility for every proposed MUST/MUST NOT change.
5. Record neutral implementer feedback and separate authorship/ownership/legal questions from cryptographic checks.
6. Only then approve a normative document and decide on the required release/version designation.
