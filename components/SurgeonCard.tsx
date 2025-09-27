import { Surgeon } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Users, Languages, Award } from 'lucide-react';
import Link from 'next/link';

interface SurgeonCardProps {
  surgeon: Surgeon;
  showWhyMatched?: boolean;
  whyMatched?: string[];
}

export default function SurgeonCard({ 
  surgeon, 
  showWhyMatched = false, 
  whyMatched = [] 
}: SurgeonCardProps) {

  
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-g200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-navy-600 mb-1">
              {surgeon.name}
            </h3>
            <p className="text-g600 text-sm mb-2">{surgeon.specialty}</p>
            
            {/* Stats row */}
            <div className="flex items-center gap-4 text-sm text-g600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{surgeon.casesPerYear}+ cases/year</span>
              </div>
              <div className="flex items-center gap-1">
                <Languages className="w-4 h-4" />
                <span>{surgeon.languages.join(', ')}</span>
              </div>
            </div>
          </div>
          
          {/* Avatar placeholder */}
          <div className="w-16 h-16 bg-mint-400 rounded-full flex items-center justify-center text-white text-xl font-bold ml-4">
            {surgeon.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>

        {/* Training */}
        {surgeon.training.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-g700">Training</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {surgeon.training.map((training, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-mint-100 text-mint-700 text-xs rounded-full"
                >
                  {training}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Outcomes */}
        {surgeon.outcomes && (
          <div className="mb-4 p-3 bg-g50 rounded-lg">
            <div className="text-sm font-medium text-g700 mb-2">
              {surgeon.outcomes.instrument} Outcomes
            </div>
            <div className="flex gap-4 text-sm">
              {surgeon.outcomes.D30 && (
                <div>
                  <span className="text-g600">D30:</span>
                  <span className="font-medium text-navy-600 ml-1">
                    {surgeon.outcomes.D30}
                  </span>
                </div>
              )}
              {surgeon.outcomes.D90 && (
                <div>
                  <span className="text-g600">D90:</span>
                  <span className="font-medium text-navy-600 ml-1">
                    {surgeon.outcomes.D90}
                  </span>
                </div>
              )}
              {surgeon.outcomes.n && (
                <div>
                  <span className="text-g600">n:</span>
                  <span className="font-medium text-navy-600 ml-1">
                    {surgeon.outcomes.n}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Why Matched */}
        {showWhyMatched && whyMatched.length > 0 && (
          <div className="mb-4 p-3 bg-sky-50 rounded-lg border border-sky-200">
            <div className="text-sm font-medium text-sky-700 mb-2">
              Why Matched
            </div>
            <div className="space-y-1">
              {whyMatched.map((reason, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-sky-600">
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facilities & Pricing */}
        <div className="mb-4">
          <div className="text-sm font-medium text-g700 mb-2">Available at:</div>
          <div className="space-y-2">
            {surgeon.facilities.map((facility, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-g50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-g600" />
                  <span className="text-sm text-g700">
                    {facility.name}, {facility.city}
                  </span>
                </div>
                <span className="text-sm font-semibold text-navy-600">
                  {formatCurrency(facility.priceUSD)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Comorbidities */}
        {surgeon.acceptsComorbidities && surgeon.acceptsComorbidities.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-g700 mb-2">
              Accepts patients with:
            </div>
            <div className="flex flex-wrap gap-1">
              {surgeon.acceptsComorbidities.map((comorbidity, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                >
                  {comorbidity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-3">
          <Link
            href={`/surgeons/${surgeon.slug}`}
            className="flex-1 bg-navy-600 hover:bg-sky text-white text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            View Profile
          </Link>
          <button className="flex-1 bg-mint-400 hover:bg-mint-500 text-navy-600 text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200">
            Book Tele-consult
          </button>
        </div>
      </div>
    </div>
  );
}
