'use client'

import { useState } from 'react'
import { Star, MapPin, Calendar, MessageCircle, Award, Shield, Users, Clock, CheckCircle, Building } from 'lucide-react'
import { motion } from 'framer-motion'
import { Doctor } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

interface EnhancedDoctorCardProps {
  doctor: Doctor
  onBookConsultation: (doctorId: string) => void
  onViewProfile: (doctorId: string) => void
}

export default function EnhancedDoctorCard({ doctor, onBookConsultation, onViewProfile }: EnhancedDoctorCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showFullBio, setShowFullBio] = useState(false)

  // Rating color logic
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-slate-700'
    if (rating >= 3.5) return 'text-slate-600'
    return 'text-slate-500'
  }

  // Experience color logic
  const getExperienceColor = (experience: number) => {
    if (experience >= 10) return 'text-slate-700 bg-slate-100'
    if (experience >= 5) return 'text-slate-600 bg-slate-50'
    return 'text-slate-500 bg-slate-50'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-sand-100"
    >
      {/* Top Banner */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-oasis-500 to-palm-500"></div>

      {/* Header Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Doctor Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center text-white text-xl font-bold">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-night mb-1">{doctor.name}</h3>
                <p className="text-oasis-600 font-medium">{doctor.specialty}</p>
              </div>
            </div>

            {/* Rating and Experience */}
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                <Star className={`w-5 h-5 ${getRatingColor(doctor.rating)} fill-current`} />
                <span className="font-semibold text-night">{doctor.rating}</span>
                <span className="text-sand-500 text-sm">({doctor.reviews} reviews)</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceColor(doctor.experience)}`}>
                {doctor.experience}+ years
              </div>
            </div>

            {/* Hospital and Location */}
            <div className="flex items-center space-x-4 text-sm text-sand-600 mb-3">
              <div className="flex items-center space-x-1">
                <Building className="w-4 h-4" />
                <span>{doctor.hospital}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{doctor.city}</span>
              </div>
            </div>
          </div>

          {/* Consultation Fee */}
          <div className="text-right">
            <div className="text-2xl font-bold text-oasis-600">{formatCurrency(doctor.consultationFee)}</div>
            <div className="text-sm text-sand-500">Consultation</div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-4">
          <p className={`text-sand-700 leading-relaxed ${showFullBio ? '' : 'line-clamp-3'}`}>
            {doctor.bio}
          </p>
          {doctor.bio.length > 150 && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="text-oasis-600 hover:text-oasis-700 text-sm font-medium mt-2"
            >
              {showFullBio ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="w-4 h-4 text-cyan-500" />
            <span className="text-sand-700">{doctor.successRate}% Success Rate</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sand-700">{doctor.reviews} Reviews</span>
          </div>
        </div>

        {/* Languages */}
        <div className="mb-4">
          <div className="text-sm text-sand-600 mb-2">Languages:</div>
          <div className="flex flex-wrap gap-2">
            {doctor.languages.map((language) => (
              <span
                key={language}
                className="px-3 py-1 bg-sand-100 text-sand-700 text-xs rounded-full"
              >
                {language}
              </span>
            ))}
          </div>
        </div>

        {/* Accreditations */}
        <div className="mb-4">
          <div className="text-sm text-sand-600 mb-2">Accreditations:</div>
          <div className="flex flex-wrap gap-2">
            {doctor.accreditations.slice(0, 3).map((accreditation) => (
              <span
                key={accreditation}
                className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-full flex items-center space-x-1"
              >
                <CheckCircle className="w-3 h-3" />
                {accreditation}
              </span>
            ))}
            {doctor.accreditations.length > 3 && (
              <span className="px-3 py-1 bg-sand-100 text-sand-700 text-xs rounded-full">
                +{doctor.accreditations.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <div className="text-sm text-sand-600 mb-2">Availability:</div>
          <div className="space-y-1">
            {doctor.availability.map((time, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-sand-700">
                <Clock className="w-4 h-4 text-oasis-500" />
                <span>{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onBookConsultation(doctor.id)}
            className="btn-primary py-3 text-sm font-medium"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Consultation
          </button>
          <button
            onClick={() => onViewProfile(doctor.id)}
            className="btn-outline py-3 text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            View Profile
          </button>
        </div>
      </div>

      {/* Hover Overlay */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-oasis-500/10 to-transparent pointer-events-none"
        />
      )}

      {/* Top Right Badge */}
      <div className="absolute top-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
          <div className="flex items-center space-x-1">
            <Award className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-medium text-night">Verified</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
