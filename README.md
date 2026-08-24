[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19123073.svg)](https://doi.org/10.5281/zenodo.19123073)
# AURA - Open Technical Specification for Verifiable Origin Declarations and Asset Integrity

Authenticated Universal Registration for Assets<br>
Last updated: 2026-08-23<br>
Status: Published open technical specification - v1.2.1 (schema v1.0.0 frozen canonical, v1.1.0 additive)

AURA is an open European technical specification for signed, independently verifiable origin declarations covering any digital or creative asset.

AURA introduces a sovereign, cryptographically verifiable origin layer enabling:
- an issuer-declared origin statement, signed at the moment of registration
- independent verification by platforms, regulators or institutions
- support for evidentiary workflows related to EU AI Act Article 53
- interoperability with ISRC, ISWC, DDEX, C2PA
- compatibility with human, AI and hybrid-generated assets (audio, video, text, image, datasets, models)

AURA does not perform content recognition, similarity analysis, fingerprinting, watermarking, DRM, or usage monitoring.  
It makes origin declarations verifiable; it does not establish the truth of the declared origin or the real-world identity or authority of the issuer.

AURA manifests are evidentiary artefacts. They do not assert authorship, ownership, originality, identity, licensing, enforceability, grounding, citation or usage completeness. The issuance time carried by a manifest is issuer-declared unless independent timestamp evidence is provided.

AURA is published as an open technical specification, not owned or controlled by any private company.
AURA is tool-agnostic and implementation-neutral. No proprietary platform, vendor, model provider, repository host or software assistant is required to create, verify, implement or audit AURA manifests.

This repository contains the published AURA technical specification (v1.2.1). Evolution is additive and explicitly versioned: schema v1.0.0 is the frozen canonical shape, and v1.1.0 adds `reference_anchor` and `prior_evidence` without breaking v1.0. The v1.2.0 release adds an optional signed TDM rights-reservation profile; v1.2.1 clarifies its one-way binary reservation mapping and exact-byte asset-binding scope without changing either base schema.
> **AURA does not create trust. It makes statements verifiable.**
Note: The canonical domain https://www.aura-standard.org is active and serves the AURA standard, including normative files and JSON-LD contexts.
## Documentation

Canonical manifest schemas (v1.0.0 frozen, v1.1.0 additive):  
/schema/ (see /schema/README.md)

AURA v0.1 Draft Specification (legacy superseded, retained for historical reference):  
/specs/AURA_v0.1_Draft.md

Current JSON-LD Context (v1.1):
/context/v1.1.jsonld

Legacy JSON-LD Context (v1, retained for signed v0.1 material):
/context/v1.jsonld

Conformance levels:
/CONFORMANCE.md

Test vectors:
/TEST_VECTORS.md

Neutral AURA v1.1 verification quickstart:
[examples/quickstart-v1.1/README.md](examples/quickstart-v1.1/README.md)

Trusted Public Keys Registry profile:
/TPKR.md

TDM rights-reservation documentation profile:
/specs/AI_Act_Article_53_Conformance_Profile.md

Governance principles:
/GOVERNANCE.md

Privacy and offline-verification conformance note:
/PRIVACY_CONFORMANCE_NOTE.md

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
- TDM rights-reservation documentation profile signed reservation declaration

AURA does not define fingerprinting, watermarking, DRM, content recognition or rights allocation.

## Interoperability Mapping

System: ISRC -> links.isrc  
System: ISWC -> links.iswc  
System: DDEX -> links.other_ids  
System: C2PA -> complementary (non-overlapping)  
System: EU AI Act Art. 53 documentation workflows -> optional profile fields:
profile, aura_uid, issuer, issued_at, asset.hash,
declarations.tdm_opt_out, signature, and reference_anchor for AURA v1.1

AURA acts as a thin origin layer complementing existing identifiers without replacing them.

## EU AI Act Considerations

AURA is designed to support documentation and audit workflows related to EU AI
Act Article 53, including signed TDM rights-reservation declarations.

The optional `AURA_TDM_RIGHTS_RESERVATION_V1` profile provides a minimal,
machine-interpretable declaration that institutions, creators and platforms can
validate independently. Profile conformance does not establish rightsholder
authority, automated discoverability, receipt by a model provider, legal
enforceability or compliance with Article 53 by itself.

## GDPR / Privacy Considerations

AURA is designed around data minimization.

The standard does not require personal data to function. AURA manifests should rely on cryptographic hashes, issuer identifiers, timestamps, rights-reservation declarations and signatures rather than embedded personal content, usage logs or behavioural traces.

AURA does not provide monitoring, profiling, content recognition, automated enforcement or automated legal decision-making.

Implementations MAY use pseudonymous, institutional or role-based issuer identifiers. If an implementation adds personal data or links manifests to identifiable natural persons, that implementation remains responsible for its own lawful basis, transparency notices, retention periods, data-subject rights and GDPR/privacy obligations.

See: PRIVACY.md

## Intellectual Property Position

This published open technical specification reflects an independently conceived and documented specification.
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

AURA is currently published as an open technical specification (v1.2.1). Future governance may evolve toward an open, transparent and multi-stakeholder process inspired by open standardization practices.

Any governance model must preserve AURA's independence, tool-agnostic nature, privacy-by-design principles and resistance to capture by any single platform, vendor, institution or authority.

Any governance framework must comply strictly with the AURA Charter of Independence and may not:
- introduce enforcement or control mechanisms
- compromise platform neutrality
- grant unilateral control to any single entity

See: GOVERNANCE.md

## Contributing

AURA is an open technical specification. Institutions, researchers and industry participants may propose changes through:
- GitHub Issues
- Pull Requests

All discussions and contributions occur in writing only.

## Roadmap

Delivered and published:
- Canonical manifest schemas (v1.0.0 frozen, v1.1.0 additive)
- Independent open-source verifier AURA-VERIFIER (CLI + browser)

Planned:
- Formal TPKR (Trusted Public Keys Registry) specification
- Dataset and model manifest extensions
- ETSI / AFNOR work-item proposal for formal standardization

## Project Website

Official site (active):  
https://www.aura-standard.org

Mirror (GitHub Pages):  
https://romainbenabdelkader.github.io/AURA-STANDARD/

## Independent verifier

AURA-VERIFIER is the independent, open-source verifier for AURA evidence. It checks integrity, canonical payloads and Ed25519 signatures, and requires no account or backend.

Repository:  
https://github.com/romainbenabdelkader/AURA-VERIFIER

DOI (v1.0.2):<br>
https://doi.org/10.5281/zenodo.22063259

Web verifier:  
https://verify.aura-standard.org/web/

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

## Institutional references (non-normative)

The typology of the three asymmetries declaration, traceability, auditability
contributed by Romain Benabdelkader, and the accompanying definition of minimal,
robust and interoperable evidence, are cited in the French parliamentary mission
report on AI alignment (Paoli-Gagin). That report identifies the AURA protocol as
a possible open basis for an evidence, traceability and auditability
infrastructure.

- p. 30 — the three asymmetries, attributed to Romain Benabdelkader
- pp. 34-35 — minimal, robust and interoperable evidence; recommendation no. 8
- p. 95 — the same recommendation carried into government priority no. 5

Report: https://www.vaninapaoligagin.fr/rapport/

This is a citation in a public report. It is not an adoption, endorsement,
certification, standardisation or legal recognition of AURA by any public
authority, and it confers no conformity status.

## Citation

AURA - Open Technical Specification for Verifiable Origin Declarations and Asset Integrity

Archived records are never altered retroactively. The v1.1.0 archive therefore
retains the title under which it was deposited. Citation metadata for the current
release is also provided in `CITATION.cff`.

Concept DOI (all versions):  
https://doi.org/10.5281/zenodo.19123073

Latest archived version — AURA-STANDARD v1.2.1:

https://doi.org/10.5281/zenodo.22071523

Previous archived version — AURA-STANDARD v1.2.0:

https://doi.org/10.5281/zenodo.22069687

Previous archived version — AURA-STANDARD v1.1.1:

https://doi.org/10.5281/zenodo.22063255

Previous archived version — AURA-STANDARD v1.1.0:

https://doi.org/10.5281/zenodo.21251473
