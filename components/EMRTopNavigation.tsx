'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/contexts/AppContext';
import { Bell, Settings, User, LogOut } from 'lucide-react';

interface EMRTopNavigationProps {
  userRole?: 'admin' | 'doctor' | 'patient';
  userName?: string;
}

export default function EMRTopNavigation({ userRole = 'admin', userName = 'User' }: EMRTopNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useApp();

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'admin': return 'Administrator';
      case 'doctor': return 'Doctor';
      case 'patient': return 'Patient';
      default: return 'User';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 z-[90]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-4 flex-shrink-0 group">
            {/* eCureTrip Logo */}
            <div className="relative w-16 h-16 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/uploads/Final E Cure Trip.jpg"
                alt="eCureTrip Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            
            {/* Brand Text */}
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-lg font-semibold text-slate-900">
                  eCure
                </span>
                <span className="text-lg font-semibold text-slate-800">
                  Trip
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-xs font-medium text-slate-700 tracking-wide">
                  EMR System
                </span>
              </div>
            </div>
          </Link>

          {/* Center Navigation - Main Website Links */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            <Link href="/" className="text-slate-700 hover:text-slate-900 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-100">
              Home
            </Link>
            <Link href="/treatments" className="text-slate-700 hover:text-slate-900 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-100">
              Treatments
            </Link>
            <Link href="/doctors" className="text-slate-700 hover:text-slate-900 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-100">
              Doctors
            </Link>
            <Link href="/hospitals" className="text-slate-700 hover:text-slate-900 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-100">
              Hospitals
            </Link>
            <Link href="/about" className="text-slate-700 hover:text-slate-900 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-100">
              About
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-slate-900 transition-all duration-200 font-medium text-sm px-3 py-2 rounded-lg hover:bg-slate-100">
              Contact
            </Link>
          </div>

          {/* Right Side - User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-slate-900">{userName}</div>
                <div className="text-xs text-slate-600">{getRoleDisplayName()}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <Link 
              href="/auth/login" 
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {/* User Info Mobile */}
              <div className="flex items-center space-x-3 px-4 py-3 bg-slate-50 rounded-lg mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">{userName}</div>
                  <div className="text-sm text-slate-600">{getRoleDisplayName()}</div>
                </div>
              </div>

              {/* Main Navigation Links */}
              <Link href="/" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 px-4 py-3 font-medium rounded-lg">
                Home
              </Link>
              <Link href="/treatments" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 px-4 py-3 font-medium rounded-lg">
                Treatments
              </Link>
              <Link href="/doctors" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 px-4 py-3 font-medium rounded-lg">
                Doctors
              </Link>
              <Link href="/hospitals" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 px-4 py-3 font-medium rounded-lg">
                Hospitals
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 px-4 py-3 font-medium rounded-lg">
                About
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 px-4 py-3 font-medium rounded-lg">
                Contact
              </Link>
              
              {/* Action Buttons Mobile */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 font-medium rounded-lg">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 font-medium rounded-lg">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <Link 
                  href="/auth/login" 
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 font-medium rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
