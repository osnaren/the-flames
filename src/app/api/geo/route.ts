import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Try to get country from Vercel headers
    const country = request.headers.get('x-vercel-ip-country');

    if (country) {
      return NextResponse.json({ country });
    }

    // Fallback for non-Vercel environments
    return NextResponse.json({ country: null });
  } catch (error) {
    console.error('Geo API error:', error);
    return NextResponse.json({ country: null }, { status: 500 });
  }
}
