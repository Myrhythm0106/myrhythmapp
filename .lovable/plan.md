

# Update ProductivityInvestorSlides with LEAP + CCM Branding

## Current State
- **InvestorSlides.tsx** (ABI/brain injury deck at `/investor-deck`) — fully updated with LEAP + CCM
- **ProductivityInvestorSlides.tsx** (productivity deck at `/productivity-deck`) — still uses old "Cognitive Performance Infrastructure" language, no LEAP or CCM references

## What Changes

Update `src/components/investor/ProductivityInvestorSlides.tsx` to align with the LEAP + CCM framework:

1. **Slide 1 (Title):** Replace "Cognitive Performance Infrastructure" with "Life Empowerment and Productivity Platform" and add "Powered by Collaborative Cognitive Management (CCM)"
2. **Throughout all 18 slides:** Replace any "cognitive performance infrastructure" references with LEAP-aligned language
3. **Add CCM methodology reference** where the deck describes how MyRhythm works (the three pillars: Collaborative, Cognitive, Management)
4. **Ensure the brain injury foundation** is acknowledged — even in the productivity deck, include a slide or section noting "Built from lived experience with brain injury recovery"
5. **Update tagline** to "Empower Your Day. Own Your Rhythm." where applicable
6. **Add mandatory disclaimer** on final slide: "MyRhythm is a life empowerment and productivity app. It is not a medical device."

## Files Modified
- `src/components/investor/ProductivityInvestorSlides.tsx`
- `src/pages/ProductivityDeckPage.tsx` (slide count adjustment if needed)

