# Make the MyRhythm journey feel obvious, yet professional, safe and joined-up.  It needs to have an obvious standard so that there is no pressure or stress in using it.

## Candid verdict

**The intended journey makes sense; the current implementation is not yet consistently simple or standard enough for an 85-year-old or someone with brain injury.**

- **Concept and purpose: 9/10.** The flow from conversation → clear actions → diary/calendar → follow-through is distinctive and easy to explain.
- **Individual screens: 7/10.** Several screens are warm, reassuring and give the user control.
- **Whole first-time journey: 5/10.** Contradictory sign-up, report and payment cues make the sequence feel less trustworthy than `/start`.
- **Returning-user journey: 6/10.** Home, the circular dial and persistent recording access are strong, but too many overlapping prompts and navigation systems remain.
- **Real-world readiness: not yet.** The journey needs simplification and testing with the intended users before unrestricted use.

The right standard is not “copy what every other app does.” It is: **use familiar interaction patterns, then make MyRhythm’s continuity experience the innovation.**

## The two journeys users should experience

### First visit

```text
/start
  → Start here
  → Create account
  → Choose what best describes me
  → Welcome: what the 8 questions will do
  → Assessment
  → My revealing free snapshot
  → Choose one useful action
  → Home: one guided next step
```

Membership remains a clear choice from the report or `/start`; it does not interrupt the free “Start here” path.

### Returning visit

```text
Sign in
  → resume an unfinished important step, if one exists
  → otherwise Home
  → one most useful action for today
```

From every established app screen: **circular dial → destination**, with Home always available. Recording remains available without replacing navigation.

## What is working and should stay

- `/start` clearly explains the real-life problem and now offers **Start here** separately from **Become a Founding Member**.
- The assessment explains what to expect and allows **Not now — take me to my day**.
- Answers save as the user progresses, and unfinished setup can resume.
- The results page gives the user a free insight, explains why, lets them choose an action and preserves their control.
- Home has a data-backed first-session sequence: record → review → schedule → complete.
- The circular dial, Back control and persistent recording control can prevent users feeling trapped.
- Buttons are generally large enough for the audience.

## Problems to correct

### 1. Make the commercial promise consistent

The **Start here** path currently reaches a registration screen saying “Start your 7-day free trial,” although `/start` presents registration as a separate free entry from Founding Membership. Registration should say **Create my account** and explain that membership is optional and shown later.

The report currently says **Register & Unlock My Plan** even though the person has already registered. Change this to **See membership options**. Keep **Continue with my free snapshot** equally clear.

The membership page’s Back action must adapt:

- from the report: **Back to my report**;
- directly from `/start`: **Back to MyRhythm**.

### 2. Use one truthful onboarding sequence

The visible progress strip currently says:

```text
Register → You → Assessment → Results → Membership → Home
```

but users can legally and intentionally go from Results straight to Home. Replace this with a sequence that does not falsely make payment look mandatory:

```text
Account → About me → Questions → My snapshot → Home
```

Membership is an optional branch, not a required onboarding step.

Email verification must return the person to the next unfinished step, not send them directly to the results page before answering the questions.

### 3. Remove competing first-day instructions

Home currently combines a daily welcome, a first-session checklist and a separate first-run overlay. Use only one guided path:

- Show the daily welcome.
- Beneath it, show one live **Start here** step.
- Reveal the next step only after the current one is completed.
- Retire the separate three-card overlay.

The first useful action remains **Record my first conversation**, followed by review, schedule and completion.

### 4. Make navigation consistent, not duplicated

- Keep the circular dial as the single wider-app map.
- Keep the phone bottom bar for Home plus the 4C rhythm.
- Keep the orange recording control for capture.
- Remove the old floating “Compass/Quick Actions” menu from launch screens; it duplicates the dial and contains outdated names and colours.
- Keep the dial off sign-in, registration, first-time setup and payment; restore it for returning-user assessment visits.
- Make signed-out redirects explain: **Sign in to continue to [place]. I’ll bring you straight back.**

### 5. Reduce Home to the user’s present need

After the guided first session, Home should show no more than three primary choices at once:

1. **What needs my attention now**
2. **Record something**
3. **See my day**

Assessment, Compass, Support Circle, wins and settings remain available through context or the dial, rather than all competing on Home.

### 6. Use plain, adult and accessible language

- Replace “cognitive wellness journey,” “dashboard,” “Core loop,” and promotional jargon with concrete wording.
- Keep first-person, consent-led language: “My snapshot,” “I choose,” “Nothing changes without my say-so.”
- Replace low-opacity instructional text with contrast that meets WCAG AA; keep body text at least 16px.
- Remove confetti from assessment completion. Use a calm completion acknowledgement instead.
- Keep medical disclaimers clear without making every screen feel clinical.

### 7. Consolidate routes without breaking saved links

Keep `/start` and `/launch/*` as the canonical public and app journeys. Convert old onboarding, assessment, dashboard and MVP entry points into deliberate redirects to the matching current destination. Keep founder, legal, invitation and printable pages only where they serve a distinct purpose.

## Technical details

- Centralise onboarding order and next-destination decisions so the progress strip, registration, email verification, sign-in, report and payment use the same rules.
- Preserve intentional deep links and resume state, but do not let an old payment resume point override a completed onboarding journey indefinitely.
- Keep route aliases for bookmarks while removing old pages from active navigation.
- Resolve the current duplicate “brain-healthy preference” data warning so timing guidance loads predictably.
- Preserve local/offline assessment progress and the current permission-led Compass behaviour.

## Verification before calling it user-friendly

Test these exact journeys on iPhone, Android and desktop:

1. New user chooses **Start here**, completes the assessment, keeps the free snapshot and records a first conversation.
2. New user chooses **Become a Founding Member** directly, understands the terms and can return without being sent to a nonexistent report.
3. User closes during registration, assessment, report and payment, then returns to the correct place.
4. Returning user signs in and reaches Home without being forced through old setup.
5. From every established screen, the dial opens and Home is reachable in one further tap.
6. A user can record, review, schedule and later mark one action complete without losing the original conversation reference.
7. At 200% text size and phone width, no text clips, controls overlap or secondary scrollbar appears.
8. Run five observed tests with the target audience. Success means each person can answer: **Where am I? What should I do now? How do I get Home?** without help.

## Acceptance standard

The flow is ready for a founders’ user test when:

- there is one canonical first-time route;
- payment is clearly optional on the Start-here path;
- each screen has one obvious next action;
- no screen presents competing navigation menus;
- returning users resume correctly;
- the complete capture-to-completion journey works on real phones;
- every tester can recover from a wrong tap without assistance.