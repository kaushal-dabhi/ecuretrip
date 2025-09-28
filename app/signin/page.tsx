'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { ArrowLeft, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

type Step = 'email' | 'success'

export default function SignInPage() {
  const router = useRouter()
  
  const [step, setStep] = useState<Step>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function signIn() {
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!password.trim()) {
      setError('Please enter your password')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Use signInWithPassword method for existing users
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.')
        } else if (error.message.includes('User not found')) {
          setError('No account found with this email. Please use "Get Started" to create a new account.')
        } else {
          throw error
        }
        return
      }

      setSuccess('Sign in successful! Redirecting...')
      
      // Check user profile and redirect to appropriate dashboard
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profile) {
        if (profile.role === 'patient') {
          router.push('/patient/dashboard')
        } else if (profile.role === 'doctor') {
          router.push('/doctor/dashboard')
        } else {
          router.push('/')
        }
      } else {
        // User exists but no profile - redirect to profile creation
        router.push('/start-case?step=profile&email=' + encodeURIComponent(email))
      }
      
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ADC8A6' }}>
                  <Mail className="w-8 h-8" style={{ color: '#145263' }} />
              </div>
                  <h2 className="heading-4 mb-2">Sign In</h2>
                  <p className="body text-slate-600">
                    Enter your email and password to sign in to your account
                  </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block label-text mb-2">
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
                <label className="block label-text mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  icon={Lock}
                  className="w-full"
                />
              </div>

              <Button
                onClick={signIn}
                loading={loading}
                className="w-full bg-[#145263] hover:bg-[#0F3A47] text-white"
                size="lg"
              >
                Sign In
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/start-case" className="text-[#145263] hover:text-[#0F3A47] font-medium">
                    Get Started
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )


      case 'success':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ADC8A6' }}>
                <CheckCircle className="w-8 h-8" style={{ color: '#145263' }} />
              </div>
              <h2 className="heading-4 mb-2">Sign In Successful!</h2>
              <p className="body text-slate-600">
                Redirecting you to your dashboard...
              </p>
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
            <Link href="/">
              <Button variant="ghost" icon={ArrowLeft} className="text-[#145263] hover:text-[#0F3A47]">
                Back to Home
              </Button>
            </Link>
          </div>

          <Card className="max-w-lg mx-auto">
            <CardHeader className="pb-4">
              <div className="text-center">
                <h1 className="heading-3 text-slate-900 mb-2">
                  {step === 'email' && 'Sign In to Your Account'}
                  {step === 'success' && 'Welcome Back!'}
                </h1>
                <p className="body text-slate-600">
                  {step === 'email' && 'Enter your credentials to access your dashboard'}
                  {step === 'success' && 'You have successfully signed in'}
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
