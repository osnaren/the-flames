import { RateLimiter, RateLimitError, validateFlamesInput, ValidationError } from '../utils/validation';

// Rate limiter for API calls
const rateLimiter = new RateLimiter(20, 60000); // 20 requests per minute

export interface FlamesApiRequest {
  name1: string;
  name2: string;
  anon?: boolean;
}

export interface CommonLetter {
  letter: string;
  positions1: number[];
  positions2: number[];
  count: number;
}

export interface FlamesApiResponse {
  success: boolean;
  data?: {
    name1: string;
    name2: string;
    commonLetters: CommonLetter[];
    flamesLetters: string[];
    finalCount: number;
    result: 'F' | 'L' | 'A' | 'M' | 'E' | 'S';
    resultMeaning: string;
    tagline: string;
    anonymous: boolean;
  };
  error?: {
    code: string;
    message: string;
    field?: string;
    retryAfter?: number;
  };
}

// FLAMES meanings and taglines
const FLAMES_MEANINGS = {
  F: {
    meaning: 'Friends',
    taglines: [
      'Best friends forever! 👫',
      'Friendship is the strongest bond! 🤝',
      'Friends who stay together, slay together! ✨',
      'A beautiful friendship awaits! 🌟',
      'Partners in crime and life! 🎭',
    ],
  },
  L: {
    meaning: 'Love',
    taglines: [
      'Love is in the air! 💕',
      'A match made in heaven! 👼',
      'True love conquers all! ❤️',
      'Your hearts beat as one! 💖',
      'Love story for the ages! 📖',
    ],
  },
  A: {
    meaning: 'Affection',
    taglines: [
      'Sweet affection blooms! 🌸',
      'Caring hearts unite! 💝',
      'Gentle love grows! 🌱',
      'Tender moments await! 🌺',
      'Affectionate souls connected! 💞',
    ],
  },
  M: {
    meaning: 'Marriage',
    taglines: [
      'Wedding bells are ringing! 💒',
      'Happily ever after! 👰‍♀️🤵‍♂️',
      'Till death do us part! 💍',
      'A lifetime of togetherness! 💑',
      'Perfect marriage material! 💐',
    ],
  },
  E: {
    meaning: 'Enemy',
    taglines: [
      'Opposites clash! ⚡',
      'Fire and ice! 🔥❄️',
      'Rivalry runs deep! ⚔️',
      'Better as frenemies! 😏',
      'Competitive spirits! 🏆',
    ],
  },
  S: {
    meaning: 'Sister/Sibling',
    taglines: [
      'Sibling vibes strong! 👭',
      'Like family forever! 🏠',
      'Sister from another mister! 💫',
      'Siblings by choice! 👬',
      'Family bonds unbreakable! 🔗',
    ],
  },
};

/**
 * Calculate FLAMES result for two names
 */
export function calculateFlames(
  name1: string,
  name2: string
): {
  commonLetters: CommonLetter[];
  flamesLetters: string[];
  finalCount: number;
  result: 'F' | 'L' | 'A' | 'M' | 'E' | 'S';
} {
  // Normalize names (remove spaces, convert to lowercase)
  const normalizedName1 = name1.toLowerCase().replace(/\s/g, '');
  const normalizedName2 = name2.toLowerCase().replace(/\s/g, '');

  // Find common letters and their positions
  const commonLetters: CommonLetter[] = [];
  const letterMap = new Map<string, CommonLetter>();

  // Create arrays to track which characters have been used
  const used1 = new Array(normalizedName1.length).fill(false);
  const used2 = new Array(normalizedName2.length).fill(false);

  // Find common letters
  for (let i = 0; i < normalizedName1.length; i++) {
    if (used1[i]) continue;

    const letter = normalizedName1[i];

    for (let j = 0; j < normalizedName2.length; j++) {
      if (used2[j] || normalizedName2[j] !== letter) continue;

      // Found a match
      if (!letterMap.has(letter)) {
        letterMap.set(letter, {
          letter,
          positions1: [],
          positions2: [],
          count: 0,
        });
      }

      const commonLetter = letterMap.get(letter)!;
      commonLetter.positions1.push(i);
      commonLetter.positions2.push(j);
      commonLetter.count++;

      used1[i] = true;
      used2[j] = true;
      break; // Move to next character in name1
    }
  }

  // Convert map to array
  commonLetters.push(...letterMap.values());

  // Calculate total count of non-common letters
  const remainingLetters1 = normalizedName1.split('').filter((_, i) => !used1[i]);
  const remainingLetters2 = normalizedName2.split('').filter((_, i) => !used2[i]);
  const totalRemainingCount = remainingLetters1.length + remainingLetters2.length;

  // FLAMES calculation
  const flames = ['F', 'L', 'A', 'M', 'E', 'S'];
  const flamesLetters = [...flames];
  let currentIndex = 0;

  // Use total remaining count for elimination
  const countToUse = totalRemainingCount || 1; // Fallback to 1 if no remaining letters

  while (flamesLetters.length > 1) {
    // Calculate the index to eliminate
    const eliminateIndex = (currentIndex + countToUse - 1) % flamesLetters.length;
    flamesLetters.splice(eliminateIndex, 1);

    // Update current index
    currentIndex = eliminateIndex % flamesLetters.length;
  }

  return {
    commonLetters,
    flamesLetters: flames,
    finalCount: totalRemainingCount,
    result: flamesLetters[0] as 'F' | 'L' | 'A' | 'M' | 'E' | 'S',
  };
}

