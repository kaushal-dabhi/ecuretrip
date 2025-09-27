'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero';
import { SURGEONS } from '@/data/surgeons';
import { REVIEWS } from '@/data/reviews';
import { HOSPITALS } from '@/data/hospitals';
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

        if (data) {
          setFeaturedPackages(data)
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTreatments()
  }, []);

  // Get top 4 surgeons by cases per year (descending) - use useMemo for consistency
  const featuredSurgeons = useMemo(() => {
    return [...SURGEONS]
      .sort((a, b) => b.casesPerYear - a.casesPerYear)
      .slice(0, 4);
  }, []);

  // Get 6 reviews - use useMemo for consistency
  const featuredReviews = useMemo(() => {
    return REVIEWS.slice(0, 6);
  }, []);

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

      {/* Why Choose eCureTrip Section */}
      <section className="py-16 bg-gradient-to-br from-beige-paper via-white to-primary-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(143,184,133,0.08)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(74,144,226,0.06)_0%,transparent_50%)]"></div>
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-sage-200/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-oasis-200/20 rounded-full blur-2xl"></div>
            
            <div className="container relative z-10">
              <div className="text-center mb-8">
                    <h2 className="section-title mb-4">Why Choose eCureTrip?</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* AI-Powered Predictive Recovery */}
                <div className="group relative overflow-hidden rounded-xl bg-[#6F96E1]/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-sm">
                        <svg className="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                      </div>
                          <h3 className="card-title leading-tight">Find the Right Doctor, Backed by Smart Tech</h3>
                    </div>
                        <p className="description-text ml-13">
                      We highlight specialists patients trust most, with AI matching to guide your best fit.
                    </p>
                  </div>
                </div>

                {/* Escrow Payments */}
                <div className="group relative overflow-hidden rounded-xl bg-[#4794BE]/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-sm">
                        <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">Clear Costs, Zero Surprises</h3>
                    </div>
                    <p className="text-slate-800 text-lg leading-relaxed ml-13 font-medium">
                      Transparent estimates and verified credentials—clarity you can count on.
                    </p>
                  </div>
                </div>

                {/* Hybrid Local–Global Care Model */}
                <div className="group relative overflow-hidden rounded-xl bg-[#A7C281]/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-sm">
                        <svg className="h-5 w-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">Seamless Care, Global & Local</h3>
                    </div>
                    <p className="text-slate-700 text-lg leading-relaxed ml-13">
                      Virtual pre-op consults, hospital excellence in India, and follow-up support back home.
                    </p>
                  </div>
                </div>

                {/* Niche-Centric Medical Journeys */}
                <div className="group relative overflow-hidden rounded-xl bg-[#E6B96C]/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-sm">
                        <svg className="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H6v-2h4V7h2v4h4v2h-4v4z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">Specialized Journeys, Tailored to You</h3>
                    </div>
                    <p className="text-slate-700 text-lg leading-relaxed ml-13">
                      Oncology, fertility, orthopedics, senior mobility and more—programs shaped around your needs.
                    </p>
                  </div>
                </div>

                {/* Ethical Impact Guarantee */}
                <div className="group relative overflow-hidden rounded-xl bg-[#83B990]/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-sm">
                        <svg className="h-5 w-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.18l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">Ethical, Patient-First Care</h3>
                    </div>
                    <p className="text-slate-700 text-lg leading-relaxed ml-13">
                      Culturally sensitive guidance and responsible partnerships at every step.
                    </p>
                  </div>
                </div>

                {/* Recovery Concierge */}
                <div className="group relative overflow-hidden rounded-xl bg-[#D0B181]/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-sm">
                        <svg className="h-5 w-5 text-lime-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">Beyond Treatment, Into Recovery</h3>
                    </div>
                    <p className="text-slate-700 text-lg leading-relaxed ml-13">
                      Rehabilitation, wellness, and recovery tracking so healing continues after discharge.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-white to-beige-paper"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(143,184,133,0.15)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(244,231,210,0.2)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-16 left-12 w-28 h-28 bg-sage-200/25 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 right-12 w-32 h-32 bg-beige-paper/30 rounded-full blur-xl"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-12">
                <h2 className="section-title mb-4">Simple Steps. Smarter Support.</h2>
                <p className="description-text max-w-3xl mx-auto">
              From first consult to full recovery, everything is streamlined.
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
                  <h3 className="card-title mb-3">Tell Us Your Needs</h3>
                  <p className="body">
                Share symptoms, reports, or preferred treatment.
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
              <h3 className="text-slate-900 font-bold text-lg mb-3">Match With Top Doctors</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Our tech suggests best-fit specialists; you choose who feels right.
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
              <h3 className="text-slate-900 font-bold text-lg mb-3">Plan Your Journey</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                We coordinate visas, hospitals, transparent pricing and travel.
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
              <h3 className="text-slate-900 font-bold text-lg mb-3">Get Treated & Recover</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Care in India with dedicated follow-up back home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Specialties Section */}
      <section id="specialties" className="section-alt bg-gradient-to-br from-beige-paper via-white to-sage-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(244,231,210,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(143,184,133,0.1)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-beige-paper/40 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-sage-200/30 rounded-full blur-xl"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-12">
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
                  src="/cardiology.png"
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
              className="bg-[#8FA885] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#7A9672] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={handleBrowseAllSpecialties}
            >
              Browse All Specialties
            </button>
          </div>
        </div>
      </section>

      {/* Featured Treatment Packages Section */}
      <section className="section bg-gradient-to-br from-[#ADC8A6]/20 via-white to-[#2A4049]/10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(42,64,73,0.08)_0%,transparent_50%),radial-gradient(circle_at_30%_70%,rgba(173,200,166,0.15)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-16 right-20 w-28 h-28 bg-[#2A4049]/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 left-20 w-36 h-36 bg-[#ADC8A6]/30 rounded-full blur-xl"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-12">
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
                <div key={pkg.id} className="bg-gradient-to-br from-[#ADC8A6]/30 to-white rounded-lg p-4 shadow-lg border-2 border-[#2A4049] hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col group">
                  <div className="text-center mb-3">
                        <h3 className="card-title text-[#2A4049] mb-2 group-hover:text-[#1A2F36] transition-colors">{pkg.name}</h3>
                    <div className="text-xl font-bold mb-2 text-[#2A4049] group-hover:text-[#1A2F36] transition-colors">₹{pkg.base_price?.toLocaleString() || 'Contact for pricing'}</div>
                    <div className="text-xs text-[#2A4049] font-medium group-hover:text-[#1A2F36] transition-colors">{pkg.duration_days || 1} day{(pkg.duration_days || 1) !== 1 ? 's' : ''} stay</div>
                </div>
                
                <ul className="space-y-1.5 mb-4 flex-grow">
                    {pkg.inclusions ? pkg.inclusions.slice(0, 3).map((inclusion: string, idx: number) => (
                    <li key={idx} className="flex items-center text-xs text-[#2A4049] group-hover:text-[#1A2F36] transition-colors">
                      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center mr-2 bg-[#2A4049] group-hover:bg-[#1A2F36] transition-colors flex-shrink-0">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="leading-tight">{inclusion}</span>
                    </li>
                    )) : (
                      <li className="flex items-center text-xs text-[#2A4049] group-hover:text-[#1A2F36] transition-colors">
                        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center mr-2 bg-[#2A4049] group-hover:bg-[#1A2F36] transition-colors flex-shrink-0">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="leading-tight">Comprehensive treatment package</span>
                      </li>
                    )}
                </ul>
                
                <button 
                  className="w-full py-1.5 px-3 rounded-lg font-bold text-white text-xs transition-all duration-300 hover:scale-105 bg-[#2A4049] hover:bg-[#1A2F36] mt-auto shadow-md hover:shadow-lg"
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
      <section className="section-alt bg-gradient-to-br from-[#F5EFE7]/80 via-white to-[#E4E7EB]/60 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(216,235,221,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(29,42,59,0.1)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-12 left-16 w-32 h-32 bg-[#D8EBDD]/40 rounded-full blur-2xl"></div>
        <div className="absolute bottom-12 right-16 w-28 h-28 bg-[#1D2A3B]/15 rounded-full blur-xl"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
                <h2 className="section-title mb-4">Top Performing Surgeons</h2>
                <p className="description-text max-w-3xl mx-auto">
              Meet our network of highly qualified and experienced medical professionals.
            </p>
          </div>
          
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredSurgeons.map((surgeon, index) => (
              <div key={surgeon.slug} className="bg-gradient-to-br from-[#1D2A3B]/10 via-[#F5EFE7] to-white rounded-lg p-4 shadow-lg border-2 border-[#1D2A3B] hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col group">
                <div className="text-center mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1D2A3B] to-[#D8EBDD] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <img 
                      src={
                        index === 0 ? `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=64&h=64&fit=crop&crop=face` :
                        index === 1 ? `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=face` :
                        index === 2 ? `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face` :
                        `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=64&h=64&fit=crop&crop=face`
                      }
                      alt={surgeon.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                      <h3 className="card-title text-[#1D2A3B] mb-2 transition-colors">{surgeon.name}</h3>
                      <p className="body-small mb-2 transition-colors">{surgeon.specialty}</p>
                      <p className="body-small font-semibold mb-3 transition-colors">{surgeon.casesPerYear} cases/year</p>
                </div>
                
                <div className="flex items-center justify-center space-x-2 mb-4 flex-grow">
                  {surgeon.languages.map((lang, index) => (
                    <span key={index} className="px-2 py-1 bg-[#D8EBDD]/60 text-[#1D2A3B] text-xs rounded font-medium border border-[#1D2A3B]/30">
                      {lang}
                    </span>
                  ))}
                </div>
                
                <button 
                  className="w-full py-1.5 px-3 rounded-lg font-bold text-white text-xs transition-all duration-300 hover:scale-105 bg-[#1D2A3B] mt-auto shadow-md hover:shadow-lg"
                  onClick={() => handleTeleconsultBook(surgeon)}
                >
                  Book Tele-consult
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Reviews Section */}
      <section className="section bg-gradient-to-br from-oasis-50 via-white to-sage-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(74,144,226,0.1)_0%,transparent_50%),radial-gradient(circle_at_70%_30%,rgba(143,184,133,0.08)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-20 right-16 w-24 h-24 bg-oasis-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-16 w-32 h-32 bg-sage-200/25 rounded-full blur-xl"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="h2 mb-4 text-slate-900">Patient Reviews</h2>
            <p className="lead text-slate-800 max-w-3xl mx-auto font-medium">
              Real experiences from patients who have successfully received treatment through eCureTrip.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredReviews.map((review) => (
              <div key={review.id} className="card-elevated p-6 bg-white/90 backdrop-blur-sm border border-slate-200/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-sage-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  {review.kycVerified && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold">
                      ✓ KYC Verified
                    </span>
                  )}
                </div>
                <p className="text-slate-800 mb-4 italic font-bold text-lg">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center justify-between text-base text-slate-800 font-bold">
                  <span>{review.date}</span>
                  <span>{review.procedureSku}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Hospitals Section */}
      <section className="section-alt bg-gradient-to-br from-sage-50 via-white to-beige-paper relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(143,184,133,0.1)_0%,transparent_50%),radial-gradient(circle_at_20%_80%,rgba(244,231,210,0.2)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-16 left-20 w-28 h-28 bg-sage-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 right-20 w-36 h-36 bg-beige-paper/35 rounded-full blur-xl"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="h2 mb-4 text-slate-900">Partner Hospitals</h2>
            <p className="lead text-slate-800 max-w-3xl mx-auto font-medium">
              We partner with world-renowned hospitals and medical centers across India.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOSPITALS.map((hospital) => (
              <div key={hospital.slug} className="card-interactive p-6 text-center bg-[#4794BE]/10 backdrop-blur-sm border border-slate-200/50 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-sage-100 to-sage-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-sage-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <h3 className="h4 mb-2 text-slate-900 font-bold">{hospital.name}</h3>
                <p className="text-sm text-slate-800 mb-3 font-medium">{hospital.city}</p>
                {hospital.accreditation && (
                  <span className="px-3 py-1 bg-oasis-100 text-oasis-800 text-xs rounded-full font-bold">
                    {hospital.accreditation}
                  </span>
                )}
              </div>
            ))}
          </div>
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



      {/* AI Journey Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.06)_0%,transparent_50%)]"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/20 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              New Feature
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              AI-Powered Medical Journey
            </h2>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-medium">
              Experience intelligent healthcare with our AI assistant that guides you through every step 
              of your medical journey - from initial consultation to treatment completion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - Features */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Intelligent Chat Assistant</h3>
                  <p className="text-slate-600">Get personalized guidance through your medical journey with AI-powered conversations that understand your context.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Document Processing</h3>
                  <p className="text-slate-600">Upload medical reports and get AI-powered analysis and extraction of key information automatically.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Doctor Matching</h3>
                  <p className="text-slate-600">AI-powered matching to find the best specialists for your specific medical condition and requirements.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Automated Quoting</h3>
                  <p className="text-slate-600">Get detailed treatment cost estimates and payment plans tailored to your specific case and requirements.</p>
                </div>
              </div>
            </div>
            
            {/* Right Side - CTA */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Your AI Journey</h3>
                <p className="text-slate-600 mb-6">
                  Experience the future of healthcare with our intelligent AI assistant. 
                  No registration required for demo access.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link 
                  href="/ai-journey"
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                >
                  Explore AI Journey
                </Link>
                
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href="/patient/cases/ONC-2024-001"
                    className="block bg-blue-50 text-blue-700 font-semibold py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors text-center text-sm"
                  >
                    Patient Demo
                  </Link>
                  <Link 
                    href="/doctor/cases/ONC-2024-001"
                    className="block bg-purple-50 text-purple-700 font-semibold py-3 px-4 rounded-lg hover:bg-purple-100 transition-colors text-center text-sm"
                  >
                    Doctor Demo
                  </Link>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  HIPAA Compliant & Secure
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-slate-100 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Ready to Start Your Medical Journey?
            </h2>
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              Whether you're a patient seeking treatment or a doctor looking to help patients, 
              we're here to connect you with the best medical care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/start-case" 
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                Get Started
                </Link>
              <Link 
                href="/signin" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                Sign In
                </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-600 font-semibold rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-200 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
