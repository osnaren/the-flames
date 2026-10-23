import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://127.0.0.1:3000', contextOptions: { reducedMotion: 'reduce' } });

for (const route of ['/', '/manual', '/charts']) {
  test(`${route} hydrates without React errors when reduced motion is enabled`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    // The local production build uses a placeholder backend. Keep country
    // detection deterministic without hiding application exceptions.
    await page.route('https://example.supabase.co/functions/v1/get-country', (route) =>
      route.fulfill({ json: { country: 'IN' } })
    );
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    if (route === '/charts') {
      await expect(page.getByText('Total Matches', { exact: true })).toBeVisible({ timeout: 20000 });
    } else {
      await page.locator('#name1').fill('Regression');
      await expect(page.locator('#name1')).toHaveValue('Regression');
    }
    expect(errors).toEqual([]);
  });
}

test('a shared manual game hydrates and opens the saved names', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/manual?name1=Rahul&name2=Priya');
  await expect(page.getByRole('heading', { name: 'First Name: RAHUL', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Second Name: PRIYA', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('changing motion preferences preserves an in-progress calculator entry', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('#name1').fill('Keep my name');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#name1')).toHaveValue('Keep my name');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('#name1')).toHaveValue('Keep my name');
});
