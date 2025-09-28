// Simple validation types without zod dependency

// Intake form data type
export interface IntakeFormData {
  demographics: {
    name: string;
    age?: number;
    country: string;
    email: string;
    phone?: string;
  };
  procedure?: {
    sku?: "TKR_STANDARD" | "THR_STANDARD" | "ACL_ARTHRO" | "IVF_CYCLE";
    budget?: string | number;
    preferredCity?: string;
  };
  reports?: string[];
  comorbidities?: string | string[];
  language?: string;
  communication?: {
    email?: boolean;
    phone?: boolean;
    whatsapp?: boolean;
  };
  consent?: boolean;
  marketing?: boolean;
}

// Match request type
export interface MatchRequest {
  procedureSku: "TKR_STANDARD" | "THR_STANDARD" | "ACL_ARTHRO" | "IVF_CYCLE";
  locale: "en" | "ar" | "sw";
  budget: number;
  comorbidities: string[];
  language: string;
}

// Quote request type
export interface QuoteRequest {
  patientId: string;
  surgeonSlug: string;
  packageSku: "TKR_STANDARD" | "THR_STANDARD" | "ACL_ARTHRO" | "IVF_CYCLE";
  addons: string[];
}

// Escrow request type
export interface EscrowRequest {
  quoteId: string;
  amountUSD: number;
}

// Visa letter request type
export interface VisaLetterRequest {
  caseId: string;
  patient: {
    name: string;
    passport: string;
    nationality: string;
  };
  hospital: {
    name: string;
    address: string;
  };
}

// Review submission type
export interface ReviewSubmission {
  caseId: string;
  rating: number;
  text: string;
  kyc: boolean;
}

// PROM submission type
export interface PROMSubmission {
  caseId: string;
  instrument: string;
  timepoint: "D0" | "D30" | "D90";
  scores: Record<string, number>;
}

