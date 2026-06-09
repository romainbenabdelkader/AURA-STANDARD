# AURA - EU AI Act Article 53 Documentation Profile

This document defines a minimal AURA field profile designed to support
documentation, audit and provenance workflows related to EU AI Act Article 53
(provenance, transparency, TDM opt-out).

A manifest claiming compatibility with this AURA profile MUST include:

- aura_id
- origin.type
- asset.hash
- issuer_id
- issued_at
- rights.tdm_opt_out
- signature

These fields constitute a minimal machine-readable provenance layer for
datasets, models, AI-generated outputs, and human creations.

A conformant AURA profile SHOULD remain compatible with GDPR data-minimization principles:

- no personal data is mandatory for technical verification
- asset content SHOULD be represented by cryptographic hash, not embedded content
- issuer identifiers MAY be pseudonymous, institutional, or role-based
- verification SHOULD NOT require usage monitoring, profiling, or behavioural logs
- AURA MUST NOT be used as automated legal decision-making or enforcement logic

Any extension, fork, or derivative format claiming compatibility with this
profile SHOULD preserve these fields and MUST clearly document any semantic
changes.

This profile does not by itself certify legal compliance. Legal qualification
depends on the full implementation context, applicable law, audit practice,
competent authorities and courts.
