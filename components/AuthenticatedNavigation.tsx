'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/contexts/AppContext';
import { User, Stethoscope, Shield, LogOut, Settings, Bell } from 'lucide-react';

interface AuthenticatedNavigationProps {
  className?: string;
}

export default function AuthenticatedNavigation({ className = '' }: AuthenticatedNavigationProps) {
  const { t } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const storedRole = localStorage.getItem('userRole');
      const storedName = localStorage.getItem('userName');
      
      if (token && storedRole) {
        setIsAuthenticated(true);
        setUserRole(storedRole);
        setUserName(storedName || 'User');
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName('');
      }
    };

    checkAuth();
    
    // Listen for storage changes (login/logout)
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
    
    // Dispatch custom event for other components
    window.dispatchEvent(new Event('authChange'));
    
    // Redirect to home
    window.location.href = '/';
  };

  const getEMRLink = () => {
    if (!userRole) return '/auth/login';
    
    switch (userRole) {
      case 'patient':
        return '/emr/patient-dashboard';
      case 'doctor':
        return '/emr/doctor-dashboard';
      case 'admin':
        return '/emr/admin-dashboard';
      default:
        return '/auth/login';
    }
  };

  const getEMRButtonText = () => {
    if (!userRole) return 'EMR System';
    
    switch (userRole) {
      case 'patient':
        return 'My Health Records';
      case 'doctor':
        return 'My Practice';
      case 'admin':
        return 'Admin Panel';
      default:
        return 'EMR System';
    }
  };

  const getEMRButtonColor = () => {
    if (!userRole) return 'bg-blue-600 hover:bg-blue-700';
    
    switch (userRole) {
      case 'patient':
        return 'bg-green-600 hover:bg-green-700';
      case 'doctor':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'admin':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  if (!isAuthenticated) {
    return null; // Don't show anything if not authenticated
  }

  return (
    <div className={`bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <div className="relative w-32 h-32 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/uploads/Final E Cure Trip.png"
                alt="eCureTrip Logo"
                width={128}
                height={128}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-slate-900 hover:text-slate-700 transition-all duration-200 font-bold text-sm tracking-wide relative group px-3 py-2 rounded-lg hover:bg-slate-100">
              Home
            </Link>
            <Link href="/treatments" className="text-slate-900 hover:text-slate-700 transition-all duration-200 font-bold text-sm tracking-wide relative group px-3 py-2 rounded-lg hover:bg-slate-100">
              {t('nav.treatments')}
            </Link>
            <Link href="/doctors" className="text-slate-900 hover:text-slate-700 transition-all duration-200 font-bold text-sm tracking-wide relative group px-3 py-2 rounded-lg hover:bg-slate-100">
              {t('nav.doctors')}
            </Link>
            <Link href="/hospitals" className="text-slate-900 hover:text-slate-700 transition-all duration-200 font-bold text-sm tracking-wide relative group px-3 py-2 rounded-lg hover:bg-slate-100">
              {t('nav.hospitals')}
            </Link>
            <Link href="/about" className="text-slate-900 hover:text-slate-700 transition-all duration-200 font-bold text-sm tracking-wide relative group px-3 py-2 rounded-lg hover:bg-slate-100">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="text-slate-900 hover:text-slate-700 transition-all duration-200 font-bold text-sm tracking-wide relative group px-3 py-2 rounded-lg hover:bg-slate-100">
              {t('nav.contact')}
            </Link>
            
            {/* EMR System Button - Only shown after authentication */}
            <Link 
              href={getEMRLink()} 
              className={`text-white font-bold text-sm tracking-wide relative group px-4 py-2 rounded-lg transition-all duration-200 ${getEMRButtonColor()}`}
            >
              {getEMRButtonText()}
            </Link>
          </div>

          {/* Right Side - User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-100 rounded-full px-3 py-1.5">
              {userRole === 'patient' && <User className="w-4 h-4 text-green-600" />}
              {userRole === 'doctor' && <Stethoscope className="w-4 h-4 text-blue-600" />}
              {userRole === 'admin' && <Shield className="w-4 h-4 text-purple-600" />}
              <span className="text-sm font-medium text-slate-700">
                {userRole === 'patient' ? 'Patient' : 
                 userRole === 'doctor' ? 'Doctor' : 
                 userRole === 'admin' ? 'Admin' : 'User'}: {userName}
              </span>
            </div>

            {/* Action Buttons */}
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-red-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
