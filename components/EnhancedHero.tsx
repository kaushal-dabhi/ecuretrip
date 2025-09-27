'use client'

import { useState } from 'react'
import { Search, Calendar, Shield, Globe, Heart, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { specialties, cities } from '@/lib/data'

export default function EnhancedHero() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedCity, setSelectedCity] = useState('')




  const trustBadges = [
    { icon: Shield, text: 'JCI Accredited', color: 'text-cyan-500' },
    { icon: Globe, text: 'International Standards', color: 'text-blue-500' },
    { icon: Heart, text: 'Patient First', color: 'text-pink-500' }
  ]

  return (
    <section className="relative bg-gradient-hero text-white py-20 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-palm-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-oasis-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-32 w-3 h-3 bg-palm-300/40 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-1/4 w-2 h-2 bg-white/50 rounded-full"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6">
              World-Class Healthcare
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sand-200 to-palm-200">
                in India
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-sand-100 max-w-4xl mx-auto mb-8 leading-relaxed"
          >
            Connect with verified doctors, accredited hospitals, and comprehensive treatment packages. 
            Your journey to better health starts here.
          </motion.p>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-6 mb-8"
          >
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <badge.icon className={`w-5 h-5 ${badge.color}`} />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Find Your Perfect Treatment
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Specialty Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-sand-200 mb-2">
                  Treatment Type
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-sand-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Treatment</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              {/* City Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-sand-200 mb-2">
                  Preferred City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-sand-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button className="w-full btn-primary bg-gradient-to-r from-oasis-500 to-palm-500 hover:from-oasis-600 hover:to-palm-600 border-0 py-3 text-lg font-semibold">
                  <Search className="w-5 h-5 mr-2" />
                  Find Treatment
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {['Cardiology', 'Orthopedics', 'IVF', 'Neurology'].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-all duration-200 border border-white/30 hover:border-white/50"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary bg-white text-oasis-600 hover:bg-sand-100 border-0 px-8 py-4 text-lg font-semibold">
              <Calendar className="w-5 h-5 mr-2" />
              Book Consultation
            </button>
            <button className="btn-outline border-white text-white hover:bg-white hover:text-oasis-600 px-8 py-4 text-lg font-semibold">
              <Play className="w-5 h-5 mr-2" />
              Watch Video
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 text-white"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6.69,90.41-27.13,131.13-32.26,32.81-4.36,70.9,7.39,104.06,25.3L1200,115.5V0Z"
            fill="currentColor"
            opacity="0.1"
          />
        </svg>
      </div>
    </section>
  )
}
