'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { signInPatient } from '@/lib/auth'

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/patient/dashboard'
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.email) {
      newErrors.email = 'Email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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
      await signInPatient(formData.email, formData.password)
      
      // Redirect to the intended page or dashboard
      router.push(redirect)
    } catch (error: any) {
      console.error('Sign in error:', error)
      setErrors({ 
        general: error.message || 'Sign in failed. Please check your credentials and try again.' 
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
        <div className="max-w-md mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Sign In
            </h1>
            <p className="text-slate-600">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          {/* Sign In Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
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
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
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
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#2A4049] focus:ring-[#2A4049] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-[#2A4049] hover:text-[#1F2F35]"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2A4049] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#1F2F35] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to eCureTrip?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/patient/register"
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Create Patient Account
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Are you a doctor?{' '}
              <Link
                href="/doctor/signin"
                className="font-medium text-[#2A4049] hover:text-[#1F2F35]"
              >
                Doctor Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}