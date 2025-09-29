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

async function cleanupDeployedDatabase() {
  console.log('🧹 Cleaning up deployed database...')
  
  try {
    // First, get all current doctors to see what we're dealing with
    const { data: currentDoctors, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor')
    
    if (fetchError) {
      console.error('Error fetching current doctors:', fetchError)
      return
    }
    
    console.log(`📊 Found ${currentDoctors?.length || 0} doctors in deployed database:`)
    currentDoctors?.forEach(doctor => {
      console.log(`  - ${doctor.full_name} (${doctor.specialty}) at ${doctor.hospital}`)
    })
    
    // Delete all current doctors
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('role', 'doctor')
    
    if (deleteError) {
      console.error('Error deleting doctors:', deleteError)
      return
    }
    
    console.log('✅ Deleted all existing doctors')
    
    // Add the 3 specific doctors
    const specificDoctors = [
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
        verified: true,
        image_url: null
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
        verified: true,
        image_url: null
      },
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
        verified: true,
        image_url: null
      }
    ]
    
    console.log('👨‍⚕️ Adding 3 specific doctors...')
    
    for (const doctorData of specificDoctors) {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: doctorData.email,
        password: doctorData.password,
        email_confirm: true
      })
      
      if (authError) {
        console.error(`Error creating auth user for ${doctorData.full_name}:`, authError)
        continue
      }
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: doctorData.email,
          role: 'doctor',
          full_name: doctorData.full_name,
          specialty: doctorData.specialty,
          hospital: doctorData.hospital,
          experience: doctorData.experience,
          qualifications: doctorData.qualifications,
          languages: doctorData.languages,
          consultation_fee: doctorData.consultation_fee,
          rating: doctorData.rating,
          cases_completed: doctorData.cases_completed,
          response_time: doctorData.response_time,
          verified: doctorData.verified,
          image_url: doctorData.image_url
        })
      
      if (profileError) {
        console.error(`Error creating profile for ${doctorData.full_name}:`, profileError)
        continue
      }
      
      console.log(`✅ Added ${doctorData.full_name}`)
    }
    
    // Verify the final state
    const { data: finalDoctors, error: finalError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor')
    
    if (finalError) {
      console.error('Error fetching final doctors:', finalError)
      return
    }
    
    console.log(`\n🎉 Success! Deployed database now has ${finalDoctors?.length || 0} doctors:`)
    finalDoctors?.forEach(doctor => {
      console.log(`  - ${doctor.full_name} (${doctor.specialty}) at ${doctor.hospital}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  }
}

cleanupDeployedDatabase()
