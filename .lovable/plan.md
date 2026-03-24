

# Elevate Brain Injury as the Foundation — Never Forgotten

## The Problem

Brain injury survivors are currently listed as one of nine equal cards on the MVP selection page. The LEAP broadening risks making them feel like "just another audience." This is wrong — brain injury is the origin, the founder's lived experience, and the reason the app exists.

## The Fix

Restructure the MVP page into a clear visual hierarchy that honours the foundation while welcoming the broader LEAP audience.

### Layout Change — `MVPUserTypeSelection.tsx`

**1. Foundation Hero Section (above the grid)**
A prominent, visually distinct card spanning full width before the grid:
- Title: "Built From Lived Experience"
- Subtitle: "MyRhythm was born from brain injury recovery. Every feature — Memory Bridge, Support Circles, energy-aware scheduling — was designed by a survivor, for survivors. This is our foundation."
- Two side-by-side CTAs:
  - **Brain Injury Navigator** (primary, prominent button)
  - **Caregiver / Support** (secondary button)
- Warm gradient (brain-health to clarity-teal), Heart + Brain icons

**2. "Your Rhythm, Your Way" Grid (below)**
The remaining 7 cards (Student, Executive, Thriving, Cognitive Support, ADHD, Long COVID, MS Cognitive) in the existing 3-column grid with a subtle section header:
- "MyRhythm also empowers people with ADHD, Long COVID, MS cognitive fatigue, and anyone who wants to own their day."

**3. Update tagline** from the old clinical one to LEAP:
- `"Empower Your Day. Own Your Rhythm."` — replaces `"Empower Your Mind, Rebuild Your Memory, Reclaim Your Life"`

### Files Modified
- `src/components/mvp/MVPUserTypeSelection.tsx` — restructure layout with foundation hero + grid

### No Other Files Change
Welcome screens, routes, types, and PDFs remain as-is. This is a presentation hierarchy fix only.

