import { z } from "zod";

// Intake form validation
export const IntakeFormSchema = z.object({
  demographics: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    age: z.number().min(18, "Must be 18 or older").max(100, "Invalid age").optional(),
    country: z.string().min(2, "Country is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required").optional()
  }),
  procedure: z.object({
    sku: z.enum(["TKR_STANDARD", "THR_STANDARD", "ACL_ARTHRO", "IVF_CYCLE"]).optional(),
    budget: z.union([z.string(), z.number()]).optional(),
    preferredCity: z.string().optional()
  }),
  reports: z.array(z.string()).optional(),
  comorbidities: z.union([z.string(), z.array(z.string())]).optional(),
  language: z.string().min(1, "Language preference is required").optional(),
  communication: z.object({
    email: z.boolean().optional(),
    phone: z.boolean().optional(),
    whatsapp: z.boolean().optional()
  }).optional(),
  consent: z.boolean().refine(val => val === true, "Consent is required").optional(),
  marketing: z.boolean().optional()
});

// Match request validation
export const MatchRequestSchema = z.object({
  procedureSku: z.enum(["TKR_STANDARD", "THR_STANDARD", "ACL_ARTHRO", "IVF_CYCLE"]),
  locale: z.enum(["en", "ar", "sw"]),
  budget: z.number().min(1000),
  comorbidities: z.array(z.string()),
  language: z.string()
});

// Quote request validation
export const QuoteRequestSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  surgeonSlug: z.string().min(1, "Surgeon is required"),
  packageSku: z.enum(["TKR_STANDARD", "THR_STANDARD", "ACL_ARTHRO", "IVF_CYCLE"]),
  addons: z.array(z.string())
});

// Escrow request validation
export const EscrowRequestSchema = z.object({
  quoteId: z.string().min(1, "Quote ID is required"),
  amountUSD: z.number().min(100, "Amount must be at least $100")
});

// Visa letter request validation
export const VisaLetterRequestSchema = z.object({
  caseId: z.string().min(1, "Case ID is required"),
  patient: z.object({
    name: z.string(),
    passport: z.string(),
    nationality: z.string()
  }),
  hospital: z.object({
    name: z.string(),
    address: z.string()
  })
});

// Review submission validation
export const ReviewSubmissionSchema = z.object({
  caseId: z.string().min(1, "Case ID is required"),
  rating: z.number().min(1).max(5),
  text: z.string().min(10, "Review must be at least 10 characters"),
  kyc: z.boolean().refine(val => val === true, "KYC verification is required")
});

// PROM submission validation
export const PROMSubmissionSchema = z.object({
  caseId: z.string().min(1, "Case ID is required"),
  instrument: z.string().min(1, "Assessment instrument is required"),
  timepoint: z.enum(["D0", "D30", "D90"]),
  scores: z.record(z.string(), z.number())
});

// Types derived from schemas
export type IntakeFormData = z.infer<typeof IntakeFormSchema>;
export type MatchRequest = z.infer<typeof MatchRequestSchema>;
export type QuoteRequest = z.infer<typeof QuoteRequestSchema>;
export type EscrowRequest = z.infer<typeof EscrowRequestSchema>;
export type VisaLetterRequest = z.infer<typeof VisaLetterRequestSchema>;
export type ReviewSubmission = z.infer<typeof ReviewSubmissionSchema>;
export type PROMSubmission = z.infer<typeof PROMSubmissionSchema>;

