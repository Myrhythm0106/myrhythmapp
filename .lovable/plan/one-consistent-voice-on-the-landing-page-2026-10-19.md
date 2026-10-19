# One consistent voice on the landing page

## The problem
The landing page greets the person ("Welcome, Annabel" / "Welcome back") and talks to them as "you" in the headline ("It remembers, so you don't have to", "You stay in control"), but the four sections below switch to "I / my" ("I review the write-up before anything reaches my diary", "Loop in someone I trust", "My choice stays central"). Reading top to bottom, the speaker keeps changing — that is what feels confusing.

## The rule
- **Landing page (before and at sign-in): MyRhythm speaks to the person — "you / your".** A greeting by name and "you" belong together.
- **Inside the app (questions, snapshot, Home): unchanged — the person's own voice, "I / my"**, as already agreed.

## What changes
Only the wording on `/launch/landingpage`. Examples:

- "Loop in someone I trust—if I choose" -> "Loop in someone you trust — if you choose"
- "I review the write-up before anything reaches my diary." -> "You review the write-up before anything reaches your diary."
- "The plan enters my real life." -> "The plan enters your real life."
- "My choice stays central" -> "Your choice stays central"
- "MyRhythm helps me choose a realistic time…" -> "MyRhythm helps you choose a realistic time…"
- "Get Started: … about me …" -> "… about you …"

Also check the greeting line reads naturally with the name ("Welcome back, Annabel.") and keep tenses present-tense throughout (no "will", no past).

Nothing else changes: layout, pictures, buttons, colours and the in-app first-person copy stay as they are.

## Technical details
- Edit the 4 section objects and hero/helper copy in `src/components/mvp/MVPCore4C.tsx` (about 29 first-person strings), plus any greeting in `ResumeBanner.tsx`.
- Save the voice rule to project memory (landing = "you", in-app = "I").
- Verify at 1242px and 393px with a screenshot read-through.
