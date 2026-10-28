// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { filterBrowserEvent } from './src/lib/sentry-browser-filter';

const telemetryEnabled =
  process.env.NODE_ENV === 'production' &&
  typeof window !== 'undefined' &&
  !/(^|\.)localhost$|^127(?:\.\d{1,3}){3}$|^(?:\[?::1\]?|0\.0\.0\.0)$/i.test(
    window.location.hostname.replace(/\.$/, '')
  );
// Head-sample performance instrumentation as well as outgoing traces. The SDK's
// default BrowserTracing integration otherwise observes every page, including
// unsampled visits. Error reporting and its integrations remain enabled for all.
const performanceSampled = telemetryEnabled && Math.random() < 0.1;

Sentry.init({
  dsn: 'https://6955a5782c6e92e948fc950fd15a0730@o4509979151958016.ingest.us.sentry.io/4510494216880128',
  // Production builds also run in local QA. Disable all telemetry there,
  // including traces/logs, rather than filtering only captured exceptions.
  enabled: telemetryEnabled,
  environment: process.env.NODE_ENV,

  // Sample 10% of traces in production to reduce costs
  tracesSampleRate: performanceSampled ? 1 : 0,
  integrations: (integrations) =>
    performanceSampled ? integrations : integrations.filter((integration) => integration.name !== 'BrowserTracing'),
  initialScope: { tags: { browser_performance_sampled: String(performanceSampled) } },

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Disable PII collection for privacy compliance (GDPR)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: false,
  beforeSend: filterBrowserEvent,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
