'use client';

import { useEffect, useRef, useState } from 'react';

type WebVitalMetric = {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
};

type MetricCallback = (metric: WebVitalMetric) => void;

/**
 * Hook to report Web Vitals metrics
 * Useful for monitoring Core Web Vitals (LCP, INP, CLS, TTFB, FCP)
 */
export function useWebVitals(onMetric?: MetricCallback) {
  const reportedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reportMetric = (metric: WebVitalMetric) => {
      // Prevent duplicate reports
      if (reportedRef.current.has(metric.id)) return;
      reportedRef.current.add(metric.id);

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        const color =
          metric.rating === 'good'
            ? 'color: green'
            : metric.rating === 'needs-improvement'
              ? 'color: orange'
              : 'color: red';
        console.log(`%c[Web Vital] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`, color);
      }

      // Call user callback if provided
      onMetric?.(metric);
    };

    // Dynamic import to avoid bundling in production if not needed
    import('web-vitals').then(({ onCLS, onLCP, onTTFB, onINP, onFCP }) => {
      onCLS((metric) =>
        reportMetric({
          name: 'CLS',
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
        })
      );
      onFCP((metric) =>
        reportMetric({
          name: 'FCP',
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
        })
      );
      onLCP((metric) =>
        reportMetric({
          name: 'LCP',
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
        })
      );
      onTTFB((metric) =>
        reportMetric({
          name: 'TTFB',
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
        })
      );
      onINP((metric) =>
        reportMetric({
          name: 'INP',
          value: metric.value,
          rating: metric.rating,
          id: metric.id,
        })
      );
    });
  }, [onMetric]);
}

/**
 * Hook to defer non-critical operations until after first paint
 * Improves LCP by not blocking the main thread
 */
export function useDeferredExecution(callback: () => void, deps: React.DependencyList = []) {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // Use requestIdleCallback if available, otherwise use setTimeout
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(callback, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(callback, 100);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Hook to detect if the user prefers reduced data usage
 * Useful for conditionally loading heavy resources
 */
export function useReducedData(): boolean {
  const [hasReducedData, setHasReducedData] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    // Check for Save-Data header preference
    // @ts-expect-error - connection is not in the Navigator type
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      setHasReducedData(connection.saveData === true || connection.effectiveType === 'slow-2g');
    }
  }, []);

  return hasReducedData;
}

/**
 * Hook to track and optimize long tasks
 * Helps identify INP issues
 */
export function useLongTaskObserver(onLongTask?: (duration: number) => void) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Long tasks are > 50ms
          if (entry.duration > 50) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`[Long Task] Duration: ${entry.duration.toFixed(2)}ms`);
            }
            onLongTask?.(entry.duration);
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
      return () => observer.disconnect();
    } catch {
      // PerformanceObserver for longtask not supported
    }
  }, [onLongTask]);
}
