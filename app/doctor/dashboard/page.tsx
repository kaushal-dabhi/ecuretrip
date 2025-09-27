'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Eye, 
  MessageSquare,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Stethoscope,
  Video,
  Plus,
  Phone,
  Activity,
  Heart,
  Brain,
  Shield,
  Users,
  TrendingUp,
  Star
} from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AuthGuard from '@/components/AuthGuard'

interface Case {
  id: string
  patient_id: string
  treatment_id: string | null
  status: string
  patient_notes: string | null
  created_at: string
  updated_at: string
  treatment?: {
  id: string
  name: string
    description: string | null
  }
  patient?: {
    id: string
    profile_id: string
    profile?: {
  id: string
      full_name: string | null
      email: string | null
    }
  }
  quotes?: Array<{
  id: string
    total: number | null
    status: string
    created_at: string
  }>
}

interface DoctorProfile {
  id: string
  full_name: string
  email: string
  role: string
  specialty?: string
  hospital?: string
  experience?: string
}

interface Appointment {
  id: string
  patient_id: string
  appointment_type: string
  appointment_date: string
  appointment_time: string
  status: string
  patient?: {
    profile: {
      full_name: string
      email: string
    }
  }
}

interface Teleconsultation {
  id: string
  patient_id: string
  session_start: string
  duration_minutes: number
  status: string
  patient?: {
    profile: {
      full_name: string
      email: string
    }
  }
}

