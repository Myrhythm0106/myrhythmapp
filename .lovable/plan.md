## Plan v36 — PLAUD Capture Upgrade + Simple IDs + Intuitive Search + Build Fix

Building on v35. The key addition: search is **fragment-friendly**, not ID-only. A user who only remembers "that thing about the neurologist" must find it.

---

### 1. The ID scheme (unchanged from v35, kept simple)

Format **`TYPE-NNNN`** per user. Shown as a small muted chip next to every title; copyable; never the only way to find something.

| Artefact | Prefix | Example |
|---|---|---|
| Capture | `CAP` | `CAP-0042` |
| Action | `ACT` | `ACT-0117` |
| Goal | `GOL` | `GOL-0007` |
| Priority | `PRI` | `PRI-0021` |
| Vision item | `VIS` | `VIS-0003` |
| Support member | `SUP` | `SUP-0009` |
| Calendar event | `EVT` | `EVT-0088` |

---

### 2. Intuitive global search — the heart of this plan

One search bar, top of `/launch/today`, also openable anywhere with `⌘K` / long-press. The user types **anything they remember** — a word, half a word, a person's name, a feeling, a date phrase, or an ID.

**What it searches across (per user, RLS-scoped):**

| Source | Fields indexed |
|---|---|
| `voice_recordings` | title, transcript, tags, short_id |
| `extracted_actions` | title, description, notes, template_output text, short_id |
| `goals` / `priorities` / `annual_priorities` | title, description, short_id |
| `support_circle_members` | name, role, notes, short_id |
| `calendar_events` | title, description, location, short_id |
| `notes`, `memory_entries`, `gratitude_entries` | content, short_id |
| `empowerment_statements` | text |

**How "smallest detail remembered" is handled:**

1. **Postgres full-text search** (`tsvector` + GIN index) on each source — handles word stems ("neurolog" finds "neurologist", "neurological").
2. **Trigram fuzzy match** (`pg_trgm` + GIN index) on the same fields — handles typos and partial words ("nurolgst" still finds it).
3. **ILIKE substring fallback** for very short fragments (2–3 chars).
4. Results merged, ranked by: exact ID match → FTS rank → trigram similarity → recency.
5. Each hit shows: type icon, **short_id chip**, title, a **snippet with the matched word highlighted**, and date. Click → opens the item.

**Natural-language shortcuts** (regex-detected, no LLM call):
- `yesterday`, `last week`, `april` → date filter
- `with sarah` → matches captures/events linked to a support member named Sarah
- `#clinic` → tag filter
- `CAP-0042` → direct jump

**No LLM** in the search path — fast, free, deterministic. (Ask-over-captures stays deferred to a later plan.)

---

### 3. Implementation — backend

**Single migration:**

1. `CREATE EXTENSION IF NOT EXISTS pg_trgm;` (unaccent already standard)
2. Counters table + `next_short_id(user, prefix)` function + grants + RLS (as in v35).
3. `short_id text` column + unique `(user_id, short_id)` + BEFORE INSERT trigger on the 7 tables listed above.
4. Backfill existing rows ordered by `created_at`.
5. Add `search_tsv tsvector` generated column on each searchable table, plus GIN indexes on `search_tsv` AND on the concatenated text using `gin_trgm_ops`.
6. **One security-definer RPC** `public.global_search(_q text, _limit int default 30)` — runs the union query across all sources for `auth.uid()`, returns `(source, short_id, title, snippet, rank, updated_at, deeplink_path)`. Marked `STABLE`, `SECURITY DEFINER`, `SET search_path = public`.

---

### 4. Implementation — frontend

**New:**
- `src/components/ui/ShortIdChip.tsx`
- `src/components/search/GlobalSearchBar.tsx` (input + ⌘K)
- `src/components/search/GlobalSearchResults.tsx` (grouped by type, highlighted snippets, keyboard nav)
- `src/hooks/useGlobalSearch.ts` (debounced 200ms, calls `global_search` RPC)
- `src/components/capture/OneTapCapture.tsx`
- `src/components/capture/TemplateChips.tsx`
- `src/lib/capture/captureTemplates.ts`

**Edited:**
- `src/pages/Dashboard.tsx` — lazy `CalendarPage` (build fix)
- `src/pages/launch/LaunchDashboardLegacy.tsx` — mount `GlobalSearchBar` + `OneTapCapture`
- `src/pages/launch/LaunchCapture.tsx` — template chips + OneTapCapture
- `src/components/extracted-actions/ExtractedActionsReview.tsx` — show `ACT-####` chip + template summary card
- A small set of list/detail components to render `<ShortIdChip>` next to titles

**Edge function edited:**
- `supabase/functions/extract-acts-incremental/index.ts` — accepts `template` field, branches prompt + output schema, stores structured result in `extracted_actions.metadata.template_output`

**Memo (artefact):**
- `/mnt/documents/MyRhythm_PLAUD_Lessons_v1.pdf` + `.docx`

---

### 5. What the founder experiences

- Press the big orange button → speak → release → card appears: **CAP-0043 · "Clinic visit recap"** with extracted **ACT-0118**, **ACT-0119**.
- Forget the ID, remember only "the thing about sleep" → type `slep` in the top bar → fuzzy match returns CAP-0043 with "**sleep**" highlighted in the snippet.
- Type `with mum last week` → returns events and captures linked to support member "Mum" in the last 7 days.
- Type `CAP-0043` → jumps directly.

---

### 6. Out of scope (deferred)

LLM Ask-over-captures (needs more real data), mind-map export, per-capture export menu, multi-language stemming beyond English, Algolia (Postgres FTS + trigram is enough for the Founding Edition data volume — revisit only if search latency exceeds 300ms at scale).
