'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'patient' | 'doctor' | 'admin'
  fallbackUrl?: string
}

export default function AuthGuard({ 
  children, 
  requiredRole, 
  fallbackUrl = '/start-case' 
}: AuthGuardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    checkAuthentication()
  }, [router, requiredRole, fallbackUrl])

  async function checkAuthentication() {
    try {
      const supabase = createClient()
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        // Show login prompt instead of redirecting
        setError('Please sign in to access this portal.')
        setAuthChecked(true)
        return
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        // Show profile creation prompt
        setError('Please complete your profile to access this portal.')
        setAuthChecked(true)
        return
      }

      // Check role if required
      if (requiredRole && profileData.role !== requiredRole) {
        setError(`Access denied. This portal is for ${requiredRole}s only.`)
        setAuthChecked(true)
        return
      }

      setAuthChecked(true)

    } catch (err: any) {
      console.error('Authentication error:', err)
      setError('Authentication failed. Please sign in again.')
      setAuthChecked(true)
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking authentication
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Checking authentication...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error if access denied
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {requiredRole === 'patient' ? 'Patient Portal Access' : 
                 requiredRole === 'doctor' ? 'Doctor Portal Access' : 
                 'Portal Access'}
              </h1>
              <p className="text-lg text-gray-600 mb-8">{error}</p>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/start-case')}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In / Register
                </button>
                <div>
                  <button
                    onClick={() => router.push('/')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ← Back to Homepage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render children if authenticated and authorized
  return <>{children}</>
}