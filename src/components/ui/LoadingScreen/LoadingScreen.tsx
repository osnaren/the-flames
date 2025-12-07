'use client';

import { memo } from 'react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Lightweight loading screen optimized for fast FCP
 * Uses CSS animations instead of Framer Motion for initial load
 */
function LoadingScreen({ message = 'Loading...', fullScreen = true, className = '' }: LoadingScreenProps) {
  return (
    <div
      className={`bg-surface/80 flex flex-col items-center justify-center backdrop-blur-md ${fullScreen ? 'fixed inset-0 z-50' : 'h-full min-h-[200px] w-full'} ${className}`}
    >
      <div className="animate-fade-in flex flex-col items-center gap-6">
        {/* Simple animated logo placeholder */}
        <div className="relative">
          {/* Pulse effect behind the logo */}
          <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-xl" />

          {/* Simple flame icon */}
          <div className="relative flex h-16 w-16 items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary h-12 w-12 animate-bounce"
              style={{ animationDuration: '2s' }}
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                fill="currentColor"
                opacity="0.3"
              />
              <path
                d="M13.5 5.5c0 2.5-2 4-2 6.5 0 1.5 1.12 2.75 2.5 2.95V17c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2.05c1.38-.2 2.5-1.45 2.5-2.95 0-2.5-2-4-2-6.5 0-1.5.68-2.85 1.75-3.75C13.18 2.35 14.5 3.75 14.5 5.5h-1z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-on-surface text-lg font-medium tracking-wider">{message}</p>

          {/* CSS-only loading dots */}
          <div className="flex gap-1">
            <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full" style={{ animationDelay: '0ms' }} />
            <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full" style={{ animationDelay: '150ms' }} />
            <span className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(LoadingScreen);
