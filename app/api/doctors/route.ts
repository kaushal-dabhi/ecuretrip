import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Debug: Log which database we're connecting to
    console.log('🔗 Connecting to Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('🔑 Has service role key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    
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
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor')
      .order('full_name')

    if (error) {
      console.error('Error fetching doctors:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ doctors: data || [] })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 })
  }
}
