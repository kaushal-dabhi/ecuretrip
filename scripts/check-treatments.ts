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

async function checkTreatments() {
  console.log('🔍 Checking treatments in database...')
  
  try {
    const { data: treatments, error } = await supabase
      .from('treatments')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching treatments:', error)
      return
    }
    
    console.log(`📊 Found ${treatments?.length || 0} treatments:`)
    
    treatments?.forEach((treatment, index) => {
      console.log(`${index + 1}. ${treatment.name || 'No name'}`)
      console.log(`   Price: ₹${treatment.base_price || 'No price'}`)
      console.log(`   Category: ${treatment.category || 'No category'}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkTreatments()
