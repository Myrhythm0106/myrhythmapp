# Emoji-to-Icon Sophistication Plan

## Goal
Eradicate every childish/baby emoji from user-facing surfaces. Replace with a visual language evoking top-tier consulting firms — clean, iconic, proud, and worthy.

## Design Direction
- **No cartoon faces, no toys, no animals.**
- **Lucide icons** for functional states (mood, energy, actions).
- **Abstract geometric shapes** (circles, diamonds, bars, rings) for tiered/ranked data (energy levels 1-5, mood states).
- **Premium colour-coded pills** with single-letter or Roman numeral labels where ranking matters.
- **Refined celebration badges** using starburst/radial lines, not party emojis.

## Scope — All user-facing emojis

### 1. Energy & Mood Selection (Highest Impact)
**Files:**
- `src/components/calendar-tbi/components/EnergyLevelInput.tsx`
- `src/components/dashboard/widgets/MoodEnergyWidget.tsx`
- `src/components/dashboard/widgets/EmpowermentMoodWidget.tsx`
- `src/components/onboarding/empowerment/WellnessAssessmentStep.tsx`
- `src/pages/MoodTracking.tsx`

**Current:** Face emojis (😴😑😊😄🚀 / 😊😐😔🤕)

**Replace with:**
- Energy 1-5: Vertical bar icons (Battery style) or filled-circle progression rings in a refined palette
- Mood 5-state: Diamond-shaped mood markers with Lucide icons — `Zap` (excellent), `TrendingUp` (good), `Minus` (neutral), `TrendingDown` (challenging), `CloudRain` (difficult)
- Colour: muted brand tones, not primary-bright

### 2. Celebration & Milestone System
**Files:**
- `src/components/celebrations/VictoryCelebration.tsx`
- `src/components/celebrations/CelebrationSystem.tsx`
- `src/hooks/useMilestoneCelebrations.ts`

**Current:** 🚀💪🏆✨

**Replace with:**
- Icons: `Rocket` (launch), `Trophy` (win), `Sparkles` (milestone), `Star` (achievement), `Target` (goal)
- Animation: subtle scale + glow, no bounce

### 3. Gratitude & Journal Prompts
**Files:**
- `src/components/gratitude/journal/utils/promptTypeUtils.ts`
- `src/components/gratitude/EnhancedGratitudePrompt.tsx`

**Current:** 💪🧘👥✨📝

**Replace with:**
- `Dumbbell` (fitness), `Brain` (mindfulness), `Users` (social), `Lightbulb` (general), `Pencil` (journal)

### 4. Support Circle & Social
**Files:**
- `src/pages/launch/LaunchSupportCircle.tsx`

**Current:** 💪👥

**Replace with:**
- `HeartHandshake` or `Users` for support circle
- `UserPlus` for invite

### 5. Dashboard & Widgets
**Files:**
- `src/components/dashboard/RecentWins.tsx`
- `src/components/launch/LaunchEmpoweringMessage.tsx`
- `src/components/launch/quiet/IChooseHeart.tsx`

**Current:** 🏆 and rotating text emojis

**Replace with:**
- `Award` or `Medal` for wins
- Text-only empowering messages, no trailing symbols
- `Heart` icon (already Lucide, keep it)

### 6. Data Files (Content Strings)
**Files:**
- `src/data/dreamPromptSuggestions.ts`
- `src/data/visionPillars.ts`
- `src/utils/empoweringGlossary.ts`
- `src/utils/personaLanguage.ts`

**Action:** Strip all emoji characters from labels, titles, and descriptions. Replace with nothing or a Lucide icon wrapper where contextually needed.

### 7. Toast & Log Messages
**Files:**
- `src/utils/myrhythmToast.ts`
- `src/utils/security/mockSecureLogger.ts`
- `src/utils/calendarIntegration.ts`
- `src/utils/empoweringGlossary.ts`

**Action:** Remove emoji prefixes from toast messages. Use icon + text or text-only.

### 8. Onboarding & Assessment
**Files:**
- `src/components/onboarding/empowerment/WellnessAssessmentStep.tsx`
- `src/pages/MoodTracking.tsx`

**Already covered in #1.** Ensure no emojis leak through on any onboarding path.

---

## Technical Approach

### Phase 1: Audit & Map (this plan)
Full inventory complete above.

### Phase 2: Build Replacement Components
1. **`MoodStateSelector`** — Reusable 5-state mood picker using Lucide icons + diamond markers.
2. **`EnergyLevelSelector`** — Reusable 5-level energy picker using vertical bar progression + ring indicators.
3. **`CelebrationBadge`** — Reusable achievement badge using starburst SVG + icon, no emoji.
4. **`PromptTypeIcon`** — Map gratitude/activity types to Lucide icons.

### Phase 3: Swap & Verify
Replace emoji usage in each file with new components or direct Lucide icons.
Verify with `rg` that zero user-facing emoji characters remain in `src/`.

### Phase 4: Visual Polish
- Ensure icon sizing is 24-32px, never oversized.
- Use `strokeWidth={1.5}` for refined line weight.
- Colour: map to existing brand tokens (teal, purple, orange, magenta).
- Dark mode compatibility maintained.

---

## Exclusions (Emojis Stay)
- **Developer logs / mock security logger** — internal only, not user-facing.
- **Test files / edge function HTML** — not production UI.
- **Public-facing PPT / documents** — outside app codebase.

---

## Deliverables
- [ ] `MoodStateSelector.tsx` component
- [ ] `EnergyLevelSelector.tsx` component
- [ ] `CelebrationBadge.tsx` component
- [ ] `PromptTypeIcon.tsx` utility
- [ ] All 12+ files updated with zero emojis
- [ ] `rg` verification: no emojis in `src/components`, `src/pages`, `src/data`
- [ ] Screenshot verification of Energy, Mood, and Celebration UIs

## Success Criteria
User taps "How do you feel?" and sees a palette of refined icons and geometric shapes that would not look out of place in a BCG Digital Ventures product.