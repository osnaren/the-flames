# FLAMES Manual Mode

A completely revamped manual mode that provides an interactive canvas-based experience for calculating FLAMES manually.

## Features

### 🎨 Two Visual Modes

- **Chalkboard Mode**: Dark theme with chalk-like drawing on blackboard
- **Pen & Paper Mode**: Light theme with pen-like drawing on paper

### ✍️ Interactive Drawing Canvas

- Real-time drawing with mouse/touch support
- Custom cursors for different modes
- Right-click to erase functionality
- Clear canvas option
- Mobile-friendly touch controls

### 📝 Name Management

- Beautiful input form with validation
- URL parameter support (`?name1=John&name2=Jane`)
- Automatic URL updates
- Mode toggle in input screen

### 🔤 Letter Tiles

- Individual clickable tiles for each letter
- Visual cross-out animations
- Separate tiles for each name
- Interactive feedback

### 🔥 FLAMES Letters

- Interactive F.L.A.M.E.S letters
- Click to cross out letters during counting
- Visual progress tracking
- Meaning display for each letter

### 📤 Share & Export

- Generate shareable images with branding
- Native share API support
- Fallback download functionality
- High-quality image export

### 🛠️ Canvas Tools

- Floating toolbar with essential tools
- Mode switching
- Erase/Draw toggle
- Clear canvas
- Share functionality
- Back navigation

## Component Architecture

```
ManualMode/
├── ManualMode.tsx           # Main component with state management
├── hooks/
│   └── useManualMode.ts     # Custom hook for all manual mode logic
├── components/
│   ├── NameInputForm.tsx    # Input form with validation
│   ├── DrawingCanvas.tsx    # Main canvas experience
│   ├── CanvasTools.tsx      # Floating toolbar
│   ├── LetterTile.tsx       # Individual letter tiles
│   ├── FlamesLetters.tsx    # F.L.A.M.E.S interactive letters
│   └── ErrorBoundary.tsx    # Error handling
├── types.ts                 # TypeScript interfaces
├── utils.ts                 # Utility functions
└── index.ts                 # Exports

```

## Usage

### Basic Implementation

```tsx
import ManualMode from '@features/flamesGame/ManualMode';

function App() {
  return (
    <ManualMode
      onShare={(imageData) => {
        // Handle share functionality
        console.log('Sharing image:', imageData);
      }}
      onClose={() => {
        // Handle close functionality
        console.log('Closing manual mode');
      }}
    />
  );
}
```

### URL Parameters

The component automatically handles URL parameters:

- `?name1=John&name2=Jane` - Pre-fills names and goes directly to canvas
- Parameters are updated when names are submitted
- Parameters are cleared when reset

### Mobile Support

- Touch drawing support
- Responsive design
- Mobile-optimized controls
- Custom touch cursors

## Technical Details

### Canvas Implementation

- High DPI support with device pixel ratio scaling
- Smooth drawing with proper event handling
- Efficient erasing with composite operations
- Background patterns for visual appeal

### State Management

- Centralized state in custom hook
- URL synchronization
- Canvas context management
- Drawing state tracking

### Validation

- Name validation with proper error messages
- Duplicate name checking
- Real-time validation feedback
- Toast notifications

### Styling

- Mode-specific color schemes
- Smooth transitions between modes
- Responsive grid layouts
- Custom cursor implementations

## Browser Support

- Modern browsers with Canvas API support
- Touch events for mobile devices
- Native Web Share API when available
- Fallback download for unsupported browsers
