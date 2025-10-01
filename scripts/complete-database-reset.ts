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

console.log('🔗 Using Supabase URL:', supabaseUrl)
console.log('🔑 Service key exists:', !!supabaseServiceKey)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function completeDatabaseReset() {
  console.log('🔥 Complete database reset - removing ALL doctors...')
  
  try {
    // Get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('Error fetching auth users:', authError)
      return
    }
    
    console.log(`📊 Found ${authUsers.users.length} total auth users`)
    
    // Delete ALL auth users (not just doctors)
    for (const user of authUsers.users) {
      try {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
        if (deleteError) {
          console.log(`⚠️ Could not delete user ${user.email}: ${deleteError.message}`)
        } else {
          console.log(`✅ Deleted user: ${user.email}`)
        }
      } catch (error) {
        console.log(`⚠️ Error deleting user ${user.email}: ${error}`)
      }
    }
    
    // Delete ALL profiles
    const { error: deleteProfilesError } = await supabase
      .from('profiles')
      .delete()
      .neq('id', 'dummy') // Delete all profiles
    
    if (deleteProfilesError) {
      console.error('Error deleting all profiles:', deleteProfilesError)
    } else {
      console.log('✅ Deleted all profiles')
    }
    
    // Wait for deletion to propagate
    console.log('⏳ Waiting for deletion to propagate...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Verify everything is deleted
    const { data: remainingProfiles, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
    
    if (verifyError) {
      console.error('Error verifying deletion:', verifyError)
      return
    }
    
    console.log(`✅ Verification: ${remainingProfiles?.length || 0} profiles remaining`)
    
    // Now add ONLY the 3 specific doctors
    console.log('👨‍⚕️ Adding ONLY the 3 specific doctors...')
    
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
    
    for (const doctorData of specificDoctors) {
      try {
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
      } catch (error) {
        console.error(`Error adding ${doctorData.full_name}:`, error)
      }
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
    
    console.log(`\n🎉 SUCCESS! Database now has EXACTLY ${finalDoctors?.length || 0} doctors:`)
    finalDoctors?.forEach(doctor => {
      console.log(`  - ${doctor.full_name} (${doctor.specialty}) at ${doctor.hospital}`)
    })
    
    // Test the API directly
    console.log('\n🧪 Testing API response...')
    const { data: apiDoctors, error: apiError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor')
    
    if (apiError) {
      console.error('API test error:', apiError)
    } else {
      console.log(`API returns ${apiDoctors?.length || 0} doctors`)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

completeDatabaseReset()
