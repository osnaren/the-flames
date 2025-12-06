'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamic imports for non-critical components (improves LCP)
const FlameBackground = dynamic(() => import('@ui/FlameBackground'), {
  ssr: false,
  loading: () => null,
});

const SponsorFAB = dynamic(() => import('@components/sponsor/SponsorFAB'), {
  ssr: false,
  loading: () => null,
});

// Web Vitals reporter - only in development or when analytics is needed
const WebVitalsReporter = dynamic(() => import('@/components/performance/WebVitalsReporter'), { ssr: false });

interface ClientLayoutProps {
  children: ReactNode;
}

/**
 * Client-side layout wrapper with dynamic imports for non-critical components
 * This allows us to use ssr: false for components that require client-only rendering
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <WebVitalsReporter />
      <div className="from-customBg-1 to-customBg-2 relative flex min-h-screen flex-col bg-linear-to-br transition-colors duration-500">
        <FlameBackground />
        {children}
        <SponsorFAB />
      </div>
    </>
  );
}
