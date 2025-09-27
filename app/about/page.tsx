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
    image: '/Medical_Specialties_Images/oncology.png',
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
    <div className="min-h-screen bg-gray-50">
      <TopUtilityBar />
      <Navigation />
      
      <div className="pt-32 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">About eCureTrip</h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                We're revolutionizing medical tourism by connecting patients with world-class healthcare 
                facilities while ensuring transparency, quality, and compassionate care.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          {/* Mission & Vision */}
          <div className="py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  To make world-class healthcare accessible to everyone by bridging the gap between 
                  patients seeking quality treatment and accredited medical facilities worldwide.
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                <p className="text-lg text-gray-600">
                  To become the most trusted platform in medical tourism, known for our commitment 
                  to patient safety, treatment quality, and transparent pricing.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <stat.icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These core values guide everything we do and shape our commitment to excellence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardBody className="py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <value.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Our Story */}
          <div className="py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-8 py-12">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
                <p className="text-lg text-gray-600 mb-6">
                  eCureTrip was founded in 2020 with a simple yet powerful vision: to make quality healthcare 
                  accessible and affordable for everyone. Our founders, having experienced the challenges of 
                  navigating international healthcare firsthand, set out to create a platform that would 
                  eliminate the barriers between patients and world-class medical treatment.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Today, we've helped thousands of patients access life-changing treatments at accredited 
                  hospitals across the globe. Our platform ensures transparency in pricing, quality in care, 
                  and support throughout the entire medical journey.
                </p>
                <p className="text-lg text-gray-600">
                  We believe that everyone deserves access to the best medical care, regardless of where they live. 
                  That's why we continue to expand our network of partner hospitals and refine our services 
                  to provide an unparalleled medical tourism experience.
                </p>
              </div>
            </div>
          </div>

          {/* Leadership Team */}
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Leadership Team</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet the experts behind eCureTrip who are dedicated to transforming healthcare access.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardBody className="py-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{member.name}</h3>
                    <div className="text-blue-600 font-medium mb-3">{member.role}</div>
                    <p className="text-gray-600">{member.description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="py-16">
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardBody className="py-12 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Ready to Start Your Medical Journey?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Join thousands of patients who have trusted eCureTrip for their medical tourism needs. 
                  Get started with a free consultation today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Get Free Consultation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/treatments">
                    <Button variant="outline" size="lg">
                      Browse Treatments
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
