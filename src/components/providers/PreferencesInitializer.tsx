'use client';

import { useEffect } from 'react';
import { usePreferencesStore } from '@/store/usePreferencesStore';

/**
 * Component that initializes preferences store early in the React lifecycle.
 * This ensures the store is hydrated before any components that depend on it render.
 * Should be mounted at the root level of the app.
 */
export function PreferencesInitializer() {
  useEffect(() => {
    // Initialize preferences store
    const { init } = usePreferencesStore.getState();
    init();

    // Cleanup on unmount
    return () => {
      const { cleanup } = usePreferencesStore.getState();
      cleanup();
    };
  }, []);

  // This component doesn't render anything
  return null;
}
