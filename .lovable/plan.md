# Home: an executive daily briefing

## The aim
When I open Home, it should feel like the daily briefing my own chief of staff has left on my desk: confident, rich, calm and clearly premium. It should not feel like a student planner. The way it works stays the same; only the look and layout change.

## The new layout (desktop; on a phone it stacks into one column)

```text
+--------------------------------------------------------------+
|  DEEP EMERALD BRIEFING BAND (full width, gold hairline)       |
|  THURSDAY 19 NOVEMBER · 08:03                                 |
|  Good morning, Annabel.                     [ 3 ] today       |
|  "Today I choose ..." (#IChoose line, small, gold rule)        |
|                                [ Record ]  [ See my day ]     |
+--------------------------------------------------------------+
|  TODAY'S TOP 3  (wide card)          |  UP NEXT  (tall card)   |
|  01  Call Dr Patel     10:30  [tick] |  11:00  Team check-in   |
|  02  Send notes to Sam        [tick] |  in 57 min · Join/Prep  |
|  03  Pick up prescription     [tick] |  ---------------------  |
|  progress ring 1 of 3 done           |  then 14:00, 16:30      |
+--------------------------------------+------------------------+
|  AT A GLANCE: three slim figure tiles                         |
|  Commitments today | Conversations to review | Circle updates |
+--------------------------------------------------------------+
|  Gentler day / Full Picture: one quiet line, folded away      |
+--------------------------------------------------------------+
```

## Design direction
- **Briefing band:** a deep emerald panel with an ivory serif greeting, a small date and time line in capitals, and fine gold rules. This sets the executive tone at once.
- **Large numbers:** big serif numerals for the top 3 (01, 02, 03) and for the figures, like a well-made annual report.
- **Cards:** ivory cards with a soft depth shadow, a gold hairline border and generous space. No cartoon icons in coloured circles.
- **Up next:** shows the next commitment with a live "in 57 min" countdown and one action. Later items are listed underneath in small type.
- **At a glance:** three quiet figures that each open their own page. Each figure only appears when it has something to show; empty tiles are hidden.
- **Restraint:** at most three actions on screen, every tap target at least 56px, no clutter, and nothing childish or condescending.
- **On a phone:** the band and cards stack, the numbers stay large, and Record stays one tap away.

## Smart touches (intuitive, something to be proud of)
- **One-line briefing:** written fresh each day from my diary, for example "3 commitments, first at 10:30. Prep notes are ready for the team check-in."
- **Clear status at a glance:** each top-3 item carries a small dot (on track, due soon, overdue) in gold, teal or ember.
- **Promises I made:** a tile that counts steps I agreed to in recorded conversations and opens them in one tap.
- **Energy-aware hint:** "My best focus time is 10:00 to 12:00" when the diary shows space.

## Support Circle view (with permission)
- The dashboard can be shared with a Support Circle member. It uses the same per-person diary switch and levels as today (off by default, Busy/free, See my day, Help with my day).
- A permitted member opens it from "Diaries shared with me". They see a read-only version: the briefing band ("Supporting Annabel"), the top 3, Up next and At a glance. Private items show only as "Busy".
- With "Help with my day", the member can suggest an item. It reaches my diary only after I confirm it.
- A small "Shared with 2 people" chip on my dashboard shows who can see it, and I can stop sharing in one tap.

## What stays the same
How the top 3 is picked from the diary, ticking with undo, swapping, adding, the first-session card for new accounts, the gentler day, the Support Circle and every existing page link.

## Checks
- Screenshots at desktop size and at phone size (393px wide), signed in with sample diary items. I'll create a test account for this if one is needed.
- The existing top-3 tests still pass.

## Technical details
- Rebuild the layout in `QuietHome.tsx`. Add new presentation parts: `HomeBriefingBand`, `HomeUpNext` (restyled from NextActionStrip, same data) and `HomeAtAGlance` (counts from `useLaunchCalendarEvents`, existing meeting recordings and circle data, read only).
- Restyle `TopThreeToday.tsx` to the numbered ledger style; its logic stays as it is.
- Add tokens to `index.css`: `--launch-shadow-elevated`, a briefing gradient built from launch-ink-deep to launch-ink, and a gold hairline utility. Use no hard-coded colours.
- No new tables. The circle dashboard reads through the existing security-definer RPCs (`circle_diary`, `my_shared_diaries`) and is gated by the diary level. Rows are never read directly.
- New route `/launch/circle-diary/:ownerId/dashboard`, which reuses the dashboard parts in read-only mode.
- Record "Executive dashboard + circle view" in roadmap.md.
