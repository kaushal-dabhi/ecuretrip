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

export interface Notification {
  id: string
  user_id: string
  type: 'appointment' | 'payment' | 'system' | 'emergency'
  title: string
  message: string
  data?: any
  channel: 'email' | 'sms' | 'whatsapp' | 'push' | 'in_app'
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  sent_at?: string
  delivered_at?: string
  created_at: string
  updated_at: string
}

export interface NotificationTemplate {
  id: string
  name: string
  type: Notification['type']
  channel: Notification['channel']
  subject?: string
  title: string
  message: string
  variables: string[]
}

// Notification templates for different scenarios
export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'appointment_confirmed',
    name: 'Appointment Confirmed',
    type: 'appointment',
    channel: 'email',
    subject: 'Appointment Confirmed - eCureTrip',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. {{doctor_name}} on {{appointment_date}} at {{appointment_time}} has been confirmed.',
    variables: ['doctor_name', 'appointment_date', 'appointment_time']
  },
  {
    id: 'appointment_reminder',
    name: 'Appointment Reminder',
    type: 'appointment',
    channel: 'sms',
    title: 'Appointment Reminder',
    message: 'Reminder: You have an appointment with Dr. {{doctor_name}} tomorrow at {{appointment_time}}. Please arrive 15 minutes early.',
    variables: ['doctor_name', 'appointment_time']
  },
  {
    id: 'payment_success',
    name: 'Payment Successful',
    type: 'payment',
    channel: 'email',
    subject: 'Payment Confirmed - eCureTrip',
    title: 'Payment Successful',
    message: 'Your payment of {{amount}} for appointment with Dr. {{doctor_name}} has been processed successfully.',
    variables: ['amount', 'doctor_name']
  },
  {
    id: 'appointment_cancelled',
    name: 'Appointment Cancelled',
    type: 'appointment',
    channel: 'whatsapp',
    title: 'Appointment Cancelled',
    message: 'Your appointment with Dr. {{doctor_name}} on {{appointment_date}} has been cancelled. {{refund_info}}',
    variables: ['doctor_name', 'appointment_date', 'refund_info']
  },
  {
    id: 'emergency_contact',
    name: 'Emergency Contact',
    type: 'emergency',
    channel: 'sms',
    title: 'Emergency - eCureTrip',
    message: 'URGENT: {{patient_name}} has an emergency. Please contact Dr. {{doctor_name}} immediately at {{doctor_phone}}.',
    variables: ['patient_name', 'doctor_name', 'doctor_phone']
  }
]

// Create a notification
export async function createNotification(
  notificationData: Omit<Notification, 'id' | 'created_at' | 'updated_at'>
): Promise<Notification> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notificationData,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Create audit log
    const auditLog = createAuditLog(
      notificationData.user_id,
      'NOTIFICATION_CREATED',
      'notifications',
      { notification_id: data.id, type: notificationData.type, channel: notificationData.channel }
    )

    console.log('Notification created:', auditLog)

    return data
  } catch (error) {
    console.error('Create notification error:', error)
    throw error
  }
}

// Send email notification
export async function sendEmailNotification(
  to: string,
  subject: string,
  htmlContent: string,
  textContent: string,
  userId: string
): Promise<boolean> {
  try {
    // This would integrate with SendGrid or similar email service
    // For now, we'll simulate the email sending
    
    console.log('Sending email:', {
      to,
      subject,
      htmlContent: htmlContent.substring(0, 100) + '...',
      textContent: textContent.substring(0, 100) + '...'
    })

    // Create notification record
    await createNotification({
      user_id: userId,
      type: 'system',
      title: subject,
      message: textContent,
      channel: 'email',
      status: 'sent',
      sent_at: new Date().toISOString()
    })

    return true
  } catch (error) {
    console.error('Send email notification error:', error)
    return false
  }
}

// Send SMS notification
export async function sendSMSNotification(
  phoneNumber: string,
  message: string,
  userId: string
): Promise<boolean> {
  try {
    // This would integrate with Twilio or similar SMS service
    // For now, we'll simulate the SMS sending
    
    console.log('Sending SMS:', {
      to: phoneNumber,
      message: message.substring(0, 100) + '...'
    })

    // Create notification record
    await createNotification({
      user_id: userId,
      type: 'system',
      title: 'SMS Notification',
      message,
      channel: 'sms',
      status: 'sent',
      sent_at: new Date().toISOString()
    })

    return true
  } catch (error) {
    console.error('Send SMS notification error:', error)
    return false
  }
}

// Send WhatsApp notification
export async function sendWhatsAppNotification(
  phoneNumber: string,
  message: string,
  userId: string
): Promise<boolean> {
  try {
    // This would integrate with WhatsApp Business API
    // For now, we'll simulate the WhatsApp sending
    
    console.log('Sending WhatsApp:', {
      to: phoneNumber,
      message: message.substring(0, 100) + '...'
    })

    // Create notification record
    await createNotification({
      user_id: userId,
      type: 'system',
      title: 'WhatsApp Notification',
      message,
      channel: 'whatsapp',
      status: 'sent',
      sent_at: new Date().toISOString()
    })

    return true
  } catch (error) {
    console.error('Send WhatsApp notification error:', error)
    return false
  }
}

