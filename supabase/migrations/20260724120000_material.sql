-- ============================================================================
-- Módulo Material: PDFs para miembros (privado) + gestión admin.
--
--   • Tabla public.material (título, descripción, categoría, archivo, publicado)
--   • Bucket privado 'material' (los PDF no son públicos)
--   • Lectura: staff con permiso 'material' ve TODO; miembros ACTIVOS (aprobados)
--     ven solo lo publicado. Nadie anónimo.
--   • Escritura: staff con permiso material edit/delete.
--   • Seed de permisos: admin y editor gestionan material.
--
-- Correr en AMBAS bases (dev y prod). Idempotente.
-- ============================================================================

create table if not exists public.material (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  category    text not null default 'General',
  path        text not null,               -- ruta dentro del bucket 'material'
  published   boolean not null default false,
  uploaded_by uuid references auth.users (id) default auth.uid(),
  created_at  timestamptz not null default now()
);

create index if not exists material_category_idx on public.material (category);

alter table public.material enable row level security;

-- Helper: ¿el usuario actual es un miembro aprobado (activo)?
create or replace function public.is_active_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.status = 'active'
  );
$$;

-- Lectura del catálogo.
drop policy if exists "material_read" on public.material;
create policy "material_read" on public.material
  for select to authenticated
  using (
    public.has_role('admin')
    or public.has_perm('material', 'view')
    or (published = true and public.is_active_member())
  );

-- Escritura (solo staff con permiso).
drop policy if exists "material_insert" on public.material;
create policy "material_insert" on public.material
  for insert to authenticated
  with check (public.has_role('admin') or public.has_perm('material', 'edit'));

drop policy if exists "material_update" on public.material;
create policy "material_update" on public.material
  for update to authenticated
  using (public.has_role('admin') or public.has_perm('material', 'edit'))
  with check (public.has_role('admin') or public.has_perm('material', 'edit'));

drop policy if exists "material_delete" on public.material;
create policy "material_delete" on public.material
  for delete to authenticated
  using (public.has_role('admin') or public.has_perm('material', 'delete'));

-- ── Storage: bucket privado 'material' ───────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('material', 'material', false)
on conflict (id) do nothing;

-- Leer/firmar: staff con permiso o miembro activo (para descargar/ver).
drop policy if exists "material_files_read" on storage.objects;
create policy "material_files_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'material'
    and (
      public.has_role('admin')
      or public.has_perm('material', 'view')
      or public.is_active_member()
    )
  );

drop policy if exists "material_files_insert" on storage.objects;
create policy "material_files_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'material'
    and (public.has_role('admin') or public.has_perm('material', 'edit'))
  );

drop policy if exists "material_files_delete" on storage.objects;
create policy "material_files_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'material'
    and (public.has_role('admin') or public.has_perm('material', 'delete'))
  );

-- ── Permisos del módulo 'material' (admin + editor gestionan) ────────────────
insert into public.role_permissions (role_key, module_id, can_view, can_edit, can_delete)
values
  ('admin', 'material', true, true, true),
  ('editor', 'material', true, true, true)
on conflict (role_key, module_id) do nothing;
