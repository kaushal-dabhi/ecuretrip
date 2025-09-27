'use client';

import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Shield, 
  Heart, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Main Footer Content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src="/uploads/Final E Cure Trip.png" 
                alt="eCureTrip Logo" 
                className="w-24 h-24 object-contain"
              />
              <span className="text-4xl font-bold text-white">eCureTrip</span>
            </div>
            <p className="text-white mb-6 max-w-lg text-xl leading-relaxed font-medium">
              Your trusted partner in medical tourism. Connect with world-class healthcare providers 
              and experience medical excellence with comprehensive support throughout your journey.
            </p>
            
            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-[#ADC8A6]" />
                <span className="text-base font-medium">Verified Doctors & Hospitals</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-[#ADC8A6]" />
                <span className="text-base font-medium">24/7 Medical Support</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-[#ADC8A6]" />
                <span className="text-base font-medium">Escrow Payment Protection</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <CheckCircle className="w-4 h-4 text-[#ADC8A6]" />
                <span className="text-base font-medium">Travel & Visa Assistance</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/80">
                <Phone className="w-4 h-4 text-[#ADC8A6]" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Mail className="w-4 h-4 text-[#ADC8A6]" />
                <span>support@ecuretrip.com</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <Clock className="w-4 h-4 text-[#ADC8A6]" />
                <span>24/7 Support Available</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <ArrowRight className="w-5 h-5 mr-2 text-[#ADC8A6]" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/treatments" className="text-white/90 hover:text-[#ADC8A6] transition-colors duration-200 font-medium flex items-center group">
                  <span>Treatments</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-white/90 hover:text-[#ADC8A6] transition-colors duration-200 font-medium flex items-center group">
                  <span>Find Doctors</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/hospitals" className="text-white/90 hover:text-[#ADC8A6] transition-colors duration-200 font-medium flex items-center group">
                  <span>Partner Hospitals</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-white/90 hover:text-[#ADC8A6] transition-colors duration-200 font-medium flex items-center group">
                  <span>Treatment Packages</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/90 hover:text-mint-400 transition-colors duration-200 font-medium flex items-center group">
                  <span>About Us</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/90 hover:text-mint-400 transition-colors duration-200 font-medium flex items-center group">
                  <span>Contact</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Medical Specialties */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <Heart className="w-5 h-5 mr-2 text-mint-400" />
              Medical Specialties
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/treatments/oncology" className="text-white/90 hover:text-mint-400 transition-colors duration-200 font-medium flex items-center group">
                  <span>Oncology</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/treatments/cardiology" className="text-white/90 hover:text-mint-400 transition-colors duration-200 font-medium flex items-center group">
                  <span>Cardiology</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/treatments/orthopedics" className="text-white/90 hover:text-mint-400 transition-colors duration-200 font-medium flex items-center group">
                  <span>Orthopedics</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/treatments/neurology" className="text-white/90 hover:text-mint-400 transition-colors duration-200 font-medium flex items-center group">
                  <span>Neurology</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/treatments/fertility" className="text-white/90 hover:text-mint-400 transition-colors duration-200 font-medium flex items-center group">
                  <span>Fertility</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/treatments" className="text-white/90 hover:text-mint-400 transition-colors duration-200 font-medium flex items-center group">
                  <span>View All Specialties</span>
                  <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust & Security Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-mint-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-mint-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Secure Payments</h4>
              <p className="text-white/70 text-sm">Escrow protection ensures your funds are safe</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-mint-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-mint-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Verified Providers</h4>
              <p className="text-white/70 text-sm">All doctors and hospitals are thoroughly vetted</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-mint-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-mint-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">24/7 Support</h4>
              <p className="text-white/70 text-sm">Round-the-clock assistance throughout your journey</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/80 text-sm mb-4 md:mb-0">
              © 2024 eCureTrip. All rights reserved. | Medical Tourism Excellence
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-white/80 hover:text-mint-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/80 hover:text-mint-400 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-white/80 hover:text-mint-400 transition-colors duration-200">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-white/80 hover:text-mint-400 transition-colors duration-200">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
