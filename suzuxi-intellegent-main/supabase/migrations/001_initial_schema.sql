create extension if not exists "pgcrypto";

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text,
 role text not null default 'admin' check (role in ('admin','sales','viewer')),
 created_at timestamptz not null default now()
);

create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 model text,
 variant text,
 description text,
 price numeric,
 price_valid_until date,
 is_active boolean not null default true,
 source_url text,
 verified_at timestamptz,
 created_at timestamptz not null default now()
);

create table if not exists public.knowledge_documents (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 content text,
 source_type text not null default 'manual',
 source_url text,
 is_verified boolean not null default false,
 verified_at timestamptz,
 created_at timestamptz not null default now()
);

create table if not exists public.social_accounts (
 id uuid primary key default gen_random_uuid(),
 platform text not null check(platform in ('facebook_page','instagram_professional','whatsapp_business')),
 external_account_id text,
 display_name text,
 connection_status text not null default 'disconnected',
 token_reference text,
 created_at timestamptz not null default now()
);

create table if not exists public.leads (
 id uuid primary key default gen_random_uuid(),
 full_name text not null,
 phone text,
 email text,
 city text,
 source text,
 source_reference text,
 vehicle_interest text,
 buying_intent text,
 purchase_timeline text,
 budget_confirmed boolean not null default false,
 consent_to_contact boolean not null default false,
 consent_at timestamptz,
 consent_source text,
 lead_score integer not null default 0 check(lead_score between 0 and 100),
 lead_status text not null default 'new' check(lead_status in ('new','contacted','qualified','handoff','won','lost','do_not_contact')),
 notes text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.lead_consents (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references public.leads(id) on delete cascade,
 consent_type text not null,
 granted boolean not null,
 consent_text text,
 source text,
 created_at timestamptz not null default now()
);

create table if not exists public.conversations (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid references public.leads(id) on delete set null,
 platform text not null,
 external_thread_id text,
 status text not null default 'open' check(status in ('open','ai_handling','human_handoff','closed')),
 assigned_to uuid references public.profiles(id),
 last_message_at timestamptz,
 created_at timestamptz not null default now()
);

create table if not exists public.messages (
 id uuid primary key default gen_random_uuid(),
 conversation_id uuid not null references public.conversations(id) on delete cascade,
 direction text not null check(direction in ('inbound','outbound')),
 sender_type text not null check(sender_type in ('customer','ai','human','system')),
 body text not null,
 external_message_id text,
 created_at timestamptz not null default now()
);

create table if not exists public.lead_scores (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references public.leads(id) on delete cascade,
 score integer not null check(score between 0 and 100),
 temperature text not null check(temperature in ('hot','warm','cold')),
 rationale text,
 created_at timestamptz not null default now()
);

create table if not exists public.ai_tasks (
 id uuid primary key default gen_random_uuid(),
 task_type text not null,
 payload jsonb not null default '{}'::jsonb,
 status text not null default 'queued' check(status in ('queued','running','needs_review','completed','failed','cancelled')),
 run_after timestamptz not null default now(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.handoff_reports (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references public.leads(id) on delete cascade,
 summary text not null,
 channel text not null default 'dashboard',
 delivery_status text not null default 'pending',
 created_at timestamptz not null default now()
);

create table if not exists public.automation_logs (
 id uuid primary key default gen_random_uuid(),
 agent_name text not null,
 action text not null,
 status text not null,
 detail jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);

create table if not exists public.notification_settings (
 id uuid primary key default gen_random_uuid(),
 channel text not null,
 destination text,
 enabled boolean not null default false,
 created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_score_idx on public.leads(lead_score desc);
create index if not exists leads_status_idx on public.leads(lead_status);
create index if not exists conversations_lead_idx on public.conversations(lead_id);
create index if not exists messages_conversation_idx on public.messages(conversation_id,created_at);
create index if not exists ai_tasks_queue_idx on public.ai_tasks(status,run_after);

-- Enable RLS. Add policies only after implementing Supabase Auth role checks.
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.social_accounts enable row level security;
alter table public.leads enable row level security;
alter table public.lead_consents enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.lead_scores enable row level security;
alter table public.ai_tasks enable row level security;
alter table public.handoff_reports enable row level security;
alter table public.automation_logs enable row level security;
alter table public.notification_settings enable row level security;

-- No permissive client policies are added by default. Server-side service role is required.
