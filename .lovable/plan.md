## Why you can't add anyone right now

I traced all four surfaces you flagged. In every case the UI is either mocked, points to a dead route, or the "add" control has been hidden.

### 1. Support Circle page (`/launch/support`) — invite form is a dummy
`src/pages/launch/LaunchSupportCircle.tsx` renders **mock members** and an Invite tab whose inputs and "Send Invitation" button have **no state and no `onClick`**. Nothing is wired to the DB. The working invite form (`SimpleInviteForm`, which calls `useAccountabilitySystem().addSupportMember`) already exists and is used on the legacy `/support-circle` page — but auth users are redirected away from that route into the launch page, so they never reach it.

### 2. Add Event modal — invite section is hidden behind a collapsed row
`LaunchAddEventModal.tsx` does have a working invite block (Support Circle chips + email add, up to 5), but it's collapsed under a small "Invite someone" row inside a bordered divider. On your screen it reads as a plain label, not a control. Also, when there are no members yet, the fallback link points to `/launch/support-circle` — which redirects to `/launch/support` — which is the broken page from #1, so the loop is closed.

### 3. Action card ("in the loop" on a Next Step) — no add button at all
`ActionDetailCard` / `MemoryBridgeActionReport` display existing watchers via `WatchersDisplay`, but there's no "Add someone" trigger next to them. `SupportCircleQuickAssign` exists but isn't mounted in the action detail surface, and there's no UI for ad-hoc email loop-ins (the `adhoc_loop_ins` column we added has no writer).

### 4. Memory Bridge quick capture (`/launch/memory?quick=1`) — no loop-in field
The quick capture screen has no invite/loop-in control, so nothing to add.

## What to build

### A. Fix `/launch/support` so it actually manages the roster
Replace the mocked page with a real implementation:
- Members tab: pull from `useAccountabilitySystem().supportCircle` (already loads active + pending from DB), show relationship + role chips, allow remove/edit permissions.
- Invite tab: mount `SimpleInviteForm` (already wired to `addSupportMember` → DB + invitation email). Keep launch styling (glass cards, brand-emerald), but use the working form's logic verbatim.
- Delete the four mock arrays. Keep Messages/Path tabs as-is for now (out of scope).
- Update the modal's fallback link from `/launch/support-circle` → `/launch/support` (or keep the existing redirect, but drop the extra hop).

### B. Make the Add Event invite section visible by default
- In `LaunchAddEventModal.tsx`, default `inviteOpen` to `true` so the Support Circle chips + email input are shown immediately. Keep the collapse control for users who want to hide it.
- When `members.length === 0`, keep the "Add someone to your Support Circle" link (now working after A).

### C. Add "In the loop" control to action cards
In `ActionDetailCard.tsx` (inside the existing "More details" reveal, next to `WatchersDisplay`):
- Add a **"Loop someone in"** button that opens a small popover with:
  - Support Circle multi-select (writes into `extracted_actions.assigned_watchers`)
  - "Or by email" input (writes into `extracted_actions.adhoc_loop_ins` as `[{ email, name? }]`) — up to 5, same validation as the Add Event modal
- Render existing ad-hoc loop-ins as chips with a remove (×).
- Reuse `WatchersDisplay` for members and add a lightweight chip renderer for email loop-ins with `ariaLabel="in the loop"`.

### D. Add "Loop someone in (optional)" to Memory Bridge quick capture
On the quick-capture screen (`LaunchCapture` / `LaunchMemoryBridge` capture panel), add one collapsed row **"Loop someone in (optional)"** using the same component as C. The chosen members/emails are attached to the resulting extracted actions after Save & Extract (default watchers for every action from that capture) — stored on the meeting record and applied when actions are created.

### E. Terminology pass
Everywhere a user-facing label still says "Watchers", change it to **"In the loop"** (and keep "Support Circle" for the roster itself). Non-user-facing DB column names stay.

## Technical notes

- No schema changes needed. `support_circle_members`, `extracted_actions.assigned_watchers` (uuid[]), and `extracted_actions.adhoc_loop_ins` (jsonb) already exist.
- Reuse existing hooks: `useAccountabilitySystem` (roster + `addSupportMember`), `useSupportCircle` (list for pickers), and the email regex from `LaunchAddEventModal`.
- The launch redirect (`/support-circle` → `/launch/support`) stays; we're fixing the destination, not the routing.
- The shared loop-in popover should live at `src/components/shared/LoopInPicker.tsx` so C, D, and the Add Event modal can all use one component (Add Event can migrate to it later; not required this pass to avoid regressions).

## Out of scope

- Messages and Path tabs on `/launch/support` (kept mocked; separate task).
- Notification/email delivery to ad-hoc loop-ins beyond what already exists for Support Circle invites.
- Renaming DB columns.
