# Is the journey calm and empowering? Verdict and next fixes

## Short answer
Mostly yes. The order is right: Get Started → About me (optional) → Questions → My snapshot → Home, with membership as a choice, not a gate. It gives real value (the snapshot) before asking for money. Home shows one priority plus "Record something" and "See my day", and a gentler day is one tap away. That builds a sense of control.

Where it can still overwhelm:
1. **The snapshot is long.** Score, summary, ranked areas, a grid, detail cards, "Prove it now" and the membership offer all appear in one go. That's a lot after 11 questions, especially for someone who is tired.
2. **Too many decisions straight after the questions.** Pick up to 3 priorities, save a real item, and choose a plan all happen on one screen, so the screen asks for more than 3 choices.
3. **The handover to Home is weak.** The priorities people choose don't appear on Home yet, so their choice seems to disappear. That weakens the feeling of control.
4. **"You stay in control" isn't acted on yet.** The answer to "ask me / suggest / place it" is saved, but the app doesn't change how it behaves.
5. **Some words don't match across screens.** A few labels and the voice still vary between screens.

## The plan
1. **Snapshot in three calm steps:** (a) my score and a one-line headline, (b) my top 3 areas, already ranked, with "Keep these" or "Change", (c) a single next move: "Catch one real thing now". The detail and the membership offer sit in a drop-down further down the page.
2. **Carry my choice to Home:** Home's single priority comes from my #1 chosen area, with a line such as "You chose: nothing slips after appointments."
3. **Respect my control answer:** "Ask me" means the app always confirms before placing a step. "Suggest" offers a time. "Place it" schedules the step and offers Undo.
4. **One end-to-end check of the wording** on every screen from the front door to Home: "you" on the landing page, "I/my" inside the app, present tense, and no more than 3 choices per screen.
5. **Phone walkthrough** at 393px and on a desktop screen as a brand-new user and as a returning user. Fix anything that needs sideways scrolling, a second scroll bar, or a button smaller than 56px.

## Technical notes
- Split the stages in `ConsultingReport.tsx`. The ranking stays in `priorityAreas.ts`, which already has tests.
- Home reads the chosen-priorities store that is kept on this device (`NextActionStrip`/`QuietHome`).
- `myrhythm_control_style_v1` sets the default when saving to the calendar. Add tests for the ask, suggest and place rules.
- No database changes.
