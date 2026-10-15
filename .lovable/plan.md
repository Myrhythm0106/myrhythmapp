# Memory Bridge — a professional, conversation-led working brief

## Direction
Combine your two preferred approaches: **a professional working brief** and **a conversation-led workspace**. Match `/start`’s polish and visual character, but make Memory Bridge a useful working page—not another landing page.

Keep the existing features. Change their presentation and hierarchy so recording is immediately obvious, the latest conversation is easy to return to, and its next steps feel worth acting on.

## What the review confirmed
- Memory Bridge currently has a page heading plus a separate centred hub with another heading and brand mark.
- The hub uses a narrow, heavily rounded card, decorative glows, small allowance text and several competing controls.
- Recent recordings appear in the hub, while a full My Records list appears farther down the page.
- Recording, review and records use different presentation patterns from `/start` and from one another.

These are presentation findings, not proof that every recording or saving flow works correctly.

## Proposed layout

### 1. One clear page introduction
- One **Memory Bridge** title with short, practical supporting text.
- Use `/start`’s existing typography, warm light surfaces, deep ink, teal and restrained gold details.
- Remove the duplicate brand mark, large enclosing card and decorative blurred glows. Use an open, spacious layout with subtle section dividers.
- Keep the shared header, circular **Where to?** dial, profile and permanent microphone unchanged.

### 2. Recording first, without a questionnaire
- Make **Start recording now** the single dominant brand-orange action.
- Keep recording time remaining legible nearby, without repeating the same allowance in multiple places.
- Show microphone problems beside the action, with a clear recovery option.
- Keep **Upload** and **My Records** as the two secondary entry choices. Place **Quick Note** inside a clearly labelled additional-options disclosure.
- Preserve audio/video upload and the existing report-import feature; distinguish their labels so users know what each accepts.
- Recording starts through the existing handler. Optional capture details stay after recording.

### 3. Give the latest conversation meaningful space
Below the recording area, show a **Latest conversation** brief using actual saved information:
- Title, date, duration and existing source reference where available.
- A clear way to listen again and open the saved write-up or next steps.
- Show available processing/status information honestly: do not invent a summary, action, completion state or personalised insight.
- If next steps exist, make **Check my next steps** the clear route to the existing review experience.
- With no recordings, show a calm invitation to capture an appointment, conversation or idea—not fabricated records or a blank panel.

### 4. A coherent records area
- Present the records list as a clean, scannable continuation of the page, rather than another competing hub.
- Use strong titles, readable dates, consistent status labels and familiar play icons.
- Keep playback, transcripts, action extraction, output choices, retention information and deletion controls accessible.
- Avoid repeating the same recent records in multiple decorative strips. The **My Records** control must lead clearly to the records area.
- Distinguish labels from saved answers through placement and weight, not colour alone.

### 5. Carry the same standard through recording and saving
- Apply the same typography, controls and spacing to recording, paused and post-recording review states.
- Keep timer, microphone level, Pause/Continue/Stop, processing feedback, output choices, Save and recovery messages clear.
- Preserve Support Circle notification controls and existing permission behaviour; make no new access promises.
- Keep delete/discard confirmations and existing safety behaviour unchanged.
- Retain the non-medical disclaimer. Move lengthy explanatory copy out of the main working area.

## Accessibility and ease
- At most three prominent entry choices; reveal secondary tools progressively.
- At least 56px primary touch targets, comfortable text size and high contrast.
- Layout must work on phones, Android devices and desktop without horizontal scrolling or overlapping the permanent controls.
- Keyboard access, visible focus, clear loading/error states and reduced-motion support.
- Use quiet status cues rather than decorative pulses or alarm-like visual noise.

## Technical scope
- Main work: `src/components/memoryBridge/CaptureHub.tsx` and the presentation sections of `src/pages/launch/LaunchMemoryBridge.tsx`.
- Extract small, Launch-prefixed presentation components if needed; keep existing recording, processing, saving and record-opening handlers intact.
- Reuse semantic design tokens and existing design-system buttons. Do not restyle shared components globally or change `/start`.
- Reuse existing recording/action data. No new AI generation, tables, permissions, payment rules or navigation system.
- Supporting dialogs receive only the styling changes needed for continuity; avoid expanding this into a redesign of the whole app.

## Checks before completion
1. Compare Memory Bridge against `/start` visually: one app, not two unrelated styles.
2. Check phone and desktop layouts, long record titles, larger text, keyboard use and greyscale readability.
3. Exercise start → pause/resume → stop → optional details → save → reopen the saved recording → check next steps, where authenticated access is available.
4. Check uploads, quick notes, records navigation, microphone errors, allowance limits and delete/discard dialogs for regressions.
5. Check the latest build/error reports. If signed-in testing remains unavailable, state that limitation explicitly rather than claiming the saved-account journey passed.

**Result:** recording remains fast, saved conversations become useful working briefs, and every state feels professional and congruent with `/start`.