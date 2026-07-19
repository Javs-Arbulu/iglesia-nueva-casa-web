-- ============================================================================
-- Portal — Fase 0: autenticación, perfiles y roles
-- Ejecutar en Supabase → SQL Editor (una sola vez).
-- Idempotente: se puede volver a correr sin romper nada.
-- ============================================================================

-- 1) Enum de roles ----------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('admin', 'editor', 'finanzas', 'miembro');
exception when duplicate_object then null; end $$;

-- 2) Perfiles (1-a-1 con auth.users) ----------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  phone      text,
  avatar_url text,
  status     text not null default 'pending' check (status in ('active', 'pending')),
  created_at timestamptz not null default now()
);

-- 3) Roles por usuario (un usuario puede tener varios) ----------------------
create table if not exists public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role    public.app_role not null,
  primary key (user_id, role)
);

-- 4) Helper: ¿el usuario actual tiene el rol? -------------------------------
--    security definer → evita recursión de RLS al consultar user_roles.
create or replace function public.has_role(_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = _role
  );
$$;

-- 5) Trigger: crear el profile automáticamente al registrarse ---------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6) Row Level Security ------------------------------------------------------
alter table public.profiles   enable row level security;
alter table public.user_roles enable row level security;

-- profiles: cada quien ve/edita el suyo; admin ve/edita todos
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.has_role('admin'));

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.has_role('admin'))
  with check (id = auth.uid() or public.has_role('admin'));

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert to authenticated
  with check (id = auth.uid() or public.has_role('admin'));

-- user_roles: cada quien lee sus roles; solo admin modifica
drop policy if exists "user_roles_select" on public.user_roles;
create policy "user_roles_select" on public.user_roles
  for select to authenticated
  using (user_id = auth.uid() or public.has_role('admin'));

drop policy if exists "user_roles_admin" on public.user_roles;
create policy "user_roles_admin" on public.user_roles
  for all to authenticated
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

-- 7) contact_submissions: que el admin pueda LEER los mensajes --------------
--    (el INSERT anónimo del formulario ya existe de antes)
drop policy if exists "contact_admin_select" on public.contact_submissions;
create policy "contact_admin_select" on public.contact_submissions
  for select to authenticated
  using (public.has_role('admin'));

-- ============================================================================
-- BOOTSTRAP (correr DESPUÉS de crear tu usuario admin en Authentication):
--   1. Authentication → Users → Add user (email + contraseña). Copia su UID.
--   2. Reemplaza <UID> abajo y ejecuta:
--
--   insert into public.user_roles (user_id, role) values ('<UID>', 'admin')
--     on conflict do nothing;
--   update public.profiles set status = 'active' where id = '<UID>';
-- ============================================================================
