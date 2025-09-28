'use client'

import Link from 'next/link'
import Image from 'next/image'
import TopUtilityBar from '@/components/TopUtilityBar'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  Shield, 
  Users, 
  Award, 
  Heart,
  Globe,
  Clock,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react'

const stats = [
  { number: '10,000+', label: 'Patients Served', icon: Users },
  { number: '50+', label: 'Partner Hospitals', icon: Award },
  { number: '25+', label: 'Countries', icon: Globe },
  { number: '99%', label: 'Success Rate', icon: CheckCircle }
]

const values = [
  {
    icon: Heart,
    title: 'Patient-Centric Care',
    description: 'Every decision we make is guided by what\'s best for our patients and their families.'
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'We maintain complete transparency in pricing, treatment plans, and outcomes.'
  },
  {
    icon: Award,
    title: 'Quality Assurance',
    description: 'All our partner hospitals meet international standards and are accredited.'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'We connect patients with world-class medical facilities across multiple countries.'
  }
]

const team = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Chief Medical Officer',
    image: 'https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/medical-specialties/oncology.png',
    description: '20+ years in international healthcare'
  },
  {
    name: 'Michael Chen',
    role: 'Operations Director',
    image: '/Medical_Specialties_Images/cardiology.png',
    description: 'Expert in medical tourism logistics'
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'Patient Care Coordinator',
    image: '/Medical_Specialties_Images/pediatrics.png',
    description: 'Specialized in patient advocacy'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopUtilityBar />
      <Navigation />
      
      {/* Header Bar */}
      <div className="pt-32">
        <div className="bg-[#2A4049] py-10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="hero-text text-white mb-6 drop-shadow-lg">About eCureTrip</h1>
            <p className="description-text text-white max-w-3xl mx-auto drop-shadow-md">
              We're revolutionizing medical tourism by connecting patients with world-class healthcare 
              facilities while ensuring transparency, quality, and compassionate care.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#2A4049]/20 rounded-full blur-xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h2 className="section-title text-[#2A4049] mb-4">Our Mission</h2>
              <p className="body text-[#2A4049] mb-4">
                To make world-class healthcare accessible to everyone by bridging the gap between 
                patients seeking quality treatment and accredited medical facilities worldwide.
              </p>
              <h3 className="heading-3 text-[#2A4049] mb-3">Our Vision</h3>
              <p className="body text-[#2A4049]">
                To become the most trusted platform in medical tourism, known for our commitment 
                to patient safety, treatment quality, and transparent pricing.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md border-2 border-[#ADC8A6] p-4">
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => {
                  const colors = ['bg-[#2A4049]', 'bg-[#ADC8A6]', 'bg-[#2A4049]', 'bg-[#ADC8A6]'];
                  const iconColors = ['text-white', 'text-[#2A4049]', 'text-white', 'text-[#2A4049]'];
                  return (
                    <div key={index} className="text-center">
                      <div className={`w-12 h-12 ${colors[index]} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                        <stat.icon className={`w-6 h-6 ${iconColors[index]}`} />
                      </div>
                      <div className="text-xl font-bold text-[#2A4049] mb-1">{stat.number}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-8">
            <h2 className="section-title text-[#2A4049] mb-3">Our Values</h2>
            <p className="description-text text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape our commitment to excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => {
              const colors = ['bg-[#2A4049]', 'bg-[#ADC8A6]', 'bg-[#2A4049]', 'bg-[#ADC8A6]'];
              const borders = ['border-[#2A4049]', 'border-[#ADC8A6]', 'border-[#2A4049]', 'border-[#ADC8A6]'];
              const iconColors = ['text-white', 'text-[#2A4049]', 'text-white', 'text-[#2A4049]'];
              return (
                <div key={index} className={`bg-white rounded-xl border-2 ${borders[index]} shadow-md hover:shadow-lg transition-all duration-300 text-center p-4`}>
                  <div className={`w-10 h-10 ${colors[index]} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <value.icon className={`w-5 h-5 ${iconColors[index]}`} />
                  </div>
                  <h3 className="font-semibold text-[#2A4049] mb-2 text-sm">{value.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-br from-[#2A4049]/15 via-white to-[#FECA58]/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(42,64,73,0.15)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(254,202,88,0.15)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-12 left-16 w-28 h-28 bg-[#ADC8A6]/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-12 right-16 w-36 h-36 bg-[#FECA58]/25 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-[#2A4049]/25 rounded-full blur-xl"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[#FECA58] p-12">
            <div className="text-center">
              <h2 className="section-title text-[#2A4049] mb-8">Our Story</h2>
              <div className="space-y-6">
                <p className="body text-[#2A4049]">
                  eCureTrip was founded in 2020 with a simple yet powerful vision: to make quality healthcare 
                  accessible and affordable for everyone. Our founders, having experienced the challenges of 
                  navigating international healthcare firsthand, set out to create a platform that would 
                  eliminate the barriers between patients and world-class medical treatment.
                </p>
                <p className="body text-[#2A4049]">
                  Today, we've helped thousands of patients access life-changing treatments at accredited 
                  hospitals across the globe. Our platform ensures transparency in pricing, quality in care, 
                  and support throughout the entire medical journey.
                </p>
                <p className="body text-[#2A4049]">
                  We believe that everyone deserves access to the best medical care, regardless of where they live. 
                  That's why we continue to expand our network of partner hospitals and refine our services 
                  to provide an unparalleled medical tourism experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-gradient-to-br from-[#ADC8A6]/15 via-white to-[#2A4049]/10 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-[#FECA58]/25 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#ADC8A6]/25 rounded-full blur-xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="section-title text-[#2A4049] mb-4">Leadership Team</h2>
            <p className="description-text text-[#2A4049] max-w-2xl mx-auto">
              Meet the experts behind eCureTrip who are dedicated to transforming healthcare access.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => {
              const borders = ['border-[#2A4049]', 'border-[#FECA58]', 'border-[#ADC8A6]'];
              const bgColors = ['bg-[#2A4049]/20', 'bg-[#FECA58]/20', 'bg-[#ADC8A6]/20'];
              return (
                <div key={index} className={`bg-white rounded-2xl border-2 ${borders[index]} shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-center p-8`}>
                  <div className={`w-24 h-24 ${bgColors[index]} rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden border-2 ${borders[index]}`}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h3 className="card-title text-[#2A4049] mb-2">{member.name}</h3>
                  <div className="text-[#2A4049] font-medium mb-3 body-small">{member.role}</div>
                  <p className="body text-[#2A4049]">{member.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose eCureTrip Section */}
      <section className="py-20 bg-gradient-to-br from-[#FECA58]/20 via-white to-[#ADC8A6]/15 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(254,202,88,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(173,200,166,0.12)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-16 left-20 w-32 h-32 bg-[#2A4049]/25 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 right-20 w-40 h-40 bg-[#FECA58]/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#ADC8A6]/25 rounded-full blur-xl"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="section-title text-[#2A4049] mb-4">Why Choose eCureTrip?</h2>
            <p className="description-text text-[#2A4049] max-w-2xl mx-auto">
              Discover what makes us the trusted choice for medical tourism worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Doctor Matching */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-[#2A4049] shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2A4049] shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <h3 className="card-title text-[#2A4049] leading-tight">Smart Doctor Matching</h3>
                </div>
                <p className="body text-[#2A4049]">
                  Our AI-powered platform connects you with the most qualified specialists based on your specific medical needs and preferences.
                </p>
              </div>
            </div>

            {/* Transparent Pricing */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-[#FECA58] shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FECA58] shadow-lg">
                    <svg className="h-6 w-6 text-[#2A4049]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="card-title text-[#2A4049] leading-tight">Transparent Pricing</h3>
                </div>
                <p className="body text-[#2A4049]">
                  No hidden costs or surprises. Get clear, upfront pricing for all treatments with detailed cost breakdowns.
                </p>
              </div>
            </div>

            {/* Global Care Network */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-[#ADC8A6] shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ADC8A6] shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="card-title text-[#2A4049] leading-tight">Global Care Network</h3>
                </div>
                <p className="body text-[#2A4049]">
                  Access world-class medical facilities with seamless care coordination from consultation to recovery.
                </p>
              </div>
            </div>

            {/* Specialized Programs */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-[#FECA58] shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FECA58] shadow-lg">
                    <svg className="h-6 w-6 text-[#2A4049]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-4H6v-2h4V7h2v4h4v2h-4v4z"/>
                    </svg>
                  </div>
                  <h3 className="card-title text-[#2A4049] leading-tight">Specialized Programs</h3>
                </div>
                <p className="body text-[#2A4049]">
                  Tailored medical journeys for oncology, fertility, orthopedics, and more - designed around your specific needs.
                </p>
              </div>
            </div>

            {/* Ethical Care */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-[#ADC8A6] shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ADC8A6] shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.18l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                  <h3 className="card-title text-[#2A4049] leading-tight">Ethical Care</h3>
                </div>
                <p className="body text-[#2A4049]">
                  Patient-first approach with culturally sensitive guidance and responsible medical partnerships.
                </p>
              </div>
            </div>

            {/* Recovery Support */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-[#2A4049] shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2A4049] shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <h3 className="card-title text-[#2A4049] leading-tight">Recovery Support</h3>
                </div>
                <p className="body text-[#2A4049]">
                  Comprehensive post-treatment care with rehabilitation, wellness tracking, and ongoing support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-[#2A4049]/20 via-white to-[#FECA58]/25 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(42,64,73,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(254,202,88,0.18)_0%,transparent_50%)]"></div>
        {/* Floating Elements */}
        <div className="absolute top-16 left-20 w-32 h-32 bg-[#ADC8A6]/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-16 right-20 w-40 h-40 bg-[#FECA58]/35 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#2A4049]/25 rounded-full blur-xl"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[#FECA58] p-12 text-center">
            <h2 className="section-title text-[#2A4049] mb-6">
              Ready to Start Your Medical Journey?
            </h2>
            <p className="body text-[#2A4049] mb-8 max-w-2xl mx-auto">
              Join thousands of patients who have trusted eCureTrip for their medical tourism needs. 
              Get started with a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/start-case">
                <Button className="bg-[#2A4049] hover:bg-[#1F2F36] text-white px-8 py-3 rounded-xl button-text transition-all duration-200 shadow-lg">
                  Get Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/treatments">
                <Button className="bg-[#FECA58] hover:bg-[#E6B84F] text-[#2A4049] px-8 py-3 rounded-xl button-text transition-all duration-200 shadow-lg">
                  Browse Treatments
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
