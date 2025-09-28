'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { useApp } from '@/lib/contexts/AppContext';
import { createClient } from '@/lib/supabase/client';
import { User, LogOut, Bell, Settings } from 'lucide-react';

interface AuthenticatedNavigationProps {
  userRole?: 'patient' | 'doctor' | 'admin';
  userName?: string;
}

export default function AuthenticatedNavigation({ userRole, userName }: AuthenticatedNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  // const { t } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getDashboardLink = () => {
    switch (userRole) {
      case 'patient':
        return '/patient/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'patient':
        return 'Patient Portal';
      case 'doctor':
        return 'Doctor Portal';
      case 'admin':
        return 'Admin Portal';
      default:
        return 'Dashboard';
    }
  };

  return (
    <nav className={`fixed top-12 left-0 right-0 backdrop-blur-md shadow-lg border-b z-[85] transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 shadow-xl border-blue-200' 
        : 'bg-gradient-to-r from-blue-50 via-white to-slate-50 border-blue-100'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <div className="relative w-28 h-28 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image
                src="https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/icons/image__1_-removebg-preview.png"
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
              e.currentTarget.style.backgroundColor = '#145263';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
              Home
            </Link>
            <Link href="/treatments" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#145263';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
                  Treatments
            </Link>
            <Link href="/doctors" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#145263';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
                  Doctors
            </Link>
            <Link href="/hospitals" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#145263';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
                  Hospitals
            </Link>
            <Link href="/about" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#145263';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
                  About
            </Link>
            <Link href="/contact" className="nav-text transition-all duration-200 relative group px-4 py-2.5 rounded-lg" onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#145263';
              e.currentTarget.style.color = 'white';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#0f172a';
            }}>
                  Contact
            </Link>
          </div>

          {/* Right Side - User Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Dashboard Link */}
            <Link 
              href={getDashboardLink()}
              className="px-5 py-2.5 button-text text-[#145263] border border-[#145263] rounded-lg transition-all duration-200 hover:bg-[#145263] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#145263] focus:ring-offset-2"
            >
              {getRoleLabel()}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[#FFF3D4] transition-all duration-200"
              >
                <div className="w-8 h-8 bg-[#145263] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="nav-text text-slate-900">{userName || 'User'}</span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[#145263] hover:text-[#0F3A47] transition-colors duration-200 focus-ring"
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
              <Link href="/treatments" className="nav-text transition-all duration-200 px-4 py-3 rounded-lg" onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#145263';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0f172a';
              }}>
                  Treatments
              </Link>
              <Link href="/doctors" className="nav-text transition-all duration-200 px-4 py-3 rounded-lg" onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#145263';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0f172a';
              }}>
                  Doctors
              </Link>
              <Link href="/hospitals" className="nav-text transition-all duration-200 px-4 py-3 rounded-lg" onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#145263';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0f172a';
              }}>
                  Hospitals
              </Link>
              <Link href="/about" className="nav-text transition-all duration-200 px-4 py-3 rounded-lg" onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#145263';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0f172a';
              }}>
                  About
              </Link>
              <Link href="/contact" className="nav-text transition-all duration-200 px-4 py-3 rounded-lg" onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#145263';
                e.currentTarget.style.color = 'white';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0f172a';
              }}>
                  Contact
              </Link>
              
              {/* Mobile User Actions */}
              <div className="border-t border-slate-200 pt-4 px-4 space-y-3">
                <Link 
                  href={getDashboardLink()}
                  className="block w-full px-4 py-3 text-center button-text text-[#145263] border border-[#145263] rounded-lg transition-all duration-200 hover:bg-[#145263] hover:text-white"
                >
                  {getRoleLabel()}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-3 text-center button-text text-red-600 border border-red-600 rounded-lg transition-all duration-200 hover:bg-red-600 hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}