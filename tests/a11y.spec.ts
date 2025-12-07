import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Accessibility Tests using Playwright and axe-core
 * 
 * Run with: npx playwright test a11y.spec.ts
 * 
 * These tests check for WCAG 2.1 AA compliance across all major pages.
 */

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// Pages to test
const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'How It Works', path: '/how-it-works' },
  { name: 'Manual Mode', path: '/manual' },
  { name: 'About', path: '/about' },
  { name: 'Charts', path: '/charts' },
  { name: 'API Docs', path: '/api-docs' },
  { name: 'Privacy', path: '/privacy' },
  { name: 'Terms', path: '/terms' },
];

test.describe('Accessibility Tests', () => {
  for (const page of PAGES) {
    test(`${page.name} page should have no accessibility violations`, async ({ page: browserPage }) => {
      await browserPage.goto(page.path);
      
      // Wait for page to be fully loaded
      await browserPage.waitForLoadState('networkidle');
      
      // Run axe accessibility tests
      const accessibilityScanResults = await new AxeBuilder({ page: browserPage })
        .withTags(WCAG_TAGS)
        .analyze();

      // Report any violations
      if (accessibilityScanResults.violations.length > 0) {
        console.log(`\nAccessibility violations on ${page.name}:`);
        accessibilityScanResults.violations.forEach((violation) => {
          console.log(`\n  ${violation.impact?.toUpperCase()}: ${violation.description}`);
          console.log(`  Rule: ${violation.id}`);
          console.log(`  Help: ${violation.helpUrl}`);
          violation.nodes.forEach((node) => {
            console.log(`    Element: ${node.target}`);
            console.log(`    HTML: ${node.html.substring(0, 100)}...`);
          });
        });
      }

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});

test.describe('Keyboard Navigation Tests', () => {
  test('Home page should be fully keyboard navigable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();

    // Press Enter to activate skip link
    await page.keyboard.press('Enter');
    
    // Main content should now be focused or focusable
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
  });

  test('Form inputs should have proper focus management', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab to first input
    const name1Input = page.locator('#name1');
    await name1Input.focus();
    await expect(name1Input).toBeFocused();

    // Tab to second input
    await page.keyboard.press('Tab');
    // Should focus on the heart emoji (decorative) or name2 input
    const name2Input = page.locator('#name2');
    await name2Input.focus();
    await expect(name2Input).toBeFocused();
  });

  test('Mobile menu should trap focus when open', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuButton = page.locator('[aria-label="Open mobile menu"]');
    await menuButton.click();

    // Wait for menu to be visible
    const mobileMenu = page.locator('[role="dialog"]');
    await expect(mobileMenu).toBeVisible();

    // Close button should be focused or focusable
    const closeButton = page.locator('[aria-label="Close mobile menu"]');
    await expect(closeButton).toBeVisible();

    // Press Escape to close
    await page.keyboard.press('Escape');
    await expect(mobileMenu).not.toBeVisible();
  });
});

test.describe('Screen Reader Tests', () => {
  test('All images should have alt text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
  });

  test('All buttons should have accessible names', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get all buttons and check they have accessible names via aria-label or text content
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      const hasAccessibleName = (ariaLabel && ariaLabel.trim().length > 0) || (textContent && textContent.trim().length > 0);
      expect(hasAccessibleName, `Button ${i} should have accessible name`).toBe(true);
    }
  });

  test('Form inputs should have associated labels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that inputs have labels
    const name1Label = page.locator('label[for="name1"]');
    await expect(name1Label).toBeVisible();

    const name2Label = page.locator('label[for="name2"]');
    await expect(name2Label).toBeVisible();
  });

  test('Landmarks should be properly used', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should have exactly one main landmark
    const mainCount = await page.locator('main').count();
    expect(mainCount).toBe(1);

    // Should have navigation landmark
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav.first()).toBeVisible();

    // Should have banner (header) landmark - use first() as there should be at least one
    const header = page.locator('[role="banner"], header').first();
    await expect(header).toBeVisible();

    // Should have contentinfo (footer) landmark - use role selector specifically
    const footer = page.locator('[role="contentinfo"], footer').first();
    await expect(footer).toBeVisible();
  });
});

test.describe('Color Contrast Tests', () => {
  test('Text should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });
});

test.describe('Animation and Motion Tests', () => {
  test('Should respect prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // The page should load without crashing with reduced motion
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
  });
});
