# AURA conformance checks

The [consolidation matrix](../../specs/consolidation/CONFORMANCE_MATRIX_DRAFT.md)
separates schema requirements, conformance requirements and reference-verifier
policy. These executable checks provide bounded evidence for that matrix;
they do not add acceptance rules or promote the consolidation draft to normative status.

## Current automated checks

The [workflow](../../.github/workflows/conformance.yml) runs on pull requests and
pushes to main, with Python 3.12 and Node 20, 22 and 24. It:

- checks the preserved dossier's 32 file checksums and pinned standard inputs;
- checks the current and superseded quickstart checksums and the documented
  example-specific backward reference;
- checks the quickstart schema digest against the actual v1.1 schema file;
- replays the 71 fixed variants with the existing Python schema/crypto checks;
- replays those variants in both paths of AURA-VERIFIER v1.2.2, plus the current
  quickstart and four S02/S01 cases (received and freshly signed packages):
  152 reference-path executions in total;
- runs both existing RFC 3161 regression suites unchanged, then records T02/T03
  with three explicit CLI executions (valid token, valid target without a token,
  and the same valid target with an unrelated token).

The verifier is pinned to commit
`08d7c70404bab16e2e3b09bb9e59aefaf6fa5391`.
[Its lock file](verifier-v1.2.2.lock.json) records SHA-256 for every tracked
release file; the runner rejects mismatching source files before importing them.
The [3 November dossier](2026-11-03/README.md), its scripts, fixtures and recorded
v1.2.1 results remain unchanged. New results are separate workflow artifacts,
not replacements for the historical results.

## Reproduce locally

Requirements: Git, Node 20+, Python 3.12+, the two pinned Python packages and
OpenSSL 3.x available as `openssl` on PATH. The timestamp runner fails early
on LibreSSL or another unsupported version. On macOS select OpenSSL 3.x;
see the verifier's [environment guidance](https://github.com/romainbenabdelkader/AURA-VERIFIER/blob/08d7c70404bab16e2e3b09bb9e59aefaf6fa5391/docs/RFC3161_TIMESTAMP.md).
From the root of an AURA-STANDARD checkout containing this directory:

```sh
python3 -m venv ../aura-check-env
. ../aura-check-env/bin/activate
python3 -m pip install -r tests/conformance/requirements.txt
git clone --branch v1.2.2 https://github.com/romainbenabdelkader/AURA-VERIFIER.git ../aura-verifier-v1.2.2
export AURA_VERIFIER_DIR="$(cd ../aura-verifier-v1.2.2 && pwd)"
export AURA_RESULTS_DIR="$PWD/tests/conformance/run-results"
node examples/quickstart-v1.1/check-fixture.mjs
python3 tests/conformance/2026-11-03/check_python.py
node tests/conformance/check-current.mjs
node tests/conformance/check-timestamps.mjs
```

The setup downloads dependencies and source code. The checks then use local
inputs. This workflow does not claim to measure network isolation; the three
historical Chromium checks have their own documented scope and replay command.
The optional ZIP argument of `check-fixture.mjs` is not supplied in CI, so CI
does not claim to resolve or verify the referenced archive ZIP.

Reports are written to `AURA_RESULTS_DIR`. A fresh test key remains in memory;
the generated public fixtures are saved with the run's results. No production
key or external account is required.

`timestamp-results.json` records the OpenSSL version, source and fixture hashes,
commands, expected exit codes, observed reports and T02/T03 mapping. For timestamp
checks alone, the pinned verifier checkout, Node and OpenSSL are sufficient.
The [4 November timestamp record](2026-11-04-timestamp/README.md) preserves one
local run; CI artifacts contain fresh executions for each Node version.

## Coverage boundaries

The 71 variants represent 40 matrix rows. Python serialization is restricted to
the guarded ASCII/safe-integer fixture subset. The two reference paths share code,
and WebCrypto runs in Node. These checks are neither a complete independent
validator nor external organizational validation.

T02/T03 are now replayed for the reference verifier's detached RFC 3161 recipe,
using the preserved v1.0 FreeTSA package for T02 and the signed v1.1 quickstart
as the T03 target. This is not exhaustive timestamp coverage for both formats.
Certificate validation uses the current system time: an expired certificate
must fail, not be skipped or accepted with time validation disabled. No live TSA
request is made. Trust remains relative to the supplied CA; its independent
authenticity, TSA policy suitability, revocation and long-term validity are not assessed.

P05/P06 test selected reporting flags, not collector behavior or legal effect.
The verifier's real-browser CI remains separate evidence. A passing run does not
establish a general `prior_evidence` chain, issuer identity, authority or registry
freshness, and does not award a conformance certification.
