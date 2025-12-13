/**
 * OpenGraph Image Components
 * Reusable JSX components for OG image generation
 *
 * Note: These components are designed to work with @vercel/og ImageResponse
 * They use inline styles as required by the satori renderer
 */

import { FLAMES_LETTERS_CONFIG, FLAMES_RESULT_THEMES, OG_COLOR_SCHEMES } from './config';
import type { NonNullFlamesResult, OGColorScheme, OGGradient } from './types';
import { generateGradientCSS, toTitleCase } from './utils';

// ============================================================================
// Background Components
// ============================================================================

interface OGBackgroundProps {
  children: React.ReactNode;
  colorScheme?: OGColorScheme;
  variant?: 'default' | 'result';
  result?: NonNullFlamesResult | null;
}

/**
 * Main background wrapper for OG images
 * Provides gradient background with optional result-based theming
 */
export function OGBackground({
  children,
  colorScheme = OG_COLOR_SCHEMES.dark,
  variant = 'default',
  result,
}: OGBackgroundProps) {
  // Get result-specific accent if applicable
  const resultTheme = result ? FLAMES_RESULT_THEMES[result] : null;
  const accentGlow = resultTheme?.glowColor || 'transparent';

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: generateGradientCSS(colorScheme.backgroundGradient),
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* Decorative elements - Top Right */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${variant === 'result' && resultTheme ? resultTheme.accentColor : colorScheme.primary}30 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />

      {/* Decorative elements - Bottom Left */}
      <div
        style={{
          position: 'absolute',
          bottom: '-200px',
          left: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colorScheme.secondary}25 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Result-specific glow effect - Center */}
      {variant === 'result' && result && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accentGlow} 0%, transparent 70%)`,
            filter: 'blur(100px)',
            opacity: 0.6,
          }}
        />
      )}

      {/* Subtle grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${colorScheme.border} 1px, transparent 1px),
            linear-gradient(90deg, ${colorScheme.border} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.2,
        }}
      />

      {/* Noise texture overlay simulation using repeating gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '4px 4px',
          opacity: 0.5,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: '40px',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// FLAMES Letters Components
// ============================================================================

interface FlamesLettersProps {
  highlightLetter?: NonNullFlamesResult | null;
  size?: 'sm' | 'md' | 'lg';
}

const LETTER_SIZES = {
  sm: { box: 50, font: 28, gap: 10, radius: 12 },
  md: { box: 72, font: 42, gap: 14, radius: 16 },
  lg: { box: 90, font: 52, gap: 18, radius: 20 },
};

/**
 * FLAMES letters display with gradient backgrounds
 * Highlights the result letter when provided
 */
export function FlamesLetters({ highlightLetter, size = 'md' }: FlamesLettersProps) {
  const dimensions = LETTER_SIZES[size];

  return (
    <div
      style={{
        display: 'flex',
        gap: `${dimensions.gap}px`,
        marginBottom: '40px',
      }}
    >
      {FLAMES_LETTERS_CONFIG.map(({ letter, gradient }) => {
        const isHighlighted = highlightLetter === letter;
        const isOther = highlightLetter && highlightLetter !== letter;

        return (
          <div
            key={letter}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${dimensions.box}px`,
              height: `${dimensions.box}px`,
              borderRadius: `${dimensions.radius}px`,
              background: generateGradientCSS(gradient),
              color: '#fff',
              fontSize: `${dimensions.font}px`,
              fontWeight: 800,
              boxShadow: isHighlighted
                ? `0 0 40px ${gradient.from}80, 0 10px 30px ${gradient.from}40, inset 0 0 20px rgba(255,255,255,0.3)`
                : '0 8px 20px rgba(0,0,0,0.2)',
              opacity: isOther ? 0.3 : 1,
              transform: isHighlighted ? 'scale(1.15) translateY(-5px)' : 'scale(1)',
              border: isHighlighted ? '3px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.1)',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Badge Components
// ============================================================================

interface OGBadgeProps {
  text: string;
  variant?: 'default' | 'highlighted' | 'result';
  gradient?: OGGradient;
}

/**
 * Badge component for feature highlights
 */
