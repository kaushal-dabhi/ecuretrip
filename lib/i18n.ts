// Internationalization support for eCureTrip
// Supporting English, Swahili, and French for East African market

export type Language = 'en' | 'sw' | 'fr'

export interface Translations {
  // Navigation
  nav: {
    home: string
    intake: string
    treatments: string
    doctors: string
    hospitals: string
    about: string
    contact: string
    signIn: string
    getStarted: string
  }
  
  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    view: string
    search: string
    filter: string
    sort: string
    next: string
    previous: string
    submit: string
    back: string
    close: string
    yes: string
    no: string
  }
  
  // Authentication
  auth: {
    signIn: string
    signUp: string
    signOut: string
    email: string
    password: string
    confirmPassword: string
    forgotPassword: string
    resetPassword: string
    createAccount: string
    alreadyHaveAccount: string
    dontHaveAccount: string
    rememberMe: string
  }
  
  // Patient Registration
  patient: {
    registration: string
    fullName: string
    phone: string
    dateOfBirth: string
    gender: string
    nationality: string
    emergencyContact: string
    emergencyContactPhone: string
    medicalConditions: string
    allergies: string
    currentMedications: string
    preferredLanguage: string
    male: string
    female: string
    other: string
  }
  
  // Appointments
  appointment: {
    bookAppointment: string
    selectDoctor: string
    selectDate: string
    selectTime: string
    appointmentType: string
    symptoms: string
    medicalHistory: string
    additionalNotes: string
    consultation: string
    followUp: string
    emergency: string
    surgery: string
    confirmed: string
    pending: string
    cancelled: string
    completed: string
    rescheduled: string
  }
  
  // Payments
  payment: {
    paymentMethod: string
    creditCard: string
    mpesa: string
    mobileMoney: string
    bankTransfer: string
    amount: string
    processingFee: string
    totalAmount: string
    paymentSuccessful: string
    paymentFailed: string
    refund: string
  }
  
  // Notifications
  notification: {
    appointmentConfirmed: string
    paymentConfirmed: string
    appointmentReminder: string
    appointmentCancelled: string
    emergencyContact: string
  }
  
  // Admin
  admin: {
    dashboard: string
    managePatients: string
    manageDoctors: string
    viewAppointments: string
    viewPayments: string
    totalPatients: string
    totalDoctors: string
    totalAppointments: string
    totalRevenue: string
    recentActivity: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      intake: 'Intake',
      treatments: 'Treatments',
      doctors: 'Doctors',
      hospitals: 'Hospitals',
      about: 'About',
      contact: 'Contact',
      signIn: 'Sign In',
      getStarted: 'Get Started'
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      back: 'Back',
      close: 'Close',
      yes: 'Yes',
      no: 'No'
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      rememberMe: 'Remember me'
    },
    patient: {
      registration: 'Patient Registration',
      fullName: 'Full Name',
      phone: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      nationality: 'Nationality',
      emergencyContact: 'Emergency Contact Name',
      emergencyContactPhone: 'Emergency Contact Phone',
      medicalConditions: 'Medical Conditions',
      allergies: 'Allergies',
      currentMedications: 'Current Medications',
      preferredLanguage: 'Preferred Language',
      male: 'Male',
      female: 'Female',
      other: 'Other'
    },
    appointment: {
      bookAppointment: 'Book Appointment',
      selectDoctor: 'Select Doctor',
      selectDate: 'Select Date',
      selectTime: 'Select Time Slot',
      appointmentType: 'Appointment Type',
      symptoms: 'Symptoms / Reason for Visit',
      medicalHistory: 'Medical History',
      additionalNotes: 'Additional Notes',
      consultation: 'Initial Consultation',
      followUp: 'Follow-up Visit',
      emergency: 'Emergency Consultation',
      surgery: 'Surgery Consultation',
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      completed: 'Completed',
      rescheduled: 'Rescheduled'
    },
    payment: {
      paymentMethod: 'Payment Method',
      creditCard: 'Credit/Debit Card',
      mpesa: 'M-Pesa',
      mobileMoney: 'Mobile Money',
      bankTransfer: 'Bank Transfer',
      amount: 'Amount',
      processingFee: 'Processing Fee',
      totalAmount: 'Total Amount',
      paymentSuccessful: 'Payment Successful',
      paymentFailed: 'Payment Failed',
      refund: 'Refund'
    },
    notification: {
      appointmentConfirmed: 'Appointment Confirmed',
      paymentConfirmed: 'Payment Confirmed',
      appointmentReminder: 'Appointment Reminder',
      appointmentCancelled: 'Appointment Cancelled',
      emergencyContact: 'Emergency Contact'
    },
    admin: {
      dashboard: 'Admin Dashboard',
      managePatients: 'Manage Patients',
      manageDoctors: 'Manage Doctors',
      viewAppointments: 'View Appointments',
      viewPayments: 'View Payments',
      totalPatients: 'Total Patients',
      totalDoctors: 'Total Doctors',
      totalAppointments: 'Total Appointments',
      totalRevenue: 'Total Revenue',
      recentActivity: 'Recent Activity'
    }
  },
  
  sw: {
    nav: {
      home: 'Nyumbani',
      intake: 'Kujisajili',
      treatments: 'Matibabu',
      doctors: 'Madaktari',
      hospitals: 'Hospitali',
      about: 'Kuhusu',
      contact: 'Mawasiliano',
      signIn: 'Ingia',
      getStarted: 'Anza'
    },
    common: {
      loading: 'Inapakia...',
      error: 'Hitilafu',
      success: 'Imefanikiwa',
      cancel: 'Ghairi',
      save: 'Hifadhi',
      delete: 'Futa',
      edit: 'Hariri',
      view: 'Ona',
      search: 'Tafuta',
      filter: 'Chuja',
      sort: 'Panga',
      next: 'Ifuatayo',
      previous: 'Iliyotangulia',
      submit: 'Wasilisha',
      back: 'Rudi',
      close: 'Funga',
      yes: 'Ndiyo',
      no: 'Hapana'
    },
    auth: {
      signIn: 'Ingia',
      signUp: 'Jisajili',
      signOut: 'Ondoka',
      email: 'Barua pepe',
      password: 'Nywila',
      confirmPassword: 'Thibitisha Nywila',
      forgotPassword: 'Umesahau nywila?',
      resetPassword: 'Weka Nywila Mpya',
      createAccount: 'Unda Akaunti',
      alreadyHaveAccount: 'Una akaunti?',
      dontHaveAccount: 'Huna akaunti?',
      rememberMe: 'Nikumbuke'
    },
    patient: {
      registration: 'Usajili wa Mgonjwa',
      fullName: 'Jina Kamili',
      phone: 'Nambari ya Simu',
      dateOfBirth: 'Tarehe ya Kuzaliwa',
      gender: 'Jinsia',
      nationality: 'Uraia',
      emergencyContact: 'Jina la Muhusika wa Dharura',
      emergencyContactPhone: 'Simu ya Muhusika wa Dharura',
      medicalConditions: 'Hali za Kiafya',
      allergies: 'Vipasuo',
      currentMedications: 'Dawa za Sasa',
      preferredLanguage: 'Lugha ya Kupendelea',
      male: 'Mwanaume',
      female: 'Mwanamke',
      other: 'Nyingine'
    },
    appointment: {
      bookAppointment: 'Panga Miadi',
      selectDoctor: 'Chagua Daktari',
      selectDate: 'Chagua Tarehe',
      selectTime: 'Chagua Muda',
      appointmentType: 'Aina ya Miadi',
      symptoms: 'Dalili / Sababu ya Kutembelea',
      medicalHistory: 'Historia ya Kiafya',
      additionalNotes: 'Maelezo ya Ziada',
      consultation: 'Ushauri wa Kwanza',
      followUp: 'Zoezi la Kufuata',
      emergency: 'Ushauri wa Dharura',
      surgery: 'Ushauri wa Upasuaji',
      confirmed: 'Imethibitishwa',
      pending: 'Inasubiri',
      cancelled: 'Imefutwa',
      completed: 'Imeisha',
      rescheduled: 'Imepangwa Tena'
    },
    payment: {
      paymentMethod: 'Njia ya Malipo',
      creditCard: 'Kadi ya Mikopo',
      mpesa: 'M-Pesa',
      mobileMoney: 'Pesa za Simu',
      bankTransfer: 'Uhamisho wa Benki',
      amount: 'Kiasi',
      processingFee: 'Ada ya Utunzaji',
      totalAmount: 'Jumla ya Kiasi',
      paymentSuccessful: 'Malipo Yamefanikiwa',
      paymentFailed: 'Malipo Yameshindwa',
      refund: 'Rudisha Malipo'
    },
    notification: {
      appointmentConfirmed: 'Miadi Imethibitishwa',
      paymentConfirmed: 'Malipo Yamethibitishwa',
      appointmentReminder: 'Ukumbusho wa Miadi',
      appointmentCancelled: 'Miadi Imefutwa',
      emergencyContact: 'Mawasiliano ya Dharura'
    },
    admin: {
      dashboard: 'Dashibodi ya Msimamizi',
      managePatients: 'Simamia Wagonjwa',
      manageDoctors: 'Simamia Madaktari',
      viewAppointments: 'Ona Miadi',
      viewPayments: 'Ona Malipo',
      totalPatients: 'Jumla ya Wagonjwa',
      totalDoctors: 'Jumla ya Madaktari',
      totalAppointments: 'Jumla ya Miadi',
      totalRevenue: 'Mapato ya Jumla',
      recentActivity: 'Shughuli za Hivi Karibuni'
    }
  },
  
  fr: {
    nav: {
      home: 'Accueil',
      intake: 'Inscription',
      treatments: 'Traitements',
      doctors: 'Médecins',
      hospitals: 'Hôpitaux',
      about: 'À propos',
      contact: 'Contact',
      signIn: 'Se connecter',
      getStarted: 'Commencer'
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      next: 'Suivant',
      previous: 'Précédent',
      submit: 'Soumettre',
      back: 'Retour',
      close: 'Fermer',
      yes: 'Oui',
      no: 'Non'
    },
    auth: {
      signIn: 'Se connecter',
      signUp: "S'inscrire",
      signOut: 'Se déconnecter',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      forgotPassword: 'Mot de passe oublié?',
      resetPassword: 'Réinitialiser le mot de passe',
      createAccount: 'Créer un compte',
      alreadyHaveAccount: 'Vous avez déjà un compte?',
      dontHaveAccount: "Vous n'avez pas de compte?",
      rememberMe: 'Se souvenir de moi'
    },
    patient: {
      registration: 'Inscription du patient',
      fullName: 'Nom complet',
      phone: 'Numéro de téléphone',
      dateOfBirth: 'Date de naissance',
      gender: 'Genre',
      nationality: 'Nationalité',
      emergencyContact: 'Nom du contact d\'urgence',
      emergencyContactPhone: 'Téléphone du contact d\'urgence',
      medicalConditions: 'Conditions médicales',
      allergies: 'Allergies',
      currentMedications: 'Médicaments actuels',
      preferredLanguage: 'Langue préférée',
      male: 'Homme',
      female: 'Femme',
      other: 'Autre'
    },
    appointment: {
      bookAppointment: 'Prendre rendez-vous',
      selectDoctor: 'Sélectionner un médecin',
      selectDate: 'Sélectionner une date',
      selectTime: 'Sélectionner un créneau',
      appointmentType: 'Type de rendez-vous',
      symptoms: 'Symptômes / Raison de la visite',
      medicalHistory: 'Antécédents médicaux',
      additionalNotes: 'Notes supplémentaires',
      consultation: 'Consultation initiale',
      followUp: 'Visite de suivi',
      emergency: 'Consultation d\'urgence',
      surgery: 'Consultation chirurgicale',
      confirmed: 'Confirmé',
      pending: 'En attente',
      cancelled: 'Annulé',
      completed: 'Terminé',
      rescheduled: 'Reprogrammé'
    },
    payment: {
      paymentMethod: 'Méthode de paiement',
      creditCard: 'Carte de crédit/débit',
      mpesa: 'M-Pesa',
      mobileMoney: 'Mobile Money',
      bankTransfer: 'Virement bancaire',
      amount: 'Montant',
      processingFee: 'Frais de traitement',
      totalAmount: 'Montant total',
      paymentSuccessful: 'Paiement réussi',
      paymentFailed: 'Paiement échoué',
      refund: 'Remboursement'
    },
    notification: {
      appointmentConfirmed: 'Rendez-vous confirmé',
      paymentConfirmed: 'Paiement confirmé',
      appointmentReminder: 'Rappel de rendez-vous',
      appointmentCancelled: 'Rendez-vous annulé',
      emergencyContact: 'Contact d\'urgence'
    },
    admin: {
      dashboard: 'Tableau de bord administrateur',
      managePatients: 'Gérer les patients',
      manageDoctors: 'Gérer les médecins',
      viewAppointments: 'Voir les rendez-vous',
      viewPayments: 'Voir les paiements',
      totalPatients: 'Total des patients',
      totalDoctors: 'Total des médecins',
      totalAppointments: 'Total des rendez-vous',
      totalRevenue: 'Revenus totaux',
      recentActivity: 'Activité récente'
    }
  }
}

// Language context and hooks
import { createContext, useContext, useState, useEffect } from 'react'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  
  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('ecuretrip-language') as Language
    if (savedLanguage && ['en', 'sw', 'fr'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])
  
  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ecuretrip-language', language)
  }, [language])
  
  const t = translations[language]
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Utility function to get user's preferred language based on browser settings
export function getUserPreferredLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  
  const browserLang = navigator.language.toLowerCase()
  
  if (browserLang.startsWith('sw')) return 'sw'
  if (browserLang.startsWith('fr')) return 'fr'
  
  return 'en'
}

// Format currency based on language
export function formatCurrencyByLanguage(
  amount: number,
  language: Language,
  currency: string = 'USD'
): string {
  const locales: Record<Language, string> = {
    en: 'en-US',
    sw: 'sw-KE',
    fr: 'fr-FR'
  }
  
  return new Intl.NumberFormat(locales[language], {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount)
}

// Format date based on language
export function formatDateByLanguage(
  date: Date,
  language: Language
): string {
  const locales: Record<Language, string> = {
    en: 'en-US',
    sw: 'sw-KE',
    fr: 'fr-FR'
  }
  
  return new Intl.DateTimeFormat(locales[language], {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
