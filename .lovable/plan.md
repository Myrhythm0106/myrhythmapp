# Fix: "Save & Extract Actions" spins forever

## What we know

- Route `/launch/memory` uses `LaunchMemoryBridge.tsx` → `handleSave` → `useVoiceRecorder.saveRecording` → `processSavedRecording` → invokes edge function **`process-meeting-audio`** → polls `meeting_recordings.processing_status`.
- `meeting_recordings` has **no rows created today** (last row: 2026-07-20). So either the upload/insert is failing silently, or the edge function invoke is hanging with no meeting row ever reaching `completed`.
- `process-meeting-audio` returns **no edge function logs at all** — strong signal it is either not currently deployed, failing on boot, or the client call is not reaching it.
- Poll runs 60 × 2s = 2 min max before showing an error, so "spins forever" = long wait with no useful feedback.

## Root cause (most likely, to confirm)

`process-meeting-audio` edge function is not producing logs, so the invoke resolves with a network/boot error that the current code swallows loosely, then falls through to `pollForCompletion`, which spins for 2 minutes because the row status never changes.

## Fix plan

### 1. Instrument and surface real errors (frontend)
- In `src/utils/processSavedRecording.ts`:
  - When `supabase.functions.invoke('process-meeting-audio', …)` returns an error OR `data?.success === false`, stop the flow immediately: mark the `meeting_recordings` row as `failed` with the real error, show a toast with the actual message, and return `{ success: false }` — do NOT enter `pollForCompletion`.
  - Reduce hang: shorten `pollForCompletion` timeout from 120s to 45s and surface the last known `processing_status` in the error toast.
- In `src/pages/launch/LaunchMemoryBridge.tsx` `handleSave`:
  - Wrap in `try/finally` so `setIsExtracting(false)` always runs (today it only clears on the happy path or when `saved` is falsy — an exception mid-flow leaves the button spinning).
  - On `result.success === false`, show a clear toast and reset UI state.

### 2. Verify `process-meeting-audio` deployment
- Re-check `supabase/config.toml` entry and re-deploy the function (its current `verify_jwt = true` combined with `functions.invoke` from an authed session should be fine — no change needed unless deployment is stale).
- After redeploy, tail edge-function logs; the boot log `🚀 Starting process-meeting-audio function` should appear on the next click.

### 3. Confirm required secrets are wired to the deployed function
- `OPENAI_API_KEY`, `ASSEMBLYAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` are all present in the project. The function's early check returns 400 if `OPENAI_API_KEY` is missing — with the fix in step 1 that 400 will now surface as a visible toast instead of a silent spinner.

### 4. Validate end-to-end
- Record a short (~15s) memory, tap Save & Extract:
  - Expected happy path: toast "Recording saved" → toast "Processing complete!" → Post-Extraction dialog OR celebration.
  - Expected failure path (if edge function still errors): visible toast with the real reason within a few seconds — no infinite spinner.
- Cross-check `meeting_recordings` row appears with `processing_status = completed` (or `failed` + `processing_error`).

## Files touched

- `src/utils/processSavedRecording.ts` — hard-fail on invoke error, shorter poll, better error propagation.
- `src/pages/launch/LaunchMemoryBridge.tsx` — `try/finally` around `handleSave`, guaranteed spinner reset, toast on failure.
- `supabase/functions/process-meeting-audio/index.ts` — no code change; redeploy to confirm boot logs appear. (If the redeploy log shows a boot error, we address it as a follow-up in the same turn.)

## Out of scope

- Changing recorder UI, extraction quality, or Support-Circle wiring.
- MyRHYTHM-G, calendar, or any unrelated launch surfaces.
