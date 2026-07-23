-- ============================================================================
-- Roles y permisos (roles como datos) + RLS que aplica la matriz.
--
-- Modelo:
--   • roles                → catálogo de roles (sistema + personalizados)
--   • role_permissions     → matriz rol × módulo × (ver / editar / eliminar)
--   • user_custom_roles    → asignación de roles PERSONALIZADOS a usuarios
--     (los roles de sistema siguen en user_roles / enum app_role, intactos)
--   • has_perm(módulo, acción) → función que consulta la matriz para el usuario
--     actual (une roles de sistema + personalizados). La RLS de cada tabla la usa.
--
-- Seguridad:
--   • Toda política lleva `has_role('admin') OR has_perm(...)`: el ADMIN siempre
--     pasa (nunca hay lockout aunque la matriz quede mal configurada).
--   • Se conservan las reglas propias (perfil propio, envío anónimo del contacto,
--     lectura pública de lo publicado).
--
-- El SEED de role_permissions replica EXACTAMENTE el acceso actual, así aplicar
-- este script NO cambia el comportamiento hasta que edites la matriz.
--
-- Idempotente: se puede volver a correr sin romper nada.
-- IDs de módulo usados por el frontend:
--   inicio, eventos, fotos, contenido, finanzas, mensajes, usuarios, roles
-- ============================================================================

-- ─── 1) Tablas ───────────────────────────────────────────────────────────────

create table if not exists public.roles (
  key        text primary key,
  label      text not null,
  is_system  boolean not null default false,
  sort       int not null default 100,
  created_at timestamptz not null default now()
);

insert into public.roles (key, label, is_system, sort) values
  ('admin', 'Admin', true, 1),
  ('editor', 'Editor', true, 2),
  ('finanzas', 'Finanzas', true, 3),
  ('miembro', 'Miembro', true, 4)
on conflict (key) do nothing;

create table if not exists public.role_permissions (
  role_key   text not null references public.roles (key) on delete cascade,
  module_id  text not null,
  can_view   boolean not null default false,
  can_edit   boolean not null default false,
  can_delete boolean not null default false,
  primary key (role_key, module_id)
);

create table if not exists public.user_custom_roles (
  user_id  uuid not null references auth.users (id) on delete cascade,
  role_key text not null references public.roles (key) on delete cascade,
  primary key (user_id, role_key)
);

-- ─── 2) Función central: ¿el usuario actual tiene permiso en el módulo? ───────
--     security definer → evita recursión de RLS al leer role_permissions.

create or replace function public.has_perm(_module text, _action text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.role_permissions rp
    where rp.module_id = _module
      and (
        case _action
          when 'view' then rp.can_view
          when 'edit' then rp.can_edit
          when 'delete' then rp.can_delete
          else false
        end
      )
      and rp.role_key in (
        -- roles de sistema (enum) del usuario
        select ur.role::text from public.user_roles ur where ur.user_id = auth.uid()
        union
        -- roles personalizados del usuario
        select ucr.role_key from public.user_custom_roles ucr where ucr.user_id = auth.uid()
      )
  );
$$;

-- ─── 3) Seed de la matriz: replica el acceso ACTUAL ──────────────────────────
--     (admin = todo; editor = eventos/fotos/contenido; finanzas = finanzas;
--      miembro = nada en el admin todavía)

-- admin: todos los módulos, todas las acciones
insert into public.role_permissions (role_key, module_id, can_view, can_edit, can_delete)
values
  ('admin','inicio',    true, true, true),
  ('admin','eventos',   true, true, true),
  ('admin','fotos',     true, true, true),
  ('admin','contenido', true, true, true),
  ('admin','finanzas',  true, true, true),
  ('admin','mensajes',  true, true, true),
  ('admin','usuarios',  true, true, true),
  ('admin','roles',     true, true, true),
  ('editor','inicio',    true, false, false),
  ('editor','eventos',   true, true,  true),
  ('editor','fotos',     true, true,  true),
  ('editor','contenido', true, true,  false),
  ('finanzas','inicio',   true, false, false),
  ('finanzas','finanzas', true, true,  true)
on conflict (role_key, module_id) do nothing;

