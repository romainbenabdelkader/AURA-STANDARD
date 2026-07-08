CHANGELOG — AURA Standard

Toutes les modifications majeures du standard AURA sont consignées ici.
Format conforme à Keep a Changelog.
Statuts des versions définis dans : specs/Standard_Status_and_Versioning.md.

⸻

[v1.1.0 – Published open standard] – 2026‑07‑08

🆕 Ajouté

•	Schéma canonique gelé : aura-manifest-v1.0.0.json (aura_version "1.0", aura_uid ULID, issuer object, signature Ed25519 + RFC 8785/JCS). Aucun champ n'est jamais retiré ni réaffecté.
•	Évolution additive : aura-manifest-v1.1.0.json = v1.0.0 + reference_anchor (obligatoire, dans le payload signé) + prior_evidence (chaîne de preuves antérieures, optionnelle).
•	Un vérificateur DOIT accepter à la fois v1.0 et v1.1.
•	reference-anchor.template.json et schema/README.md documentant la politique de versionnement des schémas.
•	Vérificateur indépendant open-source publié : AURA-VERIFIER v1.0.1 (CLI + navigateur), https://github.com/romainbenabdelkader/AURA-VERIFIER — DOI 10.5281/zenodo.21251287, page https://verify.aura-standard.org/web/.

🔧 Modifié

•	Statut du standard : « Published open standard — v1.1.0 » (le matériel v0.1 est conservé comme legacy / superseded).
•	Domaine officiel https://www.aura-standard.org actif.
•	Publication Zenodo : DOI de concept 10.5281/zenodo.19123073, DOI de version 10.5281/zenodo.21251473.

⸻

[v0.1.1 – Public Draft • Editorial hardening] – 2026‑06‑09

🔧 Modifié

•	Durcissement éditorial du public draft : clarifications de wording, cohérence terminologique et corrections de documentation, sans changement normatif de structure.

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
	
•	Réservation du domaine officiel : https://www.aura-standard.org (mise en ligne planifiée).
	
•	Ajout de la licence Apache 2.0 (avec permissions de brevets).

⸻

🔧 Modifié / Harmonisé

•	Ajout d'une doctrine RGPD/GDPR et privacy-by-design :

	•	minimisation des donnees

	•	aucune donnee personnelle obligatoire

	•	verification hors ligne possible

	•	absence de monitoring, profilage ou decision automatisee

	•	responsabilite des implementations en cas d'ajout de donnees personnelles

•	Ajout des documents de structuration du standard ouvert :

	•	CONFORMANCE.md

	•	TEST_VECTORS.md

	•	TPKR.md

	•	SECURITY_CONSIDERATIONS.md

	•	GLOSSARY.md

	•	test-vectors/v0.1

•	Harmonisation du wording autour de :
	
•	“AURA - Proposed Open European Origin-Proof Standard” (terminologie canonique prudente pour un public draft)
	
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

Livré et publié
	
•	Schémas canoniques (v1.0.0 gelé, v1.1.0 additif)
	
•	Vérificateur indépendant open‑source — AURA‑VERIFIER (CLI + navigateur)

Perspectives
	
•	Spécification formelle complète du TPKR
	
•	Extensions datasets & modèles IA
	
•	Règles avancées d’allocation AURA‑ID
	
•	Soumission ETSI / AFNOR
	
•	Option post‑quantique (PQC, ex. CRYSTALS‑Dilithium)
