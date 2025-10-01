import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { updateAppointmentStatus, cancelAppointment, rescheduleAppointment, getAppointmentById } from '@/lib/appointments'
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get appointment
    const appointment = await getAppointmentById(params.id)
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this appointment
    if (appointment.patient_id !== user.id && appointment.doctor_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      appointment
    })

  } catch (error: any) {
    console.error('Get appointment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get appointment' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get appointment to check permissions
    const appointment = await getAppointmentById(params.id)
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check permissions based on action
    let hasPermission = false
    if (action === 'cancel' || action === 'reschedule') {
      // Patients can cancel/reschedule their own appointments
      hasPermission = appointment.patient_id === user.id
    } else if (action === 'update_status') {
      // Doctors can update status of their appointments
      hasPermission = appointment.doctor_id === user.id
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      )
    }

    let updatedAppointment

    switch (action) {
      case 'update_status':
        if (!actionData.status) {
          return NextResponse.json(
            { error: 'Status is required' },
            { status: 400 }
          )
        }
        updatedAppointment = await updateAppointmentStatus(
          params.id,
          actionData.status,
          user.id
        )
        break

      case 'cancel':
        await cancelAppointment(
          params.id,
          user.id,
          actionData.reason
        )
        updatedAppointment = await getAppointmentById(params.id)
        break

      case 'reschedule':
        if (!actionData.new_date || !actionData.new_time) {
          return NextResponse.json(
            { error: 'New date and time are required' },
            { status: 400 }
          )
        }
        updatedAppointment = await rescheduleAppointment(
          params.id,
          actionData.new_date,
          actionData.new_time,
          user.id
        )
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `Appointment ${action} successful`,
      appointment: updatedAppointment
    })

  } catch (error: any) {
    console.error('Update appointment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update appointment' },
      { status: 500 }
    )
  }
}
