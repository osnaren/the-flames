'use client';

import { memo } from 'react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

// CSS keyframes as a string for injection
const loadingStyles = `
  @keyframes flame-flicker {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
    25% { transform: scale(1.05) rotate(-2deg); opacity: 0.9; }
    50% { transform: scale(0.95) rotate(2deg); opacity: 1; }
    75% { transform: scale(1.02) rotate(-1deg); opacity: 0.95; }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(236, 72, 153, 0.2); }
    50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.6), 0 0 60px rgba(236, 72, 153, 0.4); }
  }
  @keyframes loading-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes dot-bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }
  .flame-icon { animation: flame-flicker 1.5s ease-in-out infinite; }
  .glow-container { animation: glow-pulse 2s ease-in-out infinite, loading-float 3s ease-in-out infinite; }
  .loading-dot { animation: dot-bounce 1.4s ease-in-out infinite; }
`;

/**
 * Lightweight loading screen optimized for fast FCP
 * Uses CSS animations instead of Framer Motion for initial load
 */
function LoadingScreen({ message = 'Igniting the flames...', fullScreen = true, className = '' }: LoadingScreenProps) {
  return (
    <div
      className={`bg-surface/90 flex flex-col items-center justify-center backdrop-blur-md ${
        fullScreen ? 'fixed inset-0 z-50' : 'h-full min-h-[200px] w-full'
      } ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <style dangerouslySetInnerHTML={{ __html: loadingStyles }} />

      <div className="flex flex-col items-center gap-8">
        {/* Animated Flame Icon */}
        <div className="glow-container relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-orange-500/20 to-pink-500/20">
          {/* Flame SVG */}
          <svg viewBox="0 0 24 24" fill="none" className="flame-icon h-14 w-14" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 22c-4.97 0-9-4.03-9-9 0-4.632 4.667-9.334 7-12 .583.778 1.167 1.556 1.75 2.334C13.417 5.556 15 8.222 15 11c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-.789.32-1.503.836-2.02C8.32 10.497 8 11.211 8 12c0 2.21 1.79 4 4 4s4-1.79 4-4c0-3.866-3.333-7.333-5-10 3.5 2 9 6.5 9 11 0 4.97-4.03 9-9 9z"
              fill="url(#flame-gradient)"
            />
            <defs>
              <linearGradient id="flame-gradient" x1="12" y1="22" x2="12" y2="2" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F97316" />
                <stop offset="0.5" stopColor="#EC4899" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-on-surface bg-linear-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-xl font-semibold tracking-wide">
            {message}
          </p>

          {/* Animated Loading Dots */}
          <div className="flex gap-1.5" aria-hidden="true">
            <span
              className="loading-dot h-2 w-2 rounded-full bg-linear-to-r from-orange-500 to-pink-500"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="loading-dot h-2 w-2 rounded-full bg-linear-to-r from-pink-500 to-purple-500"
              style={{ animationDelay: '160ms' }}
            />
            <span
              className="loading-dot h-2 w-2 rounded-full bg-linear-to-r from-purple-500 to-orange-500"
              style={{ animationDelay: '320ms' }}
            />
          </div>
        </div>

        {/* Subtle Footer */}
        <p className="text-on-surface-variant/50 text-sm">Finding your destiny...</p>
      </div>
    </div>
  );
}

export default memo(LoadingScreen);
