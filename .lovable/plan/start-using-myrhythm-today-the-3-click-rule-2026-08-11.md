# Start using MyRhythm today + the 3-click rule

Two things here: (1) the shortest honest path for you to start using the MVP for real, and (2) a concrete change so every action in the app is reachable in three taps or fewer.

## Part 1 — Start using it as your daily MVP

Use only these five surfaces for the first two weeks. Everything else stays available but ignore it.

1. **Install it** — iPhone: open myrhythmapp.com in Safari → Share → Add to Home Screen. Android: Chrome menu → Install app.
2. **Capture** anything said or thought (Memory Bridge / quick capture).
3. **Commit** one or two of the extracted actions into the calendar.
4. **Calibrate** once a day — a 10-second energy check.
5. **Celebrate** what got done.

That is the MVP. Recording, extraction, scheduling, invites and reminders all work today; that loop is the product.

## Part 2 — The 3-click rule

Right now the mobile bar has six tabs (Home, Calendar, Memory, Games, Gratitude, Support), some actions live only in the dial, and capture takes several taps from most pages. Changes:

### Persistent capture — 1 tap from anywhere
A single always-present capture button (mic) fixed above the bottom bar on every `/launch/*` page. Tap once → capture sheet opens over the current page → speak/type → save. No navigation, no lost place.

### Bottom bar becomes the 4C loop — 1 tap
Reduce to five: **Home · Capture · Commit · Calibrate · Celebrate**, matching the loop language already in the routes registry. Calendar, Memory Bridge, Support, Games, Gratitude move to Home tiles and the dial (both still 2 taps).

### Home = today, plus one obvious next action
Top of Home shows: today's next scheduled item with **Do it / Reschedule** inline, the daily check-in chip, and a "3 things" starter strip for first-timers. No action on Home needs more than one tap to act on.

### The dial becomes a true command menu — 2 taps to any page
Dial (1 tap) → any route (2nd tap). Add search-as-you-type and a "Recent" row so even outer-ring pages stay at two taps. Present on every page including Calendar and Memory Bridge.

### Depth budget, enforced
Every action must be reachable within 3 taps from Home. Worked examples after this change:
- Record a conversation: Capture button → Record (2)
- Schedule an extracted action: action card → Add to my week (2)
- Invite someone to an action: action card → Add someone → choose person (3)
- See tomorrow: Calendar tab or dial → swipe/tap day (2)
- Turn on reminders: dial → Settings → Reminders card (3)
- Retake assessment: dial → Home card → Retake (3)

### Phone shortcuts — 0 clicks inside the app
Add PWA manifest shortcuts so long-pressing the home-screen icon offers **Capture**, **Today**, **Check in** — straight into the action.

## Part 3 — Making it habit-forming (honestly)

- **One daily prompt at a fixed time** (your choice) — "What's the one thing today?" — tapping it goes straight into Commit.
- **Streak that forgives**: a gentle continuity ribbon, not a punishing streak counter; missing a day shows a re-entry card, never a broken chain.
- **Instant reward**: every capture ends with a visible artefact (actions found) and every completion triggers a short celebration.
- **Support Circle nudges**: when someone in your circle is looped in, you get a small "someone's with you on this" acknowledgement.
- **Under 30 seconds** from home-screen icon to a saved capture — this is the metric we hold the design to.

No medical or outcome claims anywhere in this — it stays confidence, identity, behaviour and quality of life.

## Technical notes

- `src/components/launch/LaunchNav.tsx`: reduce to five loop items, raise to safe-area-aware 5-slot layout.
- New `src/components/launch/CaptureDock.tsx`: persistent capture FAB + reuse of `quiet/InlineCaptureSheet.tsx`, mounted in `LaunchLayout` when `appReady`.
- `LaunchQuickActions.tsx`: retire in favour of the dial + capture dock (removes competing FABs).
- `LaunchYouAreHereDial.tsx`: add fuzzy search input and a recents list sourced from `src/launch/routes.ts`; keep dial visible on all in-app routes.
- `quiet/QuietHome.tsx`: add "next action" strip with inline Do it / Reschedule, plus feature tiles for Calendar, Memory, Support, Games, Gratitude.
- `public/manifest.webmanifest`: add `shortcuts` for `/launch/capture`, `/launch/calendar`, `/launch/calibrate`.
- Add a lightweight dev-only route-depth check listing any route not reachable in ≤3 taps from Home.
