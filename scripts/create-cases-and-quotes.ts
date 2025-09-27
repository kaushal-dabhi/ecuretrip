import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function createCasesAndQuotes() {
  console.log('Creating cases and quotes...\n')

  try {
    // Get patient profiles
    const { data: patientProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'patient')

    if (profilesError) {
      console.error('Error fetching patient profiles:', profilesError.message)
      return
    }

    if (!patientProfiles || patientProfiles.length === 0) {
      console.log('No patient profiles found')
      return
    }

    console.log(`Found ${patientProfiles.length} patient profiles`)

    // Create patient records
    for (const profile of patientProfiles) {
      const { error: patientError } = await supabase
        .from('patients')
        .insert({
          id: profile.id,
          profile_id: profile.id
        })

      if (patientError) {
        console.error(`Error creating patient record for ${profile.full_name}:`, patientError.message)
      } else {
        console.log(`✅ Created patient record: ${profile.full_name}`)
      }
    }

    // Get treatments
    const { data: treatments, error: treatmentsError } = await supabase
      .from('treatments')
      .select('id, name')

    if (treatmentsError) {
      console.error('Error fetching treatments:', treatmentsError.message)
      return
    }

    // Get patient records
    const { data: patientRecords, error: patientsError } = await supabase
      .from('patients')
      .select('id, profile_id')

    if (patientsError) {
      console.error('Error fetching patient records:', patientsError.message)
      return
    }

    console.log(`\nCreating cases...`)

    // Create cases
    const cases = [
      {
        patient_id: patientRecords?.[0]?.id,
        treatment_id: treatments?.[0]?.id,
        status: 'new',
        patient_notes: 'Chest pain, shortness of breath, fatigue. Patient seeking second opinion for cardiac evaluation. Medical history: Hypertension, Family history of heart disease. Current medications: Lisinopril 10mg daily. Allergies: Penicillin.'
      },
      {
        patient_id: patientRecords?.[1]?.id,
        treatment_id: treatments?.[1]?.id,
        status: 'quoted',
        patient_notes: 'Knee pain, difficulty walking, stiffness. Patient considering knee replacement surgery. Medical history: Osteoarthritis, Previous knee injury. Current medications: Ibuprofen as needed. Allergies: None known.'
      },
      {
        patient_id: patientRecords?.[2]?.id,
        treatment_id: treatments?.[2]?.id,
        status: 'accepted',
        patient_notes: 'Severe headaches, vision problems, dizziness. Patient needs comprehensive neurological evaluation. Medical history: Migraine, Family history of neurological conditions. Current medications: Sumatriptan as needed. Allergies: Sulfa drugs.'
      },
      {
        patient_id: patientRecords?.[3]?.id,
        treatment_id: treatments?.[3]?.id,
        status: 'closed',
        patient_notes: 'Routine follow-up, monitoring. Regular oncology follow-up and monitoring. Medical history: Breast cancer survivor, Regular follow-ups. Current medications: Tamoxifen 20mg daily. Allergies: Contrast dye.'
      },
      {
        patient_id: patientRecords?.[4]?.id,
        treatment_id: treatments?.[4]?.id,
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
          const patientName = patientProfiles.find(p => p.id === patientRecords?.find(pr => pr.id === caseData.patient_id)?.profile_id)?.full_name
          console.log(`✅ Created case for patient: ${patientName}`)
        }
      } catch (error) {
        console.error('Error processing case:', error)
      }
    }

    console.log(`\nCreating quotes...`)

    // Get doctor profiles
    const { data: doctorProfiles, error: doctorsError } = await supabase
      .from('profiles')
      .select('id, full_name, specialty')
      .eq('role', 'doctor')

    if (doctorsError) {
      console.error('Error fetching doctor profiles:', doctorsError.message)
      return
    }

    // Get cases
    const { data: casesData, error: casesError } = await supabase
      .from('cases')
      .select('id, patient_id, treatment_id, status')

    if (casesError) {
      console.error('Error fetching cases:', casesError.message)
      return
    }

    const quotes = [
      {
        case_id: casesData?.[0]?.id,
        prepared_by: doctorProfiles?.[0]?.id, // Cardiologist
        total: 85000,
        currency: 'INR',
        status: 'sent'
      },
      {
        case_id: casesData?.[1]?.id,
        prepared_by: doctorProfiles?.[1]?.id, // Orthopedic surgeon
        total: 120000,
        currency: 'INR',
        status: 'accepted'
      },
      {
        case_id: casesData?.[2]?.id,
        prepared_by: doctorProfiles?.[2]?.id, // Neurologist
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

    console.log('\n✅ Cases and quotes creation completed!')
    
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
    console.error('❌ Error during creation:', error)
  }
}

createCasesAndQuotes()
