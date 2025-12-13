/**
 * SEO Configuration
 * Centralized configuration for all SEO-related settings
 */

export const siteConfig = {
  name: 'FLAMES Game',
  shortName: 'FLAMES',
  description:
    'Play the classic FLAMES game online! Discover your relationship compatibility with friends, love interests, and more. Fun, free, and instant results.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://theflames.app',
  ogImage: '/og/og.png',
  twitterImage: '/og/og.png',
  locale: 'en_US',
  language: 'en',
  author: {
    name: 'osLabs',
    url: 'https://osnaren.com',
    twitter: '@osnaren',
  },
  creator: 'osLabs',
  publisher: 'osLabs',
  keywords: [
    'FLAMES game',
    'FLAMES calculator',
    'relationship game',
    'love calculator',
    'friendship test',
    'compatibility test',
    'name compatibility',
    'love compatibility test',
    'relationship compatibility',
    'FLAMES test online',
    'free love calculator',
    'fun relationship game',
  ],
  category: 'Entertainment',
  classification: 'Games',
};

export const socialLinks = {
  twitter: 'https://twitter.com/osnaren',
  github: 'https://github.com/osnaren/the-flames',
  instagram: 'https://instagram.com/osnaren',
  linkedin: 'https://linkedin.com/in/osnaren',
};

/**
 * Page-specific SEO configurations
 */
export const pagesSEO = {
  home: {
    title: 'FLAMES Game - Free Online Relationship Compatibility Calculator',
    description:
      'Play the classic FLAMES game online for free! Enter two names and discover your relationship compatibility - Friends, Lovers, Affection, Marriage, Enemies, or Siblings. Fun, instant results!',
    keywords: [
      'FLAMES game',
      'online FLAMES calculator',
      'free love calculator',
      'relationship compatibility',
      'name compatibility test',
    ],
    ogImage: '/og/og.png',
  },
  about: {
    title: 'About FLAMES Game - The Story Behind the Classic Game',
    description:
      'Discover the nostalgic story behind the FLAMES game. Learn how this classic schoolyard game evolved from backbench notebooks to a modern digital experience.',
    keywords: ['FLAMES game history', 'FLAMES game origin', 'schoolyard games', 'nostalgic games'],
    ogImage: '/og/about-og.png',
  },
  howItWorks: {
    title: 'How FLAMES Game Works - Step by Step Guide',
    description:
      'Learn exactly how the FLAMES game works with our interactive step-by-step guide. Understand the algorithm behind calculating relationship compatibility with names.',
    keywords: [
      'how FLAMES works',
      'FLAMES algorithm',
      'FLAMES game tutorial',
      'FLAMES game rules',
      'how to play FLAMES',
    ],
    ogImage: '/og/og.png',
  },
  charts: {
    title: 'FLAMES Global Charts - Relationship Trends & Statistics',
    description:
      'Explore global FLAMES game statistics and trends. See the most popular relationship results, trending name pairings, and worldwide compatibility data.',
    keywords: ['FLAMES statistics', 'relationship trends', 'love calculator stats', 'popular name pairings'],
    ogImage: '/og/charts-og.png',
  },
  manual: {
    title: 'Manual FLAMES Mode - Paper & Pencil Style Game',
    description:
      'Play FLAMES the traditional way with our manual mode. Cross out letters by hand, just like in school notebooks. A nostalgic paper-and-pencil experience!',
    keywords: ['manual FLAMES', 'paper FLAMES game', 'traditional FLAMES', 'interactive FLAMES'],
    ogImage: '/og/manual-og.png',
  },
  apiDocs: {
    title: 'FLAMES API Documentation - Developer Guide',
    description:
      'Integrate the FLAMES game into your applications with our free API. Complete documentation with examples for calculating relationship compatibility programmatically.',
    keywords: ['FLAMES API', 'love calculator API', 'relationship API', 'FLAMES game developer'],
    ogImage: '/og/api-docs-og.png',
  },
  privacy: {
    title: 'Privacy Policy & Terms of Service',
    description:
      'Read our privacy policy and terms of service. Learn how FLAMES Game protects your data and the terms governing your use of our service.',
    keywords: ['FLAMES privacy policy', 'terms of service', 'data privacy'],
    ogImage: '/og/og.png',
  },
};

/**
 * Structured Data types for the application
 */
export const structuredDataTypes = {
  webApplication: 'WebApplication',
  organization: 'Organization',
  faqPage: 'FAQPage',
  breadcrumbList: 'BreadcrumbList',
  howTo: 'HowTo',
  game: 'Game',
} as const;

/**
 * FAQ data for structured data and LLMO
 */
export const faqData = [
  {
    question: 'What is FLAMES game?',
    answer:
      'FLAMES is a classic relationship compatibility game where you enter two names and discover the type of relationship - Friends, Lovers, Affection, Marriage, Enemies, or Siblings. It originated as a popular schoolyard game played with paper and pencil.',
  },
  {
    question: 'How does FLAMES calculate the result?',
    answer:
      'FLAMES works by removing common letters from both names, counting the remaining letters, and then eliminating letters from "FLAMES" based on that count until one letter remains. Each letter represents a relationship type.',
  },
  {
    question: 'Is FLAMES game free to play?',
    answer:
      'Yes! FLAMES game is completely free to play online. No registration or payment required. Just enter two names and get instant results.',
  },
  {
    question: 'What does each letter in FLAMES mean?',
    answer:
      'F = Friends, L = Lovers, A = Affection, M = Marriage, E = Enemies, S = Siblings. The final remaining letter reveals your relationship compatibility.',
  },
  {
    question: 'Can I share my FLAMES result?',
    answer:
      'Yes! After getting your result, you can share it via social media, copy a link, or download a beautiful result card image to share with friends.',
  },
  {
    question: 'Is my data saved when I play FLAMES?',
    answer:
      'We only store anonymous statistics to show global trends. We do not save the names you enter or any personal information.',
  },
];
