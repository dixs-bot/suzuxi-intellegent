# Setup Supabase Auth & Database (v1.1)

## 1. Create project and copy API settings
From Supabase Dashboard > Project Settings > API:
- Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
- anon/public key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service_role key -> `SUPABASE_SERVICE_ROLE_KEY` (server/worker only; never expose it)

Create `.env.local` from `.env.example`. Restart Next.js after changing env vars.

## 2. Run migrations in order
In Supabase SQL Editor, run:
1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_auth_rls_hardening.sql`

The second migration installs role-based RLS. Do not skip it.

## 3. Create the first admin securely
In Supabase Dashboard > Authentication > Users:
1. Disable public signups in Authentication > Providers > Email (or keep signup disabled).
2. Add user manually using your admin email and a strong password.
3. Copy that user's UUID.
4. Run in SQL Editor (replace values):
```sql
insert into public.profiles (id, full_name, role)
values ('PASTE_AUTH_USER_UUID', 'Nama Admin', 'admin');
```
Never give `admin` role to an untrusted user. Add sales/viewer accounts manually and assign the appropriate role.

## 4. Environment example
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
Keep service role key private. Do not prefix it with `NEXT_PUBLIC_`.

## 5. Run locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000/login`, then sign in using the admin user you created.

## 6. Roles
- `admin`: full dashboard and configuration access.
- `sales`: manage leads, products and knowledge content.
- `viewer`: read-only business data.

The app checks Supabase Auth session and `profiles.role`. RLS enforces the same access model at database level.

## 7. Security notes
- Login uses Supabase Auth password sign-in and cookie sessions via `@supabase/ssr`.
- Middleware refreshes sessions and protects app pages/API routes. Public webhook routes are exempt and must independently validate signatures before production use.
- Normal API requests use the user's cookie-bound anon client and RLS.
- Service role is isolated to server-side trusted operations/worker only.
- This is a foundation, not a completed production security audit. Add MFA, rate limiting, monitoring, webhook event signature validation, backups and restore testing before production.
