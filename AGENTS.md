## Navigation architecture

- Use one fixed, safe-area-aware circular You-Are-Here dial from LaunchLayout as the single wider-app wayfinder; keep first-time onboarding linear to reduce cognitive load.
- Treat membership as an optional branch from the free snapshot; the canonical onboarding sequence is Account → About me → Questions → My snapshot → Home.
- Home presents one current priority plus Record and See my day; secondary destinations belong in the You-Are-Here dial.- Memory Bridge output choice (output_mode on meeting_recordings) is decided per recording and enforced in process-meeting-audio; why: one server path keeps transcript-only / actions-only / save-only consistent everywhere.
- Superseded page versions live in `src/pages/_archive/` (unrouted); old URLs redirect to current /launch pages — why: keep one live flow without losing earlier work.
- The launch assessment uses one versioned shared bank: everyday brain-health reflection first, user-owned planning preferences second; why: preserve a consistent free snapshot and stable calendar inputs without persona-dependent scoring.
