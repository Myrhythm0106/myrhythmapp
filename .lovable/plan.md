# Lighten the app: Light Linen colour balance

The five colours stay. What changes is how much of each you see. Emerald stops carrying whole screens and becomes a text and detail colour; warm linen carries the space; teal takes the buttons; gold is a thin line; burnt orange is saved for recording and anything urgent.

## The new balance

| Role | Colour | Where it shows |
| --- | --- | --- |
| Page background | Warm off-white `#FBF9F4` | Every screen |
| Cards and panels | Linen `#F2EDE2` and plain white | Cards, tables, sheets |
| Words and headings | Deep emerald `#0F6B52` | Text, icons, small marks |
| Main buttons | Teal `#2FA98F` | Primary actions, links, progress |
| Fine detail | Gold `#C9A84C` | Hairline borders, small badges, the dial |
| Attention only | Burnt orange `#C65A2E` | Recording, overdue, delete confirmations |

Rule of thumb applied throughout: no more than one heavy colour block per screen, and emerald never fills more than a header strip.

## What you will notice

- Welcome, sign-in, register, assessment and payment screens lose their solid dark-green backgrounds and sit on warm linen instead, with emerald only in the words.
- Memory Bridge gets much lighter: the capture circle keeps the teal pulse, but the surrounding slab goes to linen.
- Home, Calendar, Diary, Next Step Summary and Settings feel airier, with white cards on linen and thin gold edges.
- Buttons become teal with white text. Gold stays as an outline style for secondary buttons.
- The recording button and "overdue" markers stay burnt orange, so they still stand out now that less around them is loud.

## Accessibility and consistency

- Every text and button combination checked to stay at or above WCAG AA contrast.
- Buttons stay at least 56px tall and body text at 16px or larger — unchanged.
- Nothing is identified by colour alone; the orange markers keep their icons and words.

## Technical notes

- Retune the `.launch-theme` custom properties in `src/index.css` (lines ~615-625): lighten `--launch-ink` toward `#0F6B52`, set `--launch-cream`/`--launch-cream-light`/`--launch-ivory` to the linen/off-white pair, keep `--launch-gold`, `--launch-ember`, `--launch-teal`, and re-point `--launch-moss` to a mid sage so existing classes soften rather than break. Add a separate `--launch-ink-deep` for the few places that genuinely need dark text.
- No token renames — existing `bg-launch-*` / `text-launch-*` utilities keep working, so most screens change simply by the variables moving.
- Then replace full-bleed dark slabs with linen surfaces in the files that use them most: `LaunchMemoryBridge.tsx`, `LaunchAssessment.tsx`, `LaunchRegister.tsx`, `LaunchPayment.tsx`, `CaptureHub.tsx`, `LaunchCommit.tsx`, `LaunchSignIn.tsx`, `LaunchUserType.tsx`, `LaunchBrainHealth.tsx`, `MyRhythmStrip.tsx`, `FirstSessionCard.tsx`, `MicLevelMeter.tsx`.
- Promote teal to the default `LaunchButton` primary variant; gold becomes the outline variant; ember stays reserved for record/destructive.
- Also covers the public landing and `/start` route so the whole app matches.
- Verify with desktop and mobile screenshots of welcome, sign-in, assessment, Home, Memory Bridge, Calendar and Settings, then run the typecheck.
