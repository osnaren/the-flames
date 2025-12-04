'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setTimeout(() => setMounted(true), 0);
    }
    const media = window.matchMedia(query);

    // Set initial value
    if (media.matches !== matches) {
      setTimeout(() => setMatches(media.matches), 0);
    }

    // Create listener function
    const listener = () => {
      setMatches(media.matches);
    };

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [matches, query, mounted]);

  // Return false on server-side rendering to avoid hydration mismatch
  return mounted ? matches : false;
}
