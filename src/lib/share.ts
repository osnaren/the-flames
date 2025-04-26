import html2canvas from 'html2canvas';

export interface ShareData {
  name1: string;
  name2: string;
  result: string;
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
 */
export const generateShareUrl = (name1: string, name2: string): string => {
  const url = new URL(window.location.href);
  url.pathname = '/';
  url.searchParams.set('name1', name1);
  url.searchParams.set('name2', name2);
  return url.toString();
};

/**
 * Copies the share URL to clipboard
 */
export const copyShareUrl = async (name1: string, name2: string): Promise<void> => {
  const url = generateShareUrl(name1, name2);
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
  const shareData: ShareOptions = {
    title: '✨ My FLAMES Result! ✨',
    text: `${name1} ${result} ${name2} = ${resultText} ✨\nDiscover your relationship destiny at FLAMES!`,
    url: generateShareUrl(name1, name2),
  };

  // If we have an image URL, fetch and add it to share data
  if (imageUrl) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'flames-result.png', { type: 'image/png' });
      shareData.files = [file];
    } catch (error) {
      console.warn('Failed to attach image:', error);
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
    return copyShareUrl(name1, name2);
  } else {
    return Promise.reject(new Error('Share not supported'));
  }
};

/**
 * Shares the result on Twitter
 */
export const shareOnTwitter = (data: ShareData): void => {
  const { name2, result } = data;
  const text = `🔥 ${name2} got ${result} in FLAMES! ✨ Find out your result too! 👇 #FLAMESGame`;
  const url = window.location.origin;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Shares the result on Telegram
 */
export const shareOnTelegram = (data: ShareData): void => {
  const { name2, result } = data;
  const text = `🔥 ${name2} got ${result} in FLAMES! ✨ Find out your result too! 👇 ${window.location.origin} #FLAMESGame`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`;
  window.open(telegramUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Downloads the result card as an image
 */
export const downloadResultCard = async (element: HTMLElement): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 3, // Increase scale for better resolution
      useCORS: true,
      backgroundColor: null, // Use element's background
      logging: false, // Disable logging
      imageTimeout: 15000, // Increase timeout for loading images
      onclone: (document) => {
        // Ensure watermark is visible and centered during capture
        const watermark = document.getElementById('watermark');
        if (watermark) {
          watermark.style.display = 'block';
          watermark.style.opacity = '1';
        }
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
    console.error('Error generating canvas for download:');
    throw new Error('Failed to generate result card image.');
  }
};
