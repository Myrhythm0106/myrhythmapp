
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
  to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Circle can read shared growth states"
  on public.growth_states for select
  to authenticated
  using (public.has_growth_view_access(user_id, auth.uid()));
