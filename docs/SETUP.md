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
   git clone https://github.com/osnaren/the-flames.git
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
   Navigate to `http://localhost:3000`

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
npm run start        # Start production server

# Code Quality
npm run lint         # ESLint checking
npm run format       # Prettier formatting
npm run typecheck    # TypeScript checking
```

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/             # API Routes
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── core/            # Shared UI components
│   ├── gamification/    # Game features
│   └── settings/        # Settings panels
├── hooks/               # Custom React hooks
│   ├── useDeviceCapabilities.ts
│   ├── usePerformanceMonitor.ts
│   ├── useSoundSystem.ts
│   ├── useHapticFeedback.ts
│   └── useGameIntegration.ts
├── themes/              # Seasonal themes
│   └── seasonal/
├── utils/               # Utilities
│   ├── validation.ts    # Input validation
│   └── testing.ts       # Testing utilities
├── store/               # State management
└── styles/              # CSS styles
```

## Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# Optional configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_RATE_LIMIT_REQUESTS=20
NEXT_PUBLIC_RATE_LIMIT_WINDOW=60000
NEXT_PUBLIC_ENABLE_ANALYTICS=false
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

## Deployment

### Vercel (Recommended)

1. **Connect to Vercel**

   ```bash
   npm install -g vercel
   vercel
   ```

2. **Deploy**

   ```bash
   vercel deploy
   ```

### Netlify

1. **Build command**: `npm run build`
2. **Publish directory**: `.next`
3. **Environment variables**: Set in Netlify dashboard

### Traditional Hosting

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Start the server**

   ```bash
   npm run start
   ```

## Troubleshooting

### Common Issues

**Build fails with TypeScript errors**

```bash
# Check TypeScript configuration
npm run typecheck
```

**Performance issues in development**

```bash
# Clear cache and restart
rm -rf node_modules .next
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

## Contributing

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js configuration
- **Prettier**: Auto-formatting
- **Husky**: Pre-commit hooks

### Pull Request Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and add tests
4. Run quality checks: `npm run lint && npm run typecheck`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open pull request

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
- **Email**: <support@theflames.app>

### Resources

- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
- [User Guide](./USER_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Feature Documentation](./NEW_FEATURES.md)

---

**Happy coding!** 🚀✨