export function OGBadge({ text, variant = 'default', gradient }: OGBadgeProps) {
  const isResult = variant === 'result' && gradient;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        borderRadius: '999px',
        background: isResult
          ? generateGradientCSS(gradient!)
          : variant === 'highlighted'
            ? 'rgba(236, 72, 153, 0.15)'
            : 'rgba(255, 255, 255, 0.08)',
        color: isResult ? '#fff' : variant === 'highlighted' ? '#f9a8d4' : '#cbd5e1',
        fontSize: '16px',
        fontWeight: 600,
        border: `1px solid ${isResult ? 'rgba(255,255,255,0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      {text}
    </div>
  );
}

// ============================================================================
// Names Display Components
// ============================================================================

interface OGNamesDisplayProps {
  name1: string;
  name2: string;
  result?: NonNullFlamesResult | null;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Displays two names with heart connector and result emoji
 */
export function OGNamesDisplay({ name1, name2, result, size = 'md' }: OGNamesDisplayProps) {
  const resultTheme = result ? FLAMES_RESULT_THEMES[result] : null;
  const emoji = resultTheme?.emoji || '💕';

  const fontSizes = {
    sm: { name: 36, connector: 32 },
    md: { name: 48, connector: 42 },
    lg: { name: 60, connector: 52 },
  };

  const fontSize = fontSizes[size];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginBottom: '32px',
      }}
    >
      {/* Name 1 */}
      <div
        style={{
          fontSize: `${fontSize.name}px`,
          fontWeight: 800,
          color: '#ffffff',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          letterSpacing: '-0.02em',
        }}
      >
        {toTitleCase(name1)}
      </div>

      {/* Connector with emoji */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${fontSize.connector}px`,
          filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
        }}
      >
        {emoji}
      </div>

      {/* Name 2 */}
      <div
        style={{
          fontSize: `${fontSize.name}px`,
          fontWeight: 800,
          color: '#ffffff',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          letterSpacing: '-0.02em',
        }}
      >
        {toTitleCase(name2)}
      </div>
    </div>
  );
}

// ============================================================================
// Result Display Components
// ============================================================================

interface OGResultBadgeProps {
  result: NonNullFlamesResult;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Result badge with emoji, label, and gradient styling
 */
export function OGResultBadge({ result, showLabel = true, size = 'md' }: OGResultBadgeProps) {
  const theme = FLAMES_RESULT_THEMES[result];

  const sizes = {
    sm: { padding: '12px 24px', fontSize: 20, gap: 8 },
    md: { padding: '16px 36px', fontSize: 32, gap: 14 },
    lg: { padding: '20px 48px', fontSize: 40, gap: 18 },
  };

  const style = sizes[size];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: `${style.gap}px`,
        padding: style.padding,
        borderRadius: '24px',
        background: generateGradientCSS(theme.gradient),
        color: '#ffffff',
        fontSize: `${style.fontSize}px`,
        fontWeight: 800,
        boxShadow: `0 10px 50px ${theme.glowColor}, 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.4)`,
        border: '2px solid rgba(255,255,255,0.3)',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
    >
      <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{theme.emoji}</span>
      {showLabel && <span>{theme.label}</span>}
    </div>
  );
}

interface OGResultTaglineProps {
  result: NonNullFlamesResult;
}

/**
 * Result tagline text
 */
export function OGResultTagline({ result }: OGResultTaglineProps) {
  const theme = FLAMES_RESULT_THEMES[result];

  return (
    <div
      style={{
        fontSize: '26px',
        color: '#cbd5e1',
        marginTop: '20px',
        textAlign: 'center',
        fontWeight: 500,
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }}
    >
      {theme.tagline}
    </div>
  );
}

// ============================================================================
// Title Components
// ============================================================================

interface OGTitleProps {
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Title and subtitle display
 */
export function OGTitle({ title, subtitle, size = 'md' }: OGTitleProps) {
  const sizes = {
    sm: { title: 42, subtitle: 22 },
    md: { title: 64, subtitle: 28 },
    lg: { title: 80, subtitle: 36 },
  };

  const fontSize = sizes[size];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: `${fontSize.title}px`,
          fontWeight: 800,
          color: '#ffffff',
          textShadow: '0 4px 20px rgba(0,0,0,0.4)',
          marginBottom: subtitle ? '16px' : '0',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: `${fontSize.subtitle}px`,
            color: '#cbd5e1',
            fontWeight: 500,
            maxWidth: '800px',
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Footer Components
// ============================================================================

interface OGFooterProps {
  domain?: string;
  showIcon?: boolean;
}

/**
 * Footer with domain display
 */
export function OGFooter({ domain = 'theflames.app', showIcon = true }: OGFooterProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '22px',
        fontWeight: 600,
        background: 'rgba(0,0,0,0.2)',
        padding: '8px 20px',
        borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {showIcon && <span>🔥</span>}
      <span style={{ letterSpacing: '0.02em' }}>{domain}</span>
    </div>
  );
}

// ============================================================================
// Badge Row Components
// ============================================================================

interface OGBadgeRowProps {
  badges: string[];
}

/**
 * Row of feature badges
 */
export function OGBadgeRow({ badges }: OGBadgeRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        marginTop: '32px',
      }}
    >
      {badges.map((text) => (
        <OGBadge key={text} text={text} />
      ))}
    </div>
  );
}

// ============================================================================
// Custom Icon Component
// ============================================================================

interface OGCustomIconProps {
  icon: string;
  size?: number;
}

/**
 * Large emoji icon display
 */
export function OGCustomIcon({ icon, size = 90 }: OGCustomIconProps) {
  return (
    <div
      style={{
        fontSize: `${size}px`,
        marginBottom: '24px',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
      }}
    >
      {icon}
    </div>
  );
}
