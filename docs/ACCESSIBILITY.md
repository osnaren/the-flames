# Accessibility (A11y) Documentation

This document outlines the accessibility standards, testing procedures, and best practices for The FLAMES Game application.

## Table of Contents

1. [Accessibility Standards](#accessibility-standards)
2. [Testing Tools](#testing-tools)
3. [Running Accessibility Audits](#running-accessibility-audits)
4. [Accessibility Checklist](#accessibility-checklist)
5. [Component Guidelines](#component-guidelines)
6. [Known Issues & Remediation](#known-issues--remediation)

---

## Accessibility Standards

The FLAMES Game adheres to **WCAG 2.1 Level AA** compliance standards. This includes:

### Perceivable

- All non-text content has text alternatives
- Captions and alternatives for multimedia
- Content is adaptable and distinguishable
- Color contrast ratio of at least 4.5:1 for normal text, 3:1 for large text

### Operable

- All functionality is keyboard accessible
- Users have enough time to read and use content
- Content doesn't cause seizures (no flashing more than 3 times per second)
- Users can easily navigate and find content
- Skip links are provided

### Understandable

- Text is readable and understandable
- Pages operate in predictable ways
- Users are helped to avoid and correct mistakes

### Robust

- Content is compatible with assistive technologies
- Valid HTML markup
- ARIA attributes used correctly

---

## Testing Tools

### Installed Tools

1. **axe-core CLI** (`@axe-core/cli`)
   - Deque's industry-standard accessibility testing engine
   - Tests against WCAG 2.0, 2.1, and best practices

2. **Lighthouse CI** (`@lhci/cli`)
   - Google's automated auditing tool
   - Includes accessibility scoring and recommendations

3. **Playwright**
   - For automated browser testing
   - Can be extended with axe-core for automated a11y testing

4. **ESLint jsx-a11y**
   - Static analysis for JSX accessibility
   - Catches common issues during development

### Manual Testing Tools

- **Screen Readers**: NVDA (Windows), VoiceOver (macOS), JAWS
- **Browser Extensions**: axe DevTools, WAVE, Accessibility Insights
- **Keyboard Navigation Testing**: Tab through the entire application

---

## Running Accessibility Audits

### Quick Audit (Development)

```bash
# Start the development server
npm run dev

# In another terminal, run axe-core on localhost
npm run a11y:axe:dev
```

### Full Audit

```bash
# Build and start the production server
npm run build
npm run start

# In another terminal, run full audit
npm run a11y:audit
```

### Lighthouse CI Only

```bash
# Requires production build running
npm run a11y:lhci
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run a11y:audit` | Full accessibility audit (axe + Lighthouse) |
| `npm run a11y:axe` | Run axe-core CLI only |
| `npm run a11y:lhci` | Run Lighthouse CI only |
| `npm run a11y:axe:dev` | Quick axe test on localhost:3000 |

---

## Accessibility Checklist

### Before Every Pull Request

- [ ] Run `npm run lint` (includes jsx-a11y rules)
- [ ] Test keyboard navigation on new/modified components
- [ ] Verify focus indicators are visible
- [ ] Check color contrast for new UI elements
- [ ] Add appropriate ARIA labels to interactive elements
- [ ] Test with screen reader (at least VoiceOver or NVDA)

### For New Components

- [ ] Has semantic HTML structure
- [ ] Interactive elements are focusable
- [ ] Has visible focus indicators
- [ ] Includes appropriate ARIA roles and labels
- [ ] Works with keyboard only (no mouse required)
- [ ] Announces state changes to screen readers
- [ ] Error messages are programmatically associated with inputs

### For Forms

- [ ] All inputs have associated labels
- [ ] Required fields are indicated (not just by color)
- [ ] Error messages use `role="alert"` or `aria-live`
- [ ] Form validation errors are linked via `aria-describedby`
- [ ] Form has a clear submit button

### For Modals/Dialogs

- [ ] Focus trapped within modal when open
- [ ] Escape key closes modal
- [ ] Focus returns to trigger element on close
- [ ] Background content is hidden from assistive tech (`aria-hidden`)
- [ ] Modal has appropriate ARIA attributes (`role="dialog"`, `aria-modal`)

---

## Component Guidelines

### Buttons

```tsx
// ✅ Good - Has accessible label
<Button aria-label="Close settings">
  <X aria-hidden="true" />
</Button>

// ✅ Good - Text content serves as label
<Button>Submit Form</Button>

// ❌ Bad - No accessible label
<Button>
  <X />
</Button>
```

### Form Inputs

```tsx
// ✅ Good - Properly labeled with error handling
<label htmlFor="name1">First Name</label>
<input
  id="name1"
  aria-describedby={errors.name1 ? 'name1-error' : undefined}
  aria-invalid={errors.name1 ? 'true' : undefined}
/>
{errors.name1 && (
  <p id="name1-error" role="alert">{errors.name1}</p>
)}
```

### Icons

```tsx
// ✅ Good - Decorative icon hidden from AT
<Icon aria-hidden="true" />
<span>Settings</span>

// ✅ Good - Icon-only button with label
<button aria-label="Settings">
  <Icon aria-hidden="true" />
</button>
```

### Navigation

```tsx
// ✅ Good - Proper landmarks and labels
<nav aria-label="Main navigation">
  <Link href="/" aria-current={isActive ? 'page' : undefined}>Home</Link>
</nav>
```

### Loading States

```tsx
// ✅ Good - Screen reader announcement
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? 'Loading...' : 'Content loaded'}
</div>
```

### Result Announcements

```tsx
// ✅ Good - Results announced to screen readers
<div role="region" aria-live="polite" aria-label={`Result: ${result}`}>
  {/* Result content */}
</div>
```

---

## Focus Management

### Skip Link

The application includes a skip-to-main-content link as the first focusable element:

```tsx
<a
  href="#main-content"
  className="fixed top-0 left-0 z-9999 -translate-y-full focus:translate-y-0"
>
  Skip to main content
</a>
```

### Focus Trap for Modals

Modals implement focus trapping:

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab' && menuRef.current) {
      // Focus trap logic
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isOpen]);
```

---

## Animation Preferences

The application respects user preferences for reduced motion:

```tsx
const { shouldAnimate, prefersReducedMotion } = useAnimationPreferences();

// Use reduced or no animation when user prefers
{shouldAnimate && <AnimatedComponent />}

// Alternative for motion.div
<motion.div
  animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1] }}
/>
```

---

## Known Issues & Remediation

### Automated Test Limitations

Some issues may not be caught by automated tools:

- Context-dependent color contrast
- Logical reading order
- Meaningful link text
- Appropriate heading hierarchy

### Manual Testing Required

1. **Screen Reader Testing**: Test with actual screen readers
2. **Keyboard Navigation**: Tab through entire flows
3. **Zoom Testing**: Test at 200% and 400% zoom
4. **Mobile Accessibility**: Test with mobile screen readers

---

## CI/CD Integration

The Lighthouse CI configuration is set up in `lighthouserc.js` and can be integrated into your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Run Accessibility Audit
  run: |
    npm run build
    npm run start &
    sleep 10
    npm run a11y:lhci
```

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Documentation](https://www.deque.com/axe/)
- [Lighthouse Accessibility Audits](https://web.dev/lighthouse-accessibility/)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)
- [MDN ARIA Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

---

## Contact

For accessibility concerns or questions, please open an issue on GitHub with the `a11y` label.
