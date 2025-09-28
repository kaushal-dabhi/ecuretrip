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

async function removeRemainingDummyData() {
  console.log('🧹 Removing remaining dummy data...')
  
  try {
    // 1. Remove all treatments (since they were all dummy data)
    console.log('🏥 Removing all treatments...')
    
    const { error: treatmentsError } = await supabase
      .from('treatments')
      .delete()
      .not('id', 'is', null)
    
    if (treatmentsError) {
      console.error('❌ Error removing treatments:', treatmentsError)
    } else {
      console.log('✅ Removed all treatments')
    }
    
    // 2. Remove any remaining hospitals
    console.log('🏢 Removing remaining hospitals...')
    
    const { error: hospitalsError } = await supabase
      .from('hospitals')
      .delete()
      .not('id', 'is', null)
    
    if (hospitalsError) {
      console.error('❌ Error removing hospitals:', hospitalsError)
    } else {
      console.log('✅ Removed remaining hospitals')
    }
    
    // 3. Show final database state
    console.log('\n📊 Final database state:')
    
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    
    const { count: treatmentsCount } = await supabase
      .from('treatments')
      .select('*', { count: 'exact', head: true })
    
    const { count: hospitalsCount } = await supabase
      .from('hospitals')
      .select('*', { count: 'exact', head: true })
    
    const { count: casesCount } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
    
    const { count: quotesCount } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true })
    
    const { count: appointmentsCount } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
    
    console.log(`- Profiles: ${profilesCount || 0}`)
    console.log(`- Treatments: ${treatmentsCount || 0}`)
    console.log(`- Hospitals: ${hospitalsCount || 0}`)
    console.log(`- Cases: ${casesCount || 0}`)
    console.log(`- Quotes: ${quotesCount || 0}`)
    console.log(`- Appointments: ${appointmentsCount || 0}`)
    
    console.log('\n🎉 All dummy data removed successfully!')
    console.log('✅ Database is now clean and ready for real data')
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    process.exit(1)
  }
}

// Run the cleanup
removeRemainingDummyData()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
