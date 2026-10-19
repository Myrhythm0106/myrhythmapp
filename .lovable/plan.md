# A more meaningful daily welcome, using your #IChoose 365 book

## What changes
The welcome appears on your **first visit each day**, including straight after signing in. It becomes a short, empowering moment that is clearly yours:

1. **An empowering welcome to today.** A greeting that changes with the time of day, such as "Good morning, Annabel. Today is mine to shape."
2. **Today's #IChoose, from your book.** Each day of the year shows that day's entry from *#IChoose 365*, word for word:
   - **The statement**, large and clear, e.g. "Today, I choose to hear my voice."
   - **A simple invitation** underneath, e.g. "I can trust myself enough to hear what I am trying to say."
   - **Today's pause** as an optional drop-down, with its short reflection and question, e.g. "What do I already know about myself that I can trust?"
   - A small credit, "From #IChoose 365 by Annabel Aaron".
3. **Start my day.** One large button closes the welcome and opens Home. It won't show again until tomorrow.
4. **Calm screen.** "Today's shape" and "My vision" stay as small optional drop-downs, so there are never more than 3 things to act on.
5. **Your words only.** The made-up statements are removed.

## Notes for you
- The day of the book matches the day of the year: 1 January is Day 1, and Day 366 in a leap year repeats Day 365.
- Some entries mention God, for example "my identity is found in God". I'll show every entry exactly as written. If you would rather keep faith entries out of the app, tell me before you approve.
- The written-reflection lines from the book stay in the book. The app shows the words, not blank lines.

## Technical notes
- Extract all 365 days from the PDF (statement, invitation, pause title, pause text, question) into `src/data/iChoose365.ts`. Check that there are exactly 365 entries, with none missing or garbled. `getDailyEntry(date)` picks the entry by day of year.
- Rework `src/launch/daily/DayOpenWelcome.tsx`: show on the first signed-in entry of the day on any `/launch` page except the questions flow. Keep the existing once-a-day key. Lay out the greeting, statement, invitation, pause drop-down and Start my day.
- Add tests: 365 entries, each with a statement starting "Today, I choose"; 1 January is Day 1; the entry stays the same throughout one day.
- Save to memory: #IChoose content comes only from Annabel's *#IChoose 365*, quoted verbatim.
