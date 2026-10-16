# Lighter questions, a report that reveals, and mindset at the heart

## Part 1: What's hard about the current questions

The Quick Start has 13 questions. For someone with memory challenges or a brain injury, several of them ask for a kind of self-judgement that is genuinely hard to make:

| Hard to answer | Why it's hard |
|---|---|
| "The day after a conversation, how much do you remember?" | People often can't tell what they've forgotten. |
| "When does your day start and wind down?", "What time do you get things done most easily?", "When does your energy dip?", "How do you work best?" | Four separate questions about the same day. Each asks the person to step back and study themselves. Tiring, and they overlap. |
| "What usually happens when you feel stressed?" | Abstract, and hard to recall on the spot. |
| "How well do you eat and drink?" | "Balanced" means different things to different people. |

## Part 2: How the questions fit together, and how to lighten them

**Ask about real moments, not self-ratings.** People recognise a moment far more easily than they can rate themselves.

The 13 questions become **8**, grouped under the three welcome words. Each question shows a small line saying what it sets up.

**Remembered (memory)**
1. **"Think of your last appointment or important chat. A day later, what happened?"** (replaces next-day memory)
   - "I remembered it well" · "I had the gist, but lost details" · "I had to ask someone or guess" · "I'd forgotten it happened"
   *This sets up: how MyRhythm captures conversations for me.*
2. **"What slips most?"** (unchanged, with "Also fits" for extra answers)
3. **"What do you use to remember now?"** (unchanged)

**Reliable (follow-through and rhythm)**
4. **"My day at a glance"**: one simple day strip (morning, midday, afternoon, evening). I tap **when I feel sharp** and **when I feel drained**. This replaces four rhythm questions with one screen.
   *This sets up: when important things go in my diary, and where breaks go.*
5. **"Who would you like on your side?"** (unchanged)

**Resilient (body and mindset)**
6. **"How do you usually feel when you wake up?"** Rested / Okay / Tired. This covers sleep, and is easier to answer than "how well do you sleep".
7. **"Most weeks, I..."** (tap any that apply): walk or move most days · eat proper meals · drink enough water · have time to wind down. One screen covering movement, food, water and calm.
8. **Mindset (new): "When I forget something or a plan slips, what do I tell myself?"**
   - "That's okay, I'll sort it" · "Not again, what's wrong with me?" · "I'll just let it go" · "Someone will remind me"

Plus one closing choice: **"What would make this week easier?"** (unchanged)

The result is about 4 minutes instead of 6, with less self-study and more recognition. The quiet brain-health basis is kept: body, mind, people and meaning are all still covered. No practitioner names appear anywhere.

## Part 3: The report does something before it asks

**Step 1: "What's on your mind that you can't afford to forget?"** I type or speak it. I can skip, but the screen invites me warmly.

**Step 2: My slip line**, built from my answers:
- *Without MyRhythm:* Today: "I'll remember." → Tonight: "It's fading." → Thursday afternoon (my drained time): "It slips." → **"And then I tell myself: 'Not again, what's wrong with me?'"** (shown in my own mindset words)
- *With MyRhythm:* **Remembered**: saved now · **Reliable**: set for tomorrow at my sharp time, with reminders · **Resilient**: if I miss it, it waits for me, so there's nothing to beat myself up about.

**Step 3: "Keep this for me"**. One tap, and it lands in tomorrow's plan. "Done. MyRhythm has it."

**Step 4: My snapshot**, kept short:
- My pattern in one sentence
- Remembered · Reliable · Resilient, each marked Strong, Building or Needs support, with a one-line reason
- My sharp time on the day strip
- What's already working
- A mindset reframe, when my answer was harsh: "Swap 'What's wrong with me?' for 'MyRhythm has it.'"
- One action I choose

Each insight keeps "Why this?" and "Not true for me".

**Step 5: Honest free or membership choice**, unchanged.

## Guardrails
First person, plain words, no medical claims, no diagnosis, and no practitioner names in the app or the code. The Full Picture stays as the deeper, optional option.

## Technical
- **Question bank** (`src/data/launchAssessmentBanks.ts`):
  - Add new quick items `recallMoment`, `dayStrip` (a new `kind: 'day-strip'` component with sharp and drained taps per time block), `wakeFeel`, `weekHabits` (multi-select) and `mindsetSlip`.
  - Retire `memoryRecall`, `dayStart`, `planningRhythm`, `energyDip`, `rhythmDetail`, `habitSleep`, `habitMove`, `habitFuel` and `habitCalm` from the quick tier.
  - Bump the bank version. Map `dayStrip` onto the existing best-time and energy-dip fields so Calendar and Help me plan keep working, and keep scoring the habit items.
- Add a neutral entry to `docs/brain-health-reference-log.md`.
- Add `buildSlipLine` and `buildThreeR` to `src/launch/compass/myCompass.ts`, with tests covering three answer sets, including harsh vs kind mindset.
- Add `CatchOneThing.tsx` before the report. "Keep this for me" saves through the existing next-step and reminder path, for tomorrow at my sharp time.
- Trim `LivingCompassReport` to the Step 4 order.
- Check that older saved answers still load. Check phone layouts at 320px and 393px.
