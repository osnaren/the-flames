/**
 * API Documentation configuration for The FLAMES Game
 * Centralized configuration for API documentation content, examples, and metadata
 */

export const apiDocsConfig = {
  /* -------------------------------------------------- */
  /*  HERO SECTION                                      */
  /* -------------------------------------------------- */
  hero: {
    eyebrow: 'FLAMES API',
    title: 'API Documentation',
    subtitle:
      'Integrate the classic FLAMES relationship calculator into your applications with our simple RESTful API. Fast, fun, and nostalgic!',
    features: [
      { label: 'JSON responses', badgeClass: 'bg-emerald-100 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/40' },
      { label: '6 relationship types', badgeClass: 'bg-pink-100 text-pink-700 ring-pink-500/30 dark:bg-pink-500/15 dark:text-pink-300 dark:ring-pink-400/40' },
      { label: 'Rate limited', badgeClass: 'bg-purple-100 text-purple-700 ring-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300 dark:ring-purple-400/40' },
      { label: 'Input validation', badgeClass: 'bg-orange-100 text-orange-700 ring-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-400/40' },
    ],
    metrics: [
      { label: 'Avg Latency', value: '<50ms', helper: 'Lightning fast calculations' },
      { label: 'Rate Limit', value: '20/min', helper: 'Per IP address' },
      { label: 'Uptime', value: '99.9%', helper: 'Reliable service' },
    ],
    status: {
      uptime: '99.9%',
      lastDeploy: 'recently',
    },
    cta: {
      primary: {
        label: 'Copy cURL request',
        value: `curl -X POST \\
  https://theflames.app/api/flames \\
  -H "Content-Type: application/json" \\
  -d '{"name1": "Alice", "name2": "Bob"}'`,
      },
      secondary: {
        label: 'View API info',
        href: '/api/flames',
      },
    },
  },

  /* -------------------------------------------------- */
  /*  OVERVIEW / FLOW                                   */
  /* -------------------------------------------------- */
  overview: {
    summary:
      'Send a simple JSON request with two names and receive the FLAMES relationship result with meanings and fun taglines.',
    steps: [
      {
        title: '1. Send two names',
        description:
          'POST a JSON body with name1 and name2 fields. Names are validated and sanitized before processing.',
      },
      {
        title: '2. Algorithm calculation',
        description:
          'The classic FLAMES algorithm removes common letters, counts remaining, and cycles through F-L-A-M-E-S.',
      },
      {
        title: '3. Receive the result',
        description:
          'Get back the relationship type (Friends, Love, Affection, Marriage, Enemy, or Sibling) with a fun tagline.',
      },
    ],
    guarantees: [
      {
        label: 'Consistent results',
        description: 'Same names always produce the same FLAMES result.',
      },
      { label: 'Input validation', description: 'Names are validated for length, characters, and similarity.' },
      {
        label: 'Rate limit headers',
        description: 'Each response includes X-RateLimit-* headers for tracking usage.',
      },
    ],
  },

  /* -------------------------------------------------- */
  /*  API ENDPOINT                                      */
  /* -------------------------------------------------- */
  endpoint: {
    method: 'POST',
    path: '/api/flames',
    title: 'FLAMES Calculation Endpoint',
    description: 'Calculate the relationship between two names',
    url: 'https://theflames.app/api/flames',
  },

  /* -------------------------------------------------- */
  /*  REQUEST SPECIFICATION                             */
  /* -------------------------------------------------- */
  request: {
    contentType: 'application/json',
    maxNameLength: 50,
    details: {
      'Content-Type': 'application/json',
      'Body format': 'JSON with name1 and name2',
      'Max length': '50 characters per name',
      Characters: 'Letters, spaces, hyphens, apostrophes',
      'Rate limit': '20 req / 60 sec',
    },
  },

  /* -------------------------------------------------- */
  /*  RESPONSE SPECIFICATION                            */
  /* -------------------------------------------------- */
  response: {
    format: 'JSON',
    results: ['F (Friends)', 'L (Love)', 'A (Affection)', 'M (Marriage)', 'E (Enemy)', 'S (Sibling)'],
    details: {
      Format: 'JSON',
      Results: 'F, L, A, M, E, or S',
      Meaning: 'Full word (Friends, Love, etc.)',
      Tagline: 'Fun message with emoji',
      Timestamp: 'ISO 8601 format',
    },
    example: {
      success: true,
      data: {
        name1: 'Alice',
        name2: 'Bob',
        result: 'L',
        resultMeaning: 'Love',
        tagline: 'Love is in the air! 💕',
        commonLetters: ['b'],
        timestamp: '2024-12-06T10:30:45.123Z',
      },
    },
  },

  /* -------------------------------------------------- */
  /*  RATE LIMITING                                     */
  /* -------------------------------------------------- */
  rateLimits: {
    title: 'Rate Limits & Usage',
    description: 'API usage limits and response headers',
    limits: {
      requests: 20,
      window: '60 seconds',
      maxNameLength: '50 chars',
      algorithm: 'Sliding window',
    },
    timeline: [
      {
        label: '0–15 requests',
        status: 'Safe zone',
        description: 'All requests processed normally without any delays.',
      },
      {
        label: '16–19 requests',
        status: 'Warning',
        description: 'Approaching limit—consider slowing down your requests.',
      },
      {
        label: '20+ requests',
        status: 'Cooldown',
        description: 'Subsequent calls receive HTTP 429 until the 60s window resets.',
      },
    ],
    cooldownHint: 'Respect the X-RateLimit-Reset header before retrying to avoid cascading failures.',
    headers: [
      {
        name: 'X-RateLimit-Limit',
        description: 'Total allowed requests (20)',
      },
      {
        name: 'X-RateLimit-Remaining',
        description: 'Requests left in window',
      },
      {
        name: 'X-RateLimit-Reset',
        description: 'Seconds until reset',
      },
    ],
    bestPractices: [
      'Check X-RateLimit-Remaining before making requests',
      'Implement exponential backoff for 429 responses',
      'Cache results for repeated name combinations',
      'Handle rate limits gracefully in your UI',
    ],
  },

  /* -------------------------------------------------- */
  /*  PROGRAMMING LANGUAGES                             */
  /* -------------------------------------------------- */
  languages: [
    {
      id: 'javascript',
      name: 'JavaScript',
      fileExtension: 'js',
      syntaxHighlight: 'javascript',
      code: `const response = await fetch('/api/flames', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name1: 'Alice', name2: 'Bob' })
});

const result = await response.json();
console.log(\`Result: \${result.data.resultMeaning}\`);
console.log(\`Tagline: \${result.data.tagline}\`);`,
    },
    {
      id: 'python',
      name: 'Python',
      fileExtension: 'py',
      syntaxHighlight: 'python',
      code: `import requests

url = "https://theflames.app/api/flames"
payload = {"name1": "Alice", "name2": "Bob"}

response = requests.post(url, json=payload)
result = response.json()

print(f"Result: {result['data']['resultMeaning']}")
print(f"Tagline: {result['data']['tagline']}")`,
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      fileExtension: 'js',
      syntaxHighlight: 'javascript',
      code: `const axios = require('axios');

const response = await axios.post(
  'https://theflames.app/api/flames',
  { name1: 'Alice', name2: 'Bob' },
  { headers: { 'Content-Type': 'application/json' } }
);

console.log('Result:', response.data.data.resultMeaning);
console.log('Tagline:', response.data.data.tagline);`,
    },
    {
      id: 'go',
      name: 'Go',
      fileExtension: 'go',
      syntaxHighlight: 'go',
      code: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	url := "https://theflames.app/api/flames"
	
	payload := map[string]string{
		"name1": "Alice",
		"name2": "Bob",
	}
	
	jsonPayload, _ := json.Marshal(payload)
	
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonPayload))
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	
	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	
	data := result["data"].(map[string]interface{})
	fmt.Println("Result:", data["resultMeaning"])
	fmt.Println("Tagline:", data["tagline"])
}`,
    },
    {
      id: 'curl',
      name: 'cURL',
      fileExtension: 'sh',
      syntaxHighlight: 'bash',
      code: `curl -X POST \\
  https://theflames.app/api/flames \\
  -H "Content-Type: application/json" \\
  -d '{"name1": "Alice", "name2": "Bob"}'`,
    },
  ],

  /* -------------------------------------------------- */
  /*  ERROR CODES                                       */
  /* -------------------------------------------------- */
  errorCodes: [
    {
      code: '400',
      title: 'Bad Request',
      description: 'Invalid or missing parameters',
      color: 'destructive' as const,
      examples: ['Missing name1 or name2', 'Invalid characters in name', 'Names are identical', 'Name too long'],
      handlingTips: [
        'Ensure both name1 and name2 are provided',
        'Only use letters, spaces, hyphens, and apostrophes',
        'Keep names under 50 characters',
        'Make sure names are different',
      ],
      response: {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Names cannot be identical',
          field: 'name1',
        },
      },
    },
    {
      code: '429',
      title: 'Too Many Requests',
      description: 'Rate limit exceeded',
      color: 'outline' as const,
      examples: ['More than 20 requests in 60 seconds', 'Too many API calls from same IP'],
      handlingTips: [
        'Implement exponential backoff retry logic',
        'Monitor X-RateLimit-Remaining header',
        'Cache results for repeated queries',
        'Wait until X-RateLimit-Reset before retrying',
      ],
      response: {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          retryAfter: 45,
        },
      },
    },
    {
      code: '500',
      title: 'Internal Server Error',
      description: 'Unexpected server error',
      color: 'destructive' as const,
      examples: ['Server overload', 'Calculation error', 'Unexpected exception'],
      handlingTips: [
        'Retry with exponential backoff',
        'Report the issue if persistent',
        'Check if the service is operational',
      ],
      response: {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
    },
  ],

  /* -------------------------------------------------- */
  /*  INTERACTIVE TESTING                               */
  /* -------------------------------------------------- */
  testing: {
    title: 'API Reference & Live Testing',
    description: 'Select a programming language to see implementation examples, then test the API directly.',
    tryItButton: 'Try It!',
    loadingText: 'Testing...',
    processingText: 'Processing request...',
    sampleNames: {
      name1: 'Alice',
      name2: 'Bob',
    },
    emptyState: {
      title: 'Click "Try It!" to test the API',
      subtitle: 'The request will send sample names to the API and show the real response',
    },
    troubleshooting: ['Check your network connection', 'Verify API endpoint is running', 'Try again in a few moments'],
  },

  /* -------------------------------------------------- */
  /*  GENERAL TIPS                                      */
  /* -------------------------------------------------- */
  generalTips: {
    title: 'Error Handling Tips',
    items: [
      'Always check the success field in the response',
      'Parse error messages for detailed information',
      'Implement retry logic with exponential backoff for 429/500 errors',
      'Validate names client-side before sending',
      'Monitor rate limit headers to prevent 429 errors',
    ],
  },
} as const;

export type ApiDocsConfig = typeof apiDocsConfig;
