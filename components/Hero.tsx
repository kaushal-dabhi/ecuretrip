'use client'

// components/Hero.tsx
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-[#8EBF8C]">
      {/* subtle vignette + depth */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-navy/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-mint to-mint/0" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pt-32 pb-20 md:flex-row md:items-center md:gap-6">
        {/* Left: copy + search */}
        <div className="relative z-10 w-full md:w-6/12 md:pl-0 md:-ml-8 md:-mt-8">
          <h1 className="hero-text text-slate-900">
            Trusted Doctors, <br className="hidden sm:block" />
            Smarter Journeys
          </h1>

          <p className="mt-6 description-text text-slate-900">
            Choose the right doctor first. Our intelligent platform makes your care—from consultation to recovery—transparent, safe, and stress-free.
          </p>

          {/* Search bar */}
          <form
            className="mt-6 flex w-full items-stretch gap-0 rounded-full bg-white shadow-lg ring-2 ring-slate-200 md:justify-start"
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
              className="w-full flex-1 rounded-l-full border-0 bg-transparent px-5 py-4 body text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="rounded-r-full bg-slate-900 px-6 button-text text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
            >
              Search
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <a href="/treatments" className="px-4 py-2 text-sm font-medium bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors cursor-pointer">
              Oncology
            </a>
            <a href="/treatments" className="px-4 py-2 text-sm font-medium bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors cursor-pointer">
              Cardiology
            </a>
            <a href="/treatments" className="px-4 py-2 text-sm font-medium bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors cursor-pointer">
              Fertility
            </a>
            <a href="/treatments" className="px-4 py-2 text-sm font-medium bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors cursor-pointer">
              Orthopedics
            </a>
            <a href="/treatments" className="px-4 py-2 text-sm font-medium bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors cursor-pointer">
              Neurology
            </a>
          </div>

        </div>

                {/* Right: hero image */}
        <div className="relative z-10 w-full md:w-6/12 md:absolute md:right-0 md:bottom-[-22px] md:w-1/2 md:h-full md:flex md:items-end md:pb-0">
          <Image
            priority
            src="/image__1_-removebg-preview.png"
            alt="Doctor consulting patient in clinic"
            width={1200}
            height={1200}
            className="w-full h-auto max-h-[520px] md:w-full md:h-full md:object-contain md:object-left md:object-bottom md:scale-105 md:origin-bottom"
          />
        </div>
      </div>
    </section>
  );
}
