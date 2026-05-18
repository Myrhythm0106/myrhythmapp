## Plan v6.2 — Persona-aware Launch (Light)

Brain-injury-first stays the foundation. Other personas get tuned strings on the same surfaces, plus caregivers get a "Self / Supporting" switch. No new pages, no schema, no business logic.

### 1. Persona resolver

Create `src/launch/persona/usePersona.ts`.

- Reads `myrhythm_launch_mode.assessmentResults.userType` and `myrhythm_user_type` from localStorage.
- Maps 9 raw types → 4 **tone buckets**:
  - `recovery` — brain-injury, post-recovery, long-covid, ms-cognitive (default fallback)
  - `caregiver` — caregiver, medical-professional
  - `productivity` — executive, wellness, cognitive-optimization, adhd
  - `student` — student
- Returns `{ persona, label, isCaregiver }`. SSR-safe.

### 2. Persona copy pack

Create `src/launch/persona/copy.ts` — a single typed dictionary:

```text
copy[persona] = {
  greeting: { morning, afternoon, evening }
  subgreeting               // replaces "No catching up. Just this moment."
  scaffoldsTitle            // replaces "Today's scaffolds"
  winsTitle                 // replaces "Today's gentle wins"
  ichooseLede               // one-line frame above #IChoose
  capabilityLens: {
    capture, commit, calibrate   // one sentence each — "For you:" chip
  }
}
```

Tone targets:
- **recovery** — keep current copy verbatim. No regression.
- **caregiver** — "supporting someone takes a rhythm of its own", scaffolds → "Today's anchors", wins → "Today's quiet wins for both of you".
- **productivity** — "Today's focus blocks", "Today's wins". Lens chips talk about leverage, deep work, signal vs noise. Never gamified.
- **student** — "Today's study blocks", "Today's wins". Lens chips talk about lectures, revision, recall.

No emojis. No medical claims. No "fix / transform". Disclaimers untouched.

### 3. Wire into existing surfaces (string-level only)

- `src/components/launch/quiet/QuietHome.tsx`
  - Replace hardcoded greeting suffix and "No catching up…" with copy pack values.
  - Replace `Today's gentle wins` title with `copy.winsTitle`.
- `src/components/launch/quiet/Scaffolds.tsx` — title from copy pack.
- `src/components/launch/quiet/IChooseHeart.tsx` — optional one-line lede above the heart.
- `src/pages/launch/LaunchCapture.tsx`, `LaunchCommit.tsx`, `LaunchCalibrate.tsx`
  - Add a small `PersonaLensChip` (new, 30-line component) directly under the hero showing `copy.capabilityLens[…]`. Recovery persona → chip hidden (no regression).

### 4. Caregiver subject switch

New `src/launch/persona/SubjectSwitch.tsx` — pill-style toggle: **Self · Supporting [name]**.

- Context: `src/launch/persona/SubjectContext.tsx` provides `{ subject: 'self' | 'supporting', supportedName, setSubject }`. Persists in localStorage.
- Mounted in `LaunchLayout` header **only when `isCaregiver`**.
- `QuietHome` reads `subject`:
  - `self` → caregiver copy (their wellbeing)
  - `supporting` → recovery copy with name interpolation ("Today is Mum's. We've kept it light.") and a small "Co-pilot view" status pill.
- Fixtures: pull `supportedName` from existing `fixtures.name` for demo; fallback "the person you support".

No data swap on backend — demo fixtures only. Marked with a one-line note in the component.

### 5. Persona-aware welcome

`src/pages/launch/LaunchWelcome.tsx` already branches on `recovery` / `caregiver`. Extend the same `getMessage()` switch to `productivity` and `student` — three highlight rows each, tone matched to the copy pack. No layout change.

### 6. QA matrix (manual, before close)

Walk each of the 4 personas through: Welcome → Home → Capture → Commit → Calibrate. Confirm:
- No recovery-coded phrase leaks into productivity/student.
- Caregiver switch toggles cleanly and persists across routes.
- Brain-injury path is byte-identical to today.

### Files

**New** (5)
- `src/launch/persona/usePersona.ts`
- `src/launch/persona/copy.ts`
- `src/launch/persona/SubjectContext.tsx`
- `src/launch/persona/SubjectSwitch.tsx`
- `src/components/launch/chrome/PersonaLensChip.tsx`

**Edited** (6)
- `src/components/launch/quiet/QuietHome.tsx`
- `src/components/launch/quiet/Scaffolds.tsx`
- `src/components/launch/quiet/IChooseHeart.tsx`
- `src/components/launch/LaunchLayout.tsx` (mount SubjectSwitch when caregiver)
- `src/pages/launch/LaunchWelcome.tsx`
- `src/pages/launch/LaunchCapture.tsx`, `LaunchCommit.tsx`, `LaunchCalibrate.tsx` (one prop each on `CapabilityPage` for the lens chip — single new optional prop `personaLens?: string`)

### Out of scope (deliberately)

- No new dashboards, no persona-specific KPIs, no new routes.
- No changes to Capture/Commit/Calibrate capability lists.
- No backend, no schema, no auth.
- No re-theming of brand colours.

### Risk

Low. All changes are additive strings + one optional chip + one caregiver-only header control. Recovery path unchanged by design.
