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

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  appointment_type: 'consultation' | 'follow-up' | 'emergency' | 'surgery'
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled'
  consultation_fee: number
  notes?: string
  symptoms?: string
  medical_history?: string
  created_at: string
  updated_at: string
  // Relations
  patient?: {
    full_name: string
    email: string
    phone: string
  }
  doctor?: {
    full_name: string
    specialty: string
    hospital: string
  }
}

export interface AppointmentSlot {
  date: string
  time: string
  available: boolean
  doctor_id: string
}

// Create a new appointment
export async function createAppointment(
  appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patient' | 'doctor'>
): Promise<Appointment> {
  try {
    // Validate appointment data
    if (!appointmentData.patient_id || !appointmentData.doctor_id) {
      throw new Error('Patient ID and Doctor ID are required')
    }

    if (!appointmentData.appointment_date || !appointmentData.appointment_time) {
      throw new Error('Appointment date and time are required')
    }

    // Check if the time slot is available
    const { data: existingAppointment, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('doctor_id', appointmentData.doctor_id)
      .eq('appointment_date', appointmentData.appointment_date)
      .eq('appointment_time', appointmentData.appointment_time)
      .eq('status', 'scheduled')
      .single()

    if (existingAppointment) {
      throw new Error('This time slot is already booked')
    }

    // Create the appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        ...appointmentData,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(full_name, email, phone),
        doctor:profiles!appointments_doctor_id_fkey(full_name, specialty, hospital)
      `)
      .single()

    if (error) throw error

    // Create audit log
    const auditLog = createAuditLog(
      appointmentData.patient_id,
      'APPOINTMENT_CREATED',
      'appointments',
      { appointment_id: data.id, doctor_id: appointmentData.doctor_id }
    )

    console.log('Appointment created:', auditLog)

    return data
  } catch (error) {
    console.error('Create appointment error:', error)
    throw error
  }
}

// Get appointments for a patient
export async function getPatientAppointments(patientId: string): Promise<Appointment[]> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:profiles!appointments_doctor_id_fkey(full_name, specialty, hospital, consultation_fee)
      `)
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get patient appointments error:', error)
    throw error
  }
}

// Get appointments for a doctor
export async function getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(full_name, email, phone)
      `)
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get doctor appointments error:', error)
    throw error
  }
}

// Get available appointment slots for a doctor
export async function getAvailableSlots(
  doctorId: string,
  date: string
): Promise<AppointmentSlot[]> {
  try {
    // Get doctor's available hours (you might want to store this in the doctor profile)
    const doctorHours = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ]

    // Get booked appointments for the date
    const { data: bookedAppointments, error } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', date)
      .eq('status', 'scheduled')

    if (error) throw error

    const bookedTimes = bookedAppointments?.map(apt => apt.appointment_time) || []

    // Generate available slots
    const availableSlots: AppointmentSlot[] = doctorHours.map(time => ({
      date,
      time,
      available: !bookedTimes.includes(time),
      doctor_id: doctorId
    }))

    return availableSlots
  } catch (error) {
    console.error('Get available slots error:', error)
    throw error
  }
}

// Update appointment status
export async function updateAppointmentStatus(
  appointmentId: string,
  status: Appointment['status'],
  userId: string
): Promise<Appointment> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(full_name, email, phone),
        doctor:profiles!appointments_doctor_id_fkey(full_name, specialty, hospital)
      `)
      .single()

    if (error) throw error

    // Create audit log
    const auditLog = createAuditLog(
      userId,
      'APPOINTMENT_STATUS_UPDATED',
      'appointments',
      { appointment_id: appointmentId, new_status: status }
    )

    console.log('Appointment status updated:', auditLog)

    return data
  } catch (error) {
    console.error('Update appointment status error:', error)
    throw error
  }
}

// Cancel appointment
export async function cancelAppointment(
  appointmentId: string,
  userId: string,
  reason?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled by patient',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)

    if (error) throw error

    // Create audit log
    const auditLog = createAuditLog(
      userId,
      'APPOINTMENT_CANCELLED',
      'appointments',
      { appointment_id: appointmentId, reason }
    )

    console.log('Appointment cancelled:', auditLog)
  } catch (error) {
    console.error('Cancel appointment error:', error)
    throw error
  }
}

// Reschedule appointment
export async function rescheduleAppointment(
  appointmentId: string,
  newDate: string,
  newTime: string,
  userId: string
): Promise<Appointment> {
  try {
    // Check if new slot is available
    const appointment = await supabase
      .from('appointments')
      .select('doctor_id')
      .eq('id', appointmentId)
      .single()

    if (appointment.error) throw appointment.error

    const slots = await getAvailableSlots(appointment.data.doctor_id, newDate)
    const isSlotAvailable = slots.find(slot => slot.time === newTime && slot.available)

    if (!isSlotAvailable) {
      throw new Error('The selected time slot is no longer available')
    }

    // Update appointment
    const { data, error } = await supabase
      .from('appointments')
      .update({
        appointment_date: newDate,
        appointment_time: newTime,
        status: 'rescheduled',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(full_name, email, phone),
        doctor:profiles!appointments_doctor_id_fkey(full_name, specialty, hospital)
      `)
      .single()

    if (error) throw error

    // Create audit log
    const auditLog = createAuditLog(
      userId,
      'APPOINTMENT_RESCHEDULED',
      'appointments',
      { 
        appointment_id: appointmentId, 
        new_date: newDate, 
        new_time: newTime 
      }
    )

    console.log('Appointment rescheduled:', auditLog)

    return data
  } catch (error) {
    console.error('Reschedule appointment error:', error)
    throw error
  }
}

// Get appointment by ID
export async function getAppointmentById(appointmentId: string): Promise<Appointment | null> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(full_name, email, phone),
        doctor:profiles!appointments_doctor_id_fkey(full_name, specialty, hospital, consultation_fee)
      `)
      .eq('id', appointmentId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Get appointment by ID error:', error)
    return null
  }
}
