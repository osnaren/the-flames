import { calculateFlamesResult } from '../flames.utils';

export function validateNameInput(name: string): string | null {
  if (!name.trim()) {
    return 'Name cannot be empty';
  }

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (name.trim().length > 20) {
    return 'Name cannot exceed 20 characters';
  }

  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return 'Name can only contain letters and spaces';
  }

  return null;
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
export const getUrlParams = () => {
  if (typeof window === 'undefined') {
    return { name1: '', name2: '' };
  }

  const urlParams = new URLSearchParams(window.location.search);
  return {
    name1: urlParams.get('name1') || '',
    name2: urlParams.get('name2') || '',
  };
};

export const updateUrlParams = (name1: string, name2: string) => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.set('name1', name1);
  url.searchParams.set('name2', name2);
  window.history.replaceState({}, '', url.toString());
};

// Canvas utilities
export const setupCanvas = (canvas: HTMLCanvasElement): CanvasRenderingContext2D | null => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  // Set canvas dimensions
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;

  // Scale for high DPI displays
  ctx.scale(dpr, dpr);

  // Set drawing properties based on theme
  const isDarkMode = document.documentElement.classList.contains('dark');

  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#1e40af';
  ctx.lineWidth = isDarkMode ? 4 : 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  return ctx;
};

export const clearCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const eraseArea = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const eraserSize = 30;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, eraserSize / 2, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.restore();
};

// Event handling utilities
export const getEventPoint = (e: MouseEvent | TouchEvent) => {
  if ('touches' in e && e.touches.length > 0) {
    return {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
    };
  } else if ('clientX' in e) {
    return {
      clientX: e.clientX,
      clientY: e.clientY,
    };
  }
  return { clientX: 0, clientY: 0 };
};

export const getCanvasPoint = (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
};

// Result validation utilities
export const calculateCorrectResult = (name1: string, name2: string): string => {
  return calculateFlamesResult(name1, name2) || 'F';
};

export const getRemainingFlamesLetters = (crossedLetters: Set<string>): string[] => {
  const flamesLetters = ['F', 'L', 'A', 'M', 'E', 'S'];
  return flamesLetters.filter((letter) => !crossedLetters.has(letter));
};

export const shouldShowValidationHint = (
  name1: string,
  name2: string,
  remainingLetters: string[]
): { show: boolean; isCorrect: boolean; correctResult: string } => {
  if (remainingLetters.length !== 1) {
    return { show: false, isCorrect: false, correctResult: '' };
  }

  const userResult = remainingLetters[0];
  const correctResult = calculateCorrectResult(name1, name2);

  return {
    show: true,
    isCorrect: userResult === correctResult,
    correctResult: correctResult,
  };
};
