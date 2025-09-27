'use client'

import { Package } from '@/lib/types';
import { Check, Star, Clock, Users } from 'lucide-react';

interface PackageCardProps {
  package: Package;
  variant?: 'default' | 'featured';
  showAddons?: boolean;
}

export default function PackageCard({ package: pkg, variant = 'default', showAddons = false }: PackageCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <div className={`relative rounded-xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
      isFeatured 
        ? 'border-mint-400 bg-gradient-to-br from-mint-50 to-white' 
        : 'border-gray-200 bg-white hover:border-mint-300'
    }`}>
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-mint-400 text-navy-600 px-4 py-1 rounded-full text-sm font-bold shadow-md">
          FEATURED
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-navy-600 mb-2">{pkg.title}</h3>
          <div className="text-3xl font-bold text-mint-600 mb-1">
            ${pkg.priceUSD.toLocaleString()}
          </div>
          <div className="text-sm text-slate-800">
            {pkg.losDays} day{pkg.losDays !== 1 ? 's' : ''} stay
          </div>
        </div>

        {/* Inclusions */}
        <div className="mb-6">
          <h4 className="font-semibold text-navy-600 mb-3 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            What&apos;s Included
          </h4>
          <ul className="space-y-2">
            {pkg.inclusions.slice(0, 4).map((inclusion, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-slate-800">
                <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                <span>{inclusion}</span>
              </li>
            ))}
            {pkg.inclusions.length > 4 && (
              <li className="text-sm text-mint-600 font-medium">
                +{pkg.inclusions.length - 4} more inclusions
              </li>
            )}
          </ul>
        </div>

        {/* Add-ons (if enabled) */}
        {showAddons && pkg.addons.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-navy-600 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-gold" />
              Available Add-ons
            </h4>
            <div className="space-y-2">
              {pkg.addons.slice(0, 3).map((addon, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-slate-800">{addon.name}</span>
                  <span className="font-medium text-navy-600">
                    ${addon.priceUSD}
                    {addon.per && <span className="text-xs text-slate-700">/{addon.per}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Package Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2 text-slate-800">
            <Clock className="w-4 h-4" />
            <span>Valid for 14 days</span>
          </div>
          <div className="flex items-center gap-2 text-slate-800">
            <Users className="w-4 h-4" />
            <span>1 companion</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
          isFeatured
            ? 'bg-mint-500 hover:bg-mint-600 text-navy-600'
            : 'bg-navy-600 hover:bg-sky text-white'
        }`}>
          {isFeatured ? 'Get Started' : 'View Details'}
        </button>

        {/* Refund Policy */}
        <div className="mt-4 text-xs text-slate-700 text-center">
          {pkg.refundPolicy}
        </div>
      </div>
    </div>
  );
}
