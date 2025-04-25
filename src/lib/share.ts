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
  } catch (error) {
    return Promise.reject(new Error('Failed to copy to clipboard'));
  }
};

/**
 * Shares the result using the Web Share API (mobile)
 */
export const shareResult = async ({ 
  name1, 
  name2, 
  result, 
  resultText,
  imageUrl 
}: ShareData): Promise<void> => {
  const shareData: ShareOptions = {
    title: 'My FLAMES result!',
    text: `${name1} ${result} ${name2} = ${resultText} ✨\nDiscover your relationship destiny at FLAMES!`,
    url: generateShareUrl(name1, name2)
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
      if (error.name !== 'AbortError') {
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
export const shareOnTwitter = ({ name1, name2, resultText }: ShareData): void => {
  const text = encodeURIComponent(
    `Just discovered my FLAMES destiny with ${name2}... We're ${resultText}! 💕🔥\nFind your match at`
  );
  const url = encodeURIComponent(window.location.origin);
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    '_blank'
  );
};

/**
 * Shares the result on Telegram
 */
export const shareOnTelegram = ({ name1, name2, resultText }: ShareData): void => {
  const text = encodeURIComponent(
    `Just discovered my FLAMES destiny with ${name2}... We're ${resultText}! 💕🔥\nFind your match at ${window.location.origin}`
  );
  window.open(
    `https://t.me/share/url?url=${window.location.origin}&text=${text}`,
    '_blank'
  );
};

/**
 * Downloads the result card as an image
 */
export const downloadResultCard = async (elementRef: HTMLElement): Promise<void> => {
  // Add watermark temporarily
  const watermarkWrapper = document.createElement('div');
  watermarkWrapper.className = 'absolute bottom-4 right-4 flex items-center gap-1.5';
  
  const watermarkIcon = document.createElement('span');
  watermarkIcon.textContent = '🔥';
  
  const watermarkText = document.createElement('span');
  watermarkText.className = 'text-sm font-medium text-gray-500 dark:text-gray-400';
  watermarkText.textContent = 'theflames.app';
  
  watermarkWrapper.appendChild(watermarkIcon);
  watermarkWrapper.appendChild(watermarkText);
  elementRef.appendChild(watermarkWrapper);

  try {
    const canvas = await html2canvas(elementRef, {
      backgroundColor: null,
      scale: window.devicePixelRatio * 2, // For better quality on high DPI screens
      useCORS: true,
      logging: false,
      allowTaint: true,
    });

    // Create download link
    const link = document.createElement('a');
    link.download = 'flames-result.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error('Failed to download image'));
  } finally {
    // Remove watermark
    elementRef.removeChild(watermarkWrapper);
  }
};