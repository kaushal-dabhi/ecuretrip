'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Treatment } from '@/types/database'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  ArrowLeft,
  DollarSign, 
  Calendar, 
  CheckCircle,
  Shield,
  Target,
  Star,
  Clock,
  Users,
  Phone,
  MessageCircle,
  FileText,
  Heart,
  Stethoscope,
  MapPin,
  Award,
  Activity,
  Zap,
  BookOpen,
  ArrowRight,
  Play,
  Download,
  Share2,
  ThumbsUp,
  TrendingUp,
  Globe,
  Brain
} from 'lucide-react'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function TreatmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [treatment, setTreatment] = useState<Treatment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showVideoModal, setShowVideoModal] = useState(false)

  useEffect(() => {
    async function fetchTreatment() {
      if (!params.id) return

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('treatments')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) {
          setError(error.message)
        } else {
          setTreatment(data)
        }
      } catch (err) {
        setError('Failed to fetch treatment details')
      } finally {
        setLoading(false)
      }
    }

    fetchTreatment()
  }, [params.id])

  const formatCurrency = (amount: number | null, currency: string = 'INR') => {
    if (!amount) return 'Price on request'
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'oncology':
        return <Activity className="w-8 h-8" />
      case 'pediatrics':
        return <Users className="w-8 h-8" />
      case 'cardiology':
        return <Activity className="w-8 h-8" />
      case 'orthopedics':
        return <Activity className="w-8 h-8" />
      case 'neurology':
        return <Brain className="w-8 h-8" />
      case 'fertility':
        return <Users className="w-8 h-8" />
      case 'dental':
        return <Stethoscope className="w-8 h-8" />
      case 'cosmetic':
        return <Award className="w-8 h-8" />
      case 'spine':
        return <Target className="w-8 h-8" />
      case 'transplant':
        return <Activity className="w-8 h-8" />
      default:
        return <Stethoscope className="w-8 h-8" />
    }
  }

  const getCategoryInfo = (category: string) => {
    const categoryMap: { [key: string]: { name: string; description: string } } = {
      oncology: { name: 'Oncology', description: 'Cancer Treatment & Care' },
      pediatrics: { name: 'Pediatrics', description: 'Child Healthcare' },
      cardiology: { name: 'Cardiology', description: 'Heart & Vascular Care' },
      orthopedics: { name: 'Orthopedics', description: 'Bone & Joint Care' },
      neurology: { name: 'Neurology', description: 'Brain & Nerve Care' },
      fertility: { name: 'Fertility', description: 'IVF & Reproductive Care' },
      dental: { name: 'Dental', description: 'Oral Health Care' },
      cosmetic: { name: 'Cosmetic Surgery', description: 'Aesthetic Procedures' },
      spine: { name: 'Spine Surgery', description: 'Back & Neck Care' },
      transplant: { name: 'Transplant', description: 'Organ Transplants' }
    }
    return categoryMap[category] || { name: category, description: 'Medical Treatment' }
  }

  const handleStartCase = () => {
    router.push(`/start-case?treatment=${treatment?.id}`)
  }

  const handleBookConsultation = () => {
    router.push(`/start-case?treatment=${treatment?.id}&action=consultation`)
  }

  const handleRequestQuote = () => {
    router.push(`/start-case?treatment=${treatment?.id}&action=quote`)
  }

  const handleDownloadBrochure = () => {
    // Implement brochure download
    console.log('Downloading brochure for treatment:', treatment?.id)
  }

  const handleShareTreatment = () => {
    if (navigator.share) {
      navigator.share({
        title: treatment?.name,
        text: `Check out this treatment: ${treatment?.name}`,
        url: window.location.href
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'process', label: 'Process', icon: Target },
    { id: 'included', label: 'What\'s Included', icon: CheckCircle },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ADC8A6]/10 via-white to-[#2A4049]/5">
        <TopUtilityBar />
        <Navigation />
        
        {/* Header Bar */}
        <div className="pt-32">
          <div className="bg-[#2A4049] py-16 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(173,200,166,0.1)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(42,64,73,0.1)_0%,transparent_50%)]"></div>
            {/* Floating Elements */}
            <div className="absolute top-8 left-16 w-24 h-24 bg-[#ADC8A6]/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-8 right-16 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
              <h1 className="hero-text text-white mb-6 drop-shadow-lg">Treatment Details</h1>
              <p className="description-text text-white max-w-3xl mx-auto drop-shadow-md">
                Loading comprehensive treatment information...
              </p>
            </div>
          </div>
        </div>
        
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A4049] mx-auto mb-4"></div>
              <p className="body text-slate-600">Loading treatment details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !treatment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ADC8A6]/10 via-white to-[#2A4049]/5">
        <TopUtilityBar />
        <Navigation />
        
        {/* Header Bar */}
        <div className="pt-32">
          <div className="bg-[#2A4049] py-16 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(173,200,166,0.1)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(42,64,73,0.1)_0%,transparent_50%)]"></div>
            {/* Floating Elements */}
            <div className="absolute top-8 left-16 w-24 h-24 bg-[#ADC8A6]/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-8 right-16 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
              <h1 className="hero-text text-white mb-6 drop-shadow-lg">Treatment Details</h1>
              <p className="description-text text-white max-w-3xl mx-auto drop-shadow-md">
                Treatment information not available
              </p>
            </div>
          </div>
        </div>
        
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p><strong>Error:</strong> {error || 'Treatment not found'}</p>
            </div>
            <Link href="/treatments">
              <Button className="bg-[#2A4049] hover:bg-[#1F2F35] text-white px-6 py-3 rounded-xl button-text transition-all duration-200" icon={ArrowLeft}>
                Back to Treatments
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const categoryInfo = getCategoryInfo(treatment.category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ADC8A6]/10 via-white to-[#2A4049]/5">
      <TopUtilityBar />
      <Navigation />
      
      {/* Hero Section */}
      <div className="pt-32">
        <div className="bg-gradient-to-br from-[#ADC8A6]/20 via-[#2A4049]/30 to-[#145263]/25 py-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(173,200,166,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08)_0%,transparent_50%)]"></div>
          {/* Floating Elements */}
          <div className="absolute top-12 left-20 w-32 h-32 bg-[#ADC8A6]/40 rounded-full blur-2xl"></div>
          <div className="absolute bottom-12 right-20 w-40 h-40 bg-[#FECA58]/30 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ADC8A6]/20 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Clean Breadcrumb */}
            <div className="flex items-center gap-3 mb-8">
              <Link href="/treatments" className="flex items-center gap-2 bg-[#2A4049] text-white px-4 py-2.5 rounded-lg hover:bg-[#1A2F36] transition-all duration-200 shadow-lg hover:shadow-xl">
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Treatments</span>
            </Link>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="text-slate-400">•</span>
                <span className="text-sm font-medium">{categoryInfo.name}</span>
              </div>
          </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Content - 2 columns */}
              <div className="lg:col-span-2">
                {/* Treatment Header */}
                <div className="bg-gradient-to-r from-[#ADC8A6]/5 to-white rounded-2xl p-6 border border-[#ADC8A6]/20 shadow-lg mb-8">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#ADC8A6] to-[#2A4049] rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
                      {treatment.category === 'oncology' ? (
                        <img 
                          src="/oncology.png" 
                          alt="Oncology" 
                          className="w-full h-full object-cover"
                        />
                      ) : treatment.category === 'pediatrics' ? (
                        <img 
                          src="/pediatric.png" 
                          alt="Pediatrics" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-white text-2xl">
                          {getCategoryIcon(treatment.category)}
                        </div>
                      )}
                    </div>
            <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h1 className="text-3xl font-bold text-black leading-tight">
                    {treatment.name}
                  </h1>
                        <div className="flex items-center gap-2 bg-[#ADC8A6] px-3 py-1.5 rounded-full">
                          <Star className="w-4 h-4 text-black fill-current" />
                          <span className="font-bold text-black">4.9</span>
                        </div>
                      </div>
                      <p className="text-lg text-black mb-4 leading-relaxed">
                        {categoryInfo.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-[#2A4049] text-white">
                          <Clock className="w-4 h-4 mr-2" />
                          {(treatment as any).duration_days || 1} day{((treatment as any).duration_days || 1) !== 1 ? 's' : ''}
                        </span>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-[#ADC8A6] text-black">
                          <MapPin className="w-4 h-4 mr-2" />
                          India
                        </span>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-[#2A4049] text-white">
                          <Award className="w-4 h-4 mr-2" />
                          Premium Care
                  </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comprehensive Treatment Information */}
                <div className="bg-gradient-to-br from-[#ADC8A6]/8 to-white rounded-2xl p-8 border border-[#ADC8A6]/20 shadow-lg">
                  <h3 className="text-2xl font-bold text-black mb-6">About This Treatment</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Treatment Description */}
                    <div className="lg:col-span-2">
                      <p className="text-lg text-black leading-relaxed mb-6">
                        {treatment.description || 'Comprehensive medical consultation and treatment planning for your specific condition. Our expert medical team will provide personalized care and detailed treatment recommendations based on your medical history and current health status.'}
                      </p>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-bold text-[#2A4049] mb-3">What's Included:</h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-[#2A4049] mt-0.5 flex-shrink-0" />
                            <span className="text-black">Initial consultation with specialist doctor</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-[#2A4049] mt-0.5 flex-shrink-0" />
                            <span className="text-black">Comprehensive medical evaluation and assessment</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-[#2A4049] mt-0.5 flex-shrink-0" />
                            <span className="text-black">Detailed treatment plan and recommendations</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-[#2A4049] mt-0.5 flex-shrink-0" />
                            <span className="text-black">Follow-up consultation and support</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Quick Treatment Info */}
                    <div className="lg:col-span-1">
                      <div className="bg-white/60 rounded-xl p-6 border border-[#ADC8A6]/30">
                        <h4 className="text-lg font-bold text-[#2A4049] mb-4">Treatment Summary</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-black font-medium">Duration</span>
                            <span className="font-bold text-[#2A4049]">{(treatment as any).duration_days || 1} day{((treatment as any).duration_days || 1) !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-black font-medium">Location</span>
                            <span className="font-bold text-[#2A4049]">India</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-black font-medium">Rating</span>
                            <span className="font-bold text-[#2A4049]">4.9★</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-black font-medium">Support</span>
                            <span className="font-bold text-[#2A4049]">24/7</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - 1 column */}
              <div className="lg:col-span-1">
                {/* Pricing Card */}
                <div className="bg-gradient-to-br from-[#ADC8A6]/5 to-white rounded-2xl border border-[#ADC8A6]/20 p-6 shadow-lg sticky top-24">
                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-[#2A4049] mb-2">
                      {formatCurrency(treatment.base_price, treatment.currency)}
                    </div>
                    <div className="text-sm text-black font-medium mb-3">
                      Starting Price • All Inclusive
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <ThumbsUp className="w-5 h-5 text-[#2A4049]" />
                      <span className="text-sm text-[#2A4049] font-bold">Best Value Guaranteed</span>
                    </div>
            </div>

                  {/* Primary CTA */}
                  <Button 
                    onClick={handleStartCase}
                    className="w-full bg-[#2A4049] hover:bg-[#1A2F36] text-white py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Start Your Case
                  </Button>

                  {/* Secondary Actions */}
                  <div className="space-y-3 mb-6">
                    <Button 
                      onClick={handleBookConsultation}
                      className="w-full bg-[#ADC8A6] text-black hover:bg-[#9BB896] py-3 rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md"
                      icon={MessageCircle}
                    >
                      Book Consult
                    </Button>
                    <Button 
                      onClick={handleRequestQuote}
                      className="w-full bg-[#ADC8A6] text-black hover:bg-[#9BB896] py-3 rounded-lg font-bold transition-all duration-200 shadow-sm hover:shadow-md"
                      icon={FileText}
                    >
                      Get Quote
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="border-t border-[#ADC8A6]/30 pt-4">
                    <div className="space-y-3 text-sm text-black">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-[#2A4049]" />
                        <span className="font-medium">Secure Booking</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-[#2A4049]" />
                        <span className="font-medium">No Hidden Fees</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-[#2A4049]" />
                        <span className="font-medium">Expert Care</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-[#2A4049]" />
                        <span className="font-medium">24/7 Support</span>
                      </div>
                    </div>
                  </div>
                </div>

                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content Section */}
      <section className="py-16 bg-gradient-to-br from-[#ADC8A6]/5 via-white to-[#2A4049]/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(173,200,166,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(42,64,73,0.05)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-16 left-20 w-28 h-28 bg-[#ADC8A6]/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 right-20 w-36 h-36 bg-[#2A4049]/10 rounded-full blur-xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#2A4049] text-white shadow-lg'
                      : 'bg-white/90 text-slate-700 hover:bg-white hover:shadow-md border border-[#ADC8A6]/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Treatment Overview */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[#ADC8A6]/30 shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Treatment Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-slate-900 mb-3">About This Treatment</h3>
                        <p className="body text-slate-600 leading-relaxed">
                          Our {treatment.name} treatment provides comprehensive care with state-of-the-art facilities and experienced medical professionals. 
                          This treatment is designed to deliver optimal outcomes with minimal recovery time.
                        </p>
                      </div>
                      <div>
                        <h3 className="card-title mb-4">Key Benefits</h3>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#2A4049] flex-shrink-0" />
                            <span className="body text-slate-600">Advanced medical technology</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#2A4049] flex-shrink-0" />
                            <span className="body text-slate-600">Experienced specialists</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#2A4049] flex-shrink-0" />
                            <span className="body text-slate-600">Comprehensive care package</span>
                          </li>
                          <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-[#2A4049] flex-shrink-0" />
                            <span className="body text-slate-600">24/7 patient support</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Video Section */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-[#ADC8A6]/30 shadow-xl p-8">
                    <h2 className="heading-3 text-slate-900 mb-6">Learn More About This Treatment</h2>
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#2A4049] to-[#145263] aspect-video cursor-pointer group" onClick={() => setShowVideoModal(true)}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-200">
                          <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    </div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="card-title text-white mb-2">Treatment Overview Video</h3>
                        <p className="body-small text-white/90">Watch our specialists explain the procedure</p>
                    </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'process' && (
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-[#ADC8A6]/30 shadow-xl p-8">
                  <h2 className="heading-3 text-slate-900 mb-8">Treatment Process</h2>
                  <div className="space-y-8">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#ADC8A6] to-[#2A4049] rounded-2xl flex items-center justify-center">
                        <span className="text-lg font-bold text-white">1</span>
                      </div>
                      <div>
                        <h3 className="card-title mb-3">Initial Consultation & Assessment</h3>
                        <p className="body text-slate-600 leading-relaxed">
                          Comprehensive medical evaluation, review of medical history, and detailed assessment of your condition to create a personalized treatment plan.
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>Duration: 1-2 hours</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#2A4049] to-[#ADC8A6] rounded-2xl flex items-center justify-center">
                        <span className="text-lg font-bold text-white">2</span>
                      </div>
                      <div>
                        <h3 className="card-title mb-3">Pre-Treatment Preparation</h3>
                        <p className="body text-slate-600 leading-relaxed">
                          Pre-treatment tests, medical clearance, and preparation instructions. Our team ensures you're fully prepared for the procedure.
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                          <Calendar className="w-4 h-4" />
                          <span>Duration: 1-2 days</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#ADC8A6] to-[#2A4049] rounded-2xl flex items-center justify-center">
                        <span className="text-lg font-bold text-white">3</span>
                      </div>
                      <div>
                        <h3 className="card-title mb-3">Treatment Execution</h3>
                        <p className="body text-slate-600 leading-relaxed">
                          The main treatment procedure performed by our expert medical team using advanced technology and best practices.
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                          <Activity className="w-4 h-4" />
                          <span>Duration: {(treatment as any).duration_days || 1} day{((treatment as any).duration_days || 1) !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#2A4049] to-[#ADC8A6] rounded-2xl flex items-center justify-center">
                        <span className="text-lg font-bold text-white">4</span>
                      </div>
                      <div>
                        <h3 className="card-title mb-3">Recovery & Follow-up</h3>
                        <p className="body text-slate-600 leading-relaxed">
                          Post-treatment monitoring, recovery guidance, and ongoing support to ensure optimal healing and long-term success.
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                          <Heart className="w-4 h-4" />
                          <span>Ongoing support</span>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
              )}

              {activeTab === 'included' && (
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-[#ADC8A6]/30 shadow-xl p-8">
                  <h2 className="heading-3 text-slate-900 mb-8">What's Included in Your Package</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      'Initial consultation with specialist',
                      'Comprehensive medical assessment',
                      'Pre-treatment diagnostic tests',
                      'Treatment procedure',
                      'Post-treatment monitoring',
                      'Follow-up consultations',
                      'Medication and supplies',
                      '24/7 patient support',
                      'Recovery guidance',
                      'Medical reports and documentation'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#ADC8A6]/15 to-[#2A4049]/10 rounded-xl border border-[#ADC8A6]/30">
                        <CheckCircle className="w-5 h-5 text-[#2A4049] flex-shrink-0" />
                        <span className="body font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Overall Rating */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-[#ADC8A6]/30 shadow-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="heading-3 text-slate-900">Patient Reviews</h2>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-6 h-6 text-yellow-400 fill-current" />
                          <span className="text-2xl font-bold text-slate-900">4.9</span>
                        </div>
                        <p className="body-small text-slate-600">Based on 127 reviews</p>
                      </div>
                    </div>
                    
                    {/* Rating Breakdown */}
                    <div className="space-y-3 mb-8">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="body-small text-slate-600 w-8">{rating}</span>
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-[#ADC8A6] to-[#2A4049] h-2 rounded-full"
                              style={{ width: `${rating === 5 ? 85 : rating === 4 ? 12 : rating === 3 ? 2 : rating === 2 ? 1 : 0}%` }}
                            ></div>
                    </div>
                          <span className="body-small text-slate-600 w-8">
                            {rating === 5 ? 85 : rating === 4 ? 12 : rating === 3 ? 2 : rating === 2 ? 1 : 0}%
                          </span>
                    </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {[
                      {
                        name: "Sarah Johnson",
                        rating: 5,
                        date: "2 weeks ago",
                        comment: "Exceptional care and professionalism. The entire team made me feel comfortable throughout the process. Highly recommended!",
                        location: "United States"
                      },
                      {
                        name: "Michael Chen",
                        rating: 5,
                        date: "1 month ago",
                        comment: "Outstanding treatment with excellent results. The facilities are world-class and the staff is incredibly supportive.",
                        location: "Canada"
                      },
                      {
                        name: "Emma Williams",
                        rating: 4,
                        date: "2 months ago",
                        comment: "Very professional service with good outcomes. The communication could be improved, but overall a positive experience.",
                        location: "United Kingdom"
                      }
                    ].map((review, index) => (
                      <div key={index} className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[#ADC8A6]/30 shadow-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="card-title">{review.name}</h4>
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <MapPin className="w-3 h-3" />
                              <span>{review.location}</span>
                              <span>•</span>
                              <span>{review.date}</span>
                    </div>
                    </div>
                    </div>
                        <p className="body text-slate-600 leading-relaxed">{review.comment}</p>
                    </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Actions */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[#ADC8A6]/30 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Additional Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={handleDownloadBrochure}
                  className="w-full bg-[#ADC8A6] text-black hover:bg-[#9BB896] py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  icon={Download}
                >
                  Download Brochure
                </Button>
                <Button 
                  onClick={handleShareTreatment}
                  className="w-full bg-[#FECA58] text-black hover:bg-[#E6B551] py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  icon={Share2}
                >
                  Share Treatment
                </Button>
                <Button 
                  onClick={handleBookConsultation}
                  className="w-full bg-[#2A4049] hover:bg-[#1A2F36] text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  icon={Phone}
                >
                  Call Specialist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Support Section */}
      <section className="py-16 bg-gradient-to-br from-[#ADC8A6]/5 to-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Why Choose eCureTrip?
          </h2>
            <p className="text-lg text-black max-w-3xl mx-auto">
              Trusted by thousands of patients worldwide for world-class medical care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white/80 rounded-2xl shadow-lg border border-[#ADC8A6]/20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ADC8A6] to-[#2A4049] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Secure & Safe</h3>
              <p className="text-black">Enterprise-grade security for your data and payments</p>
            </div>
            
            <div className="text-center p-6 bg-white/80 rounded-2xl shadow-lg border border-[#ADC8A6]/20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ADC8A6] to-[#2A4049] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Expert Care</h3>
              <p className="text-black">Board-certified specialists with years of experience</p>
            </div>
            
            <div className="text-center p-6 bg-white/80 rounded-2xl shadow-lg border border-[#ADC8A6]/20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#ADC8A6] to-[#2A4049] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">24/7 Support</h3>
              <p className="text-black">Round-the-clock assistance throughout your journey</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-black font-bold">
              ✓ No obligation consultation • ✓ Transparent pricing • ✓ Free second opinion
            </p>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title">Treatment Overview Video</h3>
              <button 
                onClick={() => setShowVideoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-[#2A4049] mx-auto mb-4" />
                <p className="body text-slate-600">Video player would be embedded here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
