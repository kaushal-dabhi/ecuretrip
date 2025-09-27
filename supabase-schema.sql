-- Step 2: Minimal Schema for eCureTrip
-- Run this in your Supabase SQL Editor

-- Enable required extensions
create extension if not exists pgcrypto;
create extension if not exists uuid-ossp;

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('patient','doctor','admin')),
  full_name text, 
  email text unique
);

-- Treatments table
create table if not exists public.treatments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('oncology','pediatrics')),
  description text,
  base_price numeric(12,2),
  currency text default 'INR'
);

-- Patients table
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade
);

-- Cases table
create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  treatment_id uuid references public.treatments(id),
  status text not null check (status in ('new','quoted','accepted','closed')) default 'new',
  patient_notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Case files table
create table if not exists public.case_files (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  owner_profile_id uuid references public.profiles(id),
  path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamp with time zone default now()
);

-- Quotes table
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete cascade,
  prepared_by uuid references public.profiles(id),
  currency text default 'INR',
  total numeric(12,2),
  status text not null check (status in ('draft','sent','accepted')) default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.treatments enable row level security;
alter table public.patients enable row level security;
alter table public.cases enable row level security;
alter table public.case_files enable row level security;
alter table public.quotes enable row level security;

-- RLS Policies

-- Patient can see their own cases and files
create policy patient_cases on public.cases for select using (
  exists(select 1 from public.patients pt where pt.id = cases.patient_id and pt.profile_id = auth.uid())
);

create policy patient_files on public.case_files for select using (
  exists(select 1 from public.cases c join public.patients pt on pt.id=c.patient_id
         where case_files.case_id=c.id and pt.profile_id=auth.uid())
);

-- Admin helper function
create or replace function is_admin(uid uuid) returns boolean language sql as
$$ select exists(select 1 from public.profiles p where p.id=uid and p.role='admin') $$;

-- Admin policies (full access)
create policy admin_all_cases on public.cases for all using (is_admin(auth.uid()));
create policy admin_all_files on public.case_files for all using (is_admin(auth.uid()));
create policy admin_all_quotes on public.quotes for all using (is_admin(auth.uid()));
create policy admin_all_patients on public.patients for all using (is_admin(auth.uid()));
create policy admin_all_profiles on public.profiles for all using (is_admin(auth.uid()));

-- Doctor policies (can see cases assigned to them)
create policy doctor_cases on public.cases for select using (
  exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='doctor')
);

create policy doctor_quotes on public.quotes for all using (
  exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='doctor')
);

-- Public read access to treatments (for the treatments list page)
create policy public_treatments on public.treatments for select using (true);

-- Seed data: Five treatments
insert into public.treatments (name,category,description,base_price) values
('Breast cancer surgical consult','oncology','Initial consult and treatment plan',15000),
('Chemotherapy day care cycle','oncology','Per cycle day care charge',30000),
('Radiation therapy planning','oncology','Treatment planning session',25000),
('Pediatric leukemia consult','pediatrics','Initial pediatric hemato oncology consult',18000),
('Pediatric solid tumor second opinion','pediatrics','Specialist review with treatment plan',20000);

-- Create indexes for better performance
create index if not exists idx_cases_patient_id on public.cases(patient_id);
create index if not exists idx_cases_status on public.cases(status);
create index if not exists idx_case_files_case_id on public.case_files(case_id);
create index if not exists idx_quotes_case_id on public.quotes(case_id);
create index if not exists idx_profiles_role on public.profiles(role);
