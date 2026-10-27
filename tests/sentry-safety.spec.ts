import { expect, test } from '@playwright/test';
import type { ErrorEvent } from '@sentry/nextjs';
import type confetti from 'canvas-confetti';
import { fireResultConfetti, resetResultConfetti } from '../src/lib/result-confetti';
import { filterBrowserEvent } from '../src/lib/sentry-browser-filter';

test('only the confirmed detached Android logger is filtered', () => {
  const nativeException = {
    value: 'Error invoking postMessage: Java object is gone',
    stacktrace: { frames: [{ filename: 'app://navigation_performance_logger_android', function: 'sendDataToNative' }] },
  };
  const nativeEvent: ErrorEvent = { type: undefined, exception: { values: [nativeException] } };
  expect(filterBrowserEvent(nativeEvent)).toBeNull();
  for (const event of [
    {},
    { exception: { values: [{ value: nativeException.value }] } },
    { exception: { values: [{ ...nativeException, value: 'Another error' }] } },
    {
      exception: {
        values: [{ ...nativeException, stacktrace: { frames: [{ filename: 'https://theflames.app/_next/app.js' }] } }],
      },
    },
    { exception: { values: [nativeException, { value: 'Real app failure' }] } },
  ]) {
    const errorEvent: ErrorEvent = { type: undefined, ...event };
    expect(filterBrowserEvent(errorEvent)).toBe(errorEvent);
  }
});

const walletException = {
  type: 'TypeError',
  value: "undefined is not an object (evaluating 'window.ethereum.selectedAddress = undefined')",
  mechanism: { type: 'auto.browser.global_handlers.onerror', handled: false },
  stacktrace: {
    frames: [{ filename: 'app:///', function: 'global code', lineno: 1, colno: 16 }],
  },
};

const extensionException = {
  type: 'Error',
  value: 'Invalid call to runtime.sendMessage(). Tab not found.',
  mechanism: { type: 'auto.browser.global_handlers.onunhandledrejection', handled: false },
};

test('the confirmed wallet injection and stackless extension rejection are filtered', () => {
  for (const filename of ['app:///', 'https://theflames.app/']) {
    const event: ErrorEvent = {
      type: undefined,
      exception: {
        values: [
          { ...walletException, stacktrace: { frames: [{ ...walletException.stacktrace.frames[0], filename }] } },
        ],
      },
    };
    expect(filterBrowserEvent(event)).toBeNull();
  }
  expect(filterBrowserEvent({ type: undefined, exception: { values: [extensionException] } })).toBeNull();
});

test('similar messages, application frames, manual captures and mixed exceptions stay reportable', () => {
  const appFrame = { filename: 'https://theflames.app/_next/static/chunks/app.js', function: 'render' };
  const events: Omit<ErrorEvent, 'type'>[] = [
    { exception: { values: [{ ...walletException, value: 'Cannot read properties of undefined' }] } },
    { exception: { values: [{ ...walletException, stacktrace: undefined }] } },
    { exception: { values: [{ ...walletException, stacktrace: { frames: [appFrame] } }] } },
    { exception: { values: [{ ...walletException, mechanism: { type: 'generic', handled: true } }] } },
    { exception: { values: [{ ...extensionException, value: 'Invalid call to runtime.sendMessage().' }] } },
    { exception: { values: [{ ...extensionException, stacktrace: { frames: [appFrame] } }] } },
    { exception: { values: [{ ...extensionException, mechanism: { type: 'generic', handled: true } }] } },
    { exception: { values: [walletException, { value: 'Real app failure' }] } },
    { exception: { values: [extensionException, { value: 'Real app failure' }] } },
    { exception: { values: [{ value: 'Should not already be working.' }] } },
    { exception: { values: [] } },
  ];
  for (const event of events) {
    const errorEvent: ErrorEvent = { type: undefined, ...event };
    expect(filterBrowserEvent(errorEvent)).toBe(errorEvent);
  }
});

test('failed decoration workers do not reject the result flow or cleanup', async () => {
  const syncFailure = Object.assign(
    () => {
      throw new TypeError('postMessage failed');
    },
    {
      reset: () => {
        throw new TypeError('Worker disposed');
      },
    }
  ) as confetti.CreateTypes;
  const asyncFailure = Object.assign(() => Promise.reject(new TypeError('Bitmap cannot be cloned')), {
    reset: () => {},
  }) as confetti.CreateTypes;
  await expect(fireResultConfetti(syncFailure, { particleCount: 1 })).resolves.toBeUndefined();
  await expect(fireResultConfetti(asyncFailure, { particleCount: 1 })).resolves.toBeUndefined();
  expect(() => resetResultConfetti(syncFailure)).not.toThrow();
});
