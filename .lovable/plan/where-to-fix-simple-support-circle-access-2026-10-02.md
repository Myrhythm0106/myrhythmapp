# Where to? fix + simple Support Circle access

## 1. "Where to?" opens underneath (bug)

Cause: the map panel sits inside the top bar, which has a frosted-glass effect. That effect traps the panel inside the bar, so it opens squashed underneath it instead of covering the screen.

Fix: open the map on top of the whole page (outside the bar), lock page scrolling while it is open, close with X, the Escape key, or a tap outside. Check on phone (393px) and desktop.

## 2 + 3. How family and friends get their own access

One simple idea: **the person owns everything; helpers get a key with only the doors they open.**

```text
Primary user  ->  Invite (name + email + "who are they?")
                ->  Pick a ready-made access level (1 tap)
                ->  Helper gets an email -> creates their own login
                ->  Helper sees "Supporting Annabel" with only allowed areas
```

### Three ready-made access levels (max 3 choices)


| Level       | What the helper can do                                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **See**     | View calendar and next steps. Receive "done" updates.                                                                                                                     |
| **Support** | Everything in See, plus send notes/encouragement and suggest calendar items (the person accepts or declines).                                                             |
| **Step in** | Everything in Help, plus start a recording on the person's behalf when they forget. The recording is saved to the person's Memory Bridge and they are told straight away. |


- "Customise" link underneath for individual on/off switches (Calendar, Next steps, Notes, Record) — hidden by default.
- The person can change level or remove a helper at any time, one tap, takes effect immediately.
- Helpers never see brain-health answers, snapshot, diary or private recordings unless the person shares a specific item.
- Every helper action shows in the person's diary ("Mum added a note, 2 Oct"). Nothing a helper does is hidden.

### Helper's side

- Own sign-in (same app). After accepting, they land on a simple **"Supporting [name]"** page: their calendar, open next steps, a "Send a note" box, and (Step in only) a big "Record for [name]" button.
- If they support more than one person, a simple switch at the top.

## Technical details

- Dial: render the overlay via a React portal to `document.body` (header `backdrop-blur` creates a containing block for `position: fixed`). Add scroll lock + Escape handling.
- Database: `support_circle_members` already has `permissions` (jsonb), `role`, `status`, invitation token/expiry. Add `member_user_id uuid` (linked on invite acceptance) and an `access_level` text (`see`/`help`/`step_in`); map levels to the permissions jsonb. Note: the existing `can_access_item_thread` function already references `member_user_id`, which is currently missing from the table — this migration fixes that.
- One security-definer helper `circle_can(_owner, _perm)` checks the signed-in user is an active member with that permission; used in RLS SELECT policies on calendar events and extracted actions, INSERT on item notes / support messages, and INSERT on meeting recordings + storage (Step in) where `user_id` = owner and a `recorded_by` column stores the helper.
- Calendar suggestions from helpers stored as pending items the owner accepts.
- `accept_invitation` updated to set `member_user_id = auth.uid()`.
- New page `/launch/supporting` for helpers; invite flow in existing Support Circle page reworked to the 3-level picker.
- Verify with two real test accounts (owner + helper) before claiming done.