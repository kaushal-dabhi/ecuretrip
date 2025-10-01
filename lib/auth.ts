import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { validateEmail, validatePassword } from './security'

// Create Supabase client for authentication
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// User types
export interface PatientProfile {
  id: string
  email: string
  full_name: string
  phone: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  nationality: string
  emergency_contact_name: string
  emergency_contact_phone: string
  medical_conditions?: string
  allergies?: string
  current_medications?: string
  preferred_language: 'en' | 'sw' | 'fr'
  created_at: string
  updated_at: string
}

export interface DoctorProfile {
  id: string
  email: string
  full_name: string
  specialty: string
  hospital: string
  experience: string
  qualifications: string
  languages: string
  consultation_fee: number
  rating: number
  cases_completed: number
  response_time: string
  verified: boolean
  image_url?: string
  bio?: string
  available_hours?: string
  created_at: string
  updated_at: string
}

// Authentication functions
export async function signUpPatient(email: string, password: string, userData: Partial<PatientProfile>) {
  try {
    // Validate email
    if (!validateEmail(email)) {
      throw new Error('Invalid email format')
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '))
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'patient',
          full_name: userData.full_name
        }
      }
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('Failed to create user')

    // Create patient profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        role: 'patient',
        full_name: userData.full_name,
        phone: userData.phone,
        date_of_birth: userData.date_of_birth,
        gender: userData.gender,
        nationality: userData.nationality,
        emergency_contact_name: userData.emergency_contact_name,
        emergency_contact_phone: userData.emergency_contact_phone,
        medical_conditions: userData.medical_conditions,
        allergies: userData.allergies,
        current_medications: userData.current_medications,
        preferred_language: userData.preferred_language || 'en'
      })

    if (profileError) throw profileError

    return { user: authData.user, profile: userData }
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

export async function signInPatient(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function getPatientProfile(userId: string): Promise<PatientProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('role', 'patient')
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Get patient profile error:', error)
    return null
  }
}

export async function updatePatientProfile(userId: string, updates: Partial<PatientProfile>) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .eq('role', 'patient')
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Update patient profile error:', error)
    throw error
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  } catch (error) {
    console.error('Reset password error:', error)
    throw error
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '))
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error
  } catch (error) {
    console.error('Update password error:', error)
    throw error
  }
}

// React hook for authentication (for client-side components)

// Check if user is authenticated
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}