'use client';

import { PreferencesInitializer, SoundController } from '@components/providers';
import PageTransition from '@layout/PageTransition';
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
 * Provides the client-only application layout and global client-side providers.
 *
 * Renders client-side initializers and controllers together with a dynamic background,
 * page transition wrapper, and sponsor floating action button around the supplied children.
 *
 * @param children - The page content to render inside the layout
 * @returns The layout element containing providers, dynamic background, page transitions, and sponsor UI
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <PreferencesInitializer />
      <SoundController />
      <WebVitalsReporter />
      <div className="from-customBg-1 to-customBg-2 relative flex min-h-screen flex-col bg-linear-to-br transition-colors duration-500">
        <UnifiedBackground />
        <PageTransition>{children}</PageTransition>
        <SponsorFAB />
      </div>
    </>
  );
}