import ClientLayout from '@/components/layout/ClientLayout';
import { fontVariables } from '@/lib/fonts';
import Footer from '@layout/Footer';
import GlobalErrorBoundary from '@layout/GlobalErrorBoundary';
import Navbar from '@layout/Navbar';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import './index.css';

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'FLAMES Game - Discover Your Relationship',
    template: '%s | FLAMES Game',
  },
  description:
    'Play the classic FLAMES game online! Discover your relationship compatibility with friends, love interests, and more. Fun, free, and instant results.',
  keywords: ['FLAMES game', 'relationship game', 'love calculator', 'friendship test', 'compatibility'],
  authors: [{ name: 'osLabs' }],
  creator: 'osLabs',
  publisher: 'osLabs',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'FLAMES Game',
    title: 'FLAMES Game - Discover Your Relationship',
    description: 'Play the classic FLAMES game online! Discover your relationship compatibility.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FLAMES Game - Discover Your Relationship',
    description: 'Play the classic FLAMES game online! Discover your relationship compatibility.',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon.ico' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/favicon/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Preconnect to Supabase */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL || ''} />

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
      <body>
        <ClientLayout>
          <Navbar />
          <main className="pt-6">
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
        </ClientLayout>
      </body>
    </html>
  );
}
