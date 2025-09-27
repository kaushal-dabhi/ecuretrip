#!/usr/bin/env tsx
/**
 * Supabase Setup Script
 * 
 * This script helps verify your Supabase setup and can be used to:
 * 1. Test database connection
 * 2. Verify schema is properly set up
 * 3. Check if seed data exists
 * 
 * Usage: npx tsx scripts/setup-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please add to your .env.local:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('treatments').select('count').limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Successfully connected to Supabase')
    return true
  } catch (err) {
    console.error('❌ Connection failed:', err)
    return false
  }
}

async function checkSchema() {
  console.log('🔍 Checking database schema...')
  
  const tables = ['profiles', 'treatments', 'patients', 'cases', 'case_files', 'quotes']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1)
      
      if (error) {
        console.error(`❌ Table ${table} not found:`, error.message)
        return false
      }
      
      console.log(`✅ Table ${table} exists`)
    } catch (err) {
      console.error(`❌ Error checking table ${table}:`, err)
      return false
    }
  }
  
  return true
}

async function checkSeedData() {
  console.log('🔍 Checking seed data...')
  
  try {
    const { data: treatments, error } = await supabase
      .from('treatments')
      .select('*')
    
    if (error) {
      console.error('❌ Error fetching treatments:', error.message)
      return false
    }
    
    if (treatments && treatments.length >= 5) {
      console.log(`✅ Found ${treatments.length} treatments`)
      treatments.forEach((treatment, index) => {
        console.log(`   ${index + 1}. ${treatment.name} - ${treatment.category}`)
      })
      return true
    } else {
      console.log('⚠️  Found', treatments?.length || 0, 'treatments (expected 5)')
      console.log('   Run the SQL schema to add seed data')
      return false
    }
  } catch (err) {
    console.error('❌ Error checking seed data:', err)
    return false
  }
}

async function main() {
  console.log('🚀 Supabase Setup Verification\n')
  
  const connectionOk = await testConnection()
  if (!connectionOk) {
    console.log('\n💡 Make sure you have:')
    console.log('   1. Created a Supabase project')
    console.log('   2. Added environment variables to .env.local')
    console.log('   3. Run the SQL schema from supabase-schema.sql')
    process.exit(1)
  }
  
  console.log('')
  const schemaOk = await checkSchema()
  if (!schemaOk) {
    console.log('\n💡 Run the SQL commands from supabase-schema.sql in your Supabase SQL Editor')
    process.exit(1)
  }
  
  console.log('')
  const seedOk = await checkSeedData()
  if (!seedOk) {
    console.log('\n💡 The schema exists but seed data is missing')
    console.log('   Run the INSERT statements from supabase-schema.sql')
  }
  
  console.log('\n🎉 Supabase setup verification complete!')
  console.log('   You can now visit /test-supabase to see the treatments')
}

main().catch(console.error)
