# AURA — Illustrative Use Cases

> AURA establishes facts. It does not enforce rights.

This document presents a set of minimal and illustrative use cases for AURA as an evidentiary layer.

AURA is not a control system, a monitoring system, or an enforcement mechanism.  
It is a way to establish and verify certain origin-related facts independently.

AURA is designed to operate independently of any single platform, infrastructure, or operator.

---

## 1. Dataset issuance traceability

### Problem

Datasets used in AI workflows are often redistributed, transformed, or referenced across multiple environments.  
It is frequently difficult to establish when a dataset was issued, by whom, and in which declared form.

### AURA contribution

An AURA manifest can be issued at dataset publication time to establish:
- the existence of the dataset
- its integrity via cryptographic hash
- the attribution claim declared by the issuer
- the time of declaration

### Example

A research lab publishes a benchmark dataset for model training.  
The lab issues an AURA manifest signed with its registered key.

A third party can later verify:
- that the dataset corresponds to the declared hash
- that the manifest was signed by the declared issuer
- that the declaration existed at the stated time

### What AURA does not prove

AURA does not prove:
- legal ownership of the dataset
- lawfulness of collection
- compliance with data protection rules
- actual downstream usage by third parties

---

## 2. Model artifact integrity verification

### Problem

Model checkpoints, weights, and derived artifacts may circulate across teams, infrastructures, or repositories without a stable evidentiary layer.

### AURA contribution

An AURA manifest can be attached to a model artifact in order to establish:
- the existence of a given model artifact at a specific time
- the integrity of the artifact
- the declared attribution of the issuer
- the declared relationship between the artifact and related identifiers or references

### Example

A model provider publishes a checkpoint for evaluation.  
The provider issues an AURA manifest for the released artifact.

An auditor or integration partner can independently verify that the received artifact matches the originally declared version.

### What AURA does not prove

AURA does not prove:
- model quality
- absence of hidden capabilities
- regulatory compliance
- provenance of the training data

---

## 3. Origin claims for digital works

### Problem

Digital works often circulate without a stable and independently verifiable evidentiary layer linking a declared issuer to a specific version of a work.

### AURA contribution

AURA can be used to establish a minimal proof profile for a digital work:
- existence
- integrity
- attribution claim
- time

### Example

A cultural institution, publisher, or collective management organisation issues an AURA manifest for a digital work at publication time.

Platforms, archives, or third parties may later verify that the distributed file corresponds to the declared artefact.

### What AURA does not prove

AURA does not prove:
- authorship in the legal sense
- ownership of rights
- originality
- licence validity
- infringement

---

## 4. TDM opt-out and consent-related signalling

### Problem

In the AI context, origin and consent-related metadata are often fragmented, inconsistently expressed, or difficult to validate independently.

### AURA contribution

AURA can carry structured declarations related to origin and consent signalling in a machine-readable way, including references relevant to TDM opt-out workflows.

### Example

A publisher issues an AURA manifest containing a declared origin profile and a rights-related signalling field intended to support downstream processing and verification.

Third parties may verify that the declaration was made, by whom, and when.

### What AURA does not prove

AURA does not prove:
- that the declaration was respected downstream
- that ingestion did or did not occur
- that legal obligations were fulfilled
- that consent exists beyond the declared statement

---

## 5. Audit preparation and evidentiary preservation

### Problem

Audits often rely on fragmented metadata, platform assertions, or internal logs that are difficult to verify independently.

### AURA contribution

AURA provides portable evidentiary artefacts that can be preserved, exchanged, and verified independently of a single platform or operator.

### Example

An institution receives a digital artefact together with its AURA manifest.  
At a later stage, the institution can re-verify the artefact and manifest pair without relying on the original issuing environment.

### What AURA does not prove

AURA does not prove:
- completeness of evidence
- absence of other versions
- non-access or non-use
- exhaustiveness of the audit trail

---

## 6. Interoperability layer across existing identifiers

### Problem

Existing identifiers and metadata systems often operate in parallel without a common minimal evidentiary layer.

### AURA contribution

AURA can complement existing identifiers such as ISRC, ISWC, DDEX references, or other external IDs by linking them to a signed manifest.

### Example

A manifest includes references to one or more external identifiers.  
A verifier can check both the integrity of the artefact and the consistency of the declared linked identifiers.

### What AURA does not prove

AURA does not prove:
- the validity of the external identifier itself
- the correctness of third-party registries
- legal precedence over other systems

---

## General limitation

AURA establishes verifiable evidentiary artefacts.  
It does not establish legal truth by itself.

More specifically, AURA does not provide:
- enforcement
- monitoring
- behavioural guarantees
- completeness guarantees
- proof of non-use
- proof of legal entitlement

Its role is narrower and more specific: to make certain origin-related statements independently verifiable.