// Send appointment confirmation
export async function sendAppointmentConfirmation(
  appointmentId: string,
  patientId: string,
  doctorId: string
): Promise<void> {
  try {
    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey(full_name, email, phone, preferred_language),
        doctor:profiles!appointments_doctor_id_fkey(full_name, specialty, hospital)
      `)
      .eq('id', appointmentId)
      .single()

    if (appointmentError) throw appointmentError

    const patient = appointment.patient
    const doctor = appointment.doctor

    // Send email confirmation
    const emailSubject = 'Appointment Confirmed - eCureTrip'
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2A4049;">Appointment Confirmed</h2>
        <p>Dear ${patient.full_name},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Doctor:</strong> Dr. ${doctor.full_name}</p>
          <p><strong>Specialty:</strong> ${doctor.specialty}</p>
          <p><strong>Hospital:</strong> ${doctor.hospital}</p>
          <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointment.appointment_time}</p>
          <p><strong>Type:</strong> ${appointment.appointment_type}</p>
        </div>
        <p>Please arrive 15 minutes early for your appointment.</p>
        <p>If you need to reschedule or cancel, please contact us immediately.</p>
        <p>Best regards,<br>The eCureTrip Team</p>
      </div>
    `

    const emailText = `
      Appointment Confirmed
      
      Dear ${patient.full_name},
      
      Your appointment has been confirmed:
      - Doctor: Dr. ${doctor.full_name}
      - Specialty: ${doctor.specialty}
      - Hospital: ${doctor.hospital}
      - Date: ${new Date(appointment.appointment_date).toLocaleDateString()}
      - Time: ${appointment.appointment_time}
      - Type: ${appointment.appointment_type}
      
      Please arrive 15 minutes early.
      
      The eCureTrip Team
    `

    await sendEmailNotification(
      patient.email,
      emailSubject,
      emailHtml,
      emailText,
      patientId
    )

    // Send SMS reminder (24 hours before)
    const smsMessage = `Reminder: You have an appointment with Dr. ${doctor.full_name} on ${new Date(appointment.appointment_date).toLocaleDateString()} at ${appointment.appointment_time}. Please arrive 15 minutes early. - eCureTrip`
    
    await sendSMSNotification(patient.phone, smsMessage, patientId)

    // Send WhatsApp message if preferred language is Swahili
    if (patient.preferred_language === 'sw') {
      const whatsappMessage = `Habari! Ukumbusho: Una miadi na Dkt. ${doctor.full_name} tarehe ${new Date(appointment.appointment_date).toLocaleDateString()} saa ${appointment.appointment_time}. Tafadhali fika dakika 15 mapema. - eCureTrip`
      await sendWhatsAppNotification(patient.phone, whatsappMessage, patientId)
    }

  } catch (error) {
    console.error('Send appointment confirmation error:', error)
    throw error
  }
}

// Send payment confirmation
export async function sendPaymentConfirmation(
  paymentId: string,
  patientId: string
): Promise<void> {
  try {
    // Get payment details
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        appointment:appointments!payments_appointment_id_fkey(appointment_date, appointment_time),
        patient:profiles!payments_patient_id_fkey(full_name, email, phone),
        doctor:profiles!payments_doctor_id_fkey(full_name, specialty)
      `)
      .eq('id', paymentId)
      .single()

    if (paymentError) throw paymentError

    const patient = payment.patient
    const doctor = payment.doctor

    // Send email confirmation
    const emailSubject = 'Payment Confirmed - eCureTrip'
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2A4049;">Payment Confirmed</h2>
        <p>Dear ${patient.full_name},</p>
        <p>Your payment has been processed successfully:</p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Amount:</strong> ${payment.currency} ${payment.amount}</p>
          <p><strong>Payment Method:</strong> ${payment.payment_method}</p>
          <p><strong>Appointment:</strong> Dr. ${doctor.full_name} - ${new Date(payment.appointment.appointment_date).toLocaleDateString()}</p>
          <p><strong>Reference:</strong> ${payment.id}</p>
        </div>
        <p>Thank you for choosing eCureTrip for your medical care.</p>
        <p>Best regards,<br>The eCureTrip Team</p>
      </div>
    `

    await sendEmailNotification(
      patient.email,
      emailSubject,
      emailHtml,
      `Payment of ${payment.currency} ${payment.amount} confirmed for appointment with Dr. ${doctor.full_name}`,
      patientId
    )

  } catch (error) {
    console.error('Send payment confirmation error:', error)
    throw error
  }
}

// Get notifications for a user
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Get user notifications error:', error)
    throw error
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({
        status: 'delivered',
        delivered_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) throw error
  } catch (error) {
    console.error('Mark notification as read error:', error)
    throw error
  }
}

// Replace template variables
export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value)
  })
  return result
}
