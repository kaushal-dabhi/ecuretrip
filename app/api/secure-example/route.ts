import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { apiRateLimiter, createAuditLog, sanitizeInput } from '@/lib/security'

// Use service role key for server-side operations
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

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting
    if (!apiRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }
    
    // Verify JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    // Create audit log
    const auditLog = createAuditLog(
      user.id,
      'API_ACCESS',
      'secure-example',
      { endpoint: '/api/secure-example', method: 'GET' }
    )
    
    // Log the audit entry (you'd save this to your database)
    console.log('Audit log:', auditLog)
    
    // Return secure data
    return NextResponse.json({
      message: 'Secure data accessed successfully',
      userId: user.id,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting
    if (!apiRateLimiter.isAllowed(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }
    
    // Verify JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    
    // Sanitize input
    const sanitizedData = {
      name: sanitizeInput(body.name || ''),
      email: sanitizeInput(body.email || ''),
      message: sanitizeInput(body.message || '')
    }
    
    // Validate required fields
    if (!sanitizedData.name || !sanitizedData.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }
    
    // Create audit log
    const auditLog = createAuditLog(
      user.id,
      'DATA_CREATE',
      'secure-example',
      { 
        endpoint: '/api/secure-example', 
        method: 'POST',
        dataFields: Object.keys(sanitizedData)
      }
    )
    
    // Log the audit entry
    console.log('Audit log:', auditLog)
    
    // Process the data (save to database, etc.)
    // For now, just return success
    
    return NextResponse.json({
      message: 'Data processed successfully',
      data: sanitizedData,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
