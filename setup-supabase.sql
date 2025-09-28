-- eCureTrip Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT CHECK (role IN ('patient', 'doctor', 'admin')) NOT NULL DEFAULT 'patient',
  full_name TEXT,
  email TEXT UNIQUE,
  specialty TEXT,
  hospital TEXT,
  experience TEXT,
  qualifications TEXT,
  languages TEXT,
  consultation_fee INTEGER,
  rating DECIMAL(2,1) DEFAULT 0.0,
  cases_completed INTEGER DEFAULT 0,
  response_time TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  price_usd INTEGER NOT NULL,
  inclusions TEXT[],
  exclusions TEXT[],
  addons JSONB,
  los_days INTEGER,
  refund_policy TEXT,
  milestones TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  country TEXT DEFAULT 'India',
  specialties TEXT[],
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  accreditation TEXT[],
  rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  treatment_id UUID REFERENCES treatments(id),
  status TEXT CHECK (status IN ('pending', 'consultation', 'treatment', 'completed', 'cancelled')) DEFAULT 'pending',
  description TEXT,
  medical_history TEXT,
  symptoms TEXT,
  diagnosis TEXT,
  treatment_plan TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  treatment_id UUID REFERENCES treatments(id),
  total_price INTEGER NOT NULL,
  breakdown JSONB,
  valid_until TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  type TEXT CHECK (type IN ('consultation', 'follow-up', 'treatment')) DEFAULT 'consultation',
  status TEXT CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')) DEFAULT 'scheduled',
  notes TEXT,
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table for chat
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'file', 'image')) DEFAULT 'text',
  file_url TEXT,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample treatments
INSERT INTO treatments (sku, title, price_usd, inclusions, exclusions, addons, los_days, refund_policy, milestones) VALUES
('TKR_STANDARD', 'Total Knee Replacement (Standard Implant)', 5200, 
 ARRAY['Surgeon fee', 'OR & anesthesia', '3 nights private room', 'Standard implant', 'Pre-op labs & imaging', 'Drugs & dressings', 'Physio consult'],
 ARRAY['Companion stay', 'Implant upgrade', '>3 nights LOS', 'Non-routine ICU', 'Comorbidity management'],
 '{"addons": [{"name": "Implant premium", "priceUSD": 900}, {"name": "Companion room", "priceUSD": 60, "per": "night"}]}'::jsonb,
 3, 'Full refund minus documented costs if medically contraindicated.',
 ARRAY['TeleConsult', 'Admission', 'Surgery', 'Discharge']),

('TKR_PREMIUM', 'Total Knee Replacement (Premium Implant)', 6100,
 ARRAY['Premium implant', 'Enhanced pain control', '4 nights private room'],
 ARRAY['Companion stay'],
 '{"addons": [{"name": "Companion room", "priceUSD": 75, "per": "night"}]}'::jsonb,
 4, 'Same as standard',
 ARRAY['TeleConsult', 'Admission', 'Surgery', 'Discharge']),

('ANGIOPLASTY', 'Coronary Angioplasty & Stent', 6800,
 ARRAY['Surgeon fee', 'OR & anesthesia', '2 nights ICU'],
 ARRAY['Companion stay', 'Premium stents', '>2 nights LOS'],
 '{"addons": [{"name": "Premium stent", "priceUSD": 1500}, {"name": "Companion room", "priceUSD": 80, "per": "night"}]}'::jsonb,
 2, 'Full refund minus costs if contraindicated.',
 ARRAY['TeleConsult', 'Admission', 'Surgery', 'Recovery', 'Discharge']),

('ACL_ARTHRO', 'ACL Reconstruction (Arthroscopic)', 2900,
 ARRAY['Surgeon fee', 'OR', '1 night'],
 ARRAY['ICU'],
 '{"addons": [{"name": "Allograft", "priceUSD": 450}]}'::jsonb,
 1, 'Refund minus costs if contraindicated.',
 ARRAY['TeleConsult', 'Admission', 'Surgery', 'Discharge']),

('CARDIAC_BYPASS', 'Cardiac Bypass Surgery', 8500,
 ARRAY['Surgeon fee', 'OR & anesthesia', '5 nights ICU'],
 ARRAY['Companion stay', 'Premium implants', '>5 nights LOS'],
 '{"addons": [{"name": "Premium graft", "priceUSD": 1200}, {"name": "Companion room", "priceUSD": 80, "per": "night"}]}'::jsonb,
 5, 'Full refund minus costs if contraindicated.',
 ARRAY['TeleConsult', 'Admission', 'Surgery', 'Recovery', 'Discharge']),

