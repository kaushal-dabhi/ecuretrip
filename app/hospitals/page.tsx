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
        <div className="bg-[#2A4049] py-10">
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
      <section className="py-6 bg-white relative overflow-hidden">
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#2A4049] w-5 h-5" />
              <input
                type="text"
                placeholder="Search hospitals by name, location, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#ADC8A6] rounded-xl focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] bg-white body transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Country Filter */}
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-6 py-3 border-2 border-[#ADC8A6] rounded-xl focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] bg-white body appearance-none pr-10 transition-all duration-200 shadow-sm"
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
                className="px-6 py-3 border-2 border-[#2A4049] rounded-xl focus:ring-2 focus:ring-[#2A4049] focus:border-[#2A4049] bg-white body appearance-none pr-10 transition-all duration-200 shadow-sm"
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
      <section className="py-8 bg-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-6">
            <h2 className="section-title text-slate-900 mb-2">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredHospitals.map((hospital, index) => {
                const cardColors = ['border-[#2A4049]', 'border-[#ADC8A6]', 'border-[#2A4049]'];
                const iconColors = ['bg-[#2A4049]', 'bg-[#ADC8A6]', 'bg-[#2A4049]'];
                const iconTextColors = ['text-white', 'text-black', 'text-white'];
                const bgColors = ['bg-[#2A4049]/10', 'bg-[#ADC8A6]/10', 'bg-[#2A4049]/10'];
                const currentColorIndex = index % 3;
                
                return (
                <div key={hospital.id} className={`group bg-white rounded-xl border-2 ${cardColors[currentColorIndex]} shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden`}>
                  {/* Landscape Card Layout */}
                  <div className="flex flex-col md:flex-row">
                    {/* Left Side - Icon and Basic Info */}
                    <div className={`md:w-1/3 p-4 flex flex-col items-center justify-center ${bgColors[currentColorIndex]}`}>
                      <div className={`w-16 h-16 ${iconColors[currentColorIndex]} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Building className={`w-8 h-8 ${iconTextColors[currentColorIndex]}`} />
                      </div>
                      <div className="flex items-center gap-1 text-[#2A4049] mb-2">
                        <CheckCircle className="w-3 h-3" />
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
                    <div className="md:w-2/3 p-4">
                      <div className="h-full flex flex-col">
                        {/* Title and Location */}
                        <div className="mb-3">
                          <h3 className="card-title text-slate-900 mb-1 group-hover:text-[#2A4049] transition-colors">
                            {hospital.name}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-600 body-small mb-2">
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
                        <div className="flex-1 mb-3">
                          {/* Specialties */}
                          <div className="mb-2">
                            <h4 className="body-small font-semibold text-slate-900 mb-1">Specialties</h4>
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
                        <div className="flex gap-2">
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
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Hospitals Section */}
      <section className="py-8 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#2A4049]/25 rounded-full blur-xl"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="section-title text-black mb-3">
            Why Choose Our Hospitals?
          </h2>
          <p className="description-text text-black mb-8">
            Partner with internationally accredited hospitals offering world-class medical facilities.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-8">
            {/* International Accreditation */}
            <div className="flex items-start gap-3 max-w-xs">
              <div className="w-10 h-10 bg-[#2A4049] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="card-title text-black mb-1">International Accreditation</h3>
                <p className="body text-black">
                  JCI, NABH, and ISO certified hospitals meeting global healthcare standards.
                </p>
              </div>
            </div>

            {/* Advanced Technology */}
            <div className="flex items-start gap-3 max-w-xs">
              <div className="w-10 h-10 bg-[#ADC8A6] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <Building className="w-5 h-5 text-black" />
              </div>
              <div className="text-left">
                <h3 className="card-title text-black mb-1">Advanced Technology</h3>
                <p className="body text-black">
                  State-of-the-art medical equipment and cutting-edge treatment facilities.
                </p>
              </div>
            </div>

            {/* Comprehensive Care */}
            <div className="flex items-start gap-3 max-w-xs">
              <div className="w-10 h-10 bg-[#ADC8A6] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="card-title text-black mb-1">Comprehensive Care</h3>
                <p className="body text-black">
                  Full-spectrum medical services with multilingual support and cultural sensitivity.
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