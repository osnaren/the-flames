import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:3000' });

test.beforeEach(async ({ page }) => {
  await page.route('**/*.sentry.io/**', (route) => route.abort());
  await page.route('https://example.supabase.co/functions/v1/get-country', (route) =>
    route.fulfill({ json: { country: 'IN' } })
  );
});

test('an invalid name shows the validation message without throwing', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#name1').fill('Rahul123');
  await page.locator('#name2').fill('Priya');
  await page.getByRole('button', { name: /Reveal Your FLAMES/ }).click();
  await expect(
    page.getByText('Only letters, spaces, hyphens, apostrophes, and dots are allowed', { exact: true })
  ).toBeVisible();
  expect(errors).toEqual([]);
  await expect(page.locator('#name1')).toHaveValue('Rahul123');
});

for (const battery of ['snapshot', 'rejected', 'non-callable'] as const) {
  test(`optional battery API ${battery} does not break the page`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript((mode) => {
      Object.defineProperty(navigator, 'getBattery', {
        configurable: true,
        value:
          mode === 'non-callable'
            ? true
            : () =>
                mode === 'rejected'
                  ? Promise.reject(new Error('Battery unavailable'))
                  : Promise.resolve({ level: 0.1, charging: false }),
      });
    }, battery);
    await page.goto('/');
    await page.getByRole('button', { name: 'Open settings', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Close settings', exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('unsupported server actions are rejected before rendering a static page', async ({ request }) => {
  const response = await request.post('/api-docs', {
    headers: { 'Next-Action': 'cachefn', 'Content-Type': 'text/x-component', Accept: 'text/x-component' },
    data: '[]',
  });
  expect(response.status()).toBe(405);
  expect(response.headers().allow).toBe('GET, HEAD');
  expect((await request.get('/api-docs', { headers: { RSC: '1' } })).status()).toBe(200);
  const api = await request.post('/api/flames', {
    headers: { 'Next-Action': 'cachefn' },
    data: { name1: 'Rahul', name2: 'Priya' },
  });
  expect(api.status()).toBe(200);
  expect((await api.json()).data.result).toBe('M');
});

test('positive results tolerate hidden canvas measurements and avoid worker bitmap messages', async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Controlled worker fault injection is verified in Chromium.');
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const measured = HTMLCanvasElement.prototype.getBoundingClientRect;
    HTMLCanvasElement.prototype.getBoundingClientRect = function () {
      return this.classList.contains('z-60') ? new DOMRect(0, 0, 0, 0) : measured.call(this);
    };
    const workerErrors: string[] = [];
    const messages: string[] = [];
    Object.assign(window, { confettiWorkerErrors: workerErrors, confettiWorkerMessages: messages });
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options);
        this.addEventListener('error', (error) => workerErrors.push(error.message));
      }
      postMessage(message: unknown, transfer?: Transferable[] | StructuredSerializeOptions) {
        const data = message as { options?: { shapes?: Array<string | { bitmap?: unknown }> } };
        if (data.options) {
          messages.push('burst');
          if (data.options.shapes?.some((shape) => typeof shape === 'object' && 'bitmap' in shape)) {
            throw new TypeError('Bitmap cannot be cloned by this worker');
          }
        }
        if (Array.isArray(transfer)) super.postMessage(message, transfer);
        else super.postMessage(message, transfer);
      }
    };
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('#name1').fill('Rahul');
  await page.locator('#name2').fill('Priya');
  await page.getByRole('button', { name: /Reveal Your FLAMES/ }).click();
  await expect(page.getByRole('button', { name: 'Reset', exact: true })).toBeVisible({ timeout: 45000 });
  await expect
    .poll(() =>
      page.evaluate(() => (window as unknown as { confettiWorkerMessages: string[] }).confettiWorkerMessages.length)
    )
    .toBeGreaterThanOrEqual(2);
  // Navigate away while later cannon bursts can still be pending.
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.locator('#name1')).toBeVisible();
  expect(
    await page.evaluate(() => (window as unknown as { confettiWorkerErrors: string[] }).confettiWorkerErrors)
  ).toEqual([]);
  expect(errors).toEqual([]);
});
