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

const sampleDoctors = [
  {
    email: 'dr.rajesh@apollohospitals.com',
    password: 'Doctor123!',
    full_name: 'Dr. Rajesh Kumar',
    specialty: 'Oncology',
    hospital: 'Apollo Hospitals',
    experience: '15 years',
    qualifications: 'MD Oncology, Fellowship in Surgical Oncology',
    languages: 'English, Hindi, Tamil',
    consultation_fee: 2500,
    rating: 4.9,
    cases_completed: 1200,
    response_time: '2 hours',
    verified: true
  },
  {
    email: 'dr.priya@fortishealthcare.com',
    password: 'Doctor123!',
    full_name: 'Dr. Priya Sharma',
    specialty: 'Cardiology',
    hospital: 'Fortis Healthcare',
    experience: '12 years',
    qualifications: 'MD Cardiology, Fellowship in Interventional Cardiology',
    languages: 'English, Hindi',
    consultation_fee: 3000,
    rating: 4.8,
    cases_completed: 950,
    response_time: '1 hour',
    verified: true
  },
  {
    email: 'dr.michael@bumrungrad.com',
    password: 'Doctor123!',
    full_name: 'Dr. Michael Chen',
    specialty: 'Orthopedics',
    hospital: 'Bumrungrad International',
    experience: '18 years',
    qualifications: 'MD Orthopedics, Fellowship in Joint Replacement',
    languages: 'English, Thai, Mandarin',
    consultation_fee: 2800,
    rating: 4.9,
    cases_completed: 1500,
    response_time: '3 hours',
    verified: true
  },
  {
    email: 'dr.sarah@anadolumedicalcenter.com',
    password: 'Doctor123!',
    full_name: 'Dr. Sarah Johnson',
    specialty: 'Neurology',
    hospital: 'Anadolu Medical Center',
    experience: '14 years',
    qualifications: 'MD Neurology, Fellowship in Neuro-oncology',
    languages: 'English, Turkish',
    consultation_fee: 3200,
    rating: 4.7,
    cases_completed: 800,
    response_time: '2 hours',
    verified: true
  },
  {
    email: 'dr.amit@apollohospitals.com',
    password: 'Doctor123!',
    full_name: 'Dr. Amit Patel',
    specialty: 'Dental',
    hospital: 'Apollo Hospitals',
    experience: '10 years',
    qualifications: 'MDS Oral Surgery, Fellowship in Implantology',
    languages: 'English, Hindi, Gujarati',
    consultation_fee: 1500,
    rating: 4.8,
    cases_completed: 600,
    response_time: '1 hour',
    verified: true
  },
  {
    email: 'dr.lisa@bumrungrad.com',
    password: 'Doctor123!',
    full_name: 'Dr. Lisa Wang',
    specialty: 'Cosmetic',
    hospital: 'Bumrungrad International',
    experience: '8 years',
    qualifications: 'MD Plastic Surgery, Fellowship in Aesthetic Surgery',
    languages: 'English, Thai, Mandarin',
    consultation_fee: 4000,
    rating: 4.9,
    cases_completed: 400,
    response_time: '4 hours',
    verified: true
  },
  {
    email: 'dr.ahmed@anadolumedicalcenter.com',
    password: 'Doctor123!',
    full_name: 'Dr. Ahmed Hassan',
    specialty: 'Fertility',
    hospital: 'Anadolu Medical Center',
    experience: '16 years',
    qualifications: 'MD Obstetrics & Gynecology, Fellowship in Reproductive Medicine',
    languages: 'English, Turkish, Arabic',
    consultation_fee: 3500,
    rating: 4.8,
    cases_completed: 700,
    response_time: '2 hours',
    verified: true
  }
]

async function createSampleDoctors() {
  console.log('Creating sample doctors...')
  
  for (const doctor of sampleDoctors) {
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
  
  console.log('Sample doctors creation completed!')
}

// Run the script
createSampleDoctors()
  .then(() => {
    console.log('Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
