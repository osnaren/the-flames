import { flamesRateLimiter, isRedisConfigured } from '@/lib/redis';
import { calculateFlamesResult, findCommonLetters } from '@/modules/home/utils';
import { RateLimiter, RateLimitError, validateFlamesInput, ValidationError } from '@/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiter fallback - 20 requests per minute per IP
const memoryRateLimiter = new RateLimiter(20, 60000);

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
    meaning: 'Sibling',
    taglines: [
      'Sibling vibes strong! 👭',
      'Like family forever! 🏠',
      'Sister from another mister! 💫',
      'Siblings by choice! 👬',
      'Family bonds unbreakable! 🔗',
    ],
  },
} as const;

// Response types
export interface FlamesApiResponse {
  success: boolean;
  data?: {
    name1: string;
    name2: string;
    result: 'F' | 'L' | 'A' | 'M' | 'E' | 'S';
    resultMeaning: string;
    tagline: string;
    commonLetters: string[];
    timestamp: string;
  };
  error?: {
    code: string;
    message: string;
    field?: string;
    retryAfter?: number;
  };
}

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'anonymous';
}

// Helper to get rate limit info (works with both Redis and in-memory)
async function checkRateLimit(clientId: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetIn: number;
}> {
  // Try Redis first if configured
  if (isRedisConfigured()) {
    const result = await flamesRateLimiter.checkLimit(clientId);
    return {
      allowed: result.allowed,
      remaining: result.remaining,
      resetIn: result.resetIn,
    };
  }

  // Fallback to in-memory rate limiter
  const allowed = memoryRateLimiter.isAllowed(clientId);
  return {
    allowed,
    remaining: memoryRateLimiter.getRemainingAttempts(clientId),
    resetIn: Math.ceil(memoryRateLimiter.getTimeUntilReset(clientId) / 1000),
  };
}

function getRateLimitHeaders(remaining: number, resetIn: number) {
  return {
    'X-RateLimit-Limit': '20',
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(resetIn),
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<FlamesApiResponse>> {
  const clientId = getClientId(request);

  // Check rate limit first
  const rateLimit = await checkRateLimit(clientId);
  const headers = getRateLimitHeaders(rateLimit.remaining, rateLimit.resetIn);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          retryAfter: rateLimit.resetIn,
        },
      },
      {
        status: 429,
        headers: {
          ...headers,
          'Retry-After': String(rateLimit.resetIn),
        },
      }
    );
  }

  // Check payload size (max 10KB)
  const contentLength = parseInt(request.headers.get('content-length') || '0');
  if (contentLength > 10240) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Request payload too large',
        },
      },
      { status: 413, headers }
    );
  }

  try {
    // Parse request body
    let body: { name1?: string; name2?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: 'Request body must be valid JSON',
          },
        },
        { status: 400, headers }
      );
    }

    const { name1, name2 } = body;

    // Check for required parameters
    if (!name1 || !name2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'Both name1 and name2 are required',
            field: !name1 ? 'name1' : 'name2',
          },
        },
        { status: 400, headers }
      );
    }

    // Input validation
    const validation = validateFlamesInput(name1, name2);
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

    // Calculate FLAMES result
    const result = calculateFlamesResult(sanitizedData.name1, sanitizedData.name2);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CALCULATION_ERROR',
            message: 'Failed to calculate FLAMES result',
          },
        },
        { status: 500, headers }
      );
    }

    // Get common letters
    const commonLetters = findCommonLetters(sanitizedData.name1, sanitizedData.name2);

    // Get random tagline for the result
    const flamesMeaning = FLAMES_MEANINGS[result];
    const randomTagline = flamesMeaning.taglines[Math.floor(Math.random() * flamesMeaning.taglines.length)];

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        data: {
          name1: sanitizedData.name1,
          name2: sanitizedData.name2,
          result,
          resultMeaning: flamesMeaning.meaning,
          tagline: randomTagline,
          commonLetters,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200, headers }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            field: error.field,
          },
        },
        { status: 400, headers }
      );
    }

    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: error.message,
            retryAfter: error.retryAfter,
          },
        },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': String(error.retryAfter),
          },
        }
      );
    }

    console.error('FLAMES API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500, headers }
    );
  }
}

// GET handler for basic API info
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    name: 'FLAMES API',
    version: '1.0.0',
    description: 'Calculate the relationship between two names using the classic FLAMES algorithm',
    endpoints: {
      'POST /api/flames': {
        description: 'Calculate FLAMES result for two names',
        body: {
          name1: 'string (required) - First name',
          name2: 'string (required) - Second name',
        },
        response: {
          success: 'boolean',
          data: {
            name1: 'string',
            name2: 'string',
            result: 'F | L | A | M | E | S',
            resultMeaning: 'Friends | Love | Affection | Marriage | Enemy | Sibling',
            tagline: 'string',
            commonLetters: 'string[]',
            timestamp: 'ISO 8601 string',
          },
        },
      },
    },
    rateLimits: {
      requests: 20,
      window: '60 seconds',
    },
  });
}
