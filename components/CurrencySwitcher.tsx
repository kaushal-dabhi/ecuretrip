'use client'

import { useState, useRef, useEffect } from 'react';
import { useAppSettingsStore } from '@/lib/store';
import { ChevronDown, DollarSign } from 'lucide-react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' },
];

export default function CurrencySwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency } = useAppSettingsStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === currency) || SUPPORTED_CURRENCIES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-navy-600 hover:text-navy-500 transition-colors duration-200 rounded hover:bg-white/50"
        aria-label="Select currency"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <DollarSign className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{selectedCurrency.symbol}</span>
        <span className="hidden md:inline text-xs">{selectedCurrency.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-g200 py-2 z-[110] overflow-hidden min-w-max">
          {SUPPORTED_CURRENCIES.map((currencyOption) => {
            const isSelected = currencyOption.code === currency;
            
            return (
              <button
                key={currencyOption.code}
                onClick={() => handleCurrencyChange(currencyOption.code)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs transition-colors duration-200 ${
                  isSelected
                    ? 'bg-mint-50 text-mint-700 font-medium'
                    : 'text-g700 hover:bg-g50 hover:text-navy-600'
                }`}
              >
                <span className="text-base">{currencyOption.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{currencyOption.code}</div>
                  <div className="text-xs text-g500">{currencyOption.name}</div>
                </div>
                {isSelected && (
                  <div className="w-1.5 h-1.5 bg-mint-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
