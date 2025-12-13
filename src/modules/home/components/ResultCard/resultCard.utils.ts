import html2canvas from 'html2canvas';

/**
 * Converts modern CSS color formats (oklab, oklch, etc.) to RGB
 * This is needed because html2canvas doesn't support these color formats
 */
function convertModernColorsToRgb(element: HTMLElement): void {
  const allElements = element.querySelectorAll('*');
  const elementsToProcess = [element, ...Array.from(allElements)] as HTMLElement[];

  elementsToProcess.forEach((el) => {
    if (!(el instanceof HTMLElement)) return;

    const computedStyle = window.getComputedStyle(el);
    const propertiesToCheck = [
      'color',
      'backgroundColor',
      'borderColor',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
      'outlineColor',
      'boxShadow',
    ];

    propertiesToCheck.forEach((prop) => {
      const value = computedStyle.getPropertyValue(prop);
      if (
        value &&
        (value.includes('oklab') || value.includes('oklch') || value.includes('lab') || value.includes('lch'))
      ) {
        // Get the computed color in RGB format using a canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = value;
          // Read back the color - canvas will convert it to a supported format
          const convertedColor = ctx.fillStyle;
          el.style.setProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase(), convertedColor);
        }
      }
    });
  });
}

/**
 * Captures the result card element as an image blob
 */
export async function captureResultCardAsImage(element: HTMLElement): Promise<Blob | null> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Good resolution without being too large
      useCORS: true,
      backgroundColor: '#1a1a2e', // Dark background for better appearance
      logging: false,
      imageTimeout: 15000,
      allowTaint: false,
      foreignObjectRendering: false, // Disable for better compatibility
      removeContainer: true,
      onclone: (_clonedDoc, clonedElement) => {
        // Convert modern color formats to RGB in cloned element
        convertModernColorsToRgb(clonedElement);

        // Ensure watermark is visible in the cloned document
        const clonedWatermark = clonedElement.querySelector('#watermark') as HTMLElement;
        if (clonedWatermark) {
          clonedWatermark.style.display = 'flex';
          clonedWatermark.style.opacity = '1';
        }

        // Remove animations and transforms that might interfere
        const allElements = clonedElement.querySelectorAll('*');
        allElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.animation = 'none';
            el.style.transition = 'none';
          }
        });
      },
    });

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/png',
        1.0
      );
    });
  } catch {
    return null;
  }
}

/**
 * Shares an image blob using the Web Share API with files
 */
export async function shareAsImage(
  imageBlob: Blob,
  name1?: string,
  name2?: string,
  result?: string | null
): Promise<boolean> {
  // Check if Web Share API with files is supported
  if (!navigator.canShare) {
    return false;
  }

  const file = new File([imageBlob], `flames-result-${Date.now()}.png`, {
    type: 'image/png',
  });

  const shareData = {
    files: [file],
    title: '🔥 FLAMES Game Result 🔥',
    text:
      name1 && name2 && result
        ? `${name1} ❤️ ${name2} = ${result}! Check your FLAMES result too! ✨`
        : 'Check out my FLAMES result! 🔥✨',
  };

  // Check if we can share files
  if (!navigator.canShare(shareData)) {
    return false;
  }

  try {
    await navigator.share(shareData);
    return true;
  } catch (error) {
    // User cancelled
    if ((error as Error).name === 'AbortError') {
      return true; // Not an error, just cancelled
    }
    return false;
  }
}

/**
 * Downloads the image blob as a file
 */
export function downloadImage(imageBlob: Blob, filename?: string): void {
  const url = URL.createObjectURL(imageBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `flames-result-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
