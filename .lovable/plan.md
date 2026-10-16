# Questions that feel like being understood

## Why they feel bland
They read like a form ("How do you remember things now?"), and nothing comes back after I answer. I give, and I get nothing in return.

## The new approach: every question is a moment I've lived, and every answer pays off straight away
1. **Ask about a real scene, not a self-rating.** I recognise myself before I even answer.
2. **Answers sound like my own thoughts**, not survey labels.
3. **An instant reply after each answer**: one line, in teal, showing what MyRhythm will do about it. This makes each tap feel like a small "oh, that would help."

## The 8 questions (Remembered · Reliable · Resilient)

**REMEMBERED**

1. **"You've just left an important appointment. By the time you're home, what's left?"**
   - "Most of it. I'm fine for now."
   - "The gist, but the details have gone."
   - "Hardly anything. I'll have to ask someone."
   - "I'm not even sure what was decided."
   → *"Then MyRhythm listens for you. Every word is kept, and every next step is pulled out."*

2. **"Which of these has caught you out lately?"** (tap all that fit)
   - "A date or appointment I completely missed"
   - "Something I started and never finished"
   - "What someone told me, gone by tomorrow"
   - "Searching for my keys, phone or papers"
   → *"Noted. These are the first things MyRhythm will guard."*

3. **"Right now, my memory is held together by..."**
   - "My phone, buzzing at me"
   - "Sticky notes and lists everywhere"
   - "Someone who reminds me"
   - "My head, and hoping for the best"
   → *"MyRhythm works with what you already do, not against it."*

**RELIABLE**

4. **"Show me your day."** One day strip: morning, midday, afternoon, evening. I tap ☀ for "sharp" and 🌙 for "running on empty".
   → *"Your important things will go at 9:30, when you're sharp. Afternoons stay light."*

5. **"When something really matters, who do you want in your corner?"**
   - "Family or my partner" · "A friend" · "A carer or professional" · "Just me for now"
   → *"They only see what you allow. You stay in control."*

**RESILIENT**

6. **"Most mornings, I wake up feeling..."**
   - "Ready to go" · "Okay, once I get moving" · "Like I haven't slept at all"
   → *"MyRhythm will go easier on the mornings that start heavy."*

7. **"In a usual week, I manage to..."** (tap all that fit)
   - "Get outside or move most days" · "Eat proper meals" · "Drink enough water" · "Switch off before bed"
   → *"Small things that keep the mind sharp. MyRhythm gently protects time for them."*

8. **"Be honest. When I forget something, the voice in my head says..."**
   - "No harm done, I'll sort it."
   - "Not again. What is wrong with me?"
   - "Forget it, what's the point."
   - "Someone else will catch it."
   → *"That voice is about to have a lot less to say."*

**Closing: "If one thing changed this week, I'd want it to be..."**
- "Nothing important slips" · "My days feel calmer" · "I finally finish what matters"
→ *"That becomes your first focus."*

## Then the report (as agreed)
1. Catch one real thing ("What can't you afford to forget?")
2. My slip line, ending with my own inner voice
3. One tap: "Keep this for me"
4. Short snapshot: Remembered · Reliable · Resilient, my sharp time, a mindset reframe, and one action I choose
5. An honest choice between free and membership

## Guardrails
- Quiet brain-health basis kept: sleep, movement, food, water, calm, mindset, support and meaning.
- No practitioner names, no medical claims, no diagnosis. Instant replies describe what the app does, never a health outcome.
- About 4 minutes. The circle picks my main answer and "Also fits" adds others where it makes sense.

## Technical
- **Question bank** (`src/data/launchAssessmentBanks.ts`): rewrite quick items as above. Add `recallMoment`, `dayStrip` (new day-strip input), `wakeFeel`, `weekHabits` and `mindsetSlip`, and retire the overlapping quick items. Bump the bank version, and map `dayStrip` to the existing best-time and energy-dip fields so Calendar and Help me plan keep working.
- **Instant replies**: add an optional `reply` per option or question, shown in teal under the answer in `LaunchAssessment.tsx` before Next.
- Add a neutral entry to the reference log.
- Add `buildSlipLine` and `buildThreeR` to `myCompass.ts`, with tests.
- Add `CatchOneThing.tsx`, and trim `LivingCompassReport`.
- Check that older saved answers still load. Check phone layouts at 320px and 393px.
