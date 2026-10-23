# Downloadable test plan + Smartwatch capture (phase 1)

## 0. New core principle: friction-free
Saved as a permanent rule for MyRhythm, applying to every feature and not just the watch: **every flow must be friction-free.** That means the fewest possible taps, no unnecessary questions, sensible defaults, nothing to remember, one calm confirmation at most, always undoable, and never a dead end. Any new screen that adds a step must justify it or remove it. Test 10 checks this.

## 0b. The output of every conversation (watch or phone)
Every recording produces one elegant **Conversation Summary**, shown in the app and sent by email:

1. **Key summary:** 3 to 5 plain-language points about what was discussed and decided, with the date, who was there and its reference code.
2. **Actions table, laid out like a clean spreadsheet:**

| # | Action | Owner | Start | Due | Priority | Status | Schedule |
|---|---|---|---|---|---|---|---|

   - Owner, dates and priority can be edited straight in the table.
   - **Download as Excel (.xlsx)**, nicely formatted in MyRhythm colours with a frozen header and the same columns, ready to filter.
3. **Schedule into my diary:** "Put them in my day" places every action in one tap, following the saved control choice, or you can schedule each row on its own. Undo is always there.
4. **Send to owners and Support Circle:**
   - Each owner gets an email with only their actions and an Add to calendar link.
   - Support Circle members get the summary only if their permission allows. Nothing outside their permission is ever sent.
   - One "Send" button, with checkboxes already ticked for the people who should get it.
5. **The email itself** carries the key summary, the actions table built into the email (not just an attachment), the Excel file attached, and "Add to my calendar" links.

## 1. Downloadable test plan (made accurate first)
- **Before the PDF, correct the test wording so it matches the real app:**
  - Test 1 step 8: replace "Prove it now" with the real section, "What can't I afford to forget this week?".
  - Test 2 step 3: use the real name of the save-and-extract button in Memory Bridge.
  - Test 5: produce the review list (30 #IChoose statements plus every 3-week plan line) as its own downloadable file, so the test can actually be done.
  - Test 0 stays as it is. You approve the two database changes in chat.
- Turn the corrected plan into a printable **PDF in MyRhythm colours**, with tick boxes, date lines and notes space. Save it to your Files so you can download it straight from chat.
- Check every page as an image before handing it over.
- Also add a **Download testing plan** link in the app, on the Help page for signed-in users.
- The watch test (Test 9) is added only once the watch route below is built, and the PDF is then reissued as version 2.

## 2. Smartwatch capture, phase 1 (watch voice memo into MyRhythm)
Works with Apple Watch and most Android watches, with no store app needed.

How it works:
1. Record on the watch: Voice Memos on Apple Watch, or Recorder on Android watches.
2. The recording copies to the phone by itself.
3. Get it into MyRhythm:
   - Android: Share, then MyRhythm.
   - iPhone: Share, then Save to Files, then Memory Bridge, then Upload.
4. MyRhythm writes up the conversation and extracts the next steps, then offers times. Nothing is scheduled until you confirm.
5. The summary is emailed to you automatically.

What I'll build:
- Make sure Memory Bridge upload accepts watch formats (.m4a, .aac, .amr, .wav) and labels them "From my watch".
- Android: let MyRhythm appear in the phone's Share list for audio, opening Memory Bridge with the file ready to process.
- An optional "Email me the summary when it's ready" setting, on by default for watch uploads, using your existing email sending.
- Straight after extraction, show "Schedule these now" with time chips, following your saved control choice.
- A short "Use MyRhythm from your watch" guide in Help, for iPhone and Android.
- Add a watch test (Test 9) to the testing plan and the PDF.

## 3. Watch and phone together: effortless for a tired or injured brain
The standard: **record in one tap, then MyRhythm does the thinking.** No settings to choose, no forms, nothing to remember.

- **One tap to record on either device.** On the phone, the home-screen "Record" shortcut and the Memory Bridge record button start straight away. On the watch, use the built-in recorder.
- **No decisions after recording.** Watch and phone recordings both process automatically with sensible defaults: write-up, next steps and an email summary. Changing options is possible but never required.
- **It recognises watch recordings.** Files from the watch are labelled "From my watch", given a title such as "Conversation, Tue 2:15pm", and processed with no questions asked.
- **One calm confirmation screen.** "I found 3 next steps. Put them in my day?", with **Yes, place them** and **Let me check first**. Steps go where your saved control choice says, and every placement can be undone.
- **Gentle progress, never silence.** Plain status updates ("Saved. Writing it up. Next steps ready."), with a notification when it's done, so nobody has to wait watching the screen.
- **Nothing is ever lost.** If the phone is offline or the app is closed, the recording waits and processes once you're back. A failure says what happened and offers one retry button.
- **Reminders reach the wrist.** Scheduled steps go to the phone calendar with alerts, so the watch shows them too. No extra setup.
- **Brain-injury guardrails:** big targets, short words, at most 3 choices per screen, no red error walls, no time pressure, and a gentle-day setting that limits the confirmation to 1 step.

## 4. Tests added once this is built
- **Test 9, watch to day:** record on the watch, share or upload it, and check it's written up, emailed, and its steps are offered and placed within 5 minutes, with at most 3 taps on the phone.
- **Test 10, phone one-tap:** start from the home-screen Record shortcut, record, and confirm "Yes, place them". Pass: at most 3 taps in total, and no screen asks a question you don't understand.

## 5. Friction-free target (the rule every screen is checked against)
- **Watch:** 1 tap to start recording and 1 tap to stop. Nothing else on the wrist.
- **Getting it to MyRhythm:**
  - **iPhone:** a ready-made **"Send to MyRhythm" Apple Shortcut**, built in this phase. It runs from the watch or the phone's Share sheet and sends the recording straight in, with no Files step and no upload screen. Setup is one tap from a link in Help.
  - **Android:** Share, then MyRhythm, and it starts processing by itself.
- **After that:** zero taps until the single "Put them in my day?" confirmation. Anyone who chose "just place them" in the questions gets their steps placed automatically, with Undo.
- **Never asked twice:** sign-in is remembered on the phone, and default options are never shown unless asked for.

Later phase (not in this plan): a true native watch app with a record button on the wrist and no phone step at all.

## Technical details
- PDF built from `docs/founder-testing-plan.md` and saved to `/mnt/documents/MyRhythm-Founder-Testing-Plan.pdf`, with a copy in `public/downloads/` for the in-app link.
- Add `share_target` (POST, multipart, `audio/*`) to `public/manifest.webmanifest`. A small route will receive the shared file and hand it to the existing upload path. This needs an installed web app on Android.
- Widen the accepted audio types in the existing upload helper. Processing stays in the existing process-meeting-audio path.
- The summary email uses the existing send-email function, triggered when processing completes. The setting is stored per user.
- Apple Shortcut: it posts the audio to a new authenticated upload endpoint using a personal upload token from Settings, and the token can be revoked.
- Add the tasks to roadmap.md.
