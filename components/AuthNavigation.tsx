'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/contexts/AppContext';

export default function AuthNavigation() {
  const { t } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200 z-[85]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 group">
            <div className="relative w-32 h-32 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Image
                src="https://eqjpdytmsohfpohecczz.supabase.co/storage/v1/object/public/icons/image__1_-removebg-preview.png"
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
            <Link href="/about" className="text-slate-900 hover:text-slate-700 transition-all duration-200 font-bold text-sm tracking-wide relative group px-3 py-2 rounded-lg hover:bg-slate-100">
              {t('nav.about')}
            </Link>
          </div>

          {/* Right Side - Back to Home */}
          <div className="hidden lg:flex items-center">
            <Link href="/" className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-100 rounded-lg transition-all duration-200">
              ← Back to Home
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 text-slate-600 hover:text-slate-800 transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
