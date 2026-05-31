# Fix /mvp 01·02·03 to answer the pain points

## Problem

On `/mvp` the pain-point row reads:

1. Forgetting important conversations
2. Feeling overwhelmed by simple tasks
3. Struggling to stay organised

But the "Here's how MyRhythm answers that" 01/02/03 strip immediately below talks about *vision threading*, *deep-work defence*, and *meeting capture*. Only #3 partially lands. #1 and #2 don't answer the pain the reader just felt — so the emotional through-line breaks.

## Fix

Rewrite the three cards so each one is a 1:1 answer to the pain card above it, grounded in features actually shipping in v0.1 (Memory Bridge, energy-aware Smart Schedule, 4C loop with Vision → Goals → Priorities → Daily Actions traceability). Same visual layout, same component — copy only.

### New 01 · 02 · 03 (answers Forgetting / Overwhelm / Disorganised)

**01 — Never lose a conversation again**
*Memory Bridge listens, so you don't have to.* Record any chat, meeting or appointment and MyRhythm turns it into a searchable transcript with the decisions, names and next steps pulled out for you. The moment stays — and so does what was agreed.

**02 — Today shrinks to one calm next step**
*Your energy, your pace.* A quick Energy Check tunes the day around how you actually feel. Smart Schedule then surfaces just the next right thing — with built-in buffers, gentle reminders and a "too much? reshuffle" tap. Overwhelm becomes one small, doable move.

**03 — One thread from dream to today**
*Vision → Goals → Priorities → Daily Actions, all linked.* Every task on today's list traces back to something that matters to you, and every win is captured and celebrated through the Capture → Commit → Calibrate → Celebrate loop. Nothing important slips, because nothing important is floating.

### Why this works

- Each card now mirrors the pain card directly above it (visual + emotional pairing).
- Language is empowering, not clinical — and stays inside the medical-disclaimer guardrails (no diagnose/treat/fix claims).
- Every promise maps to a shipping v0.1 feature, so the page doesn't write cheques the product can't cash:
  - 01 → Memory Bridge + 30-day retention + searchable ACT extraction
  - 02 → Energy Check + Smart Schedule with energy badges + high-buffer scheduling
  - 03 → Traceability model (Vision → Goals → Priorities → Daily Actions) + 4C loop
- Tone matches the Founding Edition voice: warm, confident, specific.

## Scope

- **File:** `src/components/mvp/MVPCore4C.tsx`, lines 204–207 (the three-item array only).
- **No** layout, styling, image, route, or component changes.
- **No** changes to the pain-point cards above — they're working.
- **No** backend / Supabase / RLS changes.

## Out of scope

- Re-doing the hero, the 4 Core Solutions section, or the rest of the page.
- New images or icons.
- Copy changes elsewhere on `/mvp` (can follow in a separate pass if wanted).

## Open question (optional — happy to default)

Want me to also tighten the section heading from *"Here's how MyRhythm answers that"* + *"Three quiet shifts that change the week."* to something more direct like **"Here's exactly how MyRhythm answers each one"** + **"One promise per problem — built into v0.1."**? Default = leave heading as-is and only swap the three cards.
