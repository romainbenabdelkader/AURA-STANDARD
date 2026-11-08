# Proposed implementation contract

Discussion draft, 2026-11-01. These are proposed application and reporting rules,
not additions to the published schemas or behavior of AURA-VERIFIER v1.2.0.
The [proposal](README.md) defines the candidate signed fields. This document
defines how a future application would decide whether its requested checks have
completed. It does not establish ownership, civil identity or historical validity.

## Checks and application decisions

Each check returns one of the following exact status strings, with a reason code
and relevant evidence references. Human-readable explanations supplement these
fields; consumers must not infer a decision by parsing prose.

| Check status | Meaning |
|---|---|
| `pass` | The named check ran and its stated condition was satisfied. |
| `fail` | The named check ran and found a contradiction or invalid input. |
| `not_checked` | Evidence or processing is missing; no positive result. |
| `unsupported` | This implementation does not support the requested version, method or operation. |
| `not_applicable` | This dimension was not claimed or does not apply in this context. It cannot satisfy an application that explicitly requires it. |

The application supplies a nonempty list of required check identifiers **outside
the signed manifest**. Check results come from local verification, never from an
issuer-supplied report, manifest field or untrusted imported JSON. If there are
no requested checks, report `not_requested`, not acceptance. A missing required
check is equivalent to `not_checked` for the decision, with reason
`missing_result`; it must not disappear from the output.

| Application decision | Condition |
|---|---|
| `accepted` | Every required check is `pass`. |
| `rejected` | At least one required check is `fail`; preserve incomplete dimensions too. |
| `incomplete` | No required check failed, but at least one is missing, not checked, unsupported or not applicable. |
| `not_requested` | The application requested no checks. This says nothing about validity. |

Unknown status strings and malformed result records are integration errors:
stop acceptance and expose the error. An optional failed dimension remains
visible even if it is not part of a particular application's acceptance policy.
The decision must always include the exact required-check list and all observed
results. Never replace the released verifier's overall result with this narrower
decision or display an unqualified “valid proof” from it.

## Required dimensions

For a music declaration associated with a supplied file, require base-schema
acceptance, current-manifest signature verification, issuer/key checks selected
by the application's trust policy, music structure/version, ISRC syntax, supplied
ISWC syntax/checksums and matching asset bytes. A missing music declaration does
not satisfy a music-required policy. If no work codes are declared, the checksum
dimension is `not_applicable` with reason `no_work_codes_declared`; require it
only when work codes are supplied or the application explicitly requires them.
While the ISWC calculation remains unreviewed and unimplemented, a supplied ISWC
must not receive `pass` for its checksum from this proposal's experiments.

For an authenticated direct reference, require the referring manifest's base,
signature and selected issuer/key checks, the explicit supported link method,
matching original-file digest, supported target base schema, exact UID match and
self-reference check. Keep target signature, target issuer/key status and
historical validity separate. A consumer requiring valid target evidence must
also require those target checks under an explicit policy. A current revoked-key
failure cannot be converted into historical validity by a timestamp or a link.

An all-links policy expands requirements to **every declared direct link** by
its array index, including absent target files. It cannot shrink the list to
only the successfully loaded targets. No recursive expansion or remote fetching.
Legacy links without a method are `unsupported` for the proposed explicit-method
check, with reason `legacy_method_unspecified`; preserve any separately reported
historical interpretation.

## Suggested prototype resource policy

These are adjustable local processing limits for the proposed prototype. They
are not identifier cardinality rules or new grounds for rejecting historical
AURA evidence. Report the configured limits and observed counts with the result.

| Metric | Inclusive default limit | Counting rule |
|---|---:|---|
| `manifest_bytes` | 2,097,152 (2 MiB) | Original bytes of each referring or target manifest, including BOM and whitespace, before decoding. |
| `total_manifest_bytes` | 16,777,216 (16 MiB) | All manifest inputs in the operation, counting each supplied file once, including duplicate file inputs; not re-counting one input referenced by several links. |
| `json_depth` | 64 | Root container has depth 1; each nested object/array adds 1. Scalars do not add container depth. Strings containing brackets do not affect depth. |
| `json_values` | 100,000 | Containers and scalar values per manifest, including the root; object property names are not counted as additional values. |
| `direct_links` | 64 | Items in the referring manifest's declared list, including malformed, duplicate and unresolved entries. |
| `work_iswcs` | 128 | Entries supplied in the music declaration, before any validation; no deduplication. |

The byte limits bound buffered metadata; container/value limits bound parsing
work; list limits bound one local verification operation. These starting values
require integrator and browser measurements before adoption. They do not limit
the audio asset's size, and are not benchmarks or claims of denial-of-service
resistance. Check byte limits before text loading, and enforce structural limits
with a bounded parser that correctly handles strings and escapes. Do not parse
an unbounded structure first and then claim that it was protected by these limits.

Exceeding a limit yields `not_checked` with reason `resource_limit`, not `fail`:
the evidence has not thereby been shown invalid. Equality with a limit is
allowed. Never truncate inputs and validate the remainder. Unknown, negative,
fractional or missing measurements are errors, not zero. A fresh operation may
use an explicitly adjusted application policy; signed input cannot adjust it.

## Executable decision experiment and next gate

Run `node proposals/2026-11-music-and-linked-evidence/decision-experiment.mjs`.
It exercises synthetic result combinations and resource-count boundaries only.
It neither parses manifests nor measures their resources, implements the music
or link checks, verifies signatures, nor validates the ISWC formula. Its results
do not constitute execution of the 40 extension acceptance cases in
[TEST_PLAN.md](TEST_PLAN.md).

Before implementation, review these decision names, required dimensions and
limits with an integrator, resolve the ISWC source gap, and settle the versioned
JSON-LD treatment. Then implement bounded input handling and run the complete
extension cases in both verifier engines. The draft remains unadopted.
