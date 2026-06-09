# AURA – EU AI Act Article 53 Conformance Profile

This document defines the mandatory fields required for compliance with 
EU AI Act Article 53 (provenance, transparency, TDM opt‑out).

A conformant AURA Manifest MUST include:

- aura_id
- origin.type
- asset.hash
- issuer_id
- issued_at
- rights.tdm_opt_out
- signature

These fields constitute the minimal machine‑readable provenance layer 
required for datasets, models, AI‑generated outputs, and human creations.

A conformant AURA profile SHOULD remain compatible with GDPR data-minimization principles:

- no personal data is mandatory for technical verification
- asset content SHOULD be represented by cryptographic hash, not embedded content
- issuer identifiers MAY be pseudonymous, institutional, or role-based
- verification SHOULD NOT require usage monitoring, profiling, or behavioural logs
- AURA MUST NOT be used as automated legal decision-making or enforcement logic

Any extension, fork, or derivative format MUST preserve full 
compatibility with this profile to remain compliant with the EU AI Act.
