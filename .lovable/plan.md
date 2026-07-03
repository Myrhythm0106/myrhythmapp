# Plan v3 — Lock "Collaborative Cognitive Continuity layer" + retire "Start Your Journey" for the Founding stage

Two locked decisions in this pass:

1. **"Collaborative" is load-bearing** in the internal architecture term. Everywhere v2 said *"Cognitive Continuity layer"* now reads **"Collaborative Cognitive Continuity layer"**. The word encodes the Support Circle / clinician / family differentiator and cannot be dropped.
2. **"Start Your Journey" is retired for the Founding stage.** During v0.1 there is one primary landing CTA: **"Become a Founding Member"** → `/subscribe`. "Start Your Journey" (a free-account entry point) comes back **after** the Founding cohort closes and a free tier reopens.

---

## Decision being locked (internal + external language)

> **MyRhythm is an app** — a Memory-First cognitive-support app.
> **Internally** it operates as a *Collaborative Cognitive Continuity operating layer* running the 4C loop, with the Bridge Pathway as its clinical on-ramp.
> **Externally** the category is **Memory-First Design™**.
> **"OS" / "brain OS" / "operating system for your brain" language is banned externally.**

**Allowed internal vocabulary (priority order):**
1. **Collaborative Cognitive Continuity layer** — primary short form.
2. **Collaborative Cognitive Continuity operating layer running the 4C loop** — full form (architecture / investor technical slide).
3. **4C loop** — Capture → Commit → Calibrate → Celebrate.
4. **Bridge Pathway** — pre-discharge → life-ready on-ramp.

**Banned externally:** "OS", "brain OS", "operating system for your brain", "second brain", "brain gym app".

---

## 1 · Add Section 2 to `docs/5-year-vision.md`

