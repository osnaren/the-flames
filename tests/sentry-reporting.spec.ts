import { expect, test } from '@playwright/test';

test.use({ launchOptions: { args: ['--host-resolver-rules=MAP theflames.test 127.0.0.1', '--no-proxy-server'] } });
test.skip(({ browserName }) => browserName !== 'chromium', 'Uses Chromium local hostname resolution.');

test('reports application errors while filtering the confirmed injections', async ({ page }) => {
  test.skip(!process.env.CI, 'Requires the production build.');
  const envelopes: string[] = [];
  // Keep containment active through page-route teardown and page unload.
  await page.context().route('**/*.sentry.io/**', async (route) => {
    envelopes.push(route.request().postData() || '');
    await route.fulfill({ status: 200, body: '{}' });
  });
  // Browser-only DNS mapping serves the local build on a hosted origin.
  await page.goto('http://theflames.test:3000/');
  await expect(page.locator('#name1')).toBeVisible();
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
});
