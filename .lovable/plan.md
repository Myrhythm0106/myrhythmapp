# My Next Step Summary — Adaptive Sequence Cards (Deloitte-grade redesign)

Replace the crammed 11-column exhibit table with the selected **Adaptive sequence cards** design — calm, editorial, consultancy-grade cards that scan at a glance and reveal detail on tap. Active ("In My Flow") cards carry a **soft emerald glow** per your direction.

## What changes

### 1. New card presentation in `ActionsTableView.tsx` (default view everywhere it appears: Commit workspace, Actions viewer, recording details)
- **Card anatomy (collapsed = scannable, one glance):**
  - Status line with pulsing dot (In My Flow = emerald pulse; Ready to Begin = neutral; Accomplished! = struck-through, dimmed, with tick)
  - Action title in Sora, 16px+, reference code (`MB-…-A1`) in small mono
  - Ivory callout with orange left rule: **"I'll know I'm done when…"** (first-person success criterion, quoted)
  - Slim meta strip: Priority · Due in (orange when urgent) · people avatars
- **Expanded (tap the card or chevron):**
  - Full dates: Proposed / Start / Finish, with inline pickers (existing handlers reused)
  - Editable action text and success criterion (existing editable components reused)
  - Who's involved (existing `WhosInvolvedCell`), reminder ladder badge, watcher selector
  - Row actions: Notes, Reminders, Schedule/accept proposed date, Archive/Restore, Send to everyone — same handlers, larger 56px-friendly targets
- **Active-row glow:** the topmost "In My Flow" card gets `ring-1 ring-exhibit-moss/40` + soft emerald shadow (`0 8px 30px rgba(18,105,90,.14)`); hover lifts gently (no bounce, respects reduced motion).
- **Ordering preserved:** existing drag-and-drop stays (grip handle on the card), plus existing sort control becomes a small "Sort" dropdown in the header.
- **Empty/edge states:** no success criterion → callout shows a gentle prompt to add one; unscheduled → "Not yet scheduled" instead of dashes.

### 2. Header & toolbar
- Title "My Next Step Summary" + count line ("6 steps · 2 accomplished") + reference code, as today but with more air.
- Primary action stays **Review & schedule**; exports (Board PDF / Excel / CSV), Send to everyone, and sort live under **More actions**. Export content is unchanged — board pack stays table-formatted.

### 3. No functional regressions
- Every existing prop/handler in `ActionsTableView` keeps working (drag, status, priority, dates, RACI, watchers, notes, reminders, archive/restore, proposed-date accept, ladders, source ref line).
- Mobile-first: single column, no horizontal scrolling; desktop keeps `max-w-2xl/3xl` reading measure.
- Accessibility: 16px body floor, ≥56px primary targets, semantic tokens only (`exhibit-*`), WCAG AA contrast, `aria-expanded` on cards, keyboard-operable expand (button, not div).

### 4. Legacy table kept as fallback
- The current table markup moves to an internal `TableFallback` kept behind a **"View as table"** toggle in More actions (per-session preference, default cards). Nothing is deleted.

## Files touched
- `src/components/memoryBridge/ActionsTableView.tsx` — main rework (new `ActionSequenceCard` component inside; table retained as fallback)
- Possibly a small `src/components/memoryBridge/ActionSequenceCard.tsx` split if the file grows unwieldy
- No database, edge function, route, or export changes

## Verification
- `bunx tsgo --noEmit` + `git diff --check`
- Static render check of the card layout at mobile (390px) and desktop widths via a scratch harness screenshot
- Confirm all handlers still wired (type-level) and the table fallback renders
