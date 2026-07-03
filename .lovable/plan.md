# Extend GTM Playbook to cover the already-discharged

## Why
The current v4 Playbook frames the Bridge Pathway as starting **pre-discharge on the ward**. That leaves out a large, urgent audience: people (and families) who were discharged months or years ago and are still living inside the Discharge Cliff — no structured support, lost routines, isolated caregivers.

They are not a different problem. They are the **same three failures**, just entered late:
- Discharge Cliff — still falling, just further down
- Clinical-Ready vs Life-Ready Gap — never closed
- Ideal-Brain Assumption — compounded by years of tools that assumed a brain that never forgets

## What I'll produce

A new versioned artifact (v4 kept untouched):

- **`MyRhythm_GTM_Playbook_v5.pdf`** (+ `.docx`) in `/mnt/documents/`
- Confidential 3pt footer preserved

## Content changes vs v4

1. **Reframe the Bridge Pathway entry points** — two on-ramps, same pathway:
   - **Pre-discharge** (ward-initiated) — existing flow
   - **Post-discharge / retrospective** (self- or family-initiated at any point after discharge) — new flow

2. **New audience block: "Already Discharged"** — for survivors and families who are months/years past discharge. Mapped to all 4Rs:
   - *Remove* isolation, guesswork, single-point-of-failure caregiving
   - *Reduce* caregiver overload and repeat-explanation fatigue
   - *Return* routine, follow-through, shared history
   - *Reconnect* the Support Circle — no one walks alone, even if the walk started years ago

3. **New GTM channels for this audience** (additive, not replacing existing):
   - Brain injury / stroke / dementia charities and peer communities
   - Long-term rehab & community neuro-rehab teams
   - Caregiver support groups (in-person and online)
   - Social media communities and lived-experience creators
   - GP / primary care follow-up touchpoints

4. **Messaging additions**:
   - "It's not too late to start" callout
   - Reframed positioning line so it doesn't imply the ward is the only entry
   - One-line testimonial-style placeholder for a late-entry persona (marked as illustrative)

5. **Feature matrix** — unchanged 4R mapping, but examples now include a post-discharge scenario per feature (Capture, Commit, Calibrate, Celebrate, Memory Bridge, Support Circle, Assessments).

## Sources of truth I'll pull from
- `mem://brand/clinical-life-ready-gap`
- `mem://brand/third-problem-ideal-brain`
- `src/config/appDescription.ts` (unchanged — no new stats needed)
- `docs/founding-core-value-map.md`
- Existing v4 Playbook content (carry forward, don't rewrite what works)

## QA
Render every page of v5 to images and visually inspect for clipping, overflow, missing footer, broken tables. Iterate until clean.

## Out of scope
- New stats beyond the already-cited set
- Regenerating the User Manual v3 (say the word and I'll mirror the "already discharged" framing there as v4)
- CCM / Productivity investor decks
- Any code, UI, or `docs/*.md` changes
