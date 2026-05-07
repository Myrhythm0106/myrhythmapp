# Plan v5.3 (final) — Quiet Power · Memory-safe · Brain-health-led · Memory Bridge promoted

## Locked principles (carried forward)
- **Calm surface, generous scaffolding. Hide complexity, never hide possibility.**
- Home always shows: what you could do now · what you did last · what's coming next · where to get help.
- All four surfaces are powered by **live goals + live calendar + live Memory Bridge data** — no mock data.
- Re-entry card defaults to >24h; Settings allow `Every session | 24h | 72h | Off` and a "Show all options always" toggle.
- Strict no-medical-claims policy; brain-health language is supportive and educational only.

---

## Brain Health is the through-line (every tier)

> **Every action carries a Brain Health Lens** — a short, plain-English line on why it matters for cognition, mood, energy or recovery. No claims. No fixes.

Surfaces:
- **Brain Health chip** on every Today item, chip suggestion, and Memory Bridge ACT.
- **Daily Brain Health Insight** card on Home (rotating, citation-backed).
- **Weekly Brain Health Reflection** in Calibrate (~60 sec, voice or text via Memory Bridge).
- **Brain Health Footprint** in Celebrate.
- Footer disclaimer site-wide: *"MyRhythm supports brain health habits. It does not diagnose, treat or cure any condition."*

---

## Memory Bridge — promoted to first-class on /launch/home

Memory Bridge is the **capture layer** for all four scaffold surfaces and is now permanently visible.

### Placement on Home
- A persistent **Capture button** (mic icon + "Capture") sits to the **left of the composer**, always visible, all tiers including Free.
- One tap → opens lightweight Memory Bridge sheet (no full route change) → record up to tier limit → returns to Home with a confirmation chip and a "View ACTs" link.
- Voice route remains at `/launch/memory-bridge` for full sessions; the inline sheet handles quick captures.

### Why promote
- Externalising memory in the moment is the single most brain-health-aligned action in the product.
- Hiding it behind intent routing risks under-use by exactly the users who need it most.
- Aligns with "Hide complexity, never hide possibility."

### How Memory Bridge powers each scaffold
| Surface | Memory Bridge role |
|---|---|
| Last time you… | Reads `voice_recordings` + `extracted_actions` |
| Next-best-action chips | Ranks `extracted_actions` (status='not_started') alongside goals + calendar |
| Brain Health Lens chips | Mapped from `verb_category` + `action_type` via `action_brain_lens` |
| Weekly Reflection (Plus+) | 30-sec voice note → Memory Bridge with `meeting_type='reflection'` |
| Voice check-ins (Pro+) | Daily 30-sec spoken reflection |
| Cognitive Load Meter (Plus+) | Factors unresolved ACTs + calendar density |
| Re-entry card (>24h) | "Yesterday you recorded a conversation with Mum — 2 actions captured" |
| Clinical Brief (Bridge tier) | Aggregated ACT completion + reflection cadence, RLS-gated to clinician |

### Tiered Memory Bridge (existing `SUBSCRIPTION_LIMITS`, no change)
- **Free / Starter:** 3 recordings · 30 min · 7-day retention · Lens chips on every ACT.
- **Plus / Personal:** unlimited · 3-hour · permanent · watchers · Weekly Reflection.
- **Pro / Premium (`family`):** all Plus + voice check-ins + Brain Health Trends.
- **Clinical / Bridge:** all Pro + clinician brief + discharge-cliff escalation when reflection cadence drops.

---

## /launch/home final layout

```text
┌──────────────────────────────────────────────────────┐
│ M · Bridge: Stabilise · Help · Account               │
├──────────────────────────────────────────────────────┤
│ [Re-entry card — only if >24h]                       │
│                                                      │
│ Good morning, Sam.                                   │
│ Last time you logged a walk with Mum.                │
│                                                      │
│ ┌ Today (3) ───────────┐ ┌ Brain Insight ──────────┐ │
│ │ 09:00 Physio         │ │ Short walks after meals │ │
│ │ 13:00 Walk           │ │ steady energy.          │ │
│ │ 16:00 Call Dr Smith  │ │                         │ │
│ └──────────────────────┘ └─────────────────────────┘ │
│                                                      │
│ [🎙 Capture] [ Composer: What do you want to do? ]   │
│ Chips: Prepare for physio · Log how I slept ·        │
│        Tell circle I'm tired                         │
│ Each chip shows tiny lens: "Supports memory"         │
│                                                      │
│ [ I'm not sure — show me my options ]                │
│                                                      │
│ Cognitive Load today: ●●○ Light                      │
│ Bridge: ○──●──○──○──○──○                             │
└──────────────────────────────────────────────────────┘
Footer: MyRhythm supports brain health habits. It does
not diagnose, treat or cure any condition.
```

