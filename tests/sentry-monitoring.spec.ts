import { expect, test } from '@playwright/test';

for (const hostname of ['localhost', '127.0.0.1']) {
  test(`local browser runs on ${hostname} do not send errors, traces or logs to Sentry`, async ({ page }) => {
    const requests: string[] = [];
    // Contain the failing reproduction so the test itself cannot pollute Sentry.
    await page.route('**/*.sentry.io/**', async (route) => {
      requests.push(route.request().url());
      await route.fulfill({ status: 200, body: '{}' });
    });
    await page.route('https://example.supabase.co/functions/v1/get-country', (route) =>
      route.fulfill({ json: { country: 'IN' } })
    );
    await page.goto(`http://${hostname}:3000/`);
    await expect(page.locator('#name1')).toBeVisible();
    await page.evaluate(() => {
      window.dispatchEvent(
        new ErrorEvent('error', {
          message: 'Local Sentry isolation regression',
          error: new Error('Local Sentry isolation regression'),
        })
      );
    });
    // Errors send immediately; include a full SDK batching interval for traces/logs.
    await page.waitForTimeout(6000);
    expect(requests).toEqual([]);
  });
}

test('charts navigation stays usable without React errors', async ({ page }) => {
  test.setTimeout(60000); // Three full round trips also run on mobile Safari.
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('https://example.supabase.co/functions/v1/get-country', (route) =>
    route.fulfill({ json: { country: 'IN' } })
  );
  await page.route('https://example.supabase.co/rest/v1/rpc/get_stats_with_trends', (route) =>
    route.fulfill({
      json: {
        total: 1,
        today: 1,
        results: [{ result: 'F', current_count: 1, trend_percentage: 0 }],
        recent: [],
        top_countries: [{ country: 'IN', count: 1 }],
      },
    })
  );
  await page.goto('/');
  for (let visit = 0; visit < 3; visit++) {
    await page.getByRole('contentinfo').getByRole('link', { name: 'Global Charts', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'FLAMES Global Charts', exact: true })).toBeVisible();
    await expect(page.getByText('Total Matches', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await expect(page.locator('#name1')).toBeVisible();
  }
  expect(errors).toEqual([]);
});
