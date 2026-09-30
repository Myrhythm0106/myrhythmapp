# Fix: "Help me plan" buttons hidden on phone

## What is happening
On a phone the "Help me plan" panel slides up from the bottom of the screen, but three things sit on top of it:
- the bottom menu bar covers the lower part of the panel,
- the floating orange mic sits exactly where the right-hand button is ("Next" / "Draft my plan" / "Use this plan"),
- the "Where to?" dial can sit over the close (X) button.

So the button you need is there, just hidden behind them.

## What I will change
1. Make the panel sit above everything else while it is open (menu bar, mic and dial are hidden behind it).
2. Hide the floating mic while the panel is open, so nothing overlaps the main button.
3. Pin the action buttons (Back / Next / Draft my plan / Use this plan) to the bottom of the panel so they are always visible, with room for the phone's home bar. Questions scroll above them.
4. Restyle the panel to the Light Linen look (ivory, ink text, teal main button, gold edge) so it matches /start.
5. Make "Help me plan today" actually plan today when opened from the day view (it currently always plans the week).

## Check
On a 393 px phone view: open Calendar, tap Help me plan, go through each step and confirm the main button is fully visible and tappable at every step, then accept a draft.

## Technical details
- `LaunchAiPlanAssist.tsx`: overlay `z-[100]`, sticky footer with `pb-safe`, `max-h-[90svh]`, Light Linen tokens; dispatch an open/close flag (body data attribute) that `CaptureDock` reads to hide itself.
- `LaunchCalendar.tsx`: pass `scope` from current view (day/week) and save to the matching planning scope.
