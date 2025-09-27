import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// Realistic doctor data
const doctors = [
  {
    email: 'dr.singh@ecuretrip.com',
    password: 'Doctor123!',
    full_name: 'Dr. Rajesh Singh',
    role: 'doctor',
    specialty: 'Cardiology',
    hospital: 'Apollo Hospitals, Delhi',
    experience_years: 15,
    qualifications: 'MD Cardiology, DM Interventional Cardiology',
    languages: ['English', 'Hindi', 'Punjabi'],
    consultation_fee: 2500,
    response_time: '2 hours'
  },
  {
    email: 'dr.patel@ecuretrip.com',
    password: 'Doctor123!',
    full_name: 'Dr. Priya Patel',
    role: 'doctor',
    specialty: 'Orthopedics',
    hospital: 'Fortis Healthcare, Mumbai',
    experience_years: 12,
    qualifications: 'MS Orthopedics, Fellowship in Joint Replacement',
    languages: ['English', 'Hindi', 'Gujarati'],
    consultation_fee: 3000,
    response_time: '1 hour'
  },
  {
    email: 'dr.kumar@ecuretrip.com',
    password: 'Doctor123!',
    full_name: 'Dr. Amit Kumar',
    role: 'doctor',
    specialty: 'Neurology',
    hospital: 'Max Healthcare, Delhi',
    experience_years: 18,
    qualifications: 'DM Neurology, Fellowship in Stroke Medicine',
    languages: ['English', 'Hindi'],
    consultation_fee: 4000,
    response_time: '3 hours'
  },
  {
    email: 'dr.sharma@ecuretrip.com',
    password: 'Doctor123!',
    full_name: 'Dr. Sunita Sharma',
    role: 'doctor',
    specialty: 'Oncology',
    hospital: 'Tata Memorial Hospital, Mumbai',
    experience_years: 20,
    qualifications: 'MD Medicine, DM Medical Oncology',
    languages: ['English', 'Hindi', 'Marathi'],
    consultation_fee: 5000,
    response_time: '4 hours'
  },
  {
    email: 'dr.reddy@ecuretrip.com',
    password: 'Doctor123!',
    full_name: 'Dr. Venkatesh Reddy',
    role: 'doctor',
    specialty: 'Fertility',
    hospital: 'Cloudnine Hospitals, Bangalore',
    experience_years: 14,
    qualifications: 'MD Obstetrics & Gynecology, Fellowship in Reproductive Medicine',
    languages: ['English', 'Hindi', 'Telugu'],
    consultation_fee: 3500,
    response_time: '2 hours'
  }
]

// Realistic patient data
const patients = [
  {
    email: 'john.smith@email.com',
    password: 'Patient123!',
    full_name: 'John Smith',
    role: 'patient',
    age: 45,
    gender: 'male',
    phone: '+1-555-0123',
    country: 'United States',
    medical_history: 'Hypertension, Family history of heart disease',
    current_medications: 'Lisinopril 10mg daily',
    allergies: 'Penicillin'
  },
  {
    email: 'sarah.johnson@email.com',
    password: 'Patient123!',
    full_name: 'Sarah Johnson',
    role: 'patient',
    age: 38,
    gender: 'female',
    phone: '+1-555-0456',
    country: 'Canada',
    medical_history: 'Osteoarthritis, Previous knee injury',
    current_medications: 'Ibuprofen as needed',
    allergies: 'None known'
  },
  {
    email: 'michael.brown@email.com',
    password: 'Patient123!',
    full_name: 'Michael Brown',
    role: 'patient',
    age: 52,
    gender: 'male',
    phone: '+1-555-0789',
    country: 'United Kingdom',
    medical_history: 'Migraine, Family history of neurological conditions',
    current_medications: 'Sumatriptan as needed',
    allergies: 'Sulfa drugs'
  },
  {
    email: 'emma.davis@email.com',
    password: 'Patient123!',
    full_name: 'Emma Davis',
    role: 'patient',
    age: 41,
    gender: 'female',
    phone: '+1-555-0321',
    country: 'Australia',
    medical_history: 'Breast cancer survivor, Regular follow-ups',
    current_medications: 'Tamoxifen 20mg daily',
    allergies: 'Contrast dye'
  },
  {
    email: 'david.wilson@email.com',
    password: 'Patient123!',
    full_name: 'David Wilson',
    role: 'patient',
    age: 35,
    gender: 'male',
    phone: '+1-555-0654',
    country: 'New Zealand',
    medical_history: 'Infertility, Previous varicocele surgery',
    current_medications: 'Folic acid supplements',
    allergies: 'None known'
  }
]

