# Report: summary always shown, detail on demand

## What changes
- The Executive summary stays fully visible at the top of my snapshot.
- Below it, one clear toggle button: "See the detail behind my summary" (chevron, 56px tall). Tapping it opens the detail; tapping again ("Hide the detail") closes it.
- The detail panel holds: My priority areas (ranked, choose up to 3) and the per-area detail cards. Each area card stays individually expandable, but all start closed.
- Closed by default the first time; my choice (open/closed) is remembered on this device.
- "Prove it now" and the honest choice (keep free / Founding Member / Home) stay visible below, so the summary-to-action path is short.
- Smooth open/close animation; keyboard and screen-reader friendly (aria-expanded, aria-controls).

## Technical
- `src/components/launch/report/ConsultingReport.tsx`: wrap the priority and detail sections in a Radix Collapsible (existing shadcn `collapsible`), trigger styled with theme tokens; set `AreaDetailCard` defaultOpen false.
- Persist state in localStorage key `myrhythm_report_detail_open_v1` (user-scoped like other device-local stores).
- If priorities aren't confirmed yet, the summary's "biggest opportunity" line keeps working from the recommended top 3.
