-- ============================================================
-- BudgetApp — Initial Schema
-- ============================================================

-- ── profiles ─────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url  text,
  onboarding_complete boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── accounts ─────────────────────────────────────────────────
create table if not exists public.accounts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  type        text not null check (type in ('bank','credit_card','savings','investment','cash','other')),
  balance     numeric(14,2) not null default 0,
  currency    text not null default 'USD',
  color       text not null default '#3B82F6',
  icon        text not null default 'wallet',
  created_at  timestamptz not null default now()
);

alter table public.accounts enable row level security;

create policy "Users manage own accounts"
  on public.accounts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── transactions ──────────────────────────────────────────────
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  account_id  uuid references public.accounts(id) on delete set null,
  amount      numeric(14,2) not null,
  merchant    text not null,
  category    text not null default 'other',
  type        text not null check (type in ('income','expense','transfer')),
  source      text not null default 'manual' check (source in ('manual','automation','initial_balance')),
  note        text,
  date        date not null default current_date,
  created_at  timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Users manage own transactions"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for month-based queries
create index if not exists transactions_user_date_idx
  on public.transactions (user_id, date desc);

create index if not exists transactions_account_idx
  on public.transactions (account_id);

-- ── budgets ───────────────────────────────────────────────────
create table if not exists public.budgets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  month_key   text not null,  -- format: YYYY-MM
  total_limit numeric(14,2) not null default 0,
  created_at  timestamptz not null default now(),
  unique (user_id, month_key)
);

alter table public.budgets enable row level security;

create policy "Users manage own budgets"
  on public.budgets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── budget_categories ─────────────────────────────────────────
create table if not exists public.budget_categories (
  id          uuid primary key default gen_random_uuid(),
  budget_id   uuid not null references public.budgets(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  category_id text not null,
  limit_amount numeric(14,2) not null default 0,
  created_at  timestamptz not null default now(),
  unique (budget_id, category_id)
);

alter table public.budget_categories enable row level security;

create policy "Users manage own budget categories"
  on public.budget_categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── bills ─────────────────────────────────────────────────────
create table if not exists public.bills (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  amount          numeric(14,2) not null,
  due_date        date not null,
  is_recurring    boolean not null default false,
  recurrence_type text check (recurrence_type in ('monthly','weekly','yearly','custom')),
  account_id      uuid references public.accounts(id) on delete set null,
  notes           text,
  paid            boolean not null default false,
  icon            text,
  color           text,
  created_at      timestamptz not null default now()
);

alter table public.bills enable row level security;

create policy "Users manage own bills"
  on public.bills for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
