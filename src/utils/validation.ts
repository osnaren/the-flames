import { z } from 'zod';

// Validation schemas
export const nameSchema = z
  .string()
  .min(1, 'Name cannot be empty')
  .max(50, 'Name must be 50 characters or less')
  .regex(/^[\p{L}\p{N}\s'.'-]+$/u, 'Name contains invalid characters')
  .transform((str) => str.trim())
  .refine((str) => str.length > 0, 'Name cannot be empty after trimming');

export const flamesInputSchema = z.object({
  name1: nameSchema,
  name2: nameSchema,
});

// Validation result types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedValue?: string;
}

export interface FlamesValidationResult {
  isValid: boolean;
  errors: {
    name1?: string[];
    name2?: string[];
    general?: string[];
  };
  warnings: string[];
  sanitizedData?: {
    name1: string;
    name2: string;
  };
}

// Validation functions
export function validateName(name: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  try {
    // Basic validation
    if (!name || typeof name !== 'string') {
      result.errors.push('Name is required');
      result.isValid = false;
      return result;
    }

    const trimmed = name.trim();

    // Empty after trimming
    if (trimmed.length === 0) {
      result.errors.push('Name cannot be empty');
      result.isValid = false;
      return result;
    }

    // Length validation
    if (trimmed.length > 50) {
      result.errors.push('Name must be 50 characters or less');
      result.isValid = false;
    }

    // Character validation - allow letters, numbers, spaces, hyphens, apostrophes, and dots
    const validCharRegex = /^[\p{L}\p{N}\s'.'-]+$/u;
    if (!validCharRegex.test(trimmed)) {
      result.errors.push(
        'Name contains invalid characters. Only letters, numbers, spaces, hyphens, apostrophes, and dots are allowed.'
      );
      result.isValid = false;
    }

    // Check for excessive whitespace
    if (/\s{3,}/.test(trimmed)) {
      result.warnings.push('Name contains excessive whitespace');
    }

    // Check for repeated special characters
    if (/['.'-]{2,}/.test(trimmed)) {
      result.warnings.push('Name contains repeated special characters');
    }

    // Check for potentially problematic patterns
    if (/^\s|\s$/.test(name)) {
      result.warnings.push('Name has leading or trailing whitespace');
    }

    // Unicode normalization check
    const normalized = trimmed.normalize('NFC');
    if (normalized !== trimmed) {
      result.warnings.push('Name contains unnormalized Unicode characters');
      result.sanitizedValue = normalized;
    } else {
      result.sanitizedValue = trimmed;
    }

    // Additional Unicode warnings
    if (/[\u200B-\u200F\u202A-\u202E\u2060-\u206F]/.test(trimmed)) {
      result.warnings.push('Name contains invisible or control characters');
    }

    // Emoji detection
    if (
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
        trimmed
      )
    ) {
      result.warnings.push('Name contains emoji characters');
    }
  } catch (_error) {
    result.errors.push('Validation failed due to an unexpected error');
    result.isValid = false;
  }

  return result;
}

export function validateFlamesInput(name1: string, name2: string): FlamesValidationResult {
  const result: FlamesValidationResult = {
    isValid: true,
    errors: {},
    warnings: [],
  };

  const validation1 = validateName(name1);
  const validation2 = validateName(name2);

  // Collect individual validation results
  if (!validation1.isValid) {
    result.errors.name1 = validation1.errors;
    result.isValid = false;
  }

  if (!validation2.isValid) {
    result.errors.name2 = validation2.errors;
    result.isValid = false;
  }

  // Collect warnings
  result.warnings = [...validation1.warnings, ...validation2.warnings];

  // Cross-validation checks
  if (validation1.sanitizedValue && validation2.sanitizedValue) {
    const sanitized1 = validation1.sanitizedValue.toLowerCase();
    const sanitized2 = validation2.sanitizedValue.toLowerCase();

    // Check if names are identical
    if (sanitized1 === sanitized2) {
      result.errors.general = ['Names cannot be identical'];
      result.isValid = false;
    }

    // Check if names are too similar (optional warning)
    const similarity = calculateSimilarity(sanitized1, sanitized2);
    if (similarity > 0.8 && sanitized1 !== sanitized2) {
      result.warnings.push('Names are very similar');
    }

    if (result.isValid) {
      result.sanitizedData = {
        name1: validation1.sanitizedValue,
        name2: validation2.sanitizedValue,
      };
    }
  }

  return result;
}

// Sanitization functions
export function sanitizeName(name: string): string {
  if (!name || typeof name !== 'string') return '';

  return name
    .trim()
    .normalize('NFC')
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F]/g, '') // Remove invisible characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 50); // Truncate if too long
}

export function sanitizeFlamesInput(name1: string, name2: string) {
  return {
    name1: sanitizeName(name1),
    name2: sanitizeName(name2),
  };
}

// Utility functions
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}

// Rate limiting utilities
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter((time) => now - time < this.windowMs);

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);

    return true;
  }

  getRemainingAttempts(identifier: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    const recentAttempts = attempts.filter((time) => now - time < this.windowMs);

    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }

  getTimeUntilReset(identifier: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];

    if (attempts.length === 0) return 0;

    const oldestRecentAttempt = Math.min(...attempts.filter((time) => now - time < this.windowMs));
    return Math.max(0, this.windowMs - (now - oldestRecentAttempt));
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Error types
export class ValidationError extends Error {
  public readonly field?: string;
  public readonly code: string;

  constructor(message: string, field?: string, code: string = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
  }
}

export class RateLimitError extends Error {
  public readonly retryAfter: number;

  constructor(message: string, retryAfter: number) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}
