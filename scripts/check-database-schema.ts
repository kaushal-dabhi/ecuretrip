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

async function checkDatabaseSchema() {
  console.log('🔍 Checking database schema...')
  
  try {
    // Check treatments table structure
    console.log('\n📋 Treatments table structure:')
    const { data: treatments, error: treatmentsError } = await supabase
      .from('treatments')
      .select('*')
      .limit(1)
    
    if (treatmentsError) {
      console.error('Treatments table error:', treatmentsError)
    } else {
      console.log('Treatments table exists and accessible')
      if (treatments && treatments.length > 0) {
        console.log('Sample treatment data:', treatments[0])
      } else {
        console.log('No treatments found')
      }
    }
    
    // Check profiles table structure
    console.log('\n👥 Profiles table structure:')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.error('Profiles table error:', profilesError)
    } else {
      console.log('Profiles table exists and accessible')
      if (profiles && profiles.length > 0) {
        console.log('Sample profile data:', profiles[0])
      } else {
        console.log('No profiles found')
      }
    }
    
    // Check hospitals table structure
    console.log('\n🏥 Hospitals table structure:')
    const { data: hospitals, error: hospitalsError } = await supabase
      .from('hospitals')
      .select('*')
      .limit(1)
    
    if (hospitalsError) {
      console.error('Hospitals table error:', hospitalsError)
    } else {
      console.log('Hospitals table exists and accessible')
      if (hospitals && hospitals.length > 0) {
        console.log('Sample hospital data:', hospitals[0])
      } else {
        console.log('No hospitals found')
      }
    }
    
  } catch (error) {
    console.error('Error checking schema:', error)
  }
}

// Run the script
checkDatabaseSchema()
  .then(() => {
    console.log('✅ Schema check completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Schema check failed:', error)
    process.exit(1)
  })
