# Recording allowance — one clear monthly pool

## Decision
Keep the Free allowance at **240 recording minutes per calendar month**. Remove its separate 20-minute recording limit. Allow as many recordings as the person needs within the remaining monthly pool.

Keep the approved Memory Bridge and private-pilot work in progress; this is a focused allowance change, not a change to membership pricing or a public launch.

## Confirmed findings
- The Free configuration currently sets 240 monthly minutes, 60 weekly guidance minutes and a 20-minute per-recording limit.
- The Launch recorder currently stops at the per-recording cap.
- Its starting gate uses the allowance hook’s selected Week/Month period; weekly guidance can therefore block starting, contrary to the intended monthly-pool rule.
- The allowance hook totals durations from saved voice-recording rows. This alone does not establish authoritative enforcement across uploads, deletion, other capture paths or simultaneous devices.

## Experience
- Main wording: **240 recording minutes available this month** when unused.
- After use: **180 of 240 recording minutes remaining this month**, using actual remaining time.
- Secondary wording: **Use them across as many recordings as you need.** No claim of unlimited minutes or unlimited transcription.
- Remove **up to 20 minutes per recording** for Free. Keep other tiers’ existing recording limits unchanged.
- Keep the monthly allowance and reset date visible; tuck usage details away. Remove Week as a competing allowance mode on the recording entry. Any weekly figure retained elsewhere is labelled guidance and never gates capture.
- During recording, show elapsed time and time available from the monthly balance. Stop safely when the remaining pool is reached, keeping captured audio ready for explicit Save—not claiming it is already saved.
- At exhaustion, explain when minutes reset and keep saved conversations accessible. No silent stop, false success or surprise charge.

## Enforcement and accounting
- Verify and consolidate the live capture, quick capture and upload paths around the monthly recording allowance before claiming the rule works everywhere.
- Use precise duration accounting rather than rounding every conversation independently.
- Keep consumed minutes counted after audio deletion or expiry; deleting a recording must not replenish the monthly allowance. Identify the existing durable usage source and verify its recorded units before adopting it.
- Enforce the monthly pool independently of any presentation preference. Check near-exhaustion, concurrent requests and stale balances; require server-side checks where necessary rather than trusting the browser alone.
- Audit processing-duration/provider constraints for a longer Free recording. Do not imply that 240 minutes in one uninterrupted phone session is proven reliable until real-device tests pass.
- Use the database approval tool if durable accounting or authoritative limits require changes. Preserve permissions and retention rules.

## Competitive judgement
240 minutes is a reasonable Free introduction, not a market-leading volume claim. Official pages inspected on 15 October 2026 list 300 monthly transcription minutes for [Otter Basic](https://otter.ai/pricing) and [Plaud Starter](https://www.plaud.ai/pages/plaud-ai-plan-pricing); those are not necessarily identical to MyRhythm’s recording pool.

Keep 240 while measuring pilot usage, successful processing and actual provider costs. Do not increase the allowance or promise profitability without that evidence. MyRhythm’s value should come from usable, checked next steps and follow-through—not the largest minute count.

## Acceptance checks
- Free: multiple short recordings and a recording longer than 20 minutes, up to the remaining monthly pool.
- No weekly block, no recording-count gate, no accidental changes to paid tiers.
- Exact accounting, month reset, refresh after saving, deletion/expiry, uploads and quick capture.
- Small remaining balances, exhausted allowance, connection failures and concurrent-device behavior.
- Android/iPhone long-session checks remain explicit pilot gates; label simulated checks separately from real recordings.
- Desktop, Android-sized and 320px wording fits, with clear reset information and accessible controls.

## Completion
Record the chosen Free allowance rule in project memory and architecture guidance when building resumes, update the work list, finish every available verification and name any real-device or external-access blockers honestly.