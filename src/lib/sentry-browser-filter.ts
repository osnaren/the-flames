import type { ErrorEvent } from '@sentry/nextjs';

/** Ignore confirmed host/browser injections, preserving mixed application errors. */
export function filterBrowserEvent(event: ErrorEvent): ErrorEvent | null {
  const exceptions = event.exception?.values;
  const browserInjectionOnly =
    exceptions?.length &&
    exceptions.every((exception) => {
      const frames = exception.stacktrace?.frames;
      const detachedNativeLogger =
        exception.value === 'Error invoking postMessage: Java object is gone' &&
        frames?.some((frame) =>
          /^(?:app:\/\/)?navigation_performance_logger_android(?::|$)/.test(frame.filename || '')
        );

      // Brave iOS injects this assignment as a single line in the page context.
      // Match its exact global-code location, never application bundle frames.
      const walletInjection =
        exception.type === 'TypeError' &&
        exception.value === "undefined is not an object (evaluating 'window.ethereum.selectedAddress = undefined')" &&
        exception.mechanism?.type === 'auto.browser.global_handlers.onerror' &&
        exception.mechanism.handled === false &&
        frames?.length === 1 &&
        frames[0].function === 'global code' &&
        frames[0].lineno === 1 &&
        frames[0].colno === 16 &&
        /^(?:app:\/\/\/|https?:\/\/[^/]+\/)$/i.test(frames[0].filename || '');

      // WebKit's extension runtime can reject without a stack after a tab closes.
      // The app has no extension messaging; framed or manually captured errors stay.
      const extensionTabClosed =
        exception.type === 'Error' &&
        exception.value === 'Invalid call to runtime.sendMessage(). Tab not found.' &&
        exception.mechanism?.type === 'auto.browser.global_handlers.onunhandledrejection' &&
        exception.mechanism.handled === false &&
        !frames?.length;

      return detachedNativeLogger || walletInjection || extensionTabClosed;
    });
  return browserInjectionOnly ? null : event;
}
