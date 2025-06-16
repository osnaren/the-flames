import { z } from 'zod';
import { nameSchema } from '../flames.utils';
import type { DrawingMode } from './types';

export function validateNameInput(name: string): string | null {
  try {
    nameSchema.parse(name);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return 'Invalid name';
  }
}

export function updateCrossedLetters(
  crossed: Set<string>,
  name1: string,
  name2: string,
  letter: string,
  nameIndex: number,
  position: number
): Set<string> {
  const letterKey = `${nameIndex}-${position}-${letter}`;
  const newSet = new Set(crossed);

  if (newSet.has(letterKey)) {
    newSet.delete(letterKey);
    return newSet;
  }

  const otherNameIndex = nameIndex === 1 ? 2 : 1;
  const otherName = otherNameIndex === 1 ? name1 : name2;

  for (let i = 0; i < otherName.length; i++) {
    const otherLetterKey = `${otherNameIndex}-${i}-${otherName[i].toLowerCase()}`;
    if (otherName[i].toLowerCase() === letter && !newSet.has(otherLetterKey)) {
      newSet.add(letterKey);
      newSet.add(otherLetterKey);
      break;
    }
  }

  return newSet;
}

// URL parameter utilities
export const getUrlParams = (): { name1?: string; name2?: string } => {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  return {
    name1: params.get('name1') || undefined,
    name2: params.get('name2') || undefined,
  };
};

export const updateUrlParams = (name1: string, name2: string): void => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.set('name1', name1);
  url.searchParams.set('name2', name2);
  window.history.replaceState({}, '', url.toString());
};

// Canvas utilities
export const setupCanvas = (canvas: HTMLCanvasElement, mode: DrawingMode): CanvasRenderingContext2D | null => {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(dpr, dpr);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (mode === 'chalkboard') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
    ctx.shadowBlur = 2;
  } else {
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(31, 41, 55, 0.2)';
    ctx.shadowBlur = 1;
  }

  return ctx;
};

export const getCanvasPoint = (
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): { x: number; y: number } => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
};

export const clearCanvas = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

export const eraseArea = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number = 20): void => {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
};

// Image generation with branding
export const generateShareableImage = async (
  canvasElement: HTMLCanvasElement,
  name1: string,
  name2: string,
  mode: DrawingMode
): Promise<string> => {
  const shareCanvas = document.createElement('canvas');
  const shareCtx = shareCanvas.getContext('2d');
  if (!shareCtx) throw new Error('Could not create share canvas context');

  // Set canvas size
  shareCanvas.width = 1200;
  shareCanvas.height = 800;

  // Background
  if (mode === 'chalkboard') {
    shareCtx.fillStyle = '#1f2937';
  } else {
    shareCtx.fillStyle = '#ffffff';
  }
  shareCtx.fillRect(0, 0, shareCanvas.width, shareCanvas.height);

  // Add branding
  shareCtx.font = 'bold 24px Arial';
  shareCtx.fillStyle = mode === 'chalkboard' ? '#ffffff' : '#1f2937';
  shareCtx.textAlign = 'center';
  shareCtx.fillText('FLAMES Manual Mode', shareCanvas.width / 2, 40);

  // Add names
  shareCtx.font = '18px Arial';
  shareCtx.fillText(`${name1} ❤️ ${name2}`, shareCanvas.width / 2, 70);

  // Draw the main canvas content
  const scale = Math.min(
    (shareCanvas.width - 100) / canvasElement.width,
    (shareCanvas.height - 150) / canvasElement.height
  );

  const scaledWidth = canvasElement.width * scale;
  const scaledHeight = canvasElement.height * scale;
  const x = (shareCanvas.width - scaledWidth) / 2;
  const y = 100;

  shareCtx.drawImage(canvasElement, x, y, scaledWidth, scaledHeight);

  // Add watermark
  shareCtx.font = '14px Arial';
  shareCtx.fillStyle = mode === 'chalkboard' ? 'rgba(255,255,255,0.7)' : 'rgba(31,41,55,0.7)';
  shareCtx.textAlign = 'right';
  shareCtx.fillText('Created with FLAMES Game', shareCanvas.width - 20, shareCanvas.height - 20);

  return shareCanvas.toDataURL('image/png');
};

// Touch/Mouse event utilities
export const isTouchEvent = (e: Event): e is TouchEvent => {
  return 'touches' in e;
};

export const getEventPoint = (e: MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
  if (isTouchEvent(e)) {
    const touch = e.touches[0] || e.changedTouches[0];
    return { clientX: touch.clientX, clientY: touch.clientY };
  }
  return { clientX: e.clientX, clientY: e.clientY };
};
