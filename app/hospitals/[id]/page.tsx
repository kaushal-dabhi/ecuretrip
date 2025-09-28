'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  ArrowLeft,
  Building,
  Heart,
  Stethoscope,
  Bed,
  Calendar,
  MessageCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

interface Hospital {
  id: string
  name: string
  location: string
  rating: number
  image_url: string | null
  description: string | null
  specialties: string[]
  website: string | null
  phone: string | null
}

export default function HospitalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHospital() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('hospitals')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) {
          throw error
        }

        setHospital(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchHospital()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A4049] mx-auto mb-4"></div>
              <p className="text-lg text-slate-600">Loading hospital details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopUtilityBar />
        <Navigation />
        <div className="pt-32 pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-16 h-16 text-red-600" />
              </div>
              <h3 className="heading-3 text-slate-900 mb-3">Hospital Not Found</h3>
              <p className="description-text text-slate-600 mb-8 max-w-md mx-auto">
                The hospital you're looking for could not be found or may have been removed.
              </p>
              <div className="space-x-4">
                <Button 
                  onClick={() => router.back()}
                  className="bg-[#ADC8A6] hover:bg-[#9BB596] text-[#2A4049] px-8 py-3 rounded-xl button-text transition-all duration-200"
                >
                  Go Back
                </Button>
                <Link href="/hospitals">
                  <Button className="bg-[#2A4049] hover:bg-[#1F2F35] text-white px-8 py-3 rounded-xl button-text transition-all duration-200">
                    View All Hospitals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopUtilityBar />
      <Navigation />
      
      {/* Header Bar */}
      <div className="pt-32">
        <div className="py-8" style={{ backgroundColor: '#2A4049' }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-4">
              <Link 
                href="/hospitals"
                className="flex items-center gap-2 text-white hover:text-[#ADC8A6] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="button-text">Back to Hospitals</span>
              </Link>
            </div>
            <h1 className="section-title text-white mb-2 drop-shadow-lg">{hospital.name}</h1>
            <p className="description-text text-white/90 drop-shadow-md">
              {hospital.location} • {hospital.specialties && hospital.specialties.length > 0 ? hospital.specialties.join(', ') : 'Multi-Specialty Hospital'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hospital Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-xl border border-[#ADC8A6]/20 shadow-lg">
              <CardBody className="p-8">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 bg-[#2A4049] rounded-full flex items-center justify-center flex-shrink-0">
                    <Building className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="heading-3 text-slate-900 mb-2">{hospital.name}</h2>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-[#2A4049]" />
                      <span className="body text-slate-600">{hospital.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="body font-semibold text-slate-700">
                        {hospital.rating ? hospital.rating.toFixed(1) : '4.5'} out of 5
                      </span>
                    </div>
                  </div>
                </div>

                {hospital.description && (
                  <div className="mb-6">
                    <h3 className="heading-4 text-slate-900 mb-3">About This Hospital</h3>
                    <p className="body text-slate-700 leading-relaxed">{hospital.description}</p>
                  </div>
                )}

                {/* Specialties */}
                {hospital.specialties && hospital.specialties.length > 0 && (
                  <div className="mb-6">
                    <h3 className="heading-4 text-slate-900 mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {hospital.specialties.map((specialty, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 text-sm rounded-full font-medium"
                          style={{ backgroundColor: '#ADC8A6', color: '#2A4049' }}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Contact & Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="bg-white rounded-xl border border-[#ADC8A6]/20 shadow-lg">
              <CardBody className="p-6">
                <h3 className="heading-4 text-slate-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {hospital.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#2A4049]" />
                      <span className="body text-slate-700">{hospital.phone}</span>
                    </div>
                  )}
                  {hospital.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-[#2A4049]" />
                      <a 
                        href={hospital.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="body text-[#2A4049] hover:text-[#1F2F35] transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Accreditation */}
            <Card className="bg-white rounded-xl border border-[#ADC8A6]/20 shadow-lg">
              <CardBody className="p-6">
                <h3 className="heading-4 text-slate-900 mb-4">Accreditations</h3>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FECA58]" />
                  <span className="body font-semibold text-slate-700">NABH Accredited</span>
                </div>
              </CardBody>
            </Card>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link href="/intake" className="block">
                <Button className="w-full bg-[#2A4049] hover:bg-[#1F2F35] text-white py-3 rounded-xl button-text transition-all duration-200">
                  Book Consultation
                </Button>
              </Link>
              <Link href="/contact" className="block">
                <Button className="w-full bg-[#ADC8A6] hover:bg-[#9BB596] text-[#2A4049] py-3 rounded-xl button-text transition-all duration-200">
                  Contact Hospital
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
