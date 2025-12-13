/**
 * OpenGraph Image Generation Types
 * Centralized type definitions for OG image generation system
 */

import type { FlamesResult } from '@/constants/flames';

// ============================================================================
// Core Types
// ============================================================================

export type OGImageVariant = 'default' | 'result' | 'about' | 'how-it-works' | 'charts' | 'manual' | 'api-docs';

export interface OGImageSize {
  width: number;
  height: number;
}

export interface OGGradient {
  from: string;
  via?: string;
  to: string;
  angle?: number;
}

export interface OGColorScheme {
  background: string;
  backgroundGradient: OGGradient;
  primary: string;
  secondary: string;
  text: string;
  textMuted: string;
  accent: string;
  border: string;
}

// ============================================================================
// FLAMES Result Types
// ============================================================================

export type NonNullFlamesResult = Exclude<FlamesResult, null>;

export interface FlamesResultTheme {
  emoji: string;
  label: string;
  tagline: string;
  gradient: OGGradient;
  accentColor: string;
  glowColor: string;
  iconPath?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface OGBackgroundProps {
  variant?: OGImageVariant;
  result?: NonNullFlamesResult | null;
  colorScheme: OGColorScheme;
}

export interface OGFlamesLettersProps {
  highlightLetter?: NonNullFlamesResult | null;
  size?: 'sm' | 'md' | 'lg';
}

export interface OGBadgeProps {
  text: string;
  variant?: 'default' | 'highlighted';
  colorScheme: OGColorScheme;
}

export interface OGNamesDisplayProps {
  name1: string;
  name2: string;
  result?: NonNullFlamesResult | null;
}

export interface OGResultDisplayProps {
  result: NonNullFlamesResult;
  theme: FlamesResultTheme;
}

export interface OGFooterProps {
  domain?: string;
  colorScheme: OGColorScheme;
}

// ============================================================================
// Page-Specific Config Types
// ============================================================================

export interface OGPageConfig {
  variant: OGImageVariant;
  title: string;
  subtitle?: string;
  badges?: string[];
  showFlamesLetters?: boolean;
  customIcon?: string;
}

export interface OGResultConfig extends OGPageConfig {
  variant: 'result';
  name1: string;
  name2: string;
  result: NonNullFlamesResult;
}

// ============================================================================
// API Route Types
// ============================================================================

export interface OGResultParams {
  name1: string;
  name2: string;
  result?: NonNullFlamesResult;
}

export interface OGImageOptions {
  size?: OGImageSize;
  debug?: boolean;
  theme?: 'dark' | 'light';
}

// ============================================================================
// Font Types
// ============================================================================

export interface OGFontConfig {
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: 'normal' | 'italic';
}
