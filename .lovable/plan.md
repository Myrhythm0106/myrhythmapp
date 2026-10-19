# A more meaningful daily welcome, drawn from your #IChoose 365 book

## What changes
The welcome appears on your **first visit each day**, including straight after signing in. It becomes a short, empowering moment that is clearly yours:

1. **An empowering welcome to today.** A greeting that changes with the time of day, such as "Good morning, Annabel. Today is mine to shape."
2. **Today's #IChoose, inspired by your book.** Each day of the year gets its own statement, based on that day's theme in *#IChoose 365* and reworked rather than copied:
   - **A statement** in your voice, kept short and present tense. For example, the book's Day 6, "Today, I choose to hear my voice", might become "#IChoose to listen to what I already know."
   - **One line that brings it into the day**, linking the idea to something practical. For example: "One clear step, chosen by me, is enough."
   - **An optional pause** in a drop-down: one short question to reflect on.
   - A small credit, "Inspired by #IChoose 365 by Annabel Aaron".
3. **Start my day.** One large button closes the welcome and opens Home. It won't show again until tomorrow.
4. **Calm screen.** "Today's shape" and "My vision" stay as small optional drop-downs, so there are never more than 3 things to act on.
5. **Your themes only.** The current generic statements are replaced.

## Notes for you
- I'll write fresh versions for all 365 days, each tied to the matching day of the book. Faith themes, for example identity in God, are reworded gently so they still feel like yours. Tell me if you'd rather leave them out.
- You can read the full list once it's built and change any statement you like.
- No medical claims, and no promises of recovery.

## Technical notes
- Extract all 365 days (statement, invitation, pause) from the PDF as source material. Write adapted entries into `src/data/iChoose365.ts` as `{ day, statement, bringItIn, pause }`. `getDailyEntry(date)` picks the entry by day of year, and Day 366 repeats Day 365.
- Rework `src/launch/daily/DayOpenWelcome.tsx`: show on the first signed-in entry of the day on any `/launch` page except the questions flow. Keep the existing once-a-day key.
- Add tests: 365 unique entries, each starting "#IChoose"; 1 January is Day 1; the entry stays the same throughout one day.
- Save to memory: #IChoose content comes from Annabel's *#IChoose 365*, adapted in her voice, not quoted verbatim.
