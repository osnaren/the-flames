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
 * Removes animations/transitions that can distort html2canvas snapshots.
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
 * Prepares a cloned element for html2canvas-pro capture
 * html2canvas-pro handles oklch/oklab/lab colors natively, so we only need to:
 * - Strip animations that could interfere with the snapshot
 * - Show the watermark if needed
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
 * Safely downloads a blob as a file
 * Uses modern download approach without document.write
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
 * Safely downloads a data URL as a file
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
 * Converts a data URL to a Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64Data] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(base64Data);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }

  return new Blob([array], { type: mime });
}

/**
 * Checks if Web Share API with file sharing is available
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
 * Shares an image blob via Web Share API
 * Returns true if shared successfully, false if share was cancelled or failed
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
 * Shares an image via Web Share API, with fallback to clipboard
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
