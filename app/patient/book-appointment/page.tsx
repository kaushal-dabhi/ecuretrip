'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth'
import { createAppointment, getAvailableSlots, type AppointmentSlot } from '@/lib/appointments'
import { getPatientProfile } from '@/lib/auth'

interface BookingFormData {
  doctor_id: string
  appointment_date: string
  appointment_time: string
  appointment_type: 'consultation' | 'follow-up' | 'emergency' | 'surgery'
  symptoms: string
  medical_history: string
  notes: string
}

export default function BookAppointment() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  
  const [formData, setFormData] = useState<BookingFormData>({
    doctor_id: searchParams.get('doctor_id') || '',
    appointment_date: '',
    appointment_time: '',
    appointment_type: 'consultation',
    symptoms: '',
    medical_history: '',
    notes: ''
  })

  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [patientProfile, setPatientProfile] = useState<any>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin?redirect=/patient/book-appointment')
    }
  }, [user, authLoading, router])

  // Load patient profile
  useEffect(() => {
    if (user) {
      loadPatientProfile()
    }
  }, [user])

  // Load available slots when date changes
  useEffect(() => {
    if (formData.doctor_id && formData.appointment_date) {
      loadAvailableSlots()
    }
  }, [formData.doctor_id, formData.appointment_date])

  const loadPatientProfile = async () => {
    if (!user) return
    
    try {
      const profile = await getPatientProfile(user.id)
      setPatientProfile(profile)
      
      // Pre-fill medical history from profile
      if (profile) {
        setFormData(prev => ({
          ...prev,
          medical_history: [
            profile.medical_conditions,
            profile.allergies,
            profile.current_medications
          ].filter(Boolean).join('\n')
        }))
      }
    } catch (error) {
      console.error('Error loading patient profile:', error)
    }
  }

  const loadAvailableSlots = async () => {
    if (!formData.doctor_id || !formData.appointment_date) return

    setLoadingSlots(true)
    try {
      const slots = await getAvailableSlots(formData.doctor_id, formData.appointment_date)
      setAvailableSlots(slots)
    } catch (error) {
      console.error('Error loading available slots:', error)
      setErrors({ general: 'Failed to load available time slots' })
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear time selection when date changes
    if (name === 'appointment_date') {
      setFormData(prev => ({
        ...prev,
        appointment_date: value,
        appointment_time: ''
      }))
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.doctor_id) {
      newErrors.doctor_id = 'Please select a doctor'
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Please select a date'
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time = 'Please select a time slot'
    }

    if (!formData.appointment_type) {
      newErrors.appointment_type = 'Please select appointment type'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setErrors({ general: 'You must be logged in to book an appointment' })
      return
    }

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    
    try {
      const appointmentData = {
        patient_id: user.id,
        doctor_id: formData.doctor_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        duration_minutes: 30, // Default duration
        appointment_type: formData.appointment_type,
        consultation_fee: 0, // Will be set based on doctor's fee
        symptoms: formData.symptoms,
        medical_history: formData.medical_history,
        notes: formData.notes
      }
      
      const appointment = await createAppointment(appointmentData)
      
      // Redirect to confirmation page
      router.push(`/patient/appointment-confirmation/${appointment.id}`)
    } catch (error: any) {
      console.error('Booking error:', error)
      setErrors({ 
        general: error.message || 'Failed to book appointment. Please try again.' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A4049] mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopUtilityBar />
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Book Appointment
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Schedule your medical consultation with our verified doctors.
            </p>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doctor Selection */}
              <div>
                <label htmlFor="doctor_id" className="block text-sm font-medium text-slate-700 mb-2">
                  Select Doctor *
                </label>
                <select
                  id="doctor_id"
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                    errors.doctor_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a doctor...</option>
                  <option value="doctor1">Dr. Pritesh Shah - Radiology</option>
                  <option value="doctor2">Dr. Gaurav Tiwari - Pediatrics</option>
                  <option value="doctor3">Dr. Anuradha Shah - Radiology</option>
                </select>
                {errors.doctor_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.doctor_id}</p>
                )}
              </div>

              {/* Date Selection */}
              <div>
                <label htmlFor="appointment_date" className="block text-sm font-medium text-slate-700 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  id="appointment_date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]} // Today's date
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                    errors.appointment_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.appointment_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointment_date}</p>
                )}
              </div>

              {/* Time Slot Selection */}
              {formData.appointment_date && (
                <div>
                  <label htmlFor="appointment_time" className="block text-sm font-medium text-slate-700 mb-2">
                    Select Time Slot *
                  </label>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A4049]"></div>
                      <span className="ml-2 text-slate-600">Loading available slots...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, appointment_time: slot.time }))}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            formData.appointment_time === slot.time
                              ? 'bg-[#2A4049] text-white border-[#2A4049]'
                              : slot.available
                              ? 'bg-white text-slate-700 border-gray-300 hover:border-[#2A4049] hover:text-[#2A4049]'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.appointment_time && (
                    <p className="mt-1 text-sm text-red-600">{errors.appointment_time}</p>
                  )}
                </div>
              )}

              {/* Appointment Type */}
              <div>
                <label htmlFor="appointment_type" className="block text-sm font-medium text-slate-700 mb-2">
                  Appointment Type *
                </label>
                <select
                  id="appointment_type"
                  name="appointment_type"
                  value={formData.appointment_type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] ${
                    errors.appointment_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="consultation">Initial Consultation</option>
                  <option value="follow-up">Follow-up Visit</option>
                  <option value="emergency">Emergency Consultation</option>
                  <option value="surgery">Surgery Consultation</option>
                </select>
                {errors.appointment_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointment_type}</p>
                )}
              </div>

              {/* Symptoms */}
              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700 mb-2">
                  Symptoms / Reason for Visit
                </label>
                <textarea
                  id="symptoms"
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049]"
                  placeholder="Please describe your symptoms or reason for the visit..."
                />
              </div>

              {/* Medical History */}
              <div>
                <label htmlFor="medical_history" className="block text-sm font-medium text-slate-700 mb-2">
                  Medical History
                </label>
                <textarea
                  id="medical_history"
                  name="medical_history"
                  value={formData.medical_history}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049]"
                  placeholder="Please provide relevant medical history..."
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049]"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>

              {/* Submit Button */}
              <div className="border-t pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#2A4049] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1F2F35] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Booking Appointment...' : 'Book Appointment'}
                </button>
                
                <p className="mt-4 text-center text-sm text-slate-600">
                  Need to reschedule?{' '}
                  <Link href="/patient/dashboard" className="text-[#2A4049] hover:underline font-medium">
                    Manage existing appointments
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
