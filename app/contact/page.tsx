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
      <div className="min-h-screen bg-gray-50">
        <TopUtilityBar />
        <Navigation />
        
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <Card className="text-center py-16">
              <CardBody>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Thank You!</h1>
                <p className="text-lg text-gray-600 mb-8">
                  Your message has been sent successfully. Our medical tourism experts will contact you within 2 hours.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <Button size="lg">
                      Return Home
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
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopUtilityBar />
      <Navigation />
      
      <div className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your medical tourism journey? Our expert team is here to help you 
              every step of the way. Get in touch for a free consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-slate-900">Send us a Message</h2>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you within 2 hours.</p>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-2">
                        Treatment Interest
                      </label>
                      <select
                        id="treatment"
                        name="treatment"
                        value={formData.treatment}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
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
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      icon={Send}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index}>
                    <CardBody className="py-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-2">{info.title}</h3>
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-gray-600 text-sm mb-1">{detail}</p>
                          ))}
                          <p className="text-gray-500 text-xs mt-2">{info.description}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Quick Services */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold text-slate-900">Quick Services</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {services.map((service, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 mb-1">{service.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                          <button className="text-blue-600 text-sm font-medium hover:underline">
                            {service.action} →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-16">
            <Card className="bg-red-50 border-red-200">
              <CardBody className="py-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Emergency Support</h3>
                <p className="text-gray-600 mb-4">
                  For urgent medical tourism assistance, call our 24/7 emergency line
                </p>
                <a href="tel:+1-555-123-4567" className="text-2xl font-bold text-red-600 hover:underline">
                  +1 (555) 123-4567
                </a>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
