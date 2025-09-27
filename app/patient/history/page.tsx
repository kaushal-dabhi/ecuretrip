'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Heart,
  Activity,
  Pill,
  Stethoscope,
  Video,
  Phone
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
  status: string
}

interface Appointment {
  id: string
  date: string
  time: string
  doctor: string
  type: string
  status: string
  notes: string
}

export default function PatientHistory() {
  const router = useRouter()
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPatientData()
  }, [])

  async function fetchPatientData() {
    try {
      const supabase = createClient()
      
      // Get user profile
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push('/start-case')
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        router.push('/start-case')
        return
      }

      setProfile(profileData)

      // Fetch medical records
      const { data: records, error: recordsError } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })

      if (recordsError) {
        console.error('Error fetching medical records:', recordsError)
      } else {
        setMedicalRecords(records || [])
      }

      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .order('appointment_date', { ascending: false })

      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError)
      } else {
        setAppointments(appointmentsData || [])
      }

    } catch (err: any) {
      console.error('Error fetching patient data:', err)
      setError('Failed to load patient data')
    } finally {
      setLoading(false)
    }
  }

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'Consultation': return <Stethoscope className="w-5 h-5" />
      case 'Lab Results': return <FileText className="w-5 h-5" />
      case 'Prescription': return <Pill className="w-5 h-5" />
      case 'Vital Signs': return <Heart className="w-5 h-5" />
      case 'Imaging': return <Eye className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <AuthGuard requiredRole="patient">
        <div className="min-h-screen bg-gray-50">
          <TopUtilityBar />
          <Navigation />
          <div className="pt-32 pb-16">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Loading your medical history...</p>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
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

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/patient/dashboard">
                    <Button variant="ghost" icon={ArrowLeft}>
                      Back to Dashboard
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">Medical History</h1>
                    <p className="text-gray-600">Complete overview of your medical records and consultations</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Patient</div>
                  <div className="font-semibold text-slate-900">{profile?.full_name}</div>
                </div>
              </div>
            </div>

            {/* Medical Records */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">Medical Records</h2>
                </CardHeader>
                <CardBody>
                  {medicalRecords.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">No Medical Records</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Your medical records will appear here once you start consultations
                      </p>
                      <Link href="/start-case">
                        <Button size="sm" icon={FileText}>
                          Upload Records
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {medicalRecords.map((record) => (
                        <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                {getRecordIcon(record.type)}
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900">{record.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">{record.notes}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(record.date).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {record.doctor}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                {record.status}
                              </span>
                              <Button variant="ghost" size="sm" icon={Download}>
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Appointment History */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-slate-900">Appointment History</h2>
                </CardHeader>
                <CardBody>
                  {appointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">No Appointments</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Your appointment history will appear here
                      </p>
                      <Link href="/appointments">
                        <Button size="sm" icon={Calendar}>
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                {appointment.type === 'video' ? <Video className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900">
                                  {appointment.type === 'video' ? 'Video Consultation' : 'In-Person Consultation'}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">{appointment.notes}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(appointment.date).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {appointment.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {appointment.doctor}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