('SPINE_FUSION', 'Spine Fusion Surgery', 7200,
 ARRAY['Surgeon fee', 'OR & anesthesia', '4 nights private room'],
 ARRAY['Companion stay', 'Premium implants', '>4 nights LOS'],
 '{"addons": [{"name": "Premium implants", "priceUSD": 1500}, {"name": "Private nurse", "priceUSD": 100, "per": "night"}]}'::jsonb,
 4, 'Refund minus documented costs.',
 ARRAY['TeleConsult', 'Admission', 'Surgery', 'Recovery', 'Discharge']),

('IVF_CYCLE', 'IVF Cycle (Standard Protocol)', 3500,
 ARRAY['Consults', 'Monitoring', 'Egg retrieval'],
 ARRAY['PGT', 'Freezing >1yr'],
 '{"addons": [{"name": "PGT-A", "priceUSD": 800}, {"name": "ICSI", "priceUSD": 450}]}'::jsonb,
 0, 'Cycle cancellation cover optional.',
 ARRAY['TeleConsult', 'Admission', 'Surgery', 'Discharge']),

('THR_PREMIUM', 'Total Hip Replacement (Premium Implant)', 6200,
 ARRAY['Premium implant', '4 nights', 'Enhanced physio'],
 ARRAY['Companion'],
 '{"addons": [{"name": "Private nurse", "priceUSD": 100, "per": "night"}]}'::jsonb,
 4, 'Same as standard',
 ARRAY['TeleConsult', 'Admission', 'Surgery', 'Discharge']);

-- Insert sample hospitals
INSERT INTO hospitals (name, city, specialties, contact_email, contact_phone, website, accreditation, rating) VALUES
('Apollo Hospitals', 'Mumbai', ARRAY['Oncology', 'Cardiology', 'Orthopedics', 'Neurology'], 'contact@apollohospitals.com', '+91-22-2616-0100', 'https://www.apollohospitals.com', ARRAY['JCI', 'NABH'], 4.8),
('Fortis Healthcare', 'Delhi', ARRAY['Cardiology', 'Orthopedics', 'Neurology'], 'info@fortishealthcare.com', '+91-11-4711-1111', 'https://www.fortishealthcare.com', ARRAY['JCI', 'NABH'], 4.7),
('Bumrungrad International', 'Bangkok', ARRAY['Orthopedics', 'Cosmetic', 'Dental'], 'info@bumrungrad.com', '+66-2-066-8888', 'https://www.bumrungrad.com', ARRAY['JCI'], 4.9),
('Anadolu Medical Center', 'Istanbul', ARRAY['Neurology', 'Fertility', 'Oncology'], 'info@anadolumedicalcenter.com', '+90-216-578-4000', 'https://www.anadolumedicalcenter.com', ARRAY['JCI'], 4.6);

-- Enable Row Level Security on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

-- Create policies for treatments
CREATE POLICY "Treatments are viewable by everyone" ON treatments FOR SELECT USING (true);

-- Create policies for hospitals
CREATE POLICY "Hospitals are viewable by everyone" ON hospitals FOR SELECT USING (true);

-- Create policies for cases
CREATE POLICY "Users can view their own cases" ON cases FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);
CREATE POLICY "Users can create cases" ON cases FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Users can update their own cases" ON cases FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Create policies for quotes
CREATE POLICY "Users can view quotes for their cases" ON quotes FOR SELECT USING (
  EXISTS (SELECT 1 FROM cases WHERE cases.id = quotes.case_id AND (cases.patient_id = auth.uid() OR cases.doctor_id = auth.uid()))
);

-- Create policies for appointments
CREATE POLICY "Users can view their appointments" ON appointments FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);
CREATE POLICY "Users can create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = patient_id OR auth.uid() = doctor_id);
CREATE POLICY "Users can update their appointments" ON appointments FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Create policies for messages
CREATE POLICY "Users can view messages in their cases" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM cases WHERE cases.id = messages.case_id AND (cases.patient_id = auth.uid() OR cases.doctor_id = auth.uid()))
);
CREATE POLICY "Users can send messages in their cases" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND 
  EXISTS (SELECT 1 FROM cases WHERE cases.id = messages.case_id AND (cases.patient_id = auth.uid() OR cases.doctor_id = auth.uid()))
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
