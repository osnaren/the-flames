import { expect } from '@playwright/test';
import console from 'node:console';
import fs from 'node:fs/promises';
import os from 'node:os';
import process from 'node:process';
import { setTimeout as sleep } from 'node:timers/promises';
import { chromium, devices } from 'playwright';
const dir = process.env.CWV_OUTPUT_DIR || '.cwv';
await fs.mkdir(dir, { recursive: true });
const base = process.env.CWV_BASE || 'https://theflames.app';
const tag = process.env.CWV_TAG || process.env.CWV_DEVICE || 'mobile';
const scenario = process.env.CWV_SCENARIO || 'load';
const touch = process.env.CWV_DEVICE !== 'desktop' && process.env.CWV_INPUT !== 'mouse';
const activate = (locator) => (touch ? locator.tap() : locator.click());
if (process.argv.includes('--wait-for-release')) {
  if (!/^[0-9a-f]{40}$/i.test(process.env.CWV_RELEASE || ''))
    throw new Error('CWV_RELEASE must identify the published commit');
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await globalThis.fetch(base, {
        method: 'HEAD',
        headers: { 'Cache-Control': 'no-cache' },
        signal: globalThis.AbortSignal.timeout(15000),
      });
      const revision = response.headers.get('x-app-revision');
      if (response.ok && revision === process.env.CWV_RELEASE) {
        console.log('Published revision confirmed:', revision);
        process.exit(0);
      }
      console.log('Waiting for production revision:', revision || response.status);
    } catch (error) {
      console.log('Waiting for production:', error.message);
    }
    await sleep(10000);
  }
  throw new Error('Expected production revision was not published within the readiness window');
}
const environment = {
  platform: os.platform(),
  cpu: os.cpus()[0]?.model,
  cores: os.cpus().length,
  freeMemory: os.freemem(),
  loadAverage: os.loadavg(),
};
const vitals = await fs.readFile('node_modules/web-vitals/dist/web-vitals.iife.js', 'utf8');
const browser = await chromium.launch(process.env.CWV_CHANNEL ? { channel: process.env.CWV_CHANNEL } : {});
const results = [];
const routes = process.env.CWV_ROUTES
  ? process.env.CWV_ROUTES.split(',')
  : scenario === 'load'
    ? ['/', '/manual', '/charts', '/how-it-works', '/about']
    : ['/'];
