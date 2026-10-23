import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:3000' });

test.beforeEach(async ({ page }) => {
  await page.route('**/*.sentry.io/**', (route) => route.abort());
  await page.route('https://example.supabase.co/functions/v1/get-country', (route) =>
    route.fulfill({ json: { country: 'IN' } })
  );
});

test('initial calculator loading does not fetch optional media or external fonts', async ({ page, isMobile }) => {
  await page.addInitScript(() => {
    const startedAudio: string[] = [];
    // Record playback intent without depending on the host's audio codecs.
    HTMLMediaElement.prototype.play = function () {
      startedAudio.push(this.src);
      return Promise.resolve();
    };
    Object.assign(window, { startedAudio });
  });
  const optionalRequests: string[] = [];
  page.on('request', (request) => {
    if (/fonts\.googleapis|fonts\.gstatic|dotlottie|logo\.lottie|\/sounds\/|supabase\.co/.test(request.url())) {
      optionalRequests.push(request.url());
    }
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('#name1')).toBeVisible();
  await page.waitForTimeout(2000);
  expect(optionalRequests).toEqual([]);
  if (isMobile) {
    await expect(page.locator('[data-background="static"]')).toBeAttached();
    await expect(page.locator('[data-background] canvas')).toHaveCount(0);
  }
  // Deferred music must remain available after a real interaction.
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as Window & { startedAudio?: string[] }).startedAudio?.some((url) => url.includes('/sounds/bgm/'))
      )
    )
    .toBe(true);
});

test('reduced motion keeps the logo lightweight even on hover', async ({ page }) => {
  const animationRequests: string[] = [];
  page.on('request', (request) => {
    if (/dotlottie|logo\.lottie/.test(request.url())) animationRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('banner').getByRole('link', { name: 'FLAMES Home', exact: true }).hover();
  await page.waitForTimeout(500);
  expect(animationRequests).toEqual([]);
});

test('music can be enabled after loading with a saved disabled preference', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('bgm', 'false');
    const startedAudio: string[] = [];
    HTMLMediaElement.prototype.play = function () {
      startedAudio.push(this.src);
      return Promise.resolve();
    };
    Object.assign(window, { startedAudio });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open settings', exact: true }).click();
  await page.getByRole('button', { name: 'Turn on music', exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as Window & { startedAudio?: string[] }).startedAudio?.some((url) => url.includes('/sounds/bgm/'))
      )
    )
    .toBe(true);
});

for (const historyCount of [0, 5]) {
  test(`calculator load stays stable with ${historyCount} saved matches`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'LayoutShift entries are supported by Chromium.');
    await page.addInitScript((count) => {
      const history = Array.from({ length: count }, (_, i) => ({
        id: `perf-${i}`,
        name1: 'Rahul',
        name2: 'Priya',
        result: 'M',
        timestamp: Date.now() - i * 60000,
      }));
      localStorage.setItem('flames-pairing-history', JSON.stringify(history));
      const shifts: number[] = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!shift.hadRecentInput) shifts.push(shift.value);
        }
      }).observe({ type: 'layout-shift', buffered: true });
      Object.assign(window, { measuredShifts: shifts });
    }, historyCount);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Recent matches history' })).toBeAttached();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);
    const totalShift = await page.evaluate(() =>
      (window as Window & { measuredShifts?: number[] }).measuredShifts?.reduce((a, b) => a + b, 0)
    );
    expect(totalShift).toBeLessThanOrEqual(0.1);
  });
}
