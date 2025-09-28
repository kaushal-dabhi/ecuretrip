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

// Keep only these 3 doctors
const keepDoctors = [
  'pritesh.shah@ecuretrip.com',
  'gaurav.tiwari@ecuretrip.com', 
  'anuradha.shah@ecuretrip.com'
]

async function cleanupDoctors() {
  console.log('🧹 Cleaning up doctors database...')
  
  try {
    // Get all doctors
    const { data: allDoctors, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor')
    
    if (fetchError) {
      console.error('Error fetching doctors:', fetchError)
      return
    }
    
    console.log(`Found ${allDoctors?.length || 0} doctors in database`)
    
    // Remove doctors not in our keep list
    for (const doctor of allDoctors || []) {
      if (!keepDoctors.includes(doctor.email)) {
        console.log(`🗑️  Removing doctor: ${doctor.full_name} (${doctor.email})`)
        
        // Delete from profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', doctor.id)
        
        if (profileError) {
          console.error(`Error deleting profile for ${doctor.email}:`, profileError)
        } else {
          console.log(`✅ Deleted profile: ${doctor.full_name}`)
        }
        
        // Delete from auth.users
        const { error: authError } = await supabase.auth.admin.deleteUser(doctor.id)
        
        if (authError) {
          console.error(`Error deleting auth user for ${doctor.email}:`, authError)
        } else {
          console.log(`✅ Deleted auth user: ${doctor.full_name}`)
        }
      }
    }
    
    console.log('\n🎉 Doctor cleanup completed!')
    
    // Show final state
    console.log('\n📊 Final doctors in database:')
    const { data: finalDoctors } = await supabase
      .from('profiles')
      .select('full_name, email, specialty, hospital, rating')
      .eq('role', 'doctor')
      .order('full_name')
    
    finalDoctors?.forEach((doctor, index) => {
      console.log(`${index + 1}. ${doctor.full_name} (${doctor.specialty})`)
      console.log(`   Hospital: ${doctor.hospital} - ⭐ ${doctor.rating}`)
    })
    
  } catch (error) {
    console.error('Error during cleanup:', error)
  }
}

// Run the script
cleanupDoctors()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
