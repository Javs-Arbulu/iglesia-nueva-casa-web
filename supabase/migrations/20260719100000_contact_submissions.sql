-- ============================================================================
-- Base: tabla de mensajes del formulario de contacto.
-- (Ya existe en el Supabase hospedado; se añade como migración para que el
--  entorno local/CLI tenga el esquema completo.)
-- ============================================================================

create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre     text not null,
  email      text not null,
  asunto     text not null,
  mensaje    text not null
);

alter table public.contact_submissions enable row level security;

-- Cualquiera (anon) puede ENVIAR el formulario; nadie puede leer con anon key.
drop policy if exists "anon puede insertar mensajes" on public.contact_submissions;
create policy "anon puede insertar mensajes"
  on public.contact_submissions
  for insert
  to anon
  with check (true);
