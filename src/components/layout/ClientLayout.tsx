'use client';

import { PreferencesInitializer } from '@components/providers';
import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Unified background component that handles all states (seasonal, game, mobile)
const UnifiedBackground = dynamic(() => import('@ui/UnifiedBackground').then((mod) => mod.default), {
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
 *
 * Background Strategy:
 * - UnifiedBackground: Single, highly optimized component that handles:
 *   - Seasonal themes (Valentine, Halloween, etc.)
 *   - Game states (Processing, Result)
 *   - Device capabilities (Mobile optimization via intensity prop)
 *   - Reduced motion preferences
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <PreferencesInitializer />
      <WebVitalsReporter />
      <div className="from-customBg-1 to-customBg-2 relative flex min-h-screen flex-col bg-linear-to-br transition-colors duration-500">
        <UnifiedBackground />
        {children}
        <SponsorFAB />
      </div>
    </>
  );
}
