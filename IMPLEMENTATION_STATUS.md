# Implementation status and registry profile

Status checked after verifier publication, 2026-11-03. This note does not change the frozen
manifest schemas, historical examples, conformance levels or archived releases.

## Keep these coordinates separate

- Standard archive v1.2.1: https://doi.org/10.5281/zenodo.22071523
- Manifest schemas: 1.0 and 1.1 (schema files v1.0.0 and v1.1.0).
- Historical verifier archive v1.1.0: https://doi.org/10.5281/zenodo.22069698
- Historical verifier archive v1.2.0: https://doi.org/10.5281/zenodo.23857156
- Historical verifier archive v1.2.1: https://doi.org/10.5281/zenodo.23898686
- Published verifier v1.2.2: [GitHub release](https://github.com/romainbenabdelkader/AURA-VERIFIER/releases/tag/v1.2.2),
  [Zenodo archive](https://doi.org/10.5281/zenodo.23917182).
- Verifier source commit: `08d7c70404bab16e2e3b09bb9e59aefaf6fa5391`.

The standard's current branch includes documentation updates after its v1.2.1
archive. They are not retroactively part of that archived release. Verifier
v1.2.2 corrects input-error reporting in both engines and the CLI. It preserves
completed integrity checks when PEM decoding fails and identifies JSON parsing
errors without fabricating verification results. Cryptographic primitives and
validation policies are unchanged. No new manifest schema version is introduced.

Historical manifest anchors refer to their original artifacts. Do not rewrite a
signed anchor to point to new code. Record the actually executed verifier commit
and test report separately. A passing package is not certification of its issuer
or of every behavior of the implementation that created it.

## Published verifier v1.2.2 archive and web deployment

The version-specific [Zenodo record](https://doi.org/10.5281/zenodo.23917182) stores
`romainbenabdelkader/AURA-VERIFIER-v1.2.2.zip` (147860 bytes):

```text
SHA-256  512d1b8810f9f630b46737c6d8513c2ed4159c3c118ad4f9272a60b38659a21a
SHA3-256 43e907d8dbf5c64a5e1af32e928e37a927202ec7461f16985a730ef824e6f13e
```

All 86 source files match released commit `08d7c70404bab16e2e3b09bb9e59aefaf6fa5391`
byte for byte. These hashes identify the exact Zenodo ZIP, not a repacked archive.

On 2026-11-03, all 17 JavaScript modules under `src/`, plus `web/app.js`,
`web/index.html`, `web/styles.css` and `package.json`, served by
https://verify.aura-standard.org/ matched the same commit: 21 files in total.
This is a dated deployment check, not a permanent version pin for that URL.

The [release-source test run](https://github.com/romainbenabdelkader/AURA-VERIFIER/actions/runs/41633148733)
passed Node 20/22/24 regression and RFC 3161 suites and the three-browser suite.
Tested PR commit `2fed47de0075ea4cf5b0c37a5015f5de13fc1dc4` and the release commit
have the same source tree. The tests include 32 focused API/CLI error cases;
each browser runs 137 NIST vectors, 58 UI reports and five JSON-error displays,
with no external page requests. Playwright WebKit is not the Safari application.

PEM decoding failures now yield an invalid report preserving completed checks;
unavailable fingerprints and pin comparisons remain null. JSON parsing errors
still reject the API promise as a typed input error; `verify --json` emits an
`input_error` object and exits 2 without verification dimensions. See the
[pinned input-error contract](https://github.com/romainbenabdelkader/AURA-VERIFIER/blob/08d7c70404bab16e2e3b09bb9e59aefaf6fa5391/INTEGRATORS.md#input-errors-in-the-javascript-api-and-cli).
These checks do not establish external audit certification or issuer authority.

## Historical v1.2.1 archive and deployment check

The version-specific Zenodo record stores
`romainbenabdelkader/AURA-VERIFIER-v1.2.1.zip` (142242 bytes):

```text
SHA-256  d8a3b9ada26a968c8cf957e2b3f22527cc89e28319e53675be43af6b8cf04dee
SHA3-256 f3752f03b97c70c19949e870467289b407f9b7e33e4e819dfdd15770a62c6355
```

All 83 source files match released commit `e1fa13c4fb253c2e07a99538524b869028bb62b4`
byte for byte. These hashes identify the exact Zenodo ZIP, not a repacked archive.

On 2026-11-02, all 16 JavaScript modules under `src/`, plus `web/app.js`,
`web/index.html`, `web/styles.css` and `package.json`, served by
https://verify.aura-standard.org/ matched the same commit. This is a dated
comparison of 20 served files, not a permanent version pin for that URL.

The [release-source test run](https://github.com/romainbenabdelkader/AURA-VERIFIER/actions/runs/41534767038)
passed Node 20/22/24 core and timestamp suites and the browser suite. Its PR
commit `7f0e998736de3077f1aad1cd6b2f8d603856afd0` and the release merge commit
have the same source tree. Local Chromium, Firefox and Playwright WebKit each
passed 52 UI cases and 137 NIST vectors with no external page requests.
Playwright WebKit is not the Safari application. These checks do not establish
certification, issuer authority or institutional acceptance.

## Historical v1.2.0 archive and deployment check

The version-specific Zenodo record stores
`romainbenabdelkader/AURA-VERIFIER-v1.2.0.zip` (141181 bytes):

```text
SHA-256  9fa7e50ca2239a5cb2174ba2ae3e57298cc45b9ddeb0d726115d5f4ee45cd18c
SHA3-256 fe8959b54a88737f423239a5cc7e9f9636348c333c436b25152202fc22105996
```

All 83 source files in that archive were compared byte for byte with the released
commit. These digests identify the ZIP bytes, not an extracted directory or a
repacked archive. GitHub's "Source code (zip)" download uses a different ZIP
container and therefore has different archive digests despite identical source
files. Use the exact named Zenodo file when referencing its archive digest.

The [web verifier](https://verify.aura-standard.org/web/) was checked on
2026-11-01 after the successful
[deployment run](https://github.com/romainbenabdelkader/AURA-VERIFIER/actions/runs/41300503258).
Nine served files matched the released commit: `package.json`, `src/sha3.js`,
`src/pem.js`, `src/report.js`, `src/issuer-check.js`, `src/verify-web.js`,
`src/webcrypto-key.js`, `web/app.js` and `web/index.html`. A browser check also
accepted a valid test package and rejected its altered asset. This is a dated
deployment check, not a permanent version pin for that URL.

The released source's
[test run](https://github.com/romainbenabdelkader/AURA-VERIFIER/actions/runs/41300503419)
passed. Reproduction instructions and test scope are in the
[v1.2.0 audit notes](https://github.com/romainbenabdelkader/AURA-VERIFIER/blob/6b1a631a9febdd724cfa819c67ec9d285179c27c/docs/AUDIT_CORRECTIONS.md).
These checks do not establish certification or institutional acceptance.

## Current local issuer.json profile

TPKR.md describes a conceptual registry model. It is not directly the JSON input
contract of AURA-VERIFIER. That implementation accepts one caller-supplied issuer
snapshot with these fields:

- public_key_fingerprint_sha256 and public_key_fingerprint_sha3_256: both digests
  of the provided public key's DER/SPKI bytes; both must match.
- status: active for a warning-free current record. A matching record marked
  revoked is refused in v1.2.0, v1.2.1 and v1.2.2. Other non-active states warn.
- revoked_keys: optional array of key records. A matching SHA-256 OR SHA3-256
  fingerprint is a hard failure, independent of the declared issuance date.
- issuer: optional issuer identifier (issuer_id is also recognized).
  Present identifiers must agree with the signed metadata.
- key_id: informational current-key label. It is not a substitute for fingerprint
  verification and may differ from an old key's label after rotation.

The public key is supplied separately; a signed embedded key, when present, must
match it. Copying TPKR's illustrative public_key field into issuer.json is not an
implemented resolver or an interoperability test. No remote registry is required
when the key and snapshot are supplied locally.

Snapshot authenticity and freshness are not established by these checks. The
keyStatusCheck/registryTrust report fields expose that boundary. A false
legacy keyRevoked flag without a supplied registry is not evidence of current
non-revocation. An unknown issuer identity is not a failed mathematical signature.

## Local verifier policy retained through v1.2.2

Duplicate names in raw manifest/registry JSON are rejected, recognized asset-hash
aliases must agree, and missing asset bytes are never reported as verified.
Null legacy hash aliases remain absence of a hash. Declared dates receive syntax,
calendar and offset checks independently of the base-schema result. Leap-second
validity is explicitly unassessed. Present issuer identifiers and signed key
labels must agree. These are documented local acceptance policies, not a new
normative schema or a guarantee that a declared date or identity is true.

Dates are not compared with a clock: a syntactically valid future date does not
produce a future-date warning in v1.2.0. Keys matched as revoked in the supplied
registry are rejected even when the manifest declares an earlier issuance date.
Historical validity remains unassessed; the declared date alone cannot establish
that signing preceded a compromise. Historical `0.1-pilot` manifests remain
unsupported. Preserve original signed evidence and assess its history separately.

## Open specification work

The following gaps are not resolved by verifier publication or by this note:

- **Music identifiers:** the base schemas allow extensions but define no ISRC,
  ISWC or DDEX identifier field convention. A shared profile needs versioned
  field paths, semantics, validation and positive/negative interoperability
  vectors. Existing signed extension fields must not be silently rewritten.
- **Linked manifest digests:** v1.1 defines `prior_evidence[].manifest_hash` as
  a string, without a normative algorithm or byte/canonicalization rule. The
  [corrected quickstart](examples/quickstart-v1.1/CORRECTION.md) explicitly hashes
  the original file bytes with SHA3-256. That existing convention must be
  accounted for in any future versioned definition.
- **Timestamp versus linked-evidence digest:** the verifier's
  [RFC 3161 implementation](https://github.com/romainbenabdelkader/AURA-VERIFIER/blob/6b1a631a9febdd724cfa819c67ec9d285179c27c/docs/RFC3161_TIMESTAMP.md#exact-canonical-preimage)
  already defines SHA-256 over UTF-8 JCS of the complete signed manifest,
  including its signature. Its companion SHA3-256 uses that same canonical
  object. This does not normatively define `prior_evidence.manifest_hash` and
  must not silently replace a link to original file bytes. The general verifier
  does not resolve and validate the linked evidence chain.

Agree the field/digest semantics, compatibility rules and test vectors before
selecting a future profile or schema version. No v1.3.0 specification is created
by this documentation update.

## Publication and review

A reviewed release must identify an exact source commit, archive and checksum.
Preserve old archives. Publish a version-specific DOI only when that version
exists. Browser/platform tests and maintainer tests do not replace an independent
review. No claim of institutional standardization follows from publication.
