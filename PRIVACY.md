# AURA Privacy And GDPR Principles

AURA is designed as a minimal evidentiary layer for origin, integrity, issuance-time and rights-reservation declarations.

It is not designed to collect, monitor, profile or decide anything about individuals.

## Data Minimization

An AURA manifest SHOULD contain only the technical fields and declarations required for its verification and declared purpose. These can include:

- `aura_uid`
- an asset hash, when asset integrity is claimed
- issuer and signing-key identifiers
- an issuer-declared issuance time
- profile-specific declarations
- signature metadata
- optional interoperability and prior-evidence links

AURA does not require civil identity, an email address, a phone number, a government identifier, a device identifier, an account identifier, precise location or biometric information to function. Such information MUST NOT be required merely to obtain cryptographic validity.

Issuer or registrant references MAY use public institutional, pseudonymous, scoped, registry, role-based or neutral local identifiers.

## Cryptographic Verification And Identity

A valid signature establishes that the supplied signing key signed the manifest. Registry material can establish how an implementation associates that key with an issuer and its declared status.

Neither result, by itself, establishes the issuer's civil or legal identity, real-world authority, authorship, ownership or the truth of the signed declarations.

An issuer or institution MAY maintain identity records privately for a separately justified purpose. Public evidence and private identity records SHOULD remain separated unless publishing the linkage is necessary, lawful and understood by the affected person.

## File Content

AURA uses cryptographic hashes to verify file integrity.

The manifest SHOULD NOT contain the original file, embedded personal content, biometric data, usage logs or behavioural traces merely to perform AURA verification.

## No Mandatory Verification Telemetry

AURA verification MUST NOT require analytics, telemetry or verification-event logging.

A conformant implementation MUST NOT make creation of a record linking an identifiable verifier or user to the specific asset, manifest or evidence object being verified a condition of AURA verification.

An implementation may maintain logs for a separate lawful operational, cybersecurity or regulatory purpose. Those logs are not required by AURA and remain subject to the implementation's own transparency, minimization, security, retention and legal obligations.

## Local And Offline Verification

When the asset where applicable, manifest, public key and required trust material are supplied locally, cryptographic verification MUST NOT require a platform account, remote resolver, analytics service or central behavioural log.

Offline verification reduces disclosure to third parties. A result based on local registry or revocation material necessarily reflects the freshness of that local snapshot; the implementation SHOULD disclose that limitation when freshness matters.

## Remote Convenience Resolution

An implementation MAY offer remote loading of a manifest, public key, archived key or registry material as a convenience. Such resolution is not offline verification and MUST NOT be required when the necessary material is supplied locally.

Remote requests can create ordinary server records containing information such as an IP address, request time and requested identifier or URL. Implementations SHOULD disclose this before or when remote resolution occurs. Privacy-sensitive verification SHOULD prefer locally supplied evidence and trust material.

## Identifier And Key Linkability

Stable values such as `aura_uid`, issuer identifiers, `key_id`, public-key fingerprints, public-key or archive references, asset hashes and `prior_evidence` links can allow records to be correlated across manifests or with external datasets.

Stable institutional identifiers and signing keys can be desirable because they support continuity, accountability and institutional attribution. They also increase cross-manifest linkability.

Privacy-sensitive deployments MAY use scoped or rotated identifiers and keys where appropriate. Rotation or scoping can reduce direct correlation, but can also reduce evidentiary continuity and make historical trust evaluation more complex. Deployments SHOULD assess and document this trade-off rather than treating either stability or rotation as universally preferable.

## Residual Correlation And Anonymity Risk

Cryptographic minimization cannot guarantee anonymity. A rare issuer or signing key, a small user population, unusual metadata combinations, persistent identifiers, repeated timestamp patterns, prior-evidence links or correlation with external datasets can narrow an anonymity set.

These risks cannot always be eliminated at the specification layer. Privacy-sensitive deployments SHOULD assess their likely anonymity set and correlation environment in context, including information published outside AURA.

## No Monitoring

AURA does not provide:

- usage monitoring
- platform tracking
- behavioural profiling
- content recognition
- fingerprinting
- automated enforcement
- automated legal decisions

Any system combining AURA with monitoring, profiling or enforcement tools MUST clearly separate those systems from AURA.

## Implementation Responsibility

The AURA specification defines a technical format. It does not determine the legal basis for an implementation.

If an implementation adds personal data, stores registries containing personal data, links AURA manifests to identifiable natural persons or records verification events, that implementation remains responsible for:

- lawful basis
- transparency notices
- data minimization
- retention periods
- access, rectification and deletion rights where applicable
- security measures
- applicable GDPR and privacy obligations

## Specification-Level Principle

AURA should be implementable in a GDPR-compatible way by default:

- no civil identity mandatory
- no device identifier mandatory
- no content copying required
- no verification telemetry required
- no automated decision-making required
- pseudonymous or scoped identifiers allowed
- local and offline verification possible

AURA provides a verifiable technical artefact. It does not decide legal ownership, infringement, liability, identity or compliance status.