-- ─── 4) RLS de las tablas nuevas ─────────────────────────────────────────────

alter table public.roles             enable row level security;
alter table public.role_permissions  enable row level security;
alter table public.user_custom_roles enable row level security;

-- roles: lectura para cualquier autenticado (para armar UI); gestión admin/roles.
drop policy if exists "roles_read" on public.roles;
create policy "roles_read" on public.roles
  for select to authenticated using (true);

drop policy if exists "roles_manage" on public.roles;
create policy "roles_manage" on public.roles
  for all to authenticated
  using (public.has_role('admin') or public.has_perm('roles','edit'))
  with check (public.has_role('admin') or public.has_perm('roles','edit'));

-- role_permissions: lectura autenticada (para armar el menú); gestión admin/roles.
drop policy if exists "role_permissions_read" on public.role_permissions;
create policy "role_permissions_read" on public.role_permissions
  for select to authenticated using (true);

drop policy if exists "role_permissions_manage" on public.role_permissions;
create policy "role_permissions_manage" on public.role_permissions
  for all to authenticated
  using (public.has_role('admin') or public.has_perm('roles','edit'))
  with check (public.has_role('admin') or public.has_perm('roles','edit'));

-- user_custom_roles: cada quien lee las suyas; gestión admin/usuarios.
drop policy if exists "user_custom_roles_select" on public.user_custom_roles;
create policy "user_custom_roles_select" on public.user_custom_roles
  for select to authenticated
  using (user_id = auth.uid() or public.has_role('admin') or public.has_perm('usuarios','view'));

drop policy if exists "user_custom_roles_manage" on public.user_custom_roles;
create policy "user_custom_roles_manage" on public.user_custom_roles
  for all to authenticated
  using (public.has_role('admin') or public.has_perm('usuarios','edit'))
  with check (public.has_role('admin') or public.has_perm('usuarios','edit'));

-- ─── 5) RLS reescrita por tabla (aplica la matriz vía has_perm) ───────────────

-- EVENTS (módulo: eventos) --------------------------------------------------
drop policy if exists "events_read" on public.events;
create policy "events_read" on public.events
  for select to anon, authenticated
  using (published = true or public.has_role('admin') or public.has_perm('eventos','view'));

drop policy if exists "events_manage" on public.events;  -- política antigua "for all"
drop policy if exists "events_insert" on public.events;
create policy "events_insert" on public.events
  for insert to authenticated
  with check (public.has_role('admin') or public.has_perm('eventos','edit'));
drop policy if exists "events_update" on public.events;
create policy "events_update" on public.events
  for update to authenticated
  using (public.has_role('admin') or public.has_perm('eventos','edit'))
  with check (public.has_role('admin') or public.has_perm('eventos','edit'));
drop policy if exists "events_delete" on public.events;
create policy "events_delete" on public.events
  for delete to authenticated
  using (public.has_role('admin') or public.has_perm('eventos','delete'));

-- MEDIA (módulo: fotos) -----------------------------------------------------
drop policy if exists "media_read" on public.media;
create policy "media_read" on public.media
  for select to anon, authenticated
  using (published = true or public.has_role('admin') or public.has_perm('fotos','view'));

drop policy if exists "media_manage" on public.media;
drop policy if exists "media_insert" on public.media;
create policy "media_insert" on public.media
  for insert to authenticated
  with check (public.has_role('admin') or public.has_perm('fotos','edit'));
drop policy if exists "media_update" on public.media;
create policy "media_update" on public.media
  for update to authenticated
  using (public.has_role('admin') or public.has_perm('fotos','edit'))
  with check (public.has_role('admin') or public.has_perm('fotos','edit'));
drop policy if exists "media_delete" on public.media;
create policy "media_delete" on public.media
  for delete to authenticated
  using (public.has_role('admin') or public.has_perm('fotos','delete'));

-- STORAGE (bucket public-images → módulo: fotos) ----------------------------
drop policy if exists "public_images_insert" on storage.objects;
create policy "public_images_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'public-images'
    and (public.has_role('admin') or public.has_perm('fotos','edit'))
  );
