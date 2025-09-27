'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/contexts/AppContext';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useApp();

  return (
    <nav className="fixed top-12 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200 z-[85]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
              <Link href="/" className="flex items-center flex-shrink-0 group">
                {/* eCureTrip Logo with subtle background highlight */}
                <div className="relative w-28 h-28 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image
                    src="/uploads/Final E Cure Trip.png"
                alt="eCureTrip Logo"
                    width={112}
                    height={112}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation - Centered with Optimized Spacing */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
                <Link href="/" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2A4049';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
              Home
            </Link>
                <Link href="/intake" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2A4049';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
              {t('nav.intake')}
            </Link>
                <Link href="/treatments" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2A4049';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
              {t('nav.treatments')}
            </Link>
                <Link href="/doctors" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2A4049';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
              {t('nav.doctors')}
            </Link>
                <Link href="/hospitals" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2A4049';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
              {t('nav.hospitals')}
            </Link>
                <Link href="/about" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2A4049';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
              {t('nav.about')}
            </Link>
                <Link href="/contact" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2A4049';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
              {t('nav.contact')}
            </Link>
            {/* EMR System - Only shown after authentication */}
            {/* Removed for security - will be shown in authenticated navigation */}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Sign In Button */}
                <Link 
                  href="/signin" 
                  className="px-5 py-2.5 button-text text-slate-800 border border-slate-400 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2A4049';
                e.currentTarget.style.borderColor = '#2A4049';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#1e293b';
                e.currentTarget.style.borderColor = '#94a3b8';
              }}
            >
              Sign In
              </Link>
            {/* Get Started Button */}
                <Link 
                  href="/start-case" 
                  className="px-6 py-2.5 button-text text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ backgroundColor: '#2A4049' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1F2F35'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2A4049'}
            >
              Get Started
              </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-navy-600 hover:text-navy-500 transition-colors duration-200 focus-ring"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-2">
                  <Link href="/intake" className="nav-text transition-all duration-200 px-4 py-3 rounded-lg" onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2A4049';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0f172a';
              }}>
                {t('nav.intake')}
              </Link>
                  <Link href="/treatments" className="nav-text transition-all duration-200 px-4 py-3 rounded-lg" onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2A4049';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0f172a';
              }}>
                {t('nav.treatments')}
              </Link>
                  <Link href="/doctors" className="nav-text transition-all duration-200 px-4 py-3 rounded-lg" onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2A4049';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0f172a';
              }}>
                {t('nav.doctors')}
              </Link>
                  <Link href="/hospitals" className="nav-text transition-all duration-200 px-4 py-3 rounded-lg" onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2A4049';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0f172a';
              }}>
                {t('nav.hospitals')}
              </Link>
                  <Link href="/about" className="nav-text transition-all duration-200 px-4 py-3 rounded-lg" onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2A4049';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0f172a';
              }}>
                {t('nav.about')}
              </Link>
                  <Link href="/contact" className="nav-text transition-all duration-200 px-4 py-3 rounded-lg" onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2A4049';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0f172a';
              }}>
                {t('nav.contact')}
              </Link>
              
              
              {/* Mobile CTAs */}
              <div className="border-t border-slate-200 pt-4 px-4 space-y-3">
                    <Link 
                      href="/signin" 
                      className="block w-full px-4 py-3 text-center button-text text-slate-800 border border-slate-400 rounded-lg transition-all duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#2A4049';
                    e.currentTarget.style.borderColor = '#2A4049';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1e293b';
                    e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                >
                  Sign In
                  </Link>
                    <Link 
                      href="/start-case" 
                      className="block w-full px-4 py-3 text-center button-text text-white rounded-lg transition-all duration-200"
                  style={{ backgroundColor: '#2A4049' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1F2F35'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2A4049'}
                >
                  Get Started
                  </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
