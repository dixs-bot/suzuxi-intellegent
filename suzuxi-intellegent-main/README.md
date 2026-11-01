# Suzuki AI Sales Agent — v1.0

Starter fullstack CRM + AI sales assistant for Suzuki vehicle leads, focused on Bandung and surrounding areas.

## Included
- Next.js 15 + TypeScript + Tailwind dashboard
- Supabase schema for leads, conversations, messages, consent, knowledge, tasks and handoff reports
- AI response endpoint using OpenAI-compatible API
- Lead CRUD API and lead scoring
- Meta webhook verification/receiver scaffold
- WhatsApp Cloud API notification helper
- Background worker scaffold for scheduled tasks
- Human handoff workflow and activity logging

## Important operating boundaries
This project does **not** automate personal Facebook profiles or scrape private profiles/groups, harvest personal phone numbers, or send unsolicited bulk DMs. Use Meta's approved APIs, public/authorized sources, lead forms, and customer-initiated messaging. Record consent before follow-up. WhatsApp templates and messaging windows are controlled by Meta policy. AI identifies itself as a virtual assistant and transfers pricing/credit/stock commitments to a human when source data is missing.

## Requirements
- Node.js 20+
- Supabase project
- OpenAI API key (or compatible provider)
- Meta developer app + approved Page/Instagram Professional permissions
- WhatsApp Business Platform credentials for WhatsApp delivery

## Install
```bash
cp .env.example .env.local
npm install
```
Fill `.env.local`, then run SQL in `supabase/migrations/001_initial_schema.sql` using Supabase SQL Editor.

```bash
npm run dev
```
Open http://localhost:3000.

## Build
```bash
npm run build
npm start
```

## Worker
The worker is a minimal queue processor scaffold. For production, deploy it as a separate long-running service (Render, Railway, Fly.io, VPS, etc.), not as a Vercel function.
```bash
npm run worker
```
Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the worker environment.

## Meta webhooks
Configure the callback URL:
`https://YOUR_DOMAIN/api/webhooks/meta`
Use `META_VERIFY_TOKEN` as the verification token. Subscribe only to products/events your Meta app has permission to receive. Complete Meta App Review and business verification where required.

## WhatsApp
Configure:
`https://YOUR_DOMAIN/api/webhooks/whatsapp`
Use `WHATSAPP_VERIFY_TOKEN`. Outbound owner alerts require `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and `WHATSAPP_OWNER_NUMBER`. For customer-initiated conversations, obey the current WhatsApp service window and approved template requirements.

## AI knowledge
Add verified product details, current price lists, promotions, DP/installment simulations and branch contact details in the Knowledge Center. The starter deliberately does not invent current prices, stock, discounts or financing approvals.

## Production checklist
- Add Supabase Auth and enforce admin roles before exposing dashboard/API publicly.
- Store secrets only in server environment variables; never expose service role key.
- Enable RLS and test policies with anon/authenticated roles.
- Validate Meta webhook signatures using `META_APP_SECRET` before processing production events.
- Add rate limiting, queue retries, dead-letter handling and monitoring.
- Complete Meta permissions/app review and WhatsApp business setup.
- Configure privacy notice, consent capture, retention/deletion process and opt-out handling.
- Add real product/price sources and human approval for sensitive sales claims.

## Current version status
The dashboard runs with demo fallback data when Supabase is not configured. Database-backed operations become active after environment setup and migration. Social and WhatsApp integrations are scaffolds that require credentials, webhook subscriptions and platform approvals.

## v1.1 Authentication & Supabase
See `docs/SETUP_SUPABASE_AUTH.md` and run migration `002_auth_rls_hardening.sql` after the initial schema. Create the first admin manually in Supabase Auth and insert its UUID into `profiles`. Public signups should stay disabled. Normal dashboard/API requests use the user's cookie-bound Supabase client and RLS. The service-role key is server/worker-only.

### Important v1.1 status
The admin login and cookie session are implemented with Supabase Auth. Run both SQL migrations and create the first admin profile manually as documented. Product and knowledge list views now read Supabase data. The Meta and WhatsApp webhook handlers verify HMAC signatures when `META_APP_SECRET` is set; event-to-inbox processing remains a follow-up implementation.
