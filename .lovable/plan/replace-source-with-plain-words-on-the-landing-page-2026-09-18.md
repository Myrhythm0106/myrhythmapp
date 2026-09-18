# Replace "source" with plain words on the landing page

## Why

"Source" is vague to an 80-year-old with Alzheimer's. Every place it appears on `/launch/landingpage` gets everyday language instead. The thread keeps its decisive "to completion" feel the user approved.

## Copy changes (all in `src/components/mvp/MVPCore4C.tsx`)

1. Chapter 01 promise: "Memory Bridge keeps the source..." →
   "Memory Bridge keeps the original conversation or report safe..."
2. Chapter promise: "Each action keeps a simple reference back to its source." →
   "Each action keeps a simple note of which conversation it came from."
3. Diary promise: "My diary keeps the action connected to the original source." →
   "My diary keeps each action connected to the conversation it came from."
4. Thread headline: "One thread. From source, through follow-through, to completion." →
   "One thread. From the original conversation, through follow-through, to the day it's done."
5. Sequence item: "Return to the source at any time" →
   "Return to the original conversation at any time"

## Verification

- Typecheck the project.
- Playwright screenshot of the section on desktop and mobile to confirm the new wording renders cleanly and no line overflows.

