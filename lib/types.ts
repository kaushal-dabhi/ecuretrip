export type Locale = "en" | "ar" | "sw";
export type Role = "patient" | "surgeon" | "admin";
export type ProcedureSKU = "TKR_STANDARD" | "TKR_PREMIUM" | "THR_STANDARD" | "THR_PREMIUM" | "ACL_ARTHRO" | "ACL_ALLOGRAFT" | "CARDIAC_BYPASS" | "SPINE_FUSION" | "IVF_CYCLE" | "ANGIOPLASTY";
export type Milestone = "TeleConsult" | "Admission" | "Surgery" | "Recovery" | "Discharge";

export type EscrowStatus = "created" | "pending_payment" | "active" | "completed" | "refunded" | "disputed" | "cancelled";
export type PaymentMethod = "credit_card" | "bank_transfer" | "paypal" | "stripe" | "crypto" | "wire_transfer";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";
export type DisputeStatus = "none" | "opened" | "under_review" | "resolved" | "escalated";
export type TransactionType = "deposit" | "milestone_release" | "refund" | "fee" | "dispute_resolution";

export interface EscrowMilestone { 
  name: Milestone; 
  pct: number; 
  released: boolean; 
  releasedAt?: string;
  requirements: string[];
  documents: string[];
  estimatedDate?: string;
  actualDate?: string;
}

export interface PaymentTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  description: string;
  timestamp: string;
  reference?: string;
  fee?: number;
  metadata?: Record<string, any>;
}

export interface DisputeCase {
  id: string;
  status: DisputeStatus;
  reason: string;
  description: string;
  evidence: string[];
  openedAt: string;
  resolvedAt?: string;
  resolution?: string;
  amount?: number;
}

export interface EscrowSecurity {
  twoFactorEnabled: boolean;
  ipWhitelist: string[];
  deviceVerification: boolean;
  sessionTimeout: number; // minutes
  lastActivity: string;
}

export interface Escrow {
  id: string; 
  quoteId: string; 
  amountUSD: number;
  currency: string;
  status: EscrowStatus;
  milestones: EscrowMilestone[]; 
  transactions: PaymentTransaction[];
  disputes: DisputeCase[];
  security: EscrowSecurity;
  paymentMethods: PaymentMethod[];
  fees: {
    escrowFee: number;
    processingFee: number;
    currencyConversionFee?: number;
  };
  terms: {
    autoReleaseDays: number;
    disputeWindowDays: number;
    refundPolicy: string;
  };
  createdAt: string; 
  updatedAt: string;
  expiresAt?: string;
  patientId: string;
  surgeonId: string;
  hospitalId: string;
}

export interface Hospital {
  slug: string;
  name: string;
  city: string;
  accreditation?: string;
  phone?: string;
  image?: string;
}

export interface FAQ {
  id: string;
  treatmentSlug: string;
  q: string;
  a: string;
}

export interface Package {
  sku: ProcedureSKU;
  title: string;
  priceUSD: number;
  inclusions: string[];
  exclusions: string[];
  addons: { name: string; priceUSD: number; per?: "night" | "unit" }[];
  losDays: number;
  refundPolicy: string;
  milestones: Milestone[];
}

export interface Surgeon {
  slug: string;
  name: string;
  specialty: string;
  casesPerYear: number;
  languages: string[];
  facilities: { name: string; city: string; priceUSD: number }[];
  training: string[];
  outcomes?: { instrument: string; D30?: number; D90?: number; n?: number };
  videoUrl?: string;
  acceptsComorbidities?: string[];
}

export interface Quote {
  id: string;
  patientId: string;
  surgeonSlug: string;
  packageSku: ProcedureSKU;
  addons: string[];
  priceUSD: number;
  expiresAt: string;
  locked: boolean;
  inclusions: string[];
  exclusions: string[];
  losDays: number;
  refundPolicy: string;
  milestones: Milestone[];
}

export interface Case {
  id: string;
  quoteId: string;
  status: "Intake" | "TeleConsult" | "Deposit" | "Visa" | "Admit" | "Surgery" | "Rehab";
  documents: string[];
  timeline: { at: string; event: string }[];
}

export interface Review {
  id: string;
  caseId: string;
  rating: number;
  text: string;
  media?: string[];
  kycVerified: boolean;
  procedureSku?: ProcedureSKU;
  surgeonSlug?: string;
  hospitalSlug?: string;
  date?: string;
}

export interface IntakeForm {
  demographics: {
    name: string;
    age: number;
    country: string;
    email: string;
    phone: string;
  };
  procedure: {
    sku: ProcedureSKU;
    budget: number;
    preferredCity?: string;
  };
  reports: string[];
  comorbidities: string[];
  language: string;
  consent: boolean;
}

export interface MatchResult {
  surgeons: Array<Surgeon & { whyMatched: string[] }>;
  expiresAt: string;
}


