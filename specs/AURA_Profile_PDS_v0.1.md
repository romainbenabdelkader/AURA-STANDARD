> **Historical v0.1 proposal — not a current conformance profile.**
> The draft below and its [illustrative example](../examples/pds/aura_pds_minimal.json)
> use historical fields and canonicalization terminology; the example does not
> conform to the current v1.0/v1.1 schemas. The original normative language is
> retained as historical text, not as requirements for current implementations.
> Identifier syntax alone does not establish global uniqueness, and `issued_at`
> is issuer-declared unless independently supported by verified time evidence.
> Current conformance does not require a particular registry service when the required
> material is supplied locally. See [conformance requirements](../CONFORMANCE.md),
> [implementation status](../IMPLEMENTATION_STATUS.md) and the
> [current-format example](../examples/quickstart-v1.1/README.md).
> Editorial notice added on 2026-11-02; the original draft below is unchanged.

---

AURA Profile PDS v0.1 (Draft) — Proof of Declared Scope

1. Purpose

The PDS profile defines a minimal, cryptographically verifiable structure to express a declared scope of intended use restrictions for a digital asset, including AI-related activities (e.g. training, fine-tuning, evaluation), in a platform-independent and non-executive manner.

PDS provides an evidentiary declaration layer only. It does not implement enforcement, monitoring, or compliance execution.

2. Scope

PDS is limited to:

•	expressing a declared policy scope for defined activities;
	
•	binding the declaration to a target asset identifier;
	
•	providing tamper-evidence through canonicalization and signature.

PDS is out of scope for:
	
•	determining whether the declaration is legally valid in any jurisdiction;
	
•	determining whether any actor complied with the declaration;
	
•	implementing any form of access control, DRM, filtering, or surveillance.

3. Data Model

A PDS manifest is an AURA manifest that includes:
	
•	the profile identifier PDS in profiles;
	
•	an asset block that identifies the target of the declaration;
	
•	a declared_scope block that defines activities and policy.

4. Required Fields

The following fields are required:
	
•	@context (string)

AURI of the JSON-LD context used for interpretation.
	
•	origin_proof_version (string)
Specification version tag (e.g. 0.1).
	
•	profiles (array of string)
Must include "PDS".
	
•	aura_id (string)
Globally unique manifest identifier.
	
•	issued_at (string, RFC3339 UTC)
Timestamp indicating when the manifest was issued.
	
•	issuer_id (string)
Identifier of the signing issuer (registered in the trusted key registry).
	
•	asset (object)
Target asset identification. Minimum:
	
•	type (string)
	
•	hash (string, algorithm-prefixed, e.g. sha3-256:...)
	
•	declared_scope (object)
Declared scope policy. Minimum:
	
•	activities (array of string)
List of activity labels covered by the declaration.
	
•	policy (object)
	
•	default (string) one of: prohibited, permitted
	
•	exceptions (array) list of exception descriptors (may be empty)
	
•	jurisdictions (array of string)
	
•	effective_from (string, RFC3339 UTC)
	
•	canonicalization (string)
Canonicalization method identifier (e.g. canonical_json_v0).
	
•	signature (object)
Signature container. Minimum:
	
•	alg (string) e.g. ed25519
	
•	encoding (string) e.g. base64url
	
•	value (string)

5. Optional Fields

•	declared_scope.effective_until (string, RFC3339 UTC)
Indicates optional end of applicability.
	
•	declared_scope.note (string)
Human-readable note (non-normative).
	
•	links (object)
External identifiers (ISRC, ISWC, etc.), if applicable.

6. Verification

A verifier must be able to:
	
1.	resolve issuer_id to an issuer public key via the trusted key registry;
	
2.	canonicalize the manifest using the declared canonicalization method;
	
3.	verify signature.value against the canonicalized bytes;
	
4.	confirm that the manifest declares profile "PDS" and includes required fields.

Verification only establishes integrity, issuer binding, and declared content immutability.

7. Non-Claims (Normative)

A PDS manifest:
	
•	does not assert compliance by any party;
	
•	does not assert that an activity did or did not occur;
	
•	does not assert enforceability or legal validity of declarations;
	
•	does not require monitoring, fingerprinting, watermarking, or DRM;
	
•	does not prescribe platform behavior.

This profile expresses declared scope signals only.

8. Minimal Example (Non-Normative)

See: /examples/pds/aura_pds_minimal.json
