## Navigation architecture

- Use LaunchNav plus one safe-area-aware circular You-Are-Here dial from LaunchLayout as the only app navigation system; keep first-time onboarding linear to reduce cognitive load.
- Treat membership as an optional branch from the free snapshot; the canonical onboarding sequence is light Account (name, email, password) → Questions → My snapshot → optional Make it yours → Home; why: value before fuller details.
- Landing buttons derive from `getEntryState` (new / returning / needsQuestions / hasSnapshot / member) in `entryRoute.ts`; why: labels must promise exactly where they lead, and returning visitors see Sign in, not sign-up.
- Home presents one current priority plus Record and See my day; secondary destinations belong in the You-Are-Here dial.
- Calendar vision-focus disclosure, confirmed vision relationships and event priority highlights are user-scoped device-local presentation state; why: keep vision direction distinct from everyday priorities without changing schedules or promising cloud sync.
- Memory Bridge output choice (output_mode on meeting_recordings) is decided per recording and enforced in process-meeting-audio; why: one server path keeps transcript-only / actions-only / save-only consistent everywhere.
- Superseded page versions live in `src/pages/_archive/` (unrouted); old URLs redirect to current /launch pages — why: keep one live flow without losing earlier work.
- The launch assessment uses one versioned shared bank with every question tagged `tier` (quick = YES parts, full = MYRHYTHM letters); `?mode=full` runs the Full Picture on top of saved Quick answers and scores count answered items only; why: one bank keeps the free snapshot, history and calendar inputs consistent across both depths.
- Welcome starting style and explicit walkthrough progress use one user-scoped device-local store, shared by welcome, the existing map and LaunchLayout; why: support can be switched without changing assessment depth, membership or inferring completion from saved rows.
