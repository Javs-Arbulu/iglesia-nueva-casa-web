-- ============================================================================
-- Fase 3: Eventos (informativos). Público ve los publicados; editor/admin gestionan.
-- ============================================================================

create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  location    text,
  starts_at   timestamptz not null,
  image_url   text,                       -- para el futuro (Storage / URL)
  published   boolean not null default false,
  created_by  uuid references auth.users (id) default auth.uid(),
  created_at  timestamptz not null default now()
);

create index if not exists events_starts_at_idx on public.events (starts_at);

alter table public.events enable row level security;

-- Lectura: cualquiera ve los publicados; el staff (editor/admin) ve todos.
drop policy if exists "events_read" on public.events;
create policy "events_read" on public.events
  for select to anon, authenticated
  using (
    published = true
    or public.has_role('editor')
    or public.has_role('admin')
  );

-- Escritura (crear/editar/borrar): solo editor o admin.
drop policy if exists "events_manage" on public.events;
create policy "events_manage" on public.events
  for all to authenticated
  using (public.has_role('editor') or public.has_role('admin'))
  with check (public.has_role('editor') or public.has_role('admin'));
