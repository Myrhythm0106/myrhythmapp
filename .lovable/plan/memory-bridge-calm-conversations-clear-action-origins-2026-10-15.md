# Memory Bridge — calm conversations, clear action origins

## 1. Roll up saved conversations
- Keep the recording-first introduction and its three main choices unchanged.
- Start both the latest and earlier conversations rolled up on their first appearance. Keep title, date, duration, saved/processing status and next-step count visible in a compact header.
- Add a clearly labelled **Show details / Hide details** control. Listening, transcript, next-step controls and recording management appear inside the expanded conversation; deletion retains its confirmation.
- **Remember my choice:** remember each conversation’s expanded/collapsed state separately for the signed-in user on this device. This is not cross-device syncing.
- After saving, keep the existing confirmation and offer direct access to the saved conversation or next steps. Explicitly opening a conversation expands it; normal returns respect the user’s choice. Do not automatically expand unrelated conversations.
- Keep processing failures and permission problems visible even when details are rolled up.

## 2. Connect each next step to its original words
- Add a quiet **Where did this come from?** disclosure beside each next step in the saved table and card views, using the same pattern in the checking view.
- Expanding it shows the conversation title/reference and a short quote, visually distinct from the editable action. Include **Read in transcript** to open that conversation’s transcript.
- Check a stored quote against the available transcript before highlighting it. Highlight and scroll to a passage only when a unique, reliable text match exists. For missing or ambiguous matches, open the full transcript without pretending to identify an exact passage.
- Existing time markers are estimated through matching, not guaranteed exact locations. Do not present them as verified timestamps or use them as the sole basis for highlighting.
- If no quote exists, still offer the parent conversation’s transcript when available. For user-added actions, identify them as added by the user rather than inventing spoken evidence.
- If the transcript has been removed, clearly say it is no longer available and keep the surviving summary/reference. Do not reveal retained excerpts contrary to the source’s retention rules.

## 3. Preserve the professional standard
- Keep the /start-aligned typography, restrained teal/gold details and orange recording action; no new navigation or crowded toolbar.
- Use large labelled disclosure controls, keyboard support and announced expanded/collapsed states. Meaning must not depend on colour.
- Quotes stay hidden until requested so traceability adds reassurance, not visual noise.

## What the source review confirmed
- Saved recording cards currently display the player, transcript, next-step and deletion controls together.
- Action models already include quote/reference fields. The checking view has an existing quote disclosure, while saved card/table views do not provide the same explanation.
- Stored quotes are extracted by AI; stored time markers may be heuristic matches. Neither alone establishes accurate provenance.

## Technical scope
- Presentation changes in `LaunchMemoryBridge`, the saved action table/card views, the checking view and `TranscriptView`; use a shared small action-origin disclosure to keep behavior consistent.
- User-scoped device-local storage for conversation disclosure choices; no new database tables, extraction logic, payment or permission changes.
- Reuse existing source-reference rendering and transcript-loading paths. Verify action-to-parent mappings before enabling links; no guessed recording IDs.
- Record the disclosure and source-link conventions in the project architecture guidance during implementation.

## Checks before completion
- Verify compact/expanded latest and earlier records, choice persistence, explicit open after saving and continued access to play/transcript/actions/delete confirmation.
- Verify a quoted action opens the correct transcript; test unique, ambiguous, absent and removed-source cases, plus user-added actions.
- Check phone/desktop layouts, keyboard navigation, large text and compilation.
- Attempt the signed-in save → reopen → action → transcript flow. If authenticated checking remains unavailable, report it as unverified rather than claiming it passed.