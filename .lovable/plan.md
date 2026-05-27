
## Empowering Labels + Definitions

Replace the four clinical/functional category names with identity-led labels. Each label is paired with a short, professionally written definition that appears directly beneath it wherever the category is presented (onboarding selection, welcome screen, settings, persona switcher, copy adapters).

### The four categories

**1. Pathfinders** *(replaces: Recovery / Brain Injury / Long COVID / MS / Stroke / Dementia)*
> People rebuilding cognitive ground after a neurological event or condition — brain injury, stroke, dementia, long COVID, MS. Pathfinders use MyRhythm to bridge the gap between clinical-ready and life-ready, one steady step at a time.

**2. Anchors** *(replaces: Caregiver / Family Member / Medical Professional supporting a loved one)*
> The people who hold the line for someone else — family carers, spouses, adult children, professional carers. Anchors use MyRhythm to coordinate care without losing their own day, and to protect themselves from burnout.

**3. Operators** *(replaces: Executive / Professional / ADHD / Cognitive Optimization / Wellness)*
> High-output professionals and focus-seekers protecting their best thinking. Operators use MyRhythm to defend deep work, convert meetings into leverage, and keep signal above noise.

**4. Scholars** *(replaces: Student)*
> Students and lifelong learners pacing themselves toward recall, not burnout. Scholars use MyRhythm to turn lectures and revision into a searchable record, and to compound study across the week.

### Presentation pattern (used everywhere a category appears)

```text
┌────────────────────────────────────────────┐
│  [icon]  Pathfinders                       │
│          People rebuilding cognitive       │
│          ground after a neurological       │
│          event or condition.               │
└────────────────────────────────────────────┘
```

- Label: display weight, brand-emerald
- Definition: one or two sentences, muted-foreground, max ~160 chars on selection cards (full version on welcome/settings)

### Files to update

**Selection & onboarding**
- `src/pages/launch/LaunchUserType.tsx` — collapse 9 cards into 4 (Pathfinders, Anchors, Operators, Scholars), each with label + definition beneath
- `src/pages/launch/LaunchWelcome.tsx` — update persona greeting line to use the new label ("We've shaped MyRhythm around Pathfinders")

**Persona system**
- `src/launch/persona/usePersona.ts` — rename `Persona` union values and `PERSONA_LABEL` map; keep `mapToPersona` mapping legacy raw types to the new four
- `src/launch/persona/copy.ts` — update keys (`recovery → pathfinder`, `caregiver → anchor`, `productivity → operator`, `student → scholar`) and add a `definition` field to `PersonaCopy`
- `src/utils/personaLanguage.ts` — same key rename + add definition string per persona
- `src/components/memoryBridge/PersonaSwitcher.tsx` — replace Recovery/Executive toggle labels with Pathfinder/Operator (and surface the definition on hover/below)
- `src/hooks/usePersona.ts` — rename mode values and update `personaConfigs` keys

**Type surface**
- `src/types/user.ts` — keep raw `UserType` strings as-is (data layer), but introduce a `PersonaIdentity = 'pathfinder' | 'anchor' | 'operator' | 'scholar'` derived type used for display

### Backwards compatibility

- Existing localStorage values (`brain-injury`, `caregiver`, `executive`, etc.) continue to map correctly via `mapToPersona` — no data migration needed.
- Database `persona_mode` column keeps `'recovery' | 'executive'` for now; display layer translates to Pathfinder / Operator. A follow-up migration can rename column values later if desired.

### Out of scope

- No database migrations in this pass
- No change to assessment logic, scheduling, or behaviour loop
- "Anchors vs Keepers" decision: locked to **Anchors** per prior discussion; flag if you want Keepers instead before build

### Open question

Confirm definitions read right to you, or edit any of the four before I implement. Definitions are the part users will actually read — worth getting them in your voice.
