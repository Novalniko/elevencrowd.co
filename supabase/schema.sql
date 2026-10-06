create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price integer not null default 0,
  stock integer not null default 0,
  status text not null default 'Tersedia',
  badge text default '',
  image text not null,
  images jsonb default '[]'::jsonb,
  sizes jsonb default '[]'::jsonb,
  specs jsonb default '{}'::jsonb,
  description text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  email text not null unique,
  password_hash text not null,
  salt text not null default 'ec_salt_2024_auth',
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_phone text,
  address text,
  items jsonb default '[]'::jsonb,
  total integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id text primary key,
  payment_methods jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

grant select, insert, update on table public.store_settings to anon, authenticated;

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on public.products;

create trigger products_updated_at
before update on public.products
for each row
execute function public.update_updated_at_column();

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_status on public.products(status);
