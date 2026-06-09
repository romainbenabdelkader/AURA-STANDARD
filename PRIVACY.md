# AURA Privacy And GDPR Principles

AURA is designed as a minimal evidentiary layer for origin, integrity, timestamping and rights-reservation declarations.

It is not designed to collect, monitor, profile or decide anything about individuals.

## Data Minimization

AURA manifests should contain only the minimum technical fields required for verification:

- `aura_id`
- asset hash
- issuer identifier
- issuance timestamp
- rights-reservation declaration
- signature metadata
- optional interoperability links

AURA does not require personal data to function.

Fields such as `issuer_id`, `issuer_name`, creator references or institutional identifiers may be implemented as:

- public institutional identifiers
- pseudonymous identifiers
- registry identifiers
- role-based identifiers
- neutral local identifiers

## File Content

AURA uses cryptographic hashes to verify file integrity.

The manifest should not contain the original file, embedded content, personal content, biometric data, usage logs or behavioural traces.

## No Monitoring

AURA does not provide:

- usage monitoring
- platform tracking
- behavioural profiling
- content recognition
- fingerprinting
- automated enforcement
- automated legal decisions

Any system combining AURA with monitoring, profiling or enforcement tools must clearly separate those systems from AURA.

## Offline Verification

AURA should remain verifiable without relying on a platform account, user tracking or central behavioural logs.

Offline verification supports privacy by reducing the need to disclose personal or usage data to a third party.

## Implementation Responsibility

The AURA standard defines a technical format. It does not determine the legal basis for any implementation.

If an implementation adds personal data, stores registries containing personal data, or links AURA manifests to identifiable natural persons, that implementation remains responsible for:

- lawful basis
- transparency notices
- data minimization
- retention periods
- access, rectification and deletion rights
- security measures
- applicable GDPR and privacy obligations

## Standard-Level Principle

AURA should be implementable in a GDPR-compatible way by default:

- no personal data mandatory
- no content copying required
- no monitoring required
- no automated decision-making required
- pseudonymous identifiers allowed
- local/offline verification possible

AURA provides a verifiable technical artefact. It does not decide legal ownership, infringement, liability, identity or compliance status.
