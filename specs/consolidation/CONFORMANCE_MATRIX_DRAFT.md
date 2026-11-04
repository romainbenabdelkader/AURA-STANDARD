# AURA v1.x — independent conformance test matrix (proposal)

**Status: REVIEW MATRIX — partial execution evidence available; no new normative rule.**  
**Prepared:** 2026-11-03, on documentation-only consolidation branch.  
**Baseline:** published AURA-STANDARD v1.2.1; base manifest schemas `aura_version: "1.0"` and `"1.1"`; optional TDM overlay v1.0.  
**Reference:** [AURA-CORE-v1.x.md](AURA-CORE-v1.x.md) and [CONSOLIDATION_REVIEW.md](CONSOLIDATION_REVIEW.md).

This matrix identifies checks against existing published rules, reference-verifier policies and open normative questions. The [dated reproduction dossier](../../tests/conformance/2026-11-03/README.md) supplies 71 fixed variants, three offline Chromium checks and additional S02/S01 evidence. Expected results below are separate from measured coverage; see section 3.

## 1. What counts as a result

Every future test report should identify: test ID; exact fixture/asset/key bytes and SHA-256/SHA3-256 checksums; selected schema and profile; verifier name/version/source commit; runtime/platform; schema outcome; signature outcome; asset-binding outcome; optional profile outcome; key/registry trust outcome; independent timestamp outcome; source-of-trust status; network observation if applicable; overall application policy; and exact reason when any check did not run.

Use these dimensions rather than collapsing unrelated facts into `VALID` or `INVALID`. In particular, schema acceptance is **not** issuer authority, cryptographic validity is **not** ownership, and missing trust material is **not** evidence of non-revocation. If a check is unsupported or not performed, it must not be described as passed.

### Source classification

- **S** — existing published JSON-schema requirement (check with a conforming JSON Schema 2020-12 engine; account for the selected format-checking vocabulary).
- **C** — existing AURA [CONFORMANCE.md](../../CONFORMANCE.md), [TEST_VECTORS.md](../../TEST_VECTORS.md), or TDM profile requirement; apply only at the indicated level or profile.
- **V** — documented **reference verifier local policy**, not automatically a requirement of the base schema.
- **O** — **open normative question**: document the present behavior; **do not** silently establish a new conformance gate.

Dependencies of the selected cryptographic format, including RFC 8785 JCS input constraints, also belong to **C** when that format is claimed. The field names below describe logical dimensions, not a mandated output JSON contract. An adapter must identify the actual fields of each tested implementation. For example, v1.2.1 reports an unsupported manifest version as an error with `schemaValidation.status: "not_checked"`; it does not return a literal `baseSchema: "unsupported"` field.

## 2. Test matrix and expected results

The matrix's **expected dimension** is an expected result for the *named check*, not necessarily an overall verdict. Some cases require newly generated signed fixtures, and changing any signed field invalidates the old signature unless it is re-signed using a fresh **test-only** key. A parser-only mutation must not be misrepresented as a signed positive vector.

