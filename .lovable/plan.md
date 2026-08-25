# Capture → Actions → Calendar: honest status and the gaps to close

Short answer: the loop works end-to-end, but three real gaps stop it from being "perfect".

## What is working today (verified in code)

- **Record** a conversation in Memory Bridge, saved and transcribed, actions extracted.
- **Import a document** (discharge summary, letter, notes: PDF, DOCX, TXT, MD, CSV, PNG/JPG) and pull actions from it.
- **Amend** actions: text, priority, start date, end date and due-in are editable inline in the Next Step Summary table.
- **Schedule** actions: a single shared path writes the calendar event, the reminder ladder, the invitations and updates the action record — same behaviour for one action or all of them.
- **Support Circle**: people with calendar permission get an invite email, watchers get a light notice; ad-hoc email guests can be looped in.
- **Reminders**: ladder nudges show on Day, Week and Month calendar views with a bell marker, and push notifications go out on schedule.

## The three gaps

1. **No audio/video file upload.** You can only record live in the app. A voice memo recorded on your phone, or a Zoom/Teams recording, cannot be dropped in. Documents can be uploaded; audio cannot.
2. **Scheduled actions land in the calendar as "manual".** The event is created without a provenance marker, so the calendar cannot tell you "this came from Tuesday's clinic conversation", and there is no link back to the recording from the calendar entry.
3. **No end time or end date on the calendar entry.** The action carries a finish date, but the calendar event only stores the start date and time, so multi-day or timed-duration actions appear as a single point with no duration.

## What I propose to build

### 1. Upload audio or video into Memory Bridge
Add an "Upload a recording" option alongside the record button, accepting common audio and video formats (m4a, mp3, wav, webm, mp4, mov). The file goes into the same storage bucket and through the same transcription and extraction pipeline as a live recording, with the same allowance rules applied by the file's duration. Progress and errors surface the same way as live capture.

### 2. Show where a calendar entry came from
Stamp events created from Memory Bridge with `source: 'memory_bridge'` and keep the originating action reference. In the calendar, that becomes a quiet marker on the entry, and tapping through opens the action in the Next Step Summary so you can see the source quote and notes.

### 3. Carry start and end properly onto the calendar
Write the end time on the event, and where an action has a finish date, show it as a "due" marker on the calendar for that day rather than duplicating the entry.

## Technical notes

- Upload: new file input in the recorder surface, reuse the existing voice-recordings storage path and `process-meeting-audio` invocation; duration read client-side to charge the allowance correctly before upload.
- Provenance: `commitAction` in `capture-brief/model/commitActions.ts` sets `source` and stores the action id; `useLaunchCalendarEvents` already selects `source`, so the views only need the marker and tap-through.
- Duration: add `end_time` on insert in `commitAction`, derived from a default action length, and render the finish date as a due marker in Day/Week/Month views.
- No schema change is needed for provenance or end time; a nullable column linking an event back to its extracted action is the only migration required.
