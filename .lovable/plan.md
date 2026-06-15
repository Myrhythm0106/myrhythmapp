## Stop /launch redirecting to /launch/home

### Problem
Logged-in users visiting `/launch` are immediately redirected to `/launch/home` by an auto-redirect `useEffect` inside `MVPCore4C.tsx` (lines 28-32). The user wants `/launch` to display its own page for everyone, including authenticated users.

### Fix
Remove the `useEffect` that redirects from `MVPCore4C.tsx`:

```tsx
// Auto-redirect logged-in users into the Launch home, unless they explicitly
// open the story page at /launch/landingpage (presentation mode for authed users).
useEffect(() => {
  if (user && window.location.pathname !== '/launch/landingpage') {
    navigate('/launch/home', { replace: true });
  }
}, [user, navigate]);
```

### Result
- `/launch` renders the landing page for all users (logged in or not).
- `/launch/home` remains the authenticated dashboard and is unaffected.
- `/launch/landingpage` also remains unaffected (it renders the same component but was already excluded from the redirect).

No other files need changes. No new dependencies.