# FLAMES Manual Mode

A comprehensive manual mode implementation that provides two distinct interactive experiences for calculating FLAMES manually - Click Experience and Canvas Experience.

## Features

### � Two Interactive Experiences

- **Click Experience**: Step-by-step letter clicking with visual feedback and result validation
- **Canvas Experience**: Free-form drawing on an interactive canvas with letters and FLAMES display

### ✨ Click Experience Features

- Interactive letter tiles for both names
- Click to cross out matching letters
- Interactive F.L.A.M.E.S letters for elimination process
- Real-time result validation and feedback
- Step-by-step instructions with visual cues
- Progress tracking and completion detection

### 🎨 Canvas Experience Features

- Interactive drawing canvas with theme-aware backgrounds
- Custom cursors (chalk for dark mode, pen for light mode)
- Drawing and erasing modes with visual feedback
- Responsive canvas sizing for all devices
- Touch-friendly controls for mobile devices
- Layered display of names and FLAMES letters

### 📱 Responsive Design

- Mobile-first approach with floating toolbars
- Adaptive UI for tablets and desktop
- Touch gesture support
- Optimized performance for all devices

### 📤 Advanced Share & Save Functionality

- Generate high-quality images for both experiences
- Native Web Share API with file sharing
- Fallback to clipboard link sharing
- Progress tracking for share/save operations
- Error handling with user feedback
- Custom branding on exported images

### � Loading States & Error Handling

- Visual loading indicators for all async operations
- Comprehensive error boundaries
- User-friendly error messages
- Graceful fallbacks for unsupported features

## Component Architecture

```text
ManualMode/
├── ManualMode.tsx                 # Main orchestrator component
├── index.ts                       # Clean exports
├── types.ts                       # TypeScript definitions
├── utils.ts                       # Canvas and validation utilities
├── image.utils.tsx                # Image generation and sharing logic
├── hooks/
│   └── useManualMode.ts          # Central state management hook
└── components/
    ├── NameInputForm.tsx         # Name input with experience mode selection
    ├── ClickExperience.tsx       # Click-based manual calculation
    ├── CanvasExperience.tsx      # Canvas-based drawing experience
    ├── CanvasTools.tsx           # Floating toolbar for canvas
    ├── CanvasInstructions.tsx    # Help and instructions
    ├── LetterTile.tsx           # Individual letter components
    ├── FlamesLetters.tsx        # Interactive FLAMES letters
    ├── ClickResultImage.tsx     # Image template for click results
    └── ErrorBoundary.tsx        # Error handling wrapper
```

## State Management

### Central Hook (`useManualMode`)

```typescript
const {
  // Core state
  name1, name2, experienceMode, canvasState, result,
  
  // Loading states
  isSharing, isSaving,
  
  // Handlers
  handleNamesSubmit, goBackToInput,
  handleShare, handleSave, handleResultChange,
  
  // Canvas-specific
  canvasRef, startDrawing, draw, stopDrawing,
  toggleErase, clearCanvasArea,
  
  // Click-specific  
  toggleLetter, toggleFlamesLetter
} = useManualMode();
```

### State Flow

1. **Input Stage**: User enters names and selects experience mode
2. **Experience Stage**: User interacts with chosen experience (click/canvas)
3. **Result Stage**: System tracks progress and enables sharing/saving

## Technical Implementation

### Image Generation

#### Canvas Experience

- Captures actual canvas content with drawings
- Adds branded overlay with names and website URL
- Handles high DPI displays with proper scaling
- Theme-aware background rendering

#### Click Experience

- Renders React component to DOM temporarily
- Uses html2canvas for high-quality capture
- Supports "In Progress" and completed states
- Maintains theme consistency

### Share Functionality

```typescript
// Multi-tier fallback system
1. Web Share API with file sharing (mobile)
2. Clipboard link sharing (desktop)
3. Manual copy notification (fallback)
```

### Canvas Implementation

- **High Performance**: Optimized drawing with event throttling
- **Cross-Platform**: Mouse and touch event handling
- **Responsive**: Dynamic sizing based on device capabilities
- **Accessible**: Proper ARIA labels and keyboard navigation

### Validation & Error Handling

- **Name Validation**: Length, character restrictions, uniqueness
- **Canvas State**: Proper initialization and context checking
- **Image Generation**: Timeout handling and fallback messages
- **Network Operations**: Retry logic and user feedback

## Usage Examples

### Basic Integration

```tsx
import ManualMode from '@features/flamesGame/ManualMode';

function MyApp() {
  return (
    <div className="app">
      <ManualMode />
    </div>
  );
}
```

### With URL Parameters

```typescript
// Automatic handling of URL parameters
// ?name1=John&name2=Jane - Pre-fills names
// Updates URL when names are submitted
// Clears parameters on reset
```

### Custom Error Boundary

```tsx
import ManualMode from '@features/flamesGame/ManualMode';
import ErrorBoundary from '@features/flamesGame/ManualMode/components/ErrorBoundary';

function MyApp() {
  return (
    <ErrorBoundary>
      <ManualMode />
    </ErrorBoundary>
  );
}
```

## Mobile Optimization

### Touch Interactions

- Proper touch event handling with preventDefault
- Custom touch cursors and visual feedback
- Floating toolbar positioned for thumb access
- Responsive scaling for different screen sizes

### Performance

- Canvas size optimization for mobile GPUs
- Reduced particle effects on lower-end devices
- Debounced resize handling
- Efficient memory management

## Browser Support

### Required Features

- Canvas API with 2D context
- ES6+ JavaScript support
- CSS Custom Properties
- Touch Events (mobile)

### Optional Enhancements

- Web Share API (enhanced sharing)
- Clipboard API (link copying)
- High DPI displays (better image quality)
- Hardware acceleration (smoother drawing)

### Fallbacks

- Manual download if sharing fails
- Basic cursor if custom cursors unavailable
- Standard notifications if native toasts fail
- URL copying if clipboard access denied

## Performance Considerations

### Canvas Optimization

- DPR capping to prevent memory issues
- Event throttling for smooth drawing
- Efficient eraser implementation
- Background rendering optimization

### Image Processing

- Progressive loading with feedback
- Timeout handling for large images
- Memory cleanup after generation
- Quality vs. size optimization

### State Optimization

- Minimal re-renders with useCallback
- Efficient Set operations for letter tracking
- Debounced URL updates
- Lazy initialization of expensive operations

## Development

### Testing Approach

- Component unit tests with React Testing Library
- Canvas interaction testing with custom utilities
- Image generation testing with mock implementations
- Cross-device testing for responsive behavior

### Debugging

- Console logging for state changes
- Canvas context validation
- Image generation error tracking
- Performance monitoring for drawing operations

## Future Enhancements

### Planned Features

- Undo/Redo functionality for canvas
- Custom brush sizes and colors
- Animation support for letter transitions
- Social media platform-specific sharing
- Offline functionality with localStorage
- Advanced accessibility features

### Performance Improvements

- WebGL acceleration for complex drawings
- WebAssembly for image processing
- Service Worker caching for assets
- Progressive loading for better UX
