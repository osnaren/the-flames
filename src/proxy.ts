import { NextRequest, NextResponse } from 'next/server';

/**
 * This app has no Server Actions. Reject action POSTs to page routes before
 * Next's static/RSC cache handler; the calculator POST API is excluded below.
 * Revisit this guard if Server Actions are introduced.
 */
export function proxy(request: NextRequest) {
  if (request.method === 'POST') {
    return new NextResponse('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' },
    });
  }
  return NextResponse.next();
}

export const config = {
  // Ordinary page loads, RSC GET navigation, assets and APIs bypass this guard.
  matcher: [{ source: '/((?!api/|_next/).*)', has: [{ type: 'header', key: 'next-action' }] }],
};
