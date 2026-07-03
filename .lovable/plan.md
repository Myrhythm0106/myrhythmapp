
## Marketing / competitor read — "consultancy clean + warm"

You're right to want both. Here's the honest domain read:

**Who actually owns this space right now**
- **Wellness-warm end**: Headspace, Calm, Bearable, Cove — soft gradients, rounded illustrations, hand-drawn feel. Trusted by users, dismissed by clinicians and payers.
- **Consultancy-clean end**: Big Health (Sleepio/Daylight), Kaia Health, Sword Health, Livongo/Teladoc — restrained sans, one accent, data-forward, evidence badges. Trusted by payers, feels cold to survivors.
- **Nobody credible occupies the middle** where MyRhythm lives: warm enough that a stroke survivor at week 2 doesn't flinch, disciplined enough that a commissioner, insurer or Big 4 partner takes it seriously.

**The wedge — "Clinical Warmth"**
Think **Big Health × Headspace**, or visually: *Bain deck typography with Headspace's emotional temperature*. Concrete rules for the cheat sheet (and, later, the app):
- One accent per page, not three. Teal for calm/informational, burnt orange only for the single primary action, emerald only for progress/wins. Never all three shouting on one surface.
- Generous white space (Big 4 restraint) with **one warm human moment per page** — a rounded portrait card, a hand-lettered pull-quote, or a soft photographic texture — so it doesn't tip cold.
- Serif display for headings (warmth + authority — think Instrument Serif or Fraunces) paired with a clean humanist sans for body (Inter Tight / DM Sans). Serif is what separates "consultancy" from "SaaS".
- Rounded 12–16px corners, not pill-shaped. Pills read consumer. Sharp corners read enterprise. 12–16px reads *considered*.
- No gradient headings. No glass morphism on serious documents. Both are the current "wellness app" tells.

That's the direction. Now the artifact.

## Quick Start Cheat Sheet v1 — generic, 2-page A4

### Deliverable
- `/mnt/documents/MyRhythm_QuickStart_CheatSheet_v1.pdf` (print + share)
- `/mnt/documents/MyRhythm_QuickStart_CheatSheet_v1.docx` (editable master for founder tweaks)

Generic wording ("you and your person" / "the two of you") so it works for any Founding Member pair — survivor+caregiver, adult+partner, ADHD adult+accountability buddy — and can be handed on unchanged.

### Content — fixed, 2 pages A4 portrait

**Page 1 — Set up together (once, ~15 min)**
Header: "MyRhythm — Quick Start" · eyebrow "For you and your person"
One-line problem statement (verbatim from `APP_DESCRIPTION_USER`) + `DISCLAIMER_TEXT` micro-line.

Six numbered steps, two columns, one warm portrait-card motif top right:
1. Sign in at **myrhythmapp.com** — land on `/launch/welcome`
2. Each of you picks a door (Survivor / Caregiver / Busy Brain)
3. Complete the 3-step warm onboarding (persona → path → assessment)
4. Caregiver accepts the **Support Circle** invite from the survivor's email
5. Set timezone + preferred calendar in Launch Settings
6. Book your first weekly 5-min check-in together

Footer strip: three trust markers — "Not a medical device" · "Founding Edition v0.1" · "Confidential" (3pt, per project standard).

**Page 2 — Your daily rhythm (~4 min/day)**
The 4C loop as a horizontal checklist band, one card per C, each with:
- The C name (serif display)
- The `/launch/*` route in mono
- One line "what good looks like" pulled from `FEATURE_4R_MAP`
- A single Return/Reconnect line so the 4Rs show up

  - **Capture** `/launch/capture` — dump anything before it's lost
  - **Commit** `/launch/commit` — pick 1–3 things for today
  - **Calibrate** `/launch/calibrate` — energy check before the hard task
  - **Celebrate** `/launch/gratitude` — one win before bed

Below: a "when things wobble" strip (3 tiles):
- Missed a day → open the Re-entry card
- Overwhelmed → ping your Support Circle
- Can't remember a conversation → open Memory Bridge

Bottom-right: a small "Week 1 targets" ribbon — Day 1 capture · Day 3 first commit · Day 7 first celebrate. This is the SMART hook (measurable, time-bound) without lecturing.

### Visual system (the "Clinical Warmth" rules, applied)
- Palette (from `docs/design-system/color-usage-guide.md`, disciplined use only):
  - Primary ink: `brain-health-900` (near-black warm charcoal)
  - Page: warm off-white `#FBF9F5` (not pure white — warmth cue)
  - Accent 1 (calm/info headers): `clarity-teal-600`
  - Accent 2 (single CTA + week-1 ribbon): `brand-orange-600`
  - Accent 3 (progress ticks only): `memory-emerald-600`
  - Neutral rules: teal on page 1 (setup = calm), orange reserved for the *one* action arrow, emerald only in Celebrate + the targets ribbon.
- Type: Instrument Serif (headings, 32/24pt) + Inter Tight (body 10.5pt, labels 8.5pt tracked +40).
- Corners 12px. Rules 0.75pt. No gradients. No drop shadows. One thin hairline separator between sections.
- One warm element per page: page 1 = a soft rounded "the two of you" illustrative card (abstract, no faces — inclusive); page 2 = a hand-set serif pull-quote *"Small, kind, repeatable."*

### Technical build
- Python script `/tmp/build_cheatsheet.py` using ReportLab Platypus, A4 portrait, 18mm margins.
- Fonts: register Instrument Serif + Inter Tight via TTF (fetched via canvas-design font list if available; otherwise fall back to Source Serif 4 + Inter — both free, both consultancy-credible).
- Content strings pulled verbatim from `src/config/appDescription.ts` (`APP_DESCRIPTION_USER`, `DISCLAIMER_TEXT`, `FEATURE_4R_MAP.Capture/Commit/Calibrate/Celebrate/SupportCircle/MemoryBridge`) — no paraphrasing.
- DOCX generated from the same content model via `python-docx` so founder edits stay in sync with the PDF wording.
- Confidential 3pt footer on both pages per `mem://brand/document-confidentiality-standard`.

### Mandatory QA (per pdf skill)
- Render both pages at 150 DPI (`pdftoppm -r 150`), view each image, list any issues (overflow, clipping, low contrast, colour-rule breaks — e.g. orange used twice on one page), fix, re-render, repeat until clean. Report what was checked and what was fixed.

### Out of scope for this artifact
- Rewriting `/launch/welcome` or persona doors (that's the question-1 fix).
- Rolling "Clinical Warmth" into the live app (that's a separate design pass I'll scope if you want it next).
- Regenerating the full Handbook or any prior versioned docs.

### Delivery
Both files land in `/mnt/documents/` and are surfaced with `<presentation-artifact>` tags so you can download, print, and hand to founders immediately.
