// Analytics stub for eCureTrip v1
// In production, this would integrate with Google Analytics, Mixpanel, etc.

export function track(event: string, payload?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    console.log("[analytics]", event, payload);
    
    // Stub for production analytics
    // gtag('event', event, payload);
    // mixpanel.track(event, payload);
  }
}

// Predefined tracking events for consistency
export const AnalyticsEvents = {
  // Intake flow
  INTAKE_SUBMITTED: 'intake_submitted',
  INTAKE_STEP_COMPLETED: 'intake_step_completed',
  
  // Matching
  MATCH_VIEWED: 'match_viewed',
  MATCH_SURGEON_SELECTED: 'match_surgeon_selected',
  
  // Teleconsultation
  TELECONSULT_BOOKED: 'teleconsult_booked',
  TELECONSULT_COMPLETED: 'teleconsult_completed',
  
  // Quotes
  QUOTE_VIEWED: 'quote_viewed',
  QUOTE_LOCKED: 'quote_locked',
  QUOTE_EXPIRED: 'quote_expired',
  
  // Escrow
  ESCROW_DEPOSIT_ATTEMPTED: 'escrow_deposit_attempted',
  ESCROW_DEPOSIT_SUCCEEDED: 'escrow_deposit_succeeded',
  ESCROW_DEPOSIT_FAILED: 'escrow_deposit_failed',
  
  // Visa
  VISA_LETTER_REQUESTED: 'visa_letter_requested',
  VISA_LETTER_ISSUED: 'visa_letter_issued',
  
  // Case tracking
  CASE_STAGE_CHANGED: 'case_stage_changed',
  CASE_DOCUMENT_UPLOADED: 'case_document_uploaded',
  
  // PROMs
  PROM_SUBMITTED: 'prom_submitted',
  PROM_REMINDER_SENT: 'prom_reminder_sent',
  
  // Reviews
  REVIEW_SUBMITTED: 'review_submitted',
  REVIEW_PUBLISHED: 'review_published',
  
  // User actions
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  
  // Page views
  PAGE_VIEWED: 'page_viewed',
  
  // Search
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied'
} as const;

// Helper functions for common tracking patterns
export function trackPageView(page: string, metadata?: Record<string, unknown>) {
  track(AnalyticsEvents.PAGE_VIEWED, { page, ...metadata });
}

export function trackIntakeSubmitted(data: Record<string, unknown>) {
  track(AnalyticsEvents.INTAKE_SUBMITTED, {
    procedure: (data.procedure as any)?.sku,
    country: (data.demographics as any)?.country,
    budget: (data.procedure as any)?.budget,
    ...data
  });
}

export function trackMatchViewed(surgeonSlugs: string[]) {
  track(AnalyticsEvents.MATCH_VIEWED, { surgeonSlugs });
}

export function trackTeleconsultBooked(surgeonSlug: string, slot: string) {
  track(AnalyticsEvents.TELECONSULT_BOOKED, { surgeonSlug, slot });
}

export function trackQuoteViewed(quoteId: string) {
  track(AnalyticsEvents.QUOTE_VIEWED, { quoteId });
}

export function trackQuoteLocked(quoteId: string, price: number) {
  track(AnalyticsEvents.QUOTE_LOCKED, { quoteId, price });
}

export function trackEscrowDepositSucceeded(amount: number, currency: string = 'USD') {
  track(AnalyticsEvents.ESCROW_DEPOSIT_SUCCEEDED, { amount, currency });
}

export function trackVisaLetterIssued(caseId: string) {
  track(AnalyticsEvents.VISA_LETTER_ISSUED, { caseId });
}

export function trackCaseStageChanged(from: string, to: string) {
  track(AnalyticsEvents.CASE_STAGE_CHANGED, { from, to });
}

export function trackPROMSubmitted(instrument: string, timepoint: string) {
  track(AnalyticsEvents.PROM_SUBMITTED, { instrument, timepoint });
}

export function trackReviewSubmitted(rating: number, verified: boolean) {
  track(AnalyticsEvents.REVIEW_SUBMITTED, { rating, verified });
}
