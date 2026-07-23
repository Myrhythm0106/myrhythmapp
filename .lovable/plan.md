## 1. Export the reference doc

Copy `docs/problem-fit-and-market.md` → `/mnt/documents/MyRhythm_Problem-Fit_and_Market_v1.md` and surface it as a downloadable artifact.

## 2. Investor-friendly infographic

**Deliverable:** single high-resolution PNG (1600×1000) at `/mnt/documents/MyRhythm_Market_Wedge_Infographic_v1.png`, surfaced via `<presentation-artifact>`.

**Concept — "The Wedge Inside the Market":**

```text
┌──────────────────────────────────────────────────────────┐
│  60,000,000+  addressable adults (UK + US)               │
│  ████████████████████████████████████████████████████    │
│     ┌───────────────────────────────────────────┐        │
│     │  500K–650K avoidable readmissions / year  │        │
│     │  Stroke · TBI · Dementia                  │        │
│     └───────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────┘
```

**Layout (Emerald Prestige palette — INK #0F2A24, MOSS #2F6B4F, GOLD #C9A24B, EMBER #C0554D, IVORY #F6F1E6):**

- **Header:** "The Market MyRhythm Serves" · eyebrow "Problem-Fit v0.1"
- **Left 60%:** Proportional nested-square viz
  - Outer square = 60M+ soft-value market (moss fill)
  - Inner square, sized to true ~1% ratio = 500–650K hard-dollar wedge (ember fill, gold outline)
  - Callout lines with tabular-nums figures
- **Right 40%:** Four stat cards
  - 350K UK brain-injury admissions/yr
  - 900K UK dementia/MCI adults
  - 6.5M UK+US ADHD adults
  - 74% working adults report cognitive overload
- **Bottom strip:** Stroke 30-day ~12.4% · TBI 30-day 12–23% · Dementia 30-day ~20% · ~70% preventable · ~$13.5K avg US readmission cost
- **Footer:** "Market context, not a clinical claim. MyRhythm does not diagnose or treat." + confidentiality line

**Generation:** Python + Pillow using canvas-design bundled fonts (InstrumentSerif for display, WorkSans for body). All figures pulled verbatim from `docs/problem-fit-and-market.md` — no new numbers.

**QA:** render → view PNG → check overflow, contrast, wedge proportion, verify every stat matches source → fix and re-render until clean.

**Files touched:** none in the app codebase. Outputs land in `/mnt/documents/` only.
