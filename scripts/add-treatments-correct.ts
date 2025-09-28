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

// Let's try with the schema from the SQL file
const treatments = [
  {
    sku: 'MRI_BRAIN_SCAN',
    title: 'MRI Brain Scan',
    price_usd: 200,
    inclusions: ['MRI Scan', 'Radiologist Report', 'Digital Images'],
    exclusions: ['Contrast injection', 'Follow-up consultation'],
    los_days: 1,
    refund_policy: 'Full refund if medically contraindicated',
    milestones: ['Booking', 'Scan', 'Report Delivery']
  },
  {
    sku: 'PEDIATRIC_CONSULTATION',
    title: 'Pediatric Consultation',
    price_usd: 35,
    inclusions: ['Doctor Consultation', 'Basic Tests', 'Health Report'],
    exclusions: ['Specialized tests', 'Medication'],
    los_days: 1,
    refund_policy: 'Full refund if appointment cancelled 24h prior',
    milestones: ['Booking', 'Consultation', 'Report Delivery']
  },
  {
    sku: 'CT_CHEST_SCAN',
    title: 'CT Scan Chest',
    price_usd: 100,
    inclusions: ['CT Scan', 'Radiologist Report', 'Digital Images'],
    exclusions: ['Contrast injection', 'Follow-up consultation'],
    los_days: 1,
    refund_policy: 'Full refund if medically contraindicated',
    milestones: ['Booking', 'Scan', 'Report Delivery']
  },
  {
    sku: 'PEDIATRIC_VACCINATION',
    title: 'Pediatric Vaccination Package',
    price_usd: 65,
    inclusions: ['Vaccination', 'Health Checkup', 'Vaccination Record'],
    exclusions: ['Travel vaccines', 'Specialized vaccines'],
    los_days: 1,
    refund_policy: 'Full refund if appointment cancelled 24h prior',
    milestones: ['Booking', 'Vaccination', 'Record Delivery']
  }
]

async function addTreatments() {
  console.log('🏥 Adding treatments...')
  
  for (const treatment of treatments) {
    try {
      console.log(`Creating treatment: ${treatment.title}`)
      
      const { error } = await supabase
        .from('treatments')
        .insert(treatment)
      
      if (error) {
        console.error(`Error creating treatment ${treatment.title}:`, error)
      } else {
        console.log(`✅ Successfully created treatment: ${treatment.title}`)
      }
    } catch (error) {
      console.error(`Error creating treatment ${treatment.title}:`, error)
    }
  }
  
  console.log('🎉 Treatments creation completed!')
  
  // Show current database state
  console.log('\n📊 Current treatments in database:')
  const { data: treatmentsData } = await supabase
    .from('treatments')
    .select('title, price_usd, sku')
    .order('title')
  
  treatmentsData?.forEach(treatment => {
    console.log(`- ${treatment.title} (${treatment.sku}) - $${treatment.price_usd}`)
  })
}

// Run the script
addTreatments()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
