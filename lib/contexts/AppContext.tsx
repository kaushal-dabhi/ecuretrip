'use client'

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppSettingsStore } from '../store';

interface AppContextType {
  currency: string;
  language: string;
  isRTL: boolean;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  t: (key: string, params?: Record<string, string>) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Translation function
const translations: Record<string, Record<string, string>> = {
  en: {
    'nav.intake': 'Intake',
    'nav.treatments': 'Treatments',
    'nav.doctors': 'Doctors',
    'nav.hospitals': 'Hospitals',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.signIn': 'Sign In',
    'nav.getStarted': 'Get Started',
    'hero.title': 'Find trusted doctors & hospitals in India',
    'hero.subtitle': 'Search, compare and book the right care with confidence.',
    'hero.searchPlaceholder': 'Search for treatments, doctors, hospitals…',
    'hero.searchButton': 'Search',
    'demo.toggle': 'Demo',
    'demo.escrow': 'Escrow',
    'demo.quote': 'Quote',
    'demo.case': 'Case',
    'footer.company': 'eCureTrip',
    'footer.description': 'Your trusted partner in medical tourism. Connect with world-class healthcare providers and experience medical excellence with comprehensive support throughout your journey.',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.policies': 'Policies',
    'footer.contact': 'Contact',
    'footer.about': 'About Us',
    'footer.treatments': 'Treatments',
    'footer.findDoctors': 'Find Doctors',
    'footer.partnerHospitals': 'Partner Hospitals',
    'footer.cardiology': 'Cardiology',
    'footer.orthopedics': 'Orthopedics',
    'footer.neurology': 'Neurology',
    'footer.oncology': 'Oncology',
    'footer.dental': 'Dental',
    'footer.ivf': 'IVF',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.cookies': 'Cookie Policy',
    'footer.refund': 'Refund Policy',
    'footer.shipping': 'Shipping Policy',
    'footer.copyright': '© 2024 eCureTrip. All rights reserved.',
  },
  ar: {
    'nav.intake': 'الاستقبال',
    'nav.treatments': 'العلاجات',
    'nav.doctors': 'الأطباء',
    'nav.hospitals': 'المستشفيات',
    'nav.about': 'حول',
    'nav.contact': 'اتصل بنا',
    'nav.signIn': 'تسجيل الدخول',
    'nav.getStarted': 'ابدأ الآن',
    'hero.title': 'ابحث عن أطباء ومستشفيات موثوقة في الهند',
    'hero.subtitle': 'ابحث وقارن واحجز الرعاية المناسبة بثقة.',
    'hero.searchPlaceholder': 'ابحث عن علاجات أو أطباء أو مستشفيات...',
    'hero.searchButton': 'بحث',
    'demo.toggle': 'تجريبي',
    'demo.escrow': 'الضمان',
    'demo.quote': 'عرض السعر',
    'demo.case': 'الحالة',
    'footer.company': 'إي كيور تريب',
    'footer.description': 'شريكك الموثوق في السياحة الطبية. تواصل مع مقدمي الرعاية الصحية من الطراز العالمي واختبر التميز الطبي مع الدعم الشامل طوال رحلتك.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.services': 'الخدمات',
    'footer.policies': 'السياسات',
    'footer.contact': 'اتصل بنا',
    'footer.about': 'من نحن',
    'footer.treatments': 'العلاجات',
    'footer.findDoctors': 'ابحث عن الأطباء',
    'footer.partnerHospitals': 'المستشفيات الشريكة',
    'footer.cardiology': 'أمراض القلب',
    'footer.orthopedics': 'جراحة العظام',
    'footer.neurology': 'أمراض الأعصاب',
    'footer.oncology': 'علم الأورام',
    'footer.dental': 'طب الأسنان',
    'footer.ivf': 'أطفال الأنابيب',
    'footer.terms': 'شروط الخدمة',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.cookies': 'سياسة ملفات تعريف الارتباط',
    'footer.refund': 'سياسة الاسترداد',
    'footer.shipping': 'سياسة الشحن',
    'footer.copyright': '© 2024 إي كيور تريب. جميع الحقوق محفوظة.',
  },
  sw: {
    'nav.intake': 'Uingizaji',
    'nav.treatments': 'Matibabu',
    'nav.doctors': 'Madaktari',
    'nav.hospitals': 'Hospitali',
    'nav.about': 'Kuhusu',
    'nav.contact': 'Wasiliana',
    'nav.signIn': 'Ingia',
    'nav.getStarted': 'Anza',
    'hero.title': 'Pata madaktari na hospitali za kuaminika nchini India',
    'hero.subtitle': 'Tafuta, linganisha na ununue huduma sahihi kwa ujasiri.',
    'hero.searchPlaceholder': 'Tafuta matibabu, madaktari, hospitali...',
    'hero.searchButton': 'Tafuta',
    'demo.toggle': 'Demo',
    'demo.escrow': 'Escrow',
    'demo.quote': 'Bei',
    'demo.case': 'Kesi',
    'footer.company': 'eCureTrip',
    'footer.description': 'Mshirika wako wa kuaminika katika utalii wa matibabu. Unganisha na watoa huduma za afya wa daraja la dunia na uzoefu uzoefu wa matibabu bora na msaada kamili katika safari yako.',
    'footer.quickLinks': 'Viungo vya Haraka',
    'footer.services': 'Huduma',
    'footer.policies': 'Sera',
    'footer.contact': 'Wasiliana',
    'footer.about': 'Kuhusu Sisi',
    'footer.treatments': 'Matibabu',
    'footer.findDoctors': 'Pata Madaktari',
    'footer.partnerHospitals': 'Hospitali za Washirika',
    'footer.cardiology': 'Kardiolojia',
    'footer.orthopedics': 'Orthopedics',
    'footer.neurology': 'Neurolojia',
    'footer.oncology': 'Onkolojia',
    'footer.dental': 'Dental',
    'footer.ivf': 'IVF',
    'footer.terms': 'Sheria za Huduma',
    'footer.privacy': 'Sera ya Faragha',
    'footer.cookies': 'Sera ya Cookies',
    'footer.refund': 'Sera ya Kurudisha',
    'footer.shipping': 'Sera ya Usambazaji',
    'footer.copyright': '© 2024 eCureTrip. Haki zote zimehifadhiwa.',
  }
};

// Currency conversion rates (simplified - in real app, these would come from an API)
const currencyRates: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  INR: 74.5,
  AED: 3.67,
  SAR: 3.75,
  NGN: 411.5,
  KES: 110.5
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { currency, language, isRTL, setCurrency, setLanguage, setIsRTL } = useAppSettingsStore();

  // Update document direction when language changes
  useEffect(() => {
    const isRTL = language === 'ar';
    setIsRTL(isRTL);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, setIsRTL]);

  // Format currency based on selected currency
  const formatCurrency = (amount: number, currencyCode?: string): string => {
    const targetCurrency = currencyCode || currency;
    const rate = currencyRates[targetCurrency] || 1;
    const convertedAmount = amount * rate;
    
    const formatters: Record<string, Intl.NumberFormat> = {
      USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
      GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
      INR: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
      AED: new Intl.NumberFormat('ar-AE', { style: 'currency', currency: 'AED' }),
      SAR: new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }),
      NGN: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }),
      KES: new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' })
    };

    const formatter = formatters[targetCurrency];
    if (formatter) {
      return formatter.format(convertedAmount);
    }

    // Fallback formatting
    return `${targetCurrency} ${convertedAmount.toFixed(2)}`;
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[language]?.[key] || translations['en'][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value);
      });
    }
    
    return translation;
  };

  const value: AppContextType = {
    currency,
    language,
    isRTL,
    setCurrency,
    setLanguage,
    formatCurrency,
    t
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
