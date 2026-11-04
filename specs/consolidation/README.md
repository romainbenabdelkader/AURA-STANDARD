# AURA v1.x consolidation — review entry point

This directory brings together the current rules, unresolved questions and test evidence introduced in PR #27. It is informative. The existing published schemas and applicable conformance/profile documents retain their authority.

Read in this order:

1. [Core reference](AURA-CORE-v1.x.md): one reading path through the published rules.
2. [Review register](CONSOLIDATION_REVIEW.md): C-01 to C-14, compatibility questions and preservation boundaries, including the [4 November proposals](CONSOLIDATION_REVIEW.md#compatibility-proposals--2026-11-04) for UIDs, verifier references and linked-evidence digests. These proposals are awaiting review, not adopted rules.
3. [Test matrix](CONFORMANCE_MATRIX_DRAFT.md): 43 expected checks, classified by their source.
4. [Reproduction dossier](../../tests/conformance/2026-11-03/README.md): fixed fixtures, scripts, source hashes and recorded results, including the supplied S02/S01 signer.
5. [Current automated checks](../../tests/conformance/README.md): replay the preserved fixtures against the separately pinned v1.2.2 release, with fresh execution reports.

The next review checkpoint is completion of the source-by-source review and assessment of the remaining coverage gaps. A calendar review date, if scheduled, is not a date of automatic normative adoption. Promotion requires written decisions, compatibility analysis, implementer feedback and an explicitly approved publication/version.

The current evidence covers a bounded signing and verification path. It does not establish a complete second validator, an external organizational audit, or institutional adoption. Existing signed examples and published schemas remain unchanged.
