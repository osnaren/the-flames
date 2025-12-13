#!/usr/bin/env node

/**
 * Accessibility Audit Script
 *
 * This script runs comprehensive accessibility audits using:
 * 1. axe-core CLI for WCAG compliance testing
 * 2. Lighthouse CI for accessibility scoring
 *
 * Usage:
 *   npm run a11y:audit              # Run full audit
 *   npm run a11y:audit -- --url URL # Test specific URL
 *   npm run a11y:axe                # Run axe-core only
 *   npm run a11y:lhci               # Run Lighthouse CI only
 */

import { execSync } from 'child_process';

const DEFAULT_URLS = [
  'http://localhost:3000/',
  'http://localhost:3000/how-it-works',
  'http://localhost:3000/manual',
  'http://localhost:3000/about',
  'http://localhost:3000/charts',
];

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

/**
 * Run axe-core CLI audit
 */
async function runAxeAudit(urls) {
  console.log('\n🔍 Running axe-core accessibility audit...\n');

  const results = [];

  for (const url of urls) {
    console.log(`Testing: ${url}`);
    try {
      const command = `npx @axe-core/cli ${url} --tags ${WCAG_TAGS.join(',')} --save axe-results.json`;
      execSync(command, { stdio: 'inherit' });
      results.push({ url, status: 'passed' });
    } catch (error) {
      results.push({ url, status: 'failed', error: error.message });
    }
    console.log('');
  }

  return results;
}

/**
 * Run Lighthouse CI audit
 */
async function runLighthouseAudit() {
  console.log('\n🚀 Running Lighthouse CI accessibility audit...\n');

  try {
    execSync('npx lhci autorun', { stdio: 'inherit' });
    return { status: 'passed' };
  } catch (error) {
    return { status: 'failed', error: error.message };
  }
}

/**
 * Generate summary report
 */
function generateReport(axeResults, lhciResult) {
  console.log('\n📊 Accessibility Audit Summary\n');
  console.log('='.repeat(50));

  console.log('\n📋 axe-core Results:');
  axeResults.forEach(({ url, status }) => {
    const icon = status === 'passed' ? '✅' : '❌';
    console.log(`  ${icon} ${url}`);
  });

  console.log('\n🔦 Lighthouse CI Result:');
  const lhciIcon = lhciResult.status === 'passed' ? '✅' : '❌';
  console.log(`  ${lhciIcon} ${lhciResult.status.toUpperCase()}`);

  if (lhciResult.error) {
    console.log(`     Error: ${lhciResult.error}`);
  }

  const allPassed = axeResults.every((r) => r.status === 'passed') && lhciResult.status === 'passed';

  console.log('\n' + '='.repeat(50));
  console.log(allPassed ? '✨ All accessibility audits passed!' : '⚠️ Some audits failed. Please review the results.');
  console.log('');

  return allPassed;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const urlIndex = args.indexOf('--url');
  const urls = urlIndex !== -1 ? [args[urlIndex + 1]] : DEFAULT_URLS;

  const runAxeOnly = args.includes('--axe-only');
  const runLhciOnly = args.includes('--lhci-only');

  let axeResults = [];
  let lhciResult = { status: 'skipped' };

  if (!runLhciOnly) {
    axeResults = await runAxeAudit(urls);
  }

  if (!runAxeOnly) {
    lhciResult = await runLighthouseAudit();
  }

  const success = generateReport(axeResults, lhciResult);
  process.exit(success ? 0 : 1);
}

main().catch((error) => {
  console.error('Audit failed:', error);
  process.exit(1);
});
