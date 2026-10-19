# Make the daily welcome optional

## What you saw
"The rest of today is mine, Annabel" is the daily welcome. It fills the whole screen the first time you open Home each day, and that includes straight after signing in. You never asked for it, so it felt like the wrong page.

## The change
- The welcome is **off by default**. Signing in takes you straight to Home.
- Settings gets a new switch, **"Show a welcome at the start of my day"**, with one plain line explaining what it does.
- With the switch on, the welcome works as it does now: once a day, and one tap on "Start my day" closes it.
- The choice is saved for each person on this device.

## Technical notes
- New small store `src/launch/daily/dayOpenPreference.ts` with `isDayOpenEnabled(userId)` and `setDayOpenEnabled(userId, on)`. It uses localStorage key `myrhythm_day_open_enabled_v1:<userId>` and defaults to false. It gets a test confirming the welcome is off by default and on after the switch is turned on.
- `DayOpenWelcome.tsx` opens only when `isDayOpenEnabled(user.id)` is true. The existing rules for once a day and arriving on purpose stay the same.
- `LaunchSettings.tsx` gets the new switch next to the existing switches.
- Add a rule to the project memory: the daily welcome is optional and off by default.
