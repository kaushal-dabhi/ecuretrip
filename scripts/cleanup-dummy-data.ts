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

// List of dummy doctor emails to remove
const dummyDoctorEmails = [
  'dr.rajesh@apollohospitals.com',
  'dr.priya@fortishealthcare.com',
  'dr.michael@bumrungrad.com',
  'dr.sarah@anadolumedicalcenter.com',
  'dr.amit@apollohospitals.com',
  'dr.lisa@bumrungrad.com',
  'dr.ahmed@anadolumedicalcenter.com'
]

// List of dummy treatment SKUs to remove
const dummyTreatmentSkus = [
  'TKR_STANDARD',
  'TKR_PREMIUM',
  'ANGIOPLASTY',
  'ACL_ARTHRO',
  'CARDIAC_BYPASS',
  'SPINE_FUSION',
  'IVF_CYCLE',
  'THR_PREMIUM'
]

// List of dummy hospital names to remove
const dummyHospitalNames = [
  'Apollo Hospitals',
  'Fortis Healthcare',
  'Bumrungrad International',
  'Anadolu Medical Center'
]

async function cleanupDummyData() {
  console.log('🧹 Starting cleanup of dummy data...')
  
  try {
    // 1. Remove dummy doctors and their auth users
    console.log('👨‍⚕️ Removing dummy doctors...')
    
    for (const email of dummyDoctorEmails) {
      try {
        // Get the profile first to get the user ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single()
        
        if (profile) {
          // Delete from profiles table
          await supabase
            .from('profiles')
            .delete()
            .eq('id', profile.id)
          
          // Delete from auth.users
          await supabase.auth.admin.deleteUser(profile.id)
          
          console.log(`✅ Removed doctor: ${email}`)
        } else {
          console.log(`ℹ️  Doctor not found: ${email}`)
        }
      } catch (error) {
        console.error(`❌ Error removing doctor ${email}:`, error)
      }
    }
    
    // 2. Remove dummy treatments
    console.log('🏥 Removing dummy treatments...')
    
    for (const sku of dummyTreatmentSkus) {
      try {
        const { error } = await supabase
          .from('treatments')
          .delete()
          .eq('sku', sku)
        
        if (error) {
          console.error(`❌ Error removing treatment ${sku}:`, error)
        } else {
          console.log(`✅ Removed treatment: ${sku}`)
        }
      } catch (error) {
        console.error(`❌ Error removing treatment ${sku}:`, error)
      }
    }
    
    // 3. Remove dummy hospitals
    console.log('🏢 Removing dummy hospitals...')
    
    for (const name of dummyHospitalNames) {
      try {
        const { error } = await supabase
          .from('hospitals')
          .delete()
          .eq('name', name)
        
        if (error) {
          console.error(`❌ Error removing hospital ${name}:`, error)
        } else {
          console.log(`✅ Removed hospital: ${name}`)
        }
      } catch (error) {
        console.error(`❌ Error removing hospital ${name}:`, error)
      }
    }
    
    // 4. Clean up any related data (cases, quotes, appointments, messages)
    console.log('🗑️  Cleaning up related data...')
    
    // Remove cases that reference dummy data
    const { error: casesError } = await supabase
      .from('cases')
      .delete()
      .not('patient_id', 'is', null)
    
    if (casesError) {
      console.error('❌ Error cleaning cases:', casesError)
    } else {
      console.log('✅ Cleaned up cases')
    }
    
    // Remove quotes
    const { error: quotesError } = await supabase
      .from('quotes')
      .delete()
      .not('id', 'is', null)
    
    if (quotesError) {
      console.error('❌ Error cleaning quotes:', quotesError)
    } else {
      console.log('✅ Cleaned up quotes')
    }
    
    // Remove appointments
    const { error: appointmentsError } = await supabase
      .from('appointments')
      .delete()
      .not('id', 'is', null)
    
    if (appointmentsError) {
      console.error('❌ Error cleaning appointments:', appointmentsError)
    } else {
      console.log('✅ Cleaned up appointments')
    }
    
    // Remove messages
    const { error: messagesError } = await supabase
      .from('messages')
      .delete()
      .not('id', 'is', null)
    
    if (messagesError) {
      console.error('❌ Error cleaning messages:', messagesError)
    } else {
      console.log('✅ Cleaned up messages')
    }
    
    console.log('🎉 Cleanup completed successfully!')
    
    // 5. Show current database state
    console.log('\n📊 Current database state:')
    
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    
    const { count: treatmentsCount } = await supabase
      .from('treatments')
      .select('*', { count: 'exact', head: true })
    
    const { count: hospitalsCount } = await supabase
      .from('hospitals')
      .select('*', { count: 'exact', head: true })
    
    console.log(`- Profiles: ${profilesCount || 0}`)
    console.log(`- Treatments: ${treatmentsCount || 0}`)
    console.log(`- Hospitals: ${hospitalsCount || 0}`)
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    process.exit(1)
  }
}

// Run the cleanup
cleanupDummyData()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
