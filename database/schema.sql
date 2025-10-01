-- eCureTrip Database Schema
-- This script sets up the complete database schema for the eCureTrip platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin', 'hospital_admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'rescheduled');
CREATE TYPE appointment_type AS ENUM ('consultation', 'follow-up', 'emergency', 'surgery');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('stripe', 'mpesa', 'mobile_money', 'bank_transfer');
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'whatsapp', 'push', 'in_app');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'delivered', 'failed');
CREATE TYPE language_preference AS ENUM ('en', 'sw', 'fr');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    full_name TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    nationality TEXT,
    preferred_language language_preference DEFAULT 'en',
    
    -- Patient-specific fields
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    medical_conditions TEXT,
    allergies TEXT,
    current_medications TEXT,
    
    -- Doctor-specific fields
    specialty TEXT,
    hospital TEXT,
    experience TEXT,
    qualifications TEXT, -- JSON array of qualifications
    languages TEXT, -- JSON array of languages spoken
    consultation_fee DECIMAL(10,2),
    rating DECIMAL(3,2) DEFAULT 0.0,
    cases_completed INTEGER DEFAULT 0,
    response_time TEXT,
    verified BOOLEAN DEFAULT FALSE,
    bio TEXT,
    available_hours TEXT, -- JSON object with availability
    image_url TEXT,
    
    -- Common fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    appointment_type appointment_type NOT NULL DEFAULT 'consultation',
    status appointment_status NOT NULL DEFAULT 'scheduled',
    consultation_fee DECIMAL(10,2) DEFAULT 0.0,
    notes TEXT,
    symptoms TEXT,
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique appointment slots for doctors
    UNIQUE(doctor_id, appointment_date, appointment_time, status) DEFERRABLE INITIALLY DEFERRED
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_method payment_method NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'pending',
    
    -- Payment provider specific fields
    stripe_payment_intent_id TEXT,
    mpesa_receipt_number TEXT,
    mobile_money_reference TEXT,
    bank_transfer_reference TEXT,
    
    -- Payment tracking
    payment_date TIMESTAMP WITH TIME ZONE,
    refund_date TIMESTAMP WITH TIME ZONE,
    refund_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('appointment', 'payment', 'system', 'emergency')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional data for the notification
    channel notification_channel NOT NULL,
    status notification_status NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical records table (for storing patient medical documents)
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table (for compliance and security tracking)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospital partnerships table
CREATE TABLE hospital_partnerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_name TEXT NOT NULL,
    location TEXT NOT NULL,
    specialties TEXT[], -- Array of specialties
    rating DECIMAL(3,2) DEFAULT 0.0,
    image_url TEXT,
    description TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    accreditation TEXT[],
    languages_supported TEXT[],
    insurance_accepted TEXT[],
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatment packages table
CREATE TABLE treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    category TEXT NOT NULL,
    duration_days INTEGER DEFAULT 1,
    hospital_name TEXT,
    included_services TEXT[], -- Array of included services
    excluded_services TEXT[], -- Array of excluded services
    pre_treatment_requirements TEXT,
    post_treatment_care TEXT,
    success_rate DECIMAL(5,2),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_specialty ON profiles(specialty) WHERE specialty IS NOT NULL;
CREATE INDEX idx_profiles_hospital ON profiles(hospital) WHERE hospital IS NOT NULL;

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);

CREATE INDEX idx_payments_patient ON payments(patient_id);
CREATE INDEX idx_payments_doctor ON payments(doctor_id);
CREATE INDEX idx_payments_appointment ON payments(appointment_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_method ON payments(payment_method);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created ON notifications(created_at);

CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_appointment ON medical_records(appointment_id);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

CREATE INDEX idx_treatments_category ON treatments(category);
CREATE INDEX idx_treatments_active ON treatments(active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hospital_partnerships_updated_at BEFORE UPDATE ON hospital_partnerships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON treatments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Doctors can view other doctors" ON profiles FOR SELECT USING (role = 'doctor' AND auth.uid() IN (SELECT id FROM profiles WHERE role = 'doctor'));

-- Appointments RLS Policies
CREATE POLICY "Users can view their own appointments" ON appointments FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);
CREATE POLICY "Patients can create appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Users can update their own appointments" ON appointments FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Payments RLS Policies
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);
CREATE POLICY "Patients can create payments" ON payments FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Users can update their own payments" ON payments FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Notifications RLS Policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Medical Records RLS Policies
CREATE POLICY "Users can view their own medical records" ON medical_records FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);
CREATE POLICY "Doctors can create medical records" ON medical_records FOR INSERT WITH CHECK (auth.uid() = doctor_id AND auth.uid() IN (SELECT id FROM profiles WHERE role = 'doctor'));

-- Audit Logs RLS Policies (admin only)
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Public tables (no RLS needed)
-- hospital_partnerships and treatments are public data

