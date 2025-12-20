import type { Options as Html2CanvasOptions } from 'html2canvas-pro';

/**
 * Default html2canvas-pro options optimized for FLAMES app
 * html2canvas-pro natively supports oklch, oklab, lab, lch color functions
 */
export const DEFAULT_CAPTURE_OPTIONS: Partial<Html2CanvasOptions> = {
  scale: 2,
  useCORS: true,
  allowTaint: false,
  logging: false,
  imageTimeout: 15000,
  foreignObjectRendering: false,
  removeContainer: true,
};

/**
 * Disable CSS animations, transitions, and inline transforms/opacities on an element and its descendants to stabilize html2canvas snapshots.
 *
 * This will set `animation` and `transition` to `none` for the root and all descendant elements, clear inline `transform`, and reset inline `opacity` (except for an element with id `watermark`, whose opacity is left unchanged).
 *
 * @param root - The root HTMLElement whose subtree will be normalized for capture
 */
export function stripAnimationsForSnapshot(root: HTMLElement): void {
  const elements = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[];
  elements.forEach((el) => {
    el.style.animation = 'none';
    el.style.transition = 'none';

    // Clear inline transforms set by Framer Motion to revert to CSS classes/layout
    // This prevents capturing elements in "mid-animation" states (e.g. scaled up, rotated)
    el.style.transform = '';

    // Clear inline opacity to ensure elements are fully visible (unless hidden by class)
    // We skip the watermark as its opacity is managed explicitly in prepareForCapture
    if (el.id !== 'watermark') {
      el.style.opacity = '';
    }
  });
}

/**
 * Prepares a cloned element for html2canvas-pro capture by disabling animations, enabling an optional watermark, and adjusting styles that do not render reliably in canvas.
 *
 * @param clonedElement - The cloned root element that will be captured.
 * @param options - Optional settings.
 * @param options.showWatermark - When explicitly false, leaves any watermark hidden; otherwise ensures the watermark is visible.
 * @param options.watermarkSelector - CSS selector used to find the watermark inside the cloned element (default: `#watermark`).
 */
export function prepareForCapture(
  clonedElement: HTMLElement,
  options?: {
    showWatermark?: boolean;
    watermarkSelector?: string;
  }
): void {
  // Strip animations that could interfere
  stripAnimationsForSnapshot(clonedElement);

  // Handle watermark visibility if specified
  if (options?.showWatermark !== false) {
    const watermarkSelector = options?.watermarkSelector || '#watermark';
    const watermark = clonedElement.querySelector(watermarkSelector) as HTMLElement | null;
    if (watermark) {
      watermark.style.display = 'flex';
      watermark.style.opacity = '1';
      watermark.style.visibility = 'visible';
    }
  }

  // Fix for Result Title visibility in html2canvas
  // Gradient text (bg-clip: text) often renders as a solid block or invisible in canvas
  // We fallback to a solid color for the snapshot to ensure readability
  const resultTitle = clonedElement.querySelector('[data-capture-target="result-title"]') as HTMLElement | null;
  if (resultTitle && resultTitle.dataset.resultColor) {
    resultTitle.style.backgroundImage = 'none';
    resultTitle.style.backgroundClip = 'border-box';
    resultTitle.style.webkitBackgroundClip = 'border-box';
    resultTitle.style.color = resultTitle.dataset.resultColor;
    // Remove text shadow which might interfere
    resultTitle.style.textShadow = 'none';
  }

  // Fix for Card Borders and Glassmorphism
  // Backdrop-filter often causes artifacting or weird borders in html2canvas
  // We remove it and slightly increase opacity for the snapshot
  const cardBg = clonedElement.querySelector('[data-capture-target="card-bg"]') as HTMLElement | null;
  if (cardBg) {
    cardBg.style.backdropFilter = 'none';
    // Make background slightly more opaque since we lost the blur
    // This preserves legibility against the background
    cardBg.style.backgroundColor = 'rgba(20, 20, 20, 0.85)';
    // Ensure border is clean
    cardBg.style.borderRadius = '0px';
    cardBg.style.borderColor = 'rgba(255, 255, 255, 0.15)';
  }

  // General fix for other bg-clip-text elements (if any)
  // If they don't have the specific data attribute, we try to make them visible
  // by resetting to default color (usually white/black inherited)
  const otherClipText = clonedElement.querySelectorAll('.bg-clip-text:not([data-capture-target="result-title"])');
  otherClipText.forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.backgroundImage = 'none';
      el.style.backgroundClip = 'border-box';
      el.style.color = ''; // Revert to inherited color
    }
  });
}

/**
 * Legacy alias for backwards compatibility
 * @deprecated Use prepareForCapture instead
 */
