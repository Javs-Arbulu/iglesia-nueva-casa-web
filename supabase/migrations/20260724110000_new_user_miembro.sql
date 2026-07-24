-- ============================================================================
-- Nuevos usuarios (email o Google) → rol "miembro" + estado "pendiente".
--
-- Actualiza el trigger handle_new_user para:
--   • Capturar bien los datos según el proveedor:
--       - Email: first_name / last_name (de options.data del signUp)
--       - Google: full_name / name y avatar_url / picture
--   • Crear el perfil (status queda 'pending' por defecto)
--   • Asignar automáticamente el rol 'miembro'
--
-- Así todo usuario nuevo queda como MIEMBRO pero PENDIENTE de aprobación.
-- Idempotente.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_fn text := new.raw_user_meta_data ->> 'first_name';
  v_ln text := new.raw_user_meta_data ->> 'last_name';
  v_full text := coalesce(
    nullif(trim(concat_ws(' ', v_fn, v_ln)), ''),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name'
  );
  v_avatar text := coalesce(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'picture'
  );
begin
  insert into public.profiles (id, first_name, last_name, full_name, email, avatar_url)
  values (new.id, v_fn, v_ln, v_full, new.email, v_avatar)
  on conflict (id) do nothing;

  -- Todo usuario nuevo arranca como miembro (pendiente hasta que un admin apruebe).
  insert into public.user_roles (user_id, role)
  values (new.id, 'miembro')
  on conflict do nothing;

  return new;
end;
$$;

-- El trigger ya existe; lo recreamos por idempotencia.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
