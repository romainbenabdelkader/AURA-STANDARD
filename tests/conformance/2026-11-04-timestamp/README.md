# T02/T03 — detached RFC 3161 replay, 4 November 2026

This supplemental record connects two matrix rows to executable checks against
AURA-VERIFIER **v1.2.2**, commit `08d7c70404bab16e2e3b09bb9e59aefaf6fa5391`.
It uses the verifier's existing fixtures and timestamp suites unchanged.
The [71-variant dossier](../2026-11-03/README.md) remains a separate historical record.

| Case | Inputs | Required observation |
| --- | --- | --- |
| T02 | Preserved v1.0 signed FreeTSA package, response, original request and supplied CA/chain | Signature and asset integrity pass; timestamp verified, nonce checked; `independentTimestamp=pass` for this recipe and trust input. |
| T03 control | Current v1.1 quickstart with no timestamp | Package valid, signature and asset integrity pass; timestamp not provided. |
| T03 | The identical v1.1 quickstart with the FreeTSA response/request for the other manifest, using the same CA/chain as T02 | Signature and asset integrity still pass; timestamp invalid with `message imprint mismatch`, overall CLI exit 2; `timestampBinding=fail`. |

The T02 positive control establishes that T03 is not merely rejecting a corrupt
token or unusable trust input. The expected rejection is a **passed negative test**.
The response covers SHA-256 of UTF-8 JCS of the complete signed manifest, including
`signature`; the two manifest digests must differ. This does not specify the
unresolved `prior_evidence.manifest_hash` recipe.

## Evidence and reproduction

- [Recorded local result](results-node24.json): Node 24 / OpenSSL 3.6.2, two
  upstream suites and three mapped CLI executions, no assertion failures.
- [Checksums](CHECKSUMS.sha256): SHA-256 of this README and the recorded result.
- [Runner](../check-timestamps.mjs): checks all 86 pinned verifier files and the
  pinned standard inputs before execution; records commands, outputs and hashes.
- [Workflow](../../../.github/workflows/conformance.yml): executes this runner in
  each existing `conformance (20)`, `(22)` and `(24)` job; each artifact includes
  a new `timestamp-results.json`. Read the execution's conclusion before claiming
  it passed. The local report alone does not establish those three CI results.
- [Local instructions](../README.md#reproduce-locally): reuse the same pinned
  checkout and run `node tests/conformance/check-timestamps.mjs`.

Paths in the report use `$STANDARD`, `$VERIFIER` and `$TMP` placeholders instead
of workstation-specific directories. The public fixture bytes stay in the pinned
verifier repository; the current v1.1 quickstart stays in the standard. No signed
fixture, schema, production key or archive has been modified or copied over.

## Scope

These are reference Node/OpenSSL checks, not a second implementation or external
organizational review. T02 uses a v1.0 package; T03 uses a v1.1 target. The upstream
synthetic TSA suite uses a placeholder manifest signature and does not independently
validate a complete AURA package; the three mapped CLI cases above do.

The runs use local files, not a live TSA request. Certificates are checked against
the current system time; expiry must fail. Authenticity of the supplied CA,
acceptable TSA policy, revocation, long-term validation and qualified eIDAS status
are not established. A passed technical check neither dates creation to the
declared `issued_at` nor proves authorship or rights. Existing reporting gaps
P05/P06 and the need for independent implementation comparison remain.
