# Make the report after the questions revealing

## What's wrong now
The report mostly repeats my answers back to me ("What I told MyRhythm"). The key insight is a single generic line: "[word] may be the most useful place to make life feel easier right now." Nothing connects the dots, so there's no "that's exactly me" moment.

## What makes a report revealing
It shows me a **pattern I hadn't put into words**, explains **why it keeps happening**, and shows **what changes** if it's handled. That's the moment that makes people want to use the app.

## New report, top to bottom

**Headline (personal, built from my answers)**
Example: "Annabel, things aren't slipping because you don't care. They slip in the gap after the conversation ends."

**1. My pattern** (the reveal)
MyRhythm links two or three of my answers into one clear sentence.
Example: "You said appointments slip, memories fade by the next day, and your clearest time is the morning. So by the afternoon, what was agreed has already gone, before you've had a chance to act on it."

**2. My Remembered · Reliable · Resilient picture**
These match the three promises on the welcome screen. Each one gets a simple marker (Strong / Building / Needs support) and one line of meaning.
- *Remembered:* how well what's said is kept
- *Reliable:* how often plans get followed through to the end
- *Resilient:* how easily I get back on track after a hard day

**3. What this is quietly costing me**
One honest line taken from my answers. Example: "Missed follow-ups, repeated phone calls, and relying on others to remind you." It's kind in tone, never blaming.

**4. My best window**
"My clearest hours are around 9 to 11am. That's when important things should go." It's shown as a small day bar.

**5. What's already working**
My real strength, in my own words.

**6. What changes in my first week**
Three concrete moments, linked to Remembered, Reliable and Resilient. Example: "Your next appointment gets recorded. Its next steps land at 9:30 the following morning. If you miss a day, they're waiting for you, not lost."

**7. One action I choose** (stays as now: pick, edit or write my own; choose when to look again)

**8. Free vs membership** (stays clear and honest, as now)

Every insight keeps its "Why this?" link showing which answers it came from. Every insight also keeps "This feels right" and "Not true for me". Wording stays first person, with no medical claims, no diagnosis and no scores that feel like a test.

## Technical
- Extend `deriveReport` in `src/launch/compass/myCompass.ts` to return `headline`, `pattern`, `cost`, `rrr` (three markers with reasons), `bestWindow` and `firstWeek[]`. These are built from rules that combine answers, mapped to quick-tier question ids. The existing fields are kept, so My Compass still works.
- Rebuild the layout of `LivingCompassReport.tsx` in the order above, using existing launch tokens. Check it on a phone at 320px and 393px.
- Add a small test for `deriveReport`: three sample answer sets should each give a different pattern and the correct markers.
- Read the question bank first so each pattern rule uses real question ids. If an answer is missing, fall back to a gentler, general line.
