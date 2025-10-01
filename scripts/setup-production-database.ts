import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupProductionDatabase() {
  console.log('🚀 Setting up production database for eCureTrip...')
  console.log('🔗 Supabase URL:', supabaseUrl)
  
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📖 Reading schema file...')
    
    // Split the schema into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.length === 0) {
        continue
      }
      
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`)
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          // Some errors are expected (like "already exists")
          if (error.message.includes('already exists') || 
              error.message.includes('already enabled') ||
              error.message.includes('already has row security')) {
            console.log(`⚠️  Skipping (already exists): ${error.message.substring(0, 100)}...`)
            continue
          }
          
          console.error(`❌ Error executing statement ${i + 1}:`, error.message)
          console.error('Statement:', statement.substring(0, 200) + '...')
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } catch (err: any) {
        console.error(`❌ Exception executing statement ${i + 1}:`, err.message)
        console.error('Statement:', statement.substring(0, 200) + '...')
      }
    }
    
    console.log('\n🎉 Database setup completed!')
    
    // Verify the setup
    await verifyDatabaseSetup()
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  }
}

async function verifyDatabaseSetup() {
  console.log('\n🔍 Verifying database setup...')
  
  try {
    // Check if tables exist
    const tables = ['profiles', 'appointments', 'payments', 'notifications', 'medical_records', 'audit_logs', 'hospital_partnerships', 'treatments']
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`)
      } else {
        console.log(`✅ Table ${table}: OK`)
      }
    }
    
    // Check sample data
    const { data: hospitals } = await supabase
      .from('hospital_partnerships')
      .select('hospital_name')
      .limit(1)
    
    const { data: treatments } = await supabase
      .from('treatments')
      .select('name')
      .limit(1)
    
    console.log(`✅ Sample hospitals: ${hospitals?.length || 0} found`)
    console.log(`✅ Sample treatments: ${treatments?.length || 0} found`)
    
    console.log('\n🎯 Database verification completed!')
    
  } catch (error) {
    console.error('❌ Error verifying database:', error)
  }
}

// Run the setup
setupProductionDatabase()
