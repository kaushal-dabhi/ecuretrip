import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Case, Quote, Escrow, ProcedureSKU } from './types';
import { IntakeFormData } from './validators';

// Case store for managing patient cases
interface CaseStore {
  case?: Case;
  setCase: (caseData: Case) => void;
  setStatus: (status: Case['status']) => void;
  addDocument: (document: string) => void;
  addEvent: (event: { at: string; event: string }) => void;
  clearCase: () => void;
}

export const useCaseStore = create<CaseStore>((set, get) => ({
  case: undefined,
  setCase: (caseData) => set({ case: caseData }),
  setStatus: (status) => {
    const currentCase = get().case;
    if (currentCase) {
      set({
        case: {
          ...currentCase,
          status,
          timeline: [
            ...currentCase.timeline,
            { at: new Date().toISOString(), event: `Status changed to ${status}` }
          ]
        }
      });
    }
  },
  addDocument: (document) => {
    const currentCase = get().case;
    if (currentCase) {
      set({
        case: {
          ...currentCase,
          documents: [...currentCase.documents, document]
        }
      });
    }
  },
  addEvent: (event) => {
    const currentCase = get().case;
    if (currentCase) {
      set({
        case: {
          ...currentCase,
          timeline: [...currentCase.timeline, event]
        }
      });
    }
  },
  clearCase: () => set({ case: undefined })
}));

// Quote store for managing quotes and add-ons
interface QuoteStore {
  quote?: Quote;
  setQuote: (quote: Quote) => void;
  lock: () => void;
  addAddon: (addon: string) => void;
  removeAddon: (addon: string) => void;
  clearQuote: () => void;
}

export const useQuoteStore = create<QuoteStore>((set, get) => ({
  quote: undefined,
  setQuote: (quote) => set({ quote }),
  lock: () => {
    const currentQuote = get().quote;
    if (currentQuote) {
      set({
        quote: {
          ...currentQuote,
          locked: true
        }
      });
    }
  },
  addAddon: (addon) => {
    const currentQuote = get().quote;
    if (currentQuote && !currentQuote.addons.includes(addon)) {
      set({
        quote: {
          ...currentQuote,
          addons: [...currentQuote.addons, addon]
        }
      });
    }
  },
  removeAddon: (addon) => {
    const currentQuote = get().quote;
    if (currentQuote) {
      set({
        quote: {
          ...currentQuote,
          addons: currentQuote.addons.filter(a => a !== addon)
        }
      });
    }
  },
  clearQuote: () => set({ quote: undefined })
}));

// Escrow store for managing escrow transactions
interface EscrowStore {
  escrow?: Escrow;
  setEscrow: (escrow: Escrow) => void;
  updateMilestoneStatus: (milestoneName: string, status: 'pending' | 'completed' | 'failed') => void;
  clearEscrow: () => void;
}

export const useEscrowStore = create<EscrowStore>((set, get) => ({
  escrow: undefined,
  setEscrow: (escrow) => set({ escrow }),
  updateMilestoneStatus: (milestoneName, status) => {
    const currentEscrow = get().escrow;
    if (currentEscrow) {
      set({
        escrow: {
          ...currentEscrow,
          milestones: currentEscrow.milestones.map(milestone =>
            milestone.name === milestoneName
              ? { ...milestone, status }
              : milestone
          )
        }
      });
    }
  },
  clearEscrow: () => set({ escrow: undefined })
}));

// Intake store for managing intake form data
interface IntakeStore {
  formData: Partial<IntakeFormData>;
  currentStep: number;
  setFormData: (data: Partial<IntakeFormData>) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useIntakeStore = create<IntakeStore>((set) => ({
  formData: {},
  currentStep: 0,
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
  reset: () => set({ formData: {}, currentStep: 0 })
}));

// User preferences store
interface UserStore {
  locale: 'en' | 'ar' | 'sw';
  setLocale: (locale: 'en' | 'ar' | 'sw') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
      theme: 'light',
      setTheme: (theme) => set({ theme })
    }),
    { name: "ecuretrip-user" }
  )
);

// App settings store for global configuration
interface AppSettingsStore {
  currency: string;
  setCurrency: (currency: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  isRTL: boolean;
  setIsRTL: (isRTL: boolean) => void;
}

export const useAppSettingsStore = create<AppSettingsStore>()(
  persist(
    (set) => ({
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
      language: 'en',
      setLanguage: (language) => set({ language }),
      isRTL: false,
      setIsRTL: (isRTL) => set({ isRTL })
    }),
    { name: "ecuretrip-app-settings" }
  )
);

// Demo store for managing demo mode and demo data
interface DemoStore {
  enabled: boolean;
  setEnabled: (on: boolean) => void;
  lastQuoteId?: string;
  lastEscrowId?: string;
  lastCaseId?: string;
  setLastQuote: (id?: string) => void;
  setLastEscrow: (id?: string) => void;
  setLastCase: (id?: string) => void;
  // demo data
  demoPatient: {
    name: string; 
    country: string; 
    phone: string; 
    locale: "en"|"ar"|"sw";
    procedure: ProcedureSKU; 
    budgetUSD: number; 
    language: string; 
    comorbidities: string[];
  };
  seedPatient: () => void;
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set) => ({
      enabled: false,
      setEnabled: (on) => set({ enabled: on }),
      lastQuoteId: undefined,
      lastEscrowId: undefined,
      lastCaseId: undefined,
      setLastQuote: (id) => set({ lastQuoteId: id }),
      setLastEscrow: (id) => set({ lastEscrowId: id }),
      setLastCase: (id) => set({ lastCaseId: id }),
      demoPatient: {
        name: "Mohammed Ali",
        country: "UAE",
        phone: "+971500000000",
        locale: "en",
        procedure: "TKR_STANDARD",
        budgetUSD: 6000,
        language: "English",
        comorbidities: ["Diabetes"]
      },
      seedPatient: () => set({
        demoPatient: {
          name: "Mohammed Ali",
          country: "UAE",
          phone: "+971500000000",
          locale: "en",
          procedure: "TKR_STANDARD",
          budgetUSD: 6000,
          language: "English",
          comorbidities: ["Diabetes"]
        }
      })
    }),
    { name: "ecuretrip-demo" }
  )
);

