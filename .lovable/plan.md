# Plan v15 — MyRhythm Founding Edition: Make It Ready

Lock the v0.1 release as **"MyRhythm Founding Edition"**, surface that identity consistently across the app, give founding members a one-tap feedback channel, set honest expectations about what's in vs. deferred, and ship a QA checklist the cohort lead can tick through before invites go out.

---

## 1. Edition identity

**Official name:** `MyRhythm Founding Edition`  
**Short label (chips/badges):** `Founding Edition`  
**Version string:** `v0.1`  
**Tagline (where space allows):** *"Shaped with our founding members."*

Single source of truth: `src/config/edition.ts` exporting `EDITION_NAME`, `EDITION_SHORT`, `EDITION_VERSION`, `EDITION_TAGLINE`. Every surface imports from here so future rename is one file.

---

## 2. Surface the label across the app

New `EditionBadge` component (glass-morphism chip, brand-teal outline, 12px text, respects min-touch only when interactive). Insert on:

1. `LaunchWelcome` — subtitle line under hero
2. `LaunchDashboard` — header right-side chip
3. `LaunchSettings` — new "About this edition" row
4. `FirstRunOverlay` — header line
5. `clinicalExport.ts` PDF — footer next to confidentiality line
6. `gdprExport.ts` PDF — footer next to confidentiality line
7. Auth/landing entry point — small footer mention so testers know what they're entering

---

## 3. In-app feedback channel

New `FeedbackDialog` component triggered from:
- `LaunchSettings` → "Send feedback to the team" row
- `FirstRunOverlay` → secondary link "Tell us how this felt"
- Dashboard header → small `MessageCircle` icon next to EditionBadge

Backend: new `founding_feedback` table (Supabase migration) with `user_id`, `category` (bug | idea | confusion | praise), `message`, `route` (auto-captured), `edition_version`, `created_at`. RLS: users insert/select their own; service_role full access for the team. Grants to `authenticated` + `service_role` only.

Dialog fields: category (3 chips, max-3 rule), free-text message (500 char), optional "OK to contact me" checkbox. Confirmation toast on submit.

---

## 4. "What's in this Founding Edition" transparency page

New route `/launch/settings/edition` reached from Settings → "About this edition".

Two clearly labeled lists:

**Live in Founding Edition (v0.1)**
- 4C loop with Smart Schedule + energy badges
- Memory Bridge recorder with 30-day retention
- Support Circle with permissions (incl. record-on-behalf, OFF default)
- Clinical Export PDF (share with clinician)
- GDPR Data Export (download my data)
- Vision Board, Assessment, Persona paths
- Calendar sync (Google, Outlook)
- MFA, RLS, Vault security baseline

**Coming after Founding Edition (v1.1)**
- Weekly Anchor digest (G5)
- Formal WCAG 2.2 AA certification (G6 baseline already in place)
- Mid-journey persona switcher
- Backend hardening for record-on-behalf (`recorded_by_user_id` column + accountability alerts)
- Provider Directory marketplace expansion

Plus the standing no-medical-claims disclaimer block at the bottom.

---

## 5. QA / test-readiness checklist

New doc `docs/v0.1-test-readiness.md` — markdown checklist for the cohort lead:

- [ ] All 9 persona paths reach `/launch/welcome` without dead-end
- [ ] FirstRunOverlay dismissal persists across logout/login
- [ ] Clinical Export PDF renders on a real meeting (not sample)
- [ ] GDPR export 24h rate-limit verified across session cycle
- [ ] `can_record_on_behalf` toggle round-trips through Supabase
- [ ] EditionBadge visible on all 7 surfaces
- [ ] Feedback dialog writes to `founding_feedback` and shows confirmation
- [ ] Edition page lists live vs. deferred accurately
- [ ] All PDF footers carry confidentiality + edition string
- [ ] No-medical-claims disclaimer present on Welcome, Assessment, Memory Bridge, Clinical Export
- [ ] Min 56px touch targets on primary CTAs
- [ ] Reduced-motion respected on FirstRunOverlay animations
- [ ] Bone background + teal primary consistent across UserType / Welcome / Dashboard

---

## 6. Execution order

1. **Migration first** (separate call): create `founding_feedback` table with RLS + grants.
2. **Build pass:** `edition.ts`, `EditionBadge`, `FeedbackDialog`, edition page, badge insertions on 7 surfaces, PDF footer updates, QA doc.
3. **Memory update:** add `mem://brand/founding-edition` entry recording the name, version, and label-everywhere rule.

## Technical notes

- `src/config/edition.ts` — single export module, no React deps.
- `src/components/launch/EditionBadge.tsx` — `variant: "chip" | "inline" | "footer"`.
- `src/components/launch/FeedbackDialog.tsx` — uses existing shadcn Dialog + Textarea; Supabase insert via existing client.
- `src/pages/launch/LaunchEditionAbout.tsx` — route under existing `LaunchSettings` shell.
- PDF utilities (`clinicalExport.ts`, `gdprExport.ts`) — append `EDITION_NAME · EDITION_VERSION` to existing 3pt confidentiality footer.
- No changes to onboarding flow, persona logic, scheduling, or Memory Bridge core — labeling and feedback only.
