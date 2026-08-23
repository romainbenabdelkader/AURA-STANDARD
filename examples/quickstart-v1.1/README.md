# AURA v1.1 Neutral Verification Quickstart

This non-normative package provides a neutral AURA v1.1 example that can be
verified without a private account, a remote registry or a proprietary service.

It demonstrates three technical checks:

- the local asset matches the SHA3-256 digest in the signed manifest;
- the Ed25519 signature is valid over the RFC-8785-JCS canonical payload;
- the locally supplied issuer metadata matches the locally supplied public key.

Expected result: `VALID`.

## Browser verification

1. Download `asset.txt`, `manifest.json`, `public-key.pem` and `issuer.json`
   from this directory. `CHECKSUMS.txt` provides independent file digests.
2. Open the independent verifier at
   <https://verify.aura-standard.org/web/> without URL parameters.
3. Select the four local files in their corresponding fields and run the
   verification.

In local-file mode, verification takes place in the browser and does not need
to upload these files or resolve a remote key or manifest.

## Command-line verification

Requirements: Git and Node.js 20 or later.

Copy and paste:

```bash
git clone --depth 1 https://github.com/romainbenabdelkader/AURA-STANDARD.git
git clone --depth 1 --branch v1.0.2 https://github.com/romainbenabdelkader/AURA-VERIFIER.git
cd AURA-VERIFIER
./bin/aura.js verify \
  --asset ../AURA-STANDARD/examples/quickstart-v1.1/asset.txt \
  --manifest ../AURA-STANDARD/examples/quickstart-v1.1/manifest.json \
  --public-key ../AURA-STANDARD/examples/quickstart-v1.1/public-key.pem \
  --issuer ../AURA-STANDARD/examples/quickstart-v1.1/issuer.json
```

The first line of the report should be:

```text
AURA verification result: VALID
```

After the two repositories have been downloaded, the verification command uses
only local evidence and trust material.

## Boundaries

- `AURA-REFERENCE-TEST` is a fictional issuer used only for this fixture.
- The signing private key was generated only to create this example and was not
  written to disk or retained.
- The published public key MUST NOT be treated as a production trust anchor.
- The test-only `public_key_doi` URN is not a production public-key archive DOI.
  A production profile requiring an archived key must publish and reference its
  actual persistent identifier.
- A valid result proves asset integrity, manifest-signature validity and
  consistency with the supplied issuer metadata. It does not prove civil
  identity, authorship, ownership, authority, originality or legal rights.
- `issued_at` is issuer-declared unless separate independent timestamp evidence
  is supplied.

This package is part of AURA-STANDARD and is not an issuance workflow. It
intentionally contains no private key, signer, backend, deployment configuration
or client data.
