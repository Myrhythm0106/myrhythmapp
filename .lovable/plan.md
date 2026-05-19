# MVP Prototype — Scope Confirmation & Branching Strategy

## Your Question, Answered Directly

**Yes.** The MVP prototype must include the full personal-assistant loop:

1. **Capture** — Record a meeting / conversation (voice)
2. **Extract** — AI pulls out Actions, Commitments, Tasks (ACTs) automatically
3. **Review** — User sees ACTs as a tidy list with confidence + context
4. **Schedule** — Each ACT gets a **proposed date/time** based on energy + calendar gaps; user one-taps to confirm
5. **Invite** — If the ACT involves another person, the prototype auto-suggests attendees from the user's **Support Circle / Contact List** and prepares a calendar invite

This is the **"replaces a personal assistant"** thesis. Strip any of these four and the MVP fails its own problem statement.

All the building blocks already exist in the codebase — we're not inventing them:

| MVP Capability | Existing code to reuse |
|---|---|
| Voice capture | `src/routes/MemoryBridge.tsx`, `useMemoryBridge.ts` |
| Real-time transcription | `supabase/functions/assemblyai-token`, `assemblyai-webhook` |
| ACT extraction | `supabase/functions/extract-acts-incremental`, `useRealtimeACTs.ts` |
| ACT review list | `src/components/nextStepsHub/NextStepsHub.tsx` + `ACTConfirmationPanel.tsx` |
| Proposed dates / Smart scheduling | `src/components/memoryBridge/ActionSchedulingModal.tsx`, Smart Schedule Card logic (memory) |
| Suggested attendees | `useMeetingDetection.ts` + Support Circle + Contact List fuzzy match |
| Calendar invite | `src/utils/ics.ts`, Google/Outlook sync edge functions |

The MVP prototype = a **stripped, sequenced UI** over these same backend pieces.

## Branching Strategy (no deletion)

The MVP will be built as a parallel route tree at **`/prototype/*`**. Nothing in the current app gets deleted or modified.

```text
Current app (untouched)          MVP Prototype (new, parallel)
────────────────────────         ──────────────────────────────
/                                /prototype                ← landing / problem
/launch/home                     /prototype/capture        ← record meeting
/memory-bridge                   /prototype/review         ← extracted ACTs list
/launch/calendar                 /prototype/schedule       ← proposed times + invites
/launch/support-circle           /prototype/circle         ← minimal contacts
... 130+ routes preserved        /prototype/done           ← confirmation
```

Switch any time:
- Current full app → use existing links
- MVP prototype → go to `/prototype`
- Earlier version → use chat **revert** buttons or **History** tab

## MVP Route Tree (the four-step assistant loop)

### 1. `/prototype/capture` — Record
- One big "Start recording" button (energy badge optional)
- Live transcript appears
- ACTs surface in real time on the side (already wired via `useRealtimeACTs`)

### 2. `/prototype/review` — Extracted ACTs
- Tidy list of ACTs grouped by priority
- Each ACT shows: action text, who it's for, due context, confidence
- Inline confirm / modify / reject (reuse `ACTConfirmationPanel`)

### 3. `/prototype/schedule` — Proposed Diary Slots
- Each confirmed ACT gets a **proposed date + time** chip
- Slot picked by: due context + user's energy windows + existing calendar gaps
- One-tap "Accept" writes to `daily_actions` + syncs to Google/Outlook
- "Reschedule" opens a 3-option picker (max 3 — per design memory)

### 4. `/prototype/invite` (inline in step 3) — Attendees
- If the ACT mentions a person, role, or meeting verb (detected by `useMeetingDetection`):
  - Auto-suggest matching names from Support Circle + Contact List (fuzzy match)
  - Show 1-tap chips: `[+ Sarah] [+ Dr. Patel] [+ Mum]`
  - On accept → generates `.ics` invite + sends via existing `send-invitation-email`

### 5. `/prototype/done` — Confirmation
- "Your assistant scheduled 5 actions, invited 3 people, blocked 2 hours of focus time"
- Single button back to `/prototype/capture` for the next loop

## What is intentionally OUT of the MVP

- Vision board, gratitude journal, brain games, analytics, roadmap, founder dashboard, MFA setup, persona-switching, multiple onboarding paths, etc.
- These remain available in the full app at their existing routes — just not in `/prototype/*`.

## What stays exactly the same

- All existing files, routes, components, hooks, edge functions, Supabase tables, RLS policies
- All demo mode, tier switcher, persona logic
- Only **one** file is modified: the router, to add the `/prototype/*` block

## Safety guarantees

1. No deletions — only new files under `src/pages/prototype/` and `src/components/prototype/`
2. Router isolation — `/prototype/*` is a separate Route block; failures don't cascade
3. Shared backend — same Supabase tables, so real data flows through both versions
4. Revertible — every step is a separate AI message you can roll back individually

## Decision needed

Confirm and I will build it in this order:
1. Add `/prototype/*` route tree + `PrototypeLayout` shell
2. Build `/prototype/capture` (wraps existing Memory Bridge recording)
3. Build `/prototype/review` (wraps existing ACT list + confirmation)
4. Build `/prototype/schedule` with proposed slots + attendee suggestions
5. Build `/prototype/done` confirmation screen
6. Add a small dev-only "Switch to Prototype" floating button for easy toggling

Estimated: 5–6 focused build messages, each independently revertible.
