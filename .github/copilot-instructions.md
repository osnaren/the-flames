# GitHub Copilot Instructions for The Flames

## 1. Project Overview & Architecture

- **Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, Supabase, Framer Motion.
- **Structure**: Feature-based architecture (`src/features/`).
  - **Features**: Self-contained modules (e.g., `flamesGame`, `howItWorks`) with `components/`, `constants.ts`, and `index.ts`.
  - **Shared**: `src/components/ui` (atomic), `src/components/layout` (global), `src/hooks` (logic).
  - **State**: Zustand (`src/store/usePreferencesStore.ts`) for global preferences (theme, sound, animations).
  - **API**: Supabase client (`src/lib/supabase.ts`) using RPC calls (`get_stats_with_trends`) and Edge Functions (`get-country`).

## 2. Critical Developer Workflows

- **Commands**:
  - `npm run dev`: Start dev server.
  - `npm run build`: Production build.
  - `npm run lint` / `npm run format`: Mandatory before commits.
- **Environment**: Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
- **Testing**: Use `src/utils/testing.ts` for validation logic and API integration tests.

## 3. Component & Coding Conventions

- **Container/Presentation Pattern**:
  - **Containers** (`FeatureContainer.tsx`): Handle logic, state, and data fetching.
  - **Components** (`StepXComponent.tsx`): Pure presentational components receiving props.
- **Enhanced Component Pattern**:
  - MUST use `useAnimationPreferences` hook for all animations.
  - MUST use `useInView` for performance optimization of heavy components.
  - Wrap major sections in `Card` with hover effects.
  - Implement staggered animations for children.
- **Naming**:
  - Containers: `FeatureContainer` (e.g., `HowItWorksContainer`).
  - Steps: `StepXDescription` (e.g., `Step1Names`).
  - Sub-components: `AnimatedElement` (e.g., `AnimatedLetter`).
- **Imports Order**:
  1. External libraries (React, Framer Motion, UI libs).
  2. Internal Hooks (`@hooks/`).
  3. Internal Components (`@components/`).
  4. Relative imports.

## 4. Animation & UI Patterns

- **Animation Logic**:
  - **Conditional Rendering**: Heavy animations (particles, 3D) MUST be wrapped in `{shouldAnimate && ...}`.
  - **Reduced Motion**: Respect `prefersReducedMotion` from `useAnimationPreferences`.
  - **Cleanup**: Use `AnimatePresence` for exit animations.
- **Styling**:
  - Use Tailwind CSS v4.
  - Use `src/styles/theme.css` variables (`--color-primary`, `--color-surface`).
  - Support Seasonal Themes (`src/styles/seasonal-themes.css`) via `data-theme` attribute.
- **Specific Visuals**:
  - **Name Connectors**: Implement multi-layer animations (Glow -> Energy Flow -> Heart -> Particles).
  - **Feedback**: Use `useHapticFeedback` and `useSoundEffects` for interactions.

## 5. Data & Validation

- **Validation**: Use Zod schemas from `src/utils/validation.ts` for all form inputs.
- **Supabase**:
  - Use `src/lib/supabase.ts` helpers (`withRetry`, `getStatsWithTrends`).
  - Handle `StatsError` for graceful degradation.
