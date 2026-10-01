# Archive digest correction — 2026-10-01

The earlier signed fixture referenced AURA-VERIFIER v1.0.2 at
DOI `10.5281/zenodo.22063259`, but its source_digest did not match the deposited
ZIP. This mismatch does not invalidate the old manifest signature; it prevents
verification of that archive binding.

Observed archived file:

- Record: https://zenodo.org/records/22063259
- File: `romainbenabdelkader/AURA-VERIFIER-v1.0.2.zip`
- Size: 40516 bytes
- MD5: `21d723a71f46e170940b44bd94944ea7` (matches record metadata)
- SHA3-256: `174b9fc20210802bb7a5e1e7895561fa76832cd31f301c57bc4cdc93b3842e68`
- ZIP comment: `b663dece35651b586103b0c4dc70c7ce07f6ab31`, matching the referenced commit.

The earlier value was
`e70eedeaa91cc0b52543258d4732efbbc598ef62f7ca6c6ba4bcb6a7535aca71`.
Its provenance has not been established; no claim is made that Zenodo changed
the deposit or that another distribution has identical ZIP bytes.

The original files remain in `superseded/2026-08-23/` for inspection. They must
not be used as an example of successful archive verification. The replacement
has a fresh test key, UID, issuance time, signature and checksums. Its signed
prior_evidence points to the exact original manifest bytes using SHA3-256.
The asset and standard-reference coordinates remain unchanged.

The key URN is deliberately test-only, not a public archive DOI. Offline schema,
signature and integrity checks do not prove archive resolution or issuer identity.
No normative schema or previously published release is modified by this correction.

To check the archive independently, download the named ZIP from the record and
compute SHA3-256 over the ZIP bytes themselves, not extracted or repacked files.

Run `node check-fixture.mjs /path/to/downloaded-verifier.zip` from this directory
to check both packages' checksums, the backward evidence link and the ZIP digest.
Omitting the ZIP path checks only the local fixture files and chain.
