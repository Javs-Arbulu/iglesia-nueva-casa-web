-- ============================================================================
-- Fase 6: Finanzas. Acceso ESTRICTO (solo finanzas/admin) + auditoría.
-- ============================================================================

create table if not exists public.finance_transactions (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('ingreso', 'egreso')),
  amount      numeric(12, 2) not null check (amount >= 0),
  currency    text not null default 'PEN',
  category    text,
  description text,
  occurred_on date not null default current_date,
  recorded_by uuid references auth.users (id) default auth.uid(),
  created_at  timestamptz not null default now()
);

create index if not exists finance_occurred_idx
  on public.finance_transactions (occurred_on desc);

alter table public.finance_transactions enable row level security;

-- Solo finanzas o admin pueden ver/registrar/editar/borrar.
drop policy if exists "finance_access" on public.finance_transactions;
create policy "finance_access" on public.finance_transactions
  for all to authenticated
  using (public.has_role('finanzas') or public.has_role('admin'))
  with check (public.has_role('finanzas') or public.has_role('admin'));

-- ── Auditoría ──────────────────────────────────────────────────────────────
create table if not exists public.audit_log (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid default auth.uid(),
  action     text not null,        -- INSERT | UPDATE | DELETE
  entity     text not null,
  entity_id  uuid,
  metadata   jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

-- Lo pueden leer finanzas/admin; los inserts los hace el trigger (security definer).
drop policy if exists "audit_read" on public.audit_log;
create policy "audit_read" on public.audit_log
  for select to authenticated
  using (public.has_role('finanzas') or public.has_role('admin'));

create or replace function public.log_finance_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (actor_id, action, entity, entity_id, metadata)
  values (
    auth.uid(),
    tg_op,
    'finance_transactions',
    coalesce(new.id, old.id),
    jsonb_build_object(
      'type', coalesce(new.type, old.type),
      'amount', coalesce(new.amount, old.amount),
      'category', coalesce(new.category, old.category)
    )
  );
  return coalesce(new, old);
end;
$$;

drop trigger if exists finance_audit on public.finance_transactions;
create trigger finance_audit
  after insert or update or delete on public.finance_transactions
  for each row execute function public.log_finance_change();
