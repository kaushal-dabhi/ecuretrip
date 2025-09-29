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

async function updateExistingDoctors() {
  console.log('🔄 Updating existing doctors...')
  
  try {
    // Get all auth users to find the existing doctors
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('Error fetching auth users:', authError)
      return
    }
    
    console.log(`📊 Found ${authUsers.users.length} auth users`)
    
    // Find the 3 specific doctor emails
    const targetEmails = [
      'anuradha.shah@ecuretrip.com',
      'gaurav.tiwari@ecuretrip.com',
      'pritesh.shah@ecuretrip.com'
    ]
    
    const existingDoctors = authUsers.users.filter(user => 
      targetEmails.includes(user.email || '')
    )
    
    console.log(`👨‍⚕️ Found ${existingDoctors.length} existing doctor auth users:`)
    existingDoctors.forEach(doctor => {
      console.log(`  - ${doctor.email}`)
    })
    
    // Create profiles for existing auth users
    const doctorData = [
      {
        email: 'anuradha.shah@ecuretrip.com',
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
    
    for (const data of doctorData) {
      // Find the auth user for this email
      const authUser = existingDoctors.find(user => user.email === data.email)
      
      if (!authUser) {
        console.log(`⚠️ No auth user found for ${data.email}`)
        continue
      }
      
      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          email: data.email,
          role: 'doctor',
          full_name: data.full_name,
          specialty: data.specialty,
          hospital: data.hospital,
          experience: data.experience,
          qualifications: data.qualifications,
          languages: data.languages,
          consultation_fee: data.consultation_fee,
          rating: data.rating,
          cases_completed: data.cases_completed,
          response_time: data.response_time,
          verified: data.verified,
          image_url: data.image_url
        })
      
      if (profileError) {
        console.error(`Error creating/updating profile for ${data.full_name}:`, profileError)
        continue
      }
      
      console.log(`✅ Updated ${data.full_name}`)
    }
    
    // Final verification
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

updateExistingDoctors()
