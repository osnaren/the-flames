/**
 * SEO Configuration
 * Centralized configuration for all SEO-related settings
 */

export const siteConfig = {
  name: 'FLAMES Game',
  shortName: 'FLAMES',
  description:
    'Play the classic FLAMES game online for free. Enter two names to get a quick relationship compatibility result: Friends, Love, Affection, Marriage, Enemies, or Siblings.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://theflames.app',
  ogImage: 'https://cdn.osnaren.com/the-flames/v1/og/og.png',
  twitterImage: 'https://cdn.osnaren.com/the-flames/v1/og/og.png',
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
    'the flames',
    'flames games',
    'FLAMES calculator',
    'relationship game',
    'love calculator',
    'relationship calculator',
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
    title: 'FLAMES Calculator: Free FLAMES Game & Love Test Online',
    description:
      'Calculate FLAMES with two names. Watch the letters cancel and see if you are Friends, Love, Affection, Marriage, Enemies or Siblings. Free, no sign-up.',
    keywords: [
      'FLAMES',
      'FLAMES game',
      'FLAMES calculate',
      'flames love calculator',
      'flames calculator by name',
      'flames online',
      'flame game',
      'flames game online',
      'online FLAMES calculator',
      'free love calculator',
      'relationship compatibility',
      'name compatibility test',
    ],
    ogImage: 'https://cdn.osnaren.com/the-flames/v1/og/og.png',
  },
  about: {
    title: 'About FLAMES: The Story Behind the Classic Name Game',
    description:
      'Meet the FLAMES Game project by osLabs: a free online name game with animated calculations, manual play, and shareable results. Explore the source and rules.',
    keywords: ['FLAMES game history', 'FLAMES game origin', 'schoolyard games', 'nostalgic games'],
    ogImage: 'https://cdn.osnaren.com/the-flames/v1/og/about-og.png',
  },
  howItWorks: {
    title: 'How to Play FLAMES: Rules & Step-by-Step Guide',
    description:
      'Learn how to play FLAMES with two names: cross out common letters, count what is left and strike F-L-A-M-E-S until one letter remains. With examples.',
    keywords: [
      'how FLAMES works',
      'FLAMES algorithm',
      'FLAMES game tutorial',
      'FLAMES game rules',
      'how to play FLAMES',
      'how to do FLAMES',
      'FLAMES rules',
      'how to play flames with names',
    ],
    ogImage: 'https://cdn.osnaren.com/the-flames/v1/og/og.png',
  },
  charts: {
    title: 'FLAMES Charts: Live Results & Trends Worldwide',
    description:
      'See how FLAMES games are ending today: the live result mix, top countries, the romance meter and a real-time feed of anonymous results from players worldwide.',
    keywords: ['FLAMES statistics', 'relationship trends', 'love calculator stats', 'popular name pairings'],
    ogImage: 'https://cdn.osnaren.com/the-flames/v1/og/charts-og.png',
  },
  manual: {
    title: 'Play FLAMES by Hand: Manual Paper & Pencil Mode',
    description:
      'Play FLAMES the traditional way: cross out the common letters yourself, count around F-L-A-M-E-S and draw on a virtual notebook page. Free and nostalgic.',
    keywords: ['manual FLAMES', 'paper FLAMES game', 'traditional FLAMES', 'interactive FLAMES'],
    ogImage: 'https://cdn.osnaren.com/the-flames/v1/og/manual-og.png',
  },
  flamesMeaning: {
    title: 'FLAMES Meaning & Full Form: What Each Letter Stands For',
    description:
      'FLAMES stands for Friends, Love, Affection, Marriage, Enemies and Siblings. What each letter means, regional versions and how your result is chosen.',
    keywords: [
      'FLAMES meaning',
      'FLAMES full form',
      'what does FLAMES stand for',
      'what does A stand for in FLAMES',
      'FLAMES meaning in game',
      'FLAMES meaning Philippines',
    ],
    ogImage: 'https://cdn.osnaren.com/the-flames/v1/og/og.png',
  },
  apiDocs: {
    title: 'FLAMES API Documentation - Developer Guide',
    description:
      'Integrate the FLAMES game into your applications with our free API. Complete documentation with examples for calculating relationship compatibility programmatically.',
    keywords: ['FLAMES API', 'love calculator API', 'relationship API', 'FLAMES game developer'],
    ogImage: 'https://cdn.osnaren.com/the-flames/v1/og/api-docs-og.png',
  },
  privacy: {
    title: 'Privacy Policy & Terms of Service',
    description:
      'Read our privacy policy and terms of service. Learn how FLAMES Game protects your data and the terms governing your use of our service.',
    keywords: ['FLAMES privacy policy', 'terms of service', 'data privacy'],
    ogImage: 'https://cdn.osnaren.com/the-flames/v1/og/og.png',
  },
};

/**
 * Structured Data types for the application
 */
export const structuredDataTypes = {
  webApplication: 'WebApplication',
  organization: 'Organization',
  breadcrumbList: 'BreadcrumbList',
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
      'Recent name pairings are saved in your browser history for the game. Shared result links include the names in their URL. Global charts use anonymous result statistics. Read the privacy policy for details.',
  },
];
