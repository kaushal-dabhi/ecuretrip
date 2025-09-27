# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Choose **EU region** for better performance
3. Note down your project URL and anon key

## Step 2: Configure Authentication

1. In Supabase Dashboard → Authentication → Settings
2. Turn on **Email OTP** authentication
3. Configure email templates if needed

## Step 3: Create Storage Bucket

1. In Supabase Dashboard → Storage
2. Create a new bucket named `patient_uploads`
3. Set it to **Private**
4. Enable **Versioning**

## Step 4: Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Step 5: Database Schema

Run the SQL commands from Step 2 in the Supabase SQL Editor:

```sql
create extension if not exists pgcrypto;
create extension if not exists uuid-ossp;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('patient','doctor','admin')),
  full_name text, email text unique
);

create table if not exists public.treatments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('oncology','pediatrics')),
  description text,
  base_price numeric(12,2),
  currency text default 'INR'
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  treatment_id uuid references public.treatments(id),
  status text not null check (status in ('new','quoted','accepted','closed')) default 'new',
  patient_notes text
);

create table if not exists public.case_files (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  owner_profile_id uuid references public.profiles(id),
  path text not null,
  mime_type text,
  size_bytes bigint
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  prepared_by uuid references public.profiles(id),
  currency text default 'INR',
  total numeric(12,2),
  status text not null check (status in ('draft','sent','accepted')) default 'draft'
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.treatments enable row level security;
alter table public.patients enable row level security;
alter table public.cases enable row level security;
alter table public.case_files enable row level security;
alter table public.quotes enable row level security;

-- Add policies
create policy patient_cases on public.cases for select using (
  exists(select 1 from public.patients pt where pt.id = cases.patient_id and pt.profile_id = auth.uid())
);
create policy patient_files on public.case_files for select using (
  exists(select 1 from public.cases c join public.patients pt on pt.id=c.patient_id
         where case_files.case_id=c.id and pt.profile_id=auth.uid())
);

create or replace function is_admin(uid uuid) returns boolean language sql as
$$ select exists(select 1 from public.profiles p where p.id=uid and p.role='admin') $$;
create policy admin_all_cases on public.cases for all using (is_admin(auth.uid()));
create policy admin_all_files on public.case_files for all using (is_admin(auth.uid()));
create policy admin_all_quotes on public.quotes for all using (is_admin(auth.uid()));

-- Seed data
insert into public.treatments (name,category,description,base_price) values
('Breast cancer surgical consult','oncology','Initial consult and plan',15000),
('Chemotherapy day care cycle','oncology','Per cycle day care charge',30000),
('Radiation therapy planning','oncology','Treatment planning session',25000),
('Pediatric leukemia consult','pediatrics','Initial pediatric hemato oncology consult',18000),
('Pediatric solid tumor second opinion','pediatrics','Specialist review with plan',20000);
```

## Step 6: Test Connection

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/test-supabase`
3. You should see 5 treatments loaded from the database

## Next Steps

Once the test page works, you can proceed with:
- Step 3: Create treatments list and detail pages
- Step 4: Implement patient case creation with OTP
- Step 5: Add file upload functionality
- Step 6: Build doctor quote system
- Step 7: Add finance tracking
