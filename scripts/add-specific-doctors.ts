import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const specificDoctors = [
  {
    email: 'pritesh.shah@ecuretrip.com',
    password: 'Doctor123!',
    full_name: 'Dr. Pritesh Shah',
    specialty: 'Radiology',
    hospital: 'Apollo Hospitals',
    experience: '12 years',
    qualifications: 'MD Radiology, Fellowship in Interventional Radiology',
    languages: 'English, Hindi, Gujarati',
    consultation_fee: 2500,
    rating: 4.8,
    cases_completed: 850,
    response_time: '2 hours',
    verified: true
  },
  {
    email: 'gaurav.tiwari@ecuretrip.com',
    password: 'Doctor123!',
    full_name: 'Dr. Gaurav Tiwari',
    specialty: 'Pediatrics',
    hospital: 'Fortis Healthcare',
    experience: '8 years',
    qualifications: 'MD Pediatrics, Fellowship in Pediatric Cardiology',
    languages: 'English, Hindi',
    consultation_fee: 2000,
    rating: 4.9,
    cases_completed: 650,
    response_time: '1 hour',
    verified: true
  },
  {
    email: 'anuradha.shah@ecuretrip.com',
    password: 'Doctor123!',
    full_name: 'Dr. Anuradha Shah',
    specialty: 'Radiology',
    hospital: 'Apollo Hospitals',
    experience: '15 years',
    qualifications: 'MD Radiology, Fellowship in Neuroradiology',
    languages: 'English, Hindi, Gujarati',
    consultation_fee: 2800,
    rating: 4.7,
    cases_completed: 1200,
    response_time: '3 hours',
    verified: true
  }
]

async function addSpecificDoctors() {
  console.log('👨‍⚕️ Adding specific doctors...')
  
  for (const doctor of specificDoctors) {
    try {
      console.log(`Creating doctor: ${doctor.full_name}`)
      
      // Create user in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: doctor.email,
        password: doctor.password,
        email_confirm: true
      })
      
      if (authError) {
        console.error(`Error creating auth user for ${doctor.email}:`, authError)
        continue
      }
      
      if (!authData.user) {
        console.error(`No user data returned for ${doctor.email}`)
        continue
      }
      
      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          role: 'doctor',
          full_name: doctor.full_name,
          email: doctor.email,
          specialty: doctor.specialty,
          hospital: doctor.hospital,
          experience: doctor.experience,
          qualifications: doctor.qualifications,
          languages: doctor.languages,
          consultation_fee: doctor.consultation_fee,
          rating: doctor.rating,
          cases_completed: doctor.cases_completed,
          response_time: doctor.response_time,
          verified: doctor.verified
        })
      
      if (profileError) {
        console.error(`Error creating profile for ${doctor.email}:`, profileError)
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id)
        continue
      }
      
      console.log(`✅ Successfully created doctor: ${doctor.full_name}`)
      
    } catch (error) {
      console.error(`Error creating doctor ${doctor.full_name}:`, error)
    }
  }
  
  console.log('🎉 Specific doctors creation completed!')
  
  // Show current database state
  console.log('\n📊 Current doctors in database:')
  const { data: doctors } = await supabase
    .from('profiles')
    .select('full_name, specialty, hospital, rating')
    .eq('role', 'doctor')
    .order('full_name')
  
  doctors?.forEach(doctor => {
    console.log(`- ${doctor.full_name} (${doctor.specialty}) - ${doctor.hospital} - ⭐ ${doctor.rating}`)
  })
}

// Run the script
addSpecificDoctors()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
