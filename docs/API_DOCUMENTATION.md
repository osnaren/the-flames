# FLAMES API Documentation

## Overview

The FLAMES API provides a RESTful endpoint for calculating relationship compatibility using the traditional FLAMES algorithm. The API includes comprehensive input validation, rate limiting, and detailed error handling.

## Base URL

```
https://your-domain.com/api
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
  "name2": "string",
  "anon": boolean (optional)
}
```

#### Parameters

| Parameter | Type    | Required | Description                              |
| --------- | ------- | -------- | ---------------------------------------- |
| `name1`   | string  | Yes      | First name (1-50 characters)             |
| `name2`   | string  | Yes      | Second name (1-50 characters)            |
| `anon`    | boolean | No       | Return anonymized names (default: false) |

#### Example Request

```bash
curl -X POST https://your-domain.com/api/flames \
  -H "Content-Type: application/json" \
  -d '{
    "name1": "John",
    "name2": "Jane",
    "anon": false
  }'
```

#### Success Response

**Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "name1": "John",
    "name2": "Jane",
    "commonLetters": [
      {
        "letter": "n",
        "positions1": [3],
        "positions2": [2],
        "count": 1
      }
    ],
    "flamesLetters": ["F", "L", "A", "M", "E", "S"],
    "finalCount": 6,
    "result": "L",
    "resultMeaning": "Love",
    "tagline": "Love is in the air! 💕",
    "anonymous": false
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
    "retryAfter": 60
  }
}
```

## Response Schema

### Success Response

```typescript
interface FlamesApiResponse {
  success: true;
  data: {
    name1: string; // Original or anonymized name
    name2: string; // Original or anonymized name
    commonLetters: CommonLetter[]; // Array of common letters found
    flamesLetters: string[]; // FLAMES letters array
    finalCount: number; // Count used for elimination
    result: 'F' | 'L' | 'A' | 'M' | 'E' | 'S'; // Final result
    resultMeaning: string; // Human-readable meaning
    tagline: string; // Random motivational tagline
    anonymous: boolean; // Whether names were anonymized
  };
}
```

### Common Letter Object

```typescript
interface CommonLetter {
  letter: string; // The common letter
  positions1: number[]; // Positions in first name
  positions2: number[]; // Positions in second name
  count: number; // Number of occurrences
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

| Letter | Meaning        | Description                           |
| ------ | -------------- | ------------------------------------- |
| **F**  | Friends        | Best friends forever                  |
| **L**  | Love           | True love and romance                 |
| **A**  | Affection      | Sweet affection and care              |
| **M**  | Marriage       | Wedding bells and lifetime commitment |
| **E**  | Enemy          | Opposites that clash                  |
| **S**  | Sister/Sibling | Family-like bond                      |

## Error Codes

### Validation Errors

| Code                 | HTTP Status | Description                      |
| -------------------- | ----------- | -------------------------------- |
| `VALIDATION_ERROR`   | 400         | Input validation failed          |
| `MISSING_PARAMETERS` | 400         | Required parameters not provided |

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
- **Window**: 60 seconds (rolling window)
- **Headers**: Response includes rate limit headers

### Rate Limit Headers

```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 19
X-RateLimit-Reset: 1640995200
```

## Input Validation

### Name Requirements

- **Length**: 1-50 characters
- **Characters**: Letters (Unicode), numbers, spaces, apostrophes, hyphens, dots
- **Trimming**: Leading/trailing whitespace removed
- **Normalization**: Unicode normalization applied

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

## Algorithm Details

### FLAMES Calculation Process

1. **Normalization**: Convert names to lowercase, remove spaces
2. **Common Letters**: Find matching letters between names
3. **Remaining Count**: Count letters that don't match
4. **Elimination**: Use count to eliminate FLAMES letters
5. **Result**: Return the last remaining letter

### Example Calculation

**Names**: John, Jane

1. **Normalized**: `john`, `jane`
2. **Common Letters**: `j`, `n` (2 letters)
3. **Remaining**: `oh` + `ae` = 4 letters
4. **FLAMES**: Start with [F,L,A,M,E,S], count 4
5. **Elimination**: Remove every 4th letter until one remains
6. **Result**: Final remaining letter

## Code Examples

### JavaScript (Fetch API)

```javascript
async function calculateFlames(name1, name2, anon = false) {
  try {
    const response = await fetch('/api/flames', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name1, name2, anon }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error.message);
    }

    return data.data;
  } catch (error) {
    console.error('FLAMES calculation failed:', error);
    throw error;
  }
}

// Usage
calculateFlames('John', 'Jane')
  .then((result) => {
    console.log(`${result.name1} & ${result.name2} = ${result.result} (${result.resultMeaning})`);
    console.log(result.tagline);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
```

### Python (Requests)

```python
import requests

def calculate_flames(name1, name2, anon=False):
    url = 'https://your-domain.com/api/flames'
    payload = {
        'name1': name1,
        'name2': name2,
        'anon': anon
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()

        data = response.json()

        if not data['success']:
            raise Exception(data['error']['message'])

        return data['data']

    except requests.exceptions.RequestException as e:
        print(f'Request failed: {e}')
        raise

# Usage
try:
    result = calculate_flames('John', 'Jane')
    print(f"{result['name1']} & {result['name2']} = {result['result']} ({result['resultMeaning']})")
    print(result['tagline'])
except Exception as e:
    print(f'Error: {e}')
```

### cURL Examples

#### Basic Request

```bash
curl -X POST https://your-domain.com/api/flames \
  -H "Content-Type: application/json" \
  -d '{"name1": "John", "name2": "Jane"}'
```

#### Anonymous Request

```bash
curl -X POST https://your-domain.com/api/flames \
  -H "Content-Type: application/json" \
  -d '{"name1": "John", "name2": "Jane", "anon": true}'
```

#### With Verbose Output

```bash
curl -X POST https://your-domain.com/api/flames \
  -H "Content-Type: application/json" \
  -d '{"name1": "John", "name2": "Jane"}' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" \
  -v
```

## Testing

### Test Cases

```bash
# Valid request
curl -X POST localhost:3000/api/flames \
  -H "Content-Type: application/json" \
  -d '{"name1": "Alice", "name2": "Bob"}'

# Invalid characters
curl -X POST localhost:3000/api/flames \
  -H "Content-Type: application/json" \
  -d '{"name1": "Al!ce", "name2": "Bob"}'

# Missing parameter
curl -X POST localhost:3000/api/flames \
  -H "Content-Type: application/json" \
  -d '{"name1": "Alice"}'

# Anonymous request
curl -X POST localhost:3000/api/flames \
  -H "Content-Type: application/json" \
  -d '{"name1": "Alice", "name2": "Bob", "anon": true}'
```

## Integration Examples

### Express.js Server

```javascript
const express = require('express');
const { createFlamesEndpoint } = require('./flames-api');

const app = express();
app.use(express.json());

app.post('/api/flames', createFlamesEndpoint());

app.listen(3000, () => {
  console.log('FLAMES API server running on port 3000');
});
```

### Vercel Serverless Function

```javascript
// api/flames.js
const { createFlamesEndpoint } = require('../lib/flames-api');

export default createFlamesEndpoint();
```

### Next.js API Route

```javascript
// pages/api/flames.js
import { createFlamesEndpoint } from '../../lib/flames-api';

export default createFlamesEndpoint();
```

## Performance

### Response Times

- **Average**: < 50ms
- **95th percentile**: < 100ms
- **99th percentile**: < 200ms

### Throughput

- **Maximum**: 1000 requests/second
- **Sustained**: 500 requests/second
- **Per IP**: 20 requests/minute

## Security

### Input Sanitization

- Unicode normalization
- Invisible character removal
- XSS prevention
- SQL injection prevention (though no database used)

### Rate Limiting

- IP-based limiting
- Configurable thresholds
- Graceful degradation

### Privacy

- No data persistence
- No logging of names
- Anonymous usage supported

## Monitoring

### Metrics Tracked

- Request count
- Response times
- Error rates
- Rate limit violations
- Input validation failures

### Health Check

```bash
curl https://your-domain.com/api/health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## Changelog

### v1.0.0 (Current)

- Initial API release
- FLAMES calculation endpoint
- Input validation
- Rate limiting
- Error handling
- Comprehensive documentation

### Planned Features

- Batch processing endpoint
- Webhook support
- API key authentication
- Enhanced analytics
- Multi-language support

## Support

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides available
- **Email**: api-support@your-domain.com

### Contributing

- Fork the repository
- Create feature branch
- Add tests
- Submit pull request
- Update documentation

---

**Happy coding with FLAMES API!** 🔥🚀
