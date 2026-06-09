AURA Profile PDI — Proof of Declaration Immutability

Version: v0.1 (Draft)
Status: Informative / Normative Profile
Scope: AURA Standard

⸻

1. Purpose

The Proof of Declaration Immutability (PDI) profile defines a verifiable mechanism ensuring that a declaration of origin, intent, or rights has not been altered since its issuance.

PDI provides a minimal evidentiary guarantee that:

•	a declaration existed at a given point in time,

•	its content is cryptographically bound,

•	any subsequent modification is detectable.

This profile does not assert correctness, legality, or compliance of the declaration.

It asserts immutability only.

⸻

2. Problem Addressed

In the context of AI systems, copyright, and regulatory compliance, declarations such as:

•	TDM opt-out,

•	origin (human / AI),

•	scope of authorised use,

are frequently:

•	mutable,

•	platform-controlled,

•	unverifiable ex post.

PDI addresses the lack of a neutral and verifiable mechanism to prove that a declaration has not been retroactively modified.

⸻

3. Design Principles

The PDI profile follows the core AURA principles:

•	Non-intrusive: no modification of the original asset.

•	Platform-independent: no reliance on platform logs or APIs.

•	Non-executive: no enforcement, blocking, or monitoring.

•	Minimal: only immutability is addressed.

PDI is intentionally incapable of enforcing compliance.

⸻

4. Definition

A declaration is considered immutably proven under PDI if:

1.	The declaration is expressed in an AURA Manifest.
	
2.	The manifest content is cryptographically canonicalised.
	
3.	The canonicalised manifest is digitally signed by a registered issuer.
	
4.	The issuer’s public key is resolvable via a Trusted Public Keys Registry (TPKR).
	
5.	Any modification of the declaration invalidates the signature.

⸻

5. Required Manifest Properties (PDI)

AURA Manifests claiming compliance with the PDI profile MUST include:

•	issuer_id
	
•	issued_at
	
•	signature
	
•	canonicalization
	
•	a declaration payload (e.g. origin, rights, scope)

Optional but RECOMMENDED:
	
•	manifest_id
	
•	profiles: ["PDI"]

Example (informative):
"profiles": ["PDI"]

6. Verification Process

Verification under PDI consists solely of:

1.	Recomputing the canonical form of the manifest.
	
2.	Verifying the digital signature.
	
3.	Resolving the issuer’s public key.
	
4.	Confirming that the signed content matches the presented declaration.

No inference, monitoring, or behavioural analysis is performed.

⸻

7. What PDI Does Not Prove

PDI does not prove:

•	that the declaration is truthful,
	
•	that it was respected by third parties,
	
•	that no use occurred,

•	that a platform complied with it,

•	that the declaration is legally valid.

PDI proves immutability of declaration only.

⸻

8. Regulatory Relevance (Indicative)

PDI is conceptually aligned with:

•	AI Act transparency requirements,
	
•	DSM Directive opt-out mechanisms,

•	evidentiary needs in audit and dispute contexts.

PDI does not replace legal frameworks.
It provides a verifiable factual reference point.

⸻

9. Relationship to Other Profiles

PDI is foundational and may be combined with future profiles, including:

•	Proof of Declared Scope (PDS),
	
•	Proof of Temporal Exclusion (PTE),
	
•	Proof of Good-Faith Compliance (PGC).

PDI does not depend on these profiles.

⸻

10. Status

This profile is a draft specification.
It is provided as a normative reference for discussion, experimentation, and standardisation work.

⸻

11. Final Statement

PDI does not enforce declarations.
It makes them impossible to silently rewrite.