Insert new **Section 2 · What we are (and what we're not)** before the existing Section 2; renumber the rest.

Content:

- **Product form:** cross-platform app (React/Vite + Capacitor + Supabase). Runs *on* an operating system, is not one.
- **Operating role (internal only):** a **Collaborative Cognitive Continuity operating layer** running the **4C loop**, with the **Bridge Pathway** as clinical on-ramp. Short form: *Collaborative Cognitive Continuity layer.*
- **Why "Collaborative" is load-bearing:** continuity is not solo. Support Circle, clinicians, and family are first-class participants — not notification recipients. This is the moat and the answer to "why not Notion / Apple Notes / Google Keep?"
- **Category we are earning (external):** **Memory-First Design™** — the design discipline for brains that fluctuate.
- **Language ladder by audience:**
  | Audience | Say this |
  |---|---|
  | User-facing (landing, app store, onboarding) | *"the Memory-First app for brain-injury recovery, MCI, and cognitive load"* |
  | Clinical | *"a post-discharge cognitive-support companion; not a medical device"* |
  | Investor (narrative) | *"the default post-discharge companion for brain-injury and MCI, with a clinical bridge into NHS and US rehab networks"* |
  | Investor (architecture slide only) | *"a Collaborative Cognitive Continuity operating layer running the 4C loop"* |
  | Internal / engineering / strategy docs | any of the four allowed terms above |
- **Banned external language + reasons:** regulatory drift toward medical-device claims, buyer confusion, investor over-scope pattern-match, category-creation cost.

## 2 · Save the rule to project memory

- Create `mem://brand/product-category-and-naming` (type: **constraint**) with the decision, the four allowed internal terms (with *Collaborative Cognitive Continuity layer* as primary), the language ladder, and the banned-external list.
- Update `mem://index.md`:
  - Core one-liner: *"MyRhythm is an app, not an OS. External category = Memory-First Design™. Internal architecture term = Collaborative Cognitive Continuity layer (full form: Collaborative Cognitive Continuity operating layer running the 4C loop). Never use 'brain OS' externally."*
  - Update the existing 4C-loop Core line to reference the *Collaborative* form so the two Core rules agree.
  - Add a Memories entry linking to the new constraint file.

## 3 · Sweep every document

`rg -n "\bOS\b|brain OS|operating system|second brain|brain gym"` across the repo. Also sweep for lone *"Cognitive Continuity"* without *"Collaborative"* and upgrade in internal contexts.

For each hit: delete, replace with the audience-appropriate label, or leave (only if it is one of the four allowed internal terms in a legitimate internal-architecture context).

Files in scope:
- `docs/5-year-vision.md` (post-Section 2 re-sweep)
- `docs/90-day-sprint.md`
- `docs/v0.1-friends-family-testing-guide.md`
- `docs/v0.1-weekend-self-test.md`
- `docs/v0.1-test-readiness.md`
- `docs/blog-integration-guide.md`
- `docs/design-system/*.md`
- `strategic-documents/*.md`
- `.lovable/plan.md`
- `README.md`
- `index.html` `<title>` + meta description
- `src/config/appDescription.ts`, `src/config/edition.ts` (spot-check)
- `src/components/mobile/SplashScreen.tsx` — remove the "Powered by LEAP-OS" line (external "OS" language).

## 4 · Retire "Start Your Journey" for the Founding stage

Founding Edition (v0.1) has **no free tier** (`mem://features/founding-core`). Two big primary CTAs that both mean "get started" is friction and misleading. Retire — do not delete — the free-account CTA until the free tier reopens.

**Edits:**
- `src/components/landing/HeroSection.tsx` — replace **"Start Your Journey Today"** with **"Become a Founding Member"**; handler navigates to `/subscribe` (not `/auth`); rename `handleStartJourney` → `handleBecomeFoundingMember`. Applies to every call site (top hero button + duplicates ~line 155, 161, 217).
- `src/components/landing/PreviewHeroSection.tsx` — same rename + destination change.
- `src/components/landing/PricingSection.tsx` — button label **"Start Your Free Trial"** → **"Become a Founding Member"** (destination `/subscribe` already correct). Replace microcopy *"No payment required to start"* with *"7-day free trial · Cancel anytime · 30-day money-back guarantee"*.
- `src/components/landing/FoundingMemberPricingCard.tsx` — button label **"Start Free Trial"** → **"Become a Founding Member"**; destination stays via the passed-in `onGetStarted`.
- `src/components/landing/CallToAction.tsx` — button label **"Start Your MYRHYTHM Journey"** → **"Become a Founding Member"**; `handleRegister` navigates to `/subscribe` instead of `/mvp/user-type-selection`.
- `src/components/mobile/SplashScreen.tsx` — button label **"Start Your Journey"** → **"Become a Founding Member"**; navigates to `/subscribe`. Also remove the *"Powered by LEAP-OS"* strapline (banned external "OS" language).
- `src/pages/PlanSelectionPage.tsx` — reword descriptive text *"Start your journey with a 7-day free trial"* → *"Start your Founding Member trial — 7 days free, no charges until it ends."*
- `src/components/brain-recovery/sections/HeroSection.tsx` — keep the survivor-specific phrase **"Start Your Recovery Journey"** (it is not the duplicate landing CTA; different section, different intent).

**Deferred, not deleted:** add a one-line comment above each changed handler — `// Founding-stage CTA. Restore "Start Your Journey" free path in v0.2 when free tier reopens.` This is the retirement note so we can bring it back cleanly.

Add a Memories entry `mem://ux/founding-stage-cta` (type: **constraint**) recording: *During Founding Edition v0.1, the only primary landing CTA is "Become a Founding Member" → /subscribe. "Start Your Journey" / free-account CTAs return in v0.2 when the free tier reopens.*

## 5 · Regenerated artefact documents

For the .pdf / .docx set the user is viewing (Handbook, Quick Start Cheat Sheet, GTM Playbook v5, User Manual v3):

1. Locate the generator scripts under `scripts/` and `/mnt/documents/`.
2. Update source strings to use the language ladder + the *Collaborative* form. Add a "How we describe ourselves" reference card to Handbook v2 and GTM Playbook v6.
3. Regenerate (never overwrite):
   - `MyRhythm_GTM_Playbook_v6.pdf`
   - `MyRhythm_UserManual_FoundersEdition_v4.pdf`
   - `MyRhythm_QuickStart_CheatSheet_v2.docx` + `.pdf`
   - `MyRhythm_Handbook_v2.docx`
4. QA every page as an image before delivering. Fix and re-run on any clipping / colour / alignment issues.
5. Emit `<presentation-artifact>` tags for each new file.

## 6 · What I will not do in this pass

- Not renaming in-app labels (Capture / Commit / Calibrate / Celebrate, Memory Bridge, Support Circle, Bridge Pathway all stay).
- Not touching the 4C loop, three-failures thesis, or Memory-First Design™ priority order.
- Not rebuilding the landing page beyond the CTA swaps.
- Not changing pricing, features, or roadmap dates.
- Not deleting the `/auth` sign-up route — it just isn't a primary CTA during Founding.

## 7 · Definition of done

- `docs/5-year-vision.md` has the new Section 2 with the *Collaborative* form + language ladder.
- `mem://brand/product-category-and-naming` and `mem://ux/founding-stage-cta` exist; `mem://index.md` Core updated.
- `rg "brain OS|operating system for your brain|second brain|brain gym|LEAP-OS"` returns zero hits.
- `rg "Start Your Journey|Start Your MYRHYTHM Journey|Start Your Free Trial|Start Free Trial"` on landing/pricing/splash returns zero hits (survivor-page "Start Your Recovery Journey" excluded and documented).
- Only one primary CTA on the landing hero: **Become a Founding Member** → `/subscribe`. Pricing card + splash + CTA section all match.
- Handbook v2, Quick Start Cheat Sheet v2, GTM Playbook v6, User Manual v4 regenerated, page-by-page QA'd, delivered via `<presentation-artifact>` tags.
- Closing summary lists every file changed and every regenerated artefact.

## Technical notes

- Use `rg -n` for sweeps.
- Prefer `code--line_replace` over full rewrites; only rewrite whole files when >30% changes.
- DOCX regen via `docx` skill (US Letter, Arial, palette per `mem://style/color-palette`); PDFs via LibreOffice headless from DOCX.
- QA every page as an image before delivering (temp files in `/tmp`, not `/mnt/documents`).

Approve and I'll implement in build mode.