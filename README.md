# AURA – European Origin Proof Standard (Draft v0.1)

Authenticated Universal Registration for Assets  
Last updated: 2025-12-05  
Status: Public Draft (pre-standard, not final)

AURA is an open, neutral and interoperable European-origin standard providing verifiable proof of origin for any digital or creative asset.

AURA introduces a sovereign, cryptographically verifiable origin layer enabling:
- certified origin at the moment of creation
- independent verification by platforms, regulators or institutions
- support for EU AI Act Article 53 provenance requirements
- interoperability with ISRC, ISWC, DDEX, C2PA
- compatibility with human, AI and hybrid-generated assets (audio, video, text, image, datasets, models)

AURA does not perform content recognition, similarity analysis, fingerprinting, watermarking, DRM, or usage monitoring.  
It certifies origin, not identity.

AURA manifests are evidentiary artefacts. They do not assert ownership, originality, identity, licensing, or enforceability.

AURA is an open standard, not owned or controlled by any private company.  
This repository contains a public draft under active development and MAY evolve before v1.0.
> **AURA does not create trust. It makes statements verifiable.**
Note: The canonical domain https://www.aura-standard.org is reserved for the AURA standard.
At this draft stage, all normative files and JSON-LD contexts are hosted via GitHub Pages.
## Documentation

Full AURA v0.1 Draft Specification:  
/specs/AURA_v0.1_Draft.md

JSON-LD Context (v1):  
/context/v1.jsonld

## Repository Structure

/specs – Standard specifications  
/context – JSON-LD context files  
/examples – Manifest examples  
/schema – Manifest schemas

## Ontology (minimal draft definitions)

issuer  
Entity responsible for generating and signing an AURA manifest (e.g. CMO, public authority, certified institution, registered platform).

issuer_id  
Stable identifier registered in the Trusted Public Keys Registry (TPKR).

authority_level  
Optional classification (e.g. national_cmo, public_authority, research_body).

## Origin Layer Design

AURA defines:
- AURA-ID – globally unique origin identifier
- AURA Manifest (JSON-LD) – structured and cryptographically signed
- Ed25519 signatures – integrity & authenticity
- TPKR registry – trusted issuer public keys
- AI Act Article 53 profile – minimal provenance requirements

AURA does not define fingerprinting, watermarking, DRM, content recognition or rights allocation.

## Interoperability Mapping

System: ISRC -> links.isrc  
System: ISWC -> links.iswc  
System: DDEX -> links.other_ids  
System: C2PA -> complementary (non-overlapping)  
System: EU AI Act Art. 53 -> core fields: origin, issuer_id, issued_at, signature, rights.tdm_opt_out

AURA acts as a thin origin layer complementing existing identifiers without replacing them.

## EU AI Act Considerations

AURA is designed to support compliance with EU AI Act Article 53 (provenance, disclosure, TDM opt-out).

The AURA Manifest provides a minimal, machine-readable provenance profile that institutions, creators and platforms can validate independently.

## Intellectual Property Position

This public draft reflects an independently conceived and documented standard.  
It was developed prior to, and separately from, any external collaboration.

Except as explicitly granted under the Apache 2.0 license, all other rights (including patents, trademarks and trade secrets) are reserved.

## License

AURA is published under the Apache License 2.0, including patent permissions. See LICENSE for details.

## Charter of Independence

AURA is governed by a strict Charter of Independence and Scope.

This Charter defines non-negotiable structural constraints ensuring that AURA remains:
- neutral and platform-independent
- non-intrusive and non-executive
- free from enforcement, monitoring, DRM, or control mechanisms
- resistant to commercial, institutional, or political capture

The Charter explicitly defines what AURA cannot and must not become.

Any implementation, fork, or derivative work claiming alignment with AURA must either:
- comply fully with this Charter, or
- explicitly state non-compliance.

See: CHARTER.md

## Future Governance (indicative)

Future governance models for AURA may be explored, inspired by open standardization processes (e.g. IETF, ETSI).

Any governance framework must comply strictly with the AURA Charter of Independence and may not:
- introduce enforcement or control mechanisms
- compromise platform neutrality
- grant unilateral control to any single entity

The definition of governance is explicitly out of scope of the current draft.

## Contributing

AURA is an open standard. Institutions, researchers and industry participants may propose changes through:
- GitHub Issues
- Pull Requests

All discussions and contributions occur in writing only.

## Roadmap

v0.2
- TPKR formal specification
- Dataset/model manifest extensions

v0.3
- Embedded Mode normalization
- Open-source verification toolkit (CLI + SDK)

v1.0
- ETSI / AFNOR work-item proposal for formal standardization

## Project Website

Primary (GitHub Pages):  
https://romainbenabdelkader.github.io/AURA-STANDARD/

Custom domain (pending configuration):  
https://www.aura-standard.org

## Reference implementations (non-normative)

These implementations are prototypes provided for illustration only and are not part of the normative AURA standard.

Minimal Python CLI demo:  
https://github.com/romainbenabdelkader/aura-cli

## Examples (non-normative)

This repository includes minimal, illustrative examples of AURA manifests for specific compliance or proof profiles (e.g. Proof of Declaration Immutability).  
These examples are not prescriptive and do not imply enforcement, monitoring, behavioural guarantees, or operational requirements.  
They are provided solely to illustrate how AURA manifests may be used as verifiable evidentiary artefacts.  

See: /examples/
