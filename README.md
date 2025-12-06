AURA – European Origin Proof Standard (Draft v0.1)

AURA (Authenticated Universal Registration for Assets) is an open, neutral and interoperable European-origin standard designed to provide verifiable proof of origin for any digital or creative asset.

Last updated: 2025-12-05
Status: Public Draft (pre-standard, not yet final)

AURA introduces a sovereign, cryptographically verifiable origin layer enabling:
	
•	certified origin at the moment of creation
	
•	independent verification by platforms, regulators or institutions
	
•	support for AI Act Article 53 provenance requirements
	
•	interoperability with ISRC, ISWC, DDEX and C2PA
	
•	compatibility with human, AI and hybrid generated assets (audio, video, text, image, datasets, models)

AURA does not analyse or fingerprint content.
It certifies origin, not identity.

AURA is an open standard and is not owned or governed by any private company.
This repository contains a public draft under active development and MAY evolve before v1.0.

⸻

📄 Documentation

Full AURA v0.1 Draft Specification:
https://github.com/romainbenabdelkader/aura-standard/blob/main/specs/AURA_v0.1_Draft.md

⸻

📚 Repository Structure

/specs     – Standard specifications  

/context   – JSON-LD context files  

/examples  – Manifest examples  

/schema    – Manifest schemas

🧩 Ontology (minimal definitions)

issuer
Entity responsible for generating and signing an AURA manifest
(e.g. CMO, public authority, registered institution, certified platform).

issuer_id
Stable identifier used in the Trusted Public Keys Registry (TPKR).

authority_level
Optional classification (e.g. national_cmo, public_authority, research_body).

⸻

🔐 Origin Layer Design

AURA defines:

1.	AURA-ID – a globally unique origin identifier

2.	AURA Manifest (JSON-LD) – structured, signed proof of origin

3.	Ed25519 signature – integrity & authenticity

4.	TPKR Registry – trusted public keys for verification

5.	AI Act Article 53 profile – minimal data required for provenance

AURA does not define fingerprinting, watermarking, DRM or rights allocation.

⸻

🔄 Interoperability Mapping
System	AURA mapping

ISRC	links.isrc

ISWC	links.iswc

DDEX	links.other_ids

C2PA	complementary (non-overlapping)

AI Act Art. 53	manifest core fields
AURA acts as a thin origin layer that complements existing identifiers without replacing them.

⸻

⚖️ AI Act Considerations

AURA is designed to support compliance with
AI Act Article 53 (provenance, disclosure, TDM opt-out).

The manifest provides a minimal, machine-readable provenance profile that institutions, creators and platforms can validate independently.

⸻

🛡 Intellectual Property Position

This public draft reflects an independently conceived and documented standard.
It was developed prior to, and separately from, any external collaboration.

Except as explicitly granted under the Apache 2.0 license,
no rights are transferred or assigned.

⸻

📜 License

Published under the Apache License 2.0, including patent permissions.

⸻

🤝 Contributing

AURA is an open standard.
Institutions, researchers and industry participants may propose changes through:
	
•	GitHub Issues
	
•	Pull Requests

All discussions occur in writing only.

⸻

🗺 Roadmap

v0.2
•	TPKR specification

•	dataset/model manifest extensions

v0.3

•	Embedded Mode normalization

•	open-source verification toolkit (CLI + SDK)

v1.0

•	Preparation of an ETSI/AFNOR work item proposal
for standardization of the AURA origin layer

⸻

🌐 Official Project Website (under deployment)

https://aura-standard.org
