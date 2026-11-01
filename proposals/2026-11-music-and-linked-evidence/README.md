# Proposal: music identifiers and explicit linked-evidence hashing

Status: **discussion draft, not adopted or implemented**, 2026-11-01.
Baseline: AURA-STANDARD `2ef46b04aae922eeb576606fa9b2ccb8c802a28a`;
reference verifier v1.2.0, `6b1a631a9febdd724cfa819c67ec9d285179c27c`.
The names below are proposed wire conventions, not published production fields.
No release number, schema change or conformance claim follows from this draft.

## Recommended decisions

1. Start with an optional, versioned declaration for **one asset-bound sound
   recording**, its ISRC and optional associated work identifiers. Keep the
   current top-level `profile` and TDM reservation behavior intact.
2. For new explicit prior-evidence links, specify SHA3-256 of the **complete
   original target file bytes**, including the signature. Add a signed method
   selector. Leave historical unqualified hashes uninterpreted unless their
   original external convention is known.
3. Keep the existing timestamp recipe separate: SHA-256 of the complete signed
   manifest canonicalized with JCS. Do not silently substitute it into old links.

## Music: distinguish identifiers from assertions

An ISRC identifies a recording, whereas an ISWC identifies a musical work.
Neither identifies the exact file bytes checked by AURA. These are the scopes
described by [IFPI](https://isrc.ifpi.org/) and the
[ISWC registration authority](https://www.iswc.org/iswc).

Proposed signed fragment, inside an otherwise complete manifest:

```json
{
  "declarations": {
    "music_identifiers": {
      "version": "1",
      "recording_isrc": "AA6QZ2000047",
      "work_iswcs": ["T0345246801"]
    }
  }
}
```

These are published syntax examples from the respective authorities, combined
only to illustrate the proposed structure. No real association between those
codes is asserted, and this fragment is not a signed evidence package.

This optional declaration is proposed for AURA 1.0 and 1.1 manifests only. It
does not add support for other base formats.

Proposed version-1 contract:

| Field | Meaning and local checks |
|---|---|
| `declarations.music_identifiers` | Optional object; the presence of this exact property requests checks, even if its value is malformed. Null, arrays, strings and booleans fail; they are not treated as absence. |
| `version` | Required nonempty string `"1"`; a missing, empty or non-string version fails structure checks. Another nonempty string is unsupported, never silently treated as version 1. |
| `recording_isrc` | Required string for the one recording declared to be embodied in the bound asset. Machine form: exactly `[A-Z]{2}[A-Z0-9]{3}[0-9]{7}`. |
| `work_iswcs` | Optional nonempty array of unique strings. Machine form: `T` plus nine work-number digits and one check digit; the work number is nonzero. Check-digit validation is also required before declaring extension checks complete. |

The three listed keys are the complete proposed version-1 object; unknown keys
inside it are rejected to expose misspellings. The enclosing declaration remains
extensible. The extension requires the existing `asset.hash_algorithm` and
`asset.hash` fields to describe a SHA3-256 asset binding. Without supplied asset
bytes, the association to the file remains unchecked.

`work_iswcs` is a list of identifiers the issuer associates with this recording,
not a claim that the repertoire list is exhaustive or that every code denotes a
different work. Historical duplicate ISWC assignments can remain in circulation
(ISO 15707:2022, Annex A.3.4). Omitting the list means no work identifiers were
supplied; it does not mean no musical work or rights exist. Exact duplicate strings
are rejected; list order carries no performance order or priority, although it
remains part of the signed JSON and must not be reordered after signing.

A single recording can embody several works, including a medley; see the
[IFPI ISRC Handbook, fourth edition, Annex B.1, p. 25](https://usisrc.org/wp-content/uploads/2024/11/ISRC_Handbook.pdf).
Such a recording can have one declared ISRC and several associated ISWCs here.
This flat list does not describe excerpts, timing, constituent recordings,
arrangements or a complete rights allocation. Work-only declarations, album or
catalogue mappings, component relationships, contributor roles, IPI numbers and
share allocations need a separately reviewed scope. A verifier checks the signed
declaration and file binding; it does not analyse the audio to establish that the
file actually contains the declared recording or works.

The wire form is deliberately stricter than human display forms. An issuer may
prepare canonical codes **before signing**; a verifier never strips separators,
changes case or repairs a signed value. A noncanonical wire value is an extension
encoding error, not proof that the underlying identifier was never assigned.
See IFPI Bulletin 2015/01, rev. 3, pp. 1–2,
[syntax and prefix validation](https://isrc.ifpi.org/images/downloads/Bulletin_2015-01_-_Validating_ISRC_Codes.pdf).

Syntax does not validate an allocated agency prefix, allocation to a recording,
database membership, the declared recording/work relationship or rightsholder
authority. Such checks need separately identified sources. In particular, do not
infer a recording date or nationality from ISRC components; IFPI distinguishes
the [year of reference from the recording year](https://isrc.ifpi.org/isrc-standard/isrc-structure).

### Composition with existing profiles

Keep `profile: "AURA_TDM_RIGHTS_RESERVATION_V1"` when that existing profile is
claimed, and keep `declarations.tdm_opt_out: true` alongside the new object.
The released verifier selects TDM checks from the singular `profile` field in
[`src/schema-check.js`](https://github.com/romainbenabdelkader/AURA-VERIFIER/blob/6b1a631a9febdd724cfa819c67ec9d285179c27c/src/schema-check.js).
Replacing that value with a music label, or merely moving it into a `profiles`
array, would not preserve its current selection behavior.

Report base-schema, signature, asset, TDM and music-extension results separately.
An older verifier may accept the base manifest while ignoring the new object;
its `valid` result is not evidence of music-extension support. An application
requiring the extension must require explicit passing structure and identifier
results for the supported version, the referring signature and its configured
trust checks, plus a matching asset digest when file binding is required.
Recognizing a version alone is insufficient. A consumer must choose those
requirements outside the manifest; a manifest cannot remove a required check by
omitting its extension.
Existing ad hoc `links` or `declarations` values are not auto-promoted into this
extension. Do not silently rewrite old signed metadata to resolve conflicts.

### Source limit before implementing the ISWC check digit

[ISO 15707:2022](https://www.iso.org/standard/83125.html), clauses 4.1–4.4,
specifies the structure and refers to Annex B for the calculation. The
[official member-body preview](https://preview.sist.si/sist-preview/83125/8adf68d27507472b892f3370f710813e/ISO-15707-2022.pdf)
consulted here ends before Annex B. The ISWC authority's
[third-party API specification](https://www.iswc.org/sites/iswc/files/files/2024-08/Specification%20-%203rd%20Party%20access.pdf),
section 2, printed pp. 10–11 and 22, distinguishes format, check-digit and database
membership checks. A database miss is not equivalent to a format error.

This draft does not claim a fully verified check-digit implementation. Before
adoption, review the complete authoritative calculation and independently replay
positive and negative vectors. No third-party example code is substituted for
that source review, and no online lookup is required for local format checks.
The source check on 2026-11-01 established the code structure and the distinction
between format, checksum and database lookup; it did not close the Annex B gap.
Consulting a complete authorized copy or a complete calculation published by the
registration authority remains necessary before claiming that review complete.

## Linked evidence: choose bytes explicitly

The current v1.1 schema constrains `manifest_hash` only to be a string. The
[existing quickstart correction](../../examples/quickstart-v1.1/CORRECTION.md)
already links to the exact bytes of an original manifest. Preserve that evidence.

In this first proposal, the referring manifest uses AURA 1.1; targets may use
AURA 1.0 or 1.1. Merely adding a `prior_evidence` property to a v1.0 manifest does
not activate these proposed link semantics.

Proposed fragment for a **new** v1.1 manifest's `prior_evidence` item:

```json
{
  "aura_uid": "aura:v1:01ARZ3NDEKTSV4RRFFQ69G5FAV",
  "manifest_hash": "sha3-256:0da4abe756b5720ed93306b17d10de7ac913b2496f6d8c0d047b6adf6e2e70a4",
  "manifest_hash_method": "sha3-256-file-v1"
}
```

The digest above identifies the existing public superseded quickstart file. This
fragment illustrates a future new declaration; it does not modify its existing
signed link. The proposed method selects:

- Input: the entire target manifest file as bytes, including its signature,
  whitespace and any byte-order mark. No text decoding/re-encoding, newline
  conversion, Unicode normalization or canonicalization precedes hashing.
- Algorithm and encoding: SHA3-256; the field contains `sha3-256:` followed by
  exactly 64 lowercase hexadecimal characters. No trailing newline or spaces
  in that field. The selector itself is covered by the referring signature.
- Transport: the original file bytes supplied locally, not ZIP bytes, base64
  transport text, an HTTP transfer envelope or a directory of extracted files.
- Supported target identity: a uniquely parsed AURA 1.0/1.1 JSON object whose
  `aura_uid` equals the link's UID. The target must pass its frozen base schema;
  its version must be exactly `"1.0"` or `"1.1"`, and its UID must match the
  published UID shape over the entire string, without trailing characters.
  Merely finding two plausible identifier fields is insufficient. Reject
  duplicate decoded property names and invalid UTF-8 when interpreting target
  identity. Detect a UTF-8 BOM only after hashing; remove at most that leading marker for parsing, while retaining it
  in the hashed bytes. A self-reference to the current UID is rejected in this
  proposed profile. This is a local consistency rule, not proof of global UID
  uniqueness.

Hash bytes before decoding. For identity checks, use fatal UTF-8 decoding with
BOM preservation, then remove at most one leading U+FEFF for parsing. A second
BOM, non-leading BOM outside a JSON string, or invalid UTF-8 is not repaired.
BOM acceptance is a proposed input rule for these links, not a statement that all
released manifest input paths already accept it consistently. Keep the original
bytes available and report the decoding rule used.

A matching file digest and UID establishes reference integrity only. It does not
establish the target's signature validity, issuer authority, key status, date,
archive resolution or truth. Expose those dimensions separately. If the referring
manifest's signature or required trust checks fail or were not performed, a raw
match is only an unauthenticated comparison; do not call it an authenticated
issuer reference. Target base-schema acceptance is not target-signature validity.
A revoked target key does not change which bytes were referenced and is not made
valid by linking to them. Historical validity remains a separate assessment.

### Compatibility and incomplete verification

| Situation | Proposed link result |
|---|---|
| Known method, supplied bytes, supported target schema and matching digest/UID | Reference integrity matches; referring authentication and target signature/trust remain separate results. |
| Missing target file | Not checked / incomplete, never a verified chain. |
| Wrong bytes or wrong target UID | Link check fails, even if the current manifest's own signature is valid. |
| Missing method on an older link | Legacy method unspecified; use a separately documented historical convention if available, never guess by trying algorithms until one matches. |
| Unknown method | Unsupported; no fallback to the proposed method. |
| Duplicate JSON names, invalid target text or malformed supported target schema | A raw byte match may be reported, but target identity/link verification fails. Preserve the original file. |
| Target uses 0.1-pilot or lacks a supported UID | Byte comparison alone is possible; target-format verification is unsupported. Do not invent a current-format UID or claim a verified AURA 1.x chain. |

Check only the directly supplied link in the initial implementation. No automatic
remote resolution, recursive chain traversal or implicit trust inheritance.
Document resource limits; reaching one yields incomplete/error, never success.
An application requiring every supplied direct link to be checked must not turn
partial results into overall success. Numeric limits for bytes, nesting and item
counts, and the machine-readable result vocabulary, remain adoption decisions.
[IMPLEMENTATION_CONTRACT.md](IMPLEMENTATION_CONTRACT.md) proposes initial limits
and explicit application decisions; its synthetic experiment does not implement
input parsing or either extension.

Historical unqualified hashes, including the quickstart link, stay unchanged.
If new information is needed, issue a new signed statement with its own UID and
declared issuance time. Neither a new link nor a later timestamp restores an
earlier date or establishes pre-compromise validity.

## Keep timestamp and signature inputs distinct

| Operation | Existing or proposed input |
|---|---|
| Existing Ed25519 signature | JCS of the unsigned manifest under the existing signing rule. |
| Existing verifier RFC 3161 request | SHA-256 of UTF-8 JCS of the complete signed manifest, including `signature`. |
| Proposed explicit linked-evidence method | SHA3-256 of the exact complete original target file bytes. |

The timestamp implementation also exposes SHA3-256 of its canonical object; that
value is **not** the proposed file digest. [RFC 3161 section 2.4.1](https://www.rfc-editor.org/rfc/rfc3161.html#section-2.4.1) defines a hash
algorithm and digest in `messageImprint`; the particular AURA input recipe comes
from the [released verifier documentation](https://github.com/romainbenabdelkader/AURA-VERIFIER/blob/6b1a631a9febdd724cfa819c67ec9d285179c27c/docs/RFC3161_TIMESTAMP.md#exact-canonical-preimage).
[RFC 8785 sections 3.1 and 3.2](https://www.rfc-editor.org/rfc/rfc8785.html#section-3)
govern JCS input and serialization. No general equivalence between raw-file and
canonical-object digests is asserted.

## Experiment, future tests and adoption gates

`digest-experiment.mjs` reproduces the byte-versus-canonical distinction using
the existing public quickstart files without writing to them. Its fixed results
are in `expected-digests.json`. It is a hashing experiment, not an implementation
of either proposed extension or a new independent verifier.

```sh
node proposals/2026-11-music-and-linked-evidence/digest-experiment.mjs /path/to/AURA-VERIFIER
```

The verifier checkout must be exactly the released commit stated above with the
imported source files unchanged. No private keys, account, timestamp request or
network access is needed. The experiment demonstrates that presentation changes
can preserve the canonical digest while changing the original-file digest.
It also distinguishes the complete signed object from the unsigned payload.
The canonicalizer is the released implementation, not a second independent JCS
implementation. The experiment also includes a BOM-bearing variant and shows why
ordinary text loading is insufficient: `Buffer.toString('utf8')` retains its BOM,
whereas `Blob.text()` removes it; invalid bytes can be replaced with U+FFFD.
These are input-conversion observations, not evidence that a signature was forged.
The proposed link path must retain the bytes and use explicit strict decoding.

[TEST_PLAN.md](TEST_PLAN.md) lists prospective acceptance tests. They have **not**
been executed as extension tests because these extensions are not implemented.
The separate `decision-experiment.mjs` exercises synthetic decision combinations
and resource-count boundaries from the proposed implementation contract. It does
not execute the 40 extension acceptance cases.

Before a normative release:

1. Review the recording-only scope, names, cardinality, method selector and
   incomplete/unsupported result semantics with an actual integrator. Set and
   test numeric processing limits and a stable machine-readable result contract.
2. Complete the ISWC algorithm source review; implement versioned optional schema
   overlays and semantic checks in both verifier engines, preserving TDM checks.
3. Decide an explicitly versioned JSON-LD context treatment. The current context
   does not define these new terms; signed JSON support alone is not a JSON-LD
   interoperability demonstration. Never modify the existing context in place.
4. Execute the planned positive, negative, downgrade and preservation cases;
   have a separate implementation reproduce the agreed contract.
5. Apply the existing [versioning policy](../../specs/Standard_Status_and_Versioning.md),
   publish coordinated artifacts and compatibility notes. An opt-in additive
   capability can be considered for a minor release; changing old signed meaning
   would require a different compatibility decision. No v1.3.0 is assigned here.
