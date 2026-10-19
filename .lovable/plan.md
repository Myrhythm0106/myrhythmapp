# A more meaningful daily welcome, with your own #IChoose statements

## What changes
The once-a-day welcome stays, but it becomes a short, empowering moment that belongs to you:

1. **An empowering welcome to today.** A warm greeting that changes with the time of day, for example "Good morning, Annabel. Today is mine to shape." It's followed by one present-tense line about choice and control. The rest stays the same: in-app "I/my" voice, no medical claims.
2. **Today's #IChoose statement, in your words.** This is the centrepiece, large and clear, with a small "From Annabel's #IChoose" credit. It comes only from your own statements. The current made-up ones are removed once yours are in.
3. **Start my day.** One large button closes the welcome and opens Home.
4. **Calmer content.** "Today's shape" and "My vision" stay as small optional drop-downs, so there are never more than 3 things on the screen.
5. **First entry of the day.** The welcome shows on the first visit each day, including straight after signing in. After "Start my day" it doesn't show again until tomorrow.

## What I need from you
annabelaaron.com currently shows "This domain isn't connected to a site", so I can't read your blog. Please paste your #IChoose statements into the chat, ideally 30 or more so each lasts a month without repeating. Until then the welcome keeps today's wording, and nothing new is invented in your name.

## Technical notes
- Replace the pool in `src/data/iChooseStatements.ts` with your exact text, attributed in a source comment. The day-of-year rotation stays.
- Rework the copy and layout in `src/launch/daily/DayOpenWelcome.tsx` (greeting, choice line, statement with credit, Start my day). The existing once-a-day key and the rule for arriving on purpose stay the same.
- Show the welcome on the first app entry each day (any `/launch` signed-in page, including after sign-in), not just Home. It is suppressed only during the questions flow.
- Add a test that the daily statement always comes from the pool and is the same throughout one day.
- Save to memory: the #IChoose statements must be Annabel's own words from her blog.
