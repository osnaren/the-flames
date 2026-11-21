import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://theflames.app';

/** Every public page is crawlable; API routes are not (social preview images excepted). */
const RULE = { allow: ['/', '/api/og/'], disallow: ['/api/'] };

/**
 * Search engines and AI crawlers (search, answer engines and training) all get
 * the same access. They are listed by name so the policy is explicit: an
 * answer engine that cites the guide is a source of visits for this site.
 */
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'FacebookBot',
  'meta-externalagent',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', ...RULE },
      { userAgent: ['Googlebot', 'Bingbot'], ...RULE },
      { userAgent: AI_AGENTS, ...RULE },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
