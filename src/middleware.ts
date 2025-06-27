import { NextResponse, type NextRequest } from 'next/server';

// Define the approved websites that can access your API
const allowedOrigins = [
  'https://idea-stream.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002', // The port from your recent logs
];

// The security headers to add to the response
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function middleware(request: NextRequest) {
  // Get the website making the request
  const origin = request.headers.get('origin') ?? '';

  // Check if the website is in our approved list
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle the browser's pre-request check
  const isPreflight = request.method === 'OPTIONS';

  if (isPreflight) {
    if (isAllowedOrigin) {
      // Allow the real request by responding with the correct headers
      return new NextResponse(null, {
        headers: {
          ...corsOptions,
          'Access-Control-Allow-Origin': origin,
        },
      });
    }
    // Block requests from unapproved websites
    return new NextResponse('Bad Request', { status: 400 });
  }

  // For all other simple requests, prepare the response
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    // Add the "allow" header to the response
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // Add the other security headers to all responses
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Tell the middleware to only run on API routes
export const config = {
  matcher: '/api/:path*',
}; 