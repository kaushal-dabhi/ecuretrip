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

// Try with common medical categories
const treatments = [
  {
    name: 'MRI Brain Scan',
    base_price: 15000,
    category: 'Oncology',
    description: 'Comprehensive MRI scan of the brain for diagnostic purposes'
  },
  {
    name: 'Pediatric Consultation',
    base_price: 2500,
    category: 'Cardiology',
    description: 'Complete pediatric health checkup and consultation'
  },
  {
    name: 'CT Scan Chest',
    base_price: 8000,
    category: 'Orthopedics',
    description: 'High-resolution CT scan of the chest for lung evaluation'
  },
  {
    name: 'Pediatric Vaccination Package',
    base_price: 5000,
    category: 'Neurology',
    description: 'Complete vaccination schedule for children'
  }
]

async function addTreatments() {
  console.log('🏥 Adding treatments...')
  
  for (const treatment of treatments) {
    try {
      console.log(`Creating treatment: ${treatment.name}`)
      
      const { error } = await supabase
        .from('treatments')
        .insert(treatment)
      
      if (error) {
        console.error(`Error creating treatment ${treatment.name}:`, error)
      } else {
        console.log(`✅ Successfully created treatment: ${treatment.name}`)
      }
    } catch (error) {
      console.error(`Error creating treatment ${treatment.name}:`, error)
    }
  }
  
  console.log('🎉 Treatments creation completed!')
  
  // Show current database state
  console.log('\n📊 Current treatments in database:')
  const { data: treatmentsData } = await supabase
    .from('treatments')
    .select('name, base_price, category')
    .order('name')
  
  treatmentsData?.forEach(treatment => {
    console.log(`- ${treatment.name} (${treatment.category}) - ₹${treatment.base_price}`)
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
