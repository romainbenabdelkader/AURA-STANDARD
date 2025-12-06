
AURA  Origin Proof Standard v0.1 (Release Candidate)

Authenticated Universal Registration for Assets
European Origin Proof Standard

Status: Public Draft for Review
Last updated: 2025‑12‑05
This document is a public draft intended for review by CMOs, regulators, DSPs, creators, and technical institutions.
It does not constitute a final adopted standard.


0. Normative Language (RFC 2119)

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY in this document are to be interpreted as described in RFC 2119.


1. Purpose

AURA is an open, neutral and interoperable European-origin standard providing verifiable proof of origin for any digital asset:
	•	audio
	•	video
	•	text
	•	image
	•	datasets
	•	AI-generated outputs

AURA enables:

• creators to seal origin at creation time,
• platforms and regulators to verify origin independently,
• institutions to comply with AI Act Article 53 provenance and disclosure requirements,
• interoperability with existing rights ecosystems (ISRC, ISWC, DDEX, C2PA).

AURA does not analyse content, detect similarities or perform fingerprinting.
It certifies origin, not identity.


2. Rationale

AURA addresses several structural gaps:
	•	fragmented metadata across the digital ecosystem,
	•	no sovereign, platform independent proof-of-origin layer,
	•	AI Act requirements for transparent provenance & TDM opt‑out,
	•	existing identifiers (ISRC/ISWC) unable to certify origin at creation,
	•	growing need to distinguish human / AI / hybrid creation.

AURA provides a minimal, verifiable, cryptographically anchored origin layer compatible across industries.


3. Scope

AURA defines:

• AURA-ID origin identifier
• AURA Manifest structured, signed proof
• AURA Signature Ed25519-based integrity mechanism
• TPKR Trusted Public Keys Registry
• compliance profile for AI Act Article 53
• interoperability mappings (ISRC, ISWC, C2PA, DDEX)

AURA does not define fingerprinting, watermarking, DRM, content recognition or rights allocation.


4. Definitions

Asset digital file (audio, video, image, text, dataset, model).
Origin human, ai, hybrid, unknown.
Issuer entity signing the manifest.
Verifier system validating manifest integrity & authenticity.
AURA-ID globally unique origin identifier.
TPKR registry of trusted issuer public keys.
Origin Event moment when origin is declared and sealed.


5. AURA-ID Format

AURA-ID MUST follow:

AURA‑CC‑YYYY‑NNNNNN‑CHECK

Where:
• CC = ISO‑3166 country code or INT
• YYYY = year of origin
• NNNNNN = issuer-managed unique sequence
• CHECK = short checksum (Base32) from truncated SHA3‑256

Example:
AURA-FR-2025-000042-G9F3K

Normative rules:
	•	AURA-ID identifies one origin event, not a file version.
	•	Any modification of the binary asset MUST generate a new AURA-ID.
	•	AURA-ID MUST NOT be reused or reassigned.
	•	CHECK provides structural integrity, not cryptographic security.


6. AURA Manifest (JSON‑LD)

Manifests MUST be expressed in JSON‑LD.

Example:
{
  "@context": {
    "@version": 1.1,

    "id": "@id",
    "type": "@type",

    "AURA": "https://aura-standard.org/ns#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",

    "aura_id": "AURA:aura_id",
    "origin_proof_version": "AURA:origin_proof_version",

    "origin": "AURA:origin",
    "asset": "AURA:asset",
    "links": "AURA:links",
    "rights": "AURA:rights",
    "signature": "AURA:signature",

    "issuer_id": "AURA:issuer_id",

    "issued_at": {
      "@id": "AURA:issued_at",
      "@type": "xsd:dateTime"
    },

    "hash": "AURA:hash",

    "tdm_opt_out": {
      "@id": "AURA:tdm_opt_out",
      "@type": "xsd:boolean"
    },

    "model": "AURA:model",
    "public_key": "AURA:public_key",

    "isrc": "AURA:isrc",
    "iswc": "AURA:iswc",

    "other_ids": {
      "@id": "AURA:other_ids",
      "@container": "@set"
    },

    "asset_type": "AURA:asset_type",
    "origin_type": "AURA:origin_type",
    "declared_by": "AURA:declared_by"
  }
}

AI-generated asset example addition:

"origin": {
  "type": "ai",
  "model": "ExampleGen-2.1",
  "declared_by": "issuer"
}



7. Hash Requirements

• Algorithm: SHA3‑256 (MUST)
• Computed on raw binary file
• Encodings: Base58 or Base64url

Any modification → new hash → new manifest → new AURA-ID.


8. Signature Mechanism

AURA signature uses Ed25519.

signature = Sign(issuer_private_key, canonical_json(manifest))

Manifests MUST be canonicalized using RFC 8785 (JCS) before signing and verifying.

Issuer private keys MUST remain under exclusive control of the issuer.


9. TPKR Trusted Public Keys Registry

A federated, multi-institution registry storing:
	•	issuer_id
	•	public key
	•	authority level
	•	registration date
	•	revocation status

Normative:
	•	verifiers MUST obtain keys from TPKR,
	•	revoked or unknown issuer_id MUST invalidate manifests,
	•	governance MUST be distributed; no single controlling authority.


10. Implementation Modes

1. Declarative Mode (recommended)

Manifest stored separately. No file modification.

2. Attached Mode (Sidecar)

asset.wav
asset.aura

3. Embedded Mode (experimental)

Manifest embedded in file metadata.
Standardization planned for v1.0.


11. Verification Workflow
	1.	Retrieve asset
	2.	Retrieve manifest
	3.	Canonicalize manifest (RFC 8785)
	4.	Retrieve public key from TPKR
	5.	Verify signature
	6.	Recompute asset hash
	7.	Compare with manifest hash
	8.	Validate AURA-ID structure & CHECK

If all checks pass → Origin Verified.


12. AI Act Compliance Profile

To satisfy Article 53, the following fields are mandatory:
	•	aura_id
	•	origin.type
	•	asset.hash
	•	issuer_id
	•	issued_at
	•	rights.tdm_opt_out
	•	signature

This includes datasets, models, and AI-generated outputs.


13. Security Considerations

Threats mitigated:
	•	forged manifests → signature + TPKR
	•	file replacement → hash mismatch
	•	replay attacks → AURA-ID integrity + CHECK
	•	spoofed issuers → trusted registry

Security relies on:
	•	strong hashing (SHA3‑256)
	•	strong signatures (Ed25519)
	•	protected issuer private keys
	•	revocation in TPKR


14. Privacy Considerations

AURA does not require personal data.
Issuer identifiers SHOULD NOT encode sensitive information.
AURA is fully compatible with GDPR minimal-data principles.


15. Interoperability Mapping

| System         | Mapping                                   |
|----------------|-------------------------------------------|
| ISRC           | `links.isrc`                              |
| ISWC           | `links.iswc`                              |
| DDEX           | `links.other_ids`                         |
| C2PA           | complementary (post-creation provenance)  |
| AI Act Art. 53 | `origin` + `issuer` + `issued_at` + `signature` |

16. Versioning

• v0.x: drafts, experimental
• v1.0: stable standard

Breaking changes MUST increment the major version.


17. Roadmap

v0.2

• Full TPKR specification
• Dataset/model manifest extensions
• Improved AURA-ID allocation rules

v0.3

• Embedded Mode normalization
• Open-source verification toolkit (CLI + SDK)

v1.0

• Submission to ETSI / AFNOR
• Governance transfer to European consortium
• PQC signature layer (optional: CRYSTALS‑Dilithium)


END OF AURA v0.1 (Release Candidate)