for (const route of routes) {
  const ctx = await browser.newContext({
    ...(process.env.CWV_DEVICE === 'desktop'
      ? { ...devices['Desktop Chrome'], viewport: { width: 1365, height: 900 } }
      : devices['Pixel 5']),
    reducedMotion: 'no-preference',
  });
  await ctx.addInitScript({
    content:
      vitals +
      `;(() => {
  globalThis.cwv={metrics:{},shifts:[],events:[],long:[],lcp:[],observedTypes:[]};
  const nativeObserve=PerformanceObserver.prototype.observe;
  PerformanceObserver.prototype.observe=function(options){globalThis.cwv.observedTypes.push(...(options?.type?[options.type]:options?.entryTypes||[]));return nativeObserve.call(this,options)};
  const record=m=>globalThis.cwv.metrics[m.name]={value:m.value,rating:m.rating};
  webVitals.onLCP(record,{reportAllChanges:true});webVitals.onCLS(record,{reportAllChanges:true});webVitals.onINP(record,{reportAllChanges:true});
  new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)globalThis.cwv.shifts.push({value:e.value,time:e.startTime,sources:e.sources?.map(s=>({node:s.node?.outerHTML?.slice(0,220),before:s.previousRect.toJSON(),after:s.currentRect.toJSON()}))});}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(l=>{for(const e of l.getEntries())if(e.interactionId)globalThis.cwv.events.push({name:e.name,time:e.startTime,duration:e.duration,inputDelay:e.processingStart-e.startTime,handler:e.processingEnd-e.processingStart,presentationDelay:e.startTime+e.duration-e.processingEnd,target:e.target?.outerHTML?.slice(0,220)});}).observe({type:'event',buffered:true,durationThreshold:16});
  new PerformanceObserver(l=>{for(const e of l.getEntries())globalThis.cwv.long.push({time:e.startTime,duration:e.duration});}).observe({type:'longtask',buffered:true});
  new PerformanceObserver(l=>{for(const e of l.getEntries())globalThis.cwv.lcp.push({time:e.startTime,node:e.element?.outerHTML?.slice(0,220)});}).observe({type:'largest-contentful-paint',buffered:true});
 })()`,
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.CWV_CPU || 4) });
  if (scenario === 'load' || process.env.CWV_SLOW_NETWORK === 'true')
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: 200000,
      uploadThroughput: 75000,
    });
  try {
    const response = await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (process.env.CWV_RELEASE) expect(response.headers()['x-app-revision']).toBe(process.env.CWV_RELEASE);
    await expect(page.locator('h1')).toBeVisible({ timeout: 45000 });
    await page.waitForTimeout(8000);
    const initial = await page.evaluate(() => ({
      lcp: globalThis.cwv.lcp.at(-1),
      cls: globalThis.cwv.metrics.CLS,
      fonts: [...globalThis.document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
    }));
    if (scenario === 'game') {
      await activate(page.locator('#name1'));
      await page.locator('#name1').pressSequentially(process.env.CWV_NAME1 || 'Alexanderthegreat', { delay: 35 });
      await activate(page.locator('#name2'));
      await page.locator('#name2').pressSequentially(process.env.CWV_NAME2 || 'ElizabethVictoria', { delay: 35 });
      await activate(page.getByRole('button', { name: /Reveal Your FLAMES/ }));
      await expect(page.getByRole('button', { name: 'Reset', exact: true })).toBeVisible({ timeout: 90000 });
      await page.waitForTimeout(4000);
      await activate(page.getByRole('button', { name: 'Reset', exact: true }));
      await expect(page.locator('#name1')).toBeVisible();
    }
    if (scenario !== 'load' || process.env.CWV_INTERACT !== 'false') {
      await activate(page.getByRole('button', { name: 'Open settings', exact: true }));
      await expect(page.getByRole('group', { name: 'Seasonal theme selector' })).toBeVisible({ timeout: 45000 });
      await expect(page.getByRole('button', { name: /^(Play|Pause) music$/ })).toBeVisible({ timeout: 45000 });
      for (let i = 0; i < 3; i++)
        await activate(page.getByRole('switch', { name: /Switch to (dark|light) theme/i }).first());
      await activate(page.getByRole('button', { name: 'Close settings', exact: true }));
      await page.waitForTimeout(1500);
    }
    const result = await page.evaluate(() => ({
      ...globalThis.cwv,
      navigation: globalThis.performance.getEntriesByType('navigation')[0]?.toJSON(),
      bytes: globalThis.performance.getEntriesByType('resource').reduce((n, r) => n + r.transferSize, 0),
      resources: globalThis.performance
        .getEntriesByType('resource')
        .filter((r) => r.initiatorType === 'link' || r.name.endsWith('.woff2'))
        .map((r) => ({
          url: r.name,
          start: r.startTime,
          responseStart: r.responseStart,
          end: r.responseEnd,
          size: r.transferSize,
        })),
    }));
    results.push({
      route,
      scenario,
      base,
      release: process.env.CWV_RELEASE,
      testedAt: new Date().toISOString(),
      browser: browser.version(),
      channel: process.env.CWV_CHANNEL || 'headless-shell',
      input: touch ? 'touch' : 'mouse',
      cpu: Number(process.env.CWV_CPU || 4),
      initial,
      errors,
      ...result,
    });
    console.log(
      JSON.stringify({
        route,
        initial,
        metrics: result.metrics,
        errors,
        shifts: result.shifts.length,
        worstEvent: Math.max(0, ...result.events.map((e) => e.duration)),
        longTasks: result.long.length,
      })
    );
    await page.screenshot({ path: `${dir}/${tag}-${scenario}-${route.replaceAll('/', '') || 'home'}.png` });
  } catch (e) {
    const partial = await page.evaluate(() => globalThis.cwv).catch(() => ({}));
    results.push({ route, release: process.env.CWV_RELEASE, error: e.stack, errors, ...partial });
    console.log('FAIL', route, e.message);
    await page.screenshot({ path: `${dir}/${tag}-${scenario}-failure.png` }).catch(() => {});
  }
  await fs.writeFile(`${dir}/${tag}-${scenario}.json`, JSON.stringify(results, null, 2));
  await ctx.close();
}
await browser.close();

const thresholds = { LCP: 2500, CLS: 0.1, INP: 200 };
const failures = [];
for (const row of results) {
  if (row.error || row.errors.length) failures.push({ route: row.route, error: row.error || row.errors });
  for (const [metric, limit] of Object.entries(thresholds)) {
    const value = row.metrics?.[metric]?.value;
    if (typeof value !== 'number' || value > limit)
      failures.push({ route: row.route, metric, value: value ?? null, limit });
  }
}
const summary = {
  release: process.env.CWV_RELEASE,
  site: base,
  scenario,
  environment,
  thresholds,
  passed: failures.length === 0,
  failures,
};
await fs.writeFile(`${dir}/${tag}-${scenario}-summary.json`, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
if (failures.length) process.exitCode = 1;
