/**
 * Converts a CSS color string (hex, rgb) into an RGBA prefix string for canvas fillStyle.
 * @param colorString The CSS color string (e.g., "#ff0000", "rgb(255, 0, 0)").
 * @returns The RGBA prefix string (e.g., "rgba(255, 0, 0, ") or a fallback.
 */
export function colorToRgbaPrefix(colorString: string): string {
  // Create a temporary canvas context to resolve the color string
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return 'rgba(0,0,0,'; // Fallback if context cannot be created

  ctx.fillStyle = colorString.trim();
  // Reading fillStyle resolves named colors, hex, rgb, etc., to a consistent format (usually #RRGGBB or rgba)
  const color = ctx.fillStyle;

  if (color.startsWith('#')) {
    let r = 0,
      g = 0,
      b = 0;
    if (color.length === 4) {
      // #RGB format
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    } else if (color.length === 7) {
      // #RRGGBB format
      r = parseInt(color.substring(1, 3), 16);
      g = parseInt(color.substring(3, 5), 16);
      b = parseInt(color.substring(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, `; // Note: Swapped g and b in the previous version, corrected here.
  } else if (color.startsWith('rgb(')) {
    // rgb(r, g, b) format
    // Extract r, g, b values
    const parts = color.substring(4, color.length - 1).split(',');
    if (parts.length === 3) {
      return `rgba(${parts[0].trim()}, ${parts[1].trim()}, ${parts[2].trim()}, `;
    }
  } else if (color.startsWith('rgba(')) {
    // rgba(r, g, b, a) format - already includes alpha, extract rgb part
    const parts = color.substring(5, color.indexOf(')')).split(',');
    if (parts.length >= 3) {
      return `rgba(${parts[0].trim()}, ${parts[1].trim()}, ${parts[2].trim()}, `;
    }
  }

  // Fallback for unhandled formats (e.g., hsl, hsla) or errors
  console.warn(`Could not parse color string: ${colorString}. Falling back to black.`);
  return 'rgba(0, 0, 0, ';
}
