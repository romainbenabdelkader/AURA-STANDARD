# AURA Test Vectors

This repository provides a current neutral AURA v1.1 verification example and
retains the signed v0.1 vectors as legacy implementation material.

The purpose is to help independent implementations verify consistent hashing, manifest canonicalization, signing and error reporting.

Implementations claiming support for
`AURA_TDM_RIGHTS_RESERVATION_V1` additionally MUST test:

- a correctly signed, asset-bound profile with
  `declarations.tdm_opt_out: true`
- rejection of a profile using a string, number, `null`, object or boolean
  `false` in place of the required boolean `true`
- rejection when the signed declaration is modified
- rejection when supplied asset bytes do not match `asset.hash`
- reporting that issuer authority, discovery and legal effect were not assessed
  by cryptographic verification

## Current Neutral Verification Example

The self-contained, non-production AURA v1.1 package is located at:

```text
examples/quickstart-v1.1/
```

It includes a neutral asset, signed manifest, public test key, local issuer
metadata, reproducible checksums and browser/CLI instructions. The expected
result is `VALID` with no network request when all four verification files are
supplied locally.

See [`examples/quickstart-v1.1/README.md`](examples/quickstart-v1.1/README.md).

## Legacy v0.1 Vectors

### Location

Test vector files are stored under:

```text
test-vectors/v0.1/
```

The signed v0.1 test vectors preserve the exact `@context` string that was
included in their signed payload. Do not rewrite those URLs without
regenerating the signatures and expected manifest hashes.

### Test Vector 1: Valid Signed Manifest

Asset:

```text
test-vectors/v0.1/asset.txt
```

Asset bytes:

```text
AURA test vector asset v0.1
```

The file ends with a newline.

Expected SHA3-256 asset hash:

```text
64aaf60816cfaab48ac7a3bb789477f5199a7a5371950dd7561f8c6325675c57
```

Manifest:

```text
test-vectors/v0.1/manifest.valid.jsonld
```

Expected canonical unsigned manifest SHA3-256 hash:

```text
932e208ec47beb9b494ee6c0abbc5a94a80d8d5c25d51665f8bd99cec3f031f6
```

Expected result:

```text
VALID
```

### Test Vector 2: File Hash Mismatch

Manifest:

```text
test-vectors/v0.1/manifest.invalid_hash.jsonld
```

Expected result:

```text
INVALID
Reason: file hash mismatch
```

### Test Vector 3: Manifest Signature Mismatch

Manifest:

```text
test-vectors/v0.1/manifest.invalid_signature.jsonld
```

Expected result:

```text
INVALID
Reason: manifest signature mismatch
```

### Test Key Material

The public test key is:

```text
A6EHv_POEL4dcN0Y50vAmWfk1jCbpQ1fHdyGZBJVMbg
```

This key is for test vectors only. It MUST NOT be used for production manifests.

### Canonicalization

For these draft vectors, the canonical unsigned manifest is produced by:

- removing the `signature` object
- JSON serialization with sorted keys
- no extra whitespace
- UTF-8 encoding

Future AURA versions may replace this draft profile with RFC 8785 JCS as the normative canonicalization profile.