/**
 * FLAMES API endpoint
 */
export async function flamesApi(request: FlamesApiRequest, clientId?: string): Promise<FlamesApiResponse> {
  try {
    // Rate limiting
    const identifier = clientId || 'anonymous';
    if (!rateLimiter.isAllowed(identifier)) {
      const retryAfter = Math.ceil(rateLimiter.getTimeUntilReset(identifier) / 1000);
      throw new RateLimitError('Too many requests. Please try again later.', retryAfter);
    }

    // Input validation
    const validation = validateFlamesInput(request.name1, request.name2);
    if (!validation.isValid) {
      const firstError =
        validation.errors.name1?.[0] ||
        validation.errors.name2?.[0] ||
        validation.errors.general?.[0] ||
        'Invalid input';

      const field = validation.errors.name1 ? 'name1' : validation.errors.name2 ? 'name2' : undefined;

      throw new ValidationError(firstError, field);
    }

    const { sanitizedData } = validation;
    if (!sanitizedData) {
      throw new ValidationError('Failed to process names');
    }

    // Calculate FLAMES
    const result = calculateFlames(sanitizedData.name1, sanitizedData.name2);
    const flamesMeaning = FLAMES_MEANINGS[result.result];
    const randomTagline = flamesMeaning.taglines[Math.floor(Math.random() * flamesMeaning.taglines.length)];

    // Return response
    return {
      success: true,
      data: {
        name1: request.anon ? '***' : sanitizedData.name1,
        name2: request.anon ? '***' : sanitizedData.name2,
        commonLetters: result.commonLetters,
        flamesLetters: result.flamesLetters,
        finalCount: result.finalCount,
        result: result.result,
        resultMeaning: flamesMeaning.meaning,
        tagline: randomTagline,
        anonymous: request.anon || false,
      },
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          field: error.field,
        },
      };
    }

    if (error instanceof RateLimitError) {
      return {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: error.message,
          retryAfter: error.retryAfter,
        },
      };
    }

    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }
}

/**
 * HTTP endpoint wrapper for frameworks like Express or Vercel
 */
export function createFlamesEndpoint() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: any, res: any) => {
    try {
      const { name1, name2, anon } = req.body || req.query;
      const clientId = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      if (!name1 || !name2) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'Both name1 and name2 are required',
          },
        });
      }

      const result = await flamesApi({ name1, name2, anon }, clientId);

      if (!result.success && result.error?.code === 'RATE_LIMIT_EXCEEDED') {
        res.status(429);
        if (result.error.retryAfter) {
          res.setHeader('Retry-After', result.error.retryAfter);
        }
      } else if (!result.success) {
        res.status(400);
      }

      res.json(result);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      });
    }
  };
}

// Example usage for different frameworks:
/*
// Express.js
import express from 'express';
const app = express();
app.use(express.json());
app.post('/api/flames', createFlamesEndpoint());

// Vercel API Routes (api/flames.ts)
export default createFlamesEndpoint();

// Next.js API Routes
export default function handler(req, res) {
  return createFlamesEndpoint()(req, res);
}
*/
