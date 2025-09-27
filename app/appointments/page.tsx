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
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Video,
  MessageCircle
} from 'lucide-react'

interface Doctor {
  id: string
  full_name: string
  specialty: string
  hospital: string
  rating: number
  consultation_fee: number
  image_url?: string
}

interface Appointment {
  id: string
  doctor_id: string
  patient_id: string
  appointment_type: string
  appointment_date: string
  appointment_time: string
  status: string
  notes: string
  doctor?: Doctor
}

export default function AppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<string>('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [appointmentType, setAppointmentType] = useState('in-person')
  const [notes, setNotes] = useState('')

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

      await Promise.all([
        fetchAppointments(user.id),
        fetchDoctors()
      ])
    } catch (err) {
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  async function fetchAppointments(userId: string) {
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
          .from('appointments')
          .select(`
            *,
            doctor:profiles!appointments_doctor_id_fkey(
              id, full_name, specialty, hospital, rating, consultation_fee, image_url
            )
          `)
          .eq('patient_id', userId)
      } else if (profile.role === 'doctor') {
        query = supabase
          .from('appointments')
          .select(`
            *,
            patient:profiles!appointments_patient_id_fkey(
              id, full_name, email
            )
          `)
          .eq('doctor_id', userId)
      } else {
        setError('Access denied')
        return
      }

      const { data, error } = await query.order('appointment_date', { ascending: true })

      if (error) {
        setError('Failed to fetch appointments')
      } else {
        setAppointments(data || [])
      }
    } catch (err) {
      setError('Failed to fetch appointments')
    }
  }

  async function fetchDoctors() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor')
        .eq('verified', true)
        .order('full_name')

      if (error) {
        console.error('Error fetching doctors:', error)
      } else {
        setDoctors(data || [])
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err)
    }
  }

  const bookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('User not authenticated')
        return
      }

      const { error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: selectedDoctor,
          patient_id: user.id,
          appointment_type: appointmentType,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          status: 'scheduled',
          notes: notes
        })

      if (error) throw error

      // Reset form
      setSelectedDoctor('')
      setAppointmentDate('')
      setAppointmentTime('')
      setAppointmentType('in-person')
      setNotes('')
      setShowBookingForm(false)

      // Refresh appointments
      await fetchAppointments(user.id)
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment')
    }
  }

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)

      if (error) throw error

      // Refresh appointments
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await fetchAppointments(user.id)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to cancel appointment')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'no-show': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'in-person': return <User className="w-4 h-4" />
      case 'teleconsultation': return <Video className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
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
              <p className="text-lg text-gray-600">Loading appointments...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <TopUtilityBar />
      <Navigation />
      
      {/* Hero Section */}
      <section className="mt-28 pb-16 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Appointments
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Schedule and manage your medical appointments with our verified specialists. 
            Book in-person visits or teleconsultations at your convenience.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span className="text-sm text-indigo-800 font-medium">Easy Booking</span>
          </div>
        </div>
      </section>

      {/* Book Appointment Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Your Appointments</h2>
            <Button 
              icon={Plus}
              onClick={() => setShowBookingForm(!showBookingForm)}
            >
              Book New Appointment
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      {showBookingForm && (
        <section className="py-8 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-900">Book New Appointment</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Doctor Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Doctor *
                    </label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.full_name} - {doctor.specialty} ({doctor.hospital})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Appointment Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type *
                    </label>
                    <select
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="in-person">In-Person Visit</option>
                      <option value="teleconsultation">Teleconsultation</option>
                      <option value="phone">Phone Consultation</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific concerns or questions for the doctor..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button onClick={bookAppointment}>
                    Book Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBookingForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>
      )}

      {/* Appointments List */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments scheduled</h3>
              <p className="text-gray-600 mb-6">
                Book your first appointment with one of our specialists to get started.
              </p>
              <Button icon={Plus} onClick={() => setShowBookingForm(true)}>
                Book Appointment
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {appointment.doctor?.full_name || 'Dr. Specialist'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.doctor?.specialty || 'Medical Specialist'}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(appointment.appointment_date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(appointment.appointment_time)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      {getAppointmentTypeIcon(appointment.appointment_type)}
                      <span className="capitalize">{appointment.appointment_type}</span>
                    </div>

                    {appointment.doctor?.hospital && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.doctor.hospital}</span>
                      </div>
                    )}
                  </CardHeader>

                  <CardBody className="py-4">
                    <div className="space-y-4">
                      {/* Notes */}
                      {appointment.notes && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">Notes</h4>
                          <p className="text-sm text-gray-600">{appointment.notes}</p>
                        </div>
                      )}

                      {/* Consultation Fee */}
                      {appointment.doctor?.consultation_fee && (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Consultation Fee</span>
                          <span className="text-lg font-bold text-green-600">
                            ₹{appointment.doctor.consultation_fee}
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {appointment.status === 'scheduled' && (
                          <>
                            <Button variant="outline" className="flex-1" icon={Edit}>
                              Reschedule
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1" 
                              icon={Trash2}
                              onClick={() => cancelAppointment(appointment.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <Button className="flex-1" icon={CheckCircle}>
                            Join Appointment
                          </Button>
                        )}

                        {appointment.status === 'completed' && (
                          <Button variant="outline" className="flex-1" icon={MessageCircle}>
                            View Notes
                          </Button>
                        )}
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
      <section className="py-16 bg-indigo-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose Our Appointment System?
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our appointment booking system makes it easy to schedule and manage your medical consultations 
              with verified specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Easy Booking</h3>
              <p className="text-slate-600">
                Book appointments online with just a few clicks. Choose your preferred date and time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Flexible Scheduling</h3>
              <p className="text-slate-600">
                Choose from in-person visits, teleconsultations, or phone consultations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Verified Specialists</h3>
              <p className="text-slate-600">
                All doctors are verified and have proven track records of successful treatments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
