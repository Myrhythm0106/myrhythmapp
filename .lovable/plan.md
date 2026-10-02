# Make the journey easier to follow and preserve meaningful multiple answers

## Verdict
The core journey is friendly and strategically sound: **Account → Questions → free snapshot → optional membership/personalisation → Home**. The free snapshot before payment is a strong differentiator, the paid boundary is clear, and returning users are generally sent to the right place.

It is not yet fully consistent enough for an older person or someone with a brain injury. The main issue is that the app promises “Questions” after sign-up, but can first send the person to “What brings you to MyRhythm?”. There are also competing navigation labels and a legacy bottom menu that can briefly make the same places look different.

## Phase 1 — make the first journey match its promise
- Keep one canonical sequence:
  ```text
  Start here → Account → Questions → My free snapshot
                                  → Make it yours (optional)
                                  → Home or membership
  ```
- Let the shared questions begin without requiring a user-type choice first; the current question bank is identical for every user type.
- Offer “Make it yours” once, after the snapshot, with a clear skip to Home. Never send someone backwards to it unexpectedly.
- Keep halfway progress and return people to the exact unfinished question.
- Keep “Not now” exits, but use one phrase everywhere: **Not now — go to Home**.

## Phase 2 — make navigation predictable
- Use the same plain names everywhere: **My questions**, **My snapshot**, **Home**, **Memory Bridge**, **Calendar**, **Diary**, **Help**.
- Rename the dial’s clinical-sounding “Brain Health Assessment” destination to **My questions and snapshot**.
- Remove the competing legacy signed-in bottom menu so every live screen uses the Launch menu and the You-Are-Here control only.
- Keep the established-screen dial, Home route, and large Back controls; keep first-time setup linear.
- Make Help reachable within two taps from every established app screen.

## Phase 3 — multiple answers only where they are truthful
- Keep the eight scored everyday brain-health questions single-choice. Their options are frequency/degree scales, and allowing several would imply that secondary answers affect the score when they currently do not.
- Keep preferred time, focus length, and support quantity single-choice.
- Keep **“What would make this week feel better or more manageable?”** as the multiple-answer question because its answers are genuinely additive and already feed the person’s goals.
- Preserve the approved interaction on that question:
  - circle = primary answer;
  - small **Also fits** box on the left = secondary answer;
  - **Make primary** = deliberate swap;
  - changing the primary keeps the previous choice as secondary;
  - all selected goals remain available to the snapshot and diary.
- Make the multiple-choice permission unmistakable above that question and ensure screen readers announce primary and secondary states accurately.
- Do not change scoring or previously saved snapshots.

## Technical notes
- Make the shared assessment bank available before persona selection rather than redirecting from Questions to user type.
- Keep the existing `{ primary, alsoFits[] }` answer shape and schema compatibility.
- Consolidate non-Launch authenticated navigation onto the Launch navigation rather than maintaining two vocabularies.
- Preserve the free snapshot, optional membership, device-local progress, calendar consent, and non-clinical wording.

## Verification
- Test first-time paths from both **Start here** and **Become a Founding Member**: Account → Questions → snapshot, without an unexpected page in between.
- Test returning states: unfinished questions resume; completed non-member goes Home; Founding Member intent reaches membership only after the snapshot; existing member goes Home.
- Phone checks at 393×822 and a small Android width: no sideways scrolling, no double scrollbars, 56px primary targets, visible Back/Home escape.
- Assessment check: choose a primary weekly goal, add and remove two **Also fits** goals, promote one, go Back/Next, reload, complete, and confirm all goals persist while only scored primary answers affect the score.
- Verify Home, Memory Bridge, Calendar, Diary, Help, profile, and the You-Are-Here map all use one navigation vocabulary.
