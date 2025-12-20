import { canShareFiles, DEFAULT_CAPTURE_OPTIONS, prepareForCapture, shareImageBlob } from '@/utils/canvasColor';
import { captureElementAsBlob } from '@/utils/html2canvas';

/**
 * Captures the result card element as an image blob
 * Uses html2canvas-pro with native oklch/oklab color support
 */
export async function captureResultCardAsImage(element: HTMLElement): Promise<Blob | null> {
  if (!element) {
    console.warn('captureResultCardAsImage: No element provided');
    return null;
  }

  try {
    return await captureElementAsBlob(element, {
      ...DEFAULT_CAPTURE_OPTIONS,
      backgroundColor: '#1a1a2e', // Dark background for better appearance
      onclone: (_clonedDoc, clonedElement) => {
        prepareForCapture(clonedElement, {
          showWatermark: true,
          watermarkSelector: '#watermark',
        });
      },
    });
  } catch (error) {
    console.error('captureResultCardAsImage failed:', error);
    return null;
  }
}

/**
 * Shares an image blob using the Web Share API with files
 * Returns true if shared successfully or user cancelled, false if share unavailable/failed
 */
export async function shareAsImage(
  imageBlob: Blob,
  name1?: string,
  name2?: string,
  result?: string | null
): Promise<boolean> {
  if (!canShareFiles()) {
    return false;
  }

  const text =
    name1 && name2 && result
      ? `${name1} ❤️ ${name2} = ${result}! Check your FLAMES result too! ✨`
      : 'Check out my FLAMES result! 🔥✨';

  return shareImageBlob(imageBlob, {
    filename: `flames-result-${Date.now()}.png`,
    title: '🔥 FLAMES Game Result 🔥',
    text,
  });
}

/**
 * Downloads the image blob as a file
 * Exported for direct download without share attempt
 */
export { downloadBlob as downloadImage } from '@/utils/canvasColor';
