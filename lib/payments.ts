import { createClient } from '@supabase/supabase-js'
import { createAuditLog } from './security'

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export interface Payment {
  id: string
  appointment_id: string
  patient_id: string
  doctor_id: string
  amount: number
  currency: string
  payment_method: 'stripe' | 'mpesa' | 'mobile_money' | 'bank_transfer'
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  stripe_payment_intent_id?: string
  mpesa_receipt_number?: string
  mobile_money_reference?: string
  bank_transfer_reference?: string
  payment_date?: string
  refund_date?: string
  refund_reason?: string
  created_at: string
  updated_at: string
  // Relations
  appointment?: {
    appointment_date: string
    appointment_time: string
    appointment_type: string
  }
  patient?: {
    full_name: string
    email: string
  }
  doctor?: {
    full_name: string
    specialty: string
  }
}

export interface PaymentMethod {
  id: string
  type: 'stripe' | 'mpesa' | 'mobile_money' | 'bank_transfer'
  name: string
  description: string
  icon: string
  available: boolean
  processing_fee: number
}

// Available payment methods for East African market
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'stripe',
    type: 'stripe',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    icon: '💳',
    available: true,
    processing_fee: 2.9
  },
  {
    id: 'mpesa',
    type: 'mpesa',
    name: 'M-Pesa',
    description: 'Mobile money (Kenya, Tanzania)',
    icon: '📱',
    available: true,
    processing_fee: 1.5
  },
  {
    id: 'mobile_money',
    type: 'mobile_money',
    name: 'Mobile Money',
    description: 'MTN, Airtel, Vodacom',
    icon: '💰',
    available: true,
    processing_fee: 2.0
  },
  {
    id: 'bank_transfer',
    type: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfer',
    icon: '🏦',
    available: true,
    processing_fee: 0.5
  }
]

