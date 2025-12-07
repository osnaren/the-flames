'use client';

import { useEffect } from 'react';
import type { Metric } from 'web-vitals';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

/**
 * Web Vitals Reporter Component
 * Reports Core Web Vitals metrics for performance monitoring
 *
 * Metrics tracked:
 * - LCP (Largest Contentful Paint): Should be < 2.5s
 * - FCP (First Contentful Paint): Should be < 1.8s
 * - CLS (Cumulative Layout Shift): Should be < 0.1
 * - INP (Interaction to Next Paint): Should be < 200ms
 * - TTFB (Time to First Byte): Should be < 800ms
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    const reportMetric = (metric: Metric) => {
      // In development, log to console with color coding
      if (process.env.NODE_ENV === 'development') {
        const thresholds: Record<string, { good: number; poor: number }> = {
          LCP: { good: 2500, poor: 4000 },
          FCP: { good: 1800, poor: 3000 },
          CLS: { good: 0.1, poor: 0.25 },
          INP: { good: 200, poor: 500 },
          TTFB: { good: 800, poor: 1800 },
        };

        const threshold = thresholds[metric.name];
        let rating: 'good' | 'needs-improvement' | 'poor' = 'good';

        if (threshold) {
          if (metric.value > threshold.poor) {
            rating = 'poor';
          } else if (metric.value > threshold.good) {
            rating = 'needs-improvement';
          }
        }

        const colors = {
          good: 'color: #0cce6b; font-weight: bold',
          'needs-improvement': 'color: #ffa400; font-weight: bold',
          poor: 'color: #ff4e42; font-weight: bold',
        };

        const unit = metric.name === 'CLS' ? '' : 'ms';
        const value = metric.name === 'CLS' ? metric.value.toFixed(3) : Math.round(metric.value);

        console.log(`%c[Web Vital] ${metric.name}: ${value}${unit} (${rating})`, colors[rating]);
      }

    };


    // Register all metric handlers
    onLCP(reportMetric);
    onFCP(reportMetric);
    onCLS(reportMetric);
    onINP(reportMetric);
    onTTFB(reportMetric);
  }, []);

  // This component doesn't render anything
  return null;
}
