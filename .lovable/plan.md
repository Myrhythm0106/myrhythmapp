
# Plan v61 — Home: greet by name + shareable empowering #IChoose

Goal: when a user lands on `/launch/home` they (1) see their real name in the greeting, (2) see today's empowering "I Choose…" statement front-and-centre (already in place), and (3) can forward that statement to anyone in their Support Circle OR to anyone else in one tap.

## What's already there (keep)

- `QuietHome` greeting strip (top of `/launch/home`).
- `IChooseHeart` empowering centrepiece with daily statement, "New one", "Choose my own", "Share" (9:16 PNG via native share / download).
- `IChooseShareCard` canvas renderer with brand gradient + footer.

## What's wrong today

1. Greeting uses `fixtures.name` (demo: "Alex") even for signed-in real users.
2. "Send to {supporter.name}" only targets `supportCircle[0]` — no way to pick a different supporter or anyone outside the circle.

## Changes (frontend only, no schema)

### 1. Real name in greeting — `src/components/launch/quiet/QuietHome.tsx`
- Add a tiny `useDisplayName()` hook (new file `src/launch/profile/useDisplayName.ts`) that:
  - Reads `profiles.display_name` (or `first_name` / `full_name` — whichever exists; see open question) for the current `auth.uid()`.
  - Falls back in order: profile name → `user.user_metadata.name` → email local-part → `fixtures.name` (demo only) → "friend".
- Replace the `greetName` line so signed-in users see their real first name. Caregiver "supporting" mode still uses `supportedName`.

### 2. Shareable to anyone — `src/components/launch/quiet/IChooseHeart.tsx` + new sheet
- Replace the single "Send to {supporter.name}" button with one **"Share with someone"** button that opens a new bottom sheet: `IChooseShareSheet.tsx`.
- Sheet contents (max 3 decisions per screen, 56px+ targets, plain language):
  1. **Support Circle** — list every active member from `fixtures.supportCircle` (later: live `support_circle_members`). Each row = one tap to send.
  2. **Someone else** — three explicit channels:
     - **Message / WhatsApp / anywhere** → native `navigator.share({ files, text })` with the 9:16 PNG + statement; falls back to PNG download + clipboard-copy of the statement.
     - **Email** → `mailto:` prefilled subject `Today I Choose…` and body containing the statement + a short "from MyRhythm" line, with the PNG offered as a separate download (mailto can't attach).
     - **Copy text** → copies the bare statement to clipboard with a toast.
  3. **Just save the image** — generates and downloads the 9:16 PNG without sharing.
- Re-use existing `generateAndShareIChoose(statement, recipientName?)` for the image; add a small `buildShareText(statement)` helper so the wording is consistent across channels: `"Today I Choose… {statement}  — sent from MyRhythm  #IChoose"`.
- Keep the existing top-row buttons ("New one", "Choose my own", "Share") unchanged so the centrepiece stays calm; the new "Share with someone" button replaces the old single-target send.

### 3. Accessibility & cognitive-load rules
- Every action in the sheet has an `aria-label`, min 56px touch target, plain-language label, and a confirmation toast in plain English ("Sent to Sarah. She'll know you're showing up today.").
- One decision per screen rule: the sheet shows Circle first; "Someone else" and "Just save" are below the fold but reachable without scrolling on mobile.

## Out of scope (deferred)

- Live `support_circle_members` query (still reading from demo fixtures for v0.1; swap is a 1-line change later).
- In-app delivery / push to supporters' accounts.
- Server-side share log / analytics.
- Changing the statement copy library.

## Docs

- Append a short "Home — greeting + #IChoose share" subsection to `docs/v0.1-founding-core-flow.md` §3 so the flow doc stays accurate.

## Open question (one, quick)

The `profiles` table — which column holds the user's preferred name today: `display_name`, `first_name`, or `full_name`? If unsure, I'll have `useDisplayName()` try them in that order and stop at the first non-empty value, so it's safe either way.

## Files touched

- `src/components/launch/quiet/QuietHome.tsx` (edit — greet name source)
- `src/components/launch/quiet/IChooseHeart.tsx` (edit — swap single-send for "Share with someone")
- `src/components/launch/quiet/IChooseShareSheet.tsx` (new)
- `src/launch/profile/useDisplayName.ts` (new)
- `docs/v0.1-founding-core-flow.md` (small append)
