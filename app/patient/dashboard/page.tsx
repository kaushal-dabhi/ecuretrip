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
  Settings,
  TrendingUp,
  Shield,
  Bell,
  Search,
  Filter,
  ChevronRight,
  Star,
  MapPin,
  Globe
} from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import AuthenticatedNavigation from '@/components/AuthenticatedNavigation'
import Footer from '@/components/Footer'
import AuthGuard from '@/components/AuthGuard'

interface PatientProfile {
  id: string
  full_name: string
  email: string
  role: string
  date_of_birth?: string
  phone?: string
  address?: string
  emergency_contact?: string
  medical_history?: string
  allergies?: string
  medications?: string
  blood_type?: string
  insurance_info?: string
}

interface MedicalRecord {
  id: string
  title: string
  type: string
  date: string
  doctor_name: string
  hospital_name: string
  notes: string
  files: string[]
  status: string
  created_at: string
}

interface Appointment {
  id: string
  doctor_name: string
  specialty: string
  hospital_name: string
  date: string
  time: string
  type: 'consultation' | 'follow-up' | 'procedure'
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  location?: string
  video_link?: string
}

interface Prescription {
  id: string
  medication_name: string
  dosage: string
  frequency: string
  duration: string
  doctor_name: string
  prescribed_date: string
  status: 'active' | 'completed' | 'discontinued'
  instructions: string
  side_effects?: string
}

interface LabResult {
  id: string
  test_name: string
  date: string
  doctor_name: string
  hospital_name: string
  results: string
  normal_range: string
  status: 'normal' | 'abnormal' | 'pending'
  files: string[]
}

