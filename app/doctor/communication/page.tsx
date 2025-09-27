'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  ArrowLeft, 
  MessageSquare, 
  Send,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Video,
  Mail,
  Search
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

interface Patient {
  id: string
  name: string
  email: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: string
}

export default function DoctorCommunication() {
  const router = useRouter()
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

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

      // Fetch patients who have cases with this doctor
      const { data: cases, error: casesError } = await supabase
        .from('cases')
        .select(`
          *,
          patient:patients(
            profile:profiles(full_name, email)
          )
        `)
        .eq('doctor_id', user.id)

      if (casesError) {
        console.error('Error fetching cases:', casesError)
      } else {
        // Transform cases into patient list
        const patientMap = new Map()
        cases?.forEach(caseItem => {
          if (caseItem.patient?.profile) {
            const patientId = caseItem.patient.id
            if (!patientMap.has(patientId)) {
              patientMap.set(patientId, {
                id: patientId,
                name: caseItem.patient.profile.full_name,
                email: caseItem.patient.profile.email,
                lastMessage: 'No messages yet',
                lastMessageTime: new Date().toISOString(),
                unreadCount: 0,
                status: 'active'
              })
            }
          }
        })
        
        setPatients(Array.from(patientMap.values()))
      }

    } catch (err: any) {
      console.error('Error fetching doctor data:', err)
      setError('Failed to load patient data')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedPatient) return

    try {
      // Here you would implement actual messaging functionality
      // For now, we'll just simulate sending a message
      console.log('Sending message to', selectedPatient.name, ':', message)
      
      // Update the last message for the selected patient
      setPatients(prev => prev.map(patient => 
        patient.id === selectedPatient.id 
          ? { ...patient, lastMessage: message, lastMessageTime: new Date().toISOString() }
          : patient
      ))
      
      setMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                <p className="text-lg text-gray-600">Loading patient communications...</p>
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
                    <h1 className="text-3xl font-bold text-slate-900">Patient Communication</h1>
                    <p className="text-gray-600">Chat and communicate with your patients</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Doctor</div>
                  <div className="font-semibold text-slate-900">Dr. {profile?.full_name}</div>
                  <div className="text-xs text-gray-500">{profile?.specialty}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-900">Patients</h2>
                      <div className="text-sm text-gray-500">{filteredPatients.length}</div>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </CardHeader>
                  <CardBody className="p-0">
                    {filteredPatients.length === 0 ? (
                      <div className="p-6 text-center">
                        <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">No patients found</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {filteredPatients.map((patient) => (
                          <div
                            key={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                              selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-slate-900 text-sm">{patient.name}</h3>
                                  <p className="text-xs text-gray-500 truncate max-w-32">{patient.lastMessage}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">
                                  {new Date(patient.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {patient.unreadCount > 0 && (
                                  <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mt-1">
                                    {patient.unreadCount}
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

              {/* Chat Area */}
              <div className="lg:col-span-2">
                <Card className="h-96">
                  {selectedPatient ? (
                    <>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{selectedPatient.name}</h3>
                              <p className="text-sm text-gray-500">{selectedPatient.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" icon={Phone}>
                              Call
                            </Button>
                            <Button variant="ghost" size="sm" icon={Video}>
                              Video
                            </Button>
                            <Button variant="ghost" size="sm" icon={Mail}>
                              Email
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody className="flex flex-col h-full">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4">
                          <div className="text-center text-gray-500 text-sm">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                            <p>Start a conversation with {selectedPatient.name}</p>
                          </div>
                        </div>
                        
                        {/* Message Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <Button 
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            icon={Send}
                          >
                            Send
                          </Button>
                        </div>
                      </CardBody>
                    </>
                  ) : (
                    <CardBody className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">Select a Patient</h3>
                        <p className="text-gray-600 text-sm">Choose a patient from the list to start messaging</p>
                      </div>
                    </CardBody>
                  )}
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
