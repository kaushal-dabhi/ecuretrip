'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  Search, 
  Star, 
  Filter, 
  Shield, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Target,
  Clock,
  Award,
  TrendingUp,
  Eye,
  MessageCircle,
  Calendar,
  Stethoscope,
  GraduationCap
} from 'lucide-react'

interface Doctor {
  id: string
  full_name: string
  email: string
  specialty?: string
  hospital?: string
  experience?: string
  qualifications?: string
  languages?: string
  consultation_fee?: number
  rating?: number
  cases_completed?: number
  response_time?: string
  verified?: boolean
  image_url?: string
  created_at: string
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [])

  async function fetchDoctors() {
    try {
      const response = await fetch('/api/doctors')
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to fetch doctors')
      } else {
        setDoctors(result.doctors || [])
        setFilteredDoctors(result.doctors || [])
      }
    } catch (err) {
      setError('Failed to fetch doctors')
    } finally {
      setLoading(false)
    }
  }

  // Filter doctors based on search and specialty
  useEffect(() => {
    let filtered = doctors

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty)
    }

    setFilteredDoctors(filtered)
  }, [doctors, searchTerm, selectedSpecialty])

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return 'Contact for pricing'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSpecialtyIcon = (specialty: string | undefined) => {
    switch (specialty?.toLowerCase()) {
      case 'oncology': return '🩺'
      case 'cardiology': return '❤️'
      case 'orthopedics': return '🦴'
      case 'neurology': return '🧠'
      case 'dental': return '🦷'
      case 'cosmetic': return '✨'
      case 'fertility': return '👶'
      default: return '👨‍⚕️'
    }
  }

  const getSpecialtyColor = (specialty: string | undefined) => {
    switch (specialty?.toLowerCase()) {
      case 'oncology': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'cardiology': return 'bg-red-100 text-red-800 border-red-200'
      case 'orthopedics': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'neurology': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'dental': return 'bg-green-100 text-green-800 border-green-200'
      case 'cosmetic': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'fertility': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A4049] mx-auto mb-4"></div>
              <p className="text-lg text-slate-600">Loading doctors...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
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
    <div className="min-h-screen bg-slate-50">
      <TopUtilityBar />
      <Navigation />
      
      {/* Header Bar */}
      <div className="pt-32">
        <div className="bg-[#2A4049] py-10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="hero-text text-white mb-6 drop-shadow-lg">Expert Medical Specialists</h1>
            <p className="description-text text-white max-w-3xl mx-auto drop-shadow-md">
              Connect with world-class doctors and specialists for your medical tourism journey. 
              Get expert consultations and personalized care.
            </p>
            </div>
        </div>
      </div>

      {/* Search and Filters */}
      <section className="py-6 bg-white relative overflow-hidden">
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#2A4049] w-5 h-5" />
              <input
                type="text"
                placeholder="Search doctors by name, specialty, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#ADC8A6] rounded-xl focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] bg-white body transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Specialty Filter */}
            <div className="relative">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-6 py-3 border-2 border-[#ADC8A6] rounded-xl focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] bg-white body appearance-none pr-10 transition-all duration-200 shadow-sm"
            >
              <option value="">All Specialties</option>
                <option value="Oncology">Oncology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Neurology">Neurology</option>
                <option value="Dental">Dental</option>
                <option value="Cosmetic">Cosmetic</option>
                <option value="Fertility">Fertility</option>
            </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-[#2A4049]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-8 bg-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-6">
            <h2 className="section-title text-slate-900 mb-2">
              Available Specialists
            </h2>
            <p className="description-text text-slate-600">
              {filteredDoctors.length} specialist{filteredDoctors.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-32 h-32 bg-gradient-to-br from-[#ADC8A6]/20 to-[#2A4049]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="w-16 h-16 text-[#2A4049]" />
              </div>
              <h3 className="heading-3 text-slate-900 mb-3">
                {doctors.length === 0 ? 'No doctors registered yet' : 'No doctors found'}
              </h3>
              <p className="description-text text-slate-600 mb-8 max-w-md mx-auto">
                {doctors.length === 0 
                  ? 'Doctors will appear here once they register through our platform. Check back soon!'
                  : 'Try adjusting your search criteria or browse all specialists.'
                }
              </p>
              {doctors.length > 0 && (
                <Button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedSpecialty('')
                  }}
                  className="bg-[#2A4049] hover:bg-[#1F2F35] text-white px-8 py-3 rounded-xl button-text transition-all duration-200"
                >
                  Clear Filters
                </Button>
              )}
                    </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredDoctors.map((doctor, index) => {
                const cardColors = ['border-[#2A4049]', 'border-[#ADC8A6]', 'border-[#2A4049]'];
                const iconColors = ['bg-[#2A4049]', 'bg-[#ADC8A6]', 'bg-[#2A4049]'];
                const iconTextColors = ['text-white', 'text-black', 'text-white'];
                const bgColors = ['bg-[#2A4049]/10', 'bg-[#ADC8A6]/10', 'bg-[#2A4049]/10'];
                const currentColorIndex = index % 3;
                
                return (
                <div key={doctor.id} className={`group bg-white rounded-xl border-2 ${cardColors[currentColorIndex]} shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden`}>
                  {/* Landscape Card Layout */}
                  <div className="flex flex-col md:flex-row">
                    {/* Left Side - Icon and Basic Info */}
                    <div className={`md:w-1/3 p-4 flex flex-col items-center justify-center ${bgColors[currentColorIndex]}`}>
                      <div className={`w-16 h-16 ${iconColors[currentColorIndex]} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <span className="text-white text-xl">{getSpecialtyIcon(doctor.specialty)}</span>
                      </div>
                      {doctor.verified && (
                        <div className="flex items-center gap-1 text-[#2A4049] mb-2">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs font-medium">Verified</span>
                        </div>
                      )}
                      {doctor.specialty && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSpecialtyColor(doctor.specialty)}`}>
                          {doctor.specialty}
                        </span>
                      )}
                  </div>

                    {/* Right Side - Details */}
                    <div className="md:w-2/3 p-4">
                      <div className="h-full flex flex-col">
                        {/* Title and Basic Info */}
                        <div className="mb-3">
                          <h3 className="card-title text-slate-900 mb-1 group-hover:text-[#2A4049] transition-colors">
                            {doctor.full_name}
                          </h3>
                          
                          <div className="space-y-1">
                            {doctor.hospital && (
                              <div className="flex items-center gap-2 text-slate-600 body-small">
                                <MapPin className="w-3 h-3" />
                                <span>{doctor.hospital}</span>
                          </div>
                            )}
                            {doctor.experience && (
                              <div className="flex items-center gap-2 text-slate-600 body-small">
                                <Award className="w-3 h-3" />
                                <span>{doctor.experience} years experience</span>
                          </div>
                            )}
                          </div>
                        </div>

                        {/* Stats and Fee */}
                        <div className="flex-1 mb-3">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="body-small font-medium text-slate-700">
                                {doctor.rating || '4.8'} rating
                            </span>
                            </div>
                            {doctor.cases_completed && (
                              <div className="body-small text-slate-600">
                                {doctor.cases_completed}+ cases
                            </div>
                            )}
                        </div>

                          <div className="flex items-center justify-between p-2 bg-gradient-to-r from-[#ADC8A6]/10 to-[#2A4049]/5 rounded-lg border border-[#ADC8A6]/20 mb-2">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-[#2A4049]" />
                              <span className="body-small font-medium text-slate-700">Consultation</span>
                            </div>
                            <div className="text-lg font-bold text-[#2A4049]">
                              {formatCurrency(doctor.consultation_fee)}
                          </div>
                        </div>

                          {/* Additional Info */}
                          <div className="space-y-1">
                            {doctor.response_time && (
                              <div className="flex items-center gap-2 body-small text-slate-600">
                                <Clock className="w-3 h-3" />
                                <span>Response: {doctor.response_time}</span>
                              </div>
                            )}
                            {doctor.languages && (
                              <div className="flex items-center gap-2 body-small text-slate-600">
                                <Users className="w-3 h-3" />
                                <span>{doctor.languages}</span>
                              </div>
                            )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-[#ADC8A6] text-black hover:bg-[#9BB896] py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                            icon={MessageCircle}
                          >
                            Consult
                          </Button>
                          <Button 
                            className="flex-1 bg-[#2A4049] hover:bg-[#1A2F36] text-white py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                            icon={Calendar}
                          >
                            Book
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
              </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Doctors Section */}
      <section className="py-8 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#2A4049]/25 rounded-full blur-xl"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="section-title text-black mb-3">
            Why Choose Our Doctors?
            </h2>
          <p className="description-text text-black mb-8">
            Connect with world-class specialists who understand your medical needs.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-8">
            {/* Board Certified */}
            <div className="flex items-start gap-3 max-w-xs">
              <div className="w-10 h-10 bg-[#2A4049] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="card-title text-black mb-1">Board Certified</h3>
                <p className="body text-black">
                  All doctors are board-certified with international qualifications and advanced training.
                </p>
              </div>
            </div>

            {/* Specialized Expertise */}
            <div className="flex items-start gap-3 max-w-xs">
              <div className="w-10 h-10 bg-[#ADC8A6] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <Stethoscope className="w-5 h-5 text-black" />
              </div>
              <div className="text-left">
                <h3 className="card-title text-black mb-1">Specialized Expertise</h3>
                <p className="body text-black">
                  Focused specialists in oncology, cardiology, orthopedics, and other complex medical fields.
                </p>
              </div>
            </div>

            {/* Direct Consultation */}
            <div className="flex items-start gap-3 max-w-xs">
              <div className="w-10 h-10 bg-[#ADC8A6] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="card-title text-black mb-1">Direct Consultation</h3>
                <p className="body text-black">
                  Get direct access to specialists for virtual consultations and treatment planning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}