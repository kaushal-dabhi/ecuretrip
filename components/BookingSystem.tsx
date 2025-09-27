'use client'

import { useState } from 'react'
import { CreditCard, CheckCircle, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PaymentForm from './PaymentForm'

interface BookingStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface BookingSystemProps {
  doctorName: string
  specialty: string
  consultationFee: number
  onClose: () => void
}

export default function BookingSystem({ doctorName, specialty, consultationFee, onClose }: BookingSystemProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    consultationType: 'video',
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientCountry: '',
    medicalHistory: '',
    symptoms: '',
    preferredLanguage: 'English'
  })
  const [showPayment, setShowPayment] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)



  const steps: BookingStep[] = [
    { id: 'appointment', title: 'Select Appointment', description: 'Choose date and time', completed: false },
    { id: 'patient', title: 'Patient Details', description: 'Enter your information', completed: false },
    { id: 'medical', title: 'Medical Information', description: 'Share your symptoms', completed: false },
    { id: 'payment', title: 'Payment', description: 'Complete booking', completed: false },
    { id: 'confirmation', title: 'Confirmation', description: 'Booking confirmed', completed: false }
  ]

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ]

  const consultationTypes = [
    { id: 'video', name: 'Video Consultation', description: 'Online video call', icon: '📹' },
    { id: 'in-person', name: 'In-Person Visit', description: 'Visit the hospital', icon: '🏥' },
    { id: 'second-opinion', name: 'Second Opinion', description: 'Review medical reports', icon: '📋' }
  ]

  const countries = [
    'United Arab Emirates', 'Saudi Arabia', 'Nigeria', 'Kenya', 'United Kingdom', 'United States',
    'Canada', 'Australia', 'Germany', 'France', 'Singapore', 'Malaysia'
  ]

  const languages = ['English', 'Hindi', 'Arabic', 'French', 'German', 'Spanish']

  const updateStep = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      // Mark current step as completed
      steps[currentStep].completed = true
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentSuccess = () => {
    setShowPayment(false)
    setCurrentStep(4) // Move to confirmation step
    setBookingConfirmed(true)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    // Handle payment error
  }

  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return bookingData.appointmentDate && bookingData.appointmentTime
      case 1:
        return bookingData.patientName && bookingData.patientPhone && bookingData.patientEmail
      case 2:
        return bookingData.symptoms
      default:
        return true
    }
  }

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-night mb-4">Select Appointment Date & Time</h3>
              
              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-sand-700 mb-2">Appointment Date</label>
                <input
                  type="date"
                  value={bookingData.appointmentDate}
                  onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-oasis-500 focus:border-transparent"
                />
              </div>

              {/* Time Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-sand-700 mb-2">Appointment Time</label>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleInputChange('appointmentTime', time)}
                      className={`p-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        bookingData.appointmentTime === time
                          ? 'bg-oasis-500 text-white border-oasis-500'
                          : 'bg-white text-sand-700 border-sand-300 hover:border-oasis-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block text-sm font-medium text-sand-700 mb-2">Consultation Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {consultationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleInputChange('consultationType', type.id)}
                      className={`p-4 text-left rounded-lg border transition-all duration-200 ${
                        bookingData.consultationType === type.id
                          ? 'bg-oasis-50 border-oasis-300'
                          : 'bg-white border-sand-300 hover:border-sand-400'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-medium text-night">{type.name}</div>
                      <div className="text-sm text-sand-600">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-night mb-4">Patient Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={bookingData.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-oasis-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={bookingData.patientPhone}
                    onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-oasis-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={bookingData.patientEmail}
                    onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-oasis-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">Country</label>
                  <select
                    value={bookingData.patientCountry}
                    onChange={(e) => handleInputChange('patientCountry', e.target.value)}
                    className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-oasis-500 focus:border-transparent"
                  >
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-sand-700 mb-2">Preferred Language</label>
                  <select
                    value={bookingData.preferredLanguage}
                    onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
                    className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-oasis-500 focus:border-transparent"
                  >
                    {languages.map((language) => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-night mb-4">Medical Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">Current Symptoms</label>
                  <textarea
                    value={bookingData.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    placeholder="Describe your current symptoms and concerns..."
                    rows={4}
                    className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-oasis-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sand-700 mb-2">Medical History (Optional)</label>
                  <textarea
                    value={bookingData.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    placeholder="Any relevant medical history, previous treatments, or conditions..."
                    rows={3}
                    className="w-full px-4 py-3 border border-sand-300 rounded-lg focus:ring-2 focus:ring-oasis-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-night mb-4">Booking Summary & Payment</h3>
              
              {/* Booking Summary */}
              <div className="bg-sand-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-night mb-4">Appointment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-sand-600">Doctor:</span>
                    <span className="ml-2 font-medium text-night">{doctorName}</span>
                  </div>
                  <div>
                    <span className="text-sand-600">Specialty:</span>
                    <span className="ml-2 font-medium text-night">{specialty}</span>
                  </div>
                  <div>
                    <span className="text-sand-600">Date:</span>
                    <span className="ml-2 font-medium text-night">{bookingData.appointmentDate}</span>
                  </div>
                  <div>
                    <span className="text-sand-600">Time:</span>
                    <span className="ml-2 font-medium text-night">{bookingData.appointmentTime}</span>
                  </div>
                  <div>
                    <span className="text-sand-600">Type:</span>
                    <span className="ml-2 font-medium text-night capitalize">{bookingData.consultationType.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-sand-600">Patient:</span>
                    <span className="ml-2 font-medium text-night">{bookingData.patientName}</span>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div>
                <h4 className="font-semibold text-night mb-4">Payment</h4>
                <div className="bg-white border border-sand-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sand-600">Consultation Fee:</span>
                    <span className="text-xl font-bold text-oasis-600">₹{consultationFee}</span>
                  </div>
                  <button
                    onClick={() => setShowPayment(true)}
                    className="w-full btn-primary py-3 text-lg"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-cyan-500" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-night mb-2">Booking Confirmed!</h3>
              <p className="text-sand-600">
                Your appointment with {doctorName} has been successfully scheduled.
              </p>
            </div>

            <div className="bg-sand-50 rounded-lg p-6 text-left">
              <h4 className="font-semibold text-night mb-3">Appointment Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sand-600">Date:</span>
                  <span className="font-medium">{bookingData.appointmentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand-600">Time:</span>
                  <span className="font-medium">{bookingData.appointmentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sand-600">Type:</span>
                  <span className="font-medium capitalize">{bookingData.consultationType.replace('-', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-sand-600">
                You will receive a confirmation email with all the details and a video call link (if applicable).
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Done
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-hero text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book Consultation</h2>
              <p className="text-sand-100">with {doctorName} - {specialty}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-sand-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => updateStep(index)}
                  className={`flex items-center space-x-2 ${
                    index <= currentStep ? 'text-oasis-600' : 'text-sand-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep
                      ? 'bg-cyan-500 text-white'
                      : index === currentStep
                      ? 'bg-oasis-500 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-cyan-500' : 'bg-sand-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {getStepContent()}
        </div>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="p-6 border-t border-sand-200 bg-sand-50">
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 3 ? 'Complete Booking' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <PaymentForm
            amount={consultationFee}
            currency="INR"
            description={`Consultation with ${doctorName} - ${bookingData.appointmentDate} at ${bookingData.appointmentTime}`}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
