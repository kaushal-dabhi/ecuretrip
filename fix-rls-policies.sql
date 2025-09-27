-- Fix RLS Policies for Profile Creation
-- Run this in your Supabase SQL Editor

-- First, let's check what policies exist
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Drop existing policies that might be blocking profile creation
DROP POLICY IF EXISTS "patient_cases" ON public.cases;
DROP POLICY IF EXISTS "patient_files" ON public.case_files;
DROP POLICY IF EXISTS "admin_all_cases" ON public.cases;
DROP POLICY IF EXISTS "admin_all_files" ON public.case_files;
DROP POLICY IF EXISTS "admin_all_quotes" ON public.quotes;
DROP POLICY IF EXISTS "admin_all_patients" ON public.patients;
DROP POLICY IF EXISTS "admin_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "doctor_cases" ON public.cases;
DROP POLICY IF EXISTS "doctor_quotes" ON public.quotes;
DROP POLICY IF EXISTS "public_treatments" ON public.treatments;

-- Create proper RLS policies that allow profile creation

-- 1. Profiles table policies
-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 2. Patients table policies
-- Allow users to insert their own patient record
CREATE POLICY "Users can insert their own patient record" ON public.patients
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND profile_id = auth.uid()
        )
    );

-- Allow users to view their own patient record
CREATE POLICY "Users can view their own patient record" ON public.patients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND profile_id = auth.uid()
        )
    );

-- Allow admins to view all patients
CREATE POLICY "Admins can view all patients" ON public.patients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 3. Cases table policies
-- Allow patients to view their own cases
CREATE POLICY "Patients can view their own cases" ON public.cases
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.patients 
            WHERE id = cases.patient_id AND profile_id = auth.uid()
        )
    );

-- Allow patients to insert their own cases
CREATE POLICY "Patients can insert their own cases" ON public.cases
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.patients 
            WHERE id = patient_id AND profile_id = auth.uid()
        )
    );

-- Allow doctors to view all cases
CREATE POLICY "Doctors can view all cases" ON public.cases
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'doctor'
        )
    );

-- Allow admins to manage all cases
CREATE POLICY "Admins can manage all cases" ON public.cases
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 4. Case files table policies
-- Allow patients to view their own case files
CREATE POLICY "Patients can view their own case files" ON public.case_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cases c
            JOIN public.patients p ON p.id = c.patient_id
            WHERE c.id = case_files.case_id AND p.profile_id = auth.uid()
        )
    );

-- Allow patients to insert their own case files
CREATE POLICY "Patients can insert their own case files" ON public.case_files
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.cases c
            JOIN public.patients p ON p.id = c.patient_id
            WHERE c.id = case_id AND p.profile_id = auth.uid()
        )
    );

-- Allow doctors to view case files for cases they can see
CREATE POLICY "Doctors can view case files" ON public.case_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cases c
            WHERE c.id = case_files.case_id
            AND EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role = 'doctor'
            )
        )
    );

-- Allow admins to manage all case files
CREATE POLICY "Admins can manage all case files" ON public.case_files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 5. Quotes table policies
-- Allow patients to view quotes for their cases
CREATE POLICY "Patients can view their quotes" ON public.quotes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cases c
            JOIN public.patients p ON p.id = c.patient_id
            WHERE c.id = quotes.case_id AND p.profile_id = auth.uid()
        )
    );

-- Allow doctors to manage quotes
CREATE POLICY "Doctors can manage quotes" ON public.quotes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'doctor'
        )
    );

-- Allow admins to manage all quotes
CREATE POLICY "Admins can manage all quotes" ON public.quotes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 6. Treatments table policies (public read access)
CREATE POLICY "Anyone can view treatments" ON public.treatments
    FOR SELECT USING (true);

-- 7. Finance notes table policies (if exists)
-- Allow admins to manage finance notes
CREATE POLICY "Admins can manage finance notes" ON public.finance_notes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow patients to view their finance notes
CREATE POLICY "Patients can view their finance notes" ON public.finance_notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.cases c
            JOIN public.patients p ON p.id = c.patient_id
            WHERE c.id = finance_notes.case_id AND p.profile_id = auth.uid()
        )
    );

-- Allow doctors to view finance notes for their quotes
CREATE POLICY "Doctors can view finance notes for their quotes" ON public.finance_notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quotes q
            WHERE q.id = finance_notes.quote_id
            AND EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role = 'doctor'
            )
        )
    );

-- Verify policies are created
-- SELECT tablename, policyname, cmd, qual FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
