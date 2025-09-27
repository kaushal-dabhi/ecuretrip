// i18n configuration for eCureTrip v1
// Supports English (en), Arabic (ar), and Swahili (sw)

export type Locale = 'en' | 'ar' | 'sw';

export const SUPPORTED_LOCALES: Locale[] = ['en', 'ar', 'sw'];

export const DEFAULT_LOCALE: Locale = 'en';

// Locale metadata
export const LOCALE_METADATA = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦'
  },
  sw: {
    name: 'Swahili',
    nativeName: 'Kiswahili',
    direction: 'ltr',
    flag: '🇹🇿'
  }
} as const;

// Basic dictionary loader (stub for now)
export const messages = {
  en: {
    common: {
      search: 'Search',
      filter: 'Filter',
      apply: 'Apply',
      clear: 'Clear',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      cancel: 'Cancel',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success'
    },
    navigation: {
      home: 'Home',
      treatments: 'Treatments',
      doctors: 'Doctors',
      hospitals: 'Hospitals',
      about: 'About',
      contact: 'Contact',
      signIn: 'Sign In',
      getStarted: 'Get Started'
    },
    medical: {
      procedure: 'Procedure',
      surgeon: 'Surgeon',
      hospital: 'Hospital',
      consultation: 'Consultation',
      surgery: 'Surgery',
      recovery: 'Recovery',
      price: 'Price',
      package: 'Package'
    }
  },
  ar: {
    common: {
      search: 'بحث',
      filter: 'تصفية',
      apply: 'تطبيق',
      clear: 'مسح',
      next: 'التالي',
      previous: 'السابق',
      submit: 'إرسال',
      cancel: 'إلغاء',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح'
    },
    navigation: {
      home: 'الرئيسية',
      treatments: 'العلاجات',
      doctors: 'الأطباء',
      hospitals: 'المستشفيات',
      about: 'حول',
      contact: 'اتصل بنا',
      signIn: 'تسجيل الدخول',
      getStarted: 'ابدأ الآن'
    },
    medical: {
      procedure: 'الإجراء',
      surgeon: 'الجراح',
      hospital: 'المستشفى',
      consultation: 'الاستشارة',
      surgery: 'الجراحة',
      recovery: 'الشفاء',
      price: 'السعر',
      package: 'الباقة'
    }
  },
  sw: {
    common: {
      search: 'Tafuta',
      filter: 'Chuja',
      apply: 'Tumia',
      clear: 'Futa',
      next: 'Ifuatayo',
      previous: 'Iliyotangulia',
      submit: 'Wasilisha',
      cancel: 'Ghairi',
      loading: 'Inapakia...',
      error: 'Hitilafu',
      success: 'Mafanikio'
    },
    navigation: {
      home: 'Nyumbani',
      treatments: 'Matibabu',
      doctors: 'Madaktari',
      hospitals: 'Hospitali',
      about: 'Kuhusu',
      contact: 'Wasiliana',
      signIn: 'Ingia',
      getStarted: 'Anza'
    },
    medical: {
      procedure: 'Utaratibu',
      surgeon: 'Daktari wa upasuaji',
      hospital: 'Hospitali',
      consultation: 'Mashauriano',
      surgery: 'Upasuaji',
      recovery: 'Kurejesha afya',
      price: 'Bei',
      package: 'Kifurushi'
    }
  }
};

// Get message by key and locale
export function getMessage(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: unknown = messages[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as any)[k];
    } else {
      // Fallback to English
      value = messages.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = (value as any)[fallbackKey];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Get locale direction
export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  return LOCALE_METADATA[locale].direction;
}

// Format number according to locale
export function formatNumber(locale: Locale, number: number): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : locale === 'sw' ? 'sw-TZ' : 'en-US').format(number);
}

// Format currency according to locale
export function formatCurrency(locale: Locale, amount: number, currency: string = 'USD'): string {
  const localeMap = {
    en: 'en-US',
    ar: 'ar-SA',
    sw: 'en-US' // Swahili typically uses English formatting
  };
  
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: currency
  }).format(amount);
}
