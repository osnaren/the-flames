import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize images
  images: {
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],
    // Define remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/**',
      },
    ],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize image size
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Enable experimental features for performance
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-checkbox',
      'zod',
    ],
  },

  // Compiler options for production optimization
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Headers for performance, security, and SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Permissions Policy for security
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache favicon and images
        source: '/favicon/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache OG images
        source: '/(opengraph-image|twitter-image)(.png)?',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Redirect trailing slashes for clean URLs
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
      // Redirect common misspellings or alternative URLs
      {
        source: '/flame',
        destination: '/',
        permanent: true,
      },
      {
        source: '/game',
        destination: '/',
        permanent: true,
      },
      {
        source: '/play',
        destination: '/',
        permanent: true,
      },
      {
        source: '/calculator',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tutorial',
        destination: '/how-it-works',
        permanent: true,
      },
      {
        source: '/learn',
        destination: '/how-it-works',
        permanent: true,
      },
      {
        source: '/stats',
        destination: '/charts',
        permanent: true,
      },
      {
        source: '/statistics',
        destination: '/charts',
        permanent: true,
      },
      {
        source: '/api',
        destination: '/api-docs',
        permanent: true,
      },
      {
        source: '/docs',
        destination: '/api-docs',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/privacy#terms',
        permanent: true,
      },
    ];
  },

  // Enable gzip/brotli compression is handled by hosting platform
  // But we can optimize output
  output: 'standalone',

  // Reduce bundle size by excluding source maps in production
  productionBrowserSourceMaps: false,

  // PoweredBy header removal for security
  poweredByHeader: false,
};

export default nextConfig;
