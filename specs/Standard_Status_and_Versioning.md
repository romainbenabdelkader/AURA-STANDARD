# Standard Status and Versioning Policy

AURA follows semantic versioning for public technical-specification releases:

- v0.x releases are experimental drafts and may change incompatibly.
- v1.x releases are published versions of the open technical specification.
- Release-candidate labels identify material proposed for a later stable release.

A breaking change to manifest semantics, canonicalization, signature processing or
required wire-format behavior MUST increment the major version.

A backward-compatible schema extension or new normative capability SHOULD increment
the minor version.

Editorial corrections and backward-compatible normative clarifications MAY increment
the patch version when they do not change a schema, signed payload interpretation,
canonicalization, signature algorithm or existing proof result.

The specification release and manifest schema are versioned separately. AURA v1.2.0
is the current specification release; it supports the frozen v1.0 schema and the
additive v1.1 schema. The v1.2.0 release adds an optional normative profile and
does not create a manifest schema v1.2.0.

Future extensions MUST preserve the documented compatibility rules or use the
appropriate major-version increment.
