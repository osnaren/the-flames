import type { ErrorEvent } from '@sentry/nextjs';

/** Ignore only the confirmed Android host's detached performance bridge. */
export function filterBrowserEvent(event: ErrorEvent): ErrorEvent | null {
  const exceptions = event.exception?.values;
  const detachedNativeLogger =
    exceptions?.length &&
    exceptions.every(
      (exception) =>
        exception.value === 'Error invoking postMessage: Java object is gone' &&
        exception.stacktrace?.frames?.some((frame) =>
          /^(?:app:\/\/)?navigation_performance_logger_android(?::|$)/.test(frame.filename || '')
        )
    );
  return detachedNativeLogger ? null : event;
}
