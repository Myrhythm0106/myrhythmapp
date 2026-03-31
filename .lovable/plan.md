

# Financial Model: Excel Download + Protected Interactive Dashboard

## Two Deliverables

### 1. Excel Workbook (downloadable)
Generate `/mnt/documents/MyRhythm_LEAP_OS_Financial_Model.xlsx` with the 7-sheet structure from the approved plan (Executive Summary, Assumptions, MVP Budget, Revenue Model, Cost Structure, P&L/Cash Flow, Funding Roadmap). All formulas live in Excel, professional formatting, £ currency.

### 2. Protected Interactive Dashboard (in-app)
A `/founder/financials` route protected by **role-based access** — only users with the `admin` role in the existing `user_roles` table can view it. Anyone visiting the public app link will never see this page or any link to it.

## Access Control Strategy

The project already has:
- `user_roles` table with `app_role` enum (`admin`, `moderator`, `user`)
- `has_role()` security definer function
- `ProtectedRoute` component for auth gating

We add a thin `AdminRoute` wrapper that checks `has_role(auth.uid(), 'admin')` via Supabase RPC. Non-admin authenticated users see a "not authorised" message. Unauthenticated users redirect to `/auth`. No navigation link is exposed anywhere in the app — the route is accessible only by direct URL.

## Files to Create/Edit

| # | File | Action |
|---|------|--------|
| 1 | `/mnt/documents/MyRhythm_LEAP_OS_Financial_Model.xlsx` | Generate Excel workbook (openpyxl + recalculate) |
| 2 | `src/hooks/useAdminRole.ts` | New hook — calls `has_role` RPC, returns `{isAdmin, isLoading}` |
| 3 | `src/components/auth/AdminRoute.tsx` | New — wraps `ProtectedRoute` + admin check, shows "Access Denied" for non-admins |
| 4 | `src/pages/FounderFinancialsPage.tsx` | New — interactive dashboard with charts (Recharts), tables, key metrics |
| 5 | `src/App.tsx` | Add `/founder/financials` route wrapped in `AdminRoute` |

## Dashboard Content

The interactive dashboard mirrors the Excel model:
- **Summary cards**: Funding ask, ARR target, burn rate, runway
- **Revenue chart**: 36-month MRR projection (line chart, Recharts)
- **Cost breakdown**: Stacked bar chart by category
- **Unit economics**: LTV, CAC, LTV:CAC ratio, gross margin gauges
- **Funding roadmap**: Timeline visualisation (Pre-seed → Series A → B)
- **Phase cards**: MVP features with CCM mapping and evidence stats

No data comes from Supabase — all figures are hardcoded in the component (matching the Excel model). This is a presentation tool, not a live data feed.

## Why This Approach

- **No new tables needed** — uses existing `user_roles` + `has_role()` function
- **No navigation link exposed** — only accessible via direct `/founder/financials` URL
- **Role-checked server-side** — `has_role` is a security definer function, not client-side guessing
- **Excel for sharing** — investors get the .xlsx; dashboard is for your own reference and live presentations

## Prerequisite

Your Supabase user account must have an `admin` role in the `user_roles` table. If not already set, we'll add a one-time migration to grant it.