export default function DoctorDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [cases, setCases] = useState<Case[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [teleconsultations, setTeleconsultations] = useState<Teleconsultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'quoted'>('all')
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    checkAuthentication()
  }, [router])

  async function checkAuthentication() {
    try {
      const supabase = createClient()
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        // Redirect to login if not authenticated
        router.push('/start-case')
        return
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        // Redirect to profile creation if no profile exists
        router.push('/start-case')
        return
      }

      // Check if user is a doctor
      if (profileData.role !== 'doctor') {
        setError('Access denied. This portal is for doctors only.')
        setAuthChecked(true)
        return
      }

      setProfile(profileData)
      await fetchDoctorData(user.id)
      setAuthChecked(true)

    } catch (err: any) {
      console.error('Authentication error:', err)
      setError('Authentication failed. Please sign in again.')
      setAuthChecked(true)
    } finally {
      setLoading(false)
    }
  }

  async function fetchDoctorData(userId: string) {
    try {
      const supabase = createClient()
      
      // Get cases assigned to this doctor
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select(`
          *,
          treatment:treatments(id, name, description),
          patient:patients(id, profile_id, profile:profiles(id, full_name, email)),
          quotes(id, total, status, created_at)
        `)
        .order('created_at', { ascending: false })

      if (casesError) {
        console.log('No cases found or error fetching cases:', casesError)
        setCases([])
      } else {
        setCases(casesData || [])
      }

      // Get appointments for this doctor
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(profile:profiles(full_name, email))
        `)
        .eq('doctor_id', userId)
        .eq('status', 'scheduled')
        .order('appointment_date', { ascending: true })

      if (appointmentsError) {
        console.log('No appointments found or error fetching appointments:', appointmentsError)
        setAppointments([])
      } else {
        setAppointments(appointmentsData || [])
      }

      // Get teleconsultation sessions for this doctor
      const { data: teleconsultationsData, error: teleconsultationsError } = await supabase
        .from('teleconsultation_sessions')
        .select(`
          *,
          patient:patients(profile:profiles(full_name, email))
        `)
        .eq('doctor_id', userId)
        .eq('status', 'scheduled')
        .order('session_start', { ascending: true })

      if (teleconsultationsError) {
        console.log('No teleconsultations found or error fetching teleconsultations:', teleconsultationsError)
        setTeleconsultations([])
      } else {
        setTeleconsultations(teleconsultationsData || [])
      }

    } catch (err: any) {
      console.error('Error fetching doctor data:', err)
      setError('Failed to load data')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'quoted': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />
      case 'quoted': return <MessageSquare className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'closed': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCases = cases.filter(caseItem => {
    if (filter === 'all') return true
    if (filter === 'new') return caseItem.status === 'new'
    if (filter === 'quoted') return caseItem.status === 'quoted'
    return true
  })

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

  return (
    <AuthGuard requiredRole="doctor">
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Doctor Dashboard</h1>
                <p className="text-gray-600">Manage your medical practice and patient consultations</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Logged in as</div>
                <div className="font-semibold text-slate-900">{profile?.email}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    Doctor Portal
                  </div>
                  <button
                    onClick={async () => {
                      const supabase = createClient()
                      await supabase.auth.signOut()
                      router.push('/')
                    }}
                    className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Logout
                </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-400 text-red-700 rounded">
              <p><strong>Error:</strong> {error}</p>
        </div>
          )}

          {/* Personalized Doctor Profile Header */}
          <div className="mb-8">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="heading-2 text-slate-900">Welcome back, Dr. {profile?.full_name || 'Doctor'}! 👨‍⚕️</h1>
                  <p className="body text-gray-600">
                    {profile?.specialty && `${profile.specialty} Specialist`} 
                    {profile?.hospital && ` at ${profile.hospital}`}
                    {profile?.experience && ` • ${profile.experience} years experience`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Logged in as</div>
                <div className="font-semibold text-slate-900">{profile?.email}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    Doctor Portal
              </div>
                  <button
                    onClick={async () => {
                      const supabase = createClient()
                      await supabase.auth.signOut()
                      router.push('/')
                    }}
                    className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
                </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Link href="/teleconsultation">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center p-6">
                  <Video className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Teleconsultation</h3>
                  <p className="text-sm text-gray-600">Video consultations</p>
                </CardBody>
              </Card>
            </Link>
            <Link href="/appointments">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center p-6">
                  <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Appointments</h3>
                  <p className="text-sm text-gray-600">Manage schedule</p>
                </CardBody>
              </Card>
            </Link>
            <Link href="/doctor/records">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center p-6">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Medical Records</h3>
                  <p className="text-sm text-gray-600">Patient records</p>
                </CardBody>
              </Card>
            </Link>
            <Link href="/doctor/communication">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center p-6">
                  <MessageSquare className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Patient Communication</h3>
                  <p className="text-sm text-gray-600">Chat with patients</p>
                </CardBody>
              </Card>
            </Link>
            </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardBody className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{cases.length}</div>
                <div className="text-sm text-gray-600">Medical Tourism Cases</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{appointments.length}</div>
                <div className="text-sm text-gray-600">Upcoming Appointments</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{teleconsultations.length}</div>
                <div className="text-sm text-gray-600">Teleconsultations</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {cases.filter(c => c.status === 'accepted').length}
                </div>
                <div className="text-sm text-gray-600">Completed Cases</div>
              </CardBody>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Medical Tourism Cases */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Medical Tourism Cases</h2>
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          filter === 'all' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        All ({cases.length})
                      </button>
                      <button
                        onClick={() => setFilter('new')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          filter === 'new' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        New ({cases.filter(c => c.status === 'new').length})
                    </button>
                      <button
                        onClick={() => setFilter('quoted')}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          filter === 'quoted' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Quoted ({cases.filter(c => c.status === 'quoted').length})
                          </button>
                        </div>
                  </div>
                </CardHeader>
                <CardBody>

                  {/* Cases List */}
                  {filteredCases.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">No Medical Tourism Cases</h3>
                      <p className="text-gray-600 text-sm">
                        {filter === 'all' 
                          ? `Dr. ${profile?.full_name || 'Doctor'}, no medical tourism cases have been assigned to you yet.`
                          : `No ${filter} cases found for Dr. ${profile?.full_name || 'Doctor'}.`
                        }
                      </p>
                  </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredCases.map((caseItem) => (
                        <div key={caseItem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-bold text-slate-900">
                                  Case #{caseItem.id.slice(-8)}
                                </h3>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                                  {getStatusIcon(caseItem.status)}
                                  {caseItem.status}
                                </span>
              </div>

                              {/* Patient Info */}
                              {caseItem.patient?.profile && (
                                <div className="mb-3">
                                  <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Patient: {caseItem.patient.profile.full_name || 'Anonymous'}
                                  </h4>
                                  <p className="text-gray-600 text-sm">
                                    {caseItem.patient.profile.email}
                                  </p>
                                </div>
                              )}

                              {/* Treatment Info */}
                              {caseItem.treatment && (
                                <div className="mb-3">
                                  <h4 className="font-semibold text-slate-900 mb-1">Treatment</h4>
                                  <p className="text-gray-600 text-sm">{caseItem.treatment.name}</p>
                                  {caseItem.treatment.description && (
                                    <p className="text-gray-500 text-xs mt-1">{caseItem.treatment.description}</p>
                                  )}
                </div>
                              )}

                              {/* Patient Notes */}
                              {caseItem.patient_notes && (
                                <div className="mb-3">
                                  <h5 className="font-medium text-slate-900 mb-1 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Patient Notes
                                  </h5>
                                  <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded">
                                    {caseItem.patient_notes}
                                  </p>
                          </div>
                              )}

                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Created {new Date(caseItem.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <Link href={`/doctor/case/${caseItem.id}`}>
                                <Button variant="outline" size="sm" icon={Eye}>
                                  Review
                                </Button>
                              </Link>
                              
                              {caseItem.status === 'new' && (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  Send Quote
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Upcoming Appointments</h3>
                </CardHeader>
                <CardBody>
                  {appointments.length === 0 ? (
                    <div className="text-center py-6">
                      <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-3">
                        Dr. {profile?.full_name || 'Doctor'}, no upcoming appointments scheduled
                      </p>
                      <Button size="sm" icon={Plus}>
                        Schedule Appointment
                      </Button>
                </div>
                  ) : (
                <div className="space-y-3">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900 text-sm">{appointment.appointment_type}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                              {appointment.status}
                        </span>
                      </div>
                          {appointment.patient?.profile && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Patient:</strong> {appointment.patient.profile.full_name}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            <strong>Date:</strong> {appointment.appointment_date} at {appointment.appointment_time}
                          </p>
                          {appointment.appointment_type === 'teleconsultation' && (
                            <Button size="sm" className="w-full mt-2" icon={Video}>
                              Join Call
                            </Button>
                          )}
                    </div>
                  ))}
                </div>
                  )}
                </CardBody>
              </Card>

              {/* Teleconsultation Sessions */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Teleconsultation Sessions</h3>
                </CardHeader>
                <CardBody>
                  {teleconsultations.length === 0 ? (
                    <div className="text-center py-6">
                      <Video className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-3">
                        Dr. {profile?.full_name || 'Doctor'}, no teleconsultation sessions scheduled
                      </p>
                      <Button size="sm" icon={Video}>
                        Start Session
                      </Button>
                </div>
                  ) : (
                    <div className="space-y-3">
                      {teleconsultations.map((session) => (
                        <div key={session.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900 text-sm">Teleconsultation</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(session.status)}`}>
                              {session.status}
                            </span>
              </div>
                          {session.patient?.profile && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Patient:</strong> {session.patient.profile.full_name}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            <strong>Time:</strong> {new Date(session.session_start).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Duration:</strong> {session.duration_minutes} minutes
                          </p>
                          <Button size="sm" className="w-full mt-2" icon={Video}>
                            Join Session
                          </Button>
                  </div>
                      ))}
                  </div>
                  )}
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full" icon={Video}>
                      Start Teleconsultation
                    </Button>
                    <Button variant="outline" className="w-full" icon={Calendar}>
                      Schedule Appointment
                    </Button>
                    <Button variant="outline" className="w-full" icon={FileText}>
                      View Medical Records
                    </Button>
                    <Button variant="outline" className="w-full" icon={MessageSquare}>
                      Patient Communication
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </AuthGuard>
  )
}