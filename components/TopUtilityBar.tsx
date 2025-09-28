'use client'

export default function TopUtilityBar() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-[100]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          {/* Left Side - Brand Info */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-slate-800 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>24/7 Medical Support</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-800 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>India</span>
            </div>
          </div>

          {/* Right Side - Simple Info */}
          <div className="flex items-center space-x-6">
            <div className="text-sm text-slate-600">
              English • $ USD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
