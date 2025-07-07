// middleware.js
import { NextResponse } from 'next/server';
// import { track } from '@vercel/analytics/server';

// Get the channel name from the query string for each API request
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const obj = Object.fromEntries(request.nextUrl.searchParams);
  /* 
  track('channelName', {
    channel: obj.channel ?? "none",
    path: pathname
  });
 */
  return NextResponse.next();
}

export const config = { matcher: '/api/:path*' }