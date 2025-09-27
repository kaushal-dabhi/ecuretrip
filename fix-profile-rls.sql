-- Fix RLS policies for profile creation
-- This script ensures that users can create their own profiles

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Enable RLS on patients table
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own patient record" ON patients;
DROP POLICY IF EXISTS "Users can insert own patient record" ON patients;
DROP POLICY IF EXISTS "Users can update own patient record" ON patients;

-- Create policies for patients table
CREATE POLICY "Users can view own patient record" ON patients
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own patient record" ON patients
    FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own patient record" ON patients
    FOR UPDATE USING (auth.uid() = profile_id);

-- Enable RLS on cases table
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own cases" ON cases;
DROP POLICY IF EXISTS "Users can insert own cases" ON cases;
DROP POLICY IF EXISTS "Users can update own cases" ON cases;

-- Create policies for cases table
CREATE POLICY "Users can view own cases" ON cases
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM patients p 
            WHERE p.id = cases.patient_id 
            AND p.profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own cases" ON cases
    FOR INSERT WITH CHECK (
        EXISTS(
            SELECT 1 FROM patients p 
            WHERE p.id = cases.patient_id 
            AND p.profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own cases" ON cases
    FOR UPDATE USING (
        EXISTS(
            SELECT 1 FROM patients p 
            WHERE p.id = cases.patient_id 
            AND p.profile_id = auth.uid()
        )
    );

-- Enable RLS on case_files table
ALTER TABLE case_files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own case files" ON case_files;
DROP POLICY IF EXISTS "Users can insert own case files" ON case_files;
DROP POLICY IF EXISTS "Users can update own case files" ON case_files;

-- Create policies for case_files table
CREATE POLICY "Users can view own case files" ON case_files
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM cases c 
            JOIN patients p ON p.id = c.patient_id
            WHERE case_files.case_id = c.id 
            AND p.profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own case files" ON case_files
    FOR INSERT WITH CHECK (
        EXISTS(
            SELECT 1 FROM cases c 
            JOIN patients p ON p.id = c.patient_id
            WHERE case_files.case_id = c.id 
            AND p.profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own case files" ON case_files
    FOR UPDATE USING (
        EXISTS(
            SELECT 1 FROM cases c 
            JOIN patients p ON p.id = c.patient_id
            WHERE case_files.case_id = c.id 
            AND p.profile_id = auth.uid()
        )
    );

-- Enable RLS on quotes table
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can insert own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can update own quotes" ON quotes;

-- Create policies for quotes table
CREATE POLICY "Users can view own quotes" ON quotes
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM cases c 
            JOIN patients p ON p.id = c.patient_id
            WHERE quotes.case_id = c.id 
            AND p.profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own quotes" ON quotes
    FOR INSERT WITH CHECK (
        EXISTS(
            SELECT 1 FROM cases c 
            JOIN patients p ON p.id = c.patient_id
            WHERE quotes.case_id = c.id 
            AND p.profile_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own quotes" ON quotes
    FOR UPDATE USING (
        EXISTS(
            SELECT 1 FROM cases c 
            JOIN patients p ON p.id = c.patient_id
            WHERE quotes.case_id = c.id 
            AND p.profile_id = auth.uid()
        )
    );

-- Create storage bucket for patient uploads (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient_uploads', 'patient_uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- Storage policies for patient_uploads bucket
-- Allow authenticated users to upload files to patient_uploads bucket
CREATE POLICY "Users can upload their own files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'patient_uploads' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'patient_uploads' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update their own files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'patient_uploads' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can delete their own files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'patient_uploads' AND
        auth.role() = 'authenticated'
    );

-- Note: Doctors are stored in the profiles table with role='doctor'
-- No separate doctors table exists in the current schema

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'patients', 'cases', 'case_files', 'quotes')
ORDER BY tablename, policyname;
