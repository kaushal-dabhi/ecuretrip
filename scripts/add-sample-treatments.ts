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

const sampleTreatments = [
  {
    name: 'MRI Brain Scan',
    description: 'Comprehensive MRI scan of the brain for diagnostic purposes',
    base_price: 15000,
    category: 'Radiology',
    duration_days: 1,
    included_services: ['MRI Scan', 'Radiologist Report', 'Digital Images'],
    hospital_name: 'Apollo Hospitals'
  },
  {
    name: 'Pediatric Consultation',
    description: 'Complete pediatric health checkup and consultation',
    base_price: 2500,
    category: 'Pediatrics',
    duration_days: 1,
    included_services: ['Doctor Consultation', 'Basic Tests', 'Health Report'],
    hospital_name: 'Fortis Healthcare'
  },
  {
    name: 'CT Scan Chest',
    description: 'High-resolution CT scan of the chest for lung evaluation',
    base_price: 8000,
    category: 'Radiology',
    duration_days: 1,
    included_services: ['CT Scan', 'Radiologist Report', 'Digital Images'],
    hospital_name: 'Apollo Hospitals'
  },
  {
    name: 'Pediatric Vaccination Package',
    description: 'Complete vaccination schedule for children',
    base_price: 5000,
    category: 'Pediatrics',
    duration_days: 1,
    included_services: ['Vaccination', 'Health Checkup', 'Vaccination Record'],
    hospital_name: 'Fortis Healthcare'
  }
]

async function addSampleTreatments() {
  console.log('🏥 Adding sample treatments...')
  
  for (const treatment of sampleTreatments) {
    try {
      console.log(`Creating treatment: ${treatment.name}`)
      
      const { error } = await supabase
        .from('treatments')
        .insert({
          name: treatment.name,
          description: treatment.description,
          base_price: treatment.base_price,
          category: treatment.category,
          duration_days: treatment.duration_days,
          included_services: treatment.included_services,
          hospital_name: treatment.hospital_name,
          created_at: new Date().toISOString()
        })
      
      if (error) {
        console.error(`Error creating treatment ${treatment.name}:`, error)
      } else {
        console.log(`✅ Successfully created treatment: ${treatment.name}`)
      }
    } catch (error) {
      console.error(`Error creating treatment ${treatment.name}:`, error)
    }
  }
  
  console.log('🎉 Sample treatments creation completed!')
  
  // Show current database state
  console.log('\n📊 Current treatments in database:')
  const { data: treatments } = await supabase
    .from('treatments')
    .select('name, base_price, category, hospital_name')
    .order('name')
  
  treatments?.forEach(treatment => {
    console.log(`- ${treatment.name} (${treatment.category}) - ₹${treatment.base_price} - ${treatment.hospital_name}`)
  })
}

// Run the script
addSampleTreatments()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
