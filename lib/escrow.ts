import { Escrow, Milestone, PaymentTransaction, DisputeCase, PaymentMethod, TransactionType, PaymentStatus, DisputeStatus } from './types';
import { nowISO, DEFAULT_MILESTONES } from './utils';

const escrows = new Map<string, Escrow>();

// Enhanced milestone requirements for real-world scenarios
const MILESTONE_REQUIREMENTS = {
  TeleConsult: [
    "Medical records uploaded",
    "Consultation scheduled",
    "Payment verification completed"
  ],
  Admission: [
    "Visa approved",
    "Travel arrangements confirmed",
    "Pre-operative tests completed",
    "Hospital admission scheduled"
  ],
  Surgery: [
    "Surgery date confirmed",
    "Pre-operative clearance obtained",
    "Surgical team assigned",
    "Operating room booked"
  ],
  Recovery: [
    "Surgery completed successfully",
    "Post-operative care initiated",
    "Recovery progress documented",
    "Follow-up appointments scheduled"
  ],
  Discharge: [
    "Recovery milestones met",
    "Discharge clearance obtained",
    "Post-discharge care plan established",
    "Travel arrangements confirmed"
  ]
};

const MILESTONE_DOCUMENTS = {
  TeleConsult: [
    "Medical records",
    "Consultation report",
    "Treatment plan"
  ],
  Admission: [
    "Visa documentation",
    "Travel itinerary",
    "Pre-operative test results",
    "Hospital admission forms"
  ],
  Surgery: [
    "Surgical consent",
    "Pre-operative clearance",
    "Surgical report",
    "Post-operative notes"
  ],
  Recovery: [
    "Recovery progress reports",
    "Physical therapy records",
    "Medication logs",
    "Follow-up appointment confirmations"
  ],
  Discharge: [
    "Discharge summary",
    "Post-discharge care instructions",
    "Travel clearance",
    "Final billing statement"
  ]
};

