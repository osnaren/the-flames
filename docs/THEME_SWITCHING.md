# Theme Switching Implementation Guide

This document explains the theme switching implementation in The Flames application, including how it works, edge cases handled, and how to maintain it.

## Overview

The application supports both light and dark themes with the following features:
- System preference detection via `prefers-color-scheme`
- Manual theme toggle via UI controls
- Persistent user preferences via localStorage
- Dynamic system preference change listening
- FOUC (Flash of Unstyled Content) prevention
- Proper SSR/hydration handling

## Architecture

### Dual Initialization Strategy

The theme system uses a two-stage initialization approach:

1. **Inline Script (Pre-React)**: Located in `src/app/layout.tsx`
   - Runs immediately in the `<head>` before React hydration
   - Prevents FOUC by applying theme classes early
   - Detects system preference and localStorage
   - Sets `dark` class and `data-theme` attribute on `<html>`

2. **React Store Initialization**: Located in `src/store/usePreferencesStore.ts`
   - Runs after React hydration via `PreferencesInitializer`
   - Syncs with the inline script's determination
   - Sets up system preference listener
   - Manages theme state in Zustand store

### Component Structure

```
ClientLayout (src/components/layout/ClientLayout.tsx)
  └── PreferencesInitializer (src/components/providers/PreferencesInitializer.tsx)
        └── Calls usePreferencesStore.init()
              └── Sets up theme and listeners
```

## Key Files

### 1. `src/app/layout.tsx` (Inline Script)

**Purpose**: Prevent FOUC and set initial theme before React loads

```javascript
// Inline script in <head>
(function() {
  try {
    var storedTheme = localStorage.getItem('theme');
    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && supportDarkMode)) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
```

**When it runs**: Immediately in `<head>` before any React code

**What it does**:
1. Checks localStorage for saved preference
2. Falls back to system preference if no saved value
3. Applies theme to DOM immediately

### 2. `src/store/usePreferencesStore.ts` (Store)

**Purpose**: Manage theme state and sync with DOM

```typescript
init: () => {
  // 1. Determine theme
  let isDarkTheme: boolean;
  
  if (storedTheme) {
    // User preference takes priority
    isDarkTheme = storedTheme === 'dark';
  } else {
    // Check DOM (set by inline script) or system preference
    const hasInlineScriptSetDark = document.documentElement.classList.contains('dark');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDarkTheme = hasInlineScriptSetDark || systemPrefersDark;
  }
  
  // 2. Sync DOM
  if (isDarkTheme) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  // 3. Update store
  set({ isDarkTheme, hydrated: true });
  
  // 4. Listen for system preference changes (only if no user preference)
  if (!storedTheme) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  }
}
```

**When it runs**: During React hydration via `PreferencesInitializer`

**What it does**:
1. Determines the correct theme based on priority: stored > system > default
2. Syncs DOM state with store state
3. Sets up listener for system preference changes
4. Marks store as hydrated

### 3. `src/components/providers/PreferencesInitializer.tsx`

**Purpose**: Initialize preferences store early in React lifecycle

```typescript
export function PreferencesInitializer() {
  useEffect(() => {
    const { init } = usePreferencesStore.getState();
    init();
    
    return () => {
      const { cleanup } = usePreferencesStore.getState();
      cleanup();
    };
  }, []);
  
  return null;
}
```

**When it runs**: As soon as ClientLayout mounts (early in app lifecycle)

**What it does**:
1. Calls store init() to set up theme
2. Returns cleanup function to remove listeners on unmount

### 4. `src/components/layout/FloatingControlPanel/FloatingControlPanel.tsx`

**Purpose**: UI control for theme toggling

```typescript
const [{ isDarkTheme, hydrated }, { toggleTheme }] = usePreferences();

const controls = [
  {
    label: 'Theme',
    activeIcon: Sun,
    inactiveIcon: Moon,
    active: !isDarkTheme,
    toggle: toggleTheme,
    ariaLabel: isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme',
  },
  // ...
];
```

**What it does**:
1. Displays theme toggle button with appropriate icon
2. Shows correct icon based on `isDarkTheme` state
3. Handles theme toggle via `toggleTheme` action

## Theme Priority Order

The system respects preferences in this order:

1. **User's explicit choice** (stored in localStorage): Highest priority
2. **System preference** (via `prefers-color-scheme`): Used when no explicit choice
3. **Default (light mode)**: Fallback if both above are unavailable

## System Preference Listener

When the user hasn't set an explicit theme preference, the app automatically follows system preference changes:

```typescript
// Only add listener if no stored preference
if (!storedTheme) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    // Only update if user still hasn't set explicit preference
    const currentStoredTheme = localStorage.getItem('theme');
    if (!currentStoredTheme) {
      const newIsDark = e.matches;
      set({ isDarkTheme: newIsDark });
      // Update DOM...
    }
  };
  
  mediaQuery.addEventListener('change', handleSystemThemeChange);
}
```

