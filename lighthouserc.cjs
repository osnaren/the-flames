/**
 * Lighthouse CI Configuration
 * @see https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 *
 * This configuration focuses on accessibility audits for WCAG 2.1 AA compliance.
 */

module.exports = {
  ci: {
    collect: {
      // Use existing dev server instead of starting production build
      // startServerCommand: 'npm run start',
      // startServerReadyPattern: 'Ready',
      // startServerReadyTimeout: 30000,

      // URLs to test - add more routes as needed
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/how-it-works',
        'http://localhost:3000/manual',
        'http://localhost:3000/about',
        'http://localhost:3000/charts',
        'http://localhost:3000/api-docs',
        'http://localhost:3000/privacy',
      ],

      // Run 1 time for faster iteration (increase to 3 for CI)
      numberOfRuns: 1,

      // Chrome flags for better CI compatibility
      settings: {
        chromeFlags: '--no-sandbox --disable-gpu --disable-dev-shm-usage',
        preset: 'desktop',
        // Focus on accessibility-related categories
        onlyCategories: ['accessibility', 'best-practices'],
        // Skip specific audits that aren't relevant
        skipAudits: ['uses-http2', 'uses-long-cache-ttl'],
      },
    },

    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Accessibility assertions - WCAG 2.1 AA compliance
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],

        // Critical accessibility assertions
        'aria-allowed-attr': 'error',
        'aria-hidden-body': 'error',
        'aria-hidden-focus': 'error',
        'aria-required-attr': 'error',
        'aria-required-children': 'error',
        'aria-required-parent': 'error',
        'aria-roles': 'error',
        'aria-valid-attr-value': 'error',
        'aria-valid-attr': 'error',
        'button-name': 'error',
        bypass: 'error', // Skip links
        'color-contrast': 'error',
        'document-title': 'error',
        'duplicate-id-active': 'error',
        'duplicate-id-aria': 'error',
        'form-field-multiple-labels': 'error',
        'frame-title': 'error',
        'heading-order': 'warn',
        'html-has-lang': 'error',
        'html-lang-valid': 'error',
        'image-alt': 'error',
        'input-image-alt': 'error',
        label: 'error',
        'link-name': 'error',
        list: 'error',
        listitem: 'error',
        'meta-viewport': 'error',
        'object-alt': 'error',
        tabindex: 'error',
        'td-headers-attr': 'error',
        'th-has-data-cells': 'error',
        'valid-lang': 'error',
        'video-caption': 'error',

        // Additional important assertions
        'focus-traps': 'error',
        'focusable-controls': 'warn',
        'interactive-element-affordance': 'warn',
        'logical-tab-order': 'warn',
        'managed-focus': 'warn',
        'offscreen-content-hidden': 'warn',
        'use-landmarks': 'warn',
        'visual-order-follows-dom': 'warn',

        // Disable performance assertions for this config (optional)
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:pwa': 'off',
        'categories:seo': 'off',
      },
    },

    upload: {
      // Upload to temporary public storage for CI reports
      target: 'temporary-public-storage',
    },
  },
};
