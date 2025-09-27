'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Calendar, 
  MessageSquare,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Heart,
  Activity,
  Pill,
  Stethoscope,
  Video,
  Phone,
  FileImage,
  Download,
  Upload,
  History,
  Settings
} from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AuthGuard from '@/components/AuthGuard'

interface PatientProfile {
  id: string
  full_name: string
  email: string
  role: string
}

interface MedicalRecord {
  id: string
  title: string
  type: string
  date: string
  doctor: string
  notes: string
  files: string[]
}

interface Appointment {
  id: string
  date: string
  time: string
  doctor: string
  type: string
  status: string
}

export default function PatientDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

      // Check if user is a patient
      if (profileData.role !== 'patient') {
        setError('Access denied. This portal is for patients only.')
        setAuthChecked(true)
        return
      }

      setProfile(profileData)
      await fetchPatientData(user.id)
      setAuthChecked(true)

    } catch (err: any) {
      console.error('Authentication error:', err)
      setError('Authentication failed. Please sign in again.')
      setAuthChecked(true)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPatientData(userId: string) {
    try {
      const supabase = createClient()
      
      // Get patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('profile_id', userId)
        .single()

      if (patientError) {
        console.log('No patient record found, creating one...')
        // Create patient record if it doesn't exist
        const { error: createError } = await supabase
          .from('patients')
          .insert({
            profile_id: userId
          })
        
        if (createError) throw createError
      }

      // Fetch real medical records from database
      const { data: records, error: recordsError } = await supabase
        .from('medical_records')
        .select(`
          *,
          doctor:profiles!medical_records_doctor_id_fkey(full_name)
        `)
        .eq('patient_id', userId)
        .order('created_at', { ascending: false })

      if (recordsError) {
        console.log('No medical records table found, using empty array')
        setMedicalRecords([])
      } else {
        setMedicalRecords(records || [])
      }

      // Fetch real appointments from database
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor:profiles!appointments_doctor_id_fkey(full_name)
        `)
        .eq('patient_id', userId)
        .eq('status', 'scheduled')
        .order('appointment_date', { ascending: true })

      if (appointmentsError) {
        console.log('No appointments table found, using empty array')
        setAppointments([])
      } else {
        setAppointments(appointments || [])
      }

    } catch (err: any) {
      console.error('Error fetching patient data:', err)
      setError('Failed to load medical records')
    }
  }

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'Rescheduled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'General Checkup': return <Stethoscope className="w-5 h-5" />
      case 'Dental': return <Activity className="w-5 h-5" />
      case 'Lab Results': return <FileText className="w-5 h-5" />
      case 'Prescription': return <Pill className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
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

  return (
    <AuthGuard requiredRole="patient">
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-400 text-red-700 rounded">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {/* Personalized Patient Profile Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="heading-2 text-slate-900">Welcome back, {profile?.full_name || 'Patient'}! 👋</h1>
                  <p className="body text-gray-600">Your personal medical records and health dashboard</p>
                </div>
              </div>
              <div className="text-right">
                <div className="body-small text-gray-500">Logged in as</div>
                <div className="body font-semibold text-slate-900">{profile?.email}</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Patient Portal
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
                  <p className="text-sm text-gray-600">Video call with doctors</p>
                </CardBody>
              </Card>
            </Link>
            <Link href="/start-case">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center p-6">
                  <Upload className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Upload Records</h3>
                  <p className="text-sm text-gray-600">Add medical documents</p>
                </CardBody>
              </Card>
            </Link>
            <Link href="/appointments">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center p-6">
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Book Appointment</h3>
                  <p className="text-sm text-gray-600">Schedule consultations</p>
                </CardBody>
              </Card>
            </Link>
            <Link href="/patient/history">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center p-6">
                  <History className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-1">Medical History</h3>
                  <p className="text-sm text-gray-600">View past records</p>
                </CardBody>
              </Card>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Medical Records Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Medical Records</h2>
                    <Button variant="outline" size="sm" icon={Plus}>
                      Add Record
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  {medicalRecords.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">No Medical Records Yet</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {profile?.full_name ? `${profile.full_name}, ` : ''}upload your medical documents to get started with your health journey
                      </p>
                      <Button size="sm" icon={Upload}>
                        Upload Records
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {medicalRecords.map((record) => (
                        <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              {getRecordTypeIcon(record.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-slate-900">{record.title}</h3>
                                <span className="text-sm text-gray-500">{record.date}</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                <strong>Doctor:</strong> {record.doctor}
                              </p>
                              <p className="text-sm text-gray-700 mb-3">{record.notes}</p>
                              {record.files.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <FileImage className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">
                                    {record.files.length} file(s)
                                  </span>
                                  <Button variant="ghost" size="sm" icon={Download}>
                                    Download
                                  </Button>
                                </div>
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
                        {profile?.full_name ? `${profile.full_name}, ` : ''}you don't have any scheduled appointments yet
                      </p>
                      <Button size="sm" icon={Plus}>
                        Book Appointment
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900">{appointment.type}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Doctor:</strong> {appointment.doctor}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Date:</strong> {appointment.date} at {appointment.time}
                          </p>
                          {appointment.type === 'Teleconsultation' && (
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

              {/* Health Summary */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Health Summary</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Checkup</span>
                      <span className="text-sm font-medium">Jan 15, 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Blood Pressure</span>
                      <span className="text-sm font-medium text-green-600">Normal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Weight</span>
                      <span className="text-sm font-medium">70 kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">BMI</span>
                      <span className="text-sm font-medium text-green-600">22.5</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full" icon={Phone}>
                      Emergency Contact
                    </Button>
                    <Button variant="outline" className="w-full" icon={Settings}>
                      Account Settings
                    </Button>
                    <Button variant="outline" className="w-full" icon={Download}>
                      Download Records
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Health Statistics */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardBody className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{medicalRecords.length}</div>
                <div className="text-sm text-gray-600">Medical Records</div>
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
                <div className="text-2xl font-bold text-purple-600 mb-1">2</div>
                <div className="text-sm text-gray-600">Teleconsultations</div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">5</div>
                <div className="text-sm text-gray-600">Documents Uploaded</div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

        <Footer />
      </div>
    </AuthGuard>
  )
}
