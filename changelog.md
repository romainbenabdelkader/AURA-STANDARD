CHANGELOG — AURA Standard

Toutes les modifications majeures du standard AURA sont consignées ici.
Format conforme à Keep a Changelog.
Statuts des versions définis dans : specs/Standard_Status_and_Versioning.md.

⸻

[v0.1 – Public Draft • Release Candidate] – 2025‑12‑12

🆕 Ajouté

Spécification principale

•	Publication du AURA_v0.1_Draft comprenant :
	
•	AURA‑ID : format structuré, checksum, règles d’allocation, anti‑sybil (informative).
	
•	AURA Manifest (JSON‑LD) : structure normative, champs obligatoires, règles d’intégrité.
	
•	Signature Ed25519 avec canonicalisation RFC 8785 (JCS).
	
•	Hash SHA3‑256 obligatoire : calcul sur binaire brut, pas de transcoding.
	
•	Origin types : human / ai / hybrid / unknown.
	
•	Interoperability Layer : ISRC, ISWC, DDEX, C2PA.
	
•	Rights block incluant tdm_opt_out (AI Act).

TPKR – Trusted Public Keys Registry
	
•	Définition de la structure du registre :
	
•	issuer_id
	
•	public_key
	
•	authority_level (1, 2, 3)
	
•	revocation status
	
•	registration date
	
•	Règles de validation : clé inconnue ou révoquée → manifest invalide.

AI Act Article 53 Conformance Profile
	
•	Création d’un profil minimal requis pour conformité légale :
	
•	aura_id
	
•	origin.type
	
•	asset.hash
	
•	issuer_id
	
•	issued_at
	
•	rights.tdm_opt_out
	
•	signature
	
•	Applicable aux contenus : humains, IA, hybrides, datasets, modèles.

JSON‑LD Context v1
	
•	Ajout du fichier : /context/v1.jsonld
	
•	Définition des vocabulaires AURA :
	
•	aura_id, origin_proof_version, origin, asset, links, rights, signature
	
•	isrc, iswc, other_ids (set)
	
•	declared_by, origin_type, asset_type
	
•	issued_at (xsd:dateTime), tdm_opt_out (xsd:boolean)

Documentation / Métadonnées du standard
	
•	README complet décrivant :
	
•	objectifs, portée, périmètre technique
	
•	interopérabilité ISRC / ISWC / DDEX / C2PA
	
•	conformité AI Act Art. 53
	
•	gouvernance future 2026
	
•	roadmap v0.2 → v1.0
	
•	Publication du site officiel : https://www.aura-standard.org
	
•	Ajout de la licence Apache 2.0 (avec permissions de brevets).

⸻

🔧 Modifié / Harmonisé
	
•	Harmonisation du wording autour de :
	
•	“AURA – European Origin Proof Standard” (terminologie canonique)
	
•	Clarification de la section Security Considerations (forgeries, replay attacks, spoofed issuers).
	
•	Clarification des règles de versionnement :
	
•	v0.x = drafts
	
•	RC = version candidate stable
	
•	v1.0 = édition pour soumission ETSI/AFNOR
	
•	Mise à jour du README pour intégrer la gouvernance multi‑stakeholder 2026.

⸻

🗑️ Déprécié / Retiré

(Aucun élément n’est officiellement déprécié en v0.1.)

⸻

⚠️ Notes importantes
	
•	v0.1 est un Public Draft → structure complète mais évolutive.
	
•	Le TPKR sera formalisé en v0.2.
	
•	Les extensions datasets & modèles IA arriveront en v0.2.
	
•	L’Embedded Mode et le toolkit de vérification sont prévus en v0.3.
	
•	v1.0 sera préparé pour soumission ETSI / AFNOR.

⸻

Prochaines versions prévues

v0.2 (Roadmap)
	
•	Spécification complète du TPKR
	
•	Extensions datasets & modèles IA
	
•	Règles avancées d’allocation AURA‑ID

v0.3 (Roadmap)
	
•	Normalisation de l’Embedded Mode
	
•	CLI & SDK de vérification open‑source

v1.0 (Roadmap)
	
•	Package de standardisation formel
	
•	Soumission ETSI / AFNOR
	
•	Introduction d’une option PQC (CRYSTALS‑Dilithium)