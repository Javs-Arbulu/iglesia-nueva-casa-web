-- ============================================================================
-- Fase 4: textos editables (clave → valor JSON).
-- Se empieza con: 'announcement' (banner) y 'contact' (horarios/datos).
-- ============================================================================

create table if not exists public.content_blocks (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users (id) default auth.uid(),
  updated_at timestamptz not null default now()
);

alter table public.content_blocks enable row level security;

-- Lectura pública (es contenido del sitio).
drop policy if exists "content_read" on public.content_blocks;
create policy "content_read" on public.content_blocks
  for select to anon, authenticated
  using (true);

-- Escritura: solo editor o admin.
drop policy if exists "content_manage" on public.content_blocks;
create policy "content_manage" on public.content_blocks
  for all to authenticated
  using (public.has_role('editor') or public.has_role('admin'))
  with check (public.has_role('editor') or public.has_role('admin'));
