'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <style>{`
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
            50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.6); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
        `}</style>
      </head>
      <body className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-gray-50 to-gray-100 p-4 font-sans text-gray-900 antialiased dark:from-gray-900 dark:to-gray-950 dark:text-gray-100">
        <div className="flex max-w-md flex-col items-center text-center">
          {/* Animated Fire Icon */}
          <div className="animate-pulse-glow animate-float mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-red-500/20 to-orange-500/20">
            <span className="text-6xl" role="img" aria-label="Fire">
              🔥
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in mb-4 bg-linear-to-r from-red-500 to-orange-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
            style={{ opacity: 0 }}
          >
            Flame Out!
          </h1>

          {/* Subtext */}
          <p className="animate-fade-in mb-8 text-lg text-gray-600 delay-100 dark:text-gray-300" style={{ opacity: 0 }}>
            Our love calculator got a little <em>too</em> passionate and crashed. 💔 We're working on it!
          </p>

          {/* Action Buttons */}
          <div className="animate-fade-in flex flex-col gap-3 delay-200 sm:flex-row sm:gap-4" style={{ opacity: 0 }}>
            <button
              onClick={() => reset()}
              className="rounded-xl bg-linear-to-r from-red-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:scale-95 dark:focus:ring-offset-gray-900"
            >
              Reignite 🔥
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:scale-105 hover:border-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
            >
              Start Over
            </button>
          </div>

          {/* Footer */}
          <p
            className="animate-fade-in mt-10 text-sm text-gray-400 delay-300 dark:text-gray-500"
            style={{ opacity: 0 }}
          >
            Error Code: <span className="font-mono">PASSION_OVERFLOW</span>
            {error.digest && <span className="ml-2 font-mono">({error.digest})</span>}
          </p>
        </div>
      </body>
    </html>
  );
}
