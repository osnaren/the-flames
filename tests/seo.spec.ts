import { expect, test } from '@playwright/test';
import path from 'node:path';
import { calculateFlamesResult, findCommonLetters } from '../src/modules/home/utils';

test.use({ javaScriptEnabled: false, baseURL: 'http://127.0.0.1:3000' });

test('the calculator form renders in the first HTML without JavaScript', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'FLAMES Calculator — Play the Name Game', exact: true })
  ).toBeVisible();
  await expect(page.locator('#name1')).toBeVisible();
  await expect(page.locator('#name2')).toBeVisible();
  await expect(page.locator('#name1')).toBeDisabled();
});

test('the homepage guide and contextual links are readable without JavaScript', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('FLAMES Calculator — Free Online Name Game');
  await expect(page.getByRole('heading', { name: 'What is the FLAMES calculator?', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Worked example: Rahul and Priya' })).toBeVisible();
  const article = page.locator('article').filter({ has: page.locator('#flames-calculator-guide') });
  await expect(article.getByRole('link', { name: 'manual FLAMES mode' })).toHaveAttribute('href', '/manual');
  await expect(article.getByRole('link', { name: 'privacy policy' })).toHaveAttribute('href', '/privacy');
});

test('supporting pages show their primary content before JavaScript', async ({ page }) => {
  await page.goto('/manual');
  await expect(page.getByRole('heading', { level: 1, name: 'FLAMES Manual Mode', exact: true })).toBeVisible();
  await expect(page.locator('#name1')).toBeVisible();
  await page.goto('/how-it-works');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText(/old-fashioned letter-crossing chaos/)).toBeVisible();
  await page.goto('/about');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText(/Remember the days when your biggest worry/)).toBeVisible();
  await page.goto('/charts');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('Total Matches', { exact: true })).toBeVisible();
});

test('the hydrated calculator and visible guide fit the viewport', async ({ browser }, testInfo) => {
  const context = await browser.newContext({
    viewport: testInfo.project.use.viewport,
    isMobile: testInfo.project.use.isMobile,
    javaScriptEnabled: true,
    baseURL: 'http://127.0.0.1:3000',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.route('**/*.supabase.co/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'FLAMES Calculator — Play the Name Game' })).toBeVisible();
  await expect(page.locator('#flames-calculator-guide')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({
    path: path.resolve(`seo-audit-evidence/2026-10-22/home-${testInfo.project.name.replaceAll(' ', '-')}.png`),
    fullPage: true,
  });
  await context.close();
});

test('the homepage has a canonical URL and accurate JSON-LD in the initial HTML', async ({ request }) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toMatch(/rel="canonical" href="https:\/\/theflames\.app\/?"/);
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((match) =>
    JSON.parse(match[1])
  );
  expect(blocks.map((block) => block['@type'])).toEqual(expect.arrayContaining(['WebSite', 'WebApplication']));
  expect(blocks.some((block) => block.potentialAction?.['@type'] === 'SearchAction')).toBe(false);
  expect(blocks.find((block) => block['@type'] === 'Game')).not.toHaveProperty('playMode');
});

test('all shared preview variants opt out of indexing and preserve social previews', async ({ request }) => {
  for (const path of ['/share', '/share?name1=Alice&name2=Bob', '/share?name1=Alice&name2=Bob&result=A']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('name="robots" content="noindex, follow"');
    expect(html).toMatch(/rel="canonical" href="https:\/\/theflames\.app\/?"/);
    expect(html).toContain('property="og:image"');
  }
});

test('sitemap contains canonical public pages without synthetic update dates', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const xml = await response.text();
  expect([...xml.matchAll(/<loc>/g)]).toHaveLength(7);
  expect(xml).not.toContain('<lastmod>');
  expect(xml).not.toContain('/share');
  expect(xml).not.toContain('/terms');
});

test('secondary page schema describes the actual page without invented dates', async ({ request }) => {
  const about = await (await request.get('/about')).text();
  expect(about).toContain('"@type":"AboutPage"');
  expect(about).not.toContain('dateModified');
  const docs = await (await request.get('/api-docs')).text();
  expect(docs).toContain('"@type":"TechArticle"');
  expect(docs).toContain('"@type":"WebAPI"');
});

test('worked example and repeated-letter cancellation agree with the calculator', () => {
  expect(findCommonLetters('Rahul', 'Priya').sort()).toEqual(['a', 'r']);
  expect(calculateFlamesResult('Rahul', 'Priya')).toBe('M');
  expect(findCommonLetters('banana', 'ananya').sort()).toEqual(['a', 'a', 'a', 'n', 'n']);
  expect(calculateFlamesResult('banana', 'ananya')).toBe('E');
  expect(findCommonLetters('Priya Sharma', 'PRIYA').length).toBe(5);
});
