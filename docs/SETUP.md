# FLAMES Game - Setup Guide

## Quick Start

Get the enhanced FLAMES game up and running in minutes!

### Prerequisites

- Node.js 18+
- npm or yarn
- Modern browser (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/the-flames.git
   cd the-flames
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Features Overview

The enhanced FLAMES game includes:

✨ **Mobile Responsiveness**

- Device capability detection
- Performance optimization
- Touch interactions
- Responsive layouts

🔧 **Error Handling**

- Comprehensive input validation
- Rate limiting
- Graceful error recovery
- Edge case handling

⚡ **Performance**

- Auto-quality adjustment
- Frame rate monitoring
- Memory management
- Particle optimization

🧪 **Testing**

- Unit tests
- Integration tests
- Performance benchmarks
- Cross-browser testing

🌐 **API Endpoints**

- RESTful FLAMES API
- Input validation
- Rate limiting
- Framework integration

📚 **Documentation**

- Technical documentation
- User guide
- API documentation
- Setup instructions

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint checking
npm run format       # Prettier formatting
npm run type-check   # TypeScript checking

# Testing (when implemented)
npm run test         # Run test suite
npm run test:watch   # Watch mode testing
npm run benchmark    # Performance benchmarks
```

### Project Structure

```
src/
├── api/                 # API endpoints
│   └── flames.ts       # FLAMES calculation API
├── components/         # React components
│   ├── ui/            # UI components
│   ├── gamification/  # Game features
│   └── settings/      # Settings panels
├── hooks/             # Custom React hooks
│   ├── useDeviceCapabilities.ts
│   ├── usePerformanceMonitor.ts
│   ├── useSoundEffects.ts
│   ├── useHapticFeedback.ts
│   └── useGameIntegration.ts
├── themes/            # Seasonal themes
│   └── seasonal/
├── utils/             # Utilities
│   ├── validation.ts  # Input validation
│   └── testing.ts     # Testing utilities
├── store/             # State management
└── styles/            # CSS styles
```

## Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# Optional configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_RATE_LIMIT_REQUESTS=20
VITE_RATE_LIMIT_WINDOW=60000
VITE_ENABLE_ANALYTICS=false
```

### TypeScript Configuration

The project uses strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Testing

### Run Test Suite

```bash
# In browser console or test file
import { runAllTests, generateTestReport } from './src/utils/testing';

// Run comprehensive tests
const results = await runAllTests();

// Generate report
const report = generateTestReport(results);
console.log(report);
```

### Manual Testing Checklist

- [ ] Name input validation
- [ ] FLAMES calculation accuracy
- [ ] Seasonal theme switching
- [ ] Sound effects functionality
- [ ] Haptic feedback (mobile)
- [ ] Performance on low-end devices
- [ ] Error handling edge cases
- [ ] API endpoint functionality

## Deployment

### Vercel (Recommended)

1. **Connect to Vercel**

   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure API Routes**
   Create `vercel.json`:
   ```json
   {
     "functions": {
       "api/flames.js": {
         "runtime": "@vercel/node"
       }
     }
   }
   ```

### Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `dist`
3. **Environment variables**: Set in Netlify dashboard

### Traditional Hosting

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Serve the `dist` folder**
   - Upload to your web server
   - Configure for SPA routing
   - Set up API endpoints separately

## API Integration

### Express.js Backend

```javascript
// server.js
const express = require('express');
const { createFlamesEndpoint } = require('./src/api/flames');

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static('dist'));

// API endpoint
app.post('/api/flames', createFlamesEndpoint());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Serverless Functions

The API is designed to work with serverless platforms:

- **Vercel**: `api/flames.js`
- **Netlify**: `netlify/functions/flames.js`
- **AWS Lambda**: Compatible with serverless framework

## Troubleshooting

### Common Issues

**Build fails with TypeScript errors**

```bash
# Check TypeScript configuration
npm run type-check

# Fix with strict mode disabled temporarily
# Edit tsconfig.json: "strict": false
```

**Performance issues in development**

```bash
# Clear cache and restart
rm -rf node_modules .vite
npm install
npm run dev
```

**Audio not working**

- Check browser permissions
- Ensure user interaction before audio
- Verify audio files are accessible

**Haptic feedback not working**

- Requires HTTPS in production
- Limited browser support
- Check device capabilities

### Debug Mode

Enable debug mode in browser console:

```javascript
// Enable performance monitoring
localStorage.setItem('debug', 'true');

// Check device capabilities
import { useDeviceCapabilities } from './src/hooks/useDeviceCapabilities';
```

## Contributing

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Auto-formatting
- **Husky**: Pre-commit hooks

### Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Run quality checks: `npm run lint && npm run type-check`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open pull request

### Development Guidelines

- Write comprehensive TypeScript types
- Add JSDoc comments for public APIs
- Include unit tests for new features
- Update documentation for changes
- Follow existing code patterns

## Performance Optimization

### Best Practices

1. **Component Optimization**

   - Use React.memo for expensive components
   - Implement proper dependency arrays
   - Avoid unnecessary re-renders

2. **Asset Optimization**

   - Lazy load non-critical components
   - Optimize images and audio files
   - Use appropriate bundle splitting

3. **Device-Specific Adjustments**
   - Reduce particles on mobile
   - Disable complex animations on low-end devices
   - Implement progressive enhancement

## Browser Support

### Desktop

- Chrome 88+ ✅
- Firefox 85+ ✅
- Safari 14+ ✅
- Edge 88+ ✅

### Mobile

- Safari iOS 14+ ✅
- Chrome Android 88+ ✅
- Samsung Internet 15+ ✅
- Firefox Mobile 85+ ✅

### Features by Browser

| Feature   | Chrome | Firefox | Safari | Edge |
| --------- | ------ | ------- | ------ | ---- |
| Audio     | ✅     | ✅      | ✅     | ✅   |
| Haptics   | ✅     | ❌      | ✅     | ✅   |
| WebGL     | ✅     | ✅      | ✅     | ✅   |
| Particles | ✅     | ✅      | ✅     | ✅   |

## Support

### Getting Help

- **Documentation**: Check the docs folder
- **Issues**: Open GitHub issue
- **Discussions**: GitHub discussions
- **Email**: support@your-domain.com

### Resources

- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
- [User Guide](./USER_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Feature Documentation](./NEW_FEATURES.md)

---

**Happy coding!** 🚀✨
