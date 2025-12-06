import { BarChart3, BookOpen, Coffee, ExternalLink, Flame, Heart, Mail, TrendingUp, Users, Wand2 } from 'lucide-react';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// Use a constant year to avoid any potential hydration issues
const CURRENT_YEAR = new Date().getFullYear();

export const NAVBAR_CONFIG = {
  items: [
    {
      label: 'Home',
      icon: Flame,
      path: '/',
      description: 'Play the FLAMES game',
      mobileOnly: true,
    },
    {
      label: 'About FLAMES',
      icon: BookOpen,
      path: '/about',
      description: 'Learn about FLAMES',
    },
    {
      label: 'Global Charts',
      icon: BarChart3,
      path: '/charts',
      description: 'View global statistics',
    },
    {
      label: 'Manual Mode',
      icon: Wand2,
      path: '/manual',
      description: 'Step-by-step calculation',
    },
  ],
};

export const FOOTER_CONFIG = {
  brand: {
    name: 'osLabs',
    tagline: 'Cooked up with ❤️ at osLabs',
    description: 'Creating fun and engaging web experiences that bring people together.',
    year: CURRENT_YEAR,
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
      { label: 'API Docs', to: '/api-docs' },
    ],
  },

  external: [
    {
      label: 'GitHub Repository',
      href: 'https://github.com/osnaren/the-flames',
      icon: FaGithub,
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
      icon: FaGithub,
      hoverColor: 'hover:text-gray-400',
    },
    {
      label: 'Contact Developer',
      href: 'mailto:66naren@gmail.com',
      icon: Mail,
      hoverColor: 'hover:text-blue-400',
    },
    { label: 'Follow on Twitter', href: 'https://x.com/osnaren', icon: FaXTwitter, hoverColor: 'hover:text-gray-400' },
    {
      label: 'Follow on Instagram',
      href: 'https://instagram.com/osnaren',
      icon: FaInstagram,
      hoverColor: 'hover:text-pink-400',
    },
  ],

  stats: [
    { icon: Users, label: 'Happy Users', value: '10K+' },
    { icon: Heart, label: 'Relationships Tested', value: '50K+' },
    { icon: TrendingUp, label: 'Accuracy Rate', value: '99.9%*' },
    // { icon: Calendar, label: 'Years Active', value: '2+' },
  ],
  showStats: false,

  disclaimer: {
    text: 'For entertainment only. No guarantees on marriage 💍',
    note: '*Scientifically unverified but emotionally accurate',
  },
};
