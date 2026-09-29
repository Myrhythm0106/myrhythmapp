# Memory Bridge: best-possible transcript + accurate actions as Table and List offerings (user can select as needed)

## Honest note

No transcription service is 100% perfect (accents, cross-talk, background noise). The goal is the most accurate transcript possible, clear flags where words were unclear, and a quick way for the user to correct it. Corrections then feed the action extraction, so the actions end up right.

## What the user will see

1. **"What would you like from this?"**: one simple choice (max 3 options, large buttons), set once in Settings and changeable per recording before or after saving:
  - **Transcript and actions** (default)
  - **Transcript only** (no actions extracted)
  - **Actions only** (transcript used behind the scenes to find actions, then not kept or shown; audio retention rules still apply)
  - A small "Just save the recording" link under the buttons: nothing is transcribed. The user can ask for a transcript or actions later with one tap.
   Traceability code and diary entry are created in every mode.
2. **Full transcript page** for every recording
  - Speakers named ("Speaker A / B", tap to rename to "Dr Patel", "Me").
  - Time stamps every paragraph; tap a line to play that moment.
  - Unclear words softly underlined so they can be checked.
  - "Fix a word" editing in place, with Save; the original stays in history (traceable).
  - Copy, download (.txt / PDF) and email.
3. **Actions shown two ways, with a simple toggle "Table | List"** (choice remembered)
  - Table: Action, Who (everyday RACI), Due date, Priority, Status — editable.
  - List: large-text checklist, one action per line with who and when underneath; easiest for low energy or phones.
  - Both views show the same actions; an edit in one appears in the other.
  - Each action links back to the transcript line it came from ("Where was this said?").
4. **Re-extract after corrections**: "Update my actions from the corrected transcript" button; keeps actions already confirmed.

## Technical details

- New `output_mode` on the recording (`none | transcript | actions | both`) and a user default in settings. `process-meeting-audio` skips transcription for `none`, skips extraction for `transcript`, and for `actions` deletes the transcript text after extraction but keeps the action source quotes. "Do it later" buttons call the same function again with the new mode.
- `process-meeting-audio`: AssemblyAI request currently sends only `speaker_labels: true`. Upgrade to best model and settings: `speech_model: "best"`, `language_detection` (or en_gb), `punctuate`, `format_text`, `disfluencies: false`, `keyterms_prompt` from user's Support Circle names/medications/appointment words, and store word-level confidence + utterances (speaker, start, end).
- Store utterances JSON and an edited-transcript version table/column (original kept) on the recording; migration with grants + RLS scoped to owner.
- Extraction (`extract-acts-incremental`) runs on edited transcript when present; each action stores source utterance time for the back-link. Uses Lovable AI Gateway default model with a stricter prompt (every commitment, who, when, verbatim quote).
- New `TranscriptView` component and `ActionsViewToggle` (Table/List) reused on Memory Bridge result and action review; preference saved per user locally.
- Whisper fallback path kept, flagged "lower accuracy — please review".

## Checks

- Test with a real 5-minute, two-speaker sample: speakers separated, low-confidence words flagged, edit saved, re-extract works, Table and List match, back-link plays correct moment, on phone width.