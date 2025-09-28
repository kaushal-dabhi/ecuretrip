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

async function testApiDirect() {
  console.log('🧪 Testing API directly...')
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor')
      .order('full_name')

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log(`Found ${data?.length || 0} doctors:`)
    
    data?.forEach((doctor, index) => {
      console.log(`${index + 1}. ${doctor.full_name}`)
      console.log(`   Email: ${doctor.email}`)
      console.log(`   Hospital: ${doctor.hospital}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testApiDirect()
