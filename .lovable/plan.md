# Downloadable test plan + Smartwatch capture (phase 1)

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

Later phases (not in this plan): a one-tap Apple Shortcut, then a true native watch app.

## Technical details
- PDF built from `docs/founder-testing-plan.md` and saved to `/mnt/documents/MyRhythm-Founder-Testing-Plan.pdf`, with a copy in `public/downloads/` for the in-app link.
- Add `share_target` (POST, multipart, `audio/*`) to `public/manifest.webmanifest`. A small route will receive the shared file and hand it to the existing upload path. This needs an installed web app on Android.
- Widen the accepted audio types in the existing upload helper. Processing stays in the existing process-meeting-audio path.
- The summary email uses the existing send-email function, triggered when processing completes. The setting is stored per user.
- Add the tasks to roadmap.md.
