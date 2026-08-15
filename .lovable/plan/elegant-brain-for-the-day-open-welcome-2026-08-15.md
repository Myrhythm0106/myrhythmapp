# Elegant brain for the Day-Open Welcome

Replace the sunrise circle badge at the top of the warm day-open welcome screen with a soft watercolour brain image.

## What changes
- Generate a new asset: an elegant watercolour brain — soft warm orange and teal washes on a clean background, calm and human, no clinical or anatomical harshness, transparent PNG so it floats over the deep-ink sunrise wash.
- In the day-open welcome overlay, remove the round sunrise icon badge and place the brain image in its slot: centred, roughly 96–120px, gentle fade-and-rise on entry, subtle warm glow behind it so it sits naturally on the dark background.
- Keep everything else untouched: date line, greeting, confidence line, #IChoose statement, vision card, and the single "Start my day" button.

## Technical notes
- Asset: `src/assets/watercolour-brain.png` via image generation with transparent background.
- File: `src/launch/daily/DayOpenWelcome.tsx` — replace the `day-open-halo` div and `Sunrise` icon (lines ~100–102) with an `<img>` (ES6 import, empty/decorative alt) wrapped in a motion div; drop the now-unused `Sunrise` import.
- Reuse the existing `day-open-halo` glow styling behind the image rather than adding new colour values.
