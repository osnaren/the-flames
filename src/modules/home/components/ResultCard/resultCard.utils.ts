import { canShareFiles, DEFAULT_CAPTURE_OPTIONS, prepareForCapture, shareImageBlob } from '@/utils/canvasColor';
import { captureElementAsBlob } from '@/utils/html2canvas';

/**
 * Capture a result card element as an image suitable for sharing or download, including the app watermark.
 *
 * @param element - The result card HTMLElement to capture
 * @returns The captured image as a `Blob`, or `null` if the capture fails or no element is provided
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
 * Share an image Blob via the Web Share API with optional descriptive text.
 *
 * @param imageBlob - The image data to share
 * @param name1 - Optional first name used to compose the share text
 * @param name2 - Optional second name used to compose the share text
 * @param result - Optional result string used to compose the share text
 * @returns `true` if the share was initiated or the user cancelled, `false` if file sharing is unavailable or the share failed
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