# Memory Bridge — calm transcripts and clear speakers

## Goal
Continue the approved guided Memory Bridge work, adding a transcript that is easier to read without losing the original words. Preserve the professional `/start` standard: adult, useful and reassuring—not childish or stripped of value.

## Confirmed starting point
- The transcript currently displays every available speaker turn in one scrolling view, with repeated speaker, time and editing controls.
- Speaker separation is requested during supported transcription. The transcript already stores confirmed speaker names and lets the person rename a speaker.
- The guided entry, saving and next-step presentation have been edited; their latest compilation check passed, but interaction checks remain outstanding.
- The requested recording-removal and transcript-preservation database change did not execute. Those safeguards must not be described as completed.

## 1. Read a little at a time
- Open **My conversation** with its title and a short section of original words—not the whole meeting.
- Group consecutive turns from the same speaker where this preserves ordering and source locations; break long speeches into readable paragraphs.
- Show a bounded section of roughly 8 turns, splitting exceptionally long turns into manageable reading passages. Provide **Read more**, **Previous section** and a clear position in the conversation.
- Keep **Read everything** available as an optional choice, not the default.
- Do not paraphrase, remove uncertainty flags, label keyword guesses as a summary, or imply that a partial excerpt is the entire conversation.
- When arriving through an action’s original-word link, open the section containing the matched passage and highlight it. The person should not have to find it again.

## 2. Know who is speaking—without pretending
- Add one compact **People in this conversation** disclosure above the words.
- Show existing confirmed names. Unknown speakers remain **Speaker A**, **Speaker B**, and so on; unnamed plain transcripts remain unnamed.
- Provide **Add name** or **Change name** for each separated speaker, with explicit Save and Cancel. Confirming one name updates that speaker throughout the conversation and saved transcript export.
- Do not guess speaker identity from voice, names mentioned in speech, or the Support Circle list. Those signals do not establish who spoke.
- If speaker separation is unavailable or uncertain, say so calmly and retain the plain transcript rather than inventing attribution.
- Automatic name suggestions from explicit introductions can be considered later, but are not required for this first improvement.

## 3. Keep reading separate from tools
- Use speaker headings, generous spacing, strong text contrast and dividers; no reliance on colour alone.
- Put editing, timestamps and export/history options behind **Conversation tools** or a per-passage disclosure. Keep the optional original-word link easy to reach from each next step.
- Offer **Listen to this part** only when audio and an actual timestamp are available. Do not turn estimated locations into exact evidence.
- Preserve corrected wording, original history, unclear-word marks and retention-aware hiding of removed transcripts.
- Loading and failure states offer Retry or Back. A failed load must never look like an empty transcript.

## 4. Finish the approved guided flow
Complete and validate Record → Save → Check my next steps → Add selected steps to my day, with optional output/people settings, compact saved conversations and a confirmed calendar-day link.

Keep explicit saving and scheduling approval. No automatic upload on Stop, automatic sharing or new access permissions.

## 5. Recording removal and preserved write-up
- Complete the previously requested 7-, 3- and 1-day audio-removal notices with duplicate protection, subject to the database change being allowed to execute.
- Default transcript-requesting recordings to retaining their transcript after automatic audio removal; respect explicit actions-only/save-only choices and later privacy changes.
- Keep the dated audio-removal reference visible after removal. Never claim an uploaded file was removed until removal succeeded.
- Provide notices inside the app, including when the person returns after being away. Do not promise email or phone notifications unless their delivery is implemented and verified.
- Use calm dates and reassurance, not urgent countdown language. For short retention periods, send only milestones that actually occur; no retrospective notices.

## Technical scope
- Focus transcript presentation in the existing TranscriptView and small reading helpers, retaining the existing speaker-name storage and source-matching contracts.
- Preserve complete ordered text for exports and source matching; displayed grouping/paging must not rewrite the canonical transcript or timestamps.
- Complete existing guided-flow edits and document the reading presentation decision in architecture guidance.
- Reuse recording expiry, transcript-keeping and notification infrastructure where possible. Inspect and verify hosted scheduling before relying on background notices; any required database change uses the approval tool.
- Record the added transcript task in the work list when implementation resumes; no other source edits are made while this plan is awaiting approval.

## Checks
- Long meetings, one-speaker conversations, missing timestamps, plain transcripts, long paragraphs and unknown names remain readable.
- Add/change/cancel a speaker name and confirm it updates the displayed passages and export without altering who said what.
- Action → original words opens the correct section; full reading, section navigation and transcript corrections preserve accurate matching.
- Test phone/Android widths, 320px, desktop, keyboard access, 200% zoom and 56px primary controls.
- Test output choices, saving failure, no extracted steps, missing dates, scheduling failures and See my day.
- Verify retention notices and preservation against real saved records where access permits; label unavailable authenticated checks honestly.
- Observe an older person and someone with memory challenges using the flow before claiming reduced stress or best-in-class usability.

## Not included
Voice-identity recognition, guessed speaker names, new AI summaries, automatic scheduling, new sharing permissions, or a claim that usability is proven without user testing.