-- Insert sample data
INSERT INTO hospital_partnerships (hospital_name, location, specialties, rating, description, contact_email, contact_phone, website, accreditation, languages_supported, insurance_accepted) VALUES
('Apollo Hospitals', 'Mumbai', ARRAY['Radiology', 'Cardiology', 'Oncology', 'Neurology'], 4.8, 'Leading multi-specialty hospital with state-of-the-art facilities', 'info@apollohospitals.com', '+91-22-12345678', 'https://www.apollohospitals.com', ARRAY['JCI', 'NABH'], ARRAY['English', 'Hindi', 'Marathi', 'Gujarati'], ARRAY['Cigna', 'Aetna', 'Blue Cross']),
('Fortis Healthcare', 'Delhi', ARRAY['Pediatrics', 'Orthopedics', 'Cardiology'], 4.7, 'Comprehensive healthcare services with expert medical professionals', 'contact@fortishealthcare.com', '+91-11-98765432', 'https://www.fortishealthcare.com', ARRAY['NABH', 'ISO 9001'], ARRAY['English', 'Hindi'], ARRAY['Cigna', 'Aetna']),
('Max Healthcare', 'Bangalore', ARRAY['Oncology', 'Neurology', 'Cardiology'], 4.6, 'Advanced medical care with cutting-edge technology', 'info@maxhealthcare.com', '+91-80-87654321', 'https://www.maxhealthcare.com', ARRAY['JCI', 'NABH'], ARRAY['English', 'Hindi', 'Kannada'], ARRAY['Cigna', 'Blue Cross']),
('Manipal Hospitals', 'Pune', ARRAY['Cardiology', 'Orthopedics', 'Gastroenterology'], 4.5, 'Trusted healthcare provider with comprehensive medical services', 'contact@manipalhospitals.com', '+91-20-76543210', 'https://www.manipalhospitals.com', ARRAY['NABH', 'ISO 9001'], ARRAY['English', 'Hindi', 'Marathi'], ARRAY['Aetna', 'Blue Cross']);

INSERT INTO treatments (name, description, base_price, currency, category, duration_days, hospital_name, included_services, excluded_services, pre_treatment_requirements, post_treatment_care, success_rate, active) VALUES
('MRI Brain Scan', 'High-resolution MRI scan of the brain for diagnostic purposes', 15000, 'INR', 'Radiology', 1, 'Apollo Hospitals', ARRAY['MRI scan', 'Radiologist consultation', 'Report delivery'], ARRAY['Contrast injection', 'Sedation'], 'Fasting not required, remove metal objects', 'No special care required', 99.5, TRUE),
('CT Scan Chest', 'Comprehensive CT scan of the chest for lung and heart evaluation', 8000, 'INR', 'Radiology', 1, 'Apollo Hospitals', ARRAY['CT scan', 'Radiologist consultation', 'Report delivery'], ARRAY['Contrast injection'], 'Fasting may be required', 'No special care required', 98.8, TRUE),
('Pediatric Health Checkup', 'Complete pediatric health examination and consultation', 2500, 'INR', 'Pediatrics', 1, 'Fortis Healthcare', ARRAY['Physical examination', 'Growth assessment', 'Vaccination review', 'Nutrition counseling'], ARRAY['Lab tests', 'Imaging'], 'No special preparation needed', 'Follow-up as recommended', 99.2, TRUE),
('Pediatric Vaccination Package', 'Comprehensive vaccination program for children', 5000, 'INR', 'Pediatrics', 1, 'Fortis Healthcare', ARRAY['Vaccination administration', 'Vaccination record', 'Follow-up scheduling'], ARRAY['Pre-vaccination tests'], 'No special preparation needed', 'Monitor for any reactions', 99.8, TRUE),
('Ultrasound Abdomen', 'Ultrasound imaging of the abdominal organs', 3000, 'INR', 'Radiology', 1, 'Apollo Hospitals', ARRAY['Ultrasound scan', 'Radiologist consultation', 'Report delivery'], ARRAY['Contrast injection'], 'Fasting may be required', 'No special care required', 98.5, TRUE),
('Child Development Assessment', 'Assessment of child development milestones and early intervention', 4000, 'INR', 'Pediatrics', 1, 'Fortis Healthcare', ARRAY['Developmental assessment', 'Parent counseling', 'Intervention planning'], ARRAY['Lab tests', 'Imaging'], 'No special preparation needed', 'Follow recommended interventions', 95.0, TRUE);

-- Create views for common queries
CREATE VIEW doctor_profiles AS
SELECT 
    p.*,
    hp.hospital_name as hospital_details,
    hp.location as hospital_location
FROM profiles p
LEFT JOIN hospital_partnerships hp ON p.hospital = hp.hospital_name
WHERE p.role = 'doctor';

CREATE VIEW appointment_details AS
SELECT 
    a.*,
    p.full_name as patient_name,
    p.email as patient_email,
    p.phone as patient_phone,
    d.full_name as doctor_name,
    d.specialty as doctor_specialty,
    d.hospital as doctor_hospital
FROM appointments a
JOIN profiles p ON a.patient_id = p.id
JOIN profiles d ON a.doctor_id = d.id;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
