[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19123074.svg)](https://doi.org/10.5281/zenodo.19123074)
# AURA - Proposed Open European Origin-Proof Standard (Draft v0.1)

Authenticated Universal Registration for Assets  
Last updated: 2025-12-05  
Status: Public Draft (pre-standard, not final)

AURA is a proposed open European origin-proof standard initiative providing verifiable proof of origin for any digital or creative asset.

AURA introduces a sovereign, cryptographically verifiable origin layer enabling:
- certified origin at the moment of creation
- independent verification by platforms, regulators or institutions
- support for EU AI Act Article 53 provenance requirements
- interoperability with ISRC, ISWC, DDEX, C2PA
- compatibility with human, AI and hybrid-generated assets (audio, video, text, image, datasets, models)

AURA does not perform content recognition, similarity analysis, fingerprinting, watermarking, DRM, or usage monitoring.  
It certifies origin, not identity.

AURA manifests are evidentiary artefacts. They do not assert ownership, originality, identity, licensing, or enforceability.

AURA is published as an open standard initiative, not owned or controlled by any private company.
AURA is tool-agnostic and implementation-neutral. No proprietary platform, vendor, model provider, repository host or software assistant is required to create, verify, implement or audit AURA manifests.

This repository contains a public draft under active development and MAY evolve before v1.0.
> **AURA does not create trust. It makes statements verifiable.**
Note: The canonical domain https://www.aura-standard.org is reserved for the AURA standard.
At this draft stage, all normative files and JSON-LD contexts are hosted via GitHub Pages.
## Documentation

Full AURA v0.1 Draft Specification:  
/specs/AURA_v0.1_Draft.md

JSON-LD Context (v1):  
/context/v1.jsonld

Conformance levels:
/CONFORMANCE.md

Test vectors:
/TEST_VECTORS.md

Trusted Public Keys Registry profile:
/TPKR.md

Governance principles:
/GOVERNANCE.md

Public position:
/PUBLIC_POSITION.md

Priority and publication record:
/PRIORITY_RECORD.md

Security considerations:
/SECURITY_CONSIDERATIONS.md

Glossary:
/GLOSSARY.md

## Repository Structure

/specs – Standard specifications  
/context – JSON-LD context files  
/examples – Manifest examples  
/schema – Manifest schemas
/test-vectors – Conformance-oriented test vectors

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

## GDPR / Privacy Considerations

AURA is designed around data minimization.

The standard does not require personal data to function. AURA manifests should rely on cryptographic hashes, issuer identifiers, timestamps, rights-reservation declarations and signatures rather than embedded personal content, usage logs or behavioural traces.

AURA does not provide monitoring, profiling, content recognition, automated enforcement or automated legal decision-making.

Implementations MAY use pseudonymous, institutional or role-based issuer identifiers. If an implementation adds personal data or links manifests to identifiable natural persons, that implementation remains responsible for its own lawful basis, transparency notices, retention periods, data-subject rights and GDPR/privacy obligations.

See: PRIVACY.md

## Intellectual Property Position

This public draft reflects an independently conceived and documented standard.  
It was developed prior to, and separately from, any external collaboration.

Materials published in this repository are licensed under the Apache License 2.0. Except for the rights expressly granted by that license, no rights are granted over trademarks, unpublished implementations, confidential know-how, private systems, future proprietary services, or non-public technical assets.

## License

Materials published in this repository are licensed under the Apache License 2.0. See LICENSE for details.

## Charter of Independence

AURA is governed by a strict Charter of Independence and Scope.

This Charter defines non-negotiable structural constraints ensuring that AURA remains:
- neutral and platform-independent
- tool-agnostic and implementation-neutral
- non-intrusive and non-executive
- free from enforcement, monitoring, DRM, or control mechanisms
- resistant to commercial, institutional, or political capture

The Charter explicitly defines what AURA cannot and must not become.

Any implementation, fork, or derivative work claiming alignment with AURA must either:
- comply fully with this Charter, or
- explicitly state non-compliance.

See: CHARTER.md

## Future Governance (indicative)

AURA is currently published as a public draft. Future governance may evolve toward an open, transparent and multi-stakeholder process inspired by open standardization practices.

Any governance model must preserve AURA's independence, tool-agnostic nature, privacy-by-design principles and resistance to capture by any single platform, vendor, institution or authority.

Any governance framework must comply strictly with the AURA Charter of Independence and may not:
- introduce enforcement or control mechanisms
- compromise platform neutrality
- grant unilateral control to any single entity

See: GOVERNANCE.md

## Contributing

AURA is an open standard initiative. Institutions, researchers and industry participants may propose changes through:
- GitHub Issues
- Pull Requests

All discussions and contributions occur in writing only.

## Roadmap

v0.2
- TPKR formal specification
- Dataset/model manifest extensions
- conformance test suite expansion

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

These implementations are non-normative educational prototypes provided for illustration only. They are not production-ready, are not part of the protected implementation layer, and are not part of the normative AURA standard.

Minimal Python CLI demo:  
https://github.com/romainbenabdelkader/aura-cli

## Examples (non-normative)

This repository includes minimal, illustrative examples of AURA manifests for specific compliance or proof profiles (e.g. Proof of Declaration Immutability).  
These examples are not prescriptive and do not imply enforcement, monitoring, behavioural guarantees, or operational requirements.  
They are provided solely to illustrate how AURA manifests may be used as verifiable evidentiary artefacts.  

See: /examples/

## Use Cases

Illustrative use cases are available in:

/USE_CASES.md

## Citation

AURA v0.1 — Public Draft  
DOI: https://doi.org/10.5281/zenodo.19123074
