# AURA – European Origin Proof Standard (Draft v0.1)

**Authenticated Universal Registration for Assets**

**Last updated:** 2025-12-05  
**Status:** Public Draft (pre-standard, not final)

AURA is an open, neutral and interoperable European-origin standard providing verifiable proof of origin for any digital or creative asset.

AURA introduces a sovereign, cryptographically verifiable origin layer enabling:

- certified origin at the moment of creation  
- independent verification by platforms, regulators or institutions  
- support for EU AI Act Article 53 provenance requirements  
- interoperability with ISRC, ISWC, DDEX, C2PA  
- compatibility with human, AI and hybrid-generated assets (audio, video, text, image, datasets, models)

AURA does not analyse content and does not perform fingerprinting, similarity detection or DRM.  
It certifies **origin**, not identity.

AURA is an open standard, not owned or controlled by any private company.  
This repository contains a public draft under active development and MAY evolve before v1.0.

---

## 📄 Documentation

Full AURA v0.1 Draft Specification:  
👉 [`/specs/AURA_v0.1_Draft.md`](specs/AURA_v0.1_Draft.md)

---

## 📁 Repository Structure

- `/specs` – Standard specifications  
- `/context` – JSON-LD context files  
- `/examples` – Manifest examples  
- `/schema` – Manifest schemas  

---

## 🧩 Ontology (minimal draft definitions)

**issuer**  
Entity responsible for generating and signing an AURA manifest  
(e.g. CMO, public authority, certified institution, registered platform).

**issuer_id**  
Stable identifier registered in the Trusted Public Keys Registry (TPKR).

**authority_level**  
Optional classification (e.g. `national_cmo`, `public_authority`, `research_body`).

---

## 🔐 Origin Layer Design

AURA defines:

- **AURA-ID** – globally unique origin identifier  
- **AURA Manifest (JSON-LD)** – structured and cryptographically signed  
- **Ed25519 signatures** – integrity & authenticity  
- **TPKR registry** – trusted issuer public keys  
- **AI Act Article 53 profile** – minimal provenance requirements  

AURA does **not** define fingerprinting, watermarking, DRM, content recognition or rights allocation.

---

## 🔄 Interoperability Mapping

| System            | AURA Mapping                                                |
|-------------------|-------------------------------------------------------------|
| ISRC              | `links.isrc`                                               |
| ISWC              | `links.iswc`                                               |
| DDEX              | `links.other_ids`                                          |
| C2PA              | complementary (non-overlapping)                            |
| EU AI Act Art. 53 | core fields: `origin`, `issuer_id`, `issued_at`, `signature`, `rights.tdm_opt_out` |

AURA acts as a thin origin layer complementing existing identifiers without replacing them.

---

## ⚖️ EU AI Act Considerations

AURA is designed to support compliance with EU AI Act Article 53  
(provenance, disclosure, TDM opt-out).

The AURA Manifest provides a minimal, machine-readable provenance profile that institutions, creators and platforms can validate independently.

---

## 🛡 Intellectual Property Position

This public draft reflects an independently conceived and documented standard.  
It was developed prior to, and separately from, any external collaboration.

Except as explicitly granted under the Apache 2.0 license, all other rights (including patents, trademarks and trade secrets) are reserved.

---

## 📜 License

AURA is published under the Apache License 2.0, including patent permissions.

See LICENSE for details.


## Future Governance (2026)

AURA will transition in 2026 to a neutral, multi‑stakeholder governance model inspired by IETF/ETSI processes. 

Governance will be distributed across 

institutions, researchers, creators, and industry participants.

No single private entity will have unilateral control of the AURA standard.

This ensures long‑term neutrality, prevents political or institutional forks, 

and guarantees that AURA remains a public, open standard aligned with 

European regulatory requirements.


## 🤝 Contributing

AURA is an open standard.  
Institutions, researchers and industry participants may propose changes through:

- GitHub Issues  
- Pull Requests  

All discussions and contributions occur **in writing only**.

---

## 🗺 Roadmap

**v0.2**

- TPKR formal specification  
- Dataset/model manifest extensions  

**v0.3**

- Embedded Mode normalization  
- Open-source verification toolkit (CLI + SDK)  

**v1.0**

- ETSI / AFNOR work-item proposal for formal standardization  

---

## 🌐 Official Project Website

https://www.aura-standard.org