**Behavior**:
- Listener is ONLY active when user has no stored preference
- If user toggles theme manually, listener is effectively bypassed
- Listener is properly cleaned up on component unmount

**Cleanup Safety**:
The cleanup function is idempotent (safe to call multiple times):
```typescript
cleanup: () => {
  if (themeCleanup) {
    themeCleanup();
    themeCleanup = null; // Prevents double cleanup
  }
}
```
This means both `usePreferences` and `PreferencesInitializer` can safely call cleanup without conflicts.

## Edge Cases Handled

### 1. First Visit (No localStorage)
- Inline script checks system preference
- Store init syncs with inline script's choice
- System preference listener is activated

### 2. Returning User (Has localStorage)
- Inline script uses stored preference
- Store init uses stored preference
- System preference listener is NOT activated

### 3. System Preference Changes
- If no stored preference: Theme updates automatically
- If stored preference exists: Theme stays as user set it

### 4. Race Conditions
- Inline script runs first (in `<head>`)
- Store init syncs with DOM state set by inline script
- No FOUC or flashing

### 5. SSR/Hydration
- Inline script prevents FOUC
- PreferencesInitializer runs early in client-side lifecycle
- `hydrated` flag prevents premature component renders

### 6. Multiple Rapid Toggles
- Each toggle updates store, DOM, and localStorage atomically
- State remains consistent across all three

### 7. Component Unmount
- Cleanup function removes event listeners
- Prevents memory leaks

## How to Maintain

### Adding New Theme-Related Features

1. **For UI Controls**: Use `usePreferences()` hook
   ```typescript
   const [{ isDarkTheme }, { toggleTheme }] = usePreferences();
   ```

2. **For Store Access**: Use `usePreferencesStore` directly
   ```typescript
   const isDarkTheme = usePreferencesStore((state) => state.isDarkTheme);
   ```

3. **Check `hydrated` State** for critical theme-dependent rendering:
   ```typescript
   const { isDarkTheme, hydrated } = usePreferencesStore();
   if (!hydrated) return null; // or loading state
   ```
   Note: Most components don't need this check because PreferencesInitializer ensures early hydration.

### Modifying Theme Detection Logic

⚠️ **Critical**: If you modify theme detection, update BOTH:
1. Inline script in `src/app/layout.tsx`
2. Store init in `src/store/usePreferencesStore.ts`

These must stay in sync to prevent FOUC and ensure correct theme on load.

### Testing Theme Changes

Run the comprehensive test suite:
```bash
npm run test:theme
# or
npx playwright test tests/theme-switching.spec.ts
```

Tests cover:
- System preference detection (dark/light)
- localStorage persistence
- Priority handling (stored > system)
- Dynamic preference changes
- Icon state sync
- FOUC prevention
- Rapid toggles

## Common Issues and Solutions

### Issue: Theme flashes on page load
**Cause**: Inline script not running or failing
**Solution**: Check browser console for errors in inline script

### Issue: Theme doesn't follow system preference
**Cause**: User has explicit preference stored
**Solution**: Clear localStorage or call `localStorage.removeItem('theme')`

### Issue: Theme toggle doesn't work
**Cause**: Store not initialized or hydrated
**Solution**: Ensure PreferencesInitializer is mounted in ClientLayout

### Issue: Memory leak warning in console
**Cause**: Cleanup function not running
**Solution**: Check that useEffect cleanup in PreferencesInitializer is working

## Performance Considerations

- **Inline script**: Minimal, runs once on page load
- **Store initialization**: Runs once per session, early in lifecycle
- **System preference listener**: Only active when needed, cleaned up properly
- **Toggle operations**: Atomic, update all three states (store, DOM, localStorage) synchronously

## Accessibility

- All theme controls have proper ARIA labels
- Icon states match theme states
- Visual feedback for theme changes
- Keyboard accessible theme toggles
- Respects user's system preferences

## Browser Support

- Modern browsers: Full support
- Older browsers: Fallback to default theme (light mode)
- matchMedia API: Required for system preference detection
- localStorage: Required for persistence

## Future Enhancements

Potential improvements:
- [ ] Add theme transition animations
- [ ] Support custom theme colors
- [ ] Add auto theme scheduling (e.g., dark at night)
- [ ] Add theme preview before applying
- [ ] Support per-page theme overrides

## Related Documentation

- [Testing Guide](./TESTING.md) - How to run theme tests
- [Component Architecture](./COMPONENTS.md) - Component structure
- [State Management](./STATE_MANAGEMENT.md) - Zustand store patterns
