# Fix: "Save & Extract Actions" silently blocked

## What actually happened (confirmed from your console)

At 17:01 today, twice in a row:

```text
handleSave: blocked — no authenticated user
```

So the recording itself was fine — the save handler refused to run because the page thought nobody was signed in. Your earlier logs show you *were* signed in (11:00), and at 12:19 the tab lost its connection and sat idle for ~5 hours. A Supabase access token lasts an hour; a tab left open/backgrounded that long can end up with an expired session that the page never re-established. The save button then reads `user === null` from React state and stops.

Two problems with that behaviour:

1. It trusts a stale in-memory value instead of asking Supabase for the real session (which can usually be refreshed silently from the stored refresh token).
2. Even when the session genuinely is gone, the flow dead-ends — a red toast, no way back, and no clear promise that the recording is safe.

## The fix

1. **Ask Supabase, don't trust React state.** Before blocking, call `getSession()` and, if the token is expired, `refreshSession()`. In the common case this succeeds instantly and the save just works — no visible interruption.

2. **When the session really is gone, don't lose the recording.** The audio is already parked in IndexedDB, so: keep it, tell you plainly ("Your session timed out — your recording is safe. Sign in and it will pick up where it left off."), and offer a sign-in action that returns to Memory Bridge with the recording restored and the save ready to retry.

3. **Auto-resume after sign-in.** On mount, if a pending recording exists and a valid session is present, restore it into the review screen (already happens) and surface a clear "Save & extract" retry rather than a fresh empty recorder.

4. **Keep the session alive while the page is open.** Refresh the session when the tab becomes visible again and periodically while a recording is in progress, so a long capture (up to 4 hours) never ends on an expired token.

5. **Same guard on the extraction path.** `processSavedRecording` takes a `userId` and queries with it; if the session dies mid-processing, surface a specific message ("session expired during extraction — sign in and tap Extract actions on the recording") instead of a generic failure, and leave the saved recording extractable from Recent Recordings.

## Verify

- With an expired token: tap Save — session refreshes silently and the recording uploads and extracts.
- With a fully revoked session: tap Save — clear message, recording preserved, sign in, return, save succeeds.
- Leave the tab idle 90 minutes, then record and save: works without re-login.

## Technical notes

- `src/pages/launch/LaunchMemoryBridge.tsx`: replace the `if (!user)` early return with an async `ensureSession()` helper; add visibility-change and in-recording refresh; pass the freshly resolved user id into `processSavedRecording`.
- New small helper (e.g. `src/utils/ensureSession.ts`) wrapping `supabase.auth.getSession()` + `refreshSession()` so other surfaces (calendar commit, scheduling) can use the same guard later.
- No database, edge function, or extraction-logic changes in this pass. If saving then succeeds but extraction still returns nothing, that becomes a separate follow-up against the `process-meeting-audio` / `extract-acts-incremental` pipeline.
