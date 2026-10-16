# A clear ADHD path

## What people will see
- **Starting choice:** a third visible option, "I live with ADHD or find focus hard to hold", with the description "ADHD, attention or focus that slips. Getting things out of your head and done, without the overwhelm." Work and study stay under "Work, study or another starting point", so the screen still shows only three main choices.
- **Questions and free snapshot:** wording and examples written for ADHD. The tone is warm, never pathologising and never "fix your brain". Examples:
  - Rhythm: "Focus often comes in bursts. Knowing when yours arrive lets you protect them."
  - Your victories: "Finished things vanish fast with ADHD. Catching them builds real momentum."
  - Harness support: "A body-double or gentle nudge can turn starting into doing."
  - Heal: "Rest and sleep steady attention more than willpower ever will."
  - Plus lines for the other four letters, written in the same style.
- **Home and app wording:** ADHD users get their own short description and examples, rather than borrowing the "busy professional" wording.
- **Disclaimer:** the existing "does not diagnose or treat" wording stays visible. ADHD is described as a way of working, never as a condition the app manages.

## What stays the same
- The questions, scoring, free snapshot and membership. Only the wording changes.
- People who already chose "work" or "study" keep their choice.

## Check
- Choose ADHD → reach the questions → open the snapshot, and confirm the ADHD wording appears.
- Check on phone (320px and 393px) and at your current screen size.
- Search the app to confirm no external programme or practitioner is named.

## Technical details
- `usePersona.ts`: add a `focus` persona, map `'adhd'` to it instead of `productivity`, and add its label, plural, description and short line.
- `copy.ts` and `snapshotTeasers.ts`: add a `focus` entry for every Record keyed by Persona; TypeScript will flag any we miss.
- `LaunchUserType.tsx`: insert an `adhd` card as the third item in `userTypes` (icon `Zap` or `Sparkles`), and change the visible slice from `index < 2` to `index < 3`.
- Search for other `Record<Persona` uses and switch statements, and add `focus` to each.
- Save the ADHD audience wording rule to memory (brand/third-problem-ideal-brain already covers ADHD as an audience).
