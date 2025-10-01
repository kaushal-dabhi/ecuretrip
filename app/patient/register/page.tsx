'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { signUpPatient } from '@/lib/auth'
import { validateEmail, validatePassword } from '@/lib/security'

interface PatientFormData {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  phone: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  nationality: string
  emergency_contact_name: string
  emergency_contact_phone: string
  medical_conditions: string
  allergies: string
  current_medications: string
  preferred_language: 'en' | 'sw' | 'fr'
}

export default function PatientRegistration() {
  const router = useRouter()
  const [formData, setFormData] = useState<PatientFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: 'male',
    nationality: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: '',
    allergies: '',
    current_medications: '',
    preferred_language: 'en'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors.join(', ')
      }
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Required fields
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required'
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required'
    }

    if (!formData.emergency_contact_name.trim()) {
      newErrors.emergency_contact_name = 'Emergency contact name is required'
    }

    if (!formData.emergency_contact_phone.trim()) {
      newErrors.emergency_contact_phone = 'Emergency contact phone is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      const { password, confirmPassword, ...userData } = formData
      
      await signUpPatient(formData.email, formData.password, userData)
      
      // Redirect to dashboard with success message
      router.push('/patient/dashboard?registered=true')
    } catch (error: any) {
      console.error('Registration error:', error)
      setErrors({ 
        general: error.message || 'Registration failed. Please try again.' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopUtilityBar />
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Patient Registration
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join eCureTrip to access world-class medical care. Fill out the form below to create your account.
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                      errors.full_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-slate-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                      errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date_of_birth && (
                    <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-2">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium text-slate-700 mb-2">
                    Nationality *
                  </label>
                  <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                      errors.nationality ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your nationality"
                  />
                  {errors.nationality && (
                    <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>
                  )}
                </div>
              </div>

              {/* Password Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Create a strong password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-slate-700 mb-2">
                      Emergency Contact Name *
                    </label>
                    <input
                      type="text"
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                        errors.emergency_contact_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Emergency contact full name"
                    />
                    {errors.emergency_contact_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Emergency Contact Phone *
                    </label>
                    <input
                      type="tel"
                      id="emergency_contact_phone"
                      name="emergency_contact_phone"
                      value={formData.emergency_contact_phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                        errors.emergency_contact_phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.emergency_contact_phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Medical Information (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="medical_conditions" className="block text-sm font-medium text-slate-700 mb-2">
                      Medical Conditions
                    </label>
                    <textarea
                      id="medical_conditions"
                      name="medical_conditions"
                      value={formData.medical_conditions}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049]"
                      placeholder="List any existing medical conditions..."
                    />
                  </div>

                  <div>
                    <label htmlFor="allergies" className="block text-sm font-medium text-slate-700 mb-2">
                      Allergies
                    </label>
                    <textarea
                      id="allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049]"
                      placeholder="List any allergies..."
                    />
                  </div>

                  <div>
                    <label htmlFor="current_medications" className="block text-sm font-medium text-slate-700 mb-2">
                      Current Medications
                    </label>
                    <textarea
                      id="current_medications"
                      name="current_medications"
                      value={formData.current_medications}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049]"
                      placeholder="List current medications..."
                    />
                  </div>

                  <div>
                    <label htmlFor="preferred_language" className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Language
                    </label>
                    <select
                      id="preferred_language"
                      name="preferred_language"
                      value={formData.preferred_language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049]"
                    >
                      <option value="en">English</option>
                      <option value="sw">Swahili</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2A4049] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1F2F35] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
                
                <p className="mt-4 text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link href="/signin" className="text-[#2A4049] hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
