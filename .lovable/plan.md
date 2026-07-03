## Plan: Husband-Ready Test Pass (v1)

Three asks: (1) put Brain Games on the long-term roadmap, (2) run the weekend self-test end-to-end, (3) verify the onboarding chain — landing page → purchase → "where do I go now?" — reads cleanly for a first-time user.

---

### 1 · Brain Games on the roadmap

Note: the project has a **24-month execution plan** (`strategic-documents/24-Month-Master-Execution-Plan.md`) and an interactive Gantt roadmap (`src/data/roadmapData.ts`, timeline Apr–Dec 2026). There is no dedicated "5-year plan" file. I will treat "5-year plan" as **the visible interactive roadmap** unless you tell me otherwise.

Findings so far:
- `roadmapData.ts` already has a `brain-games` task ("Brain Games & Cognitive Tools"), and it is a dependency of a later item.
- `docs/v0.1-features.md` lists `/launch/games` under Founding Core.
- Brain Games are **not** currently exposed in the v0.1 nav (Founding Core is 9 routes; games is flagged off for v0.2).

Action:
- Confirm the `brain-games` roadmap entry has a real date range, subtasks, and a status that reflects "post-v0.1 / v0.2 release" — tighten wording if it currently reads like it ships in MVP.
- Add a one-line entry in `strategic-documents/Feature-Release-Calendar.md` for Brain Games under the v0.2 window so it appears in the release calendar too.
- No new roadmap file is created. If you actually want a separate `docs/5-year-plan.md`, say the word and I'll add one.

### 2 · Weekend self-test (`docs/v0.1-weekend-self-test.md`)

I'll drive this via Playwright against `http://localhost:8080` and produce a pass/fail sheet with screenshots for each step. Sections walked, in order:

1. **Pre-flight** — incognito, sign out, seed creds ready.
2. **Public funnel** — `/` → `/mvp/user-type-selection` (Brain Injury) → `/mvp/assessment` → `/mvp/payment` (test path, no real charge) → `/launch/welcome`. Confirm EditionBadge above headline, no medical claims, disclaimers present.
3. **4C loop with output handling** — record on `/launch/memory`, extract actions, verify **Copy / Email / Download** toolbar on the recording row; `/launch/commit` shows extracted action, Copy plan; `/launch/calibrate` add reflection + Email; `/launch/home` shows the win.
4. **Memory Library access** — recording visible, Play + View Actions work, Copy/Email/Download present.
5. **Support Circle** — invite fake email, toggle `can_record_on_behalf` on/off, "Record meeting for [name]" appears only when ON.
6. **Safety net** — disclaimers on memory + calibrate; Settings → Download my data yields JSON + PDF; Clinical Export footer reads `Founding Edition · v0.1` + confidentiality line.

Deliverable: a pass/hold table matching the script's rubric (all ✅ → ship for F&F; ≤2 🟧 → ship with known issues; any 🟥 → hold). Screenshots stored under `/tmp/browser/self-test/`.

### 3 · Husband-test onboarding continuity (landing → purchase → in-app)

This is what will trip a first-time user, so I'll audit the actual chain rather than trust the checklist.

Current routing (from `MVPMainFlow.tsx` and `App.tsx`):

```text
/  (landing)
 → /mvp/user-type-selection
 → /mvp/assessment
 → /mvp/payment
 → [MVPMainFlow internal steps: privacy → app-story → path → assessment → features]
 → "Continue to Guided Setup" button → /guided-journey
```

But the Founding Core lives at `/launch/*` and expects users to land on `/launch/welcome` then `/launch/home`. `/guided-journey` is a separate legacy surface. Sign-in via `/launch/sign-in` correctly routes to `/launch/home`, but the **purchase flow does not**. That is the exact "where do I go now?" gap.

Audit + fixes I will apply:
- **Post-payment landing:** confirm what a paid new user sees after `/mvp/payment` — should end at `/launch/welcome` (EditionBadge visible), not `/guided-journey`. If it lands anywhere else, redirect the terminal step to `/launch/welcome`.
- **First-run overlay:** verify `FirstRunOverlay` fires once on first `/launch/home` load and persists `mr:first-run-done` across logout (per readiness checklist).
- **"What do I do next" clarity on `/launch/welcome`:** confirm there is a single primary CTA into the 4C loop (Capture on `/launch/memory`) rather than a wall of tiles. If there are >3 primary choices, cut to 3 (per Inclusive Design core rule).
- **Nav sanity for Founding Core:** confirm only the 9 Founding Core routes are in the nav and legacy redirects work (`/dashboard` → `/launch/home`, `/memory-bridge` → `/launch/memory`, `/calendar` → `/launch/calendar`, `/command-center` → `/launch/support`, `/gratitude` → `/launch/calibrate`).
- **Receipt / welcome email:** verify a purchase confirmation appears (toast or email) so your husband knows the payment worked before he's dropped into the app. If none exists in the test path, note it as a known issue rather than build new email infra.

Deliverable: a short "husband walkthrough" note listing each screen he'll see in order, the one action he should take on each, and any rough edges found.

---

### Files likely touched (only if audit finds gaps)
- `src/data/roadmapData.ts` — tighten Brain Games entry (dates/status/subtasks).
- `strategic-documents/Feature-Release-Calendar.md` — add Brain Games line.
- `src/components/mvp/MVPMainFlow.tsx` and/or `src/pages/MVPPaymentPage.tsx` — redirect terminal step to `/launch/welcome`.
- `src/pages/launch/LaunchWelcome.tsx` — trim to ≤3 primary CTAs if overloaded.

### Out of scope
- Building any new feature, page, or email template.
- Enabling Brain Games in the v0.1 Founding Core nav (stays flagged for v0.2).
- Rewriting the marketing landing copy beyond what the recent edits already changed.
- Real payment processing — self-test uses the test payment path only.

### One thing I need from you
"5-year plan" — do you mean the existing interactive roadmap (Apr–Dec 2026 today), the 24-month execution plan, or should I create a new `docs/5-year-plan.md` that projects out to 2031?
