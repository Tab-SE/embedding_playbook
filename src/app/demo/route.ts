import { NextRequest, NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  // Get the pathname from the request URL
  const pathname = request.nextUrl.pathname

  // Check if the pathname is exactly '/demo'
  if (pathname === '/demo') {
    // Redirect to '/demos'
    return NextResponse.redirect(new URL('/demos', request.url))
  }

  // For all other paths under /demo, allow the request to proceed
  return NextResponse.next()
}
