'use client'

// components/Hero.tsx
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-[#8EBF8C]">
      {/* subtle vignette + depth */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-navy/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-mint to-mint/0" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pt-20 pb-16 md:flex-row md:items-center md:gap-6 md:px-6 md:pt-24 md:pb-20">
        {/* Left: copy + search */}
        <div className="relative z-10 w-full px-2 md:w-5/12 md:px-0 md:pl-0 md:-ml-8 md:-mt-4">
          {/* Quick CTA Button - Closer to navigation bar */}
          <div className="mb-12">
            <Link href="/intake" className="inline-flex items-center gap-3 px-6 py-3 bg-[#2A4049] text-white rounded-xl text-base font-bold hover:bg-[#1A2F36] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <span>Start Your Journey</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

              <h1 className="text-xl md:text-3xl lg:text-4xl font-bold leading-tight text-slate-900 mb-10">
            Personalized Care, <br />
            Guided by Intelligence
          </h1>

              <p className="text-sm md:text-base description-text text-slate-900 mb-8">
            We simplify cross-border healthcare with smart doctor and hospital matching - transparent, safe, and stress-free
          </p>

          {/* Search bar */}
          <form
              className="mb-8 flex w-full items-stretch gap-0 rounded-full bg-white shadow-lg ring-2 ring-slate-200 md:justify-start"
            onSubmit={(e) => e.preventDefault()}
            role="search"
            aria-label="Search for treatments, doctors or hospitals"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search for treatments, doctors, hospitals
            </label>
            <input
              id="hero-search"
              type="search"
              placeholder="Search for treatments, doctors, hospitals…"
                className="w-full flex-1 rounded-l-full border-0 bg-transparent px-3 py-3 text-sm md:px-5 md:py-4 md:text-base body text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="rounded-r-full bg-slate-900 px-6 button-text text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
            >
              Search
            </button>
          </form>

          {/* Quick Category Chips */}
              <div className="flex flex-wrap justify-center md:flex-nowrap md:justify-start gap-1 md:gap-2 mb-8 md:overflow-x-auto px-1">
            <a href="/treatments" className="px-2 py-1.5 md:px-3 md:py-2 text-xs font-medium text-black bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
              Oncology
            </a>
            <a href="/treatments" className="px-2 py-1.5 md:px-3 md:py-2 text-xs font-medium text-black bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
              Cardiology
            </a>
            <a href="/treatments" className="px-2 py-1.5 md:px-3 md:py-2 text-xs font-medium text-black bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
              Fertility
            </a>
            <a href="/treatments" className="px-2 py-1.5 md:px-3 md:py-2 text-xs font-medium text-black bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
              Orthopedics
            </a>
            <a href="/treatments" className="px-2 py-1.5 md:px-3 md:py-2 text-xs font-medium text-black bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
              Neurology
            </a>
          </div>

          {/* Trust Signals */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4">
            <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm" style={{ backgroundColor: '#ADC8A6', borderColor: '#2A4049', border: '1px solid' }}>
              <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: '#2A4049' }}>
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-black">Startup India</span>
            </div>
            
            <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm" style={{ backgroundColor: '#ADC8A6', borderColor: '#2A4049', border: '1px solid' }}>
              <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: '#2A4049' }}>
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-black">24/7 Support</span>
            </div>
            
            <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm" style={{ backgroundColor: '#ADC8A6', borderColor: '#2A4049', border: '1px solid' }}>
              <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: '#2A4049' }}>
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-black">Leading Hospitals</span>
            </div>
          </div>

        </div>

                {/* Right: hero image */}
        <div className="relative z-10 w-full mt-4 md:w-5/12 md:absolute md:right-0 md:bottom-0 md:h-full md:flex md:items-end md:overflow-hidden md:pt-20 md:mt-0">
          <Image
            priority
            src="/demo.png"
            alt="Doctor consulting patient in clinic"
            width={600}
            height={600}
                className="w-full h-auto max-h-[200px] md:max-h-[350px] md:w-full md:h-full md:object-contain md:object-right md:object-bottom"
          />
        </div>
      </div>
    </section>
  );
}
