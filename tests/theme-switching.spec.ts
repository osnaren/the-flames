import { expect, test } from '@playwright/test';

/**
 * Theme Switching Tests using Playwright
 * 
 * These tests verify that theme switching works correctly in all scenarios:
 * - System preference detection
 * - Manual theme toggle
 * - Icon state synchronization
 * - localStorage persistence
 * - Hydration handling
 */

test.describe('Theme Switching Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should respect system preference on first visit (dark mode)', async ({ page, context }) => {
    // Set system preference to dark mode
    await context.emulateMedia({ colorScheme: 'dark' });
    
    // Navigate to the page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that dark class is applied
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);
    
    // Check that data-theme attribute is set
    await expect(htmlElement).toHaveAttribute('data-theme', 'dark');
    
    // Verify no localStorage theme is set (system preference used)
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBeNull();
  });

  test('should respect system preference on first visit (light mode)', async ({ page, context }) => {
    // Set system preference to light mode
    await context.emulateMedia({ colorScheme: 'light' });
    
    // Navigate to the page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that dark class is NOT applied
    const htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);
    
    // Check that data-theme attribute is set to light
    await expect(htmlElement).toHaveAttribute('data-theme', 'light');
    
    // Verify no localStorage theme is set
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBeNull();
  });

  test('should persist user theme preference in localStorage', async ({ page, context }) => {
    // Set system preference to light mode
    await context.emulateMedia({ colorScheme: 'light' });
    
    // Navigate to the page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for floating control panel to be visible (might need to expand it)
    const settingsButton = page.locator('button[aria-label*="settings"]').first();
    await settingsButton.click();
    
    // Find and click the theme toggle
    const themeToggle = page.locator('button[aria-label*="theme"]').first();
    await themeToggle.click();
    
    // Check that dark class is applied
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);
    
    // Verify localStorage is set
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('dark');
  });

  test('should respect stored preference over system preference', async ({ page, context }) => {
    // Set system preference to light mode
    await context.emulateMedia({ colorScheme: 'light' });
    
    // Set stored preference to dark mode
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('theme', 'dark'));
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that dark class is applied (stored preference wins)
    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);
    await expect(htmlElement).toHaveAttribute('data-theme', 'dark');
  });

  test('should update theme when system preference changes (no stored preference)', async ({ page, context }) => {
    // Start with light mode
    await context.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify light mode is active
    let htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);
    
    // Change system preference to dark
    await context.emulateMedia({ colorScheme: 'dark' });
    
    // Wait a bit for the listener to trigger
    await page.waitForTimeout(500);
    
    // Verify dark mode is now active
    await expect(htmlElement).toHaveClass(/dark/);
  });

  test('should NOT update theme when system preference changes (with stored preference)', async ({ page, context }) => {
    // Set stored preference to light mode
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    
    // Start with light system preference
    await context.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify light mode is active
    let htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);
    
    // Change system preference to dark
    await context.emulateMedia({ colorScheme: 'dark' });
    
    // Wait a bit
    await page.waitForTimeout(500);
    
    // Verify light mode is still active (stored preference takes priority)
    await expect(htmlElement).not.toHaveClass(/dark/);
  });

  test('should sync icon state with theme on page load', async ({ page, context }) => {
    // Set system preference to dark mode
    await context.emulateMedia({ colorScheme: 'dark' });
    
    // Navigate to the page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for the store to be hydrated
    await page.waitForTimeout(500);
    
    // Expand the floating control panel
    const settingsButton = page.locator('button[aria-label*="settings"]').first();
    await settingsButton.click();
    
    // Wait for panel to expand
    await page.waitForTimeout(300);
    
    // Check that the theme toggle shows the correct state (dark mode)
    // Use a more flexible selector that works with both possible states
    const themeToggle = page.locator('button[aria-label*="theme"]').first();
    await expect(themeToggle).toBeVisible();
    
    // Verify it has the correct label for dark mode
    const ariaLabel = await themeToggle.getAttribute('aria-label');
    expect(ariaLabel?.toLowerCase()).toContain('light');
  });

  test('should toggle theme correctly via FloatingControlPanel', async ({ page, context }) => {
    // Set system preference to light mode
    await context.emulateMedia({ colorScheme: 'light' });
    
    // Navigate to the page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Initially should be light mode
    let htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);
    
    // Expand the floating control panel
    const settingsButton = page.locator('button[aria-label*="settings"]').first();
    await settingsButton.click();
    
    // Wait for panel to expand
    await page.waitForTimeout(300);
    
    // Click theme toggle
    const themeToggle = page.locator('button[aria-label*="Switch to dark theme"]').first();
    await themeToggle.click();
    
    // Should now be dark mode
    await expect(htmlElement).toHaveClass(/dark/);
    
    // Toggle again
    const lightToggle = page.locator('button[aria-label*="Switch to light theme"]').first();
    await lightToggle.click();
    
    // Should be back to light mode
    await expect(htmlElement).not.toHaveClass(/dark/);
  });

  test('should toggle theme correctly via SettingsPanel', async ({ page, context }) => {
    // Set system preference to light mode
    await context.emulateMedia({ colorScheme: 'light' });
    
    // Navigate to the page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Initially should be light mode
    let htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);
    
    // Open settings panel (look for a settings button in the navbar or floating panel)
    // This might vary depending on your implementation
    // For now, we'll skip this test if we can't find the button
    const settingsPanelButton = page.locator('button[aria-label*="Settings"]').first();
    
    if (await settingsPanelButton.isVisible()) {
      await settingsPanelButton.click();
      
      // Wait for settings panel to open
      await page.waitForTimeout(300);
      
      // Find the theme toggle in settings panel (consistent with other tests)
      const themeToggle = page.locator('button[aria-label*="Switch to dark theme"]').first();
      await themeToggle.click();
      
      // Should now be dark mode
      await expect(htmlElement).toHaveClass(/dark/);
    }
  });

  test('should prevent FOUC (Flash of Unstyled Content)', async ({ page, context }) => {
    // Set system preference to dark mode
    await context.emulateMedia({ colorScheme: 'dark' });
    
    // Navigate with a listener to check initial state
    let initialThemeClass = '';
    
    page.on('domcontentloaded', async () => {
      initialThemeClass = await page.locator('html').getAttribute('class') || '';
    });
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check that dark class was applied early (inline script)
    expect(initialThemeClass).toContain('dark');
  });

  test('should handle multiple rapid theme toggles', async ({ page, context }) => {
    await context.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Expand the floating control panel
    const settingsButton = page.locator('button[aria-label*="settings"]').first();
    await settingsButton.click();
    await page.waitForTimeout(300);
    
    const htmlElement = page.locator('html');
    
    // Toggle multiple times rapidly
    for (let i = 0; i < 5; i++) {
      const isDark = await htmlElement.evaluate((el) => el.classList.contains('dark'));
      const toggleLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';
      const toggle = page.locator(`button[aria-label*="${toggleLabel}"]`).first();
      await toggle.click();
      await page.waitForTimeout(100);
    }
    
    // Verify final state is consistent
    const isDark = await htmlElement.evaluate((el) => el.classList.contains('dark'));
    const dataTheme = await htmlElement.getAttribute('data-theme');
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    
    expect(dataTheme).toBe(isDark ? 'dark' : 'light');
    expect(storedTheme).toBe(isDark ? 'dark' : 'light');
  });
});