export function prepareElementForCapture(
  _clonedDoc: Document,
  clonedElement: HTMLElement,
  options?: {
    showWatermark?: boolean;
    watermarkSelector?: string;
  }
): void {
  prepareForCapture(clonedElement, options);
}

/**
 * Trigger a browser download for the provided Blob using the given filename.
 *
 * @param blob - The binary data to download as a file
 * @param filename - The desired filename for the downloaded file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Cleanup after a short delay to ensure download starts
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Triggers a browser download of the given data URL using the provided filename.
 *
 * @param dataUrl - Data URL to download (e.g. `"data:image/png;base64,..."`)
 * @param filename - Filename to use for the downloaded file
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
  }, 100);
}

/**
 * Create a Blob from a base64-encoded data URL.
 *
 * The returned Blob uses the MIME type declared in the data URL header; if no MIME type is present, `image/png` is used.
 *
 * @param dataUrl - A data URL in the form `data:[<mime>][;base64],<data>` containing base64-encoded content.
 * @returns A Blob representing the decoded binary data with the determined MIME type.
 * @throws Error if `dataUrl` is falsy or does not start with `data:`.
 * @throws Error if the data URL cannot be split into header and payload.
 * @throws Error if base64 decoding fails.
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    throw new Error('Invalid data URL');
  }

  const [header, base64Data] = dataUrl.split(',');
  if (!header || !base64Data) {
    throw new Error('Invalid data URL format');
  }

  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  
  try {
    const binary = atob(base64Data);
    const array = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    return new Blob([array], { type: mime });
  } catch (e) {
    throw new Error('Failed to decode base64 data');
  }
}

/**
 * Detects whether the current environment supports sharing files via the Web Share API.
 *
 * @returns `true` if file sharing via the Web Share API is supported, `false` otherwise.
 */
export function canShareFiles(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (!navigator.canShare || typeof navigator.share !== 'function') return false;

  // Test with a dummy file to verify file sharing capability
  try {
    const testFile = new File(['test'], 'test.png', { type: 'image/png' });
    return navigator.canShare({ files: [testFile] });
  } catch {
    return false;
  }
}

/**
 * Share an image Blob using the Web Share API with optional metadata.
 *
 * @param blob - The image data to share as a Blob.
 * @param options - Optional share metadata.
 * @param options.filename - Suggested filename for the shared file; defaults to `flames-result-<timestamp>.png`.
 * @param options.title - Share title; defaults to "🔥 FLAMES Result".
 * @param options.text - Share text; defaults to "Check out my FLAMES result! 🔥✨".
 * @returns `true` if the share completed or the user cancelled the share, `false` if sharing failed or the environment does not support file sharing.
 */
export async function shareImageBlob(
  blob: Blob,
  options: {
    filename?: string;
    title?: string;
    text?: string;
  } = {}
): Promise<boolean> {
  if (!canShareFiles()) {
    return false;
  }

  const filename = options.filename || `flames-result-${Date.now()}.png`;
  const file = new File([blob], filename, { type: 'image/png' });

  const shareData = {
    files: [file],
    title: options.title || '🔥 FLAMES Result',
    text: options.text || 'Check out my FLAMES result! 🔥✨',
  };

  try {
    await navigator.share(shareData);
    return true;
  } catch (error) {
    // AbortError means user cancelled - not a failure
    if ((error as Error).name === 'AbortError') {
      return true;
    }
    return false;
  }
}

/**
 * Attempts to share an image using the Web Share API and falls back to copying a provided URL to the clipboard.
 *
 * @param imageData - The image to share; either a Blob or a data URL string.
 * @param options - Optional sharing metadata and fallback behavior.
 * @param options.filename - Suggested filename for the shared file.
 * @param options.title - Title used by the native share dialog.
 * @param options.text - Text used by the native share dialog.
 * @param options.fallbackUrl - URL to copy to the clipboard if native sharing is unavailable or fails.
 * @returns An object with `success` indicating whether sharing or the clipboard fallback succeeded, and `method` set to `'share'`, `'clipboard'`, or `'none'`.
 */
export async function shareImageWithFallback(
  imageData: Blob | string,
  options: {
    filename?: string;
    title?: string;
    text?: string;
    fallbackUrl?: string;
  } = {}
): Promise<{ success: boolean; method: 'share' | 'clipboard' | 'none' }> {
  const blob = typeof imageData === 'string' ? dataUrlToBlob(imageData) : imageData;

  // Try native share first
  if (canShareFiles()) {
    const shared = await shareImageBlob(blob, options);
    if (shared) {
      return { success: true, method: 'share' };
    }
  }

  // Fallback to clipboard if available
  if (options.fallbackUrl && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(options.fallbackUrl);
      return { success: true, method: 'clipboard' };
    } catch {
      // Clipboard also failed
    }
  }

  return { success: false, method: 'none' };
}