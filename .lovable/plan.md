

# Update to "Cognitive Operating System" — All Files + Strategy PDF

## New Definition

**LEAP-OS** brand name stays. The descriptor changes:

- **Old:** "Life Empowerment And Productivity Operating System"
- **New (full, first appearance):** "The world's first Cognitive Operating System. Aligning memory, biological rhythm, and follow-through to turn daily actions into long-term performance and outcomes."
- **New (short, subsequent):** "Cognitive Operating System" or just "LEAP-OS"

The acronym LEAP still expands to Life Empowerment And Productivity — but the platform descriptor becomes "Cognitive Operating System" which is sharper, more investable, and more memorable.

## Changes Across All Files (20 files)

### Tier 1: Primary Brand Surfaces (7 files)

| File | Current | New |
|------|---------|-----|
| `AppleHeroSection.tsx` L38 | "Powered by LEAP-OS — the world's first Life Empowerment And Productivity Operating System" | "Powered by LEAP-OS — the world's first Cognitive Operating System" |
| `SplashScreen.tsx` L37 | "Powered by LEAP-OS" | Keep as-is (short form is fine here) |
| `ProductivityInvestorSlides.tsx` L59 | "Powered by LEAP-OS" | Keep, but update L767 disclaimer to: "MyRhythm is a Cognitive Operating System (LEAP-OS). It is not a medical device." |
| `MeetMyRhythmSection.tsx` L10 | "it's LEAP-OS: the world's first Life Empowerment And Productivity Operating System" | "it's LEAP-OS — the world's first Cognitive Operating System. Aligning memory, biological rhythm, and follow-through to turn daily actions into long-term performance and outcomes." |
| `AuthenticationGate.tsx` L109 | "Powered by LEAP-OS" | Keep as-is |
| `Welcome.tsx` L148 | "Powered by LEAP-OS" | Keep as-is |
| `AuthPage.tsx` L58 | "Powered by LEAP-OS" | Keep as-is |

### Tier 2: Welcome Screen Disclaimers (5 files)

All updated from "Life Empowerment And Productivity Operating System (LEAP-OS)" to "Cognitive Operating System (LEAP-OS)":

- `BrainHealthWelcome.tsx` L107
- `CognitiveSupportWelcome.tsx` L107
- `MSCognitiveWelcome.tsx` L107
- `LongCovidWelcome.tsx` L107 (currently references old text per search)
- `ADHDWelcome.tsx` L107

### Tier 3: Dashboard References (4 files)

No change needed — "LEAP-OS Journey", "LEAP-OS Actions", "LEAP-OS methodology" are brand references, not descriptor expansions.

### Tier 4: Documentation (3 files)

| File | Change |
|------|--------|
| `docs/myrhythm-one-page-pitch.md` | Title: "The World's First Cognitive Operating System". Solution line updated. Footer updated. |
| `MyRhythm_Executive Summary_One_Page.md` | Subtitle + all "Life Empowerment And Productivity Operating System" → "Cognitive Operating System". First mention includes full tagline. |
| `InvestorSlides.tsx` L777 | "Life Empowerment And Productivity Operating System (LEAP-OS)" → "Cognitive Operating System (LEAP-OS)" |

### Tier 5: Strategy PDF (v7)

Regenerate `/mnt/documents/MyRhythm_Productivity_5_Year_Strategy_v7.pdf` with:
- "Cognitive Operating System" as the platform descriptor throughout
- Full tagline on first appearance: "The world's first Cognitive Operating System. Aligning memory, biological rhythm, and follow-through to turn daily actions into long-term performance and outcomes."
- LEAP acronym still expands to "Life Empowerment And Productivity" where the acronym origin is explained
- Updated "Why an Operating System?" section reframed around "Cognitive Operating System"

## What LEAP Still Means

Wherever the acronym itself is explained (e.g. "what does LEAP stand for?"), it remains **Life Empowerment And Productivity**. The change is to the platform descriptor — from verbose "Life Empowerment And Productivity Operating System" to punchy "Cognitive Operating System."

## Files Summary

| # | File | Action |
|---|------|--------|
| 1 | `src/components/landing/AppleHeroSection.tsx` | Update descriptor |
| 2 | `src/components/investor/ProductivityInvestorSlides.tsx` | Update disclaimer L767 |
| 3 | `src/components/investor/InvestorSlides.tsx` | Update footer L777 |
| 4 | `src/components/founders-story/MeetMyRhythmSection.tsx` | Full new tagline |
| 5 | `src/components/mvp/BrainHealthWelcome.tsx` | Update disclaimer |
| 6 | `src/components/mvp/CognitiveSupportWelcome.tsx` | Update disclaimer |
| 7 | `src/components/mvp/MSCognitiveWelcome.tsx` | Update disclaimer |
| 8 | `src/components/mvp/LongCovidWelcome.tsx` | Update disclaimer |
| 9 | `src/components/mvp/ADHDWelcome.tsx` | Update disclaimer |
| 10 | `docs/myrhythm-one-page-pitch.md` | Update title, solution, footer |
| 11 | `MyRhythm_Executive Summary_One_Page.md` | Update throughout |
| 12 | `/mnt/documents/MyRhythm_Productivity_5_Year_Strategy_v7.pdf` | Regenerate |

Files that stay unchanged: `SplashScreen.tsx`, `AuthPage.tsx`, `Welcome.tsx`, `AuthenticationGate.tsx` (all just say "Powered by LEAP-OS"), dashboard files (brand name references only).

