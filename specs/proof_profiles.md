# AURA — Proof Profiles (Non-Normative)

**Status:** Informative / Non-Normative  
**Scope:** Conceptual evidentiary profiles compatible with the AURA standard

This document defines a set of **proof profiles** describing *what can be evidenced* using AURA manifests.

These profiles:
- do **not** introduce new enforcement mechanisms,
- do **not** imply monitoring or behavioural guarantees,
- do **not** extend the normative core of AURA.

They exist to clarify **the evidentiary meaning** of AURA manifests in regulatory, legal, and audit contexts.

---

## 1. Proof of Declaration Immutability (PDI)

### Definition

**Proof of Declaration Immutability** refers to the ability to demonstrate that a given declaration
(origin, intent, opt-out, scope) has **not been altered since the moment it was issued**.

This proof establishes *immutability of the declaration itself*, not correctness of the declaration.

---

### What this proof establishes

Using an AURA manifest, it is possible to verify that:

- a declaration carries an issuer-declared issuance time,
- the declaration content has remained unchanged,
- the declaration was cryptographically bound to an issuer signing key,
- the declaration can be independently re-verified at any later time.

This proof relies exclusively on:
- deterministic canonicalisation,
- cryptographic hashing,
- digital signatures,
- issuer key resolution.

---

### What this proof does **not** establish

Proof of Declaration Immutability does **not** prove:

- that the declaration is truthful,
- that the declared intent was respected,
- that a system complied with the declaration,
- that no usage occurred,
- that any enforcement took place.

It is strictly evidentiary, not behavioural.

---

### Relation to regulatory frameworks

This proof profile is relevant to:

- EU AI Act transparency and provenance obligations,
- TDM opt-out declaration traceability,
- good-faith compliance documentation,
- ex-post audits and dispute resolution.

It provides a **verifiable factual reference point** without imposing execution constraints.

---

### Minimal illustrative example (non-normative)

```json
{
  "@context": "https://www.aura-standard.org/context/v1.1.jsonld",
  "aura_version": "1.0",
  "profile": "AURA_TDM_RIGHTS_RESERVATION_V1",
  "aura_uid": "aura:v1:01ARZ3NDEKTSV4RRFFQ69G5FAV",
  "issued_at": "2026-01-26T12:00:00Z",

  "issuer": {
    "id": "AURA-REFERENCE-TEST"
  },

  "asset": {
    "hash_algorithm": "SHA3-256",
    "hash": "0000000000000000000000000000000000000000000000000000000000000000"
  },

  "declarations": {
    "tdm_opt_out": true
  },

  "signature": {
    "algorithm": "Ed25519",
    "canonicalization": "RFC-8785-JCS",
    "value": "EXAMPLE_BASE64_SIGNATURE"
  }
}
```
