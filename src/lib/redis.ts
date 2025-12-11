/**
 * Redis client configuration for rate limiting
 *
 * This module provides Redis connection utilities for the FLAMES API.
 * It uses Upstash Redis for serverless compatibility.
 *
 * Environment Variables:
 * - KV_REST_API_URL: Upstash Redis REST API URL
 * - KV_REST_API_TOKEN: Upstash Redis REST API Token
 */

// Check if Redis is configured
export function isRedisConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// Redis REST client interface
interface RedisCommands {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { ex?: number; px?: number }): Promise<string>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  del(key: string): Promise<number>;
  zrangebyscore(
    key: string,
    min: number | string,
    max: number | string,
    options?: { limit?: { offset: number; count: number } }
  ): Promise<string[]>;
  zadd(key: string, score: number, member: string): Promise<number>;
  zremrangebyscore(key: string, min: number | string, max: number | string): Promise<number>;
  zcard(key: string): Promise<number>;
}

// Simple Upstash REST client implementation
class UpstashRedisClient implements RedisCommands {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = process.env.KV_REST_API_URL || '';
    this.token = process.env.KV_REST_API_TOKEN || '';
  }

  private async execute<T>(command: (string | number)[]): Promise<T> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      throw new Error(`Redis error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result as T;
  }

  async get(key: string): Promise<string | null> {
    return this.execute<string | null>(['GET', key]);
  }

  async set(key: string, value: string, options?: { ex?: number; px?: number }): Promise<string> {
    const command: (string | number)[] = ['SET', key, value];
    if (options?.ex) {
      command.push('EX', options.ex);
    }
    if (options?.px) {
      command.push('PX', options.px);
    }
    return this.execute<string>(command);
  }

  async incr(key: string): Promise<number> {
    return this.execute<number>(['INCR', key]);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.execute<number>(['EXPIRE', key, seconds]);
  }

  async ttl(key: string): Promise<number> {
    return this.execute<number>(['TTL', key]);
  }

  async del(key: string): Promise<number> {
    return this.execute<number>(['DEL', key]);
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    return this.execute<number>(['ZADD', key, score, member]);
  }

  async zremrangebyscore(key: string, min: number | string, max: number | string): Promise<number> {
    return this.execute<number>(['ZREMRANGEBYSCORE', key, min, max]);
  }

  async zcard(key: string): Promise<number> {
    return this.execute<number>(['ZCARD', key]);
  }

  async zrangebyscore(key: string, min: number | string, max: number | string): Promise<string[]> {
    return this.execute<string[]>(['ZRANGEBYSCORE', key, min, max]);
  }
}

// Singleton instance
let redisClient: UpstashRedisClient | null = null;

export function getRedisClient(): UpstashRedisClient | null {
  if (!isRedisConfigured()) {
    return null;
  }

  if (!redisClient) {
    redisClient = new UpstashRedisClient();
  }

  return redisClient;
}

/**
 * Redis-based sliding window rate limiter
 *
 * Uses sorted sets to implement a sliding window algorithm:
 * - Each request is stored with its timestamp as the score
 * - Old entries (outside the window) are removed on each check
 * - Count of remaining entries determines if request is allowed
 */
export class RedisRateLimiter {
  private maxRequests: number;
  private windowMs: number;
  private keyPrefix: string;
  private redis: UpstashRedisClient | null;

  constructor(maxRequests: number = 20, windowMs: number = 60000, keyPrefix: string = 'ratelimit:flames:') {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.keyPrefix = keyPrefix;
    this.redis = getRedisClient();
  }

  private getKey(identifier: string): string {
    return `${this.keyPrefix}${identifier}`;
  }

  /**
   * Check if a request is allowed and record it if so
   * @returns Object with allowed status and rate limit info
   */
  async checkLimit(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetIn: number;
    total: number;
  }> {
    if (!this.redis) {
      // Fallback: allow all requests when Redis is not configured
      return {
        allowed: true,
        remaining: this.maxRequests,
        resetIn: 0,
        total: this.maxRequests,
      };
    }

    const key = this.getKey(identifier);
    const now = Date.now();
    const windowStart = now - this.windowMs;

    try {
      // Remove expired entries
      await this.redis.zremrangebyscore(key, 0, windowStart);

      // Get current count
      const currentCount = await this.redis.zcard(key);

      if (currentCount >= this.maxRequests) {
        // Get the oldest entry to calculate reset time
        const oldestEntries = await this.redis.zrangebyscore(key, windowStart, now);
        const oldestTimestamp = oldestEntries.length > 0 ? parseInt(oldestEntries[0]) : now;
        const resetIn = Math.max(0, Math.ceil((oldestTimestamp + this.windowMs - now) / 1000));

        return {
          allowed: false,
          remaining: 0,
          resetIn,
          total: this.maxRequests,
        };
      }

      // Add current request
      await this.redis.zadd(key, now, now.toString());

      // Set TTL on the key (slightly longer than window to ensure cleanup)
      await this.redis.expire(key, Math.ceil(this.windowMs / 1000) + 10);

      return {
        allowed: true,
        remaining: this.maxRequests - currentCount - 1,
        resetIn: Math.ceil(this.windowMs / 1000),
        total: this.maxRequests,
      };
    } catch (error) {
      console.error('Redis rate limiter error:', error);
      // On error, allow the request but log
      return {
        allowed: true,
        remaining: this.maxRequests,
        resetIn: 0,
        total: this.maxRequests,
      };
    }
  }

  /**
   * Get remaining attempts without consuming one
   */
  async getRemainingAttempts(identifier: string): Promise<number> {
    if (!this.redis) {
      return this.maxRequests;
    }

    const key = this.getKey(identifier);
    const now = Date.now();
    const windowStart = now - this.windowMs;

    try {
      await this.redis.zremrangebyscore(key, 0, windowStart);
      const currentCount = await this.redis.zcard(key);
      return Math.max(0, this.maxRequests - currentCount);
    } catch {
      return this.maxRequests;
    }
  }
}

// Export a singleton instance for the FLAMES API
export const flamesRateLimiter = new RedisRateLimiter(20, 60000, 'ratelimit:flames:');

// Export a singleton instance for OG Image generation (slightly higher limit for social sharing)
export const ogRateLimiter = new RedisRateLimiter(50, 60000, 'ratelimit:og:');
