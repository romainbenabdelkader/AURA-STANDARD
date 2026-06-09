# AURA Test Vectors

This document defines non-normative test vectors for AURA v0.1 implementers.

The purpose is to help independent implementations verify consistent hashing, manifest canonicalization, signing and error reporting.

## Location

Test vector files are stored under:

```text
test-vectors/v0.1/
```

## Test Vector 1: Valid Signed Manifest

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

## Test Vector 2: File Hash Mismatch

Manifest:

```text
test-vectors/v0.1/manifest.invalid_hash.jsonld
```

Expected result:

```text
INVALID
Reason: file hash mismatch
```

## Test Vector 3: Manifest Signature Mismatch

Manifest:

```text
test-vectors/v0.1/manifest.invalid_signature.jsonld
```

Expected result:

```text
INVALID
Reason: manifest signature mismatch
```

## Test Key Material

The public test key is:

```text
A6EHv_POEL4dcN0Y50vAmWfk1jCbpQ1fHdyGZBJVMbg
```

This key is for test vectors only. It MUST NOT be used for production manifests.

## Canonicalization

For these draft vectors, the canonical unsigned manifest is produced by:

- removing the `signature` object
- JSON serialization with sorted keys
- no extra whitespace
- UTF-8 encoding

Future AURA versions may replace this draft profile with RFC 8785 JCS as the normative canonicalization profile.
