# Fix: deleted recordings must vanish from the screen, with safe confirmation

## Problem
On the Memory Bridge page, deleting a recording removes it from the database but the card can stay visible on screen — the list only updates if a background re-fetch succeeds. The confirmation dialog exists but needs to be guaranteed clear and mistake-proof.

## Changes

### 1. Remove the deleted item from the screen immediately
- In `src/hooks/voiceRecording/useVoiceRecorder.ts`, `deleteRecording` will remove the recording from the on-screen list right away (local state update), then re-fetch in the background to stay in sync.
- If the delete fails, the item stays on screen and the user gets a clear error message — nothing disappears by mistake.

### 2. Strengthen the delete confirmation
- Keep the existing "Delete this recording permanently?" dialog on Memory Bridge.
- Make the consequences unmistakable: the dialog names the recording and states that audio, transcript and extracted steps are deleted, while diary entries already created are kept.
- Buttons: **Keep it** (safe default) and **Delete permanently** (red, with a spinner while deleting so it can't be double-tapped).
- Only one success message is shown (remove the duplicate toast from the hook so the page-level message is the single confirmation).

### 3. Check sibling delete paths
- Apply the same "remove from screen immediately + confirm first" rule to the other delete action on the page (discarding an unsaved quick-capture session), so behaviour is consistent.

## Verification
- Typecheck passes.
- Preview test: record a quick capture, save, delete it from the list, confirm the card disappears instantly and the confirmation dialog shows before anything is removed.
