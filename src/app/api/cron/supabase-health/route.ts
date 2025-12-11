import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure this route is never statically cached

export async function GET(request: Request) {
  // 1. Security Check (Required)
  // Vercel Cron jobs will send this header with CRON_SECRET from environment variables
  const authHeader = request.headers.get('authorization');

  // CRON_SECRET is required in production - reject if not configured or doesn't match
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Ping Supabase
    // We use the RPC call as it's a core part of our application logic
    // and ensures the database is responsive.
    const start = performance.now();

    // We call the RPC directly to bypass any application-level caching
    // and ensure we actually hit the database.
    const { error } = await supabase.rpc('get_stats_with_trends', {
      time_window: 'today',
      country_code: undefined,
    });

    const duration = performance.now() - start;

    if (error) {
      console.error('Supabase health check failed:', error);
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database check failed',
          error: error.message,
        },
        { status: 500 }
      );
    }

    // 3. Return Success
    return NextResponse.json(
      {
        status: 'ok',
        message: 'Supabase is healthy',
        latency: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Unexpected error in health check:', err);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error',
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
