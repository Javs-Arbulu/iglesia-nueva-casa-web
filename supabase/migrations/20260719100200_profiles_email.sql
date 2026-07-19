-- ============================================================================
-- Fase 1: guardar el email en el perfil (para la gestión de usuarios).
-- ============================================================================

alter table public.profiles add column if not exists email text;

-- El trigger ahora también copia el email al crear el perfil.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Rellena el email de los usuarios que ya existían.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;
