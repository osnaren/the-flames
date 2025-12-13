import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

// SEO metadata for redirect page
export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'Terms of Service for FLAMES Game. Read our terms governing your use of the service.',
  path: '/terms',
  noIndex: true, // Don't index redirect pages
});

// Server-side redirect for better SEO
export default function TermsPage() {
  redirect('/privacy#terms');
}
