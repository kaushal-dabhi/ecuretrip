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

async function checkCurrentDoctors() {
  console.log('🔍 Checking current doctors in database...')
  
  try {
    const { data: doctors, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor')
      .order('full_name')
    
    if (error) {
      console.error('Error fetching doctors:', error)
      return
    }
    
    console.log(`\n📊 Found ${doctors?.length || 0} doctors:`)
    
    doctors?.forEach((doctor, index) => {
      console.log(`\n${index + 1}. ${doctor.full_name}`)
      console.log(`   Email: ${doctor.email}`)
      console.log(`   Specialty: ${doctor.specialty}`)
      console.log(`   Hospital: ${doctor.hospital}`)
      console.log(`   Rating: ⭐ ${doctor.rating}`)
      console.log(`   Verified: ${doctor.verified ? '✅' : '❌'}`)
    })
    
    // Check for duplicates
    const names = doctors?.map(d => d.full_name) || []
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index)
    
    if (duplicates.length > 0) {
      console.log(`\n⚠️  Found duplicate names: ${[...new Set(duplicates)]}`)
    } else {
      console.log('\n✅ No duplicate names found')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the script
checkCurrentDoctors()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
