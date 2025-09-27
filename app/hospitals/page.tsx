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
  MapPin, 
  Star, 
  Phone, 
  Globe, 
  Award,
  Shield,
  Clock,
  Users,
  Search,
  Filter,
  CheckCircle,
  Building,
  Heart,
  Stethoscope,
  Bed,
  Calendar,
  MessageCircle,
  ArrowRight
} from 'lucide-react'

interface Hospital {
  id: string
  name: string
  location: string
  country: string
  city: string
  accreditation: string[]
  specialties: string[]
  contact_email: string
  contact_phone: string
  website: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')

  useEffect(() => {
    fetchHospitals()
  }, [])

  async function fetchHospitals() {
    try {
      const response = await fetch('/api/hospitals')
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to fetch hospitals')
      } else {
        setHospitals(result.hospitals || [])
        setFilteredHospitals(result.hospitals || [])
      }
    } catch (err) {
      setError('Failed to fetch hospitals')
    } finally {
      setLoading(false)
    }
  }

  // Filter hospitals based on search, country, and specialty
  useEffect(() => {
    let filtered = hospitals

    if (searchTerm) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (selectedCountry) {
      filtered = filtered.filter(hospital => hospital.country === selectedCountry)
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(hospital => 
        hospital.specialties.includes(selectedSpecialty)
      )
    }

    setFilteredHospitals(filtered)
  }, [hospitals, searchTerm, selectedCountry, selectedSpecialty])

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'oncology': return '🩺'
      case 'cardiology': return '❤️'
      case 'orthopedics': return '🦴'
      case 'neurology': return '🧠'
      case 'dental': return '🦷'
      case 'cosmetic': return '✨'
      case 'fertility': return '👶'
      case 'transplant': return '🔄'
      default: return '🏥'
    }
  }

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'oncology': return 'bg-pink-100 text-pink-800'
      case 'cardiology': return 'bg-red-100 text-red-800'
      case 'orthopedics': return 'bg-blue-100 text-blue-800'
      case 'neurology': return 'bg-purple-100 text-purple-800'
      case 'dental': return 'bg-green-100 text-green-800'
      case 'cosmetic': return 'bg-yellow-100 text-yellow-800'
      case 'fertility': return 'bg-indigo-100 text-indigo-800'
      case 'transplant': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAccreditationColor = (accreditation: string) => {
    switch (accreditation.toLowerCase()) {
      case 'jci': return 'bg-blue-100 text-blue-800'
      case 'nabh': return 'bg-green-100 text-green-800'
      case 'iso 9001': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
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
              <p className="text-lg text-slate-600">Loading hospitals...</p>
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
        <div className="bg-[#2A4049] py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="hero-text text-white mb-6 drop-shadow-lg">Partner Hospitals</h1>
            <p className="description-text text-white max-w-3xl mx-auto drop-shadow-md">
              World-class hospitals with international accreditations and cutting-edge medical technology. 
              Your health and safety are our top priorities.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <section className="py-12 bg-white/80 backdrop-blur-sm border-b border-[#ADC8A6]/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#2A4049] w-5 h-5" />
              <input
                type="text"
                placeholder="Search hospitals by name, location, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-[#ADC8A6]/30 rounded-xl focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] bg-white/90 backdrop-blur-sm body transition-all duration-200"
              />
            </div>

            {/* Country Filter */}
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-6 py-4 border-2 border-[#ADC8A6]/30 rounded-xl focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] bg-white/90 backdrop-blur-sm body appearance-none pr-10 transition-all duration-200"
              >
                <option value="">All Countries</option>
                {Array.from(new Set(hospitals.map(h => h.country))).map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-[#2A4049]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Specialty Filter */}
            <div className="relative">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-6 py-4 border-2 border-[#ADC8A6]/30 rounded-xl focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] bg-white/90 backdrop-blur-sm body appearance-none pr-10 transition-all duration-200"
              >
                <option value="">All Specialties</option>
                {Array.from(new Set(hospitals.flatMap(h => h.specialties))).map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
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

      {/* Hospitals Grid */}
      <section className="py-20 bg-gradient-to-br from-[#ADC8A6]/5 via-white to-[#2A4049]/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(173,200,166,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(42,64,73,0.05)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-16 left-20 w-28 h-28 bg-[#ADC8A6]/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 right-20 w-36 h-36 bg-[#2A4049]/10 rounded-full blur-xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="section-title text-slate-900 mb-4">
              Partner Hospitals
            </h2>
            <p className="description-text text-slate-600">
              {filteredHospitals.length} hospital{filteredHospitals.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredHospitals.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-[#ADC8A6]/20 to-[#2A4049]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-16 h-16 text-[#2A4049]" />
              </div>
              <h3 className="heading-3 text-slate-900 mb-3">No hospitals found</h3>
              <p className="description-text text-slate-600 mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or browse all hospitals.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCountry('')
                  setSelectedSpecialty('')
                }}
                className="bg-[#2A4049] hover:bg-[#1F2F35] text-white px-8 py-3 rounded-xl button-text transition-all duration-200"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredHospitals.map((hospital) => (
                <div key={hospital.id} className="group bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-[#ADC8A6]/20 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                  {/* Landscape Card Layout */}
                  <div className="flex flex-col md:flex-row">
                    {/* Left Side - Icon and Basic Info */}
                    <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-[#ADC8A6]/5 to-[#2A4049]/5">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#ADC8A6] to-[#2A4049] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Building className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-[#2A4049] mb-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                      
                      {/* Accreditations - Compact */}
                      <div className="flex flex-wrap gap-1 justify-center">
                        {hospital.accreditation.slice(0, 2).map((acc, index) => (
                          <span 
                            key={index}
                            className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getAccreditationColor(acc)}`}
                          >
                            {acc}
                          </span>
                        ))}
                        {hospital.accreditation.length > 2 && (
                          <span className="text-xs text-slate-500">
                            +{hospital.accreditation.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Side - Details */}
                    <div className="md:w-2/3 p-6">
                      <div className="h-full flex flex-col">
                        {/* Title and Location */}
                        <div className="mb-4">
                          <h3 className="card-title text-slate-900 mb-2 group-hover:text-[#2A4049] transition-colors">
                            {hospital.name}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-600 body-small mb-3">
                            <MapPin className="w-3 h-3" />
                            <span>{hospital.location}</span>
                          </div>
                          
                          {/* Description - Truncated */}
                          {hospital.description && (
                            <p className="body-small text-slate-600 leading-relaxed line-clamp-2">
                              {hospital.description}
                            </p>
                          )}
                        </div>

                        {/* Specialties and Contact */}
                        <div className="flex-1 mb-4">
                          {/* Specialties */}
                          <div className="mb-3">
                            <h4 className="body-small font-semibold text-slate-900 mb-2">Specialties</h4>
                            <div className="flex flex-wrap gap-1">
                              {hospital.specialties.slice(0, 3).map((specialty, index) => (
                                <span 
                                  key={index}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSpecialtyColor(specialty)}`}
                                >
                                  <span>{getSpecialtyIcon(specialty)}</span>
                                  {specialty}
                                </span>
                              ))}
                              {hospital.specialties.length > 3 && (
                                <span className="text-xs text-slate-500">
                                  +{hospital.specialties.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="space-y-1">
                            {hospital.contact_phone && (
                              <div className="flex items-center gap-2 body-small text-slate-600">
                                <Phone className="w-3 h-3" />
                                <span>{hospital.contact_phone}</span>
                              </div>
                            )}
                            {hospital.website && (
                              <div className="flex items-center gap-2 body-small text-slate-600">
                                <Globe className="w-3 h-3" />
                                <a 
                                  href={hospital.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[#2A4049] hover:text-[#1A2F36]"
                                >
                                  Visit Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button 
                            className="flex-1 bg-[#ADC8A6] text-black hover:bg-[#9BB896] py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                            icon={MessageCircle}
                          >
                            Contact
                          </Button>
                          <Button 
                            className="flex-1 bg-[#2A4049] hover:bg-[#1A2F36] text-white py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                            icon={Calendar}
                          >
                            Book Visit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-[#ADC8A6]/10 via-white to-[#2A4049]/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(173,200,166,0.08)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(42,64,73,0.05)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-12 left-16 w-24 h-24 bg-[#ADC8A6]/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-12 right-16 w-32 h-32 bg-[#2A4049]/10 rounded-full blur-xl"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="section-title text-slate-900 mb-4">
              Why Choose Our Partner Hospitals?
            </h2>
            <p className="description-text text-slate-600 max-w-3xl mx-auto">
              Our partner hospitals are carefully selected for their excellence in medical care, 
              international accreditations, and commitment to patient safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white/80 rounded-2xl shadow-lg border border-[#ADC8A6]/20">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ADC8A6] to-[#2A4049] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="heading-4 text-slate-900 mb-4">International Accreditation</h3>
              <p className="body text-slate-600">
                JCI, NABH, and other international accreditations ensuring highest quality standards.
              </p>
            </div>

            <div className="text-center p-6 bg-white/80 rounded-2xl shadow-lg border border-[#ADC8A6]/20">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ADC8A6] to-[#2A4049] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="heading-4 text-slate-900 mb-4">Advanced Technology</h3>
              <p className="body text-slate-600">
                State-of-the-art medical equipment and cutting-edge treatment facilities.
              </p>
            </div>

            <div className="text-center p-6 bg-white/80 rounded-2xl shadow-lg border border-[#ADC8A6]/20">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ADC8A6] to-[#2A4049] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="heading-4 text-slate-900 mb-4">Patient-Centered Care</h3>
              <p className="body text-slate-600">
                Comprehensive care with multilingual support and cultural sensitivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}