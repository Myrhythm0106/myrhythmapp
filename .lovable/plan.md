# Plan: Finish SC Capture + Elevate Launch Welcome (v2)

Decision on open question: **run the 3-direction picker** for the Welcome redesign.

Rationale — competitive context:
- Otter, Voicenotes, Rev all ship a "friendly pastel sparkle" welcome. If we copy that register, we look like another consumer notes app.
- Brain in Hand and MapHabit lean clinical/utilitarian — credible but cold. Families don't fall in love with them.
- The gap MyRhythm needs to occupy on first paint is **clinical-grade seriousness + human warmth** — the register Headspace for Work, Calm Health, and Hinge Health used to break out of consumer-wellness into enterprise/clinical trust. That's a register choice that benefits from seeing options side-by-side rather than my single guess.
- The Welcome screen is the first authenticated impression. Investors, NHS pilot leads, and family members all land here. Getting it wrong costs more than one extra step costs.

So: capture the current Welcome, run `design--create_directions` with three locked-taste variants, let you pick, then build.

---

## 1. Finish `/launch/sc/capture/:subjectId`
(unchanged from v1 plan — deterministic, no picker needed)

- Recipient header card with avatar, relationship, last-capture timestamp
- Live transcript ribbon under the mic (partials grey, finals dark)
- Waveform / level meter ring around mic
- Hold-to-talk option (long-press = PTT, tap = toggle); pref stored in localStorage
- Post-send confirmation panel (green check + Undo + "Send another"), toast becomes secondary
- Queued drawer (chip opens bottom sheet of pending captures)
- Empty-permission guard with "Request permission" deep link
- A11y: aria-live transcript, focus ring, reduced-motion, safe-area, real meta title
- Route cleanup: drop `:subjectName` from URL (PII), fetch from subject context

New files: `RecipientHeader.tsx`, `LiveTranscriptRibbon.tsx`, `QueuedDrawer.tsx`, `SendConfirmation.tsx` under `src/components/launch/circle/`.

## 2. Redesign `/launch/welcome`

**Flow:**
1. Capture current Welcome screenshot at 1430×780 desktop and a mobile crop
2. `design--create_directions` with three variants, locked taste = serious + warm + brand-teal accent:
   - **Editorial Clinical** — oversized serif headline, off-white canvas, asymmetric 60/40 split, one quiet abstract hero, hairline rules, numbered persona highlights (register: New Yorker × Mayo Clinic)
   - **Mono Minimal** — single column, mono-display headline, generous negative space, brand-teal as a single line, micro-typography (register: Linear × Stripe)
   - **Soft Corporate** — calm gradient mesh hero, sans display, card-free highlights with monoline icons, gentle motion (register: Headspace for Work × Notion)
3. Show all three via `ask_questions` type `prototype`
4. Build the chosen direction; copy its tokens verbatim into the project

Persona content (4 personas × 3 highlights) preserved; only treatment changes. Bouncing Sparkle emoji removed in all directions.

## Technical notes
- New files: `src/components/launch/welcome/WelcomeHero.tsx`, `WelcomeHighlights.tsx`, `WelcomeAside.tsx` (final names depend on chosen direction)
- Edits: `src/pages/launch/LaunchWelcome.tsx`, `src/pages/launch/LaunchSCCapture.tsx`, `src/App.tsx` (route change drops `:subjectName`)
- No backend, schema, or dependency changes
- All colours via existing semantic tokens; add `--surface-canvas` and `--rule-hairline` tokens if not present

## Sequencing
1. SC Capture polish (deterministic — ship first)
2. Capture Welcome screenshot → directions → picker → build chosen variant
