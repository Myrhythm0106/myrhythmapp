# Redesign `/launch` — engaging, transparent, audience-relatable

## Goal
Bring `/launch` (`src/pages/launch/LaunchLanding.tsx`) up to the engagement level of `/mvp`, while staying on-message for the **MyRhythm Founding Edition (v0.1)** and the Bridge Pathway thesis. Frontend only.

## Audiences this page must hook
Each visitor should see themselves in the first scroll:
- **Brain injury / stroke / concussion survivors** (post-discharge, "what now?")
- **Family members & caregivers** (juggling appointments, instructions, emotions)
- **Cognitively-overloaded professionals** (busy minds losing the thread)
- **Aging adults / early cognitive change** (worried about slipping)

We will NOT call these segments out by name on this page. The copy must feel universal enough that everyone nods, and specific enough that each group quietly thinks "that's me."

## New page structure

1. **Top utility strip** — slim band using `EDITION_*` from `src/config/edition.ts`; right-aligned "Sign in".

2. **Hero**
   - `EditionBadge` chip.
   - Gradient headline, e.g. **"When life gets loud, your rhythm gets lost."**
   - Sub-headline (one line, no medical claims): about turning everyday conversations into a calm, doable plan.
   - Primary CTA (brand-orange-500): "Join the Founding Cohort" → `/launch/register`.
   - Secondary ghost CTA: "See what's inside v0.1" → `/launch/settings/edition`.
   - Trust line: "No card for 7 days · Cancel anytime · Your data stays yours."

3. **"Does any of this sound familiar?" — universal-yet-relatable question triptych** *(this is the section the user is steering)*
   - Heading: **"Does any of this sound familiar?"**
   - Three glass cards. Each card is a single second-person question written so that a survivor, a caregiver, a busy professional, and an older adult can all answer "yes" — without any clinical or persona-specific language.
   - Each question is followed by a one-line, gentle "you're not alone" reply and a tiny "you might recognise this if…" micro-list of 2–3 plain-language situations spanning audiences. The micro-list is what makes a universal question land personally for each group.

   Draft (final wording tuned in build):

   - **Card 1 — the overload moment**
     *"Ever walked out of an important conversation already forgetting half of it?"*
     Reply: "You're not broken. Memory just isn't built for moments that big."
     You might recognise this if… a hospital discharge felt like a blur · a doctor's appointment turned into a folder you haven't opened · a packed week of meetings left you unsure what you actually agreed to · a family update needs repeating because it didn't stick the first time.

   - **Card 2 — the "now what?" moment**
     *"Do you ever know what matters this week — but not what to actually do on Monday?"*
     Reply: "Big plans rarely survive contact with a normal day. That's where we come in."
     You might recognise this if… you left somewhere with advice but no plan · you're caring for someone and holding their calendar in your head · your to-do list keeps getting longer instead of done · you keep starting fresh on Mondays and losing momentum by Wednesday.

   - **Card 3 — the lost-progress moment**
     *"Are you doing the right things, but somehow still losing the wins?"*
     Reply: "Progress that isn't noticed quietly disappears. We help it stick."
     You might recognise this if… small improvements aren't getting noticed · the household needs the same reminders again · effort at work isn't translating into visible progress · good days happen but you can't tell why.

   Constraints on this section:
   - No labels like "Discharge Cliff", "Caregiver Burden", "Cognitive Overload" on screen.
   - No diagnoses, no clinical terms, no age references.
   - Second person, warm, plain language. Each question must be answerable "yes" by all four audiences.
   - The micro-list under each card is the only place we lean into specifics — and it deliberately mixes audiences in one card so no one feels singled out, but everyone finds at least one line that fits.

4. **The 4C Loop** — heading "A gentle daily loop, built for cognitive continuity." Four cards: **Capture · Commit · Calibrate · Celebrate** (4-up at md+, 2×2 mobile). Each: icon, one-line value, micro-example.

5. **What's in the Founding Edition (transparency strip)** — two columns:
   - **Live in v0.1:** Memory Bridge, 4C loop, Smart Schedule, Clinical Export, GDPR export.
   - **Coming after v1.1:** Anchor digests, persona switcher, provider directory.
   - Link "Read the full v0.1 features" → `/launch/settings/edition`.
   - Disclaimer line: "MyRhythm does not diagnose, treat, or cure any condition."

6. **Founding-member proof band** — "873 spots remaining · Founding pricing locked for life · Direct line to the founder via in-app feedback."

7. **Final CTA footer** — repeat primary CTA + "Already a member? Sign in" + `EDITION_FOOTER` and confidentiality line per memory.

## Visual / technical notes
- Use existing semantic tokens (`brand-orange-*`, `brain-health-*`, `memory-emerald-*`, `clarity-teal-*`, `sunrise-amber-*`); no new colors.
- Glass cards: `bg-white/70 backdrop-blur border border-brain-health-100 rounded-3xl shadow-sm`.
- One tasteful `framer-motion` hero fade/slide-in; no scattered micro-animations.
- Reuse: `EditionBadge`, `LaunchButton`, lucide icons. No new dependencies.
- Mobile: hero stacks, 4C → 2×2, question cards stack. Min 56px touch targets.
- Page is self-contained (no `LaunchLayout`) so it stays a true public landing.
- SEO: single H1, inline `<title>` + `<meta description>`, semantic sections.

## Files touched
- **Rewrite:** `src/pages/launch/LaunchLanding.tsx`
- Split into small presentational subcomponents under `src/components/launch/landing/` only if the file exceeds ~250 LOC.

## Out of scope
- No changes to `/launch/register`, auth, onboarding, Memory Bridge, or backend.
- No new tables, no business logic.
- No persona-specific variants of this page.
- No new generated imagery; icons + gradients only.

## Verification
- Visual check at 1430×780 and at mobile width.
- Confirm Founding Edition label appears in hero + footer.
- Confirm CTAs route correctly (`/launch/register`, `/launch/settings/edition`, `/auth`).
- Confirm the three questions contain no clinical/persona labels and that each card's micro-list spans at least three of the four audiences.
