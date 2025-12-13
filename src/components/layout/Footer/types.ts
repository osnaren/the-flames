import type { LucideIcon } from 'lucide-react';
import type { IconType } from 'react-icons';

// Support both Lucide icons and react-icons
export type IconComponent = LucideIcon | IconType;

export interface FooterNavigationLink {
  label: string;
  to: string;
  description?: string;
}

export interface FooterExternalLink {
  label: string;
  href: string;
  icon: IconComponent;
  description?: string;
}

export interface FooterSocialLink {
  label: string;
  href: string;
  icon: IconComponent;
  hoverColor: string;
}

export interface FooterStat {
  icon: IconComponent;
  label: string;
  value: string;
}

export interface FooterBrand {
  name: string;
  tagline: string;
  description: string;
  year: number;
}

export interface FooterDisclaimer {
  text: string;
  note: string;
}

export interface FooterConfig {
  brand: FooterBrand;
  navigation: {
    primary: FooterNavigationLink[];
    secondary: FooterNavigationLink[];
  };
  external: FooterExternalLink[];
  social: FooterSocialLink[];
  stats: FooterStat[];
  showStats: boolean;
  disclaimer: FooterDisclaimer;
}

export interface FooterLinkProps {
  to?: string;
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  className?: string;
  [key: string]: unknown;
}
