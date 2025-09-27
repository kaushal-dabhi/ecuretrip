-- Medical Tourism & Teleconsultation Database Schema
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS uuid-ossp;

-- Add additional fields to profiles table for doctors
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specialty text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hospital text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS qualifications text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS languages text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consultation_fee numeric(10,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rating numeric(3,2) DEFAULT 4.5;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cases_completed integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS response_time text DEFAULT '2 hours';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS image_url text;

-- Medical Records table
CREATE TABLE IF NOT EXISTS public.medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES public.profiles(id),
  title text NOT NULL,
  record_type text NOT NULL CHECK (record_type IN ('general_checkup', 'dental', 'lab_results', 'prescription', 'specialist_consultation', 'surgery', 'emergency')),
  date_of_visit date NOT NULL,
  doctor_notes text,
  diagnosis text,
  treatment_plan text,
  follow_up_required boolean DEFAULT false,
  follow_up_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES public.profiles(id),
  appointment_type text NOT NULL CHECK (appointment_type IN ('in_person', 'teleconsultation', 'follow_up', 'emergency')),
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  duration_minutes integer DEFAULT 30,
  status text NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')) DEFAULT 'scheduled',
  meeting_link text, -- For teleconsultations
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Medical Tourism Packages table
CREATE TABLE IF NOT EXISTS public.medical_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('oncology', 'cardiology', 'orthopedics', 'neurology', 'dental', 'cosmetic', 'fertility', 'general')),
  base_price numeric(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  duration_days integer,
  includes text[], -- Array of included services
  hospital_id uuid, -- Reference to hospital
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Hospitals table
CREATE TABLE IF NOT EXISTS public.hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  country text NOT NULL,
  city text NOT NULL,
  accreditation text[], -- JCI, NABH, etc.
  specialties text[], -- Array of medical specialties
  contact_email text,
  contact_phone text,
  website text,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Medical Tourism Cases table (extends existing cases)
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS package_id uuid REFERENCES public.medical_packages(id);
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS hospital_id uuid REFERENCES public.hospitals(id);
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS travel_dates daterange;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS accommodation_required boolean DEFAULT false;
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS visa_assistance boolean DEFAULT false;

-- Teleconsultation Sessions table
CREATE TABLE IF NOT EXISTS public.teleconsultation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES public.profiles(id),
  session_start timestamp with time zone,
  session_end timestamp with time zone,
  duration_minutes integer,
  meeting_link text,
  recording_url text, -- If session was recorded
  notes text,
  prescription text,
  follow_up_required boolean DEFAULT false,
  status text NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Prescriptions table
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES public.profiles(id),
  medical_record_id uuid REFERENCES public.medical_records(id),
  prescription_date date NOT NULL,
  medications jsonb NOT NULL, -- Array of medications with dosage, frequency, etc.
  instructions text,
  valid_until date,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teleconsultation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Medical Records
CREATE POLICY "Patients can view own medical records" ON public.medical_records
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view assigned medical records" ON public.medical_records
    FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert medical records" ON public.medical_records
    FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update medical records" ON public.medical_records
    FOR UPDATE USING (auth.uid() = doctor_id);

-- RLS Policies for Appointments
CREATE POLICY "Patients can view own appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view assigned appointments" ON public.appointments
    FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can insert appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can update appointments" ON public.appointments
    FOR UPDATE USING (auth.uid() = doctor_id);

-- RLS Policies for Medical Packages (public read)
CREATE POLICY "Anyone can view active medical packages" ON public.medical_packages
    FOR SELECT USING (is_active = true);

-- RLS Policies for Hospitals (public read)
CREATE POLICY "Anyone can view active hospitals" ON public.hospitals
    FOR SELECT USING (is_active = true);

-- RLS Policies for Teleconsultation Sessions
CREATE POLICY "Patients can view own teleconsultation sessions" ON public.teleconsultation_sessions
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view assigned teleconsultation sessions" ON public.teleconsultation_sessions
    FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert teleconsultation sessions" ON public.teleconsultation_sessions
    FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update teleconsultation sessions" ON public.teleconsultation_sessions
    FOR UPDATE USING (auth.uid() = doctor_id);

-- RLS Policies for Prescriptions
CREATE POLICY "Patients can view own prescriptions" ON public.prescriptions
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view assigned prescriptions" ON public.prescriptions
    FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert prescriptions" ON public.prescriptions
    FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update prescriptions" ON public.prescriptions
    FOR UPDATE USING (auth.uid() = doctor_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_doctor_id ON public.medical_records(doctor_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_date ON public.medical_records(date_of_visit);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_teleconsultation_sessions_patient_id ON public.teleconsultation_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_teleconsultation_sessions_doctor_id ON public.teleconsultation_sessions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON public.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor_id ON public.prescriptions(doctor_id);

-- Seed data for medical packages
INSERT INTO public.medical_packages (name, description, category, base_price, duration_days, includes) VALUES
('Cardiac Surgery Package', 'Comprehensive cardiac surgery with pre and post-operative care', 'cardiology', 15000, 14, ARRAY['Surgery', 'Hospital stay', 'Pre-operative tests', 'Post-operative care', 'Medications']),
('Orthopedic Surgery Package', 'Joint replacement surgery with rehabilitation', 'orthopedics', 12000, 21, ARRAY['Surgery', 'Hospital stay', 'Physical therapy', 'Follow-up consultations', 'Medications']),
('Dental Implant Package', 'Complete dental implant procedure', 'dental', 3000, 7, ARRAY['Implant surgery', 'Crown placement', 'Follow-up visits', 'Medications']),
('Cosmetic Surgery Package', 'Plastic surgery procedures', 'cosmetic', 8000, 10, ARRAY['Surgery', 'Hospital stay', 'Follow-up consultations', 'Medications']),
('Fertility Treatment Package', 'IVF and fertility treatments', 'fertility', 5000, 14, ARRAY['Treatment', 'Monitoring', 'Medications', 'Follow-up consultations']);

-- Seed data for hospitals
INSERT INTO public.hospitals (name, location, country, city, accreditation, specialties, contact_email, contact_phone, website, description) VALUES
('Apollo Hospitals', 'Chennai, India', 'India', 'Chennai', ARRAY['JCI', 'NABH'], ARRAY['Cardiology', 'Oncology', 'Orthopedics', 'Neurology'], 'info@apollohospitals.com', '+91-44-28290200', 'https://www.apollohospitals.com', 'Leading multi-specialty hospital with world-class facilities'),
('Fortis Healthcare', 'Mumbai, India', 'India', 'Mumbai', ARRAY['JCI', 'NABH'], ARRAY['Cardiology', 'Oncology', 'Orthopedics', 'Transplant'], 'info@fortishealthcare.com', '+91-22-49254444', 'https://www.fortishealthcare.com', 'Premium healthcare services with advanced technology'),
('Bumrungrad International', 'Bangkok, Thailand', 'Thailand', 'Bangkok', ARRAY['JCI'], ARRAY['Cardiology', 'Oncology', 'Orthopedics', 'Cosmetic'], 'info@bumrungrad.com', '+66-2-011-2222', 'https://www.bumrungrad.com', 'International hospital serving patients from around the world'),
('Anadolu Medical Center', 'Istanbul, Turkey', 'Turkey', 'Istanbul', ARRAY['JCI'], ARRAY['Oncology', 'Cardiology', 'Orthopedics', 'Neurology'], 'info@anadolumedicalcenter.com', '+90-216-444-0-444', 'https://www.anadolumedicalcenter.com', 'Comprehensive cancer care and medical tourism services');

-- Note: Doctor profiles will be created when doctors register through the application
-- The profiles table has a foreign key constraint to auth.users, so we cannot insert
-- sample doctor profiles without corresponding user accounts in auth.users
-- 
-- To create sample doctors, you would need to:
-- 1. Create user accounts in Supabase Auth (through the dashboard or API)
-- 2. Then insert corresponding profiles with the same user IDs
--
-- For now, the doctors page will show an empty state until real doctors register
