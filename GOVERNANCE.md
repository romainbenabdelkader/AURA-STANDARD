# AURA Governance

Status: Governance principles for the published AURA open technical specification.

AURA is published and versioned through public repositories. This document defines lightweight governance principles for reviewing and evolving the specification while preserving its independence.

This document does not create a foundation, committee, certification body or legal authority. AURA currently has no independent enforcement body with authority to investigate or sanction an implementation.

## 1. Open Review Process

AURA changes should be proposed through public, written and traceable channels:

- GitHub Issues
- Pull Requests
- published specification updates
- documented changelog entries

Private discussions may inform proposals, but normative changes should be recorded publicly before being accepted.

## 2. No Exclusive Control

No single platform, vendor, institution, public authority, model provider, repository host, software assistant or private company may claim exclusive control over AURA.

No implementation, service or commercial product is required to create, verify, implement or audit AURA manifests.

## 3. Charter Supremacy

Any governance model for AURA must comply with the AURA Charter of Independence and Scope.

Governance must not introduce:

- enforcement mechanisms
- usage monitoring
- DRM, watermarking or fingerprinting requirements
- proprietary lock-in
- automated legal decision-making
- mandatory personal-data collection
- unilateral control by one actor

If a future governance proposal conflicts with the Charter, the Charter prevails.

## 4. Transparent Change Review

Material changes to AURA should identify:

- the problem being addressed
- the affected files or profiles
- privacy and data-minimization impacts
- interoperability impacts
- conformance impacts
- security considerations
- whether the change is normative or informative

Accepted changes should be reflected in the changelog.

## 5. Implementation Neutrality

AURA governance must remain implementation-neutral.

Non-normative prototypes, demos, CLIs, SDKs, websites or third-party tools may help adoption, but they are not the specification itself.

Conformance should be judged against the published specification, schemas, contexts, profiles and test vectors, not against one preferred software product.

## 6. Scope Of Assurance And Accountability

AURA's written normative rules define what an implementation may claim as conformant. Conformance tests can check selected technical properties, but cannot establish how every deployed service handles identity, network metadata, operational logs or external legal requirements.

Organizational accountability is a separate layer. Because AURA currently has no independent enforcement body, it cannot investigate deployments, impose sanctions or guarantee that an implementation will not add surveillance, identity or gatekeeping functions outside the specification.

Implementers remain accountable for those deployment choices. Public documentation and test results can make conduct more visible, but they are not a substitute for an independent governance or enforcement mechanism.

## 7. Future Formalization

Future governance may evolve toward an open, transparent and multi-stakeholder process inspired by recognized open standardization practices.

Any future formal governance model should preserve:

- open access to the specification
- public review of changes
- documented decision-making
- platform neutrality
- tool-agnostic implementation
- privacy by design
- meaningful participation by affected communities
- resistance to capture by any single actor

Until such a model exists, AURA remains maintained through transparent repository-based review without an independent certification or enforcement authority.
