import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://theflames.app';

/**
 * Robots.txt Generator
 * Configures search engine crawling behavior
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Google specific rules for better crawling
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Bing specific rules
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // GPTBot for LLMO (Large Language Model Optimization)
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        // Claude for LLMO
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        // Anthropic crawler
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        // CCBot (Common Crawl)
        userAgent: 'CCBot',
        allow: '/',
      },
      {
        // Google Extended for AI training
        userAgent: 'Google-Extended',
        allow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
