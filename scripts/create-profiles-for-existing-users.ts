import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// Doctor data mapping
const doctorData = {
  'dr.singh@ecuretrip.com': {
    full_name: 'Dr. Rajesh Singh',
    role: 'doctor',
    specialty: 'Cardiology',
    hospital: 'Apollo Hospitals, Delhi',
    experience: '15',
    qualifications: 'MD Cardiology, DM Interventional Cardiology',
    languages: 'English, Hindi, Punjabi',
    consultation_fee: 2500,
    response_time: '2 hours'
  },
  'dr.patel@ecuretrip.com': {
    full_name: 'Dr. Priya Patel',
    role: 'doctor',
    specialty: 'Orthopedics',
    hospital: 'Fortis Healthcare, Mumbai',
    experience: '12',
    qualifications: 'MS Orthopedics, Fellowship in Joint Replacement',
    languages: 'English, Hindi, Gujarati',
    consultation_fee: 3000,
    response_time: '1 hour'
  },
  'dr.kumar@ecuretrip.com': {
    full_name: 'Dr. Amit Kumar',
    role: 'doctor',
    specialty: 'Neurology',
    hospital: 'Max Healthcare, Delhi',
    experience: '18',
    qualifications: 'DM Neurology, Fellowship in Stroke Medicine',
    languages: 'English, Hindi',
    consultation_fee: 4000,
    response_time: '3 hours'
  },
  'dr.sharma@ecuretrip.com': {
    full_name: 'Dr. Sunita Sharma',
    role: 'doctor',
    specialty: 'Oncology',
    hospital: 'Tata Memorial Hospital, Mumbai',
    experience: '20',
    qualifications: 'MD Medicine, DM Medical Oncology',
    languages: 'English, Hindi, Marathi',
    consultation_fee: 5000,
    response_time: '4 hours'
  },
  'dr.reddy@ecuretrip.com': {
    full_name: 'Dr. Venkatesh Reddy',
    role: 'doctor',
    specialty: 'Fertility',
    hospital: 'Cloudnine Hospitals, Bangalore',
    experience: '14',
    qualifications: 'MD Obstetrics & Gynecology, Fellowship in Reproductive Medicine',
    languages: 'English, Hindi, Telugu',
    consultation_fee: 3500,
    response_time: '2 hours'
  }
}

