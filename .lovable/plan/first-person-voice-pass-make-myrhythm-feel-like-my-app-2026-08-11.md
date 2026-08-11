# First-Person Voice Pass: Make MyRhythm Feel Like "My" App

## Goal
Rewrite the in-app copy so user-owned plans, actions, results and summaries read as if the user wrote them for themselves — first-person, owned, personal — while keeping coaching questions and guidance warm and clear.

## Market Comparison
Successful apps in adjacent spaces use a **mixed ownership model**, not a global second-person rewrite:

| Product | First-person used for | Second-person kept for |
| --- | --- | --- |
| Apple Health / Fitness | My Trends, My Workouts, My Heart Health | onboarding tips, achievement messages |
| Calm / Headspace | My Progress, My Sessions | "How are you feeling?", guided instructions |
| Noom | "I will…" commitments, food logging | coach prompts, educational nudges |
| Fabulous | habit contracts in "I" form | daily coaching messages |
| Todoist / Notion | My Tasks, My Workspace | shared/collaborative contexts, tips |
| Banking / Health portals | My Accounts, My Plan | alerts, advice, support copy |

Pattern: **owned data and commitments = I/my; questions, coaching and system guidance = you/your.** This increases self-efficacy and reduces cognitive load, which matters for the brain-injury, ADHD, MCI and caregiver audiences.

## Recommendation
Adopt a **"My Rhythm" ownership layer**: first-person for anything the user creates, tracks or owns; second-person only for direct questions, coaching and onboarding explanation.

## Voice Rules

| Surface | Rule | Example Before | Example After |
| --- | --- | --- | --- |
| Action summaries, success criteria | First person | "You'll know when you're done when…" | "I'll know I'm done when…" |
| Dashboard headings, result cards | First person | "Your Next Steps" | "My Next Steps" |
| Calendar / commitments | First person | "Your plan is active" | "My plan is active" |
| Progress / victories | First person | "Your Victories" | "My Victories" |
| Support circle labels (from user's view) | First person | "Your Support Circle" | "My Support Circle" |
| Direct assessment questions | Keep second person | "How do you feel about your brain right now?" | unchanged |
| Coaching / encouragement | Keep second person | "You're building something meaningful" | unchanged |
| Onboarding explanation | Keep second person | "We'll use this to personalise your rhythm" | unchanged |
| CTAs | Action-first, first person where it implies ownership | "Start Your Journey" | "Start My Journey" |
| Empty states | First person or direct address | "No actions yet" | "I haven't captured anything yet" or keep neutral |

## Scope
Live launch experience only. Do not touch marketing landing pages, investor/founder pages, docs or archived components.

Primary files and surfaces:
- `src/pages/launch/LaunchWelcome.tsx` — results, "Your Victories", plan status
- `src/pages/launch/LaunchAssessment.tsx` and result screens — "Your results", summary labels
- `src/components/memoryBridge/ActionsViewer.tsx` — "Next Step Summary", "You'll know you're done when…"
- `src/components/memoryBridge/EnhancedActionCard.tsx` — success criteria labels
- `src/components/memory-bridge/ActionDetailCard.tsx` — same success criteria line
- `src/components/nextStepsHub/EnhancedActionCard.tsx` — success criteria label
- `src/components/voice/VoiceRecordingACTs.tsx` — "Done when:" label
- `src/launch/routes.ts` — route descriptions in the You-Are-Here dial ("Your daily rhythm dashboard" → "My daily rhythm dashboard")
- `src/components/launch/LaunchNav.tsx` and `LaunchYouAreHereDial.tsx` — any nav labels
- `src/components/launch/LaunchQuickActions.tsx` — tile labels
- `src/pages/launch/LaunchHome.tsx` — dashboard headings
- `src/components/launch/vision/*` — "Your vision", "Your dream" labels
- `src/launch/persona/copy.ts` and `snapshotTeasers.ts` — keep coaching second person, but user-facing result labels become first person

## Implementation Steps
1. Audit the scoped files for second-person strings that describe user-owned content.
2. Rewrite labels, headings, placeholders and success-criteria prompts to first person per the rules above.
3. Leave direct questions, coaching messages and onboarding explanation unchanged.
4. Run a build/typecheck pass to ensure no broken JSX/string interpolations.
5. Spot-check the launch welcome, Memory Bridge action detail and assessment result screens on a phone-sized viewport.

## Verification
- `/launch/welcome` shows "My Victories" and "My plan is active" (or equivalent first-person ownership).
- Memory Bridge action cards show "I'll know I'm done when…" instead of "You'll know you're done when…".
- The You-Are-Here dial route descriptions read as "My daily rhythm dashboard", "My north-star statement", etc.
- Direct questions such as "How do you feel about your brain right now?" remain unchanged.
- No build errors or missing translations.
