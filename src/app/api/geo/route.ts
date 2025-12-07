import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Try to get country from Vercel headers
  const country = request.headers.get('x-vercel-ip-country');

  if (country) {
    return NextResponse.json({ country });
  }

  // Fallback for non-Vercel environments
  return NextResponse.json({ country: null });
}