drop policy if exists "public_images_update" on storage.objects;
create policy "public_images_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'public-images'
    and (public.has_role('admin') or public.has_perm('fotos','edit'))
  );
drop policy if exists "public_images_delete" on storage.objects;
create policy "public_images_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'public-images'
    and (public.has_role('admin') or public.has_perm('fotos','delete'))
  );
-- (la política de lectura pública "public_images_read" se mantiene tal cual)

-- CONTENT_BLOCKS (módulo: contenido — sin "eliminar") -----------------------
drop policy if exists "content_manage" on public.content_blocks;
create policy "content_manage" on public.content_blocks
  for all to authenticated
  using (public.has_role('admin') or public.has_perm('contenido','edit'))
  with check (public.has_role('admin') or public.has_perm('contenido','edit'));
-- ("content_read" público se mantiene tal cual)

-- FINANCE_TRANSACTIONS (módulo: finanzas) -----------------------------------
drop policy if exists "finance_access" on public.finance_transactions;  -- "for all"
drop policy if exists "finance_select" on public.finance_transactions;
create policy "finance_select" on public.finance_transactions
  for select to authenticated
  using (public.has_role('admin') or public.has_perm('finanzas','view'));
drop policy if exists "finance_insert" on public.finance_transactions;
create policy "finance_insert" on public.finance_transactions
  for insert to authenticated
  with check (public.has_role('admin') or public.has_perm('finanzas','edit'));
drop policy if exists "finance_update" on public.finance_transactions;
create policy "finance_update" on public.finance_transactions
  for update to authenticated
  using (public.has_role('admin') or public.has_perm('finanzas','edit'))
  with check (public.has_role('admin') or public.has_perm('finanzas','edit'));
drop policy if exists "finance_delete" on public.finance_transactions;
create policy "finance_delete" on public.finance_transactions
  for delete to authenticated
  using (public.has_role('admin') or public.has_perm('finanzas','delete'));

-- AUDIT_LOG (lectura, módulo: finanzas) -------------------------------------
drop policy if exists "audit_read" on public.audit_log;
create policy "audit_read" on public.audit_log
  for select to authenticated
  using (public.has_role('admin') or public.has_perm('finanzas','view'));

-- CONTACT_SUBMISSIONS (módulo: mensajes) ------------------------------------
--   (se mantiene "anon puede insertar mensajes" para el formulario público)
drop policy if exists "contact_admin_select" on public.contact_submissions;
create policy "contact_admin_select" on public.contact_submissions
  for select to authenticated
  using (public.has_role('admin') or public.has_perm('mensajes','view'));
drop policy if exists "contact_admin_update" on public.contact_submissions;
create policy "contact_admin_update" on public.contact_submissions
  for update to authenticated
  using (public.has_role('admin') or public.has_perm('mensajes','edit'))
  with check (public.has_role('admin') or public.has_perm('mensajes','edit'));
drop policy if exists "contact_admin_delete" on public.contact_submissions;
create policy "contact_admin_delete" on public.contact_submissions
  for delete to authenticated
  using (public.has_role('admin') or public.has_perm('mensajes','delete'));

-- PROFILES (módulo: usuarios — conserva acceso al perfil propio) ------------
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.has_role('admin') or public.has_perm('usuarios','view'));
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.has_role('admin') or public.has_perm('usuarios','edit'))
  with check (id = auth.uid() or public.has_role('admin') or public.has_perm('usuarios','edit'));
drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert to authenticated
  with check (id = auth.uid() or public.has_role('admin') or public.has_perm('usuarios','edit'));

-- USER_ROLES (módulo: usuarios — conserva lectura de los roles propios) -----
drop policy if exists "user_roles_select" on public.user_roles;
create policy "user_roles_select" on public.user_roles
  for select to authenticated
  using (user_id = auth.uid() or public.has_role('admin') or public.has_perm('usuarios','view'));
drop policy if exists "user_roles_admin" on public.user_roles;
create policy "user_roles_admin" on public.user_roles
  for all to authenticated
  using (public.has_role('admin') or public.has_perm('usuarios','edit'))
  with check (public.has_role('admin') or public.has_perm('usuarios','edit'));
