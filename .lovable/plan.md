# Make `/launch/landingpage` show the /mvp story

The user is on `/launch/landingpage`, but no such route is registered in `src/App.tsx` — it currently falls through to the catch-all. `/launch` already renders `MVPCore4C` (the /mvp story) via `LaunchLanding.tsx`, so we just need the same content at `/launch/landingpage`.

## Change

In `src/App.tsx`, add one route alongside the existing `/launch` route:

```tsx
<Route path="/launch/landingpage" element={<LaunchModeProvider><LaunchLanding /></LaunchModeProvider>} />
```

That's it — `LaunchLanding` already returns `<MVPCore4C />`, so `/launch/landingpage` will render the same /mvp story page (with the hero email capture, "How MyRhythm answers that" numbered strip, 4C cards, founder story, and final CTA), and authed users still get redirected to `/launch/home` via `MVPCore4C`'s internal redirect.

## Out of scope

No changes to `MVPCore4C`, `LaunchLanding`, or any downstream pages. No new components. No styling changes.

## Files touched

- `src/App.tsx` — add one route line.
