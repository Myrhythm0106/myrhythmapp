# Research Data Charter — MyRhythm

**Version 1 · Anchor date 1 August 2026**

MyRhythm holds some of the most personal material a person can produce: what they said,
what they meant to do, and what they could not manage. This charter is the promise that
governs how any of that becomes research.

## The one-line rule

> **Shape and rhythm travel. Words never do.**

Counts, intervals and coarse bands may leave the account. Recordings, transcripts, action
titles, notes, names, emails, exact dates and exact ages never do.

## What is contributed (Tier A + Tier B only)

**Tier A — continuity signals**

| Signal | Why it matters |
| --- | --- |
| Days active in a period | Whether daily life is holding together |
| Capture → commit conversion | Whether intention becomes a dated plan |
| Reschedule frequency | Forgiving the gap, not abandoning the plan |
| Signup → first action latency | How fast value arrives |
| Support Circle actions per week | Whether "no one walks alone" is real in practice |

**Tier B — coarse context bands**

Persona band, stage band, age band (`under-25`, `25-39`, `40-54`, `55-69`, `70-plus`),
months-since-event band (`0-3m`, `3-12m`, `1-3y`, `3-10y`, `10y-plus`), growth state.

**Tier C — never captured**

Transcripts, recordings, action titles, notes, free-text answers, Support Circle identities,
clinician names, document contents, IP address, precise timestamps, account IDs.

## How identity is removed

- Rows carry a `pseudonym_id`: a SHA-256 hash of a server-held random salt plus the account ID.
- The salt lives in `public.research_salt`, which has **no grants** to `anon` or `authenticated`,
  so it is unreachable from any browser.
- The hash is one-way and the mapping is never stored.
- `public.research_events` has **no read grants at all**. The only reader is
  `public.research_aggregate()`.

## k-anonymity

`research_aggregate()` applies `HAVING count(DISTINCT pseudonym_id) >= 20`. Any group with
fewer than 20 contributors returns nothing at all — not a zero, not a suppressed row. This
threshold is not configurable from the application.

## Consent

- **Off by default.** Nothing is contributed until the person switches it on in Settings.
- Consent is versioned (`consent_version`), so a change of wording requires re-consent.
- **Withdrawal deletes.** `withdraw_research_consent()` deletes every row bearing that
  person's pseudonym before flipping the flag. Withdrawal is one tap and needs no reason.

## Governance

1. No research output is published without a k=20 check on every cell.
2. No output uses clinical outcome language — see `docs/claims-policy.md`.
3. Any new metric must be classified Tier A, B or C **before** it is instrumented.
4. Annual review of this charter; the version number changes with any material change.

## Five-year direction

Longitudinal continuity records (opt-in, still pseudonymous), a public annual
**Research Snapshot** describing daily continuity behaviour after formal support ends, and
academic partnerships that receive aggregates only — never row-level data.
