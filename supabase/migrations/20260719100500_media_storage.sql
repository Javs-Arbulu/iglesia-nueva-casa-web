-- ============================================================================
-- Fase 2: imágenes / galería. Bucket público + tabla de metadatos.
-- ============================================================================

-- Bucket público para las imágenes del sitio.
insert into storage.buckets (id, name, public)
values ('public-images', 'public-images', true)
on conflict (id) do nothing;

-- Metadatos de cada imagen.
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  path        text not null unique,   -- ruta dentro del bucket
  alt         text,
  category    text not null default 'galeria',
  published   boolean not null default true,
  uploaded_by uuid references auth.users (id) default auth.uid(),
  created_at  timestamptz not null default now()
);

alter table public.media enable row level security;

drop policy if exists "media_read" on public.media;
create policy "media_read" on public.media
  for select to anon, authenticated
  using (published = true or public.has_role('editor') or public.has_role('admin'));

drop policy if exists "media_manage" on public.media;
create policy "media_manage" on public.media
  for all to authenticated
  using (public.has_role('editor') or public.has_role('admin'))
  with check (public.has_role('editor') or public.has_role('admin'));

-- ── Políticas de Storage (bucket public-images) ────────────────────────────
-- Lectura pública (el bucket es público, pero dejamos la policy explícita).
drop policy if exists "public_images_read" on storage.objects;
create policy "public_images_read" on storage.objects
  for select
  using (bucket_id = 'public-images');

-- Subir / actualizar / borrar: solo editor o admin.
drop policy if exists "public_images_insert" on storage.objects;
create policy "public_images_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'public-images'
    and (public.has_role('editor') or public.has_role('admin'))
  );

drop policy if exists "public_images_update" on storage.objects;
create policy "public_images_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'public-images'
    and (public.has_role('editor') or public.has_role('admin'))
  );

drop policy if exists "public_images_delete" on storage.objects;
create policy "public_images_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'public-images'
    and (public.has_role('editor') or public.has_role('admin'))
  );
