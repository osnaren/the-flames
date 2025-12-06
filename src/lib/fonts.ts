import { DM_Serif_Text, Josefin_Sans, Noto_Sans, Patrick_Hand, Space_Grotesk } from 'next/font/google';

// Primary body font
export const notoSans = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
  weight: ['400', '500', '600', '700'],
  preload: true,
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
  preload: false,
});

// Combined font variables for use in className
export const fontVariables = `${notoSans.variable} ${dmSerifText.variable} ${spaceGrotesk.variable} ${josefinSans.variable} ${patrickHand.variable}`;
