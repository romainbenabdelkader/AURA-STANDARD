# Prospective acceptance cases — not yet executed

These cases review the contract in [README.md](README.md). They are requirements
for a future implementation, not a claim that AURA-VERIFIER v1.2.0 checks these
extensions. Existing base-schema and cryptographic dimensions remain separate.

## Music extension

| ID | Input or operation | Expected observation |
|---|---|---|
| M01 | One asset-bound recording with canonical ISRC and published valid ISWC example | Extension structure and identifier checks pass; allocation, ownership and work association remain unassessed. |
| M02 | Same recording with `work_iswcs` omitted | No work identifiers supplied; not interpreted as no work or no rights. |
| M03 | Empty list, duplicate code, numeric code or null | Extension check fails; never silently coerce or deduplicate. |
| M04 | Lowercase or hyphenated ISRC; dotted ISWC | Noncanonical signed wire representation; no mutation, no claim that the human-readable identifier is intrinsically invalid. |
| M05 | Non-ASCII letter/digit, invisible character, extra prefix or suffix, trailing newline | Extension encoding check fails. A prefix-only regex match is insufficient. |
| M06 | ISRC shape valid but prefix/allocation not checked against a trusted source | Syntax-only result; no unqualified “ISRC valid” or ownership claim. |
| M07 | ISWC `T0345246801` from the authority's code description; change only the check digit to `2` | Positive checksum control and negative checksum control after the authoritative algorithm is reviewed. |
| M08 | ISWC work-number component zero, wrong length, wrong prefix, malformed checksum | Appropriate range/format/checksum failures are distinguished. |
| M09 | Music extension plus existing TDM `profile` and boolean reservation | Both dimensions checked; replacing reservation with string `"true"` still fails TDM checks. |
| M10 | Replace the TDM profile value with a music label or move it to a `profiles` array | Must not be presented as preserved TDM-profile conformance. |
| M11 | Extension absent, unknown version, unknown key, or missing asset-hash binding | Absent is not claimed; unknown version unsupported; unknown key or missing required binding fails the claimed extension. |
| M12 | Extension present but asset bytes absent | Local syntax can be checked; exact file association is incomplete. |
| M13 | Same logical recording supplied in different encodings | ISRC association is a declaration; each different file still needs its own matching asset hash. |
| M14 | Older verifier accepts the base package | Consumer requiring music support refuses to infer support from the old overall result. |
| M15 | Historical identifiers in `links` or arbitrary declarations | Preserve bytes; no automatic extension activation, migration or conflict repair. |
| M16 | Mutation of the new signed extension after signing | Signature fails; reporting never verifies an unsigned replacement declaration. |
| M17 | Extension value is null, false, an array or a string; version missing, empty or non-string | Claimed but malformed; not silently treated as absent or supported. |
| M18 | One recording, including a medley, with several distinct canonical work identifiers | Flat declared associations accepted when checks pass; no inference of work order, completeness, allocation or component rights. |
| M19 | Supported version but failed checksum, signature or required asset binding | A consumer requiring the extension refuses acceptance; recognizing the version alone is insufficient. |
| M20 | Signed AURA 1.0 and 1.1 packages carrying the declaration; unsupported base version | Supported base formats retain separate base checks; the declaration does not activate support for another format. |

## Linked evidence

| ID | Input or operation | Expected observation |
|---|---|---|
| H01 | Explicit `sha3-256-file-v1`, original target file, supported target schema and matching UID | Byte and identity binding match; referring authentication and target signature/trust remain separate. |
| H02 | Same JSON object, changed indentation or property order | Original-file digest changes; proposed exact-file link fails unless it actually names those new bytes. |
| H03 | LF changed to CRLF, or UTF-8 BOM added/removed | Raw digest changes. A single leading BOM remains in the hash and is removed only after fatal decoding for identity parsing. Double BOM or stray BOM outside a string fails parsing. |
| H04 | File hash replaced by complete-JCS hash or unsigned-payload hash | Reject as a mismatch for the declared file method. |
| H05 | Target signature field changes | Complete-file digest changes; the field is not excluded from link hashing. |
| H06 | Method missing or unknown | Legacy-unspecified or unsupported respectively; no guessing and no new base-schema rejection of historical inputs. |
| H07 | Uppercase digest hex, malformed prefix, wrong length or trailing whitespace | Explicit method's encoding check fails. |
| H08 | Correct digest but wrong UID in link | Identity binding fails. A byte match alone is insufficient. |
| H09 | Duplicate target property names, including escaped equivalents | Byte match can be reported, but parsed identity/link verification fails. |
| H10 | Invalid UTF-8 target bytes | Exact-byte comparison remains possible; target identity verification fails. |
| H11 | Missing target, unsupported 0.1-pilot target or exceeded processing limit | Not checked, unsupported or incomplete as appropriate; never a verified chain. |
| H12 | Current manifest references its own UID | Proposed-profile failure; no recursive retrieval. |
| H13 | Target key revoked or target signature invalid | Preserve the separate byte-link result; do not label target evidence valid or restore historical validity. |
| H14 | Target has further prior-evidence links | One direct link only; no silent transitive verification or trust inheritance. |
| H15 | Method changed after referring manifest was signed | Referring signature fails; no unsigned method override. |
| H16 | Original quickstart link without method | Existing fixture and signature remain unchanged; reproduce its documented historical raw-byte recipe separately. |
| H17 | Matching digest/UID but supported target missing other required schema fields, or UID has a trailing newline | Raw match remains visible; supported target identity/link acceptance fails. |
| H18 | Matching target with failed or unchecked referring signature/trust | Report only an unauthenticated comparison; no authenticated issuer-reference claim. |
| H19 | Ordinary text loaders remove BOM or replace invalid UTF-8 before hashing | Demonstrate why re-encoded text is not the original file input. Strict identity decoding rejects malformed UTF-8. |
| H20 | One direct link matches while another required link is missing, unsupported or over a processing limit | Per-item results remain visible; an all-links-required consumer does not report overall success. |

The runnable digest experiment covers the hash-input distinction relevant to
H02, CRLF and a single BOM in H03, H04, H05 and the existing H16 fixture. It
also reproduces the input-conversion observations in H19 and exercises the
released duplicate-name parser. It does not implement these proposed result
policies or execute the remaining acceptance cases.

The separate [decision experiment](decision-experiment.mjs) exercises synthetic
required-check aggregation and numeric count boundaries, including the decision
principle in H20. It does not construct signed packages, parse input files,
measure resources or execute H20 as a complete extension test. Proposed counts
and result meanings are in [IMPLEMENTATION_CONTRACT.md](IMPLEMENTATION_CONTRACT.md).

## Integration and preservation

For the future implementation, run both Node and WebCrypto checks on new signed
fictional packages with and without the TDM profile. Compare base schemas,
contexts, historical signed fixtures and archives byte for byte before and after.
Keep old manifests' existing signature/verifier outcomes stable unless a
separately documented security correction requires otherwise. Verify that neither
extension silently enables network access. Report extension support and any
incomplete dimensions explicitly to downstream consumers.
