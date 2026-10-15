# Memory Bridge — one clear path to immediate value

## Aim
Make Memory Bridge feel indispensable through one calm, understandable journey—not more features or another cosmetic redesign. Preserve the professional visual standard of `/start` and the compact conversation library.

**Chosen direction:** Record → Save → Check my next steps → Add selected steps to my day.

## What the review confirmed
- Recording already has a prominent starting button, alongside Upload, My Records, microphone messages and More options.
- After stopping, the screen presents a conversation title, two people-related controls, four output choices and Save before the result.
- Opening a saved conversation exposes playback, transcript, next steps, deletion and output tools together.
- The review screen offers Table/List and multiple editable fields. It already requires approval before putting steps in the diary.

The opportunity is to reveal the right decision at the right moment. Professional appearance alone does not make the sequence self-explanatory.

## Proposed experience

### 1. One obvious place to begin
- Keep **Memory Bridge** prominent, with one short, concrete promise: **Keep the conversation. Check the next steps. Bring them into my day.**
- One primary orange button: **Start recording now**.
- Keep **Upload a recording or report** as a quiet secondary entry; reveal the existing upload choices only when selected.
- Keep **My conversations** below, with the existing search, month groups, paging and remembered disclosures. Remove the competing “My Records” label and duplicate shortcut where unnecessary.
- Place quick notes and extra tools behind one restrained disclosure. Keep allowance information readable but subordinate; microphone problems remain visible when they prevent recording.

### 2. Stopping should not create a wall of decisions
- Keep Stop and the explicit Save decision: no surprise upload or automatic processing on Stop.
- Show **My recording is ready to save**, its duration, optional title and one primary Save button.
- Display the currently selected output in one readable line with **Change** beside it; reveal the full chooser only on request. Preserve the person's existing output preference and make actions-only transcript retention clear before saving.
- Use plain button labels matching the selection: **Save and find my next steps**, **Save and write my transcript**, or **Save recording**.
- Keep Support Circle access visible as a quiet optional action; put its additional controls behind that action. Do not broaden permissions or send new notifications automatically.
- Keep discard separate and protected by its existing confirmation.

### 3. Make the useful result the next screen
- After saving, show an unambiguous saved/working/ready state—not several competing success messages or overlapping windows.
- When next steps are ready, lead with the conversation title and real next-step count. Show a short preview of the actual extracted steps, not invented conclusions or unverified claims about what was agreed.
- Continue directly into **Check my next steps**, presented as a calm list. Each item foregrounds its wording, inclusion choice and proposed date where available.
- Put owner, priority, people and other editing fields behind **Details** for that item. Keep the existing Table view available as an optional tool, not the default first encounter.
- Keep **Where this came from** optional and tied to the existing accurate, retention-aware original-word disclosure.
- No step reaches the diary until the person approves it. Missing dates stay visibly missing; suggestions must not look confirmed.
- Transcript-only, save-only and no-next-steps results have their own honest endings: read the transcript, open the saved recording, or optionally add a step. Never present zero steps as a failure.

### 4. Finish with visible value
- One approval button: **Add selected steps to my day**, with the selected count visible.
- After approval, show the actual number added and any items that could not be added. Only offer **See my day** as success when items were added; preserve retry access for failures.
- Open the relevant calendar day so the person can see what changed. Offer **Back to Memory Bridge** as the quiet alternative.
- Keep the existing You-Are-Here dial and profile placement; no new navigation system or compulsory tutorial.

### 5. Saved conversations stay calm
- Rows remain compact and closed unless the person has chosen otherwise.
- Opening a conversation foregrounds one appropriate action: check its next steps, read its transcript, or find next steps when requested.
- Playback and transcript remain easy to reach. Copy/email/download and deletion sit in secondary disclosures rather than competing with the useful next action.
- Derive status from confirmed available information. Do not imply a conversation is checked, scheduled or completed merely because extraction ran.

## Technical scope
- Presentation and interaction changes in LaunchMemoryBridge, CaptureHub, the shared review surface and conversation detail presentation, using existing design tokens and controls.
- Reuse existing capture, saving, output-mode, extraction, scheduling and action-origin contracts. No automatic Stop-to-upload change, schema migration, new AI summary generation, permission changes or retention changes.
- Keep any extracted presentation pieces small and focused; document the chosen progression in the project's architecture guidance during implementation.
- Preserve existing search limits: the library searches loaded title/reference metadata, not all transcripts or unlimited server history.

## Acceptance checks
- First encounter: a person can identify the starting action without opening Help or reading a feature list.
- Check the default record → stop → save → check → approve → calendar journey, plus all existing output choices, upload entry and reopening a saved conversation.
- Confirm titles/details are optional, preferences survive, and editing or changing output never loses captured audio.
- Test loading, extraction failure, no steps, missing dates, partial scheduling failure, microphone denial and exhausted allowance without dead ends or false success.
- Check empty and large sample libraries, desktop, Android-sized and 320px screens, keyboard access, 200% zoom, 56px primary targets and distinction without relying on colour.
- Verify the signed-in journey if access permits; otherwise explicitly distinguish sample-data interaction checks from real saving and scheduling checks.
- Recommend a short observed trial with an older person and someone with memory challenges before claiming this is proven easy to use.

## Not included
New features, a new landing page, a new navigation system, changing membership, automatic sharing, redesigned permissions, or unlimited-history search.