async function createDoctorProfiles() {
  console.log('Creating doctor profiles...')
  
  for (const doctor of doctors) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: doctor.email,
        password: doctor.password,
        email_confirm: true
      })

      if (authError) {
        console.error(`Error creating auth user for ${doctor.email}:`, authError.message)
        continue
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: doctor.email,
          full_name: doctor.full_name,
          role: doctor.role,
          specialty: doctor.specialty,
          hospital: doctor.hospital,
          experience: doctor.experience_years.toString(),
          qualifications: doctor.qualifications,
          languages: doctor.languages.join(', '),
          consultation_fee: doctor.consultation_fee,
          response_time: doctor.response_time
        })

      if (profileError) {
        console.error(`Error creating profile for ${doctor.email}:`, profileError.message)
      } else {
        console.log(`✅ Created doctor profile: ${doctor.full_name}`)
      }
    } catch (error) {
      console.error(`Error processing doctor ${doctor.email}:`, error)
    }
  }
}

async function createPatientProfiles() {
  console.log('Creating patient profiles...')
  
  for (const patient of patients) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: patient.email,
        password: patient.password,
        email_confirm: true
      })

      if (authError) {
        console.error(`Error creating auth user for ${patient.email}:`, authError.message)
        continue
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: patient.email,
          full_name: patient.full_name,
          role: patient.role
        })

      if (profileError) {
        console.error(`Error creating profile for ${patient.email}:`, profileError.message)
        continue
      }

      // Create patient record
      const { error: patientError } = await supabase
        .from('patients')
        .insert({
          id: authData.user.id,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          country: patient.country,
          medical_history: patient.medical_history,
          current_medications: patient.current_medications,
          allergies: patient.allergies
        })

      if (patientError) {
        console.error(`Error creating patient record for ${patient.email}:`, patientError.message)
      } else {
        console.log(`✅ Created patient profile: ${patient.full_name}`)
      }
    } catch (error) {
      console.error(`Error processing patient ${patient.email}:`, error)
    }
  }
}

async function createMedicalCases() {
  console.log('Creating medical cases...')
  
  // Get patient IDs
  const { data: patientProfiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'patient')

  // Get treatment IDs
  const { data: treatments } = await supabase
    .from('treatments')
    .select('id, name')

  if (!patientProfiles || !treatments) {
    console.log('No patients or treatments found')
    return
  }

  const cases = [
    {
      patient_id: patientProfiles[0]?.id,
      treatment_id: treatments[0]?.id,
      status: 'pending_quote',
      symptoms: 'Chest pain, shortness of breath, fatigue',
      medical_history: 'Hypertension, Family history of heart disease',
      current_medications: 'Lisinopril 10mg daily',
      allergies: 'Penicillin',
      preferred_treatment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      budget_range: '50000-100000',
      notes: 'Patient seeking second opinion for cardiac evaluation'
    },
    {
      patient_id: patientProfiles[1]?.id,
      treatment_id: treatments[1]?.id,
      status: 'quote_received',
      symptoms: 'Knee pain, difficulty walking, stiffness',
      medical_history: 'Osteoarthritis, Previous knee injury',
      current_medications: 'Ibuprofen as needed',
      allergies: 'None known',
      preferred_treatment_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      budget_range: '80000-120000',
      notes: 'Patient considering knee replacement surgery'
    },
    {
      patient_id: patientProfiles[2]?.id,
      treatment_id: treatments[2]?.id,
      status: 'treatment_scheduled',
      symptoms: 'Severe headaches, vision problems, dizziness',
      medical_history: 'Migraine, Family history of neurological conditions',
      current_medications: 'Sumatriptan as needed',
      allergies: 'Sulfa drugs',
      preferred_treatment_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      budget_range: '100000-150000',
      notes: 'Patient needs comprehensive neurological evaluation'
    },
    {
      patient_id: patientProfiles[3]?.id,
      treatment_id: treatments[3]?.id,
      status: 'treatment_completed',
      symptoms: 'Routine follow-up, monitoring',
      medical_history: 'Breast cancer survivor, Regular follow-ups',
      current_medications: 'Tamoxifen 20mg daily',
      allergies: 'Contrast dye',
      preferred_treatment_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      budget_range: '30000-50000',
      notes: 'Regular oncology follow-up and monitoring'
    },
    {
      patient_id: patientProfiles[4]?.id,
      treatment_id: treatments[4]?.id,
      status: 'pending_quote',
      symptoms: 'Infertility concerns, previous varicocele surgery',
      medical_history: 'Infertility, Previous varicocele surgery',
      current_medications: 'Folic acid supplements',
      allergies: 'None known',
      preferred_treatment_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      budget_range: '200000-300000',
      notes: 'Patient seeking fertility treatment options'
    }
  ]

  for (const caseData of cases) {
    if (!caseData.patient_id || !caseData.treatment_id) continue

    try {
      const { data, error } = await supabase
        .from('cases')
        .insert(caseData)
        .select()

      if (error) {
        console.error('Error creating case:', error.message)
      } else {
        console.log(`✅ Created case for patient: ${patientProfiles.find(p => p.id === caseData.patient_id)?.full_name}`)
      }
    } catch (error) {
      console.error('Error processing case:', error)
    }
  }
}

