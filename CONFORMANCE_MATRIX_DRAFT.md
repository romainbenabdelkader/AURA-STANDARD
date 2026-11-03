# AURA v1.x — independent conformance test matrix (proposal)

**Status: PROPOSED TEST PLAN ONLY — NOT AN EXECUTED TEST SUITE OR NEW NORMATIVE RULE.**  
**Prepared:** 2026-11-03, on documentation-only consolidation branch.  
**Baseline:** published AURA-STANDARD v1.2.1; base manifest schemas `aura_version: "1.0"` and `"1.1"`; optional TDM overlay v1.0.  
**Reference:** [AURA-CORE-v1.x.md](AURA-CORE-v1.x.md) and [CONSOLIDATION_REVIEW.md](CONSOLIDATION_REVIEW.md).

This matrix identifies what an independent implementation should check **against existing published rules**, what is only a reference-verifier policy, and what still needs a normative decision. No new manifest, modified proof, execution report, signed vector, script, or expected machine-readable golden report is published by this file.

## 1. What counts as a result

Every future test report should identify: test ID; exact fixture/asset/key bytes and SHA-256/SHA3-256 checksums; selected schema and profile; verifier name/version/source commit; runtime/platform; schema outcome; signature outcome; asset-binding outcome; optional profile outcome; key/registry trust outcome; independent timestamp outcome; source-of-trust status; network observation if applicable; overall application policy; and exact reason when any check did not run.

Use these dimensions rather than collapsing unrelated facts into `VALID` or `INVALID`. In particular, schema acceptance is **not** issuer authority, cryptographic validity is **not** ownership, and missing trust material is **not** evidence of non-revocation. If a check is unsupported or not performed, it must not be described as passed.

### Source classification

- **S** — existing published JSON-schema requirement (check with a conforming JSON Schema 2020-12 engine; account for the selected format-checking vocabulary).
- **C** — existing AURA [CONFORMANCE.md](CONFORMANCE.md), [TEST_VECTORS.md](TEST_VECTORS.md), or TDM profile requirement; apply only at the indicated level or profile.
- **V** — documented **reference verifier local policy**, not automatically a requirement of the base schema.
- **O** — **open normative question**: document the present behavior; **do not** silently establish a new conformance gate.

## 2. Test cases — planned, not executed

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
| F17 | S/O | `prior_evidence[].manifest_hash` is any nonempty string | `baseSchema=pass` when other constraints hold; no normative digest interpretation follows | Base v1.1 schema; C-03 |
| F18 | S | `prior_evidence[].manifest_hash` is not a string | `baseSchema=fail` | Base v1.1 schema |
| I01 | C | Asset bytes match a declared supported SHA3-256 asset hash | `assetIntegrity=pass` when explicitly checked | CONFORMANCE; quickstart |
| I02 | C | Modify one asset byte with unchanged signed manifest | `assetIntegrity=fail` and report separately from signature | CONFORMANCE |
| I03 | C | Fileless catalogue manifest without an asset hash | `assetIntegrity=not_applicable`, **not** verified | CONFORMANCE |
| I04 | C | Asset omitted but hash declared | `assetIntegrity=not_checked` (or equivalent incomplete), never "matched" | CONFORMANCE; implementation status |
| S01 | C | Change signed declaration without re-signing | `signature=fail` with unchanged key | CONFORMANCE; TEST_VECTORS |
| S02 | C | Sign the correct JCS preimage using a fresh test-only Ed25519 key | `signature=pass` with matching public key, independent of identity claims | GLOSSARY; CONFORMANCE |
| S03 | C | Verify a correct signed payload against a different public key | `signature=fail`; identity assertion not established | CONFORMANCE |
| S04 | C | Use a different JSON whitespace/property-order serialization with identical parsed values and freshly signed canonical payload | Canonical signature result **should be invariant** if the same JCS object is recovered; preserve exact semantic JSON value | GLOSSARY; RFC 8785 |
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
| T02 | C | Verifiable detached RFC 3161 token with complete signed-manifest canonical preimage and trusted time evidence | `independentTimestamp=pass` only if all token, binding and supplied trust checks succeed | CONFORMANCE; GLOSSARY; verifier timestamp documentation |
| T03 | C | RFC 3161 response over the wrong manifest digest | `timestampBinding=fail` independently of ordinary signature validity | CONFORMANCE; verifier timestamp documentation |
| V01 | V | Duplicate JSON object member names in raw manifest | **Reference verifier** rejects; do not claim base JSON Schema alone expresses this | IMPLEMENTATION_STATUS |
| V02 | V | Recognized asset-hash aliases disagree | **Reference verifier** rejects; aliases are implementation-local policy | IMPLEMENTATION_STATUS |
| V03 | V | Impossible calendar `issued_at` value | **Reference verifier** rejects under local date policy; standard's `format` handling must be specified per chosen JSON Schema validator | IMPLEMENTATION_STATUS |
| N01 | C | All evidence, key and trust material provided locally; network disabled | Core cryptographic verification must succeed/fail solely on supplied materials with **zero required** account, telemetry or remote fetches | CONFORMANCE; PRIVACY |
| N02 | C | Issuer uses scoped/pseudonymous identifier instead of published civil identity | Identity publication is not necessary for signature validity or core conformance | CONFORMANCE; PRIVACY |

## 3. Coverage gaps / release gates

This table is a **plan**, not a claim that 40+ fixtures exist or were executed. Existing current-format proof material in this repository is the [neutral quickstart](examples/quickstart-v1.1/README.md); [historical v0.1](TEST_VECTORS.md) test vectors are not current-format acceptance vectors.

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

No F/S/P/R/T/V/N row has been executed *as part of this documentation consolidation*. Any external or previously published test result must be cited separately with its exact commit, fixture, run and scope.

## 4. What this file does not approve

- It does **not** introduce new mandatory civil identity, IPI, ISRC, ISWC, ISBN or UID_AUTH for Core AURA.
- It does **not** decide a canonical ULID migration, lift the published fixed verifier anchor, define a linked-evidence hash recipe, or alter the current open [music/linked-evidence PR #21](https://github.com/romainbenabdelkader/AURA-STANDARD/pull/21).
- It does **not** create a normative schema 1.2, specification release 1.3.0, external certification or a verified independent implementation.
- It does **not** revise hashes, old signed declarations, test keys, archives, release tags or DOI records.
