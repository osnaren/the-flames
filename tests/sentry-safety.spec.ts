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