export function createEscrow(
  quoteId: string, 
  amountUSD: number, 
  patientId: string,
  surgeonId: string,
  hospitalId: string,
  currency: string = "USD"
): Escrow {
  const id = `esc_${Math.random().toString(36).slice(2, 10)}`;
  
  // Calculate fees based on amount
  const escrowFee = Math.max(50, amountUSD * 0.02); // 2% or $50 minimum
  const processingFee = Math.max(25, amountUSD * 0.01); // 1% or $25 minimum
  
  const e: Escrow = {
    id,
    quoteId,
    amountUSD,
    currency,
    status: "created",
    milestones: DEFAULT_MILESTONES.map(m => ({ 
      name: m.name as Milestone, 
      pct: m.pct, 
      released: m.released,
      requirements: MILESTONE_REQUIREMENTS[m.name as Milestone] || [],
      documents: MILESTONE_DOCUMENTS[m.name as Milestone] || [],
      estimatedDate: getEstimatedDate(m.name as Milestone)
    })),
    transactions: [],
    disputes: [],
    security: {
      twoFactorEnabled: false,
      ipWhitelist: [],
      deviceVerification: false,
      sessionTimeout: 30,
      lastActivity: nowISO()
    },
    paymentMethods: ["credit_card", "bank_transfer", "paypal"],
    fees: {
      escrowFee,
      processingFee,
      currencyConversionFee: currency !== "USD" ? amountUSD * 0.015 : undefined
    },
    terms: {
      autoReleaseDays: 7,
      disputeWindowDays: 14,
      refundPolicy: "Full refund available within 7 days of escrow creation if no milestones have been completed."
    },
    createdAt: nowISO(),
    updatedAt: nowISO(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    patientId,
    surgeonId,
    hospitalId
  };
  
  escrows.set(id, e);
  return e;
}

export function getEscrow(id: string) {
  let e = escrows.get(id);
  
  // If escrow not found and it looks like a demo escrow, create it
  if (!e && id.startsWith('esc_')) {
    console.log(`Creating demo escrow on-demand: ${id}`);
    e = createEscrow("quote_demo_on_demand", 5200, "patient_demo", "surgeon_demo", "hospital_demo");
    e.id = id; // Override the generated ID with the requested one
    escrows.set(id, e);
  }
  
  return e;
}

export function getAllEscrows() {
  return Array.from(escrows.values());
}

export function listEscrowIds() {
  return Array.from(escrows.keys());
}

export function processPayment(
  escrowId: string, 
  amount: number, 
  method: PaymentMethod, 
  reference?: string
): PaymentTransaction | null {
  const e = getEscrow(escrowId);
  if (!e) return null;
  
  const transactionId = `txn_${Math.random().toString(36).slice(2, 10)}`;
  const fee = e.fees.processingFee;
  
  const transaction: PaymentTransaction = {
    id: transactionId,
    type: "deposit",
    amount,
    currency: e.currency,
    status: "processing",
    method,
    description: `Initial deposit for escrow ${escrowId}`,
    timestamp: nowISO(),
    reference,
    fee,
    metadata: {
      escrowId,
      patientId: e.patientId,
      surgeonId: e.surgeonId
    }
  };
  
  e.transactions.push(transaction);
  e.status = "pending_payment";
  e.updatedAt = nowISO();
  
  // Simulate payment processing
  setTimeout(() => {
    transaction.status = "completed";
    e.status = "active";
    e.updatedAt = nowISO();
    console.log(`Payment completed for escrow ${escrowId}: ${amount} ${e.currency}`);
  }, 2000);
  
  return transaction;
}

export function activateEscrow(id: string) {
  const e = getEscrow(id);
  if (!e) return null;
  
  // Check if payment has been processed
  const depositTransaction = e.transactions.find(t => t.type === "deposit" && t.status === "completed");
  if (!depositTransaction) {
    throw new Error("Payment must be completed before activating escrow");
  }
  
  e.status = "active";
  e.updatedAt = nowISO();
  e.security.lastActivity = nowISO();
  
  return e;
}

export function releaseMilestone(
  escrowId: string, 
  milestoneName: Milestone,
  reason?: string
): PaymentTransaction | null {
  const e = getEscrow(escrowId);
  if (!e) return null;
  
  const milestone = e.milestones.find(m => m.name === milestoneName);
  if (!milestone || milestone.released) {
    throw new Error(`Milestone ${milestoneName} not found or already released`);
  }
  
  // Check if all requirements are met
  if (milestone.requirements.length > 0) {
    // In real implementation, verify requirements are met
    console.log(`Verifying requirements for milestone ${milestoneName}`);
  }
  
  const amount = (milestone.pct / 100) * e.amountUSD;
  const transactionId = `txn_${Math.random().toString(36).slice(2, 10)}`;
  
  const transaction: PaymentTransaction = {
    id: transactionId,
    type: "milestone_release",
    amount,
    currency: e.currency,
    status: "completed",
    method: "bank_transfer" as PaymentMethod,
    description: `Milestone release: ${milestoneName}`,
    timestamp: nowISO(),
    metadata: {
      milestoneName,
      milestonePercentage: milestone.pct,
      reason
    }
  };
  
  milestone.released = true;
  milestone.releasedAt = nowISO();
  milestone.actualDate = nowISO();
  e.transactions.push(transaction);
  e.updatedAt = nowISO();
  
  // Check if all milestones are completed
  if (e.milestones.every(m => m.released)) {
    e.status = "completed";
  }
  
  return transaction;
}

export function releaseNextMilestone(id: string) {
  const e = getEscrow(id);
  if (!e) return null;
  
  const next = e.milestones.find(m => !m.released);
  if (!next) {
    e.status = "completed";
    e.updatedAt = nowISO();
    return e;
  }
  
  releaseMilestone(id, next.name);
  return e;
}

export function refundEscrow(
  escrowId: string, 
  reason: string,
  amount?: number
): PaymentTransaction | null {
  const e = getEscrow(escrowId);
  if (!e) return null;
  
  const refundAmount = amount || e.amountUSD;
  const transactionId = `txn_${Math.random().toString(36).slice(2, 10)}`;
  
  const transaction: PaymentTransaction = {
    id: transactionId,
    type: "refund",
    amount: refundAmount,
    currency: e.currency,
    status: "processing",
    method: "bank_transfer" as PaymentMethod,
    description: `Escrow refund: ${reason}`,
    timestamp: nowISO(),
    metadata: {
      reason,
      originalEscrowId: escrowId
    }
  };
  
  e.transactions.push(transaction);
  e.status = "refunded";
  e.updatedAt = nowISO();
  
  // Simulate refund processing
  setTimeout(() => {
    transaction.status = "completed";
    console.log(`Refund completed for escrow ${escrowId}: ${refundAmount} ${e.currency}`);
  }, 3000);
  
  return transaction;
}

export function openDispute(
  escrowId: string,
  reason: string,
  description: string,
  evidence: string[] = []
): DisputeCase | null {
  const e = getEscrow(escrowId);
  if (!e) return null;
  
  const disputeId = `dispute_${Math.random().toString(36).slice(2, 10)}`;
  
  const dispute: DisputeCase = {
    id: disputeId,
    status: "opened",
    reason,
    description,
    evidence,
    openedAt: nowISO()
  };
  
  e.disputes.push(dispute);
  e.status = "disputed";
  e.updatedAt = nowISO();
  
  return dispute;
}

export function resolveDispute(
  escrowId: string,
  disputeId: string,
  resolution: string,
  amount?: number
): DisputeCase | null {
  const e = getEscrow(escrowId);
  if (!e) return null;
  
  const dispute = e.disputes.find(d => d.id === disputeId);
  if (!dispute) return null;
  
  dispute.status = "resolved";
  dispute.resolution = resolution;
  dispute.resolvedAt = nowISO();
  dispute.amount = amount;
  
  // If dispute is resolved, return escrow to active status
  const activeDisputes = e.disputes.filter(d => d.status === "opened" || d.status === "under_review");
  if (activeDisputes.length === 0) {
    e.status = "active";
  }
  
  e.updatedAt = nowISO();
  
  return dispute;
}

export function updateSecuritySettings(
  escrowId: string,
  settings: Partial<Escrow['security']>
): Escrow | null {
  const e = getEscrow(escrowId);
  if (!e) return null;
  
  e.security = { ...e.security, ...settings };
  e.updatedAt = nowISO();
  
  return e;
}

export function addPaymentMethod(
  escrowId: string,
  method: PaymentMethod
): Escrow | null {
  const e = getEscrow(escrowId);
  if (!e) return null;
  
  if (!e.paymentMethods.includes(method)) {
    e.paymentMethods.push(method);
    e.updatedAt = nowISO();
  }
  
  return e;
}

export function getEscrowAnalytics(escrowId: string) {
  const e = getEscrow(escrowId);
  if (!e) return null;
  
  const totalReleased = e.milestones
    .filter(m => m.released)
    .reduce((sum, m) => sum + (m.pct / 100) * e.amountUSD, 0);
  
  const totalFees = e.transactions
    .filter(t => t.fee)
    .reduce((sum, t) => sum + (t.fee || 0), 0);
  
  const activeDisputes = e.disputes.filter(d => 
    d.status === "opened" || d.status === "under_review"
  ).length;
  
  return {
    totalAmount: e.amountUSD,
    totalReleased,
    totalFees,
    remainingAmount: e.amountUSD - totalReleased,
    completedMilestones: e.milestones.filter(m => m.released).length,
    totalMilestones: e.milestones.length,
    activeDisputes,
    daysRemaining: e.expiresAt ? 
      Math.ceil((new Date(e.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
      null
  };
}

// Helper function to get estimated dates for milestones
function getEstimatedDate(milestone: Milestone): string {
  const baseDate = new Date();
  const daysOffset = {
    TeleConsult: 7,
    Admission: 30,
    Surgery: 45,
    Recovery: 60,
    Discharge: 75
  };
  
  return new Date(baseDate.getTime() + (daysOffset[milestone] || 0) * 24 * 60 * 60 * 1000).toISOString();
}

// Seed some demo escrows for testing
function seedDemoEscrows() {
  const demoEscrow1 = createEscrow("quote_demo_1", 5200, "patient_demo_1", "surgeon_demo_1", "hospital_demo_1");
  const demoEscrow2 = createEscrow("quote_demo_2", 6500, "patient_demo_2", "surgeon_demo_2", "hospital_demo_2");
  
  // Add some transactions to demo escrows
  processPayment(demoEscrow1.id, 5200, "credit_card", "demo_payment_1");
  processPayment(demoEscrow2.id, 6500, "bank_transfer", "demo_payment_2");
  
  // Activate demo escrows
  setTimeout(() => {
    activateEscrow(demoEscrow1.id);
    activateEscrow(demoEscrow2.id);
    
    // Advance some milestones for demo purposes
    setTimeout(() => {
      releaseMilestone(demoEscrow1.id, "TeleConsult", "Demo milestone completion");
      releaseMilestone(demoEscrow2.id, "TeleConsult", "Demo milestone completion");
    }, 1000);
  }, 3000);
  
  console.log("Demo escrows seeded:", Array.from(escrows.keys()));
}

// Seed demo data when module loads
if (typeof window === 'undefined') { // Server-side only
  seedDemoEscrows();
}
