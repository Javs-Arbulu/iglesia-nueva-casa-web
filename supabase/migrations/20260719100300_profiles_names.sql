-- ============================================================================
-- Fase 1: separar nombre y apellido en los perfiles.
-- ============================================================================

alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;

-- Backfill: usa el full_name existente como nombre (mejor algo que nada).
update public.profiles
set first_name = coalesce(first_name, full_name)
where full_name is not null;

-- Trigger: guarda nombre, apellido y el nombre completo (derivado) al registrarse.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  fn text := new.raw_user_meta_data ->> 'first_name';
  ln text := new.raw_user_meta_data ->> 'last_name';
begin
  insert into public.profiles (id, first_name, last_name, full_name, email)
  values (
    new.id,
    fn,
    ln,
    nullif(trim(concat_ws(' ', fn, ln)), ''),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
