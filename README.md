AURA – European Origin Proof Standard (Draft v0.1)

Authenticated Universal Registration for Assets

AURA is an open, neutral and interoperable European-origin standard designed to provide verifiable proof of origin for any digital or creative asset.

Last updated: 2025-12-05 Status: Public Draft (pre-standard, not yet final)

AURA introduces a sovereign, cryptographically verifiable origin layer enabling:

• certified origin at the moment of creation

• independent verification by platforms, regulators or institutions

• support for EU AI Act Article 53 provenance requirements

• interoperability with ISRC, ISWC, DDEX and C2PA

• compatibility with human, AI and hybrid-generated assets: audio, video, text, image, datasets, models

AURA does not analyse content and does not perform fingerprinting, similarity detection or DRM. It certifies origin, not identity.

AURA is an open standard, not owned or controlled by any private company. This repository contains a public draft under active development and MAY evolve before v1.0.

⸻

📄 Documentation

Full AURA v0.1 Draft Specification: /specs/AURA_v0.1_Draft.md

⸻

📁 Repository Structure

/specs – Standard specifications

/context – JSON-LD context files

/examples – Manifest examples

/schema – Manifest schemas

⸻

🧩 Ontology (minimal definitions – draft)

issuer Entity responsible for generating and signing an AURA manifest (e.g. CMO, public authority, certified institution, registered platform).

issuer_id Stable identifier registered in the Trusted Public Keys Registry (TPKR).

authority_level Optional classification (e.g. national_cmo, public_authority, research_body).

⸻

🔐 Origin Layer Design

AURA defines:

AURA-ID – globally unique origin identifier

AURA Manifest (JSON-LD) – structured and cryptographically signed

Ed25519 signature – integrity & authenticity

TPKR Registry – trusted public keys for verification

AI Act Article 53 profile – minimal provenance requirements

AURA does not define fingerprinting, watermarking, DRM or rights allocation.

⸻

🔄 Interoperability Mapping System AURA mapping

ISRC links.isrc

ISWC links.iswc

DDEX links.other_ids

C2PA complementary, non-overlapping AI Act Art. 53 manifest core fields AURA acts as a thin origin layer that complements existing identifiers without replacing them.

⸻

⚖️ AI Act Considerations

AURA is designed to support compliance with EU AI Act Article 53 (provenance, disclosure, TDM opt-out).

The AURA Manifest provides a minimal, machine-readable provenance profile that institutions, creators and platforms can validate independently.

⸻

🛡 Intellectual Property Position

This public draft reflects an independently conceived and documented standard. It was developed prior to, and separately from, any external collaboration.

Except as explicitly granted under the Apache 2.0 license, all other rights (including patents, trademarks and trade secrets) are reserved.

⸻

📜 License

AURA is published under the Apache License 2.0, including patent permissions.

⸻

🤝 Contributing

AURA is an open standard. Institutions, researchers and industry participants may propose changes through:

• GitHub Issues

• Pull Requests

All discussions and contributions occur in writing only.

⸻

🗺 Roadmap

v0.2

• TPKR formal specification

• dataset/model manifest extensions

v0.3

• Embedded Mode normalization

• open-source verification toolkit (CLI + SDK)

v1.0

• ETSI / AFNOR work-item proposal for formal standardization

⸻

🌐 Official project website (under deployment) https://aura-standard.org