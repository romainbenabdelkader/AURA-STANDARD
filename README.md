[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19123073.svg)](https://doi.org/10.5281/zenodo.19123073)
# AURA - Open Technical Specification for Verifiable Origin Declarations and Asset Integrity

Authenticated Universal Registration for Assets<br>
Last updated: 2026-11-01 (documentation update)<br>
Latest archived specification: v1.2.1 (schema v1.0.0 frozen canonical, v1.1.0 additive). This branch also contains subsequent documentation updates.

AURA is an open technical specification for signed origin declarations and exact-byte asset integrity checks.

The core can describe assets across creative domains. No IPI, ISRC, ISWC, ISBN,
UID_AUTH or institutional affiliation is required by manifest schemas 1.0 and
1.1. Domain-specific identifiers may be supplied as optional extensions.

The published schemas and reference verifier support:

- signed issuer declarations in AURA manifest formats 1.0 and 1.1
- local signature verification and SHA3-256 comparison with a supplied asset
- an optional signed TDM rights-reservation declaration
- optional detached RFC 3161 timestamp verification through the Node verifier and OpenSSL

ISRC/ISWC field conventions, tested DDEX/C2PA exchanges, registry infrastructure
and dedicated dataset/model profiles are not delivered capabilities. See
[interoperability status](#interoperability-status) and
[implementation status](IMPLEMENTATION_STATUS.md). A file hash alone does not
establish a content-specific provenance profile or the truth of a human/AI origin declaration.

AURA does not perform content recognition, similarity analysis, fingerprinting, watermarking, DRM, or usage monitoring.  
It makes origin declarations verifiable; it does not establish the truth of the declared origin or the real-world identity or authority of the issuer.

AURA manifests are evidentiary artefacts. They do not assert authorship, ownership, originality, identity, licensing, enforceability, grounding, citation or usage completeness. The issuance time carried by a manifest is issuer-declared unless independent timestamp evidence is provided.

AURA is published as an open technical specification, not owned or controlled by any private company.
AURA is tool-agnostic and implementation-neutral. No proprietary platform, vendor, model provider, repository host or software assistant is required to create, verify, implement or audit AURA manifests.

The latest archived AURA-STANDARD release is v1.2.1; subsequent documentation on this branch is not retroactively part of that archive. Evolution is additive and explicitly versioned: schema v1.0.0 is the frozen canonical shape, and v1.1.0 adds `reference_anchor` and `prior_evidence` without breaking v1.0. The AURA-STANDARD v1.2.0 release adds an optional signed TDM rights-reservation profile; v1.2.1 clarifies its one-way binary reservation mapping and exact-byte asset-binding scope without changing either base schema. AURA-VERIFIER has its own release numbering.
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

Trusted Public Keys Registry conceptual model (current local input profile is in IMPLEMENTATION_STATUS.md):
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
/test-vectors – Historical v0.1 vectors only; current acceptance example: /examples/quickstart-v1.1

## Ontology (minimal draft definitions)

issuer  
Entity or pseudonymous actor declaring and signing an AURA manifest. A valid signature does not establish its real-world identity or authority.

issuer_id  
Issuer identifier in the conceptual registry model. Current signed manifests use `issuer.id` and, in v1.1, `reference_anchor.issuer_key.issuer_id`. Registration in an operational TPKR is not established by these fields.

authority_level  
Conceptual registry metadata, not an authority assessment performed by the reference verifier.

## Origin Layer Design

The current verification path combines:

- `aura_uid` – a ULID-shaped manifest identifier; schema validation does not establish global uniqueness or operate an allocation service
- AURA manifest – structured JSON with an Ed25519 signature using RFC 8785 JCS canonicalization; JSON-LD contexts are published separately
- asset hash – SHA3-256 over supplied asset bytes, when the evidence includes an asset binding
- issuer key and optional local registry snapshot – supplied to the verifier; snapshot authenticity and freshness remain unassessed
- optional TDM rights-reservation profile – a signed declaration, distinct from proof of authority or legal effect

[TPKR.md](TPKR.md) describes a conceptual registry model, not a deployed registry
or an implemented remote key-resolution service. See
[ARCHITECTURE.md](ARCHITECTURE.md) for the separation between specification,
evidence packages and implementations.

AURA does not define fingerprinting, watermarking, DRM, content recognition or rights allocation.

## Interoperability Status

| System or use | Current status |
|---|---|
| ISRC / ISWC | No standardized field path or identifier validation in the current v1.0/v1.1 schemas. The `links.isrc` / `links.iswc` mapping belongs to the historical v0.1 draft. |
| DDEX | No tested message exchange or current normative identifier mapping. The historical `links.other_ids` example is not evidence of DDEX interoperability. |
| C2PA | Overlapping provenance, signature and timestamp functions. A complementary integration requires a documented mapping and interoperability tests. |
| TDM rights-reservation documentation | Optional `AURA_TDM_RIGHTS_RESERVATION_V1` profile, using `declarations.tdm_opt_out` and the base manifest fields. Profile validation does not establish legal compliance. |

The base schemas allow additional properties: an implementation can carry
ISRC/ISWC values in an extension, including inside `declarations`, but that choice
does not create a shared AURA field convention or validate those identifiers.
Preserve existing signed extensions. A future shared music profile needs an
explicit version, field semantics, validation rules and interoperability vectors.

These relationships describe integration possibilities. Carrying an identifier does not
demonstrate a complete DDEX workflow, and no C2PA assertion transport or round-trip
compatibility is established by this table. Existing standards already cover
parts of AURA's technical functions; this specification does not claim exclusive
technical originality or automatic legal compliance.

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
- Standalone open-source verifier AURA-VERIFIER (CLI + browser)

Current priorities:
- Align verifier behavior and negative test vectors for the existing schemas
- Provide one current-format developer path and mark historical demonstrations
- Obtain independent reproduction and measure a limited real integration

An initial implementation can provide value within a specific workflow.
Adoption work focuses on documenting that value and testing exchanges with
independent implementations, with broader interoperability as a longer-term objective.

Possible registry infrastructure, dataset/model extensions and any ETSI / AFNOR
work-item proposal remain deferred pending demonstrated need. No formal
standardization proposal is planned at this stage.

## Project Website

Official site (active):  
https://www.aura-standard.org

Mirror (GitHub Pages):  
https://romainbenabdelkader.github.io/AURA-STANDARD/

## Reference verifier

AURA-VERIFIER is a standalone, open-source reference verifier for AURA evidence. It checks integrity, canonical payloads and Ed25519 signatures, and requires no account or backend. "Standalone" describes its operation; publication does not establish an independent external audit.

Repository:  
https://github.com/romainbenabdelkader/AURA-VERIFIER

For current manifest integration, start with its
[v1.2.1 integrator guide](https://github.com/romainbenabdelkader/AURA-VERIFIER/blob/e1fa13c4fb253c2e07a99538524b869028bb62b4/INTEGRATORS.md)
and [public v1.0 vector](https://github.com/romainbenabdelkader/AURA-VERIFIER/tree/e1fa13c4fb253c2e07a99538524b869028bb62b4/examples/rfc3161-freetsa).
The public vector contains fictional issuer and asset data. Its real TSA response
can be checked locally; the signature/asset checks also run through WebCrypto,
while RFC 3161 verification uses the Node CLI with OpenSSL.

Historical verifier archive v1.1.0 (before the current strict-validation fixes):<br>
https://doi.org/10.5281/zenodo.22069698

Published verifier v1.2.1:<br>
[GitHub release](https://github.com/romainbenabdelkader/AURA-VERIFIER/releases/tag/v1.2.1) ·
[version-specific Zenodo archive](https://doi.org/10.5281/zenodo.23898686)<br>
Source commit: `e1fa13c4fb253c2e07a99538524b869028bb62b4`.
See [implementation status, archive digests and registry profile](IMPLEMENTATION_STATUS.md).
Existing signed anchors remain references to their original artifacts.

Web verifier:  
https://verify.aura-standard.org/web/

Checked on 2026-11-02 against the v1.2.1 commit above: all 16 source modules,
the three web files and package.json matched, including the corrected integrity label. This is a live deployment URL and can change; use the pinned
source and archive for reproducible verification. The dated deployment check
and its scope are recorded in [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md).

## Reference implementations (non-normative)

These implementations are non-normative educational prototypes provided for illustration only. They are not production-ready, are not part of the protected implementation layer, and are not part of the normative AURA standard.

The Python `aura-core` and `aura-cli` repositories use a historical v0.1 demo
format and Python deterministic JSON serialization, not the current v1.0/v1.1
JCS signing workflow. They are not current-format signing SDKs. Keep their
existing proofs with the implementation that produced them; do not relabel or
silently re-sign old evidence to claim current conformance.

Minimal Python CLI demo:  
https://github.com/romainbenabdelkader/aura-cli

## Examples (non-normative)

| Material | Status and intended use |
|---|---|
| [Quickstart v1.1](examples/quickstart-v1.1/README.md) | Current-format verification fixture, with its own correction history and documented limits. |
| [PDI v0.1](specs/AURA_Profile_PDI_v0.1.md) and [its example](examples/pdi/aura_pdi_minimal.json) | Historical proposal and illustration using an older format; not a current conformance profile or v1.0/v1.1 acceptance vector. |
| [PDS v0.1](specs/AURA_Profile_PDS_v0.1.md) and [its example](examples/pds/aura_pds_minimal.json) | Historical proposal and illustration using an older format; not a current conformance profile or v1.0/v1.1 acceptance vector. |
| [Proof-profile overview](specs/proof_profiles.md) | Non-normative conceptual explanation; its inline example is illustrative and has a placeholder signature. |

Historical examples are preserved at their existing paths. They must not be used
to infer support in the current verifier. None of these examples establishes
enforcement, third-party behaviour or legal compliance. The published optional
[TDM rights-reservation profile](specs/AI_Act_Article_53_Conformance_Profile.md)
and the [conformance requirements](CONFORMANCE.md) have their own explicit scope.

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

This citation does not constitute official endorsement or formal
standardisation of AURA.

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
