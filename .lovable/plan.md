# Apply my copywriting style and brand voice across MyRhythm

## What happens
1. **Save the voice guide as a lasting rule** so every future screen, email and message follows it: warm, confident, conversational, British English, no em dashes, no hype phrases, no invented claims or testimonials. It sits alongside the existing rules (landing page says "you", in-app says "I/my", no medical claims).
2. **Copy sweep of the main screens people see first**:
   - Landing page, sign-up, sign-in, card step, Who it's for, welcome, Questions intro, My snapshot, Home, Memory Bridge, Support Circle, reminders, Help.
   - Remove em dashes (replace with commas or full stops).
   - Switch any American spelling to British (organise, colour, personalise, etc.).
   - Replace generic phrases ("unlock", "level up", "game-changing", "Don't miss out") with plain, value-led wording.
   - Trim filler and repeated lines; keep the locked North Point and pricing wording unchanged.
3. **Emails and pop-up messages**: same sweep for reminder emails, invitations and toast messages (for example "Done, your conversation step is closed...").
4. **Check**: search the app for leftover em dashes and banned phrases, and view key screens on a phone-sized screen.

## In tune with your blog (annabelaaron.com, Gifting Adversity)
- Carry its warmth and hope into the app: honest, personal, steady, never dramatic. "Every new day is a gift" sits alongside #IChoose.
- Draw on your values in the wording: resilience, personal growth, authenticity, community support, continuous learning.
- Keep your story where it belongs: a short, optional "Why I built MyRhythm" note on the landing page and About card, written from your own words. Nothing is invented.
- Everyday screens stay calm and practical. The blog's spirit shows in encouragement, daily #IChoose statements and wins, not in long passages.

## Not changed
Layout, colours, buttons, flows, prices and the North Point wording.

## Technical details
- Memory file `mem://brand/copywriting-voice` + Core line in index.
- Scope: `src/pages/launch/*`, `src/components/launch/*`, `src/components/mvp/MVPCore4C.tsx`, `src/launch/**` strings, `supabase/functions/*` email templates. Archive pages untouched.
- `rg "—"` and a banned-phrase list used to find and confirm fixes.
