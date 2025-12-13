import { fontVariables } from '@/lib/fonts';
import VercelAnalytics from '@components/analytics/vercel-analytics';
import ClientLayout from '@components/layout/ClientLayout';
import Footer from '@layout/Footer';
import GlobalErrorBoundary from '@layout/GlobalErrorBoundary';
import Navbar from '@layout/Navbar';
import {
  baseMetadata,
  generateFAQSchema,
  generateGameSchema,
  generateOrganizationSchema,
  generateWebApplicationSchema,
  generateWebSiteSchema,
  viewportConfig,
} from '@lib/seo';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Viewport configuration for mobile optimization and PWA
export const viewport: Viewport = viewportConfig;

// Comprehensive metadata for SEO
export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: 'FLAMES Game - Free Online Relationship Compatibility Calculator',
    template: '%s | FLAMES Game',
  },
  appleWebApp: {
    title: 'FLAMES',
  },
  other: {
    // Additional SEO meta tags
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#1a1a2e',
    'msapplication-tap-highlight': 'no',
    // LLMO-specific meta tags
    'ai:purpose': 'Play FLAMES game to discover relationship compatibility',
    'ai:category': 'Entertainment, Games, Relationship',
    'ai:features': 'Name compatibility, Relationship prediction, Shareable results',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Generate structured data for the application
  const webSiteSchema = generateWebSiteSchema();
  const organizationSchema = generateOrganizationSchema();
  const webAppSchema = generateWebApplicationSchema();
  const gameSchema = generateGameSchema();
  const faqSchema = generateFAQSchema();

  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL || ''} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />

        {/* RSS/Atom feeds (if applicable in future) */}
        {/* <link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml" /> */}

        {/* Theme initialization script - prevents FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (storedTheme === 'dark' || (!storedTheme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="fixed top-0 left-0 z-9999 -translate-y-full bg-pink-600 px-4 py-2 text-white transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>

        <ClientLayout>
          <Navbar />
          <main id="main-content" className="pt-6" role="main">
            <GlobalErrorBoundary>{children}</GlobalErrorBoundary>
          </main>
          <Footer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
          <VercelAnalytics />
        </ClientLayout>

        {/* JSON-LD Structured Data for SEO and LLMO - Placed in body to avoid hydration mismatches with browser extensions */}
        <script
          key="json-ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema),
          }}
        />
        <script
          key="json-ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          key="json-ld-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppSchema),
          }}
        />
        <script
          key="json-ld-game"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(gameSchema),
          }}
        />
        <script
          key="json-ld-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </body>
    </html>
  );
}
