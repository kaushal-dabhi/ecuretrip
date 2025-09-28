'use client'

import { useState } from 'react'
import Link from 'next/link'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  User, 
  Heart, 
  FileText, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react'

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Medical History', icon: Heart },
  { id: 3, title: 'Treatment Details', icon: FileText },
  { id: 4, title: 'Review & Submit', icon: CheckCircle }
]

export default function IntakePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    country: '',
    city: '',
    
    // Medical History
    currentConditions: '',
    medications: '',
    allergies: '',
    previousSurgeries: '',
    familyHistory: '',
    
    // Treatment Details
    treatmentInterest: '',
    urgency: '',
    budget: '',
    preferredCountries: [],
    timeline: '',
    
    // Additional Info
    additionalInfo: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // In a real application, this would submit to your backend
    console.log('Form submitted:', formData)
    // Redirect to treatments page or show success message
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="label-text block mb-2">
                  First Name *
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Last Name *
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Date of Birth *
                </label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
                <label htmlFor="currentConditions" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Current Medical Conditions
                </label>
              <textarea
                id="currentConditions"
                name="currentConditions"
                rows={3}
                value={formData.currentConditions}
                onChange={handleChange}
                placeholder="Please describe any current medical conditions..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
              />
            </div>

            <div>
                <label htmlFor="medications" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Current Medications
                </label>
              <textarea
                id="medications"
                name="medications"
                rows={3}
                value={formData.medications}
                onChange={handleChange}
                placeholder="List all current medications and dosages..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
              />
            </div>

            <div>
                <label htmlFor="allergies" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Allergies
                </label>
              <textarea
                id="allergies"
                name="allergies"
                rows={2}
                value={formData.allergies}
                onChange={handleChange}
                placeholder="List any known allergies..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
              />
            </div>

            <div>
                <label htmlFor="previousSurgeries" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Previous Surgeries
                </label>
              <textarea
                id="previousSurgeries"
                name="previousSurgeries"
                rows={3}
                value={formData.previousSurgeries}
                onChange={handleChange}
                placeholder="Describe any previous surgeries or medical procedures..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
              />
            </div>

            <div>
                <label htmlFor="familyHistory" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Family Medical History
                </label>
              <textarea
                id="familyHistory"
                name="familyHistory"
                rows={3}
                value={formData.familyHistory}
                onChange={handleChange}
                placeholder="Any relevant family medical history..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
                <label htmlFor="treatmentInterest" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Treatment of Interest *
                </label>
              <select
                id="treatmentInterest"
                name="treatmentInterest"
                required
                value={formData.treatmentInterest}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
              >
                <option value="">Select treatment</option>
                <option value="oncology">Oncology</option>
                <option value="cardiology">Cardiology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="neurology">Neurology</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="cosmetic">Cosmetic Surgery</option>
                <option value="fertility">Fertility</option>
                <option value="transplant">Transplant</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="urgency" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Urgency Level
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
                >
                  <option value="">Select urgency</option>
                  <option value="immediate">Immediate (within 1 month)</option>
                  <option value="urgent">Urgent (within 3 months)</option>
                  <option value="planned">Planned (within 6 months)</option>
                  <option value="exploring">Just exploring options</option>
                </select>
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
                >
                  <option value="">Select budget range</option>
                  <option value="under-10k">Under $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="over-100k">Over $100,000</option>
                  <option value="flexible">Flexible budget</option>
                </select>
              </div>
            </div>

            <div>
                <label htmlFor="timeline" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Preferred Timeline
                </label>
              <textarea
                id="timeline"
                name="timeline"
                rows={2}
                value={formData.timeline}
                onChange={handleChange}
                placeholder="When would you like to receive treatment?"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
              />
            </div>

            <div>
                <label htmlFor="additionalInfo" className="block text-sm font-bold text-[#2A4049] mb-2">
                  Additional Information
                </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows={4}
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Any additional information that would help us assist you better..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-[#ADC8A6]/10 border border-[#ADC8A6]/20 rounded-lg p-6">
                <h3 className="heading-4 text-[#2A4049] mb-4">Review Your Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#2A4049] font-bold">Name:</span>
                  <span className="font-bold">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2A4049] font-bold">Email:</span>
                  <span className="font-bold">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2A4049] font-bold">Phone:</span>
                  <span className="font-bold">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#2A4049] font-bold">Treatment Interest:</span>
                  <span className="font-bold">{formData.treatmentInterest}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#ADC8A6]/10 border border-[#ADC8A6]/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-[#2A4049]" />
                <h3 className="text-lg font-bold text-[#2A4049]">Privacy & Security</h3>
              </div>
              <p className="text-[#2A4049] text-sm font-semibold">
                Your medical information is protected by HIPAA-compliant security measures. 
                We will only share your information with medical professionals involved in your care.
              </p>
            </div>

            <div className="bg-[#ADC8A6]/10 border border-[#ADC8A6]/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#2A4049]" />
                <h3 className="text-lg font-bold text-[#2A4049]">What Happens Next?</h3>
              </div>
              <ul className="text-[#2A4049] text-sm font-semibold space-y-2">
                <li>• Our medical team will review your information within 24 hours</li>
                <li>• We'll provide you with personalized treatment options</li>
                <li>• You'll receive a detailed treatment plan and cost estimate</li>
                <li>• Our patient coordinator will guide you through the entire process</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopUtilityBar />
      <Navigation />
      
      {/* Header Bar */}
      <div className="pt-32">
        <div className="bg-[#2A4049] py-10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="hero-text text-white mb-6 drop-shadow-lg">Medical Intake Form</h1>
            <p className="description-text text-white max-w-3xl mx-auto drop-shadow-md">
              Help us understand your medical needs so we can provide you with the best 
              treatment options and personalized care recommendations.
            </p>
          </div>
        </div>
      </div>

      <div className="pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Progress Steps */}
          <div className="mb-8 mt-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id 
                      ? 'bg-[#2A4049] border-[#2A4049] text-white' 
                      : 'bg-white border-slate-300 text-slate-500'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`body-small font-semibold ${
                      currentStep >= step.id ? 'text-[#2A4049]' : 'text-slate-600'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-[#2A4049]' : 'bg-slate-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <h2 className="heading-3 text-[#2A4049]">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h2>
              <p className="body">
                Please provide the following information to help us assist you better.
              </p>
            </CardHeader>
            <CardBody>
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="border-[#2A4049] text-[#2A4049] hover:bg-[#2A4049] hover:text-white"
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button onClick={nextStep} icon={ArrowRight} className="bg-[#2A4049] hover:bg-[#1F2F35]">
                    Next Step
                  </Button>
                ) : (
                  <Link href="/treatments">
                    <Button onClick={handleSubmit} className="bg-[#ADC8A6] text-[#2A4049] hover:bg-[#ADC8A6]/90" icon={CheckCircle}>
                      Submit & Browse Treatments
                    </Button>
                  </Link>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <Card className="bg-[#ADC8A6]/10 border-[#ADC8A6]/20">
              <CardBody className="py-6">
                <h3 className="heading-4 text-[#2A4049] mb-4">
                  Need Help Filling Out This Form?
                </h3>
                <p className="body text-[#2A4049] mb-6">
                  Our medical tourism experts are here to assist you. Contact us for personalized guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button variant="outline" className="border-[#2A4049] text-[#2A4049] hover:bg-[#2A4049] hover:text-white">
                      Contact Support
                    </Button>
                  </Link>
                  <Link href="tel:+1-555-123-4567">
                    <Button className="bg-[#2A4049] hover:bg-[#1F2F35]">
                      Call Now: (555) 123-4567
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
