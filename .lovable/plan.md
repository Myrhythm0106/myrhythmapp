

# LEAP-OS: Life Empowerment And Productivity — Operating System

## Definition

**LEAP-OS** = **L**ife **E**mpowerment **A**nd **P**roductivity — **O**perating **S**ystem

The acronym LEAP retains "And Productivity" as a core pillar. The "-OS" suffix elevates it from app to infrastructure. Full tagline:

> LEAP-OS is the world's first Life Empowerment And Productivity Operating System — a cognitive infrastructure designed to align your daily actions with your biological rhythm and long-term aspirations.

## Changes

### Tier 1: Primary brand surfaces (7 files)

| File | Line | Current | New |
|------|------|---------|-----|
| `AppleHeroSection.tsx` | 35 | "Transform challenges into confidence..." | Add line below: "Powered by LEAP-OS — the world's first Life Empowerment And Productivity Operating System" |
| `SplashScreen.tsx` | 35 | Just "MyRhythm" | Add subtitle: "Powered by LEAP-OS" |
| `ProductivityInvestorSlides.tsx` | 56 | "Built for the hardest cognitive (memory) challenges..." | Add "Powered by LEAP-OS" beneath. Update line 764 disclaimer to "MyRhythm is a Life Empowerment And Productivity Operating System (LEAP-OS). It is not a medical device." |
| `MeetMyRhythmSection.tsx` | 10 | "isn't just another productivity app" | "isn't just another productivity app — it's LEAP-OS: the world's first Life Empowerment And Productivity Operating System" |
| `AuthenticationGate.tsx` | 109 | "Memory1st → LEAP Forward" | "Powered by LEAP-OS" |
| `Welcome.tsx` | 148 | "Memory1st → LEAP Forward" | "Powered by LEAP-OS" |
| `AuthPage.tsx` | 58 | "Memory1st → LEAP Forward" | "Powered by LEAP-OS" |

### Tier 2: Welcome screen disclaimers (5 files)

All updated to: "MyRhythm is a Life Empowerment And Productivity Operating System (LEAP-OS). It is not a medical device..."

| File | Line |
|------|------|
| `BrainHealthWelcome.tsx` | 107 |
| `CognitiveSupportWelcome.tsx` | 107 |
| `MSCognitiveWelcome.tsx` | 107 |
| `LongCovidWelcome.tsx` | 107 |
| `ADHDWelcome.tsx` | 107 |

### Tier 3: Dashboard and feature references (5 files)

| File | Current | New |
|------|---------|-----|
| `FeatureCategories.tsx` L28 | "LEAP Journey" | "LEAP-OS Journey" |
| `FeatureCategories.tsx` L49 | "LEAP Goals" | "LEAP-OS Goals" |
| `PersonalEmpowermentMeter.tsx` L84 | "Daily LEAP Actions" | "Daily LEAP-OS Actions" |
| `PersonalEmpowermentHub.tsx` L49 | "Day X of Your LEAP Journey" | "Day X of Your LEAP-OS Journey" |
| `BrainRecoveryPage.tsx` L35 | "LEAP methodology" | "LEAP-OS methodology" |

### Tier 4: Documentation (3 files)

| File | Change |
|------|--------|
| `docs/myrhythm-one-page-pitch.md` | Solution line: "MyRhythm is the first Life Empowerment And Productivity Operating System built on brain science." UVP references LEAP-OS. |
| `MyRhythm_Executive Summary_One_Page.md` | Opening definition updated to LEAP-OS |
| `InvestorSlides.tsx` L777 | "Life Empowerment & Productivity" → "Life Empowerment And Productivity Operating System (LEAP-OS)" |

### Tier 5: Strategy PDF (v6)

Regenerate `/mnt/documents/MyRhythm_Productivity_5_Year_Strategy_v6.pdf` with LEAP-OS framing throughout, including a new section: "Why an Operating System?" explaining platform defensibility and ecosystem moat.

## What stays unchanged

- "Memory1st → LEAP" references in motivational/empowerment content (DailyEmpowermentBoost, WelcomeCard descriptions, tutorialData) — these refer to the user's personal journey outcome, not the platform brand
- Competitor contrasts using "productivity app/tool" — these describe competitors, not MyRhythm
- LoginModal tagline — will naturally update via the AuthPage change pattern

## Files Summary

| # | File | Action |
|---|------|--------|
| 1 | `src/components/landing/AppleHeroSection.tsx` | Add LEAP-OS subtitle |
| 2 | `src/components/mobile/SplashScreen.tsx` | Add LEAP-OS subtitle |
| 3 | `src/components/investor/ProductivityInvestorSlides.tsx` | Update subtitle + disclaimer |
| 4 | `src/components/investor/InvestorSlides.tsx` | Update footer text |
| 5 | `src/components/founders-story/MeetMyRhythmSection.tsx` | Update intro |
| 6 | `src/components/onboarding/AuthenticationGate.tsx` | Update tagline |
| 7 | `src/pages/Welcome.tsx` | Update tagline |
| 8 | `src/pages/AuthPage.tsx` | Update tagline |
| 9 | `src/components/mvp/BrainHealthWelcome.tsx` | Update disclaimer |
| 10 | `src/components/mvp/CognitiveSupportWelcome.tsx` | Update disclaimer |
| 11 | `src/components/mvp/MSCognitiveWelcome.tsx` | Update disclaimer |
| 12 | `src/components/mvp/LongCovidWelcome.tsx` | Update disclaimer |
| 13 | `src/components/mvp/ADHDWelcome.tsx` | Update disclaimer |
| 14 | `src/components/dashboard/FeatureCategories.tsx` | LEAP → LEAP-OS |
| 15 | `src/components/dashboard/PersonalEmpowermentMeter.tsx` | LEAP → LEAP-OS |
| 16 | `src/components/dashboard/PersonalEmpowermentHub.tsx` | LEAP → LEAP-OS |
| 17 | `src/pages/BrainRecoveryPage.tsx` | LEAP → LEAP-OS |
| 18 | `docs/myrhythm-one-page-pitch.md` | Update solution + UVP |
| 19 | `MyRhythm_Executive Summary_One_Page.md` | Update opening |
| 20 | `/mnt/documents/MyRhythm_Productivity_5_Year_Strategy_v6.pdf` | Regenerate |

