'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth'
import { getPatientProfile } from '@/lib/auth'
import { getPatientAppointments } from '@/lib/appointments'
import { getPatientPayments } from '@/lib/payments'
import type { Appointment } from '@/lib/appointments'
import type { Payment } from '@/lib/payments'

export default function PatientDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin?redirect=/patient/dashboard')
    }
  }, [user, authLoading, router])

  // Load patient data
  useEffect(() => {
    if (user) {
      loadPatientData()
    }
  }, [user])

  const loadPatientData = async () => {
    try {
      if (!user) return

      // Load profile, appointments, and payments in parallel
      const [profileData, appointmentsData, paymentsData] = await Promise.all([
        getPatientProfile(user.id),
        getPatientAppointments(user.id),
        getPatientPayments(user.id)
      ])

        setProfile(profileData)
        setAppointments(appointmentsData)
      setPayments(paymentsData)
    } catch (error) {
      console.error('Error loading patient data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A4049] mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading dashboard...</p>
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
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome back, {profile?.full_name || 'Patient'}!
            </h1>
            <p className="text-lg text-slate-600">
              Manage your medical appointments and health records.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/patient/book-appointment"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Book Appointment</h3>
                  <p className="text-sm text-slate-600">Schedule a new consultation</p>
                </div>
              </div>
            </Link>

            <Link
              href="/patient/appointments"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              <div>
                  <h3 className="font-semibold text-slate-900">My Appointments</h3>
                  <p className="text-sm text-slate-600">View and manage appointments</p>
                </div>
              </div>
            </Link>

            <Link
              href="/patient/profile"
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">My Profile</h3>
                  <p className="text-sm text-slate-600">Update personal information</p>
                </div>
              </div>
            </Link>
            </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Appointments */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Recent Appointments</h3>
                <Link
                  href="/patient/appointments"
                  className="text-sm text-[#2A4049] hover:text-[#1F2F35] font-medium"
                >
                  View All
                </Link>
          </div>

          <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
            <div>
                          <p className="font-medium text-slate-900">
                            Dr. {appointment.doctor?.full_name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {appointment.doctor?.specialty} • {appointment.doctor?.hospital}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 mb-4">No appointments yet</p>
                    <Link
                      href="/patient/book-appointment"
                      className="inline-flex items-center px-4 py-2 bg-[#2A4049] text-white rounded-lg hover:bg-[#1F2F35] transition-colors"
                    >
                      Book Your First Appointment
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Recent Payments</h3>
                <Link
                  href="/patient/payments"
                  className="text-sm text-[#2A4049] hover:text-[#1F2F35] font-medium"
                >
                  View All
                </Link>
                    </div>
              
              <div className="space-y-4">
                {payments.length > 0 ? (
                  payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                    <div>
                          <p className="font-medium text-slate-900">
                            {payment.currency} {payment.amount}
                          </p>
                          <p className="text-sm text-slate-600">
                            {payment.appointment ? (
                              `Appointment on ${new Date(payment.appointment.appointment_date).toLocaleDateString()}`
                            ) : (
                              'Payment'
                            )}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.payment_status)}`}>
                            {payment.payment_status}
                          </span>
                          <p className="text-xs text-slate-500 mt-1 capitalize">
                            {payment.payment_method.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                  ) : (
                    <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <p className="text-gray-500">No payments yet</p>
                    </div>
                  )}
              </div>
            </div>
            </div>

          {/* Profile Summary */}
          {profile && (
            <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-slate-900">{profile.full_name}</p>
                  </div>
                  <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-slate-900">{profile.email}</p>
                  </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-slate-900">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Preferred Language</p>
                  <p className="font-medium text-slate-900 capitalize">{profile.preferred_language}</p>
                  </div>
                <div>
                  <p className="text-sm text-gray-600">Emergency Contact</p>
                  <p className="font-medium text-slate-900">{profile.emergency_contact_name}</p>
                  </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-slate-900">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </div>
          </div>
          </div>
        )}
        </div>
      </div>

      <Footer />
    </div>
  )
}