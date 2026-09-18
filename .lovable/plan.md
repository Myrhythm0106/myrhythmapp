# MyRhythm Landing Page — Living Continuity Story

## Objective
Rebuild `/launch/landingpage` as a distinctive, photo-led experience that feels intelligent, warm and premium—not like a conventional app page assembled from cards.

The new visual signature will be a **living rhythm thread**: one continuous line that travels through the page and connects a remembered conversation to a clear action, a real date and trusted support. This makes MyRhythm’s difference visible before it is explained.

## What will change

### 1. A cinematic first impression
- Make **MyRhythm** and its literal promise the strongest first-viewport signals: **“The app that keeps your plan going after the appointment ends.”**
- Use one of the existing human photographs as an immersive image-led opening, with editorial text layered directly into the composition rather than placed in a card.
- Keep one clear action only: **Become a Founding Member**.
- Remove competing “Start Your Journey”, free-trial and floating registration actions from this page.
- Let the next photographic chapter remain visible at the bottom of the first viewport so the page immediately invites movement.

### 2. Turn the existing photographs into a story
- Preserve the current photography and its emotional intent.
- Replace the three equal problem cards and later four-image grid with a paced, asymmetric sequence:
  1. **The moment matters** — conversation or report
  2. **The meaning becomes clear** — verified next steps
  3. **The plan enters real life** — calendar and reminders
  4. **The right people stay connected** — optional Support Circle
- Give each photograph room to lead, alternating image scale and placement so the page feels editorial rather than repetitive.
- Use concise first-person copy where it represents the user’s experience.

### 3. Create an ownable MyRhythm visual language
- Run a fine rhythm thread through the page using teal for active movement, gold for milestones and burnt orange only for the recording moment or urgent attention.
- Animate the thread gently as sections enter view; use restrained image reveals and depth shifts rather than decorative effects.
- Introduce small “memory markers” along the thread—time, decision, action and person—to demonstrate continuity without adding explanatory clutter.
- Keep emerald as authority in typography and key details, with linen and ivory carrying most of the page.

### 4. Make the product mechanism instantly understandable
- Replace the four equal feature cards with one visual continuity sequence:

```text
CONVERSATION OR REPORT
          ↓
VERIFY MY NEXT STEPS
          ↓
PLACE THEM INTO MY REAL SCHEDULE
          ↓
LOOP IN SOMEONE I TRUST — IF I CHOOSE
          ↓
RETURN TO THE SOURCE AT ANY TIME
```

- Keep Memory Bridge as the lead product, while the 4C loop quietly structures the journey rather than competing as marketing language.
- Show a small, realistic product moment beside the photography—such as a captured sentence becoming a dated next step—without inventing unsupported results.

### 5. Preserve depth without overwhelming people
- Consolidate repeated sections and duplicate calls to action.
- Keep supporting facts and “what to expect” information behind clear progressive disclosure.
- Show no more than three immediate choices at once and maintain 56px minimum primary touch targets.
- Retain the explicit non-medical disclaimer and inclusive relevance for people with or without an injury.

### 6. Professional credibility without false claims
- Remove or rewrite language such as “unstoppable strength”, “transformation” and any unsupported trial or clinical-style promise.
- Use evidence-led, plain language focused on confidence, identity, behaviour, follow-through and quality of life.
- Keep the Founding Edition offer accurate: £10/month for life, 500 seats, with no invented partner logos, user counts or endorsements.

## Visual direction
- **Palette:** warm linen and ivory foundation; emerald typography; teal interaction and movement; gold structural accents; burnt orange reserved for capture and attention.
- **Typography:** Instrument Serif for distinctive editorial statements, Work Sans for highly readable product language.
- **Composition:** large photographic fields, asymmetric editorial pacing, generous whitespace and one continuous visual thread—not rows of matching cards.
- **Depth:** controlled overlap, fine borders, soft surface elevation and purposeful motion; no blobs, generic gradients, nested cards or heavy emerald slabs.

## Technical implementation
- Refactor the existing landing-page composition while preserving its navigation, authentication behaviour, modals and image assets.
- Build the rhythm-thread and photo-story sections as focused reusable components where useful.
- Use existing semantic design tokens and the project’s button components; add only semantic landing-page tokens needed for the new visual system.
- Respect reduced-motion preferences and preserve keyboard, contrast and screen-reader accessibility.
- Keep all public-page language within the project’s no-medical-claims policy.

## Verification
- Check the complete page on desktop and phone widths, including first viewport and every photo chapter.
- Confirm there is one primary founding CTA and that registration/login paths still work.
- Confirm all current photographs load with meaningful alternative text.
- Check that text never obscures important faces or becomes unreadable over imagery.
- Validate motion-disabled mode, keyboard navigation, touch-target sizes and contrast.
- Run the project’s TypeScript checks and inspect the finished page in the live preview.
