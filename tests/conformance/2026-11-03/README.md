# AURA v1.x — bounded reproduction dossier, 2026-11-03

This is test evidence for the [43-row consolidation matrix](../../../specs/consolidation/CONFORMANCE_MATRIX_DRAFT.md). It does not change published schemas, conformance levels or acceptance rules.

## Results and scope

| Evidence | Observed result | Boundary |
| --- | --- | --- |
| [71 fixed variants](vectors.json), [Python results](recorded/python-results.json) | No failed expectations across the 40 represented matrix rows | JSON Schema and separate Ed25519/SHA3 checks; guarded ASCII/safe-integer serialization subset, not a complete JCS validator |
| [Reference results](recorded/reference-results.json) | No failed expectations in Node and WebCrypto paths | Both use reference code; WebCrypto here runs in Node, not a browser |
| [Offline Chromium](recorded/offline-browser-results.json) | Three checks passed; zero page requests during verification | Modules loaded locally before going offline; not Firefox/WebKit or all browser-process traffic |
| [Supplied S02/S01 signer](s02/README.md) | Received package and a newly generated package accepted; both altered declarations rejected with asset integrity still verified | A separately written producer interoperates on these data; not a complete independent verifier or external organizational audit |

[Coverage](recorded/review-summary.json): 39 technical dimensions exercised, P05/P06 partially checked, T02/T03 not executed here. Additional S02/S01 runs reinforce existing rows, not new coverage. Published normative requirements remain the source of truth if a fixture expectation is disputed.

## Pinned inputs

- Standard base: `4ab99117604f7a064a12471d9a2a6081b5ea74ed`; original review matrix: `378a82ad3aa95978ea3beea0c727ea7772f01de3`.
- AURA-VERIFIER release v1.2.1: `e1fa13c4fb253c2e07a99538524b869028bb62b4`.
- [source-lock.json](source-lock.json) checks the exact schema/quickstart inputs and every tracked file of that verifier release before execution. Verifier source is obtained separately; no runtime download occurs in the checks.
- [CHECKSUMS.sha256](CHECKSUMS.sha256) fixes the bytes of this dossier, except the checksum file itself.
- Historical manifests, signature values and the original 71 variants are unchanged. Fresh keys are only test material, never a production trust anchor.

The reference acceptance result does not check that an archive DOI resolves to the claimed artifact. The historical `standard` and `verifier` anchor blocks inherited by these test fixtures are not execution provenance. The actual tested release is pinned separately above. A test-key URN is not a public key archive or production issuance compliance.

## Reproduce

Prerequisites: Python with `jsonschema` and `cryptography`, Node 20+; optional Playwright and a locally installed Chromium. Recorded environment: Python 3.14.2, jsonschema 4.26.0, cryptography 46.0.3, Node 24.22.1, Chromium 150.0.7871.47, Playwright 1.62.1.

From this directory, after obtaining the reference checkout:

```sh
git clone --branch v1.2.1 https://github.com/romainbenabdelkader/AURA-VERIFIER.git verifier-checkout
export AURA_VERIFIER_DIR="$PWD/verifier-checkout"
export AURA_RESULTS_DIR="$PWD/run-results"
python3 check_python.py
node check_reference.mjs
node check_s02.mjs
```

`check_s02.mjs` checks the received package, runs the unmodified supplied signer with a fresh key, compares its bounded preimage with reference JCS and checks both outputs in both reference paths. The private key is not serialized by that signer. Newly generated public fixtures are saved under `run-results/s02-regenerated/`; the stored evidence is untouched. `AURA_PYTHON` can select the Python executable.

Optional real-browser replay:

```sh
node check_offline_browser.mjs
```

If needed, set `AURA_PLAYWRIGHT_MODULE` to the installed Playwright module and `AURA_CHROME_EXECUTABLE` to the installed browser. The script uses a temporary loopback server, disables page networking after loading modules, observes page requests and closes the server/browser. It does not use a personal browser session or download a browser.

`prepare_vectors.py` is the original generator with portable input/output paths. Running it creates **new** test signatures in `run-results/vectors.json`; it is not needed to replay the stored 71 variants. The replay scripts deliberately consume the frozen `vectors.json`, not a regenerated file.

## Interpretation and remaining work

- Neither Python signer is a general-purpose JCS implementation. The supplied signer has no general input guard; its serializer is suitable for the specific fixture data examined here.
- A fresh valid signature establishes producer-to-reference compatibility on this path. It does not establish identity, authority, authorship, truthful declarations, trustworthy time, registry authenticity/freshness or a validated linked-evidence chain.
- The [first reference run](recorded/reference-first-run.json) preserves two harness expectation mismatches: the reference reports unsupported schema selection as `not_checked` plus an error, not a literal `unsupported` status. Only the test adapter was corrected; verifier code was not changed.
- P05/P06 need application/collector behavior review beyond selected output flags. T02/T03 require separate token/trust fixtures and execution. General Unicode/numeric canonicalization and complete independent validation remain outside this dossier.
- The existing broader verifier test suite and earlier timestamp CI are separate evidence, not results newly earned by these scripts.
- [Integration verification](recorded/integration-checks.json) records replay of the portable runners and the S02 supplement. No organizational independence or certification follows from separate scripts.
