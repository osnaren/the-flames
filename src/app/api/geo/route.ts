import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Try to get country from Vercel headers
  const country = request.headers.get('x-vercel-ip-country');

  if (country) {
    return NextResponse.json({ country });
  }

  // Fallback for local development or non-Vercel environments
  // We can return null or a default, letting the client try the Supabase Edge Function
  // or we can try to fetch from a public API here server-side.
  // For now, let's return null so the client can decide (or use the Edge Function fallback).
  return NextResponse.json({ country: null });
}
