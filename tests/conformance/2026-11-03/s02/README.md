# S02 / S01 — supplied signer and reproduced results

The seven files under [received/](received/) are preserved byte-for-byte from the supplied archive. [received-checks.json](received-checks.json) records their SHA-256 values and the original ZIP digest `af92690b3e67449ac036c0d52dc6acb990ba1b0499fe0e32cc98095f66019bf0`.

The received README reports a run at `v1.2.1-2-gd05c3de` with Node 22.23.4. This denotes a revision after the v1.2.1 tag, not the exact release commit. That historical execution was not observed in this reproduction. Its wording is retained as received; our measured results below use the exact v1.2.1 release `e1fa13c4fb253c2e07a99538524b869028bb62b4` with Node 24.22.1.

## Measured results

[s02-results.json](../recorded/s02-results.json) contains four cases in two reference paths (eight runs):

| Package | S02: fresh signed declaration | S01: declaration altered without re-signing |
| --- | --- | --- |
| Received signed package | Valid; schema, signature, asset and key pins pass | Invalid signature; asset integrity and key pins still pass |
| [Regenerated package](regenerated/) from the unchanged supplied script | Same results, with a different new public key | Same correctly separated failure |

For all four cases the Python preimage equals reference JCS. These inputs use the restricted data shapes described in the supplied README; this does not establish general RFC 8785 support. Both UIDs fit the canonical 128-bit ULID encoding range. This check does not establish a truthful ULID timestamp, globally enforced uniqueness or actual creation time.

The supplied signer imports Python standard modules and `cryptography`, not AURA signing code. It takes a manifest template from the existing quickstart, retaining its historical `standard` and `verifier` anchors. Their archive digests are not resolved by this test. Its issuer-key URN and declared dates are synthetic test data; no independent timestamp or production key archive is supplied.

Inspection and rerun show no private-key serialization in the supplied script; the key is generated in memory. This does not prove how an earlier, unobserved environment handled memory or files. The reference paths share code, and the WebCrypto path here runs in Node. Separate implementation of this signer is not evidence of an external organization or human audit.

Run `node check_s02.mjs` from the parent directory as explained in the [dossier instructions](../README.md). Stored received and regenerated evidence remains fixed; a rerun writes new public fixtures and reports under the selected results directory.
