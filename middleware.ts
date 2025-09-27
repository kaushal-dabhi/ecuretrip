import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Middleware for Supabase-based authentication
  // Currently allowing all requests through
  // Can be enhanced later for route protection if needed
  return NextResponse.next();
}


// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};
