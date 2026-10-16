# Make My Snapshot the "oh wow, I need this" moment

## What people see today (and why it doesn't sell)
The snapshot page opens with a **score out of 100** and eight letter bars. Then come several report blocks: the compass read, the 3-week plan, the four-part picture and the best window. It looks smart, but it **describes** me. It doesn't **do** anything for me. A score also feels like a test, which is the wrong feeling for this audience.

The "catch one real thing" part we built last time isn't shown on this page yet, and it's the strongest moment we have.

## The new order: show it, then prove it, then offer it
Each step answers the one question in the person's head.

```text
1. "Do you get me?"      -> It knows me
2. "Can you help?"       -> It proves it, right now
3. "What else?"          -> My picture, in my words
4. "Is it worth paying?" -> The honest choice
```

### 1. It knows me (first screen, no scrolling)
- A headline built from my own answers, e.g. *"I lose what was said after appointments, and I'm sharpest 9 to 11."*
- Three short lines that mirror my day back to me: what slips, when I'm clearest, and what I tell myself when it goes wrong (the mindset answer).
- One line to finish: *"That's not a weakness. It's a pattern, and patterns can be supported."*
- No number up top.

### 2. It proves it, right now (CatchOneThing)
- *"What can't I afford to forget this week?"* I type one real thing.
- Side by side: **what usually happens to it** (my own slip pattern and inner voice) vs **the same thing with MyRhythm** (captured, planned in my sharp time, followed through).
- One button: **"Keep this for me, tomorrow at 9:30."** A calm tick confirms it's saved. This is the "oh wow" moment: the app has already helped once, before I've paid.

### 3. My picture, in my words
- **Remembered · Reliable · Resilient** cards, each with a level (Strong / Building / Needs support) and one reason taken from my answers.
- The eight MYRHYTHM letters move under a "See my full picture" disclosure. The score sits inside it and is labelled "a starting point, not a test".
- My best window and 3-week plan stay, but each is trimmed to one short card.

### 4. The honest choice (max 3 options)
- **Keep going free:** my snapshot, the item I just saved, and my first 3 weeks.
- **Become a Founding Member (£10/mo for life):** *"MyRhythm keeps catching things like this, every day, in my best hours, with my Support Circle if I want."* The line names the item they just saved.
- **Go to Home.**

## Guardrails
- First-person voice, plain words, no diagnosis or medical claims, and no practitioner names.
- Nothing is saved without a tap. Free is stated clearly.
- Large tap targets, max 3 choices per screen.

## Technical
- `src/pages/launch/LaunchWelcome.tsx`:
  - Reorder the sections.
  - Add a "mirror" first block built from saved answers using `buildSlipLine` and `buildThreeR` (plus a new `buildMirror` helper in `myCompass.ts`, with tests).
  - Mount `CatchOneThing` second.
  - Move the score and letter bars into a collapsible "full picture" section.
  - Tighten `LivingCompassReport`, `YesPlanCard` and the window block.
  - Rewrite the offer line to name the saved item.
- Fix the calendar save in `CatchOneThing` if it fails, and show an error when it does.
- Verify signed in, end to end: finish the questions, see the mirror, save one item, confirm it appears in the Calendar. Check phones at 320px and 393px plus the 834px tablet.
