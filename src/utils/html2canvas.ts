/**
 * html2canvas-pro wrapper module
 *
 * This module handles the ESM/CommonJS interop issues with html2canvas-pro
 * by providing a consistent async interface that works with Next.js/Turbopack.
 *
 * html2canvas-pro is a fork of html2canvas that natively supports modern CSS
 * color functions: oklch(), oklab(), lab(), lch(), color()
 */

import type { Options } from 'html2canvas-pro';

export type Html2CanvasOptions = Partial<Options>;

// Cache the loaded function
let cachedHtml2Canvas: ((element: HTMLElement, options?: Html2CanvasOptions) => Promise<HTMLCanvasElement>) | null =
  null;

/**
 * Dynamically imports html2canvas-pro and returns the function
 * Uses dynamic import to ensure proper ESM module resolution
 */
async function loadHtml2Canvas(): Promise<
  (element: HTMLElement, options?: Html2CanvasOptions) => Promise<HTMLCanvasElement>
> {
  if (cachedHtml2Canvas) {
    return cachedHtml2Canvas;
  }

  if (typeof window === 'undefined') {
    throw new Error('html2canvas can only be loaded in the browser');
  }

  try {
    // Prefer the ESM bundle explicitly to avoid the broken default export resolution
    const esmModule = await import('html2canvas-pro/dist/html2canvas-pro.esm.js');
    const html2canvasFromEsm =
      (esmModule as { default?: unknown; html2canvas?: unknown }).default ||
      (esmModule as { default?: unknown; html2canvas?: unknown }).html2canvas ||
      (esmModule as unknown);

    if (typeof html2canvasFromEsm === 'function') {
      const fn = html2canvasFromEsm as (
        element: HTMLElement,
        options?: Html2CanvasOptions
      ) => Promise<HTMLCanvasElement>;
      cachedHtml2Canvas = fn;
      return fn;
    }
  } catch (error) {
    console.error('Failed to load html2canvas-pro ESM bundle, falling back to package root:', error);
  }

  try {
    // Fallback: attempt to load from package root (may resolve to UMD); treat module.exports as default
    const fallbackModule = await import('html2canvas-pro');
    const html2canvasFromFallback =
      (fallbackModule as { default?: unknown; html2canvas?: unknown }).default ||
      (fallbackModule as { default?: unknown; html2canvas?: unknown }).html2canvas ||
      (fallbackModule as unknown);

    if (typeof html2canvasFromFallback === 'function') {
      const fn = html2canvasFromFallback as (
        element: HTMLElement,
        options?: Html2CanvasOptions
      ) => Promise<HTMLCanvasElement>;
      cachedHtml2Canvas = fn;
      return fn;
    }
  } catch (error) {
    console.error('Failed to load html2canvas-pro fallback bundle:', error);
  }

  throw new Error('html2canvas-pro did not export a function');
}

/**
 * Captures an HTML element as a canvas
 * This is the main export - use this instead of importing html2canvas directly
 *
 * @param element - The HTML element to capture
 * @param options - html2canvas options
 * @returns Promise resolving to an HTMLCanvasElement
 */
export async function captureElement(element: HTMLElement, options?: Html2CanvasOptions): Promise<HTMLCanvasElement> {
  const html2canvas = await loadHtml2Canvas();
  return html2canvas(element, options);
}

/**
 * Captures an HTML element and returns it as a Blob
 *
 * @param element - The HTML element to capture
 * @param options - html2canvas options
 * @param imageType - Image MIME type (default: 'image/png')
 * @param quality - Image quality for JPEG (0-1)
 * @returns Promise resolving to a Blob or null
 */
export async function captureElementAsBlob(
  element: HTMLElement,
  options?: Html2CanvasOptions,
  imageType: string = 'image/png',
  quality: number = 1.0
): Promise<Blob | null> {
  const canvas = await captureElement(element, options);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      imageType,
      quality
    );
  });
}

/**
 * Captures an HTML element and returns it as a data URL
 *
 * @param element - The HTML element to capture
 * @param options - html2canvas options
 * @param imageType - Image MIME type (default: 'image/png')
 * @param quality - Image quality for JPEG (0-1)
 * @returns Promise resolving to a data URL string
 */
export async function captureElementAsDataUrl(
  element: HTMLElement,
  options?: Html2CanvasOptions,
  imageType: string = 'image/png',
  quality: number = 0.9
): Promise<string> {
  const canvas = await captureElement(element, options);
  return canvas.toDataURL(imageType, quality);
}
