'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero';
import { REVIEWS } from '@/data/reviews';
import { TREATMENTS } from '@/data/treatments';
import { trackTeleconsultBooked } from '@/lib/analytics';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedSurgeon, setSelectedSurgeon] = useState<any>(null);
  const [showTeleconsultModal, setShowTeleconsultModal] = useState(false);
      const [featuredPackages, setFeaturedPackages] = useState<any[]>([]);
      const [loading, setLoading] = useState(true);
      const [featuredHospitals, setFeaturedHospitals] = useState<any[]>([]);
      const [hospitalsLoading, setHospitalsLoading] = useState(true);
      const [featuredDoctors, setFeaturedDoctors] = useState<any[]>([]);
      const [doctorsLoading, setDoctorsLoading] = useState(true);
  
  // Fetch treatments from Supabase
  useEffect(() => {
    async function fetchTreatments() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('treatments')
          .select('*')
          .order('base_price', { ascending: true })
          .limit(4)

        if (error) {
          console.error('Error fetching treatments:', error)
          return
        }

        if (data && data.length > 0) {
          setFeaturedPackages(data)
        } else {
          // Use static data as fallback when database is empty
          setFeaturedPackages(TREATMENTS.slice(0, 4))
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

        fetchTreatments()
  }, []);

      // Fetch hospitals from Supabase
      useEffect(() => {
        async function fetchHospitals() {
          try {
            const supabase = createClient()
            const { data, error } = await supabase
              .from('hospitals')
              .select('*')
              .limit(6) // Show only 6 hospitals on homepage

            if (error) {
              console.error('Error fetching hospitals:', error)
              return
            }

            if (data) {
              setFeaturedHospitals(data)
            }
          } catch (err) {
            console.error('Error:', err)
          } finally {
            setHospitalsLoading(false)
          }
        }

        fetchHospitals()
  }, []);

  // Fetch doctors from API route
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch('/api/doctors')
        if (!response.ok) {
          throw new Error('Failed to fetch doctors')
        }
        
        const result = await response.json()
        if (result.doctors && result.doctors.length > 0) {
          setFeaturedDoctors(result.doctors.slice(0, 4))
        }
      } catch (err) {
        console.error('Error fetching doctors:', err)
      } finally {
        setDoctorsLoading(false)
      }
    }

    fetchDoctors()
  }, []);

  // Use real doctors data from Supabase

  // Get 6 reviews - use useMemo for consistency
  const featuredReviews = useMemo(() => {
    return REVIEWS.slice(0, 6);
  }, []);

  // State for showing all reviews
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Show first 3 reviews initially, or all if showAllReviews is true
  const displayedReviews = showAllReviews ? featuredReviews : featuredReviews.slice(0, 3);

  const handleTeleconsultBook = (surgeon: any) => {
    trackTeleconsultBooked(surgeon.slug, "TBD");
    setSelectedSurgeon(surgeon);
    setShowTeleconsultModal(true);
  };

  const closeTeleconsultModal = () => {
    setShowTeleconsultModal(false);
    setSelectedSurgeon(null);
  };

  const handleSpecialtyClick = (specialty: string) => {
    // Navigate to specialty-specific detail page
    router.push(`/specialties/${specialty.toLowerCase()}`)
  }

  const handleBrowseAllSpecialties = () => {
    router.push('/treatments')
  }

  const handleViewPackageDetails = (pkg: any) => {
    // Navigate to treatment detail page instead of modal
    router.push(`/treatments/${pkg.id}`)
  };

  const closePackageModal = () => {
    setShowPackageModal(false);
    setSelectedPackage(null);
  };

  return (
        <main className="min-h-screen pt-32">
      <TopUtilityBar />
      <Navigation />
      
      {/* Hero Section */}
      <Hero />


      {/* How it Works Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-white to-beige-paper"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(143,184,133,0.15)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(244,231,210,0.2)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-16 left-12 w-28 h-28 bg-sage-200/25 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 right-12 w-32 h-32 bg-beige-paper/30 rounded-full blur-xl"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-8">
                <h2 className="section-title mb-4">Your Care Journey, Made Simple</h2>
                <p className="description-text max-w-3xl mx-auto">
              We guide you step by step - so you can focus on healing, not paperwork.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="w-52 h-40 rounded-lg overflow-hidden mx-auto mb-6 shadow-md border-2 border-blue-800 group-hover:border-blue-900 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src="/journey images/form.png"
                  alt="Tell Us Your Needs"
                  width={176}
                  height={144}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-white font-bold text-sm">1</span>
              </div>
                   <h3 className="card-title mb-3">Tell Us Your Story</h3>
                    <p className="body">
                 Share your symptoms, reports, or questions in your own words.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="w-52 h-40 rounded-lg overflow-hidden mx-auto mb-6 shadow-md border-2 border-blue-800 group-hover:border-blue-900 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src="/journey images/choose doctor.png"
                  alt="Match With Top Doctors"
                  width={176}
                  height={144}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="w-8 h-8 bg-oasis-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-white font-bold text-sm">2</span>
              </div>
               <h3 className="text-slate-900 font-bold text-lg mb-3">Get Matched With Trusted Doctors</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                 Our intelligent system suggests specialists, and you choose the one you trust most.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="w-52 h-40 rounded-lg overflow-hidden mx-auto mb-6 shadow-md border-2 border-blue-800 group-hover:border-blue-900 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src="/journey images/boarding.png"
                  alt="Plan Your Journey"
                  width={176}
                  height={144}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-white font-bold text-sm">3</span>
              </div>
               <h3 className="text-slate-900 font-bold text-lg mb-3">Plan With Confidence</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                 We handle visas, hospitals, and transparent pricing with no hidden surprises.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div className="w-52 h-40 rounded-lg overflow-hidden mx-auto mb-6 shadow-md border-2 border-blue-800 group-hover:border-blue-900 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src="/journey images/recover.png"
                  alt="Get Treated & Recover"
                  width={176}
                  height={144}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-white font-bold text-sm">4</span>
              </div>
               <h3 className="text-slate-900 font-bold text-lg mb-3">Heal & Recover With Support</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                 Receive world-class treatment in India, with follow-up care when you're back home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Specialties Section */}
      <section id="specialties" className="section-alt bg-gradient-to-br from-beige-paper via-white to-sage-50 relative overflow-hidden pt-8 pb-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(244,231,210,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(143,184,133,0.1)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-12 left-10 w-24 h-24 bg-beige-paper/40 rounded-full blur-xl"></div>
        <div className="absolute bottom-12 right-10 w-32 h-32 bg-sage-200/30 rounded-full blur-xl"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-8">
                <h2 className="section-title mb-4">Popular Specialties</h2>
                <p className="description-text max-w-3xl mx-auto">
              Discover world-class medical care across a wide range of specialties
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Cardiology */}
            <div 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200"
              onClick={() => handleSpecialtyClick('cardiology')}
            >
              <div className="w-full h-32 relative">
                <Image
                  src="/Medical_Specialties_Images/cardiology.png"
                  alt="Cardiology"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                    <h3 className="card-title text-sm group-hover:text-specialty-cardiology/80 transition-colors duration-300">Cardiology</h3>
                    <p className="body-small mt-1">Heart & Vascular Care</p>
              </div>
            </div>

            {/* Orthopedics */}
            <div 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200"
              onClick={() => handleSpecialtyClick('orthopedics')}
            >
              <div className="w-full h-32 relative">
                <Image
                  src="/Medical_Specialties_Images/orthopedics.png"
                  alt="Orthopedics"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-slate-900 font-bold text-sm group-hover:text-specialty-orthopedics/80 transition-colors duration-300">Orthopedics</h3>
                <p className="text-slate-600 text-xs mt-1 font-medium">Bone & Joint Care</p>
              </div>
            </div>

            {/* Neurology */}
            <div 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200"
              onClick={() => handleSpecialtyClick('neurology')}
            >
              <div className="w-full h-32 relative">
                <Image
                  src="/Medical_Specialties_Images/neurology.png"
                  alt="Neurology"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-slate-900 font-bold text-sm group-hover:text-specialty-neurology/80 transition-colors duration-300">Neurology</h3>
                <p className="text-slate-600 text-xs mt-1 font-medium">Brain & Nerve Care</p>
              </div>
            </div>

            {/* Oncology */}
            <div 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200"
              onClick={() => handleSpecialtyClick('oncology')}
            >
              <div className="w-full h-32 relative">
                <Image
                  src="/Medical_Specialties_Images/oncology.png"
                  alt="Oncology"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-slate-900 font-bold text-sm group-hover:text-specialty-oncology/80 transition-colors duration-300">Oncology</h3>
                <p className="text-slate-600 text-xs mt-1 font-medium">Cancer Treatment</p>
              </div>
            </div>

            {/* Fertility */}
            <div 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200"
              onClick={() => handleSpecialtyClick('fertility')}
            >
              <div className="w-full h-32 relative">
                <Image
                  src="/Medical_Specialties_Images/fertility.png"
                  alt="Fertility"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-slate-900 font-bold text-sm group-hover:text-specialty-fertility/80 transition-colors duration-300">Fertility</h3>
                <p className="text-slate-600 text-xs mt-1 font-medium">IVF & Reproductive Care</p>
              </div>
            </div>

            {/* Dental */}
            <div 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200"
              onClick={() => handleSpecialtyClick('dental')}
            >
              <div className="w-full h-32 relative">
                <Image
                  src="/Medical_Specialties_Images/dental.png"
                  alt="Dental"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-slate-900 font-bold text-sm group-hover:text-specialty-dental/80 transition-colors duration-300">Dental</h3>
                <p className="text-slate-600 text-xs mt-1 font-medium">Oral Health Care</p>
              </div>
            </div>

            {/* Cosmetic Surgery */}
            <div 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200"
              onClick={() => handleSpecialtyClick('cosmetic')}
            >
              <div className="w-full h-32 relative">
                <Image
                  src="/Medical_Specialties_Images/cosmetic surgery.png"
                  alt="Cosmetic Surgery"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-slate-900 font-bold text-sm group-hover:text-specialty-cosmetic/80 transition-colors duration-300">Cosmetic Surgery</h3>
                <p className="text-slate-600 text-xs mt-1 font-medium">Aesthetic Procedures</p>
              </div>
            </div>

            {/* Spine Surgery */}
            <div 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200"
              onClick={() => handleSpecialtyClick('spine')}
            >
              <div className="w-full h-32 relative">
                <Image
                  src="/Medical_Specialties_Images/spine surgery.png"
                  alt="Spine Surgery"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-slate-900 font-bold text-sm group-hover:text-specialty-spine/80 transition-colors duration-300">Spine Surgery</h3>
                <p className="text-slate-600 text-xs mt-1 font-medium">Back & Neck Care</p>
              </div>
            </div>

            {/* Transplant */}
            <div 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200"
              onClick={() => handleSpecialtyClick('transplant')}
            >
              <div className="w-full h-32 relative">
                <Image
                  src="/Medical_Specialties_Images/trasplant.png"
                  alt="Transplant"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-slate-900 font-bold text-sm group-hover:text-specialty-transplant/80 transition-colors duration-300">Transplant</h3>
                <p className="text-slate-600 text-xs mt-1 font-medium">Organ Transplants</p>
              </div>
            </div>

            {/* Pediatrics */}
            <div 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200"
              onClick={() => handleSpecialtyClick('pediatrics')}
            >
              <div className="w-full h-32 relative">
                <Image
                  src="/Medical_Specialties_Images/pediatrics.png"
                  alt="Pediatrics"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-slate-900 font-bold text-sm group-hover:text-specialty-pediatrics/80 transition-colors duration-300">Pediatrics</h3>
                <p className="text-slate-600 text-xs mt-1 font-medium">Child Healthcare</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-slate-800 mb-4 font-medium">Ready to explore treatments in your specialty?</p>
            <button
              className="bg-[#8FA885] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#7A9672] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={handleBrowseAllSpecialties}
            >
              Browse All Specialties
            </button>
          </div>
        </div>
      </section>

      {/* AI Journey Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.06)_0%,transparent_50%)]"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/20 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 bg-[#ADC8A6] text-[#2A4049]">
              <span className="w-2 h-2 rounded-full animate-pulse bg-[#2A4049]"></span>
              New Feature
            </div>
            <h2 className="section-title mb-4">
              AI-Powered Medical Journey
            </h2>
            <p className="description-text max-w-2xl mx-auto">
              Experience intelligent healthcare with our AI assistant that guides you through every step 
              of your medical journey - from initial consultation to treatment completion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            {/* Left Side - Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ADC8A6' }}>
                  <svg className="w-5 h-5" style={{ color: '#2A4049' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="card-title text-black mb-1">Intelligent Chat Assistant</h3>
                  <p className="body-small text-black opacity-80">Get personalized guidance through your medical journey with AI-powered conversations that understand your context.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#ADC8A6]">
                  <svg className="w-5 h-5 text-[#2A4049]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="card-title text-black mb-1">Document Processing</h3>
                  <p className="body-small text-black opacity-80">Upload medical reports and get AI-powered analysis and extraction of key information automatically.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#ADC8A6' }}>
                  <svg className="w-5 h-5" style={{ color: '#2A4049' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="card-title text-black mb-1">Smart Doctor Matching</h3>
                  <p className="body-small text-black opacity-80">AI-powered matching to find the best specialists for your specific medical condition and requirements.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#ADC8A6]">
                  <svg className="w-5 h-5 text-[#2A4049]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="card-title text-black mb-1">Automated Quoting</h3>
                  <p className="body-small text-black opacity-80">Get detailed treatment cost estimates and payment plans tailored to your specific case and requirements.</p>
                </div>
              </div>
            </div>
            
            {/* Right Side - CTA */}
            <div className="bg-white rounded-xl shadow-lg border p-6" style={{ borderColor: '#2A4049' }}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#ADC8A6]">
                  <svg className="w-8 h-8 text-[#2A4049]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="heading-3 text-black mb-3">Start Your AI Journey</h3>
                <p className="body text-black opacity-80 mb-5">
                  Experience the future of healthcare with our intelligent AI assistant. 
                  No registration required for demo access.
                </p>
              </div>
              
              <div className="space-y-3">
                <Link 
                  href="/ai-journey"
                  className="block w-full text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-300 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: '#2A4049' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1F2F35'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2A4049'}
                >
                  Explore AI Journey
                </Link>
                
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href="/patient/cases/ONC-2024-001"
                    className="block font-semibold py-2 px-3 rounded-lg text-center text-sm transition-colors bg-[#ADC8A6] text-[#2A4049]"
                  >
                    Patient Demo
                  </Link>
                  <Link 
                    href="/doctor/cases/ONC-2024-001"
                    className="block font-semibold py-2 px-3 rounded-lg text-center text-sm transition-colors bg-[#ADC8A6] text-[#2A4049]"
                  >
                    Doctor Demo
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-[#ADC8A6]">
                <svg className="w-4 h-4 text-[#FECA58]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-[#2A4049] opacity-70">HIPAA Compliant & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Treatment Packages Section */}
      <section className="section bg-white relative overflow-hidden pt-16 pb-16">
        
        <div className="container relative z-10">
          <div className="text-center mb-8">
                <h2 className="section-title mb-4">Featured Treatment Packages</h2>
                <p className="description-text max-w-3xl mx-auto">
              Transparent pricing for world-class medical treatments. No hidden costs, no surprises.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gradient-to-br from-[#ADC8A6]/30 to-white rounded-lg p-4 shadow-lg border-2 border-[#2A4049] animate-pulse">
                <div className="text-center mb-3">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : featuredPackages.length > 0 ? (
              featuredPackages.map((pkg, index) => (
                <div key={pkg.id} className="bg-gradient-to-br from-[#ADC8A6]/15 to-white rounded-lg p-4 shadow-lg border-2 border-[#2A4049] hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col group">
                  <div className="text-center mb-3">
                        <h3 className="card-title text-black mb-2 transition-colors">{pkg.name}</h3>
                    <div className="text-xl font-bold mb-2 text-black transition-colors">₹{pkg.base_price?.toLocaleString() || 'Contact for pricing'}</div>
                    <div className="text-xs text-black font-medium transition-colors">{pkg.duration_days || 1} day{(pkg.duration_days || 1) !== 1 ? 's' : ''} stay</div>
                </div>
                
                <ul className="space-y-1.5 mb-4 flex-grow">
                    {pkg.inclusions ? pkg.inclusions.slice(0, 2).map((inclusion: string, idx: number) => (
                    <li key={idx} className="flex items-center text-xs text-black transition-colors">
                      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center mr-2 bg-[#ADC8A6] transition-colors flex-shrink-0">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="leading-tight">{inclusion}</span>
                    </li>
                    )) : (
                      <li className="flex items-center text-xs text-black transition-colors">
                        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center mr-2 bg-[#ADC8A6] transition-colors flex-shrink-0">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="leading-tight">Comprehensive treatment package</span>
                      </li>
                    )}
                    
                    {/* Additional feature with sunglow yellow icon */}
                    <li className="flex items-center text-xs text-black transition-colors">
                      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center mr-2 bg-[#FECA58] transition-colors flex-shrink-0">
                        <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="leading-tight">24/7 Medical Support</span>
                    </li>
                </ul>
                
                <button 
                  className="w-full py-1.5 px-3 rounded-lg font-bold text-xs transition-all duration-300 hover:scale-105 mt-auto shadow-md hover:shadow-lg bg-[#2A4049] text-white hover:bg-[#1A3039]"
                  onClick={() => handleViewPackageDetails(pkg)}
                >
                  View Details
                </button>
              </div>
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No treatments available</h3>
                <p className="text-gray-600">Check back later for available treatment packages.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Surgeons Section */}
      <section className="section-alt bg-white relative overflow-hidden py-16">
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
                <h2 className="section-title mb-4">Top Performing Doctors</h2>
                <p className="description-text max-w-3xl mx-auto">
              Meet our network of highly qualified and experienced medical professionals.
            </p>
          </div>
          
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {doctorsLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 animate-pulse">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full mb-4 mx-auto"></div>
                  <div className="text-center mb-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : featuredDoctors.length > 0 ? (
              featuredDoctors.map((doctor, index) => (
                <div key={doctor.id} className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#2A4049] hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col group">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 bg-[#2A4049] rounded-full mb-4 mx-auto">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-[#2A4049] mb-2">{doctor.full_name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{doctor.specialty || 'General Medicine'}</p>
                    <p className="text-sm font-semibold text-[#2A4049]">{doctor.hospital || 'Leading Hospital'}</p>
                  </div>
                  
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-[#FECA58]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-sm font-semibold text-[#2A4049]">{doctor.rating || '4.9'}</span>
                    </div>
                    <div className="mx-2 text-gray-300">|</div>
                    <span className="px-2 py-1 bg-[#ADC8A6] text-[#2A4049] text-xs rounded-full font-medium">
                      Verified
                    </span>
                </div>
                
                <button 
                    className="w-full py-2.5 px-4 rounded-lg font-semibold text-white text-sm transition-all duration-300 hover:scale-105 bg-[#2A4049] hover:bg-[#1A2F36] mt-auto shadow-md hover:shadow-lg"
                    onClick={() => handleTeleconsultBook(doctor)}
                >
                  Book Tele-consult
                </button>
              </div>
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors available</h3>
                <p className="text-gray-600">Check back later for available doctors.</p>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* Partner Hospitals Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="section-title text-slate-900 mb-6">Partner Hospitals</h2>
            <p className="description-text text-slate-600 max-w-3xl mx-auto">
              We partner with world-renowned hospitals and medical centers across India.
            </p>
          </div>
          
          {hospitalsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-lg border-2 border-[#2A4049] animate-pulse">
                  <div className="w-16 h-16 bg-[#ADC8A6] rounded-full mx-auto mb-3"></div>
                  <div className="h-4 bg-[#ADC8A6] rounded mb-2"></div>
                  <div className="h-3 bg-[#ADC8A6] rounded w-2/3 mx-auto mb-2"></div>
                  <div className="h-3 bg-[#ADC8A6] rounded w-1/2 mx-auto mb-4"></div>
                  <div className="flex justify-center space-x-2 mb-4">
                    <div className="h-6 w-16 bg-[#ADC8A6] rounded"></div>
                    <div className="h-6 w-16 bg-[#FECA58] rounded"></div>
                  </div>
                  <div className="h-8 bg-[#2A4049] rounded"></div>
              </div>
            ))}
          </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredHospitals.length > 0 ? (
                featuredHospitals.slice(0, 4).map((hospital, index) => (
                  <div key={hospital.id} className="bg-white rounded-lg p-4 shadow-lg border-2 border-[#2A4049] hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col group">
                    <div className="text-center mb-3">
                      <div className="w-16 h-16 bg-[#2A4049] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
        </div>
                      <h3 className="card-title text-[#2A4049] mb-2 transition-colors">{hospital.name}</h3>
                      <p className="body-small mb-2 transition-colors">{hospital.location}</p>
                      <p className="body-small font-semibold mb-3 transition-colors">
                        {hospital.specialties && hospital.specialties.length > 0 ? hospital.specialties[0] : 'Multi-Specialty'}
            </p>
          </div>
          
                    <div className="flex items-center justify-center space-x-2 mb-4 flex-grow">
                      <span className="px-2 py-1 bg-[#ADC8A6] text-[#2A4049] text-xs rounded font-medium border border-[#2A4049]">
                        {hospital.rating ? `${hospital.rating.toFixed(1)}★` : '4.5★'}
                  </span>
                      <span className="px-2 py-1 bg-[#FECA58] text-[#2A4049] text-xs rounded font-medium border border-[#2A4049]">
                        NABH
                      </span>
                    </div>
                    
                    <Link 
                      href={`/hospitals/${hospital.id}`}
                      className="w-full py-1.5 px-3 rounded-lg font-bold text-white text-xs transition-all duration-300 hover:scale-105 bg-[#2A4049] mt-auto shadow-md hover:shadow-lg text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#ADC8A6' }}>
                    <svg className="w-8 h-8" style={{ color: '#2A4049' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                  <h3 className="heading-3 text-slate-900 mb-3">No Hospitals Available</h3>
                  <p className="description-text text-slate-600 mb-6">
                    We're working on adding more partner hospitals. Check back soon!
                  </p>
                  <Link 
                    href="/hospitals"
                    className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300"
                    style={{ backgroundColor: '#2A4049' }}
                  >
                    View All Hospitals
                  </Link>
                </div>
                )}
              </div>
          )}
          
          {featuredHospitals.length > 0 && (
            <div className="text-center mt-8">
              <Link 
                href="/hospitals"
                className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                style={{ backgroundColor: '#ADC8A6', color: '#2A4049' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9BB596'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ADC8A6'}
              >
                View All Hospitals
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
          </div>
          )}
        </div>
      </section>

      {/* Patient Reviews Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="section-title text-slate-900 mb-6">Patient Reviews</h2>
            <p className="description-text text-slate-600 max-w-3xl mx-auto">
              Real experiences from patients who have successfully received treatment through eCureTrip.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#2A4049] hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex" style={{ color: '#FECA58' }}>
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <svg key={i + review.rating} className="w-5 h-5 fill-current text-gray-300" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  {review.kycVerified && (
                    <span className="px-3 py-1 text-xs rounded-full font-medium border" style={{ backgroundColor: '#ADC8A6', color: '#2A4049', borderColor: '#2A4049' }}>
                      ✓ KYC Verified
                    </span>
                  )}
                </div>
                <p className="text-black mb-4 italic font-semibold text-base leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center justify-between text-sm font-medium text-black">
                  <span>{review.date}</span>
                  <span className="px-2 py-1 rounded" style={{ backgroundColor: '#FECA58', color: '#2A4049' }}>
                    {review.procedureSku}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* View More Button */}
          {!showAllReviews && featuredReviews.length > 3 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllReviews(true)}
                className="px-8 py-3 bg-[#ADC8A6] text-black rounded-lg font-medium hover:bg-[#9BB896] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View More Reviews
              </button>
          </div>
          )}
          
          {/* View Less Button (when all reviews are shown) */}
          {showAllReviews && featuredReviews.length > 3 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllReviews(false)}
                className="px-8 py-3 bg-[#ADC8A6] text-[#2A4049] rounded-lg font-medium hover:bg-[#9BB896] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View Less
              </button>
                </div>
          )}
        </div>
      </section>

      {/* Teleconsult Modal */}
      {showTeleconsultModal && selectedSurgeon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pt-32">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[70vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2A4049] to-[#1A2F36] p-4 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-[#ADC8A6] rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <img 
                      src={`https://images.unsplash.com/photo-1550525811-e5869dd03032?w=64&h=64&fit=crop&crop=face`}
                      alt={selectedSurgeon.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">{selectedSurgeon.name}</h2>
                    <p className="text-white/90 text-sm">{selectedSurgeon.specialty}</p>
                    <p className="text-[#ADC8A6] font-bold text-sm">{selectedSurgeon.casesPerYear} cases/year</p>
                  </div>
                </div>
                <button 
                  onClick={closeTeleconsultModal}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Consultation Features */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#2A4049] mb-3">Teleconsultation Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center p-3 bg-[#ADC8A6]/20 rounded-lg border border-[#ADC8A6]/30">
                    <div className="w-5 h-5 bg-[#2A4049] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[#2A4049] font-medium text-sm">Video Consultation</span>
                  </div>
                  <div className="flex items-center p-3 bg-[#ADC8A6]/20 rounded-lg border border-[#ADC8A6]/30">
                    <div className="w-5 h-5 bg-[#2A4049] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[#2A4049] font-medium text-sm">Medical Records Review</span>
                  </div>
                  <div className="flex items-center p-3 bg-[#ADC8A6]/20 rounded-lg border border-[#ADC8A6]/30">
                    <div className="w-5 h-5 bg-[#2A4049] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[#2A4049] font-medium text-sm">Treatment Plan Discussion</span>
                  </div>
                  <div className="flex items-center p-3 bg-[#ADC8A6]/20 rounded-lg border border-[#ADC8A6]/30">
                    <div className="w-5 h-5 bg-[#2A4049] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[#2A4049] font-medium text-sm">Cost Estimation</span>
                  </div>
                </div>
              </div>

              {/* Consultation Workflow */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#2A4049] mb-3">Consultation Workflow</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-[#2A4049] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold text-xs">1</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#2A4049] capitalize text-sm">Schedule Appointment</h4>
                      <p className="text-slate-600 text-xs">Choose your preferred date and time slot</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-[#2A4049] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold text-xs">2</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#2A4049] capitalize text-sm">Upload Documents</h4>
                      <p className="text-slate-600 text-xs">Share medical reports, scans, and history</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-[#2A4049] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold text-xs">3</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[#2A4049] capitalize text-sm">Video Consultation</h4>
                      <p className="text-slate-600 text-xs">30-minute consultation with the specialist</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-[#2A4049] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold text-xs">4</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#2A4049] capitalize text-sm">Treatment Plan</h4>
                      <p className="text-slate-600 text-xs">Receive personalized treatment recommendations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#2A4049] mb-3">Consultation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-bold text-[#2A4049] text-sm mb-1">Duration</h4>
                    <p className="text-slate-600 text-xs">30 minutes</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-bold text-[#2A4049] text-sm mb-1">Cost</h4>
                    <p className="text-slate-600 text-xs">$50 USD</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-bold text-[#2A4049] text-sm mb-1">Languages</h4>
                    <p className="text-slate-600 text-xs">{selectedSurgeon.languages.join(', ')}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-bold text-[#2A4049] text-sm mb-1">Platform</h4>
                    <p className="text-slate-600 text-xs">Secure video call</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-[#2A4049] hover:bg-[#1A2F36] text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                  Book Consultation
                </button>
                <button className="flex-1 bg-[#ADC8A6] hover:bg-[#9BB894] text-[#2A4049] font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                  Download Consultation Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Package Details Modal */}
      {showPackageModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pt-32">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[70vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8FA885] to-[#7A9672] p-4 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{selectedPackage.title}</h2>
                  <div className="text-2xl font-bold text-white">${selectedPackage.priceUSD.toLocaleString()}</div>
                  <div className="text-white/90 font-medium text-sm">{selectedPackage.losDays} day{selectedPackage.losDays !== 1 ? 's' : ''} stay</div>
                </div>
                <button 
                  onClick={closePackageModal}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* What's Included */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">What&apos;s Included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedPackage.inclusions.map((inclusion: string, idx: number) => (
                    <div key={idx} className="flex items-center p-2 bg-slate-50 rounded-lg">
                      <div className="w-5 h-5 bg-[#8FA885] rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium text-sm">{inclusion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment Workflow */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Treatment Workflow</h3>
                <div className="space-y-3">
                  {selectedPackage.milestones.map((milestone: string, idx: number) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-6 h-6 bg-[#8FA885] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white font-bold text-xs">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 capitalize text-sm">{milestone}</h4>
                        <p className="text-slate-600 text-xs">
                          {milestone === 'TeleConsult' && 'Initial consultation with specialist via video call'}
                          {milestone === 'Admission' && 'Hospital admission and pre-operative preparation'}
                          {milestone === 'Surgery' && 'Surgical procedure performed by expert team'}
                          {milestone === 'Recovery' && 'Post-operative care and monitoring'}
                          {milestone === 'Discharge' && 'Discharge with follow-up care instructions'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Services */}
              {selectedPackage.addons && selectedPackage.addons.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Additional Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPackage.addons.map((addon: any, idx: number) => (
                      <div key={idx} className="p-3 border border-slate-200 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-slate-900 text-sm">{addon.name}</h4>
                          <span className="text-[#8FA885] font-bold text-sm">${addon.priceUSD}</span>
                        </div>
                        {addon.per && (
                          <span className="text-slate-600 text-xs">per {addon.per}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Refund Policy */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Refund Policy</h3>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-700 text-sm">{selectedPackage.refundPolicy}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-[#8FA885] hover:bg-[#7A9672] text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                  Book This Package
                </button>
                <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}




      {/* Simple Call to Action */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="section-title mb-4">
              Ready to Start Your Medical Journey?
            </h2>
            <p className="description-text mb-6">
              Whether you're a patient seeking treatment or a doctor looking to help patients, 
              we're here to connect you with the best medical care.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                href="/start-case" 
                className="inline-flex items-center justify-center px-6 py-3 text-black font-semibold rounded-lg border transition-all duration-300 shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#ADC8A6', borderColor: '#2A4049' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#9BB596';
                  e.currentTarget.style.borderColor = '#1F2F35';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ADC8A6';
                  e.currentTarget.style.borderColor = '#2A4049';
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                Get Started
                </Link>
                  <Link 
                href="/signin" 
                className="inline-flex items-center justify-center px-6 py-3 text-black font-semibold rounded-lg border transition-all duration-300 shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#ADC8A6', borderColor: '#2A4049' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#9BB596';
                  e.currentTarget.style.borderColor = '#1F2F35';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ADC8A6';
                  e.currentTarget.style.borderColor = '#2A4049';
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                Sign In
                  </Link>
                  <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 text-black font-semibold rounded-lg border transition-all duration-300 shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#ADC8A6', borderColor: '#2A4049' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#9BB596';
                  e.currentTarget.style.borderColor = '#1F2F35';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ADC8A6';
                  e.currentTarget.style.borderColor = '#2A4049';
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                Contact Us
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
