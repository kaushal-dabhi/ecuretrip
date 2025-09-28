'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  Video, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  FileText,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  Settings,
  Share,
  PhoneOff
} from 'lucide-react'

interface Doctor {
  id: string
  full_name: string
  specialty: string
  hospital: string
  rating: number
  image_url?: string
}

interface TeleconsultationSession {
  id: string
  doctor_id: string
  patient_id: string
  session_start: string
  duration_minutes: number
  status: string
  meeting_link: string
  notes: string
  doctor?: Doctor
}

export default function TeleconsultationPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<TeleconsultationSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInCall, setIsInCall] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [currentSession, setCurrentSession] = useState<TeleconsultationSession | null>(null)

  useEffect(() => {
    checkAuthentication()
  }, [])

  async function checkAuthentication() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/start-case')
        return
      }

      await fetchTeleconsultationSessions(user.id)
    } catch (err) {
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  async function fetchTeleconsultationSessions(userId: string) {
    try {
      const supabase = createClient()
      
      // Get user profile to determine if they're a patient or doctor
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (!profile) {
        setError('Profile not found')
        return
      }

      let query
      if (profile.role === 'patient') {
        query = supabase
          .from('teleconsultation_sessions')
          .select(`
            *,
            doctor:profiles!teleconsultation_sessions_doctor_id_fkey(
              id, full_name, specialty, hospital, rating, image_url
            )
          `)
          .eq('patient_id', userId)
      } else if (profile.role === 'doctor') {
        query = supabase
          .from('teleconsultation_sessions')
          .select(`
            *,
            patient:profiles!teleconsultation_sessions_patient_id_fkey(
              id, full_name, email
            )
          `)
          .eq('doctor_id', userId)
      } else {
        setError('Access denied')
        return
      }

      const { data, error } = await query.order('session_start', { ascending: false })

      if (error) {
        setError('Failed to fetch sessions')
      } else {
        setSessions(data || [])
      }
    } catch (err) {
      setError('Failed to fetch teleconsultation sessions')
    }
  }

  const startSession = async (sessionId: string) => {
    try {
      const supabase = createClient()
      
      // Update session status to 'in_progress'
      const { error } = await supabase
        .from('teleconsultation_sessions')
        .update({ status: 'in_progress' })
        .eq('id', sessionId)

      if (error) throw error

      // Find the session and set it as current
      const session = sessions.find(s => s.id === sessionId)
      if (session) {
        setCurrentSession(session)
        setIsInCall(true)
      }
    } catch (err) {
      setError('Failed to start session')
    }
  }

  const endSession = async () => {
    if (!currentSession) return

    try {
      const supabase = createClient()
      
      // Update session status to 'completed'
      const { error } = await supabase
        .from('teleconsultation_sessions')
        .update({ 
          status: 'completed',
          session_end: new Date().toISOString()
        })
        .eq('id', currentSession.id)

      if (error) throw error

      // Reset call state
      setIsInCall(false)
      setCurrentSession(null)
      setIsVideoOn(true)
      setIsMicOn(true)

      // Refresh sessions
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await fetchTeleconsultationSessions(user.id)
      }
    } catch (err) {
      setError('Failed to end session')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading teleconsultation sessions...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p><strong>Error:</strong> {error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Teleconsultation Call Interface
  if (isInCall && currentSession) {
    return (
      <div className="min-h-screen bg-black">
        <div className="flex flex-col h-screen">
          {/* Call Header */}
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold">Teleconsultation Session</h2>
                <p className="text-sm text-gray-300">
                  {currentSession.doctor?.full_name} - {currentSession.doctor?.specialty}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">Duration: 00:15:32</span>
            </div>
          </div>

          {/* Video Area */}
          <div className="flex-1 relative bg-gray-800">
            {/* Main Video (Doctor) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-16 h-16" />
                  </div>
                  <h3 className="text-xl font-semibold">{currentSession.doctor?.full_name}</h3>
                  <p className="text-gray-300">{currentSession.doctor?.specialty}</p>
                </div>
              </div>
            </div>

            {/* Self Video (Patient) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-600 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gray-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <User className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">You</p>
                </div>
              </div>
            </div>

            {/* Call Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-4 bg-gray-900 rounded-full px-6 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full ${isMicOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'}`}
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full ${isVideoOn ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'}`}
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-gray-700 text-white"
                >
                  <Settings className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-gray-700 text-white"
                >
                  <Share className="w-5 h-5" />
                </Button>

                <Button
                  size="sm"
                  className="rounded-full bg-red-600 text-white hover:bg-red-700"
                  onClick={endSession}
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Session Notes */}
          <div className="bg-gray-900 text-white p-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="font-semibold mb-2">Session Notes</h3>
              <textarea
                className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Add notes during the consultation..."
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopUtilityBar />
      <Navigation />
      
      {/* Hero Section */}
      <section className="mt-28 pb-16 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Teleconsultation
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Connect with medical specialists through secure video consultations. 
            Get expert medical advice from the comfort of your home.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
            <Video className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-800 font-medium">Secure Video Calls</span>
          </div>
        </div>
      </section>

      {/* Sessions List */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Your Teleconsultation Sessions
            </h2>
            <p className="text-lg text-slate-600">
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No teleconsultation sessions</h3>
              <p className="text-gray-600 mb-6">
                Schedule a teleconsultation with one of our specialists to get started.
              </p>
              <Button icon={Calendar}>
                Schedule Consultation
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sessions.map((session) => (
                <Card key={session.id} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {session.doctor?.full_name || 'Dr. Specialist'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {session.doctor?.specialty || 'Medical Specialist'}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(session.session_start)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{session.duration_minutes} minutes</span>
                    </div>

                    {session.doctor?.hospital && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <User className="w-4 h-4" />
                        <span>{session.doctor.hospital}</span>
                      </div>
                    )}
                  </CardHeader>

                  <CardBody className="py-4">
                    <div className="space-y-4">
                      {/* Session Notes */}
                      {session.notes && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Notes</h4>
                          <p className="text-sm text-gray-600">{session.notes}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {session.status === 'scheduled' && (
                          <Button 
                            className="flex-1" 
                            icon={Video}
                            onClick={() => startSession(session.id)}
                          >
                            Join Call
                          </Button>
                        )}
                        
                        {session.status === 'in_progress' && (
                          <Button 
                            className="flex-1" 
                            icon={Video}
                            onClick={() => startSession(session.id)}
                          >
                            Continue Call
                          </Button>
                        )}
                        
                        {session.status === 'completed' && (
                          <Button variant="outline" className="flex-1" icon={FileText}>
                            View Notes
                          </Button>
                        )}

                        <Button variant="outline" icon={MessageCircle}>
                          Chat
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose Teleconsultation?
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Get expert medical advice without leaving your home. Our teleconsultation platform 
              provides secure, high-quality video consultations with verified specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">HD Video Quality</h3>
              <p className="text-slate-600">
                Crystal clear video calls with high-definition quality for better diagnosis.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Secure & Private</h3>
              <p className="text-slate-600">
                End-to-end encryption ensures your medical consultations remain confidential.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Flexible Scheduling</h3>
              <p className="text-slate-600">
                Book consultations at your convenience with flexible time slots.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
