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
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react'

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['+1 (555) 123-4567', '+91 98765 43210'],
    description: '24/7 patient support line'
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['support@ecuretrip.com', 'info@ecuretrip.com'],
    description: 'We respond within 2 hours'
  },
  {
    icon: MapPin,
    title: 'Office',
    details: ['123 Healthcare Plaza', 'Medical District, NY 10001'],
    description: 'Visit us for in-person consultation'
  },
  {
    icon: Clock,
    title: 'Hours',
    details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
    description: 'Emergency support available 24/7'
  }
]

const services = [
  {
    icon: MessageCircle,
    title: 'Free Consultation',
    description: 'Get expert advice on your medical tourism options',
    action: 'Schedule Now'
  },
  {
    icon: Users,
    title: 'Patient Support',
    description: 'Dedicated support throughout your medical journey',
    action: 'Contact Support'
  },
  {
    icon: Calendar,
    title: 'Treatment Planning',
    description: 'Comprehensive planning for your medical travel',
    action: 'Get Started'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    treatment: '',
    country: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopUtilityBar />
        <Navigation />
        
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="text-center py-8">
              <CardBody>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#ADC8A6' }}>
                  <CheckCircle className="w-10 h-10" style={{ color: '#2A4049' }} />
                </div>
                <h1 className="heading-2 mb-4">Thank You!</h1>
                <p className="description-text mb-8">
                  Your message has been sent successfully. Our medical tourism experts will contact you within 2 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <Button size="lg" style={{ backgroundColor: '#2A4049' }}>
                      Return Home
                    </Button>
                  </Link>
                  <Link href="/treatments">
                    <Button variant="outline" size="lg" style={{ borderColor: '#2A4049', color: '#2A4049' }}>
                      Browse Treatments
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
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
        <div className="py-6" style={{ backgroundColor: '#2A4049' }}>
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="section-title text-white mb-2 drop-shadow-lg">Contact Us</h1>
            <p className="description-text text-white/90 drop-shadow-md max-w-3xl mx-auto">
              Ready to start your medical tourism journey? Our expert team is here to help you 
              every step of the way. Get in touch for a free consultation.
            </p>
          </div>
        </div>
      </div>

      <div className="pb-6">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Simple Single Column Layout */}
          <div className="max-w-4xl mx-auto">
            {/* Contact Form */}
            <div className="bg-white rounded-xl border-2 border-[#ADC8A6] p-6 mb-6">
              <h2 className="text-2xl font-bold text-[#2A4049] mb-3">Send us a Message</h2>
              <p className="text-gray-600 mb-6">Fill out the form below and we'll get back to you within 2 hours.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block label-text mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block label-text mb-2">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block label-text mb-2">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block label-text mb-2">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-[#ADC8A6] rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
                        >
                          <option value="">Select your country</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                          <option value="CA">Canada</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="IN">India</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="treatment" className="block label-text mb-2">
                        Treatment Interest
                      </label>
                      <select
                        id="treatment"
                        name="treatment"
                        value={formData.treatment}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#ADC8A6] rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
                      >
                        <option value="">Select treatment of interest</option>
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

                    <div>
                      <label htmlFor="subject" className="block label-text mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What can we help you with?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block label-text mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your medical tourism needs..."
                        className="w-full px-3 py-2 border border-[#ADC8A6] rounded-lg focus:ring-2 focus:ring-[#2A4049] focus:border-transparent"
                      />
                    </div>

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      className="w-full"
                      style={{ backgroundColor: '#2A4049' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1A2F36'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2A4049'}
                      icon={Send}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
            </div>

            {/* Contact Info & Services - Simple Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Contact Info */}
              <div className="bg-white rounded-xl border-2 border-[#2A4049] p-4">
                <h3 className="text-lg font-bold text-[#2A4049] mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded bg-[#ADC8A6]/10">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#ADC8A6]">
                        <info.icon className="w-4 h-4 text-[#2A4049]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#2A4049] text-sm">{info.title}</h4>
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-xs text-gray-700">{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Services */}
              <div className="bg-white rounded-xl border-2 border-[#ADC8A6] p-4">
                <h3 className="text-lg font-bold text-[#2A4049] mb-3">Quick Services</h3>
                <div className="space-y-2">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded bg-[#2A4049]/10">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#2A4049]">
                        <service.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#2A4049] text-sm">{service.title}</h4>
                        <button className="text-xs text-[#2A4049] hover:underline">
                          {service.action} →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-xl border-2 border-[#ADC8A6] p-4 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-[#ADC8A6]">
                  <Phone className="w-6 h-6 text-[#2A4049]" />
                </div>
                <h4 className="font-bold text-[#2A4049] mb-2">Emergency Support</h4>
                <p className="text-sm text-gray-600 mb-2">24/7 Medical Tourism Assistance</p>
                <a href="tel:+1-555-123-4567" className="text-lg font-bold text-[#2A4049] hover:underline">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
