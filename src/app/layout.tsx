import SponsorFAB from '@features/sponsor/SponsorFAB';
import Footer from '@layout/Footer';
import GlobalErrorBoundary from '@layout/GlobalErrorBoundary';
import Navbar from '@layout/Navbar';
import FlameBackground from '@ui/FlameBackground';
import type { Metadata } from 'next';
import './index.css';

export const metadata: Metadata = {
  title: 'Create FLAMES Game Homepage',
  description: 'The Flames Game',
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet" />
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
        <div className="from-customBg-1 to-customBg-2 relative flex min-h-screen flex-col bg-linear-to-br transition-colors duration-500">
          <FlameBackground />
          <Navbar />

          <main className="pt-6">
            <GlobalErrorBoundary>{children}</GlobalErrorBoundary>
          </main>
          <SponsorFAB />
          <Footer />
        </div>
      </body>
    </html>
  );
}
