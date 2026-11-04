# AURA Core v1.x — consolidation review register

**Status:** discussion register, not adopted normative changes.  
**Created:** 2026-11-03. Baseline: `main` at `4ab99117604f7a064a12471d9a2a6081b5ea74ed`.  
**Scope:** track verified specification/documentation gaps and explicit decisions needed before any future normative revision. Neither this file nor [AURA-CORE-v1.x.md](AURA-CORE-v1.x.md) modifies an existing schema, signature, signed example, existing profile, archived version or conformance level.

## Confirmed design and specification questions

| ID | Priority | Evidence | Problem / compatibility risk | Proposed next step (not an adopted requirement) |
| --- | --- | --- | --- | --- |
| **C-01 ULID range** | P1 | `schema/aura-manifest-v1.0.0.json`, `schema/aura-manifest-v1.1.0.json` and `examples/quickstart-v1.1/manifest.json` | Regex `^aura:v1:[0-9A-HJKMNP-TV-Z]{26}$` allows first symbols outside the canonical 128-bit ULID range (canonical first symbol `0`–`7`); the signed quickstart UID starts with `T`. Changing the rule in place would reject existing signed evidence. | [Proposed choice and validation](#c-01--uid-generation-and-historical-reading): canonical generation for new declarations; preserve existing v1.0/v1.1 reading rules. |
| **C-02 verifier-specific anchor** | P1 | `schema/aura-manifest-v1.1.0.json` `reference_anchor.verifier.name` is `const "AURA-VERIFIER"` and the verifier block is mandatory | The current reference artifact is fixed by the schema. This is not a runtime dependency or proof that the named tool was actually used. Whether this mandatory reference is appropriate for every future issuer is a design question; the constant alone does not demonstrate loss of implementation independence. | [Proposed choice and validation](#c-02--reference-artifact-and-executed-software): preserve v1.1 anchors; propose optional, implementation-neutral software references for a future format. |
| **C-03 linked-evidence hash recipe** | P1 | `schema/aura-manifest-v1.1.0.json` has unconstrained `prior_evidence[].manifest_hash`; `schema/README.md` and `IMPLEMENTATION_STATUS.md` record differing recipes | Two readers cannot know the correct input bytes/algorithm from this field alone; quickstart uses original complete file bytes while detached RFC 3161 timestamping uses canonical complete signed JSON. | [Proposed choice and validation](#c-03--explicit-file-digest-for-new-links): review the explicit file-byte method already proposed in [PR #21](https://github.com/romainbenabdelkader/AURA-STANDARD/pull/21); preserve unqualified historical links. |
| **C-04 base-schema permissiveness** | P2 | `schema/aura-manifest-v1.0.0.json`, `schema/aura-manifest-v1.1.0.json` | `issuer` need not contain `id`; neither `asset` nor `catalog_claim` is universally required; open extension fields permit typo-like properties. Yet fileless catalogue evidence and pseudonymous identities are intentional. | Define named proof-type/application-level constraints separately from the permissive base structure. **Do not** blindly introduce `oneOf` or require `issuer.id` in existing frozen base schemas. Test whether any proposed tightening breaks prior valid inputs. |
| **C-05 signature scope wording** | P2 | `specs/AI_Act_Article_53_Conformance_Profile.md`, `GLOSSARY.md` | The TDM text says all listed fields form part of the signed payload, but `signature` is removed before JCS/Ed25519 signing. This can be read inconsistently. | Clarify editorially that TDM declaration/issuer/asset fields are signed, while `signature` describes and carries the signature outside the preimage. Do not change signature behavior. |
| **C-06 URI/DOI semantics** | P2 | `schema/aura-manifest-v1.1.0.json` and `examples/quickstart-v1.1/manifest.json` | `public_key_doi` accepts any nonempty string, including the example's intentionally test-only `urn:aura:test-key:…`. The name suggests a DOI but the schema does not guarantee one. | Document exact deployed identifier semantics; consider future explicit type/locator fields. Preserve valid historical test records and signatures. |
| **C-07 hash encodings** | P2 | `schema/aura-manifest-v1.1.0.json` and `schema/README.md` | `asset.hash` uses a raw lowercase SHA3-256 hex value; anchor digests use `sha3-256:` prefix. This is documented but not uniform. | Document the field-specific lexical forms in one normative table. Do not auto-normalize signed inputs. Consider changes only in a versioned profile/format. |
| **C-08 conformance reproducibility** | P1 | `TEST_VECTORS.md`, `examples/quickstart-v1.1/` and reference verifier's separate tests | One useful current-format signed example exists, while the standard does not contain a comprehensive executable positive/negative interoperability vector suite for both formats and optional profiles. A reference verifier's tests alone do not prove two independent implementations agree. | Publish a current-format conformance matrix, concrete vectors, expected results for multiple check dimensions, and reproducible **independent** results. Preserve historical `v0.1` vectors separately. |
| **C-09 versioned normative prose** | P1 | `specs/AURA_v0.1_Draft.md` is historical; current rules distributed across schemas, conformance, glossary and profiles | A second implementer must reconstruct semantics from numerous files. Unqualified statements of normativity can conflict. | Review [AURA-CORE-v1.x.md](AURA-CORE-v1.x.md) against all authoritative sources, then promote an approved version with clearly allocated normative authority; treat this first draft as **informative only**. |
| **C-10 security reporting** | P2 | `SECURITY.md` | At the review baseline, private reporting had no concrete contact mechanism. | Addressed in this PR on 2026-11-04: published maintainer email, test-data reproduction guidance and disclosure handling. No encrypted channel or guaranteed response time is claimed. |
| **C-11 neutral governance / release protection** | P2 | `GOVERNANCE.md`, `CHARTER.md`; branch protections to be configured separately by maintainers | A published governance charter is not an independent review/certification body. A documentation branch or draft PR does not establish release controls. | Adopt documented written review, independent signoff and CI release gates; verify the actual GitHub settings before claiming protection. |
| **C-12 documentation consistency** | P3 | `ARCHITECTURE.md`, `GLOSSARY.md`, `SECURITY.md` and older examples | Some documents point to the verifier v1.2.0 or retain historical wording, while v1.2.1 is published. Historic text can be important provenance. | Update only the *current-status* references; keep original signed evidence and clearly labelled historical documents untouched. |
| **C-13 charter vs. Apache-2.0** | P2 | `CHARTER.md`, `LICENSE`, `CONFORMANCE.md` | These texts address project governance, technical conformance, licensing and naming. Their legal interaction has not been determined by this technical consolidation; do not present a technical check as resolving it. | Obtain legal review of any mandatory "aligned" naming or mark policy; distinguish technical conformance and optional labels from license conditions. No legal conclusion is adopted here. |
| **C-14 external integrations** | P2 | `README.md` and `IMPLEMENTATION_STATUS.md` | No current normative ISRC/ISWC/DDEX/C2PA mapping and tested exchange are claimed. The optional music/link proposal is not implemented. | Require field semantics, compatibility assessment, and two-party round-trip tests before declaring interoperability. Keep Core usable for any digital content, with no mandatory external rights number. |

## Compatibility proposals — 2026-11-04

The table above retains the original review baseline. These three proposals were
checked against `main` at `a72c6440326cbb02eaf396f4315487c5c3dbf694` and
[PR #21 at `37e9d61`](https://github.com/romainbenabdelkader/AURA-STANDARD/tree/37e9d6174a998f2db804367e19098f5bc119aa60/proposals/2026-11-music-and-linked-evidence).
Their decision status is **proposed, awaiting review**. Merging this documentation
records the proposals; it does not adopt them, close C-01/C-02/C-03, change
conformance or assign a release number. The published specification remains
v1.2.1, with manifest schemas 1.0 and 1.1.

### C-01 — UID generation and historical reading

**Current rule.** Both published schemas permit the 26-character alphabet in
C-01 without the ULID 128-bit range restriction. The current quickstart uses that
permitted shape. The [ULID specification's overflow rule](https://github.com/ulid/spec/blob/master/README.md#overflow-errors-when-parsing-base32-strings)
limits a canonical ULID to `7ZZZZZZZZZZZZZZZZZZZZZZZZZ`; an uppercase AURA suffix
beginning with `T` is not a canonical ULID. This does not invalidate its signature.

**Proposed choice.** Recommend canonical ULID generation before signing new
declarations: `aura:v1:` plus exactly 26 uppercase Crockford characters, first
character `0`–`7`, with the ULID timestamp/randomness layout. Keep the existing
v1.0/v1.1 validation rules and treat historical UIDs as opaque identifiers for
matching. Do not decode out-of-range historical values as 128-bit ULIDs. A future
mandatory range check needs an explicitly selected, versioned format or optional
profile; it is not introduced for all v1.x inputs by this recommendation.

**Compatibility impact.** Canonical generation uses a subset of the existing
allowed shape. Retrofitting strict rejection into existing readers would narrow
acceptance and could reject the signed quickstart, so it is not a compatible
editorial correction. Never truncate, change case, regenerate or re-sign an old
UID to repair its range. UID syntax does not prove uniqueness, creation time,
identity or ownership; even a canonical ULID's time component is not a trusted
timestamp. No institutional registration or sector identifier is introduced.

**Validation required.** Preserve matrix F13 and replay both signed quickstart
packages unchanged. For the proposed generation/check path, test the lower and
upper 128-bit boundaries, first symbols `8` and `T`, wrong lengths, forbidden
letters, lowercase, trailing newlines and generation overflow. Distinguish
current base-schema/reference-policy outcomes from future strict-profile results.
Generate fresh signed 1.0/1.1 controls with test keys; compare an independent
ULID implementation and verify exact UID matching without normalization. These
additional generation/profile cases are planned, not executed by this register.

### C-02 — Reference artifact and executed software

**Current rule.** The [v1.1 schema](../../schema/aura-manifest-v1.1.0.json)
requires the signed `reference_anchor.verifier` block with
`name: "AURA-VERIFIER"`. Its artifact coordinates identify a reference, not the
software actually run. A different implementation can produce or check a v1.1
manifest while preserving this required reference. The execution record belongs
in a separate verification report, as [implementation status](../../IMPLEMENTATION_STATUS.md#keep-these-coordinates-separate)
already explains. Structural acceptance alone does not verify the archive digest
or resolve its DOI.

**Proposed choice.** Retain that meaning for v1.1. For a future manifest format,
make software-artifact references optional and implementation-neutral, while
retaining an unambiguous reference to the applicable specification/schema.
Keep reference artifacts distinct from reported execution provenance. A runtime
report identifies the actual implementation, version/commit, inputs, check results
and trust policy; a signed software name alone does not establish execution.

**Compatibility impact.** Removing the block or changing its fixed name in a
manifest labelled `1.1` still fails the published schema. A future wire shape
cannot be substituted under that label, or silently selected by deleting fields.
Its exact fields, version discriminator and old-reader behavior require a
separate format review under the versioning policy below. Keep all old anchors
byte-for-byte; do not replace them with the latest verifier coordinates. No
dependency on a particular application, online service or account is proposed.

**Validation required.** Preserve F03/F04/F15 and S02: an independent signer can
produce a currently valid v1.1 package with the reference block. Test a different
verifier against that same package and record its actual implementation separately.
For a future format, test absent and generic software references, unsupported
format versions, malformed artifact coordinates, and archive bytes that do not
match a declared digest. Report schema, signature, archive binding and execution
provenance separately. The future-format cases await a reviewed wire definition;
current S02 evidence does not execute them or prove a complete second verifier.

### C-03 — Explicit file digest for new links

**Current rule.** The v1.1 `manifest_hash` field is a string with no general
normative hash-input recipe. The [quickstart correction](../../examples/quickstart-v1.1/CORRECTION.md)
documents its own SHA3-256 reference to the complete original file. The existing
RFC 3161 recipe instead uses SHA-256 of UTF-8 JCS of the complete signed manifest.
The general verifier does not validate a chain merely because either digest can
be computed; [T02/T03](../../tests/conformance/2026-11-04-timestamp/README.md)
test timestamp binding, not linked-evidence support.

**Proposed choice.** Use the candidate already defined in
[PR #21's linked-evidence section](https://github.com/romainbenabdelkader/AURA-STANDARD/blob/37e9d6174a998f2db804367e19098f5bc119aa60/proposals/2026-11-music-and-linked-evidence/README.md#linked-evidence-choose-bytes-explicitly):
`manifest_hash_method: "sha3-256-file-v1"` on a new, signed v1.1 link item, with
`manifest_hash` encoded as `sha3-256:` followed by 64 lowercase hex characters.
Hash the complete original target-file bytes, including signature, whitespace
and any BOM, before decoding. Do not canonicalize, re-encode or hash a ZIP wrapper.
This deliberately binds a particular serialization; differently formatted JSON
can retain a valid signature while failing the exact-file link check.

Keep this optional link method usable across content types, independently of
the proposed music fields. It does not replace the existing TDM `profile` or
activate link semantics on a referring v1.0 manifest. The target formats proposed
in PR #21 are 1.0 and 1.1, with their existing UID rules, including historical
noncanonical ULIDs; C-01 must not silently tighten those target checks.

**Compatibility impact.** The published schema permits additional link-item
properties, but older verifiers do not thereby check the new method. Applications
requiring it need explicit method support and completed checks. A missing method
on a historical link remains unspecified; its external historical recipe may be
reported separately. An unknown method is unsupported, with no fallback guessing.
Neither condition retroactively invalidates the referring signature or satisfies
a link-required application. Do not add a method to an already signed statement.

Initially check locally supplied direct links only. Keep byte match, strict
target parsing/schema/UID, referring authentication, target signature/key status
and historical trust separate, as proposed in PR #21. No automatic network lookup,
recursive verification or trust inheritance follows from a matching link. A
revoked target key remains revoked under the selected current policy; a new link
or later timestamp does not establish that signing preceded compromise.

**Validation required.** Use PR #21's existing
[H01–H20 plan](https://github.com/romainbenabdelkader/AURA-STANDARD/blob/37e9d6174a998f2db804367e19098f5bc119aa60/proposals/2026-11-music-and-linked-evidence/TEST_PLAN.md#linked-evidence),
including serialization/BOM changes, altered signature, wrong UID, unknown or
missing method, invalid UTF-8, duplicate names, unsupported targets, revoked keys
and incomplete multi-link results. Preserve F17/F18 and the historical quickstart
recipe separately. Review processing limits and JSON-LD context treatment before
adoption. The draft's digest and synthetic decision experiments are partial
evidence, not execution of that extension plan. This register adds no new
implementation or competing test-plan numbering.

### Decision and release gate

The [existing versioning policy](../Standard_Status_and_Versioning.md) separates
specification releases from manifest formats. Tightening accepted inputs or
changing required wire behavior is not automatically an additive minor change;
breaking changes require a major specification increment. An explicitly optional
capability preserving old meaning may qualify for a minor release after review.
This documentation PR changes neither type of version.

For each proposal, record `accept`, `defer` or `reject`, the reviewed text/commit,
compatibility evidence and independent implementer feedback before normative
adoption. Any implementation needs separate approval and measured results. The
existing CI replays current behavior; passing it does not demonstrate these future
rules. C-03's details remain in PR #21, which stays a discussion draft; reviewing
its link method does not adopt its music profile or depend on institutional IDs.

## Non-negotiable preservation boundaries for this draft

1. Never rewrite `schema/aura-manifest-v1.0.0.json` or `schema/aura-manifest-v1.1.0.json` in this documentation consolidation.
2. Never modify already signed manifests, signature values, SHA3-256 digests, pre-existing UID values, test fixtures or DOI/archive records.
3. Do not treat draft proposals or this register as published normative features.
4. Separate cryptographic checks from social/legal facts: identity, authorship, rightsholder authority, TDM discoverability and legal effect.
5. Keep issuer civil identity, IPI, ISRC, ISWC, ISBN, UID_AUTH and sector identifiers optional to AURA Core unless a separately identified **optional** domain profile has its own requirements.
6. Require written compatibility analysis and independently executed tests before accepting changed wire semantics.

## Suggested review evidence

Partial execution evidence is now available in the [dated reproduction dossier](../../tests/conformance/2026-11-03/README.md), including a separate Python S02 signer. This advances C-08 without closing its independent-engine and coverage gates. Moving this register and the core reference into one directory improves navigation for C-09; it does not assign them new normative authority.

Reviewers should record for each item: an exact cited current rule, proposed test vector, backward-compatibility impact, independent implementer feedback, security/privacy impact, and the decision (`accept` / `defer` / `reject`). None has been decided by creating this register.

This register is **not** a replacement for the unfinished [PR #21](https://github.com/romainbenabdelkader/AURA-STANDARD/pull/21) and must not be interpreted as approval or implementation of its music identifiers or linked-evidence proposals.
