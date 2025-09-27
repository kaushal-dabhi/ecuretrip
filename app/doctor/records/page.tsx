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
  Phone,
  Search,
  Filter
} from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AuthGuard from '@/components/AuthGuard'

interface DoctorProfile {
  id: string
  full_name: string
  email: string
  role: string
  specialty: string
  hospital: string
}

interface PatientRecord {
  id: string
  patient_name: string
  patient_email: string
  record_type: string
  title: string
  date: string
  notes: string
  status: string
}

export default function DoctorRecords() {
  const router = useRouter()
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchDoctorData()
  }, [])

  async function fetchDoctorData() {
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

      // Fetch patient records for this doctor
      const { data: records, error: recordsError } = await supabase
        .from('medical_records')
        .select(`
          *,
          patient:patients(
            profile:profiles(full_name, email)
          )
        `)
        .eq('doctor_id', user.id)
        .order('created_at', { ascending: false })

      if (recordsError) {
        console.error('Error fetching patient records:', recordsError)
      } else {
        // Transform the data to include patient names
        const transformedRecords = records?.map(record => ({
          id: record.id,
          patient_name: record.patient?.profile?.full_name || 'Unknown Patient',
          patient_email: record.patient?.profile?.email || 'Unknown Email',
          record_type: record.type,
          title: record.title,
          date: record.date,
          notes: record.notes,
          status: record.status
        })) || []
        
        setPatientRecords(transformedRecords)
      }

    } catch (err: any) {
      console.error('Error fetching doctor data:', err)
      setError('Failed to load patient records')
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

  const filteredRecords = patientRecords.filter(record => {
    const matchesSearch = record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || record.record_type === filterType
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <AuthGuard requiredRole="doctor">
        <div className="min-h-screen bg-gray-50">
          <TopUtilityBar />
          <Navigation />
          <div className="pt-32 pb-16">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Loading patient records...</p>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="doctor">
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
                  <Link href="/doctor/dashboard">
                    <Button variant="ghost" icon={ArrowLeft}>
                      Back to Dashboard
                    </Button>
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">Patient Records</h1>
                    <p className="text-gray-600">Manage and view patient medical records</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Doctor</div>
                  <div className="font-semibold text-slate-900">Dr. {profile?.full_name}</div>
                  <div className="text-xs text-gray-500">{profile?.specialty}</div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search patients or records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Lab Results">Lab Results</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Vital Signs">Vital Signs</option>
                  <option value="Imaging">Imaging</option>
                </select>
              </div>
            </div>

            {/* Patient Records */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Patient Medical Records</h2>
                  <div className="text-sm text-gray-500">
                    {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">No Patient Records</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Patient records will appear here once you start consultations
                    </p>
                    <Link href="/teleconsultation">
                      <Button size="sm" icon={Video}>
                        Start Consultation
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRecords.map((record) => (
                      <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {getRecordIcon(record.record_type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{record.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{record.notes}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {record.patient_name}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(record.date).toLocaleDateString()}
                                </span>
                                <span className="text-blue-600 font-medium">
                                  {record.record_type}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                            <Button variant="ghost" size="sm" icon={Eye}>
                              View
                            </Button>
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
        </div>

        <Footer />
      </div>
    </AuthGuard>
  )
}
