-- ============================================================================
-- Fase 2 (admin): mensajes de contacto — marcar leído/no leído y borrar.
-- Añade la columna `read` y las políticas de UPDATE/DELETE para admin.
-- Idempotente: se puede volver a correr sin romper nada.
-- ============================================================================

-- 1) Estado de lectura del mensaje.
alter table public.contact_submissions
  add column if not exists read boolean not null default false;

-- Índice para contar/filtrar los no leídos rápido (dashboard + bandeja).
create index if not exists contact_submissions_read_idx
  on public.contact_submissions (read);

-- 2) El admin puede marcar leído/no leído (UPDATE).
drop policy if exists "contact_admin_update" on public.contact_submissions;
create policy "contact_admin_update" on public.contact_submissions
  for update to authenticated
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

-- 3) El admin puede borrar mensajes (DELETE).
drop policy if exists "contact_admin_delete" on public.contact_submissions;
create policy "contact_admin_delete" on public.contact_submissions
  for delete to authenticated
  using (public.has_role('admin'));
