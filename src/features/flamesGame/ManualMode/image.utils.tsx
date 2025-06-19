import { FlamesResult } from '@/features/flamesGame/flames.types';
import { getResultData } from '@/features/flamesGame/resultData';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import toast from 'react-hot-toast';
import ClickResultImage from './components/ClickResultImage';

/**
 * Saves an image by creating a link and triggering a download.
 * @param imageDataUrl - The data URL of the image to save.
 * @param filename - The desired filename for the downloaded image.
 */
export const saveImage = (imageDataUrl: string, filename: string) => {
  try {
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Don't show success toast here as it's handled in the calling function
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
};

/**
 * Shares an image using the Web Share API.
 * @param imageDataUrl - The data URL of the image to share.
 * @param name1 - First name.
 * @param name2 - Second name.
 */
export const shareImage = async (imageDataUrl: string, name1: string, name2: string) => {
  try {
    // Check if Web Share API is available and supports files
    if (navigator.share && navigator.canShare) {
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], `${name1}_${name2}-FLAMES.png`, { type: 'image/png' });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'FLAMES Result',
          text: `Check out the FLAMES result for ${name1} and ${name2}!`,
          files: [file],
        });
        return;
      }
    }

    // Fallback: Copy link to clipboard or show share options
    if (navigator.clipboard && window.isSecureContext) {
      const shareUrl = window.location.origin + `/manual?name1=${encodeURIComponent(name1)}&name2=${encodeURIComponent(name2)}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } else {
      throw new Error('Web Share API not supported and clipboard access denied');
    }
  } catch (error) {
    console.error('Error sharing image:', error);
    if (error instanceof Error && error.name === 'AbortError') {
      // User cancelled the share, don't show error
      return;
    }
    throw new Error('Failed to share result');
  }
};

/**
 * Generates a shareable image from a canvas element.
 * @param canvas - The canvas element to capture.
 * @param name1 - First name for branding.
 * @param name2 - Second name for branding.
 * @returns A promise that resolves with the data URL of the image.
 */
export const generateCanvasImage = async (canvas: HTMLCanvasElement, name1: string, name2: string): Promise<string> => {
  if (!canvas) {
    throw new Error('Canvas element not found');
  }

  const outputCanvas = document.createElement('canvas');
  
  // Use the actual canvas dimensions
  outputCanvas.width = canvas.width;
  outputCanvas.height = canvas.height;

  const outputCtx = outputCanvas.getContext('2d');
  if (!outputCtx) {
    throw new Error('Could not get canvas context');
  }

  // Check if dark mode is active
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Draw background based on theme
  outputCtx.fillStyle = isDarkMode ? '#1e293b' : '#ffffff';
  outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

  // Draw the original canvas content
  outputCtx.drawImage(canvas, 0, 0);

  // Add branding at the bottom
  const scaleFactor = outputCanvas.width / 800; // Adjust for different canvas sizes
  outputCtx.scale(1, 1); // Reset scale for text
  
  // Set font size based on canvas size
  const fontSize = Math.max(12, 16 * scaleFactor);
  const titleFontSize = Math.max(16, 20 * scaleFactor);
  
  outputCtx.font = `${fontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
  outputCtx.fillStyle = isDarkMode ? '#94a3b8' : '#475569';
  outputCtx.textAlign = 'center';
  outputCtx.fillText(
    'the-flames.com', 
    outputCanvas.width / 2, 
    outputCanvas.height - 50 * scaleFactor
  );
  
  outputCtx.font = `bold ${titleFontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
  outputCtx.fillStyle = isDarkMode ? '#ffffff' : '#1e293b';
  outputCtx.fillText(
    `${name1} ❤️ ${name2}`, 
    outputCanvas.width / 2, 
    outputCanvas.height - 20 * scaleFactor
  );

  return outputCanvas.toDataURL('image/png', 0.9);
};

/**
 * Generates a shareable image for the click-based experience.
 * @param name1 - First name.
 * @param name2 - Second name.
 * @param result - The FLAMES result or "In Progress".
 * @returns A promise that resolves with the data URL of the image.
 */
export const generateClickResultImage = async (name1: string, name2: string, result: FlamesResult | string): Promise<string> => {
  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Create a completely isolated container to avoid CSS inheritance
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '600px';
  container.style.height = 'auto';
  container.style.backgroundColor = isDarkMode ? '#1e293b' : '#ffffff';
  
  // Reset all CSS properties to avoid oklch inheritance
  container.style.color = isDarkMode ? '#f8fafc' : '#1e293b';
  container.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.fontSize = '16px';
  container.style.lineHeight = '1.5';
  container.style.boxSizing = 'border-box';
  
  // Remove any inherited CSS classes that might contain oklch
  container.className = '';
  
  document.body.appendChild(container);

  // Render the component
  const root = createRoot(container);
  await new Promise<void>((resolve) => {
    root.render(<ClickResultImage name1={name1} name2={name2} result={result} />);
    // Give it a moment to render
    setTimeout(resolve, 200);
  });

  try {
    // Generate canvas from the container with specific options to avoid CSS issues
    const canvas = await html2canvas(container, {
      useCORS: true,
      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
      scale: 2, // Higher resolution
      logging: false, // Disable logging for production
      allowTaint: true, // Allow tainted canvases
      ignoreElements: (element) => {
        // Ignore elements that might have problematic CSS
        const classList = element.classList;
        return classList.contains('toast') || 
               classList.contains('portal') || 
               element.tagName === 'SCRIPT' ||
               element.tagName === 'STYLE';
      },
      onclone: (clonedDoc) => {
        // Remove any style elements that might contain oklch
        const styleElements = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
        styleElements.forEach(el => {
          const content = el.textContent || '';
          if (content.includes('oklch') || content.includes('oklab')) {
            el.remove();
          }
        });
        
        // Ensure the cloned container has explicit styles
        const clonedContainer = clonedDoc.querySelector('div');
        if (clonedContainer) {
          clonedContainer.style.backgroundColor = isDarkMode ? '#1e293b' : '#ffffff';
          clonedContainer.style.color = isDarkMode ? '#f8fafc' : '#1e293b';
          clonedContainer.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
        }
      }
    });

    // Cleanup
    root.unmount();
    document.body.removeChild(container);

    return canvas.toDataURL('image/png', 0.9);
  } catch (error) {
    // Cleanup on error
    try {
      root.unmount();
      document.body.removeChild(container);
    } catch {
      // Ignore cleanup errors
    }
    
    // If html2canvas fails due to oklch or other issues, use fallback
    console.warn('html2canvas failed, using fallback image generation:', error);
    
    try {
      return await generateFallbackClickResultImage(name1, name2, result);
    } catch (fallbackError) {
      console.error('Fallback image generation also failed:', fallbackError);
      throw new Error('Failed to generate image. Please try again.');
    }
  }
};

/**
 * Fallback image generation using pure canvas API (no html2canvas)
 * @param name1 - First name
 * @param name2 - Second name  
 * @param result - The FLAMES result or "In Progress"
 * @returns A promise that resolves with the data URL of the image
 */
export const generateFallbackClickResultImage = async (name1: string, name2: string, result: FlamesResult | string): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  // Set canvas dimensions
  canvas.width = 1200; // 2x for high DPI
  canvas.height = 800;

  const isDarkMode = document.documentElement.classList.contains('dark') || 
                     window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Colors
  const bgColor = isDarkMode ? '#1e293b' : '#ffffff';
  const textColor = isDarkMode ? '#f8fafc' : '#1e293b';
  const subtleColor = isDarkMode ? '#94a3b8' : '#64748b';
  const brandColor = isDarkMode ? '#fb923c' : '#f97316';

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set font
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Title
  ctx.fillStyle = textColor;
  ctx.font = 'bold 72px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(`${name1} ❤️ ${name2}`, canvas.width / 2, 150);

  // Subtitle
  ctx.fillStyle = subtleColor;
  ctx.font = '48px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('Your FLAMES Result', canvas.width / 2, 220);

  // Result box background
  const boxX = canvas.width / 2 - 200;
  const boxY = 300;
  const boxWidth = 400;
  const boxHeight = 200;
  
  ctx.fillStyle = isDarkMode ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.2)';
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
  
  // Result box border
  ctx.strokeStyle = isDarkMode ? 'rgba(251, 146, 60, 0.4)' : 'rgba(251, 146, 60, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

  // Result letter/icon
  ctx.fillStyle = brandColor;
  const isInProgress = result === 'In Progress';
  if (isInProgress) {
    ctx.font = 'bold 96px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('⏳', canvas.width / 2, boxY + 80);
    ctx.fillText('?', canvas.width / 2, boxY + 140);
  } else {
    ctx.font = 'bold 120px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(result as string, canvas.width / 2, boxY + 100);
  }

  // Result text
  ctx.fillStyle = textColor;
  ctx.font = '56px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
  const displayText = isInProgress ? 'Work in Progress' : getResultData(result as FlamesResult)?.text || result;
  ctx.fillText(displayText as string, canvas.width / 2, boxY + 160);

  // Footer
  ctx.fillStyle = subtleColor;
  ctx.font = '32px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('the-flames.com', canvas.width / 2, canvas.height - 80);

  return canvas.toDataURL('image/png', 0.9);
};

// ... More to come for click experience
