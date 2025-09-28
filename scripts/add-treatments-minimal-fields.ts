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

// Try with minimal required fields only
const treatments = [
  {
    name: 'MRI Brain Scan',
    base_price: 15000
  },
  {
    name: 'CT Scan Chest',
    base_price: 8000
  },
  {
    name: 'Pediatric Health Checkup',
    base_price: 2500
  },
  {
    name: 'Pediatric Vaccination Package',
    base_price: 5000
  },
  {
    name: 'Ultrasound Abdomen',
    base_price: 3000
  },
  {
    name: 'Child Development Assessment',
    base_price: 3500
  }
]

async function addMinimalTreatments() {
  console.log('🏥 Adding treatments with minimal fields...')
  
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
  
  // Show final state
  console.log('\n📊 Current treatments in database:')
  const { data: treatmentsData } = await supabase
    .from('treatments')
    .select('*')
    .order('name')
  
  console.log(`Found ${treatmentsData?.length || 0} treatments`)
  treatmentsData?.forEach((treatment, index) => {
    console.log(`${index + 1}. ${treatment.name} - ₹${treatment.base_price}`)
  })
}

// Run the script
addMinimalTreatments()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
