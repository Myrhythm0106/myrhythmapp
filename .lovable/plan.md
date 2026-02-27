

## Add Smart Scheduling pillar to "How MyRhythm Works" (Slide 8)

### Change in `src/components/investor/InvestorSlides.tsx`

**Add a 6th pillar** to the `pillars` array (after line 262, before the closing `];`):

```
{ title: "Smart Scheduling", desc: "Your personal assistant. MyRhythm reads your calendar availability and automatically schedules meetings, appointments, and actions — so nothing falls through the cracks.", icon: "📅" },
```

**Update the layout** to accommodate 6 pillars: change from 3+2 grid to **3+3 grid** by updating the bottom row (line 280) from `grid-cols-2` to `grid-cols-3` and removing the `max-w-[1080px]` constraint so all 6 cards display evenly.

### Files changed
- `src/components/investor/InvestorSlides.tsx` — lines 257–288

