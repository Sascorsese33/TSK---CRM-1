-- users (id, name, role: admin/prospector, avatar)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null check (role in ('admin', 'prospector')),
  avatar text,
  created_at timestamptz not null default now()
);

-- prospects (id, name, vehicle, price, city, phone, photo_url, lbc_url, status, assigned_to, created_at)
create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  vehicle text not null,
  price numeric(12,2) not null default 0,
  city text not null,
  phone text not null,
  photo_url text,
  lbc_url text,
  status text not null check (status in ('rdv', 'refus', 'callback', 'ready', 'waiting')),
  assigned_to uuid not null references public.users(id) on delete cascade,
  callback_at timestamptz,
  special_tag text,
  notes text default '',
  created_at timestamptz not null default now()
);

-- calls (id, prospect_id, user_id, duration, recording_url, transcript, created_at)
create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  duration integer not null default 0,
  recording_url text,
  transcript text,
  is_training boolean not null default false,
  created_at timestamptz not null default now()
);

-- appointments (id, prospect_id, user_id, datetime, google_event_id, sms_sent)
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  datetime timestamptz not null,
  google_event_id text,
  sms_sent boolean not null default false,
  outcome text not null default 'confirmed' check (outcome in ('confirmed', 'bad_condition', 'no_show')),
  created_at timestamptz not null default now()
);

-- tips (id, vehicle_type, content, created_by)
create table if not exists public.tips (
  id uuid primary key default gen_random_uuid(),
  vehicle_type text not null,
  content jsonb not null,
  created_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- stats (id, user_id, date, calls_count, rdv_count)
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  calls_count integer not null default 0,
  rdv_count integer not null default 0,
  created_at timestamptz not null default now()
);
