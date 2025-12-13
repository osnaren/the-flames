# OpenGraph Image System

A comprehensive, customizable OpenGraph (OG) image generation system for FLAMES Game that creates beautiful, branded social media preview images.

## Features

- **Dynamic Result Images**: Custom OG images for shared FLAMES results with names and relationship type
- **Page-Specific Images**: Unique OG images for each page (About, How It Works, Charts, etc.)
- **Edge Runtime**: All images generated on Vercel's edge network for optimal performance
- **Cached**: Proper cache headers for CDN caching
- **Secure**: Input sanitization and validation for all parameters
- **Accessible**: Alt text for all images

## Architecture

```
src/lib/og/
├── index.ts        # Main exports
├── types.ts        # TypeScript type definitions
├── config.ts       # Configuration and themes
├── utils.ts        # Utility functions
└── components.tsx  # Reusable JSX components

src/app/api/og/
├── result/
│   └── route.tsx   # Dynamic result image API
└── page/
    └── route.tsx   # Static page image API

src/app/[page]/
├── opengraph-image.tsx   # Page-specific OG image
└── twitter-image.tsx     # Twitter card image (re-exports OG)
```

## Usage

### Dynamic Result OG Images

When sharing a FLAMES result, the URL includes query parameters that generate a custom OG image:

```
https://theflames.app/?name1=John&name2=Jane&result=L
```

This generates an OG image showing:

- Both names with heart emoji connector
- The result badge (e.g., "❤️ Love")
- Highlighted FLAMES letter
- Beautiful gradient background matching the result

### Generating Share URLs

Use the updated share utilities:

```typescript
import { generateShareUrl, generateOGImageUrl } from '@/lib/share';

// Generate share URL with OG image support
const shareUrl = generateShareUrl('John', 'Jane', 'L');
// -> https://theflames.app/?name1=John&name2=Jane&result=L

// Generate direct OG image URL
const ogUrl = generateOGImageUrl('John', 'Jane', 'L');
// -> https://theflames.app/api/og/result?name1=John&name2=Jane&result=L
```

### Adding OG Images to New Pages

1. Create `opengraph-image.tsx` in the page directory:

```typescript
import { ImageResponse } from 'next/og';
import { OG_COLOR_SCHEMES, OG_IMAGE_SIZES, PAGE_OG_CONFIGS, generateGradientCSS } from '@/lib/og';

export const runtime = 'edge';
export const alt = 'Your Page Title';
export const size = OG_IMAGE_SIZES.default;
export const contentType = 'image/png';

export default async function Image() {
  const config = PAGE_OG_CONFIGS['your-page-key'];
  // ... generate image
}
```

2. Add page config to `src/lib/og/config.ts`:

```typescript
export const PAGE_OG_CONFIGS = {
  // ... existing configs
  'your-page': {
    variant: 'your-variant',
    title: 'Your Page Title',
    subtitle: 'Your subtitle',
    badges: ['Badge 1', 'Badge 2'],
    showFlamesLetters: true,
    customIcon: '🎉',
  },
};
```

3. Create `twitter-image.tsx` that re-exports the OG image:

```typescript
export const runtime = 'edge';
export const alt = 'Your Page Title';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export { default } from './opengraph-image';
```

## API Endpoints

### GET /api/og/result

Generates a custom OG image for FLAMES results.

**Query Parameters:**

- `name1` (required): First name (max 25 chars)
- `name2` (required): Second name (max 25 chars)
- `result` (optional): FLAMES result (F/L/A/M/E/S)

**Example:**

```
GET /api/og/result?name1=John&name2=Jane&result=L
```

**Response:** PNG image (1200x630)

### GET /api/og/page

Generates OG images for static pages.

**Query Parameters:**

- `page` (required): Page identifier (home, about, how-it-works, charts, manual, api-docs)

**Example:**

```
GET /api/og/page?page=about
```

**Response:** PNG image (1200x630)

## Customization

### FLAMES Result Themes

Each FLAMES result has a unique theme defined in `config.ts`:

```typescript
export const FLAMES_RESULT_THEMES = {
  F: {
    emoji: '🤝',
    label: 'Friendship',
    tagline: 'Best friends forever!',
    gradient: { from: '#3b82f6', to: '#06b6d4' },
    accentColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
  },
  // ... other results
};
```

### Color Schemes

Dark and light themes available:

```typescript
const colorScheme = OG_COLOR_SCHEMES.dark; // or .light
```

### Image Sizes

Standard sizes defined:

```typescript
OG_IMAGE_SIZES.default; // 1200x630 (standard OG)
OG_IMAGE_SIZES.twitter; // 1200x628 (Twitter)
OG_IMAGE_SIZES.square; // 1200x1200 (some platforms)
```

## Security

The system includes comprehensive input validation:

- **Name sanitization**: Removes dangerous characters (`<>'"&\/`)
- **Length limits**: Names truncated to 25 characters
- **Unicode normalization**: Handles international characters
- **Control character removal**: Strips invisible characters
- **URL decoding**: Safely handles encoded inputs

## Caching

Cache headers are set for optimal CDN performance:

- **Static pages**: 1 year (`max-age=31536000`)
- **Result images**: 1 week (`max-age=604800`)
- **Stale-while-revalidate**: 1 day (`stale-while-revalidate=86400`)

## Testing

To test OG images locally:

1. Start the dev server: `npm run dev`
2. Visit: `http://localhost:3000/api/og/result?name1=Test&name2=User&result=L`
3. Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) for production testing
4. Use [Twitter Card Validator](https://cards-dev.twitter.com/validator) for Twitter testing

## Troubleshooting

### Image not updating on social media

Social platforms cache OG images aggressively. Use platform-specific debug tools to purge cache:

- Facebook: [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- LinkedIn: [Post Inspector](https://www.linkedin.com/post-inspector/)
- Twitter: [Card Validator](https://cards-dev.twitter.com/validator)

### Names not displaying correctly

Check that names don't contain special characters that get stripped. The system sanitizes:

- HTML entities (`<`, `>`, `&`)
- Quotes (`'`, `"`)
- Slashes (`/`, `\`)
- Control characters

### Result not highlighted

Ensure the `result` parameter is a valid FLAMES character (F, L, A, M, E, or S, case-insensitive).