| ID | Class | Input / controlled mutation | Expected dimension under *current* rules | Authority |
| --- | --- | --- | --- | --- |
| F01 | S | A valid, newly signed v1.0 manifest with all 5 base-required fields | `baseSchema=pass`; independent signature check required for `AURA-Signed` | Base v1.0 schema; CONFORMANCE |
| F02 | S | Current neutral quickstart v1.1 unchanged | `baseSchema=pass`; reference example expects valid signature and matching bytes with its supplied key | Base v1.1 schema; quickstart README |
| F03 | S | Remove `reference_anchor` from an otherwise v1.1-shaped document | `baseSchema=fail` | Base v1.1 schema |
| F04 | S | Remove `reference_anchor` from a newly signed v1.0 manifest that never required it | `baseSchema=pass` if other v1.0 constraints are met | Base v1.0 schema |
| F05 | S | Set `aura_version` to `"1.2"` | `baseSchema=unsupported` (no selected current schema); do not claim it is a forged signature | Base schema selection; TEST_VECTORS |
| F06 | S | Remove required `signature` object | `baseSchema=fail` | Both base schemas |
| F07 | S | Wrong `signature.algorithm` | `baseSchema=fail`; unsupported algorithm must be refused at AURA-Signed level | Both schemas; CONFORMANCE |
| F08 | S | Wrong `signature.canonicalization` | `baseSchema=fail` | Both base schemas |
| F09 | S | Empty `signature.value` | `baseSchema=fail`; signature is unverified | Both base schemas |
| F10 | S | Empty `issuer: {}` in a base 1.0 or 1.1 document | `baseSchema=pass` if all other base constraints met; do **not** claim verified identity | Both base schemas; C-04 |
| F11 | S | No `asset` and no `catalog_claim` in otherwise base-compliant document | `baseSchema=pass`; not automatically a meaningful asset/fileless proof | Both base schemas; C-04 |
| F12 | S | Unknown additional property or typo outside required fields | `baseSchema=pass` if required fields remain correct; assess application semantics separately | `additionalProperties: true` in base schemas |
| F13 | S/O | `aura_uid` has 26 Crockford characters, first character `T` (existing quickstart) | `baseSchema=pass` under **published regex**; canonical ULID check would differ; preserve legacy evidence | Both base schemas; C-01 |
| F14 | S | Short `aura_uid` or forbidden Crockford letter `I` | `baseSchema=fail` | Both base schemas |
| F15 | S | v1.1 anchor `verifier.name` changed to a different implementation name | `baseSchema=fail` under **published** `const "AURA-VERIFIER"`, regardless of whether another verifier can verify the signature | Base v1.1 schema; C-02 |
| F16 | S | v1.1 anchor digest lacks the `sha3-256:` prefix | `baseSchema=fail` for the digest fields with `$defs.digest` | Base v1.1 schema |
| F17 | S/O | `prior_evidence[].manifest_hash` is an arbitrary string, including the empty-string boundary | `baseSchema=pass` when other constraints hold: the published field has type `string` and no `minLength`; no normative digest interpretation follows | Base v1.1 schema; C-03 |
| F18 | S | `prior_evidence[].manifest_hash` is not a string | `baseSchema=fail` | Base v1.1 schema |
| I01 | C | Asset bytes match a declared supported SHA3-256 asset hash | `assetIntegrity=pass` when explicitly checked | CONFORMANCE; quickstart |
| I02 | C | Modify one asset byte with unchanged signed manifest | `assetIntegrity=fail` and report separately from signature | CONFORMANCE |
| I03 | C | Fileless catalogue manifest without an asset hash | `assetIntegrity=not_applicable`, **not** verified | CONFORMANCE |
| I04 | C | Asset omitted but hash declared | `assetIntegrity=not_checked` (or equivalent incomplete), never "matched" | CONFORMANCE; implementation status |
| S01 | C | Change signed declaration without re-signing | `signature=fail` with unchanged key | CONFORMANCE; TEST_VECTORS |
| S02 | C | Sign the correct JCS preimage using a fresh test-only Ed25519 key | `signature=pass` with matching public key, independent of identity claims | GLOSSARY; CONFORMANCE |
| S03 | C | Verify a correct signed payload against a different public key | `signature=fail`; identity assertion not established | CONFORMANCE |
| S04 | C | Reserialize an existing correctly signed fixture with different whitespace/property order, preserving every parsed value and the original signature bytes; do not re-sign | The original signature must still verify if the same JCS object is recovered; compare canonical preimages as well as verification outcomes | GLOSSARY; RFC 8785 |
| P01 | S/C | Properly signed TDM `true` manifest with matching asset | Base schema and TDM overlay pass; signature and supplied asset binding checked separately | TDM overlay; TDM profile |
| P02 | S/C | TDM `tdm_opt_out` values `false`, `null`, string `"true"`, number, array, or object | `tdmProfileSchema=fail` for each non-`true` value | TDM overlay |
| P03 | S/C | TDM profile with empty or missing `issuer.id` | `tdmProfileSchema=fail` even if base schema accepts `issuer: {}` | TDM overlay |
| P04 | S/C | TDM profile with no `asset.hash` or wrong hash algorithm | `tdmProfileSchema=fail` | TDM overlay |
| P05 | C | No TDM profile, or nonconformant TDM profile | **Never** infer license/waiver/permission or map absent signal to TDMRep `0` | TDM profile; CONFORMANCE |
| P06 | C | TDM claim with correct signature but no evidence of rightsholder authority or crawler receipt | Report syntax/signature separately; `authority` and `receipt` are **not proven** | TDM profile; CONFORMANCE |
| R01 | C/V | Caller-supplied issuer snapshot marks matching key revoked | Registry-verified claim must reject revoked key; published verifier hard-fails regardless of self-declared issue date | CONFORMANCE; IMPLEMENTATION_STATUS |
| R02 | C | Registry verification requested but issuer key unknown | `registryTrust=fail` where registry verification is required; **do not** label math signature forged | CONFORMANCE |
| R03 | C/V | Trusted registry snapshot not supplied | Mathematical signature may still be checked; registry authenticity/freshness **not established** | TPKR; IMPLEMENTATION_STATUS |
| T01 | C | Manifest has only `issued_at` but no independent timestamp evidence | `independentTimestamp=not_checked`, never independently established | CONFORMANCE |
| T02 | C/V | Verifiable detached RFC 3161 token using the reference verifier's documented complete signed-manifest canonical preimage and supplied trust material | `independentTimestamp=pass` only if all token, binding and supplied trust checks succeed for that recipe; this does not prescribe RFC 3161 for every possible AURA-Timestamped implementation | CONFORMANCE; GLOSSARY; verifier timestamp documentation |
| T03 | C/V | RFC 3161 response over the wrong manifest digest under the same selected recipe | `timestampBinding=fail` independently of ordinary signature validity | CONFORMANCE; verifier timestamp documentation |
| V01 | C/V | Duplicate JSON object member names in raw manifest | Reject for the JCS path before object parsing silently removes the duplicate; reference verifier rejects. JSON Schema validation of an already-parsed object cannot express this raw-input constraint | RFC 8785 §3.1; IMPLEMENTATION_STATUS |
| V02 | V | Recognized asset-hash aliases disagree | **Reference verifier** rejects; aliases are implementation-local policy | IMPLEMENTATION_STATUS |
| V03 | V | Impossible calendar `issued_at` value | **Reference verifier** rejects under local date policy; standard's `format` handling must be specified per chosen JSON Schema validator | IMPLEMENTATION_STATUS |
| N01 | C | All evidence, key and trust material provided locally; network disabled | Core cryptographic verification must succeed/fail solely on supplied materials with **zero required** account, telemetry or remote fetches | CONFORMANCE; PRIVACY |
| N02 | C | Issuer uses scoped/pseudonymous identifier instead of published civil identity | Identity publication is not necessary for signature validity or core conformance | CONFORMANCE; PRIVACY |

