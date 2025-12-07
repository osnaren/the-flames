'use client';

import Button from '@/components/ui/Button/Button';
import * as Sentry from '@sentry/nextjs';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Animated FLAMES letters with a glitch/error vibe */}
      <div className="mb-8 flex gap-2">
        {['E', 'R', 'R', 'O', 'R'].map((letter, i) => (
          <div
            key={`${letter}-${i}`}
            className="bg-error/10 text-error shadow-error/20 ring-error/20 flex h-14 w-14 animate-pulse items-center justify-center rounded-lg text-3xl font-bold shadow-lg ring-1"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            {letter}
          </div>
        ))}
      </div>

      <div className="mb-8 space-y-4">
        <h2 className="text-on-surface text-4xl font-bold tracking-tight md:text-5xl">
          Relationship Status: <span className="text-error">Complicated</span>
        </h2>
        <p className="text-on-surface-variant mx-auto max-w-md text-lg">
          Something went wrong while calculating your destiny. Even the flames need a break sometimes.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-error-container text-on-error-container mx-auto mt-4 max-w-lg rounded-lg p-4 text-left text-sm">
            <p className="font-mono font-bold">Error: {error.message}</p>
            {error.digest && <p className="mt-1 font-mono text-xs opacity-80">Digest: {error.digest}</p>}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={() => reset()} variant="primary" size="lg" icon={RefreshCcw}>
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg" icon={Home}>
            Go Home
          </Button>
        </Link>
      </div>

      <div className="text-on-surface-variant/60 mt-12 flex items-center gap-2 text-sm">
        <AlertTriangle className="h-4 w-4" />
        <p>Don't worry, this doesn't affect your actual relationship compatibility!</p>
      </div>
    </div>
  );
}
