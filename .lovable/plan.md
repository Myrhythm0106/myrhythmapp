# Premium Capture Deliverable — Plan v23

Turn the post-recording experience into a Deloitte-grade briefing pack the user can download as **PDF**, **DOCX** (opens in Google Docs), or **XLSX** (opens in Google Sheets), with a clean toggle for **Actions only / Transcript only / Full pack**.

## 1. Scope

- Keep marketing `/launch/capture` untouched.
- Upgrade the authenticated post-recording surface — `MemoryBridgeResultsModal` + a new full-screen `CaptureDeliverableView` at `/launch/memory-bridge/result/:meetingId`.
- Google Drive sync is **deferred** (follow-up). Today we ship local downloads only — files open natively in Google Docs/Sheets via upload.

## 2. The deliverable (default shape)

A single branded "Capture Brief" with five sections, each independently includable in the export:

1. **Cover + 1-page Executive Summary** — context, date, participants, decisions, owners, risks, confidentiality footer (per Document Confidentiality Standard memory).
2. **Action Register** — owner, due, priority, energy badge, confidence %, source quote.
3. **Decisions & Themes** — synthesized decision log + recurring themes.
4. **Open Questions** — unresolved items needing follow-up.
5. **Annotated Transcript** — speaker turns, timestamps, action markers highlighted.

Medical disclaimer line on every page footer (per Medical Disclaimer Policy memory).

## 3. Results screen UX

Replace the current modal body with a two-pane layout:

```text
┌─────────────────────────────────────────────────────────┐
│  Capture Brief · [Meeting title]      [✕]               │
├──────────────┬──────────────────────────────────────────┤
│ Include:     │   Live preview of the brief              │
│ ☑ Summary    │   (renders the selected sections)        │
│ ☑ Actions    │                                          │
│ ☑ Decisions  │                                          │
│ ☑ Questions  │                                          │
│ ☐ Transcript │                                          │
│              │                                          │
│ Quick mode:  │                                          │
│ ◉ Full pack  │                                          │
│ ○ Actions    │                                          │
│ ○ Transcript │                                          │
├──────────────┴──────────────────────────────────────────┤
│  [ Download PDF ]  [ Download .docx ]  [ Download .xlsx]│
│                              [ Schedule actions →  ]    │
└─────────────────────────────────────────────────────────┘
```

- Quick-mode radios are shortcuts that flip the checkboxes.
- Live preview re-renders instantly as toggles change — feels Linear-fast.
- Primary CTA stays orange-500; secondary download buttons are glass-morphism per design memory.

## 4. Export engines (client-side, no new edge function needed v1)

| Format | Library | Output |
|---|---|---|
| **PDF** | `@react-pdf/renderer` (already common in stack) | Branded multi-page PDF, identical to preview |
| **DOCX** | `docx` (npm) | Native Word doc; opens cleanly in Google Docs after upload |
| **XLSX** | `exceljs` | Multi-sheet workbook: `Summary`, `Actions`, `Decisions`, `Questions`, `Transcript` |

All three share one normalized `CaptureBriefModel` so a section toggled off in the UI is also absent from every export.

Typography: Inter for body, IBM Plex Serif for headings — consultancy register. Brand-orange accent rule across cover and section dividers. Footer on every page: `MyRhythm · Confidential — Not medical advice. v0.1 Founding Edition.`

## 5. Data model

No DB migration required. Builds entirely from existing tables:

- `meeting_recordings` (transcript, confidence, participants, dates)
- `extracted_actions` (owner, priority, due, confidence, source quote, context)

A new client-side adapter `buildCaptureBrief(meetingId)` fetches both, runs light synthesis:
- **Decisions** = extracted_actions where `category = 'decision'` OR action_text matches decision verbs.
- **Themes** = top-N noun phrases (simple frequency, no LLM call needed for v1).
- **Open questions** = transcript sentences ending in `?` not already resolved by an action.

If we later want LLM-quality synthesis, the adapter has a single seam to call an edge function — out of scope for this build.

## 6. File layout

```text
src/components/memoryBridge/capture-brief/
  CaptureDeliverableView.tsx        ← full-screen result page
  CaptureBriefPreview.tsx            ← live preview pane
  CaptureBriefToggles.tsx            ← left pane controls
  exporters/
    pdf.tsx                          ← @react-pdf/renderer document
    docx.ts                          ← docx builder
    xlsx.ts                          ← exceljs builder
  model/
    buildCaptureBrief.ts             ← adapter (DB → CaptureBriefModel)
    types.ts                         ← CaptureBriefModel, SectionKey
    synthesize.ts                    ← decisions/themes/questions extraction
src/pages/launch/LaunchCaptureResult.tsx   ← route wrapper
```

`MemoryBridgeResultsModal` gains a primary CTA **"Open Capture Brief →"** that routes to the new view; the modal stays as the quick-glance summary.

## 7. Out of scope (explicit)

- Per-user Google OAuth + Drive push (planned follow-up).
- LLM-based theme/decision synthesis (current heuristics are good enough for v1).
- Editable rich-text brief inside the app (export is the editing surface — open the .docx in Docs).
- New tables, RLS changes, edge functions.

## 8. Acceptance criteria

- Toggles update preview in < 100ms.
- Three downloads succeed offline (pure client export).
- DOCX opens in Google Docs without layout breakage; XLSX opens in Google Sheets with frozen header rows and filter on the Actions sheet.
- PDF passes visual QA: cover page, no clipped text, footer on every page, action table fits portrait A4.
- "Actions only" quick mode produces a 1–2 page PDF and a single-sheet XLSX.
- Disclaimer + confidentiality footer present in every export.

## 9. Technical notes

- Install: `bun add docx exceljs @react-pdf/renderer file-saver`.
- All exports run in browser; no server round-trip → instant downloads, no edge cost.
- Color tokens via existing semantic tokens (brand-orange-500, etc.) — no hex literals in components.
- Lazy-load the three exporter modules so the result page stays light.

---

Approve to build, or tell me what to change (e.g., swap library, drop a section, add OAuth Drive push now).