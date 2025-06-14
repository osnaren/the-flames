# FLAMES Game - Technical Documentation

## Overview

The FLAMES game is a React-based web application that calculates relationship compatibility using the traditional FLAMES algorithm. This documentation covers the enhanced version with mobile responsiveness, performance optimization, error handling, and comprehensive API endpoints.

## Architecture

### Core Components

```
src/
├── api/                    # API endpoints and business logic
│   └── flames.ts          # Main FLAMES calculation API
├── components/            # React components
│   ├── ui/               # UI components
│   │   ├── SeasonalBackground/
│   │   └── MobileOptimizedSeasonalBackground/
│   ├── gamification/     # Gamification features
│   └── settings/         # Settings components
├── hooks/                # Custom React hooks
│   ├── useDeviceCapabilities.ts    # Device detection
│   ├── usePerformanceMonitor.ts    # Performance monitoring
│   ├── useSoundEffects.ts          # Audio system
│   ├── useHapticFeedback.ts        # Haptic feedback
│   └── useGameIntegration.ts       # System integration
├── themes/               # Seasonal theme system
│   └── seasonal/
├── utils/                # Utility functions
│   ├── validation.ts     # Input validation & sanitization
│   └── testing.ts        # Testing utilities
└── store/                # State management
    └── usePreferencesStore.ts
```

## Mobile Responsiveness

### Device Capabilities Detection

The `useDeviceCapabilities` hook provides comprehensive device information:

```typescript
interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  supportsHaptics: boolean;
  supportsWebGL: boolean;
  reducedMotion: boolean;
  networkSpeed: 'slow' | 'fast' | 'unknown';
  deviceMemory: number;
  pixelRatio: number;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  orientation: 'portrait' | 'landscape';
  batteryLevel?: number;
  isLowPowerMode: boolean;
}
```

### Performance Optimization

The `usePerformanceMonitor` hook automatically adjusts quality settings:

- **FPS Monitoring**: Tracks frame rate and adjusts particle counts
- **Memory Usage**: Monitors JavaScript heap usage
- **Auto Quality Adjustment**: Reduces effects on low-end devices
- **Quality Levels**: Low, Medium, High, Ultra with device-specific settings

## Error Handling & Validation

### Input Validation

Comprehensive validation system using Zod schemas:

```typescript
export const nameSchema = z
  .string()
  .min(1, 'Name cannot be empty')
  .max(50, 'Name must be 50 characters or less')
  .regex(/^[\p{L}\p{N}\s'.'-]+$/u, 'Name contains invalid characters')
  .transform((str) => str.trim())
  .refine((str) => str.length > 0, 'Name cannot be empty after trimming');
```

### Features:

- **Unicode Support**: Handles international characters
- **Special Characters**: Allows apostrophes, hyphens, and dots
- **Sanitization**: Removes invisible characters and normalizes Unicode
- **Edge Cases**: Handles empty inputs, excessive whitespace, emoji detection
- **Rate Limiting**: Prevents API abuse with configurable limits

### Error Types

```typescript
export class ValidationError extends Error {
  public readonly field?: string;
  public readonly code: string;
}

export class RateLimitError extends Error {
  public readonly retryAfter: number;
}
```

## API Endpoints

### FLAMES API

**Endpoint**: `/api/flames`

**Request**:

```typescript
interface FlamesApiRequest {
  name1: string;
  name2: string;
  anon?: boolean;
}
```

**Response**:

```typescript
interface FlamesApiResponse {
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
```

### FLAMES Algorithm

The enhanced algorithm provides detailed information:

1. **Name Normalization**: Removes spaces, converts to lowercase
2. **Common Letter Detection**: Finds matching letters and their positions
3. **Elimination Process**: Uses remaining letter count for FLAMES elimination
4. **Result Generation**: Provides meaning and random tagline

### Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Unexpected server error
- `MISSING_PARAMETERS`: Required parameters not provided

## Sound & Haptic System

### Audio System

```typescript
interface SoundEffects {
  formSubmit: () => Promise<void>;
  letterStrike: () => Promise<void>;
  flamesCount: () => Promise<void>;
  resultReveal: () => Promise<void>;
  badgeUnlock: () => Promise<void>;
  hover: () => Promise<void>;
  click: () => Promise<void>;
  error: () => Promise<void>;
  success: () => Promise<void>;
}
```

### Haptic Feedback

```typescript
interface HapticPatterns {
  light: () => Promise<void>;
  medium: () => Promise<void>;
  heavy: () => Promise<void>;
  selection: () => Promise<void>;
  impact: () => Promise<void>;
  celebration: () => Promise<void>;
  // ... more patterns
}
```

## Seasonal Theme System

### Theme Configuration

