# FLAMES API Documentation

## Overview

The FLAMES API provides a RESTful endpoint for calculating relationship compatibility using the traditional FLAMES algorithm. The API includes comprehensive input validation, rate limiting, and detailed error handling.

## Base URL

```
https://theflames.app/api
```

## Authentication

The API is currently public and does not require authentication. Rate limiting is applied per IP address.

## Endpoints

### Calculate FLAMES

Calculate the FLAMES result for two names.

#### Endpoint

```
POST /flames
```

#### Request Body

```json
{
  "name1": "string",
  "name2": "string"
}
```

#### Parameters

| Parameter | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| `name1`   | string | Yes      | First name (1-50 characters)  |
| `name2`   | string | Yes      | Second name (1-50 characters) |

#### Example Request

```bash
curl -X POST https://theflames.app/api/flames \
  -H "Content-Type: application/json" \
  -d '{
    "name1": "Alice",
    "name2": "Bob"
  }'
```

#### Success Response

**Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "name1": "Alice",
    "name2": "Bob",
    "result": "L",
    "resultMeaning": "Love",
    "tagline": "Love is in the air! 💕",
    "commonLetters": ["b"],
    "timestamp": "2025-12-06T10:30:45.123Z"
  }
}
```

#### Error Response

**Code:** `400 Bad Request`

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name contains invalid characters",
    "field": "name1"
  }
}
```

**Code:** `429 Too Many Requests`

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retryAfter": 45
  }
}
```

### Get API Info

Get information about the FLAMES API.

#### Endpoint

```
GET /flames
```

#### Success Response

**Code:** `200 OK`

```json
{
  "name": "FLAMES API",
  "version": "1.0.0",
  "description": "Calculate the relationship between two names using the classic FLAMES algorithm",
  "endpoints": {
    "POST /api/flames": {
      "description": "Calculate FLAMES result for two names",
      "body": {
        "name1": "string (required) - First name",
        "name2": "string (required) - Second name"
      }
    }
  },
  "rateLimits": {
    "requests": 20,
    "window": "60 seconds"
  }
}
```

## Response Schema

### Success Response

```typescript
interface FlamesApiResponse {
  success: true;
  data: {
    name1: string; // Sanitized first name
    name2: string; // Sanitized second name
    result: 'F' | 'L' | 'A' | 'M' | 'E' | 'S'; // Final FLAMES result
    resultMeaning: string; // Human-readable meaning
    tagline: string; // Fun tagline with emoji
    commonLetters: string[]; // Array of common letters found
    timestamp: string; // ISO 8601 timestamp
  };
}
```

### Error Response

```typescript
interface FlamesApiError {
  success: false;
  error: {
    code: string; // Error code
    message: string; // Human-readable error message
    field?: string; // Field that caused the error (if applicable)
    retryAfter?: number; // Seconds to wait before retry (for rate limits)
  };
}
```

## FLAMES Results

| Letter | Meaning   | Description                           |
| ------ | --------- | ------------------------------------- |
| **F**  | Friends   | Best friends forever                  |
| **L**  | Love      | True love and romance                 |
| **A**  | Affection | Sweet affection and care              |
| **M**  | Marriage  | Wedding bells and lifetime commitment |
| **E**  | Enemy     | Opposites that clash                  |
| **S**  | Sibling   | Family-like bond                      |

## Error Codes

### Validation Errors

| Code                 | HTTP Status | Description                      |
| -------------------- | ----------- | -------------------------------- |
| `VALIDATION_ERROR`   | 400         | Input validation failed          |
| `MISSING_PARAMETERS` | 400         | Required parameters not provided |
| `INVALID_JSON`       | 400         | Request body is not valid JSON   |

### Rate Limiting

| Code                  | HTTP Status | Description       |
| --------------------- | ----------- | ----------------- |
| `RATE_LIMIT_EXCEEDED` | 429         | Too many requests |

### Server Errors

| Code             | HTTP Status | Description             |
| ---------------- | ----------- | ----------------------- |
| `INTERNAL_ERROR` | 500         | Unexpected server error |

## Rate Limiting

- **Limit**: 20 requests per minute per IP address
- **Window**: 60 seconds (sliding window)
- **Headers**: Response includes rate limit headers

### Rate Limit Headers

```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 19
X-RateLimit-Reset: 45
```

| Header                  | Description                          |
| ----------------------- | ------------------------------------ |
| `X-RateLimit-Limit`     | Maximum requests allowed per window  |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset`     | Seconds until the window resets      |

