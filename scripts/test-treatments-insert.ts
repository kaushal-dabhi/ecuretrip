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

async function testTreatmentsInsert() {
  console.log('🧪 Testing treatments table insert...')
  
  try {
    // Try to insert with minimal data first
    const { data, error } = await supabase
      .from('treatments')
      .insert({
        name: 'Test Treatment',
        base_price: 1000
      })
      .select()
    
    if (error) {
      console.error('Insert error:', error)
      
      // Try to get table info
      const { data: tableInfo } = await supabase
        .from('treatments')
        .select('*')
        .limit(0)
      
      console.log('Table info:', tableInfo)
    } else {
      console.log('✅ Insert successful:', data)
      
      // Clean up test record
      await supabase
        .from('treatments')
        .delete()
        .eq('name', 'Test Treatment')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the script
testTreatmentsInsert()
  .then(() => {
    console.log('✅ Test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
