import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createAppointment, getPatientAppointments, getDoctorAppointments } from '@/lib/appointments'
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
    
    // Validate required fields
    if (!body.doctor_id || !body.appointment_date || !body.appointment_time) {
      return NextResponse.json(
        { error: 'Doctor ID, appointment date, and time are required' },
        { status: 400 }
      )
    }

    // Create appointment
    const appointmentData = {
      patient_id: user.id,
      doctor_id: body.doctor_id,
      appointment_date: body.appointment_date,
      appointment_time: body.appointment_time,
      duration_minutes: body.duration_minutes || 30,
      appointment_type: body.appointment_type || 'consultation',
      consultation_fee: body.consultation_fee || 0,
      notes: body.notes || '',
      symptoms: body.symptoms || '',
      medical_history: body.medical_history || ''
    }

    const appointment = await createAppointment(appointmentData)

    return NextResponse.json({
      message: 'Appointment created successfully',
      appointment
    })

  } catch (error: any) {
    console.error('Create appointment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create appointment' },
      { status: 500 }
    )
  }
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

    // Get appointments based on user role
    let appointments
    if (profile.role === 'patient') {
      appointments = await getPatientAppointments(user.id)
    } else if (profile.role === 'doctor') {
      appointments = await getDoctorAppointments(user.id)
    } else {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      appointments
    })

  } catch (error: any) {
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get appointments' },
      { status: 500 }
    )
  }
}
