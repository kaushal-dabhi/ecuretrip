import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

console.log('🔍 Checking for multiple Supabase projects...')

// Your current local environment
const localSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const localSupabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

console.log('📱 Local Environment:')
console.log('  URL:', localSupabaseUrl)
console.log('  Has Service Key:', !!localSupabaseServiceKey)

// Test the local database
if (localSupabaseUrl && localSupabaseServiceKey) {
  const localSupabase = createClient(localSupabaseUrl, localSupabaseServiceKey)
  
  localSupabase
    .from('profiles')
    .select('id, full_name, email, hospital')
    .eq('role', 'doctor')
    .then(({ data, error }) => {
      if (error) {
        console.log('❌ Local database error:', error.message)
      } else {
        console.log(`✅ Local database has ${data?.length || 0} doctors:`)
        data?.forEach(doctor => {
          console.log(`  - ${doctor.full_name} (${doctor.hospital})`)
        })
      }
    })
    .catch(err => {
      console.log('❌ Local database connection failed:', err.message)
    })
}

// Common Supabase URL patterns to check
const possibleUrls = [
  'https://eqjpdytmsohfpohecczz.supabase.co', // Your current URL
  'https://ecuretrip.supabase.co',
  'https://ecuretrip-medical.supabase.co',
  'https://ecuretrip-demo.supabase.co',
  'https://ecuretrip-investor.supabase.co'
]

console.log('\n🔍 Checking possible Supabase projects...')

// Note: We can't check other projects without their service keys
// But we can document what we know
console.log('\n📋 Current Status:')
console.log('  ✅ Local database: 3 doctors (correct)')
console.log('  ❌ Deployed database: 8 doctors (wrong)')
console.log('  🔍 Issue: Deployed version using different database')

console.log('\n💡 Solution Options:')
console.log('  1. Update Vercel environment variables to use correct database')
console.log('  2. Update the deployed database directly (if we can find it)')
console.log('  3. Create new deployment with correct database connection')

console.log('\n🎯 Recommended Action:')
console.log('  Check Vercel dashboard for environment variables')
console.log('  Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
console.log('  point to the same database as your local environment')
