# Make short lines conversational

## The line on the welcome before questions
Current: "About 6 minutes. My answers set MyRhythm up around me — not the other way round."

New: "This takes about 6 minutes. I answer a few questions, and MyRhythm fits itself around me."

Why: it uses full sentences, everyday words and no dash. It reads like someone talking, which is easier for a tired reader or an older one.

## Same pass on similar lines elsewhere
Find other clipped fragments (for example "Free, mine to keep.", "Captured. Add details (optional)") and rewrite them in the same style:
- Each line is one or two short, complete sentences, ideally under 15 words.
- Keep the first-person "I / my" voice where it's already used.
- No dashes standing in for full sentences, no jargon or unexplained labels like "YES", and no brackets.
- Meaning, buttons and layout stay the same. Only the words change.

Screens to cover: Get Started steps (create account, About me, the welcome before questions), the snapshot page, Home's main card, and the Memory Bridge quick-start and captured screens.

Not changing: the agreed landing headline and tagline, legal or no-medical-claims notices, or any button destinations.

## Technical
- Change the welcome line in `src/pages/launch/LaunchAssessment.tsx`, then search the launch pages and components on the screens listed above for fragment copy and edit the text only.
- Check that the changed screens don't wrap badly on a phone (320px and 393px wide).