## 3. Coverage gaps / release gates

The [dated coverage record](../../tests/conformance/2026-11-03/recorded/review-summary.json) maps 71 variants to 40 rows. N01 is exercised separately by three real Chromium checks. Across the 43 rows, 39 technical dimensions were exercised, P05/P06 remain partial reporting checks, and T02/T03 were not executed in this campaign. This is not 43 fully validated requirements.

The separate [4 November timestamp record](../../tests/conformance/2026-11-04-timestamp/README.md) adds executions for T02/T03 using pinned AURA-VERIFIER v1.2.2 and OpenSSL 3.x. T02 verifies the preserved v1.0 FreeTSA package. T03 first accepts the v1.1 quickstart without a token, then rejects that unchanged package when given the FreeTSA token for a different manifest; signature and asset integrity still pass. The [timestamp runner](../../tests/conformance/check-timestamps.mjs) also replays both existing reference timestamp suites. These cases supplement, rather than rewrite or increase, the historical 71-variant record. They establish the selected reference recipe's results, not independent implementation agreement or qualified timestamp status.

The [additional S02/S01 package](../../tests/conformance/2026-11-03/s02/README.md) provides a separately written Python signer, received fixtures and a fresh regeneration checked against the pinned reference release. It strengthens those two existing rows; it does not increase the number of covered rows or establish a second complete independent engine. The [neutral quickstart](../../examples/quickstart-v1.1/README.md) is preserved; [historical v0.1](../../TEST_VECTORS.md) vectors remain historical.

The 43 rows are not exhaustive coverage. Cross-reference the separately pinned reference-verifier tests for Unicode/JCS numbers, signature encoding (including padding bits), hash boundary lengths, registry structure and issuer identifiers. The local no-hash/supplied-file case is also distinct from I03/I04. Keep their dated results separate; this plan does not rerun or replace them. P05/P06 additionally require a reporting/mapping review: selected output flags alone cannot establish every downstream application's treatment of permission, authority or collector receipt.

Before any claims of "independent interoperability":

1. Produce signed **test-only** v1.0, v1.1, TDM and fileless fixtures plus negative mutations, without overwriting historical examples.
2. Publish each fixture's immutable byte digest, public key, actual signed preimage recipe, schema/profiles, expected per-dimension outcome and provenance.
3. Verify each against **two independently written engines**; a wrapper around AURA-VERIFIER or a copy of its validation routines is not independent.
4. Exercise Node and browser when those environments are claimed; run network-blocked local mode and observe requests. "No account required" is not proof of zero tracking on a particular deployment.
5. Keep tests for historical malformed-but-accepted **schema** values separate from proposed future *strict* syntax tests (notably UID, issuer and verification anchor).
6. For optional RFC 3161 checks, publish a separate token/trust fixture and exact manifest-preimage recipe; `issued_at` is not an independent timestamp.
7. Record disagreements and **pause claims of conformance** for the affected dimension until ambiguities are resolved through public, versioned normative change.

### Immediate proposed test sequence

- **First:** F02, I01, I02, S01, N01 using the existing quickstart, without changing its signed bytes.
- **Second:** F01, F03–F18, P01–P06 with new isolated parser/profiles and freshly signed fixtures where needed.
- **Third:** R01–R03 and T01–T03 with explicit trust evidence.
- **Fourth:** independent cross-implementation comparison plus a short reproducible execution report.

Recorded executions are linked above with their fixture bytes, source pins and limits. Prior reference-verifier timestamp CI remains separate evidence; T02/T03 now have their own dated replay and automated step in the standard's workflow. No complete independent implementation or production-emission conformance is claimed.

## 4. What this file does not approve

- It does **not** introduce new mandatory civil identity, IPI, ISRC, ISWC, ISBN or UID_AUTH for Core AURA.
- It does **not** decide a canonical ULID migration, lift the published fixed verifier anchor, define a linked-evidence hash recipe, or alter the current open [music/linked-evidence PR #21](https://github.com/romainbenabdelkader/AURA-STANDARD/pull/21).
- It does **not** create a normative schema 1.2, specification release 1.3.0, external certification or a verified independent implementation.
- It does **not** revise hashes, old signed declarations, test keys, archives, release tags or DOI records.
