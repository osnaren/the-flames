'use client';

import { useCallback, useEffect, useRef, useTransition } from 'react';

/** Paint the pending state before replacing an expensive interactive subtree. */
export function useDeferredAction() {
  const [isPending, startTransition] = useTransition();
  const pendingRef = useRef(false);
  const mountedRef = useRef(true);
  const frameRef = useRef<number | null>(null);
  const resolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      resolveRef.current?.();
    };
  }, []);

  const run = useCallback((action: () => void) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    startTransition(async () => {
      await new Promise<void>((resolve) => {
        resolveRef.current = resolve;
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = requestAnimationFrame(() => resolve());
        });
      });
      frameRef.current = null;
      resolveRef.current = null;
      try {
        if (mountedRef.current) startTransition(action);
      } finally {
        pendingRef.current = false;
      }
    });
  }, []);

  return [isPending, run] as const;
}
