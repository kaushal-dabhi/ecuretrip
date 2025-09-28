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

// Treatments aligned with your doctors' specialties
const treatments = [
  {
    name: 'MRI Brain Scan',
    base_price: 15000,
    category: 'Radiology',
    description: 'High-resolution MRI scan of the brain for diagnostic purposes'
  },
  {
    name: 'CT Scan Chest',
    base_price: 8000,
    category: 'Radiology', 
    description: 'Comprehensive CT scan of the chest for lung and heart evaluation'
  },
  {
    name: 'Pediatric Health Checkup',
    base_price: 2500,
    category: 'Pediatrics',
    description: 'Complete pediatric health examination and consultation'
  },
  {
    name: 'Pediatric Vaccination Package',
    base_price: 5000,
    category: 'Pediatrics',
    description: 'Comprehensive vaccination schedule for children'
  },
  {
    name: 'Ultrasound Abdomen',
    base_price: 3000,
    category: 'Radiology',
    description: 'Detailed ultrasound examination of abdominal organs'
  },
  {
    name: 'Child Development Assessment',
    base_price: 3500,
    category: 'Pediatrics',
    description: 'Comprehensive assessment of child growth and development'
  }
]

async function addAlignedTreatments() {
  console.log('🏥 Adding treatments aligned with doctor specialties...')
  
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
    .select('name, base_price, category, description')
    .order('name')
  
  treatmentsData?.forEach((treatment, index) => {
    console.log(`${index + 1}. ${treatment.name} (${treatment.category}) - ₹${treatment.base_price}`)
    console.log(`   ${treatment.description}`)
  })
}

// Run the script
addAlignedTreatments()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
