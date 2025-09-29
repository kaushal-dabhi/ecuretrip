import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Use service role key for server-side API calls to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    // Get database info
    const { data: doctors, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, hospital')
      .eq('role', 'doctor')
    
    if (error) {
      return NextResponse.json({ 
        error: error.message,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      doctorsCount: doctors?.length || 0,
      doctors: doctors?.map(d => ({ name: d.full_name, hospital: d.hospital })) || []
    })
  } catch (err) {
    return NextResponse.json({ 
      error: 'Failed to test database',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }, { status: 500 })
  }
}