```typescript
interface SeasonalTheme {
  id: string;
  name: string;
  dateRange: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
  colors: ThemeColors;
  particleConfig: ParticleConfig;
  backgroundEffects: BackgroundEffects;
  animations: ThemeAnimations;
  sounds: ThemeSounds;
}
```

### Available Themes

1. **Valentine** (Feb 1-14): Pink/red romantic theme with hearts
2. **Halloween** (Oct 1-31): Orange/purple spooky theme with bats
3. **Christmas** (Dec 1-25): Red/green/gold festive theme with snowflakes
4. **Default**: Rainbow gradient standard theme

## Testing & Quality Assurance

### Test Coverage

```typescript
// Test Categories
export const TEST_CASES = {
  valid: [...],    // Valid input cases
  invalid: [...],  // Invalid input cases
  edge: [...],     // Edge cases and special scenarios
};

// Performance Tests
export const PERFORMANCE_TESTS = {
  light: { iterations: 100, maxTime: 100 },
  medium: { iterations: 1000, maxTime: 500 },
  heavy: { iterations: 10000, maxTime: 2000 },
};
```

### Test Functions

- `testValidation()`: Unit tests for input validation
- `testFlamesCalculation()`: Tests for FLAMES algorithm
- `testFlamesApi()`: Integration tests for API endpoints
- `benchmarkValidation()`: Performance benchmarks
- `runAllTests()`: Comprehensive test suite

## Performance Optimization

### Optimization Strategies

1. **Lazy Loading**: Components loaded on demand
2. **Particle System**: Optimized canvas rendering with device-specific limits
3. **Frame Rate Monitoring**: Auto-adjustment based on performance
4. **Memory Management**: Proper cleanup of animations and listeners
5. **Asset Preloading**: Sound and image assets loaded efficiently
6. **Progressive Enhancement**: Graceful degradation for older devices

### Performance Metrics

- **FPS Tracking**: Real-time frame rate monitoring
- **Memory Usage**: JavaScript heap size monitoring
- **Quality Adjustment**: Automatic quality level changes
- **Particle Count**: Dynamic particle limits based on performance

## Browser Compatibility

### Supported Browsers

- **Chrome**: v88+
- **Firefox**: v85+
- **Safari**: v14+
- **Edge**: v88+

### Fallback Mechanisms

- **Audio**: Silent fallback for unsupported formats
- **Haptics**: Graceful degradation without vibration
- **WebGL**: Canvas 2D fallback for particle systems
- **Animations**: Reduced motion respect for accessibility

## Security Considerations

### Input Sanitization

- Unicode normalization (NFC)
- Invisible character removal
- Length restrictions
- Character whitelist validation

### Rate Limiting

- Per-IP request limits
- Configurable time windows
- Graceful error responses

### API Security

- Input validation on all endpoints
- Error message sanitization
- No sensitive data exposure

## Deployment

### Environment Variables

```bash
# Optional configuration
FLAMES_RATE_LIMIT_REQUESTS=20
FLAMES_RATE_LIMIT_WINDOW=60000
FLAMES_LOG_LEVEL=info
```

### Build Process

```bash
# Development
npm run dev

# Production build
npm run build

# Testing
npm run test

# Linting
npm run lint
```

### Framework Integration

The API can be integrated with various frameworks:

```typescript
// Express.js
app.post('/api/flames', createFlamesEndpoint());

// Vercel
export default createFlamesEndpoint();

// Next.js
export default function handler(req, res) {
  return createFlamesEndpoint()(req, res);
}
```

## Monitoring & Analytics

### Performance Metrics

- Response times
- Error rates
- User device statistics
- Feature usage analytics

### Error Tracking

- Validation errors
- API failures
- Performance degradation
- User experience issues

## Accessibility

### WCAG Compliance

- Reduced motion support
- High contrast mode
- Keyboard navigation
- Screen reader compatibility
- Alternative text for images

### Inclusive Design

- Multiple input methods
- Flexible text sizing
- Color contrast ratios
- Clear error messages

## Future Enhancements

### Planned Features

1. **Offline Support**: Service worker implementation
2. **Progressive Web App**: Full PWA capabilities
3. **Social Sharing**: Enhanced sharing options
4. **Analytics Dashboard**: User statistics and insights
5. **Internationalization**: Multi-language support
6. **Advanced Animations**: More sophisticated particle effects

### Technical Debt

- Migrate to more modern React patterns
- Implement better error boundaries
- Add more comprehensive testing
- Optimize bundle size further
- Improve TypeScript coverage

## Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Run tests: `npm run test`

### Code Standards

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Comprehensive JSDoc comments
- Unit test coverage

### Pull Request Process

1. Feature branch from main
2. Comprehensive testing
3. Documentation updates
4. Code review approval
5. Merge with squash commits
