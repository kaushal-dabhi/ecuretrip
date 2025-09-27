'use client'

import { useState, useRef, useEffect } from 'react';
import { useAppSettingsStore } from '@/lib/store';
import { SUPPORTED_LOCALES, LOCALE_METADATA } from '@/lib/i18n/config';
import { ChevronDown, Globe } from 'lucide-react';

export default function LangSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useAppSettingsStore();
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

  const handleLocaleChange = (newLocale: string) => {
    setLanguage(newLocale);
    setIsOpen(false);
  };

  const currentLocale = LOCALE_METADATA[language as keyof typeof LOCALE_METADATA] || LOCALE_METADATA.en;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-navy-600 hover:text-navy-500 transition-colors duration-200 rounded hover:bg-white/50"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{currentLocale.flag}</span>
        <span className="hidden md:inline text-xs">{currentLocale.nativeName}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-g200 py-2 z-[110] overflow-hidden min-w-max">
          {SUPPORTED_LOCALES.map((loc) => {
            const localeData = LOCALE_METADATA[loc];
            const isSelected = loc === language;
            
            return (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs transition-colors duration-200 ${
                  isSelected
                    ? 'bg-mint-50 text-mint-700 font-medium'
                    : 'text-g700 hover:bg-g50 hover:text-navy-600'
                }`}
              >
                <span className="text-base">{localeData.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{localeData.nativeName}</div>
                  <div className="text-xs text-g500">{localeData.name}</div>
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