async function createQuotes() {
  console.log('Creating quotes...')
  
  // Get doctor IDs
  const { data: doctorProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, specialty')
    .eq('role', 'doctor')

  // Get cases
  const { data: cases } = await supabase
    .from('cases')
    .select('id, patient_id, treatment_id, status')

  if (!doctorProfiles || !cases) {
    console.log('No doctors or cases found')
    return
  }

  // Get treatments for pricing
  const { data: treatments } = await supabase
    .from('treatments')
    .select('id, name, base_price')

  const quotes = [
    {
      case_id: cases[0]?.id,
      doctor_id: doctorProfiles[0]?.id, // Cardiologist
      total_cost: 85000,
      breakdown: {
        consultation: 5000,
        procedure: 70000,
        accommodation: 10000
      },
      estimated_duration: '5 days',
      includes: [
        'Pre-operative consultation',
        'Cardiac catheterization',
        '3 nights hospital stay',
        'Post-operative care',
        'Follow-up consultation'
      ],
      terms: 'Payment 50% upfront, 50% before procedure',
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    },
    {
      case_id: cases[1]?.id,
      doctor_id: doctorProfiles[1]?.id, // Orthopedic surgeon
      total_cost: 120000,
      breakdown: {
        consultation: 6000,
        procedure: 100000,
        accommodation: 14000
      },
      estimated_duration: '7 days',
      includes: [
        'Pre-operative consultation',
        'Knee replacement surgery',
        '4 nights hospital stay',
        'Physical therapy sessions',
        'Post-operative follow-up'
      ],
      terms: 'Payment 40% upfront, 60% before procedure',
      valid_until: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'accepted'
    },
    {
      case_id: cases[2]?.id,
      doctor_id: doctorProfiles[2]?.id, // Neurologist
      total_cost: 150000,
      breakdown: {
        consultation: 8000,
        procedure: 120000,
        accommodation: 22000
      },
      estimated_duration: '10 days',
      includes: [
        'Comprehensive neurological evaluation',
        'MRI and CT scans',
        'Specialized neurological procedures',
        '6 nights hospital stay',
        'Follow-up consultations'
      ],
      terms: 'Payment 30% upfront, 70% before procedure',
      valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }
  ]

  for (const quote of quotes) {
    if (!quote.case_id || !quote.doctor_id) continue

    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert(quote)

      if (error) {
        console.error('Error creating quote:', error.message)
      } else {
        console.log(`✅ Created quote for case: ${quote.case_id}`)
      }
    } catch (error) {
      console.error('Error processing quote:', error)
    }
  }
}

async function main() {
  console.log('🌱 Starting dynamic data seeding...\n')

  try {
    await createDoctorProfiles()
    console.log('')
    
    await createPatientProfiles()
    console.log('')
    
    await createMedicalCases()
    console.log('')
    
    await createQuotes()
    console.log('')
    
    console.log('✅ Dynamic data seeding completed!')
    
    // Show final counts
    console.log('\n📊 Final Record Counts:')
    
    const { data: doctors } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'doctor')
    console.log(`👨‍⚕️  Doctors: ${doctors?.length || 0}`)
    
    const { data: patients } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'patient')
    console.log(`👤 Patients: ${patients?.length || 0}`)
    
    const { data: cases } = await supabase
      .from('cases')
      .select('id')
    console.log(`📋 Cases: ${cases?.length || 0}`)
    
    const { data: quotes } = await supabase
      .from('quotes')
      .select('id')
    console.log(`💰 Quotes: ${quotes?.length || 0}`)
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
  }
}

main()
