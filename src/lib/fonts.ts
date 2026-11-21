import {
  DM_Serif_Text,
  Josefin_Sans,
  Noto_Color_Emoji,
  Noto_Sans,
  Patrick_Hand,
  Space_Grotesk,
} from 'next/font/google';

// Primary body font
export const notoSans = Noto_Sans({
  subsets: ['latin'],
  // 'optional' never swaps after first paint (zero CLS); preloading gives the
  // brand font a real chance to arrive inside that window on mobile too.
  display: 'optional',
  variable: '--font-noto-sans',
  weight: ['400', '500', '600', '700'],
  preload: true,
  adjustFontFallback: true,
});

// Display/heading font
export const dmSerifText = DM_Serif_Text({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif',
  weight: ['400'],
  preload: true,
});

// Accent font
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
  preload: false, // Lower priority
});

// Alternative display font
export const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-josefin-sans',
  weight: ['400', '500', '600', '700'],
  preload: false,
});

// Handwriting font for special effects
export const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-patrick-hand',
  weight: ['400'],
  // Used in the above-the-fold wordmark and About introduction.
  preload: true,
});

// Colour emoji for flags. Windows has no flag glyphs, so `.font-emoji` (country
// flags in charts) uses Noto. Google splits it by unicode-range and nothing else
// uses this family, so only the flag slice downloads, and only where flags show.
export const notoColorEmoji = Noto_Color_Emoji({
  subsets: ['emoji'],
  weight: '400',
  display: 'swap',
  variable: '--font-noto-emoji',
  preload: false,
  adjustFontFallback: false,
});

// Combined font variables for use in className
export const fontVariables = `${notoSans.variable} ${dmSerifText.variable} ${spaceGrotesk.variable} ${josefinSans.variable} ${patrickHand.variable} ${notoColorEmoji.variable}`;
