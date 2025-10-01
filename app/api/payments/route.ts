import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createPayment, getPatientPayments, getDoctorPayments, processStripePayment, processMpesaPayment } from '@/lib/payments'
import { apiRateLimiter } from '@/lib/security'

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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!apiRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { action, ...actionData } = body

    // Validate required fields
    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'create':
        return await handleCreatePayment(actionData, user.id)
      
      case 'process_stripe':
        return await handleProcessStripePayment(actionData, user.id)
      
      case 'process_mpesa':
        return await handleProcessMpesaPayment(actionData, user.id)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error: any) {
    console.error('Payment API error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    )
  }
}

async function handleCreatePayment(paymentData: any, userId: string) {
  // Validate required fields
  if (!paymentData.appointment_id || !paymentData.amount || !paymentData.payment_method) {
    return NextResponse.json(
      { error: 'Appointment ID, amount, and payment method are required' },
      { status: 400 }
    )
  }

  // Get appointment details to verify ownership and get doctor ID
  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments')
    .select('doctor_id, patient_id')
    .eq('id', paymentData.appointment_id)
    .single()

  if (appointmentError || !appointment) {
    return NextResponse.json(
      { error: 'Appointment not found' },
      { status: 404 }
    )
  }

  // Verify the payment is for the user's appointment
  if (appointment.patient_id !== userId) {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 403 }
    )
  }

  // Create payment record
  const payment = await createPayment({
    appointment_id: paymentData.appointment_id,
    patient_id: userId,
    doctor_id: appointment.doctor_id,
    amount: paymentData.amount,
    currency: paymentData.currency || 'USD',
    payment_method: paymentData.payment_method
  })

  return NextResponse.json({
    message: 'Payment created successfully',
    payment
  })
}

async function handleProcessStripePayment(paymentData: any, userId: string) {
  // Validate required fields
  if (!paymentData.payment_id || !paymentData.payment_intent_id) {
    return NextResponse.json(
      { error: 'Payment ID and payment intent ID are required' },
      { status: 400 }
    )
  }

  // Verify payment ownership
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('patient_id')
    .eq('id', paymentData.payment_id)
    .single()

  if (paymentError || !payment) {
    return NextResponse.json(
      { error: 'Payment not found' },
      { status: 404 }
    )
  }

  if (payment.patient_id !== userId) {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 403 }
    )
  }

  // Process Stripe payment
  const updatedPayment = await processStripePayment(
    paymentData.payment_id,
    paymentData.payment_intent_id,
    userId
  )

  return NextResponse.json({
    message: 'Stripe payment processed successfully',
    payment: updatedPayment
  })
}

async function handleProcessMpesaPayment(paymentData: any, userId: string) {
  // Validate required fields
  if (!paymentData.payment_id || !paymentData.phone_number) {
    return NextResponse.json(
      { error: 'Payment ID and phone number are required' },
      { status: 400 }
    )
  }

  // Verify payment ownership
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('patient_id')
    .eq('id', paymentData.payment_id)
    .single()

  if (paymentError || !payment) {
    return NextResponse.json(
      { error: 'Payment not found' },
      { status: 404 }
    )
  }

  if (payment.patient_id !== userId) {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 403 }
    )
  }

  // Process M-Pesa payment
  const mpesaResponse = await processMpesaPayment(
    paymentData.payment_id,
    paymentData.phone_number,
    userId
  )

  return NextResponse.json({
    message: 'M-Pesa payment initiated successfully',
    mpesa_response: mpesaResponse
  })
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (!apiRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Get user profile to determine role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to get user profile' },
        { status: 500 }
      )
    }

    // Get payments based on user role
    let payments
    if (profile.role === 'patient') {
      payments = await getPatientPayments(user.id)
    } else if (profile.role === 'doctor') {
      payments = await getDoctorPayments(user.id)
    } else {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      payments
    })

  } catch (error: any) {
    console.error('Get payments error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get payments' },
      { status: 500 }
    )
  }
}