// Patient data mapping
const patientData = {
  'john.smith@email.com': {
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
  'sarah.johnson@email.com': {
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
  'michael.brown@email.com': {
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
  'emma.davis@email.com': {
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
  'david.wilson@email.com': {
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
}

async function createProfilesForExistingUsers() {
  console.log('Creating profiles for existing auth users...\n')

  try {
    // Get all auth users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('Error fetching users:', usersError.message)
      return
    }

    console.log(`Found ${users.users.length} auth users\n`)

    for (const user of users.users) {
      const email = user.email!
      const userId = user.id

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()

      if (existingProfile) {
        console.log(`✅ Profile already exists for ${email}`)
        continue
      }

      // Create profile based on email
      if (doctorData[email as keyof typeof doctorData]) {
        const doctorInfo = doctorData[email as keyof typeof doctorData]
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: email,
            full_name: doctorInfo.full_name,
            role: doctorInfo.role,
            specialty: doctorInfo.specialty,
            hospital: doctorInfo.hospital,
            experience: doctorInfo.experience,
            qualifications: doctorInfo.qualifications,
            languages: doctorInfo.languages,
            consultation_fee: doctorInfo.consultation_fee,
            response_time: doctorInfo.response_time
          })

        if (profileError) {
          console.error(`❌ Error creating doctor profile for ${email}:`, profileError.message)
        } else {
          console.log(`✅ Created doctor profile: ${doctorInfo.full_name}`)
        }

      } else if (patientData[email as keyof typeof patientData]) {
        const patientInfo = patientData[email as keyof typeof patientData]
        
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: email,
            full_name: patientInfo.full_name,
            role: patientInfo.role
          })

        if (profileError) {
          console.error(`❌ Error creating patient profile for ${email}:`, profileError.message)
          continue
        }

        // Create patient record
        const { error: patientError } = await supabase
          .from('patients')
          .insert({
            id: userId,
            profile_id: userId
          })

        if (patientError) {
          console.error(`❌ Error creating patient record for ${email}:`, patientError.message)
        } else {
          console.log(`✅ Created patient profile: ${patientInfo.full_name}`)
        }
      } else {
        console.log(`⚠️  No data found for ${email}`)
      }
    }

    console.log('\n=== Creating Medical Cases ===\n')

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

    // Get patient IDs from patients table
    const { data: patientRecords } = await supabase
      .from('patients')
      .select('id, profile_id')

    const cases = [
      {
        patient_id: patientRecords?.[0]?.id,
        treatment_id: treatments[0]?.id,
        status: 'new',
        patient_notes: 'Chest pain, shortness of breath, fatigue. Patient seeking second opinion for cardiac evaluation. Medical history: Hypertension, Family history of heart disease. Current medications: Lisinopril 10mg daily. Allergies: Penicillin.'
      },
      {
        patient_id: patientRecords?.[1]?.id,
        treatment_id: treatments[1]?.id,
        status: 'quoted',
        patient_notes: 'Knee pain, difficulty walking, stiffness. Patient considering knee replacement surgery. Medical history: Osteoarthritis, Previous knee injury. Current medications: Ibuprofen as needed. Allergies: None known.'
      },
      {
        patient_id: patientRecords?.[2]?.id,
        treatment_id: treatments[2]?.id,
        status: 'accepted',
        patient_notes: 'Severe headaches, vision problems, dizziness. Patient needs comprehensive neurological evaluation. Medical history: Migraine, Family history of neurological conditions. Current medications: Sumatriptan as needed. Allergies: Sulfa drugs.'
      },
      {
        patient_id: patientRecords?.[3]?.id,
        treatment_id: treatments[3]?.id,
        status: 'closed',
        patient_notes: 'Routine follow-up, monitoring. Regular oncology follow-up and monitoring. Medical history: Breast cancer survivor, Regular follow-ups. Current medications: Tamoxifen 20mg daily. Allergies: Contrast dye.'
      },
      {
        patient_id: patientRecords?.[4]?.id,
        treatment_id: treatments[4]?.id,
        status: 'new',
        patient_notes: 'Infertility concerns, previous varicocele surgery. Patient seeking fertility treatment options. Medical history: Infertility, Previous varicocele surgery. Current medications: Folic acid supplements. Allergies: None known.'
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
          console.log(`✅ Created case for patient: ${patientRecords?.find(p => p.id === caseData.patient_id)?.profile_id}`)
        }
      } catch (error) {
        console.error('Error processing case:', error)
      }
    }

    console.log('\n=== Creating Quotes ===\n')

    // Get doctor IDs
    const { data: doctorProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, specialty')
      .eq('role', 'doctor')

    // Get cases
    const { data: casesData } = await supabase
      .from('cases')
      .select('id, patient_id, treatment_id, status')

    if (!doctorProfiles || !casesData) {
      console.log('No doctors or cases found')
      return
    }

    const quotes = [
      {
        case_id: casesData[0]?.id,
        prepared_by: doctorProfiles[0]?.id, // Cardiologist
        total: 85000,
        currency: 'INR',
        status: 'sent'
      },
      {
        case_id: casesData[1]?.id,
        prepared_by: doctorProfiles[1]?.id, // Orthopedic surgeon
        total: 120000,
        currency: 'INR',
        status: 'accepted'
      },
      {
        case_id: casesData[2]?.id,
        prepared_by: doctorProfiles[2]?.id, // Neurologist
        total: 150000,
        currency: 'INR',
        status: 'sent'
      }
    ]

    for (const quote of quotes) {
      if (!quote.case_id || !quote.prepared_by) continue

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

    console.log('\n✅ Profile creation completed!')
    
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
    
    const { data: casesCount } = await supabase
      .from('cases')
      .select('id')
    console.log(`📋 Cases: ${casesCount?.length || 0}`)
    
    const { data: quotesCount } = await supabase
      .from('quotes')
      .select('id')
    console.log(`💰 Quotes: ${quotesCount?.length || 0}`)
    
  } catch (error) {
    console.error('❌ Error during profile creation:', error)
  }
}

createProfilesForExistingUsers()
