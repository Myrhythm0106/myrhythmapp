# Evidence Decision System — see the data, decide with it

**Version 1 · Anchor 1 August 2026 · Founder-only surface: `/founder/evidence`**

## Why this exists

Features accumulate. Opinions are loud. This system makes the roadmap answerable to what
people actually do, and leaves a paper trail investors, clinicians and the FIT Collective can
inspect.

## 1. Access

`/founder/evidence` is gated by `AdminRoute` and every underlying reader re-checks
`has_role(auth.uid(), 'admin')` in the database, so the page cannot be spoofed from the client.

Readable sources:

- `analytics_events` — identified product usage (admin read policy)
- `founding_feedback` — cohort voice (admin read policy)
- `assessment_results` — cohort make-up (admin read policy)
- `product_decisions` — the decision log (admin only)

## 2. What is captured

Instrumentation lives in `src/lib/evidence/track.ts`.

```ts
recordAction(SURFACES.memoryBridge, 'saved', { bands: { stageBand: '3-12m' } });
```

`recordAction` writes to **both** streams: the identified product stream and — only with
consent — the de-identified research stream. Surfaces are a fixed list: capture, commit,
calibrate, celebrate, memory_bridge, calendar, support_circle, document_import, planning,
assessment, payment.

Event data may contain counts and enums only. Never a title, never a transcript.

## 3. The four panels

| Panel | Question it answers | Action it forces |
| --- | --- | --- |
| Where people fall away | At which step does belief break? | Fix the single biggest drop this week |
| Keep, Fix or Cut | Is this feature earning its place? | Log a verdict |
| Do they come back? | Is this a continuity layer or a novelty? | Protect day-7 and day-30 return |
| Voice of the cohort | What are they telling us in words? | Pair a quote with a number |

## 4. Decision thresholds

Measured as *share of active people in the window who used the surface at least once*:

- **40%+ → Keep.** It is load-bearing. Invest.
- **15–39% → Fix.** Real but under-adopted. The entry point is wrong, not the feature.
- **Under 15% → Cut or fold in.** It costs attention it does not repay.
- **No data → Park.** Not enough signal; do not guess.

Overriding a threshold is allowed — but the override goes in the decision log with its reason.

## 5. Cadence

**Weekly (30 minutes, Monday).** Read the funnel. Name the biggest drop. One fix goes into
the week. Log nothing else.

**Monthly (90 minutes, first Monday).** Run all four panels at 30 days. Issue Keep/Fix/Cut
verdicts on every surface below the keep line. Log each with the number that triggered it.

**Quarterly.** Review the decision log as a whole: what did the numbers change? Feed the
answer into the 90-day plan and the investor update.

## 6. The evidence trail

Every entry in `product_decisions` carries feature, verdict, evidence string, notes and date.
The rule: **no roadmap change without a row here.** When an investor asks "why did you build
that?", the answer is a query, not a story.

## 7. Boundaries

- The research stream (`research_events`) is separate, consent-gated, pseudonymous and
  suppressed below 20 contributors — see `docs/research-data-charter.md`.
- Nothing on this page may be phrased as a clinical outcome — see `docs/claims-policy.md`.
