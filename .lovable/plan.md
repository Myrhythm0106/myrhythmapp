
# MyRHYTHM-G — the Growth-mindset layer

**Name:** MyRHYTHM-G (the "G" is for Growth mindset). The assessment stays **MYRHYTHM** (identity/trait); MyRHYTHM-G is the daily **state** lens on the same 8 letters. One vocabulary, two lenses.

Wordmark rule: always styled `MyRHYTHM-G` (mixed case + hyphen + capital G).

## The 8 growth states (1:1 with MYRHYTHM letters)

| # | Letter | Chip | One-line prompt |
|---|---|---|---|
| 1 | M | **M · Mindset set** | "I've decided this matters." |
| 2 | Y | **Y · Yes, begun** | "I've said yes and started." |
| 3 | R | **R · Rhythm wobble** | "My rhythm's off — I'm rethinking." |
| 4 | H | **H · Harnessing support** | "Leaning on my circle to keep going." |
| 5 | Y | **Y · Yearning for a win** | "Feeling lost — I need one small win." |
| 6 | T | **T · Transforming** | "Turning what happened into what's next." |
| 7 | H | **H · Healing through habit** | "Practising — repetition is doing the work." |
| 8 | M | **M · Mastered & multiplying** | "I've got this — ready to pass it on." |

## Influences & intentional divergences (new — locked into brand memory)

MyRHYTHM-G sits in the same intellectual neighbourhood as **Dr. Daniel Amen** (brain-healthy daily habits, non-shaming framing, "change your brain, change your life") and **Dr. Caroline Leaf** (neuroplasticity through repeated conscious attention, mind-management over mood-fixing, community as part of healing). The 8-state arc mirrors that plasticity loop in plain user language.

**Language we will NOT borrow** (guardrails for all future copy):
- No timelines or "days to rewire" numbers (Leaf's 21/63-day cycle, Amen's programme durations).
- No supplements, diagnostics, SPECT/scan references.
- No "toxic thoughts" or spiritual/theological framing.
- No clinical-outcome claims, no "fix", no "cure", no "rewire your brain in X days".
- Attribution: neither name appears in-app or in marketing — MyRHYTHM-G stands on its own vocabulary.

## What ships

### 1. Data model
New table `growth_states`:
- `user_id`, `goal_id?` (nullable), `letter` enum `M1|Y1|R|H1|Y2|T|H2|M2`, `note text?`, `logged_at`, `created_at`.
- New column `profiles.support_circle_can_view_growth boolean default false`.
- RLS: owner full access; Support Circle members SELECT only when the toggle is on and the relationship is `active`, via security-definer helper `has_growth_view_access(_owner, _viewer)`.

### 2. Calibrate surface — the daily MyRHYTHM-G log
On `/launch/calibrate`, add a first-class card above the existing CapabilityPage:

```
MyRHYTHM-G · Where are you in your rhythm today?
[M · Mindset set] [Y · Yes, begun] [R · Rhythm wobble] [H · Harnessing support]
[Y · Yearning]    [T · Transforming] [H · Healing through habit] [M · Mastered & multiplying]
                                                                 Optional note ▸
```
- One-tap logs today's state.
- 30-day **path strip** of letters walked (e.g. `M → Y → R → H → T`). No scoring, no streaks.
- Footer link: *"MyRHYTHM-G uses the same 8 letters as your MYRHYTHM assessment — one is who you are, the other is where you are today."*

### 3. Home chip
`QuietHome.tsx` gains a MyRHYTHM-G chip near the greeting:
`MyRHYTHM-G today: R · Rhythm wobble — a small win will help.`
If nothing logged: `Log your MyRHYTHM-G today ›`. Tap → Calibrate.

### 4. Assessment result page handoff
> *"Your strongest letters right now are **{top1}** and **{top2}**. When the middle gets messy, **MyRHYTHM-G** on Calibrate lets you name which letter needs attention today."*
CTA: `Try MyRHYTHM-G →` deep-links to Calibrate with the picker focused.

### 5. Support Circle view (permissioned, read-only)
- New setting in `LaunchSettings` → Support Circle: **"Let my circle see my MyRHYTHM-G"** (default off).
- New read-only route `/launch/circle/:memberId/growth` — today's chip + 30-day path strip. Gated by `has_growth_view_access`.
- Add `growth` key to `EnhancedSupportCirclePermissions`, wired to the same profile toggle.

### 6. Celebrate copy loop
Weekly transition line in Celebrate when state shifts:
> *"MyRHYTHM-G: you moved from **R · Rhythm wobble** to **T · Transforming** this week. That's the messy middle turning into momentum."*

## What we intentionally do NOT do
- No dashboard, analytics tab, scoring, streaks, or the phrase "growth mindset" anywhere in UI copy — the 8 letters carry the message.
- No researcher/export UI yet (schema supports it; deferred).
- No Amen/Leaf references or their signature phrases.

## Files touched

**Create**
- `src/launch/growth/states.ts` — 8-letter constant + `MYRHYTHM_G` brand string.
- `src/launch/growth/GrowthStatePicker.tsx` — 4×2 chip picker.
- `src/launch/growth/GrowthPathStrip.tsx` — 30-day letter strip.
- `src/hooks/useGrowthStates.ts` — read/write today's state.
- `src/pages/launch/LaunchCircleGrowth.tsx` — read-only Support Circle view.

**Edit**
- `src/pages/launch/LaunchCalibrate.tsx` — mount MyRHYTHM-G card above CapabilityPage.
- `src/components/launch/quiet/QuietHome.tsx` — Today chip.
- `src/pages/launch/LaunchSettings.tsx` — permission toggle.
- `src/components/personal-community/EnhancedSupportCirclePermissions.tsx` — add `growth` key.
- Assessment results page — handoff line + CTA.
- Celebrate copy — weekly transition line.
- `src/launch/routes.ts` + `App.tsx` — register circle-growth route + You-Are-Here entry.

**Memory writes on approval:**
- `mem://brand/myrhythm-g` — wordmark rule + 8-letter mapping.
- `mem://brand/myrhythm-g-influences` — Amen/Leaf alignment rationale and the banned-language list above.

## Database migration (single call)

```sql
create type public.growth_letter as enum
  ('M1','Y1','R','H1','Y2','T','H2','M2');

create table public.growth_states (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  letter public.growth_letter not null,
  note text,
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index growth_states_user_logged_idx
  on public.growth_states (user_id, logged_at desc);

grant select, insert, update, delete on public.growth_states to authenticated;
grant all on public.growth_states to service_role;
alter table public.growth_states enable row level security;

alter table public.profiles
  add column if not exists support_circle_can_view_growth boolean not null default false;

create or replace function public.has_growth_view_access(_owner uuid, _viewer uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.profiles p
    join public.support_circle_members m
      on m.user_id = p.id
     and m.status = 'active'
    where p.id = _owner
      and p.support_circle_can_view_growth = true
      and (
        m.member_email = (select email from auth.users where id = _viewer)
        or m.user_id = _viewer
      )
  );
$$;

create policy "Owners manage own growth states"
  on public.growth_states for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Circle can read shared growth states"
  on public.growth_states for select to authenticated
  using (public.has_growth_view_access(user_id, auth.uid()));
```

## Guardrails respected
- One-tap primary action; 4×2 grid but no ranking language.
- Non-clinical, non-demeaning, secular wording throughout.
- No new required daily action — logging optional.
- 56px tap targets, MYRHYTHM letter colours.
- Assessment vocabulary shared; only new token is the "G".

Ready to build on approval.