// Create a payment record
export async function createPayment(
  paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'appointment' | 'patient' | 'doctor'>
): Promise<Payment> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        ...paymentData,
        payment_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        appointment:appointments!payments_appointment_id_fkey(appointment_date, appointment_time, appointment_type),
        patient:profiles!payments_patient_id_fkey(full_name, email),
        doctor:profiles!payments_doctor_id_fkey(full_name, specialty)
      `)
      .single()

    if (error) throw error

    // Create audit log
    const auditLog = createAuditLog(
      paymentData.patient_id,
      'PAYMENT_CREATED',
      'payments',
      { payment_id: data.id, amount: paymentData.amount, method: paymentData.payment_method }
    )

    console.log('Payment created:', auditLog)

    return data
  } catch (error) {
    console.error('Create payment error:', error)
    throw error
  }
}

// Process Stripe payment
export async function processStripePayment(
  paymentId: string,
  paymentIntentId: string,
  userId: string
): Promise<Payment> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({
        stripe_payment_intent_id: paymentIntentId,
        payment_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select(`
        *,
        appointment:appointments!payments_appointment_id_fkey(appointment_date, appointment_time, appointment_type),
        patient:profiles!payments_patient_id_fkey(full_name, email),
        doctor:profiles!payments_doctor_id_fkey(full_name, specialty)
      `)
      .single()

    if (error) throw error

    // Create audit log
    const auditLog = createAuditLog(
      userId,
      'STRIPE_PAYMENT_PROCESSING',
      'payments',
      { payment_id: paymentId, payment_intent_id: paymentIntentId }
    )

    console.log('Stripe payment processing:', auditLog)

    return data
  } catch (error) {
    console.error('Process Stripe payment error:', error)
    throw error
  }
}

// Process M-Pesa payment
export async function processMpesaPayment(
  paymentId: string,
  phoneNumber: string,
  userId: string
): Promise<{ checkoutRequestId: string; merchantRequestId: string }> {
  try {
    // This would integrate with M-Pesa API
    // For now, we'll simulate the response
    const checkoutRequestId = `ws_CO_${Date.now()}`
    const merchantRequestId = `merchant_${Date.now()}`

    // Update payment record
    const { error } = await supabase
      .from('payments')
      .update({
        payment_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)

    if (error) throw error

    // Create audit log
    const auditLog = createAuditLog(
      userId,
      'MPESA_PAYMENT_INITIATED',
      'payments',
      { payment_id: paymentId, phone_number: phoneNumber }
    )

    console.log('M-Pesa payment initiated:', auditLog)

    return { checkoutRequestId, merchantRequestId }
  } catch (error) {
    console.error('Process M-Pesa payment error:', error)
    throw error
  }
}

// Update payment status
export async function updatePaymentStatus(
  paymentId: string,
  status: Payment['payment_status'],
  userId: string,
  additionalData?: any
): Promise<Payment> {
  try {
    const updateData: any = {
      payment_status: status,
      updated_at: new Date().toISOString()
    }

    // Add payment-specific data based on status
    if (status === 'completed') {
      updateData.payment_date = new Date().toISOString()
      if (additionalData?.receipt_number) {
        updateData.mpesa_receipt_number = additionalData.receipt_number
      }
      if (additionalData?.reference) {
        updateData.mobile_money_reference = additionalData.reference
      }
      if (additionalData?.bank_reference) {
        updateData.bank_transfer_reference = additionalData.bank_reference
      }
    }

    if (status === 'refunded') {
      updateData.refund_date = new Date().toISOString()
      if (additionalData?.refund_reason) {
        updateData.refund_reason = additionalData.refund_reason
      }
    }

    const { data, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', paymentId)
      .select(`
        *,
        appointment:appointments!payments_appointment_id_fkey(appointment_date, appointment_time, appointment_type),
        patient:profiles!payments_patient_id_fkey(full_name, email),
        doctor:profiles!payments_doctor_id_fkey(full_name, specialty)
      `)
      .single()

    if (error) throw error

    // Create audit log
    const auditLog = createAuditLog(
      userId,
      'PAYMENT_STATUS_UPDATED',
      'payments',
      { payment_id: paymentId, new_status: status, additional_data: additionalData }
    )

    console.log('Payment status updated:', auditLog)

    return data
  } catch (error) {
    console.error('Update payment status error:', error)
    throw error
  }
}

// Get payments for a patient
export async function getPatientPayments(patientId: string): Promise<Payment[]> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        appointment:appointments!payments_appointment_id_fkey(appointment_date, appointment_time, appointment_type),
        doctor:profiles!payments_doctor_id_fkey(full_name, specialty)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get patient payments error:', error)
    throw error
  }
}

// Get payments for a doctor
export async function getDoctorPayments(doctorId: string): Promise<Payment[]> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        appointment:appointments!payments_appointment_id_fkey(appointment_date, appointment_time, appointment_type),
        patient:profiles!payments_patient_id_fkey(full_name, email)
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get doctor payments error:', error)
    throw error
  }
}

// Get payment by ID
export async function getPaymentById(paymentId: string): Promise<Payment | null> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        appointment:appointments!payments_appointment_id_fkey(appointment_date, appointment_time, appointment_type),
        patient:profiles!payments_patient_id_fkey(full_name, email),
        doctor:profiles!payments_doctor_id_fkey(full_name, specialty)
      `)
      .eq('id', paymentId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Get payment by ID error:', error)
    return null
  }
}

// Initiate refund
export async function initiateRefund(
  paymentId: string,
  reason: string,
  userId: string
): Promise<Payment> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({
        payment_status: 'refunded',
        refund_reason: reason,
        refund_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select(`
        *,
        appointment:appointments!payments_appointment_id_fkey(appointment_date, appointment_time, appointment_type),
        patient:profiles!payments_patient_id_fkey(full_name, email),
        doctor:profiles!payments_doctor_id_fkey(full_name, specialty)
      `)
      .single()

    if (error) throw error

    // Create audit log
    const auditLog = createAuditLog(
      userId,
      'PAYMENT_REFUNDED',
      'payments',
      { payment_id: paymentId, reason }
    )

    console.log('Payment refunded:', auditLog)

    return data
  } catch (error) {
    console.error('Initiate refund error:', error)
    throw error
  }
}

// Calculate payment fees
export function calculatePaymentFees(amount: number, paymentMethod: string): {
  amount: number
  processingFee: number
  totalAmount: number
} {
  const method = PAYMENT_METHODS.find(m => m.id === paymentMethod)
  const processingFee = method ? (amount * method.processing_fee) / 100 : 0
  const totalAmount = amount + processingFee

  return {
    amount,
    processingFee,
    totalAmount
  }
}

// Format currency for display
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount)
}
