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
 * Load and return the html2canvas-pro capture function using dynamic imports.
 *
 * @returns A function that captures an `HTMLElement` and resolves to an `HTMLCanvasElement`.
 * @throws If executed outside a browser environment (no `window`), or if the module does not export a callable capture function.
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
 * Captures the provided HTMLElement and produces a canvas rendering of it.
 *
 * @param element - The HTML element to capture.
 * @param options - Optional html2canvas configuration.
 * @returns An HTMLCanvasElement containing the rendered capture of `element`.
 */
export async function captureElement(element: HTMLElement, options?: Html2CanvasOptions): Promise<HTMLCanvasElement> {
  const html2canvas = await loadHtml2Canvas();
  return html2canvas(element, options);
}

/**
 * Capture an HTML element and produce binary image data.
 *
 * @param element - The HTML element to capture
 * @param options - html2canvas options to control capture behavior
 * @param imageType - Image MIME type to encode (default: 'image/png')
 * @param quality - Image quality for formats that support it (0 to 1, default: 1.0)
 * @returns A `Blob` containing the encoded image, or `null` if encoding failed
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
 * Capture an HTML element to a data URL.
 *
 * @param element - The HTML element to capture.
 * @param options - Optional html2canvas-pro capture options.
 * @param imageType - Image MIME type to use for the output (default: 'image/png').
 * @param quality - Image quality for lossy formats like 'image/jpeg', between 0 and 1 (default: 0.9).
 * @returns A data URL string containing the captured image.
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