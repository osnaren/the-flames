'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 font-sans text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100">
        <div className="flex max-w-md flex-col items-center text-center">
          {/* Critical Error Icon/Visual */}
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-5xl dark:bg-red-900/30">
            🔥
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">System Overheat</h1>

          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
            The application encountered a critical error and needs to cool down. We've been notified and are looking
            into it.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => reset()}
              className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
            >
              Reload Application
            </button>
          </div>

          {/* Technical details for dev/debugging if needed, hidden in prod usually but helpful here for context */}
          <div className="mt-12 text-xs text-gray-400 dark:text-gray-600">
            <p>Error Code: 500</p>
            {error.digest && <p>Digest: {error.digest}</p>}
          </div>
        </div>
      </body>
    </html>
  );
}
