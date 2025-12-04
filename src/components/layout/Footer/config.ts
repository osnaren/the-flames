import { Calendar, Coffee, ExternalLink, Github, Heart, Mail, TrendingUp, Users } from 'lucide-react';
import type { FooterConfig } from './types';

// Centralized Footer configuration for easy maintenance
export const FOOTER_CONFIG: FooterConfig = {
  brand: {
    name: 'OSLabs',
    tagline: 'Cooked up with ❤️ at OSLabs 🇮🇳',
    description: 'Creating fun and engaging web experiences that bring people together.',
    year: new Date().getFullYear(),
  },

  navigation: {
    primary: [
      {
        label: 'How It Works',
        to: '/how-it-works',
        description: 'Learn the FLAMES algorithm and methodology',
      },
      {
        label: 'Manual Mode',
        to: '/manual',
        description: 'Step-by-step calculation process',
      },
      {
        label: 'Global Charts',
        to: '/charts',
        description: 'View worldwide statistics and trends',
      },
    ],
    secondary: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'About Us', to: '/about' },
    ],
  },

  external: [
    {
      label: 'GitHub Repository',
      href: 'https://github.com/osnaren/the-flames',
      icon: Github,
      description: 'View source code and contribute',
    },
    {
      label: 'Report Issues',
      href: 'https://github.com/osnaren/the-flames/issues',
      icon: ExternalLink,
      description: 'Bug reports and feature requests',
    },
    {
      label: 'Support Project',
      href: 'https://www.buymeacoffee.com/osnaren',
      icon: Coffee,
      description: 'Buy me a coffee to support development',
    },
  ],

  social: [
    {
      label: 'GitHub Profile',
      href: 'https://github.com/osnaren',
      icon: Github,
      hoverColor: 'hover:text-gray-400',
    },
    {
      label: 'Contact Developer',
      href: 'mailto:hello@osnaren.dev',
      icon: Mail,
      hoverColor: 'hover:text-blue-400',
    },
  ],

  stats: [
    { icon: Users, label: 'Happy Users', value: '10K+' },
    { icon: Heart, label: 'Relationships Tested', value: '50K+' },
    { icon: TrendingUp, label: 'Accuracy Rate', value: '99.9%*' },
    { icon: Calendar, label: 'Years Active', value: '2+' },
  ],
  showStats: false,

  disclaimer: {
    text: 'For entertainment only. No guarantees on marriage 💍',
    note: '*Scientifically unverified but emotionally accurate',
  },
};

// Helper function to update stats dynamically (if needed)
export const updateFooterStats = (newStats: Partial<Record<string, string>>) => {
  Object.entries(newStats).forEach(([key, value]) => {
    const stat = FOOTER_CONFIG.stats.find((s) => s.label.toLowerCase().includes(key.toLowerCase()));
    if (stat && value) {
      stat.value = value;
    }
  });
};

// Helper to add new navigation links dynamically
export const addNavigationLink = (
  section: 'primary' | 'secondary',
  link: { label: string; to: string; description?: string }
) => {
  FOOTER_CONFIG.navigation[section].push(link);
};

// Helper to add new external links
export const addExternalLink = (link: { label: string; href: string; icon: typeof Github; description?: string }) => {
  FOOTER_CONFIG.external.push(link);
};
