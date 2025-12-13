import html2canvas from 'html2canvas';

import type { NonNullFlamesResult } from '@/lib/og';

export interface ShareData {
  name1: string;
  name2: string;
  result: string | null;
  resultText: string;
  imageUrl?: string;
}

interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

/**
 * Generates a shareable URL for the current result
 * Includes name1 and name2 as query params so the OG image can be customized
 */
export const generateShareUrl = (name1: string, name2: string, result?: string | null): string => {
  const url = new URL(window.location.href);
  url.pathname = '/';
  url.searchParams.set('name1', name1);
  url.searchParams.set('name2', name2);
  if (result) {
    url.searchParams.set('result', result);
  }
  return url.toString();
};

/**
 * Generates the OpenGraph image URL for a FLAMES result
 * This URL is used by social media platforms to fetch the preview image
 *
 * @param name1 - First name
 * @param name2 - Second name
 * @param result - FLAMES result character (F/L/A/M/E/S)
 * @returns Full URL to the OG image API endpoint
 */
export const generateOGImageUrl = (
  name1: string,
  name2: string,
  result?: NonNullFlamesResult | string | null
): string => {
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://theflames.app';

  const params = new URLSearchParams();
  params.set('name1', name1.trim());
  params.set('name2', name2.trim());

  if (result) {
    params.set('result', result.toUpperCase());
  }

  return `${baseUrl}/api/og/result?${params.toString()}`;
};

/**
 * Copies the share URL to clipboard
 */
export const copyShareUrl = async (name1: string, name2: string, result?: string | null): Promise<void> => {
  const url = generateShareUrl(name1, name2, result);
  try {
    await navigator.clipboard.writeText(url);
    return Promise.resolve();
  } catch {
    return Promise.reject(new Error('Failed to copy to clipboard'));
  }
};

/**
 * Shares the result using the Web Share API (mobile)
 */
export const shareResult = async ({ name1, name2, result, resultText, imageUrl }: ShareData): Promise<void> => {
  // Generate the share URL with result for OG image generation
  const shareUrl = generateShareUrl(name1, name2, result);

  const shareData: ShareOptions = {
    title: '✨ My FLAMES Result! ✨',
    text: `${name1} ${result ? `💕 ${name2} = ${resultText}` : `& ${name2}`} ✨\nDiscover your relationship destiny at FLAMES!`,
    url: shareUrl,
  };

  // If we have an image URL, fetch and add it to share data
  if (imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'flames-result.png', { type: 'image/png' });
      shareData.files = [file];
    } catch {
      // Image attachment failed, continue without it
    }
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return Promise.resolve();
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        return Promise.reject(new Error('Share failed'));
      }
    }
  }

  // Fallback to copying link
  if (!navigator.share) {
    return copyShareUrl(name1, name2, result);
  } else {
    return Promise.reject(new Error('Share not supported'));
  }
};

/**
 * Shares the result on Twitter
 */
export const shareOnTwitter = (data: ShareData): void => {
  const { name1, name2, result, resultText } = data;
  const text = `🔥 ${name1} + ${name2} = ${resultText || result} in FLAMES! ✨ Find out your result too! 👇 #FLAMESGame`;
  const shareUrl = generateShareUrl(name1, name2, result);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
  window.open(twitterUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Shares the result on Telegram
 */
export const shareOnTelegram = (data: ShareData): void => {
  const { name1, name2, result, resultText } = data;
  const shareUrl = generateShareUrl(name1, name2, result);
  const text = `🔥 ${name1} + ${name2} = ${resultText || result} in FLAMES! ✨ Find out your result too! 👇 #FLAMESGame`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
  window.open(telegramUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Shares the result on WhatsApp
 */
export const shareOnWhatsApp = (data: ShareData): void => {
  const { name1, name2, result, resultText } = data;
  const shareUrl = generateShareUrl(name1, name2, result);
  const text = `🔥 ${name1} + ${name2} = ${resultText || result} in FLAMES! ✨\n\nFind out your result too! 👇\n${shareUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Shares the result on Facebook
 */
export const shareOnFacebook = (data: ShareData): void => {
  const { name1, name2, result } = data;
  const shareUrl = generateShareUrl(name1, name2, result);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  window.open(facebookUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Shares the result on LinkedIn
 */
export const shareOnLinkedIn = (data: ShareData): void => {
  const { name1, name2, result } = data;
  const shareUrl = generateShareUrl(name1, name2, result);
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Downloads the result card as an image
 */
export const downloadResultCard = async (element: HTMLElement): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Good resolution
      useCORS: true,
      backgroundColor: '#1a1a2e', // Dark background
      logging: false,
      imageTimeout: 15000,
      foreignObjectRendering: false,
      onclone: (_document, clonedElement) => {
        // Ensure watermark is visible
        const watermark = clonedElement.querySelector('#watermark') as HTMLElement;
        if (watermark) {
          watermark.style.display = 'flex';
          watermark.style.opacity = '1';
        }

        // Remove animations
        const allElements = clonedElement.querySelectorAll('*');
        allElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.animation = 'none';
            el.style.transition = 'none';
          }
        });
      },
    });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `flames-result-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    throw new Error('Failed to generate result card image.');
  }
};