## Input Validation

### Name Requirements

- **Length**: 1-50 characters
- **Characters**: Letters (Unicode), numbers, spaces, apostrophes, hyphens, dots
- **Trimming**: Leading/trailing whitespace removed
- **Normalization**: Unicode normalization applied
- **Uniqueness**: Names must be different (case-insensitive)

### Validation Examples

✅ **Valid Names**

- `John`
- `Mary-Jane`
- `O'Connor`
- `José María`
- `李小明` (Chinese characters)

❌ **Invalid Names**

- `` (empty)
- `John@123` (contains @)
- `A`.repeat(51) (too long)
- `   ` (only whitespace)
- Same name for both inputs

## Algorithm Details

### FLAMES Calculation Process

1. **Normalization**: Convert names to lowercase, remove spaces
2. **Common Letters**: Find matching letters between names (one-to-one matching)
3. **Remaining Count**: Count letters that don't match in both names
4. **Elimination**: Use count to cycle through F-L-A-M-E-S, eliminating letters
5. **Result**: Return the last remaining letter

### Example Calculation

**Names**: Alice, Bob

1. **Normalized**: `alice`, `bob`
2. **Common Letters**: `b` (1 letter)
3. **Remaining**: `alice` - `b` match in `bob` = 4 + 2 = 6 letters remain
4. **FLAMES**: Start with [F,L,A,M,E,S], count through and eliminate
5. **Result**: Final remaining letter determines the relationship

## Code Examples

### JavaScript (Fetch API)

```javascript
async function calculateFlames(name1, name2) {
  const response = await fetch('/api/flames', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name1, name2 }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error.message);
  }

  return data.data;
}

// Usage
calculateFlames('Alice', 'Bob').then((result) => {
  console.log(`Result: ${result.resultMeaning}`);
  console.log(`Tagline: ${result.tagline}`);
});
```

### Python (Requests)

```python
import requests

def calculate_flames(name1, name2):
    url = 'https://theflames.app/api/flames'
    payload = {'name1': name1, 'name2': name2}

    response = requests.post(url, json=payload)
    data = response.json()

    if not data['success']:
        raise Exception(data['error']['message'])

    return data['data']

# Usage
result = calculate_flames('Alice', 'Bob')
print(f"Result: {result['resultMeaning']}")
print(f"Tagline: {result['tagline']}")
```

### Node.js (Axios)

```javascript
const axios = require('axios');

const response = await axios.post(
  'https://theflames.app/api/flames',
  { name1: 'Alice', name2: 'Bob' },
  { headers: { 'Content-Type': 'application/json' } }
);

console.log('Result:', response.data.data.resultMeaning);
console.log('Tagline:', response.data.data.tagline);
```

### cURL

```bash
curl -X POST https://theflames.app/api/flames \
  -H "Content-Type: application/json" \
  -d '{"name1": "Alice", "name2": "Bob"}'
```

## Performance

### Response Times

- **Average**: < 50ms
- **95th percentile**: < 100ms
- **99th percentile**: < 200ms

### Throughput

- **Per IP**: 20 requests/minute (rate limited)

## Security

### Input Sanitization

- Unicode normalization
- Invisible character removal
- XSS prevention
- Whitespace normalization

### Rate Limiting

- IP-based limiting
- Configurable thresholds
- Graceful degradation

### Privacy

- No data persistence
- No logging of names
- Stateless API

## Changelog

### v1.0.0 (Current)

- Initial API release
- FLAMES calculation endpoint
- Input validation with Zod
- Sliding window rate limiting
- Comprehensive error handling
- Rate limit headers

---

**Happy coding with FLAMES API!** 🔥💕
