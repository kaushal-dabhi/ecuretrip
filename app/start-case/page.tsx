'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ArrowLeft, Mail, Lock, User, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

type Step = 'role' | 'email' | 'otp' | 'profile' | 'case-form' | 'success'

export default function StartCasePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const treatmentId = searchParams.get('treatment')
  
  const [step, setStep] = useState<Step>('role')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Role selection state
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | null>(null)
  
  // Function to start fresh (clear session and start new registration)
  const startFresh = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      
      // Clear all state
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setOtp('')
      setFullName('')
      setSpecialty('')
      setHospital('')
      setExperience('')
      setPatientNotes('')
      setSelectedRole(null)
      setError(null)
      setSuccess(null)
      setLoading(false)
      
      // Start with role selection
      setStep('role')
    } catch (err) {
      console.error('Error signing out:', err)
      // Even if signout fails, clear state and start fresh
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setOtp('')
      setFullName('')
      setSpecialty('')
      setHospital('')
      setExperience('')
      setPatientNotes('')
      setSelectedRole(null)
      setError(null)
      setSuccess(null)
      setLoading(false)
      setStep('role')
    }
  }
  
  // Email and password state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  
  // Profile state
  const [fullName, setFullName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [hospital, setHospital] = useState('')
  const [experience, setExperience] = useState('')
  
  // Case form state
  const [patientNotes, setPatientNotes] = useState('')
  
  // Treatment data
  const [treatment, setTreatment] = useState<any>(null)

  async function checkAuthStatus() {
    try {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      if (user) {
        // Check if user has a profile, if not go to profile creation
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          // User exists, redirect to appropriate dashboard
          setSelectedRole(profile.role as 'patient' | 'doctor')
          
          if (profile.role === 'patient') {
            const { data: patient } = await supabase
              .from('patients')
              .select('*')
              .eq('profile_id', user.id)
              .single()

            if (patient) {
              // Patient exists, redirect to patient dashboard
              router.push('/patient/dashboard')
            } else {
              // Create patient record and redirect to dashboard
              await createPatientRecord(user.id)
              router.push('/patient/dashboard')
            }
          } else if (profile.role === 'doctor') {
            // Doctor exists, redirect to doctor dashboard
            router.push('/doctor/dashboard')
          }
        } else {
          // No profile exists, start fresh with email
          setStep('email')
        }
      } else {
        // No user, start with role selection
        setStep('email')
      }
    } catch (err: any) {
      console.error('Error checking auth status:', err)
      // On error, start with email
      setStep('email')
    }
  }

  useEffect(() => {
    // Always start with role selection for new registrations
    // Don't auto-check auth status to allow fresh registrations
    setStep('role')
    
    // Fetch treatment details if treatmentId is provided
    if (treatmentId) {
      fetchTreatment()
    }
  }, [treatmentId])

  useEffect(() => {
    // Check URL parameters for step, email, and role
    const urlStep = searchParams.get('step')
    const urlEmail = searchParams.get('email')
    const urlRole = searchParams.get('role')
    
    if (urlStep === 'profile' && urlEmail) {
      setEmail(urlEmail)
      if (urlRole) {
        setSelectedRole(urlRole as 'patient' | 'doctor')
      }
      setStep('profile')
    } else {
      // If no URL parameters, start with role selection
      setStep('role')
    }
  }, [searchParams])


  async function fetchTreatment() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .eq('id', treatmentId)
        .single()

      if (error) throw error
      setTreatment(data)
    } catch (err) {
      console.error('Error fetching treatment:', err)
    }
  }

  async function createAccount() {
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!password.trim()) {
      setError('Please enter a password')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Create user account with email and password
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          setError('An account with this email already exists. Please use "Sign In" to access your account.')
        } else {
          throw error
        }
        return
      }

      if (data.user && !data.user.email_confirmed_at) {
        setSuccess('Account created! Please check your email for verification link, then continue with profile setup.')
        setStep('otp')
      } else {
        // Email is already confirmed, proceed to profile
        setStep('profile')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  async function verifyOTP() {
    if (!otp.trim()) {
      setError('Please enter the OTP')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email'
      })

      if (error) throw error

      setSuccess('OTP verified successfully')
      
      // Check if user has a profile, if not go to profile creation
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profile) {
        // User exists, redirect to appropriate dashboard
        if (profile.role === 'patient') {
          const { data: patient } = await supabase
            .from('patients')
            .select('*')
            .eq('profile_id', data.user.id)
            .single()

          if (patient) {
            // Patient exists, redirect to patient dashboard
            router.push('/patient/dashboard')
          } else {
            // Create patient record and redirect to dashboard
            await createPatientRecord(data.user.id)
            router.push('/patient/dashboard')
          }
        } else if (profile.role === 'doctor') {
          // Doctor exists, redirect to doctor dashboard
          router.push('/doctor/dashboard')
        }
      } else {
        // No profile exists, go to profile creation
        setStep('profile')
      }
      
      // Clear loading state after successful verification
      setLoading(false)
    } catch (err: any) {
      console.error('Error checking auth status:', err)
      setError('OTP verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function createProfile() {
    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('User not authenticated')

      // Create profile - first check if it already exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        throw profileCheckError
      }

      // Only create profile if it doesn't exist
      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: fullName.trim(),
            role: selectedRole || 'patient'
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          throw new Error(`Failed to create profile: ${profileError.message}`)
        }
      } else {
        // Update existing profile with new name
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: fullName.trim()
          })
          .eq('id', user.id)

        if (updateError) {
          console.error('Profile update error:', updateError)
          throw new Error(`Failed to update profile: ${updateError.message}`)
        }
      }

      // Set success and move to profile completion step
      setSuccess('Account created successfully')
      setStep('profile')
    } catch (err: any) {
      console.error('Full error details:', err)
      console.error('Error message:', err.message)
      console.error('Error code:', err.code)
      console.error('Error details:', err.details)
      setError(err.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  async function createPatientRecord(profileId: string) {
    const supabase = createClient()
    
    // Check if patient record already exists
    const { data: existingPatient, error: patientCheckError } = await supabase
      .from('patients')
      .select('*')
      .eq('profile_id', profileId)
      .single()

    if (patientCheckError && patientCheckError.code !== 'PGRST116') {
      throw patientCheckError
    }

    // Only create patient record if it doesn't exist
    if (!existingPatient) {
      const { error } = await supabase
        .from('patients')
        .insert({
          profile_id: profileId
        })

      if (error) {
        console.error('Patient creation error:', error)
        throw new Error(`Failed to create patient record: ${error.message}`)
      }
    }
  }

  async function createCase() {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('User not authenticated')

      // Get patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('profile_id', user.id)
        .single()

      if (patientError) throw patientError

      // Create case
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          patient_id: patient.id,
          treatment_id: treatmentId,
          status: 'new',
          patient_notes: patientNotes.trim() || null
        })
        .select()
        .single()

      if (caseError) throw caseError

      setSuccess('Case created successfully!')
      setStep('success')
      
      // Redirect to uploads page after a short delay
      setTimeout(() => {
        router.push(`/patient/case/${caseData.id}/uploads`)
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Failed to create case')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 'role':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose Your Role</h2>
              <p className="text-gray-600">
                Are you a patient seeking medical care or a doctor providing services?
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setSelectedRole('patient')
                  setStep('email')
                }}
                className="w-full p-6 border-2 border-[#FECA58]/30 rounded-xl hover:border-[#FECA58] hover:bg-[#FFF3D4] transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#FECA58] rounded-full flex items-center justify-center group-hover:bg-[#FECA58]/80 transition-colors">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#145263]">I'm a Patient</h3>
                    <p className="text-sm text-slate-600">I need medical treatment or consultation</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedRole('doctor')
                  setStep('email')
                }}
                className="w-full p-6 border-2 border-[#FECA58]/30 rounded-xl hover:border-[#FECA58] hover:bg-[#FFF3D4] transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#145263] rounded-full flex items-center justify-center group-hover:bg-[#145263]/80 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#145263]">I'm a Doctor</h3>
                    <p className="text-sm text-slate-600">I provide medical services and consultations</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/signin" className="text-[#145263] hover:text-[#0F3A47] font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        )

      case 'email':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {selectedRole === 'patient' ? 'Create Patient Account' : 'Create Doctor Account'}
                  </h2>
                  <p className="text-gray-600">
                    Enter your email and password to create a new {selectedRole} account and begin your medical journey
                  </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  icon={Mail}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a secure password"
                  icon={Lock}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  icon={Lock}
                  className="w-full"
                />
              </div>

              {treatment && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Treatment:</strong> {treatment.name}
                  </p>
                  {treatment.base_price && (
                    <p className="text-sm text-blue-800">
                      <strong>Price:</strong> ₹{treatment.base_price.toLocaleString()}
                    </p>
                  )}
                </div>
              )}

                  <Button
                    onClick={createAccount}
                    loading={loading}
                    className="w-full bg-[#145263] hover:bg-[#0F3A47] text-white"
                    size="lg"
                    disabled={!selectedRole}
                  >
                    Create {selectedRole === 'patient' ? 'Patient' : 'Doctor'} Account
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <Link href="/signin" className="text-[#145263] hover:text-[#0F3A47] font-medium">
                        Sign In
                      </Link>
                    </p>
                  </div>
            </div>
          </div>
        )

      case 'otp':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Enter OTP Code</h2>
              <p className="text-gray-600">
                We've sent a 6-digit OTP code to <strong>{email}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code
                </label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  icon={Lock}
                  className="w-full text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    setStep('email')
                    setOtp('')
                    setError(null)
                    setSuccess(null)
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  Didn't receive the code? Try again
                </button>
              </div>

              <Button
                onClick={verifyOTP}
                loading={loading}
                className="w-full bg-[#145263] hover:bg-[#0F3A47] text-white"
                size="lg"
              >
                Verify OTP
              </Button>
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`w-16 h-16 ${selectedRole === 'doctor' ? 'bg-purple-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <User className={`w-8 h-8 ${selectedRole === 'doctor' ? 'text-purple-600' : 'text-blue-600'}`} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Complete Your {selectedRole === 'doctor' ? 'Doctor' : 'Patient'} Profile
              </h2>
              <p className="text-gray-600">
                {selectedRole === 'doctor' 
                  ? 'Help us verify your medical credentials and connect you with patients'
                  : 'Help us personalize your medical care experience'
                }
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  icon={User}
                  className="w-full"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {email}
                </p>
              </div>

              {selectedRole === 'doctor' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Specialty
                    </label>
                    <Input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="e.g., Cardiology, Orthopedics, Oncology"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital/Clinic
                    </label>
                    <Input
                      type="text"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      placeholder="Name of your hospital or clinic"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <Input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g., 10+ years"
                      className="w-full"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={createProfile}
                loading={loading}
                className="w-full bg-[#145263] hover:bg-[#0F3A47] text-white"
                size="lg"
              >
                Complete {selectedRole === 'doctor' ? 'Doctor' : 'Patient'} Profile
              </Button>
            </div>
          </div>
        )

      case 'case-form':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Tell Us About Your Case</h2>
              <p className="text-gray-600">
                Provide details about your medical condition or concerns
              </p>
            </div>

            <div className="space-y-4">
              {treatment && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Selected Treatment:</strong> {treatment.name}
                  </p>
                  {treatment.description && (
                    <p className="text-sm text-blue-700 mt-1">{treatment.description}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Notes (Optional)
                </label>
                <textarea
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  placeholder="Describe your symptoms, medical history, or any specific concerns..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This information will help our medical team provide better care
                </p>
              </div>

              <Button
                onClick={createCase}
                loading={loading}
                className="w-full bg-[#145263] hover:bg-[#0F3A47] text-white"
                size="lg"
              >
                Create Case
              </Button>
            </div>
          </div>
        )

      case 'success':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Case Created Successfully!</h2>
              <p className="text-gray-600">
                Your medical case has been created and you'll be redirected to the uploads page shortly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Upload your medical documents</li>
                  <li>• Our team will review your case</li>
                  <li>• You'll receive a detailed quote</li>
                  <li>• Schedule your treatment</li>
                </ul>
              </div>

              <Button
                onClick={() => router.push('/treatments')}
                variant="outline"
                className="w-full"
              >
                Browse More Treatments
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopUtilityBar />
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-6">
            <Link href={treatmentId ? `/treatments/${treatmentId}` : '/treatments'}>
              <Button variant="ghost" icon={ArrowLeft} className="text-[#145263] hover:text-[#0F3A47]">
                Back
              </Button>
            </Link>
          </div>

          <Card className="max-w-lg mx-auto">
            <CardHeader className="pb-4">
              <div className="text-center">
                <h1 className="heading-3 text-slate-900 mb-2">
                {step === 'role' && 'Choose Your Role'}
                {step === 'email' && 'Create Your Account'}
                {step === 'otp' && 'Verify Your Email'}
                {step === 'profile' && 'Complete Your Profile'}
                {step === 'case-form' && 'Tell Us About Your Case'}
                {step === 'success' && 'Account Created!'}
                </h1>
                <p className="body text-slate-600">
                  {step === 'role' && 'Select whether you are a patient or doctor'}
                  {step === 'email' && 'Create your account to get started'}
                  {step === 'otp' && 'Check your email for verification code'}
                  {step === 'profile' && 'Complete your profile information'}
                  {step === 'case-form' && 'Share details about your medical case'}
                  {step === 'success' && 'Your account has been created successfully'}
                </p>
              </div>
            </CardHeader>
            <CardBody>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-800 text-sm">{success}</p>
                </div>
              )}

              {renderStep()}
            </CardBody>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}