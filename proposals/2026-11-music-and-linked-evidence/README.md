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

Proposed version-1 contract:

| Field | Meaning and local checks |
|---|---|
| `declarations.music_identifiers` | Optional object; its presence requests this extension's checks. |
| `version` | Required string `"1"`; an unknown version is unsupported, never silently treated as version 1. |
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
are rejected. Work-only declarations, multi-track files, catalogues, medleys,
component relationships, contributor roles, IPI numbers and share allocations
need a separately reviewed scope rather than an implicit mapping in this first
extension.

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
requiring the extension must require an explicit supported-version result.
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
  `aura_uid` equals the link's UID. Reject duplicate decoded property names and
  invalid UTF-8 when interpreting target identity. Detect a UTF-8 BOM only after
  hashing; remove at most that leading marker for parsing, while retaining it
  in the hashed bytes. A self-reference to the current UID is rejected in this
  proposed profile.

A matching file digest and UID establishes reference integrity only. It does not
establish the target's signature validity, issuer authority, key status, date,
archive resolution or truth. Expose those dimensions separately. A revoked target
key does not change which bytes were referenced and is not made valid by linking
to them. Historical validity remains a separate assessment.

### Compatibility and incomplete verification

| Situation | Proposed link result |
|---|---|
| Known method, supplied bytes, matching digest and UID | Reference integrity matches; target verification remains a separate result. |
| Missing target file | Not checked / incomplete, never a verified chain. |
| Wrong bytes or wrong target UID | Link check fails, even if the current manifest's own signature is valid. |
| Missing method on an older link | Legacy method unspecified; use a separately documented historical convention if available, never guess by trying algorithms until one matches. |
| Unknown method | Unsupported; no fallback to the proposed method. |
| Duplicate JSON names or invalid target text | A raw byte match may be reported, but target identity/link verification fails. Preserve the original file. |
| Target uses 0.1-pilot or lacks a supported UID | Byte comparison alone is possible; target-format verification is unsupported. Do not invent a current-format UID or claim a verified AURA 1.x chain. |

Check only the directly supplied link in the initial implementation. No automatic
remote resolution, recursive chain traversal or implicit trust inheritance.
Document resource limits; reaching one yields incomplete/error, never success.

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
implementation.

[TEST_PLAN.md](TEST_PLAN.md) lists prospective acceptance tests. They have **not**
been executed as extension tests because these extensions are not implemented.
Before a normative release:

1. Review the recording-only scope, names, cardinality, method selector and
   incomplete/unsupported result semantics with an actual integrator.
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
