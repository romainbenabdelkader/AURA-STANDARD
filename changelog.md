CHANGELOG — AURA Standard

Toutes les modifications majeures du standard AURA sont consignées ici.
Format conforme à Keep a Changelog.
Statuts des versions définis dans : specs/Standard_Status_and_Versioning.md.

⸻

[v1.2.1 – TDM semantic and asset-binding clarification] – 2026‑08‑23

🔧 Modifié

• Le profil de réservation TDM documente une correspondance sémantique à sens unique entre `declarations.tdm_opt_out: true` et une valeur binaire « droits TDM réservés ». L'absence du profil ne représente jamais une autorisation.
• La liaison SHA3-256 est explicitement limitée aux octets exacts de l'actif ; la reconnaissance de dérivés transcodés, reformatés, compressés, recadrés, privés de métadonnées ou perceptuellement similaires reste hors du profil.
• Aucun schéma, algorithme, mécanisme de découverte, règle de canonicalisation, signature ou vecteur signé n'est modifié.

⸻

[v1.2.0 – TDM rights-reservation profile] – 2026‑08‑23

🆕 Ajouté

• Profil normatif optionnel `AURA_TDM_RIGHTS_RESERVATION_V1`, appliqué en surcouche des schémas canoniques sans les modifier.
• Schéma de profil imposant un actif lié par SHA3-256 et `declarations.tdm_opt_out: true` dans le payload signé.
• Contexte JSON-LD v1.1 aligné sur les champs canoniques actuels et typant `tdm_opt_out` comme booléen.

🔧 Modifié

• Le profil documentaire Article 53 abandonne les anciens chemins v0.1 et sépare explicitement conformité syntaxique, autorité de l'émetteur, découvrabilité, réception et effet juridique.
• Aucun schéma canonique gelé, algorithme, règle de canonicalisation, signature ou vecteur signé existant n'est modifié.
• L'ajout constitue une capacité normative rétrocompatible et entraîne une version mineure de la spécification, sans créer de nouvelle version du schéma de manifeste.

⸻

[v1.1.1 – Privacy and verification clarification] – 2026‑08‑23

🔧 Modifié

•	README et PRIVACY : la formulation « preuve d'origine certifiée / horodatage » est remplacée par « déclaration d'origine signée et vérifiable » et « heure d'émission déclarée par l'émetteur ». Une date d'émission n'est indépendamment établie que si une preuve d'horodatage externe est fournie.
•	Périmètre de non-assertion étendu : un manifeste n'assère ni paternité, ni propriété, ni titularité, ni grounding, ni citation, ni exhaustivité des observations d'usage.
•	Titre public courant : « Open Standard for Verifiable Proof of Origin » → « Open Technical Specification for Verifiable Origin Declarations and Asset Integrity ». Dans ARCHITECTURE, CHARTER, CONTRIBUTING et PUBLIC_POSITION, « proof of origin » devient « signed origin declaration » / « origin evidence » selon le contexte. Le titre du dépôt v1.1.0 reste inchangé : les archives ne sont jamais modifiées rétroactivement.
•	Statut public : la présentation courante emploie « open technical specification » afin de ne pas laisser entendre qu'une procédure formelle de normalisation a déjà été accomplie.
•	CONFORMANCE et PRIVACY : aucune journalisation, télémétrie, résolution distante ni identité civile ne peut être une condition de validité cryptographique ou de conformité AURA lorsque les éléments nécessaires sont fournis localement.
•	Identifiants et clés : les bénéfices de continuité et les risques de corrélation sont rendus explicites ; le scoping et la rotation restent des choix de déploiement qui ne doivent pas masquer leur effet sur la continuité probatoire.
•	TPKR : les entrées peuvent être institutionnelles, pseudonymes ou fondées sur un rôle ; la publication d'une identité civile n'est pas une condition de conformité.
•	Modèle `reference_anchor` : le bloc du standard est fixé aux coordonnées archivées de v1.1.0 ; les champs propres à l'émetteur restent des sentinelles non émissibles. L'empreinte de clé publique est explicitement calculée sur les octets DER/SPKI décodés du PEM.
•	Politique de versionnement alignée sur l'état publié : v1.1.1 est un correctif rétrocompatible de documentation normative, distinct des versions de schéma v1.0 et v1.1.
•	Documents non modifiés à dessein : specs/AURA_v0.1_Draft.md (legacy conservé), PRIORITY_RECORD.md et les entrées historiques du présent changelog — ce sont des enregistrements d'antériorité.

🆕 Ajouté

•	Note de conformité non normative résumant les garanties vérifiables, les limites et les tests de vérification locale.
•	Métadonnées de citation et d'archivage lisibles par GitHub et Zenodo.

Aucun changement de schéma, de canonicalisation, de signature ni de vecteur signé. Les preuves AURA v1.0 et v1.1 restent compatibles.

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
•	Convention d'empreinte de clé (reference_anchor.issuer_key.public_key_digest) : sha3-256 du DER (SPKI) de la clé publique — encodage binaire canonique et stable. Le fichier .pem n'est PAS canonique (fins de ligne, ré-encodage). Rupture de convention notée : les empreintes basées sur le fichier .pem affichées sur des certificats déjà émis restent des artefacts d'affichage valides — elles ne font pas partie du payload signé et n'exigent aucune réémission.
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
