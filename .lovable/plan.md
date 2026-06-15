## Plan v37 — adds optional user-named captures on top of v36

Everything in v36 stands (short IDs `CAP-0042` etc., fuzzy global search, OneTapCapture, templates, PLAUD memo, lazy CalendarPage build fix). This revision adds one user-facing change.

### New: optional capture naming

The `short_id` is the unique identifier. The **title** is an optional human-friendly label — never required, never blocks saving.

**Flow after a one-tap recording stops:**

1. Card appears immediately with the auto-assigned `CAP-0043` chip and a default title (`"Capture · 28 Apr 2026 · 14:32"`).
2. Title is rendered as an inline-editable text field (click/tap to edit, blur to save, Enter to confirm, Esc to cancel). Placeholder: *"Name this capture (optional)"*.
3. Empty title is allowed — the default timestamp title stays.
4. A small `CAP-0043` chip sits next to the title at all times, copyable.

**Where it appears:**
- `OneTapCapture` post-recording confirmation card.
- `LaunchCapture` recording list rows (inline rename via pencil icon).
- Capture detail / review screen header.

**Search impact:** the user-typed title flows into the existing FTS + trigram indexes on `voice_recordings.title` (already covered by v36 migration — no schema change). So "neurologist april" finds it whether the user named it that or just spoke about it.

**Why titles aren't unique:** two captures can both be called "Clinic visit". The `short_id` (`CAP-0043` vs `CAP-0061`) is the unique handle; the title is just a memory aid.

### Files touched (frontend only, additive)

- `src/components/capture/OneTapCapture.tsx` — adds inline title editor + chip in the confirmation card.
- `src/components/capture/CaptureTitleEditor.tsx` *(new)* — small controlled input, autosaves to `voice_recordings.title` via existing supabase client.
- `src/components/capture/CaptureListRow.tsx` or equivalent — inline rename action.
- `src/components/extracted-actions/ExtractedActionsReview.tsx` — show parent capture title + `CAP-####` chip.

### No new backend work

The v36 migration already gave `voice_recordings` a `short_id`, a trigram index on `title || description`, and full coverage in `global_search`. Nothing else needed.

### Build-fix note

The OOM during `build:dev` is the same Vite chunking failure the v36 plan addresses — the static+dynamic import of `CalendarPage` was already changed to `React.lazy()` in `src/pages/Dashboard.tsx` during the v36 build phase. If the next build still OOMs after that fix lands, I'll investigate separately (likely circular import or a fresh duplicate static/dynamic pair surfaced by the lazy split).
