import { NextRequest, NextResponse } from 'next/server';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', rtl: false },
  ar: { name: 'العربية', flag: '🇸🇦', rtl: true },
  fr: { name: 'Français', flag: '🇫🇷', rtl: false },
  es: { name: 'Español', flag: '🇪🇸', rtl: false },
  hi: { name: 'हिन्दी', flag: '🇮🇳', rtl: false },
  ur: { name: 'اردو', flag: '🇵🇰', rtl: true }
};

// Translation keys
export const TRANSLATIONS = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    cases: 'Oncology Cases',
    patients: 'Patients',
    doctors: 'Doctors',
    fhir: 'FHIR Resources',
    ocr: 'Document Processing',
    settings: 'Settings',
    analytics: 'Analytics',

    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',

    // Case Management
    caseNumber: 'Case Number',
    patientName: 'Patient Name',
    tumorType: 'Tumor Type',
    status: 'Status',
    priority: 'Priority',
    doctor: 'Doctor',
    estimatedCost: 'Estimated Cost',
    intakeDate: 'Intake Date',
    newCase: 'New Case',
    caseDetails: 'Case Details',
    caseHistory: 'Case History',
    milestones: 'Milestones',
    attachments: 'Attachments',
    tumorBoard: 'Tumor Board Review',

    // Status
    intake: 'Intake',
    review: 'Review',
    assigned: 'Assigned',
    inProgress: 'In Progress',
    tumorBoardReview: 'Tumor Board Review',
    treatmentPlanning: 'Treatment Planning',
    treatmentInProgress: 'Treatment In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',

    // Priority
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',

    // Actions
    assignDoctor: 'Assign Doctor',
    scheduleConsultation: 'Schedule Consultation',
    uploadDocuments: 'Upload Documents',
    createMilestone: 'Create Milestone',
    updateStatus: 'Update Status',

    // Messages
    caseCreated: 'Case created successfully',
    caseUpdated: 'Case updated successfully',
    caseDeleted: 'Case deleted successfully',
    doctorAssigned: 'Doctor assigned successfully',
    milestoneCreated: 'Milestone created successfully',

    // Analytics
    totalCases: 'Total Cases',
    activeCases: 'Active Cases',
    completedCases: 'Completed Cases',
    totalRevenue: 'Total Revenue',
    averageDuration: 'Average Duration',
    completionRate: 'Completion Rate',
    satisfactionScore: 'Satisfaction Score',

    // Notifications
    caseUpdate: 'Case Update',
    milestoneDue: 'Milestone Due',
    consultationScheduled: 'Consultation Scheduled',
    documentUploaded: 'Document Uploaded',

    // Errors
    caseNotFound: 'Case not found',
    doctorNotFound: 'Doctor not found',
    patientNotFound: 'Patient not found',
    uploadFailed: 'Upload failed',
    saveFailed: 'Save failed',
    deleteFailed: 'Delete failed'
  },

  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    cases: 'حالات الأورام',
    patients: 'المرضى',
    doctors: 'الأطباء',
    fhir: 'موارد FHIR',
    ocr: 'معالجة المستندات',
    settings: 'الإعدادات',
    analytics: 'التحليلات',

    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    view: 'عرض',
    add: 'إضافة',
    search: 'بحث',
    filter: 'تصفية',
    clear: 'مسح',
    submit: 'إرسال',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',

    // Case Management
    caseNumber: 'رقم الحالة',
    patientName: 'اسم المريض',
    tumorType: 'نوع الورم',
    status: 'الحالة',
    priority: 'الأولوية',
    doctor: 'الطبيب',
    estimatedCost: 'التكلفة المقدرة',
    intakeDate: 'تاريخ الاستقبال',
    newCase: 'حالة جديدة',
    caseDetails: 'تفاصيل الحالة',
    caseHistory: 'تاريخ الحالة',
    milestones: 'المراحل',
    attachments: 'المرفقات',
    tumorBoard: 'مراجعة مجلس الأورام',

    // Status
    intake: 'استقبال',
    review: 'مراجعة',
    assigned: 'مُعين',
    inProgress: 'قيد التنفيذ',
    tumorBoardReview: 'مراجعة مجلس الأورام',
    treatmentPlanning: 'تخطيط العلاج',
    treatmentInProgress: 'العلاج قيد التنفيذ',
    completed: 'مكتمل',
    cancelled: 'ملغي',

    // Priority
    low: 'منخفض',
    medium: 'متوسط',
    high: 'عالي',
    urgent: 'عاجل',

    // Actions
    assignDoctor: 'تعيين طبيب',
    scheduleConsultation: 'جدولة استشارة',
    uploadDocuments: 'رفع المستندات',
    createMilestone: 'إنشاء مرحلة',
    updateStatus: 'تحديث الحالة',

    // Messages
    caseCreated: 'تم إنشاء الحالة بنجاح',
    caseUpdated: 'تم تحديث الحالة بنجاح',
    caseDeleted: 'تم حذف الحالة بنجاح',
    doctorAssigned: 'تم تعيين الطبيب بنجاح',
    milestoneCreated: 'تم إنشاء المرحلة بنجاح',

    // Analytics
    totalCases: 'إجمالي الحالات',
    activeCases: 'الحالات النشطة',
    completedCases: 'الحالات المكتملة',
    totalRevenue: 'إجمالي الإيرادات',
    averageDuration: 'متوسط المدة',
    completionRate: 'معدل الإكمال',
    satisfactionScore: 'درجة الرضا',

    // Notifications
    caseUpdate: 'تحديث الحالة',
    milestoneDue: 'المرحلة مستحقة',
    consultationScheduled: 'تم جدولة الاستشارة',
    documentUploaded: 'تم رفع المستند',

    // Errors
    caseNotFound: 'الحالة غير موجودة',
    doctorNotFound: 'الطبيب غير موجود',
    patientNotFound: 'المريض غير موجود',
    uploadFailed: 'فشل الرفع',
    saveFailed: 'فشل الحفظ',
    deleteFailed: 'فشل الحذف'
  },

  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    cases: 'Cas d\'oncologie',
    patients: 'Patients',
    doctors: 'Médecins',
    fhir: 'Ressources FHIR',
    ocr: 'Traitement de documents',
    settings: 'Paramètres',
    analytics: 'Analyses',

    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    view: 'Voir',
    add: 'Ajouter',
    search: 'Rechercher',
    filter: 'Filtrer',
    clear: 'Effacer',
    submit: 'Soumettre',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',

    // Case Management
    caseNumber: 'Numéro de cas',
    patientName: 'Nom du patient',
    tumorType: 'Type de tumeur',
    status: 'Statut',
    priority: 'Priorité',
    doctor: 'Médecin',
    estimatedCost: 'Coût estimé',
    intakeDate: 'Date d\'admission',
    newCase: 'Nouveau cas',
    caseDetails: 'Détails du cas',
    caseHistory: 'Historique du cas',
    milestones: 'Étapes',
    attachments: 'Pièces jointes',
    tumorBoard: 'Révision du conseil tumoral',

    // Status
    intake: 'Admission',
    review: 'Révision',
    assigned: 'Assigné',
    inProgress: 'En cours',
    tumorBoardReview: 'Révision du conseil tumoral',
    treatmentPlanning: 'Planification du traitement',
    treatmentInProgress: 'Traitement en cours',
    completed: 'Terminé',
    cancelled: 'Annulé',

    // Priority
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    urgent: 'Urgent',

    // Actions
    assignDoctor: 'Assigner un médecin',
    scheduleConsultation: 'Programmer une consultation',
    uploadDocuments: 'Télécharger des documents',
    createMilestone: 'Créer une étape',
    updateStatus: 'Mettre à jour le statut',

    // Messages
    caseCreated: 'Cas créé avec succès',
    caseUpdated: 'Cas mis à jour avec succès',
    caseDeleted: 'Cas supprimé avec succès',
    doctorAssigned: 'Médecin assigné avec succès',
    milestoneCreated: 'Étape créée avec succès',

    // Analytics
    totalCases: 'Total des cas',
    activeCases: 'Cas actifs',
    completedCases: 'Cas terminés',
    totalRevenue: 'Revenus totaux',
    averageDuration: 'Durée moyenne',
    completionRate: 'Taux de completion',
    satisfactionScore: 'Score de satisfaction',

    // Notifications
    caseUpdate: 'Mise à jour du cas',
    milestoneDue: 'Étape due',
    consultationScheduled: 'Consultation programmée',
    documentUploaded: 'Document téléchargé',

    // Errors
    caseNotFound: 'Cas non trouvé',
    doctorNotFound: 'Médecin non trouvé',
    patientNotFound: 'Patient non trouvé',
    uploadFailed: 'Échec du téléchargement',
    saveFailed: 'Échec de la sauvegarde',
    deleteFailed: 'Échec de la suppression'
  }
};

// Language detection middleware
export function detectLanguage(request: NextRequest): string {
  // Check for language in URL
  const pathname = request.nextUrl.pathname;
  const langMatch = pathname.match(/^\/([a-z]{2})\//);
  if (langMatch && SUPPORTED_LANGUAGES[langMatch[1] as keyof typeof SUPPORTED_LANGUAGES]) {
    return langMatch[1];
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLang = acceptLanguage.split(',')[0].split('-')[0];
    if (SUPPORTED_LANGUAGES[preferredLang as keyof typeof SUPPORTED_LANGUAGES]) {
      return preferredLang;
    }
  }

  // Default to English
  return 'en';
}

// Translation function
export function t(key: string, lang: string = 'en'): string {
  const translations = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  return translations[key as keyof typeof translations] || key;
}

// GET /api/i18n/translations - Get translations for a language
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    if (!SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      );
    }

    const translations = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

    return NextResponse.json({
      language: lang,
      translations,
      supportedLanguages: SUPPORTED_LANGUAGES
    });

  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}
