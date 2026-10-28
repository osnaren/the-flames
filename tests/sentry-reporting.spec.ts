import { expect, test } from '@playwright/test';

test.use({ launchOptions: { args: ['--host-resolver-rules=MAP theflames.test 127.0.0.1', '--no-proxy-server'] } });
test.skip(({ browserName }) => browserName !== 'chromium', 'Uses Chromium local hostname resolution.');

for (const sample of [
  { name: 'sampled', value: 0.01 },
  { name: 'unsampled', value: 0.99 },
]) {
  test(`reports application errors while filtering injections (${sample.name})`, async ({ page }) => {
    test.skip(!process.env.CI, 'Requires the production build.');
    const envelopes: string[] = [];
    await page.addInitScript((value) => {
      Math.random = () => value;
      const types: string[] = [];
      const observe = PerformanceObserver.prototype.observe;
      PerformanceObserver.prototype.observe = function (options) {
        types.push(...(options?.type ? [options.type] : options?.entryTypes || []));
        return observe.call(this, options);
      };
      Object.defineProperty(window, 'sentryObserverTypes', { get: () => types });
    }, sample.value);
    // Keep containment active through page-route teardown and page unload.
    await page.context().route('**/*.sentry.io/**', async (route) => {
      envelopes.push(route.request().postData() || '');
      await route.fulfill({ status: 200, body: '{}' });
    });
    // Browser-only DNS mapping serves the local build on a hosted origin.
    await page.goto('http://theflames.test:3000/');
    await expect(page.locator('#name1')).toBeVisible();
    const monitoring = await page.evaluate(() => ({
      supported: PerformanceObserver.supportedEntryTypes.some((type) =>
        ['long-animation-frame', 'longtask'].includes(type)
      ),
      active: ((window as Window & { sentryObserverTypes?: string[] }).sentryObserverTypes || []).some((type) =>
        ['long-animation-frame', 'longtask'].includes(type)
      ),
    }));
    if (monitoring.supported) expect(monitoring.active).toBe(sample.name === 'sampled');
    await page.evaluate(() => {
      const wallet = new TypeError(
        "undefined is not an object (evaluating 'window.ethereum.selectedAddress = undefined')"
      );
      wallet.stack = 'global code@http://theflames.test:3000/:1:16';
      window.dispatchEvent(new ErrorEvent('error', { message: wallet.message, error: wallet }));
      const extension = new Error('Invalid call to runtime.sendMessage(). Tab not found.');
      extension.stack = undefined;
      window.dispatchEvent(
        new PromiseRejectionEvent('unhandledrejection', { promise: Promise.resolve(), reason: extension })
      );
      const application = new Error('Application Sentry reporting regression');
      window.dispatchEvent(new ErrorEvent('error', { message: application.message, error: application }));
    });
    await expect
      .poll(() => envelopes.some((body) => body.includes('Application Sentry reporting regression')))
      .toBe(true);
    // Inspect exception payloads only: breadcrumbs may legitimately mention an injection.
    const exceptions = envelopes.flatMap((body) =>
      body.split('\n').flatMap((line) => {
        try {
          return JSON.parse(line).exception?.values || [];
        } catch {
          return [];
        }
      })
    );
    expect(exceptions.map((exception: { value: string }) => exception.value)).toEqual([
      'Application Sentry reporting regression',
    ]);
    const applicationEvent = envelopes.flatMap((body) =>
      body.split('\n').flatMap((line) => {
        try {
          const event = JSON.parse(line);
          return event.exception?.values?.some(
            (exception: { value: string }) => exception.value === 'Application Sentry reporting regression'
          )
            ? [event]
            : [];
        } catch {
          return [];
        }
      })
    )[0];
    expect(applicationEvent.tags.browser_performance_sampled).toBe(String(sample.name === 'sampled'));
  });
}

test('keeps fully qualified localhost QA telemetry disabled', async ({ page }) => {
  test.skip(!process.env.CI, 'Requires the production build.');
  const envelopes: string[] = [];
  await page.context().route('**/*.sentry.io/**', async (route) => {
    envelopes.push(route.request().postData() || '');
    await route.fulfill({ status: 200, body: '{}' });
  });
  await page.goto('http://localhost.:3000/');
  await expect(page.locator('#name1')).toBeVisible();
  await page.evaluate(() => {
    const error = new Error('Local QA telemetry regression');
    window.dispatchEvent(new ErrorEvent('error', { message: error.message, error }));
  });
  await page.waitForTimeout(1000);
  expect(envelopes).toEqual([]);
});
