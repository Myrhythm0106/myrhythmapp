# Plan v8 — Frictionless Capture MVP + Positioning Surface

Locks the build scope from Plan v7 with the competitor-driven refinements, and adds a small positioning layer so the moat is visible from the outside.

## A. MVP Build Scope (locked)

### A1. Frictionless capture core (5 items)
1. **Live transcription preview** — words appear as the user/SC speaks; reduces "did it hear me?" anxiety.
2. **Offline-first queue** — capture works with no signal (hospital, clinic, basement); syncs on reconnect with a visible queue badge.
3. **Undo, not confirm** — captures save instantly; a 6s "Undo" toast replaces modal confirmation. User stays sovereign.
4. **Voice-only Support Circle mode** — SC app surface defaults to one large mic button + name of the person they're capturing for. No typing required.
5. **Status-at-a-glance dot** — single coloured dot per capture: grey (queued), amber (awaiting review), green (accepted), faded (declined). No nagging, no badges-of-shame.

### A2. Competitor-driven additions (2 items)
6. **"Why am I seeing this?" provenance chip** — every circle-originated capture shows a one-tap chip revealing: who sent it, when, which permission allowed it, and a "revoke this permission" shortcut.
7. **Weekly capture digest** — Sunday roll-up to the user: "Your circle sent N captures this week, you accepted M. [Name] sends most. Adjust permissions?" Turns the feature into a relationship instrument.

### A3. First-send coachmark (frictionless polish)
8. **One-time SC coachmark on first send** — 8 words: "Sent. [Name] will review and accept." Shown once per SC member, never again. Solves the trust gap at zero cost.

### A4. Schema-only (no UI)
9. `created_via` field on captures — enum: `app`, `sc_app`, future `sms`, `wearable`, `email`. Forward-compatible.

### Explicitly deferred to Phase 2
Zero-state big-button, auto-save partials, one-handed reachability, pre-filled calendar context, haptics, shake-to-capture, long-press FAB, "request a capture" flow. All nice; none move the competitive needle.

---

## B. Positioning Surface (new)

The build alone is enough to stand out. It is **not** enough to be *seen* standing out. These three small additions make the moat visible in 5 seconds.

### B1. Landing page section: "The Circle Loop"
A new section on `/launch` (and `/`) showing the four-frame loop:
SC captures → provenance chip shown → user accepts → weekly digest closes the loop.
Static frames + short caption. No video required for v1.

### B2. Provenance chip as a marketing asset
A clean isolated screenshot (or animated GIF) of the chip, usable on landing, social, investor deck, press kit. One asset, many surfaces.

### B3. Name the workflow
Give the SC→user→accept→digest loop a 2-word name so press, clinicians, and investors have language to repeat. Three candidates to choose from in implementation:
- **Consent Capture**
- **Circle Bridge**
- **Proxy Notes**

(User picks during build; default to "Consent Capture" if undecided.)

---

## C. Sequencing

```text
Week 1: A1 items 1–3 (live preview, offline queue, undo toast) on user side
Week 2: A1 item 4 (voice-only SC mode) + A1 item 5 (status dot)
Week 3: A2 items 6–7 (provenance chip + weekly digest) + A3 coachmark
Week 4: B1–B3 positioning surface + QA + schema field
```

---

## D. Technical Notes (for reference)

- **Offline queue:** IndexedDB via existing `prototypeStore` pattern; sync worker on `online` event.
- **Provenance chip:** reads from `support_circle_members.permissions` JSONB; revoke shortcut calls existing `revoke_invitation` flow extended for per-permission revoke.
- **Weekly digest:** new edge function `weekly-capture-digest` on cron; reuses `send-email` and Resend.
- **Voice-only SC mode:** new route `/launch/sc/capture/:subjectId`; conditional render in existing SC dashboard.
- **`created_via`:** migration adds enum column to captures/acts table; defaults to `app`.
- **Status dot:** derived from existing accept/decline state; no schema change.

---

## E. Open Question Before Build

Pick the workflow name (Consent Capture / Circle Bridge / Proxy Notes / other) — affects landing copy, chip tooltip, and digest subject line.