---

## Files

**New**
- `src/pages/launch/LaunchHomeQuiet.tsx`
- `src/components/launch/quiet/IntentComposer.tsx`
- `src/components/launch/quiet/CaptureButton.tsx` *(inline Memory Bridge sheet trigger)*
- `src/components/launch/quiet/InlineCaptureSheet.tsx`
- `src/components/launch/quiet/LastSessionAnchor.tsx`
- `src/components/launch/quiet/ReEntryCard.tsx`
- `src/components/launch/quiet/OptionsSlideOver.tsx`
- `src/components/launch/quiet/TodayAndNext.tsx`
- `src/components/launch/quiet/BridgeTrack.tsx`
- `src/components/launch/quiet/BrainHealthInsight.tsx`
- `src/components/launch/quiet/BrainHealthLensChip.tsx`
- `src/components/launch/quiet/CognitiveLoadMeter.tsx`
- `src/components/launch/quiet/BrainHealthFootprint.tsx`
- `src/components/launch/quiet/BrainHealthTrends.tsx`
- `src/components/launch/quiet/StalenessIndicators.tsx`
- `src/hooks/quiet/useNextBestActions.ts`
- `src/hooks/quiet/useLastSession.ts`
- `src/hooks/quiet/useTodayAndNext.ts`
- `src/hooks/quiet/useBridgeStage.ts`
- `src/hooks/quiet/useReEntry.ts`
- `src/hooks/quiet/useBrainHealthInsight.ts`
- `src/hooks/quiet/useBrainFocusDomains.ts`
- `src/hooks/quiet/useCognitiveLoad.ts`
- `src/utils/brainHealthLens.ts`
- `supabase/functions/launch-intent-router/index.ts`
- `supabase/functions/daily-brain-insight/index.ts`
- `docs/design-system/quiet-power.md`
- `mem://style/quiet-power`
- `mem://brand/brain-health-through-line`
- `mem://features/memory-bridge-promoted`

**Changed**
- `src/pages/launch/LaunchDashboard.tsx` (route to Quiet home when `ui_mode='quiet'`)
- `src/pages/launch/LaunchProfile.tsx` (settings additions)
- `src/config/pricing.ts` (gate Plus/Pro/Clinical brain-health features)
- `mem://index.md`

**DB migration**
- Extend `profiles` / `user_preferences`: `ui_mode text default 'quiet'`, `re_entry_threshold_hours int default 24`, `show_all_options boolean default false`, `brain_focus_domains text[]`, `cognitive_load_pref text default 'standard'`, `insight_opt_in boolean default true`, `circle_brief_opt_in boolean default false`.
- New tables: `brain_health_insights`, `action_brain_lens` (RLS: insights public-read; lens public-read).

---

## Acceptance criteria
- Capture button visible on Home for every authenticated user, every tier.
- Every action and chip shows a Brain Health Lens label.
- Daily insight visible on Home for every signed-in user; tier-appropriate.
- Every insight has a citation URL or is hidden.
- No insight uses *cure*, *treat*, *fix*, *heal*, *guarantee*, *clinical outcome*.
- All four scaffolds populated from live data; no mock fallbacks.
- Re-entry card respects user threshold; defaults to 24h.

---

## Build order (4 weeks)
- **Week 1:** DB migration + design tokens + Settings + seed first 30 brain-health insights.
- **Week 2:** Quiet shell + 4 scaffold hooks + Capture button + InlineCaptureSheet + Lens chips wired to Memory Bridge data.
- **Week 3:** OptionsSlideOver + ReEntry + BridgeTrack + Cognitive Load Meter + Weekly Reflection in Calibrate + voice parity.
- **Week 4:** Pro Trends + Clinical brief preview + investor deck refresh with live screenshots.

Approve and I'll execute Week 1 immediately.
