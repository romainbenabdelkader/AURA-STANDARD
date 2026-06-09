# AURA Security Considerations

This document summarizes security risks that AURA implementations should consider.

AURA reduces evidentiary uncertainty. It does not eliminate disputes.

## Asset Hash Mismatch

If the computed asset hash does not match the manifest hash, verification MUST fail.

Recommended reason:

```text
file hash mismatch
```

## Manifest Signature Mismatch

If the manifest was modified after signing, verification MUST fail.

Recommended reason:

```text
manifest signature mismatch
```

## Unsupported Signature Algorithm

Implementations SHOULD reject unsupported algorithms.

AURA v0.1 uses Ed25519 in the reference profile.

## Key Compromise

If an issuer private key is compromised:

- the issuer SHOULD revoke the key
- TPKR SHOULD mark the key as revoked
- verifiers SHOULD apply explicit revocation policy
- trusted timestamps MAY help distinguish pre-compromise from post-compromise declarations

## Replay

An attacker may copy a valid manifest and present it alongside a different file.

The asset hash check is the primary defense.

## Backdating

A self-declared `issued_at` timestamp can be falsified by an issuer.

Trusted timestamping and external anchoring can reduce backdating risk but do not replace legal evaluation.

## Malicious Issuers

A valid signature proves control of a private key. It does not prove honesty, legal ownership, copyright validity or institutional authority.

Verifier policy SHOULD distinguish:

- cryptographic validity
- issuer trust level
- legal interpretation

## Registry Compromise

If TPKR is compromised, verifiers may receive incorrect public keys or revocation status.

Mitigations may include:

- registry transparency logs
- signed registry snapshots
- independent mirrors
- hash anchoring
- multi-party governance

## Privacy Risks

Manifests should avoid unnecessary personal data.

Implementations SHOULD NOT embed usage logs, behavioural traces, personal content, biometric data or platform tracking identifiers in AURA manifests.

## Non-Security Guarantees

AURA does not guarantee:

- legal ownership
- copyright validity
- absence of infringement
- actual AI training use
- platform compliance
- liability
- adoption by downstream actors

These remain outside AURA's technical proof scope.
