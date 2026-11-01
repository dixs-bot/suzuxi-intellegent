-- Apply after 001_initial_schema.sql.
-- Public signup must remain disabled in Supabase Auth settings.
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() limit 1;
$$;

create or replace function public.has_any_role(allowed text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = any(allowed), false);
$$;

grant execute on function public.current_user_role() to authenticated;
grant execute on function public.has_any_role(text[]) to authenticated;

-- Profiles: users may read their own profile; admins can read/update all.
drop policy if exists "profile self read" on public.profiles;
create policy "profile self read" on public.profiles for select to authenticated
using (id = auth.uid() or public.has_any_role(array['admin']));
drop policy if exists "profile admin update" on public.profiles;
create policy "profile admin update" on public.profiles for update to authenticated
using (public.has_any_role(array['admin'])) with check (public.has_any_role(array['admin']));

-- Business data: authenticated team members can read; admin/sales can write.
do $$
declare t text;
begin
 foreach t in array array['products','knowledge_documents','leads','lead_consents','conversations','messages','lead_scores','handoff_reports','automation_logs'] loop
  execute format('drop policy if exists %I on public.%I', t||'_read_team', t);
  execute format('create policy %I on public.%I for select to authenticated using (public.has_any_role(array[''admin'',''sales'',''viewer'']))', t||'_read_team', t);
  execute format('drop policy if exists %I on public.%I', t||'_write_sales', t);
  execute format('create policy %I on public.%I for all to authenticated using (public.has_any_role(array[''admin'',''sales''])) with check (public.has_any_role(array[''admin'',''sales'']))', t||'_write_sales', t);
 end loop;
end $$;

-- Sensitive configuration is admin-only.
drop policy if exists "social_accounts_admin_all" on public.social_accounts;
create policy "social_accounts_admin_all" on public.social_accounts for all to authenticated
using (public.has_any_role(array['admin'])) with check (public.has_any_role(array['admin']));
drop policy if exists "notification_settings_admin_all" on public.notification_settings;
create policy "notification_settings_admin_all" on public.notification_settings for all to authenticated
using (public.has_any_role(array['admin'])) with check (public.has_any_role(array['admin']));

-- Queue tasks can only be managed by admins; worker uses server-side service role.
drop policy if exists "ai_tasks_admin_all" on public.ai_tasks;
create policy "ai_tasks_admin_all" on public.ai_tasks for all to authenticated
using (public.has_any_role(array['admin'])) with check (public.has_any_role(array['admin']));

-- Do not create a public profile or grant an admin role on signup.
-- Bootstrap: create the first user in Supabase Dashboard > Authentication > Users.
-- Then run the following SQL with that user's UUID and intended email/name:
-- insert into public.profiles(id, full_name, role)
-- values ('AUTH_USER_UUID', 'Nama Admin', 'admin');