export default function PatientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Data states
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [labResults, setLabResults] = useState<LabResult[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    checkAuthStatus()
  }, [])

  async function checkAuthStatus() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/signin')
        return
      }

      setUser(user)
      await fetchPatientData(user.id)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/signin')
    }
  }

  async function fetchPatientData(userId: string) {
    try {
      const supabase = createClient()
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
      } else {
        setProfile(profileData)
      }

      // Fetch medical records
      const { data: recordsData } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (recordsData) {
        setMedicalRecords(recordsData)
      }

      // Fetch appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', userId)
        .order('date', { ascending: false })
        .limit(5)

      if (appointmentsData) {
        setAppointments(appointmentsData)
      }

      // Fetch prescriptions
      const { data: prescriptionsData } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', userId)
        .order('prescribed_date', { ascending: false })
        .limit(5)

      if (prescriptionsData) {
        setPrescriptions(prescriptionsData)
      }

      // Fetch lab results
      const { data: labData } = await supabase
        .from('lab_results')
        .select('*')
        .eq('patient_id', userId)
        .order('date', { ascending: false })
        .limit(5)

      if (labData) {
        setLabResults(labData)
      }

    } catch (error) {
      console.error('Error fetching patient data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopUtilityBar />
        <AuthenticatedNavigation userRole="patient" />
        <div className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#145263] mx-auto mb-4"></div>
              <p className="text-lg text-slate-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopUtilityBar />
        <AuthenticatedNavigation userRole="patient" />
        <div className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#FECA58]/20 to-[#145263]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-16 h-16 text-[#145263]" />
              </div>
              <h3 className="heading-3 text-slate-900 mb-3">Profile Not Found</h3>
              <p className="description-text text-slate-600 mb-8 max-w-md mx-auto">
                We couldn't find your patient profile. Please contact support or try signing in again.
              </p>
              <Button 
                onClick={() => router.push('/signin')}
                className="bg-[#145263] hover:bg-[#0F3A47] text-white px-8 py-3 rounded-xl button-text transition-all duration-200"
              >
                Sign In Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'lab-results', label: 'Lab Results', icon: Stethoscope },
    { id: 'teleconsultation', label: 'Teleconsultation', icon: Video },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a consultation with specialists',
      icon: Calendar,
      color: 'bg-[#FECA58]',
      href: '/patient/appointments/book'
    },
    {
      title: 'Upload Documents',
      description: 'Add medical reports and images',
      icon: Upload,
      color: 'bg-[#145263]',
      href: '/patient/documents/upload'
    },
    {
      title: 'Request Prescription',
      description: 'Request medication refills',
      icon: Pill,
      color: 'bg-[#FECA58]',
      href: '/patient/prescriptions/request'
    },
    {
      title: 'Emergency Contact',
      description: 'Get immediate medical assistance',
      icon: AlertCircle,
      color: 'bg-red-500',
      href: '/patient/emergency'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <TopUtilityBar />
      <AuthenticatedNavigation userRole="patient" userName={profile?.full_name} />
      
      <div className="pt-32">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Integrated Welcome Header with Navigation */}
          <div className="rounded-lg p-3 shadow-sm border mb-4" style={{ backgroundColor: '#F8FAFC', borderColor: '#2A4049' }}>
            {/* Welcome Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-3">
              <div>
                <h1 className="heading-4 text-slate-900 mb-1">Welcome back, {profile.full_name}</h1>
                <p className="body-small text-slate-600">
                  Manage your health records, appointments, and medical care
                </p>
              </div>
              <div className="mt-3 lg:mt-0 flex items-center gap-3">
                <Button 
                  onClick={() => router.push('/start-case')}
                  className="text-white font-semibold text-sm px-4 py-2"
                  style={{ backgroundColor: '#2A4049' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1F2F35'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2A4049'}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  New Case
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-white rounded-lg border border-[#FECA58]/20">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#145263] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#145263] hover:bg-[#FFF3D4]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
            </div>
          </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Quick Actions */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.href}>
                      <div className="bg-white rounded-2xl border border-[#FECA58]/20 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 p-4 group cursor-pointer h-32 flex items-center">
                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center flex-shrink-0 mr-4 group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="card-title text-black mb-1 text-sm font-semibold">{action.title}</h3>
                          <p className="body-small text-black leading-tight opacity-80">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Appointments */}
              <Card className="bg-white rounded-2xl border border-[#FECA58]/20 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FECA58] rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="card-title text-slate-900">Upcoming Appointments</h3>
                      <p className="body-small text-slate-600">Your scheduled consultations</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.slice(0, 3).map((appointment) => (
                        <div key={appointment.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                          <div className="w-10 h-10 bg-[#145263] rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{appointment.doctor_name}</h4>
                            <p className="text-sm text-slate-600">{appointment.specialty}</p>
                            <p className="text-xs text-slate-500">{appointment.date} at {appointment.time}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'scheduled' ? 'bg-[#FECA58] text-[#145263]' : 'bg-green-100 text-green-800'
                          }`}>
                            {appointment.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="body text-slate-600">No upcoming appointments</p>
                      <Button 
                        className="mt-4 bg-[#145263] hover:bg-[#0F3A47] text-white"
                        onClick={() => setActiveTab('appointments')}
                      >
                        Book Appointment
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Active Prescriptions */}
              <Card className="bg-white rounded-2xl border border-[#FECA58]/20 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#145263] rounded-lg flex items-center justify-center">
                      <Pill className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="card-title text-slate-900">Active Prescriptions</h3>
                      <p className="body-small text-slate-600">Your current medications</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {prescriptions.length > 0 ? (
                    <div className="space-y-4">
                      {prescriptions.slice(0, 3).map((prescription) => (
                        <div key={prescription.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                          <div className="w-10 h-10 bg-[#FECA58] rounded-lg flex items-center justify-center">
                            <Pill className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{prescription.medication_name}</h4>
                            <p className="text-sm text-slate-600">{prescription.dosage} - {prescription.frequency}</p>
                            <p className="text-xs text-slate-500">Dr. {prescription.doctor_name}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {prescription.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Pill className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="body text-slate-600">No active prescriptions</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Health Summary */}
            <Card className="bg-white rounded-2xl border border-[#FECA58]/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#145263] rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="card-title text-slate-900">Health Summary</h3>
                    <p className="body-small text-slate-600">Your medical overview</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-[#FFF3D4] rounded-xl">
                    <div className="text-2xl font-bold text-[#145263] mb-1">{medicalRecords.length}</div>
                    <div className="text-sm text-slate-600">Medical Records</div>
                  </div>
                  <div className="text-center p-4 bg-[#FFF3D4] rounded-xl">
                    <div className="text-2xl font-bold text-[#145263] mb-1">{appointments.length}</div>
                    <div className="text-sm text-slate-600">Total Appointments</div>
                  </div>
                  <div className="text-center p-4 bg-[#FFF3D4] rounded-xl">
                    <div className="text-2xl font-bold text-[#145263] mb-1">{prescriptions.length}</div>
                    <div className="text-sm text-slate-600">Prescriptions</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Other tabs content would go here - Medical Records, Appointments, etc. */}
        {activeTab !== 'overview' && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-[#FECA58]/20 to-[#145263]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-16 h-16 text-[#145263]" />
            </div>
            <h3 className="heading-3 text-slate-900 mb-3">{tabs.find(t => t.id === activeTab)?.label} Section</h3>
            <p className="description-text text-slate-600 mb-8 max-w-md mx-auto">
              This section is under development. Full functionality will be available soon.
            </p>
            <Button 
              onClick={() => setActiveTab('overview')}
              className="bg-[#145263] hover:bg-[#0F3A47] text-white px-8 py-3 rounded-xl button-text transition-all duration-200"
            >
              Back to Overview
            </Button>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  )
}