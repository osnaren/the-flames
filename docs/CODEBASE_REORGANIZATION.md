# Codebase Reorganization Summary

## New Folder Structure

```
src/
├── app/                          # Next.js App Router (pages only)
│   ├── page.tsx                  # → uses @modules/home
│   ├── about/page.tsx           # → uses @modules/about
│   ├── charts/page.tsx          # → uses @modules/charts
│   ├── manual/page.tsx          # → uses @modules/manual
│   ├── how-it-works/page.tsx    # → uses @modules/how-it-works
│   └── privacy/page.tsx         # → uses @modules/privacy
│
├── modules/                      # Feature modules (page-specific)
│   ├── home/                     # Home page / FLAMES game
│   │   ├── components/
│   │   │   ├── AnimatedHeader/
│   │   │   ├── InputForm/
│   │   │   ├── FlamesProcessor/
│   │   │   └── ResultCard/
│   │   ├── hooks/
│   │   │   └── useFlamesEngine.ts
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   ├── HomePage.tsx
│   │   └── index.ts
│   │
│   ├── charts/                   # Charts page
│   │   ├── components/
│   │   │   ├── ChartsContent.tsx
│   │   │   ├── ChartStats.tsx
│   │   │   ├── RecentMatches.tsx
│   │   │   ├── RegionalStats.tsx
│   │   │   ├── ResultTrendBars.tsx
│   │   │   └── TopCountries.tsx
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   ├── ChartsPage.tsx
│   │   └── index.ts
│   │
│   ├── manual/                   # Manual mode page
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── ManualMode.tsx
│   │   └── index.ts
│   │
│   ├── how-it-works/            # How it works page
│   │   ├── components/
│   │   ├── constants.ts
│   │   ├── HowItWorksContainer.tsx
│   │   └── index.ts
│   │
│   ├── about/                    # About page
│   │   ├── components/
│   │   ├── AboutPage.tsx
│   │   └── index.ts
│   │
│   └── privacy/                  # Privacy page
│       ├── PrivacyPage.tsx
│       └── index.ts
│
├── components/
│   ├── core/                     # Shared atomic UI (renamed from ui)
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Toggle/
│   │   ├── LoadingScreen/
│   │   ├── Logo/
│   │   └── ...
│   │
│   ├── layout/                   # Global layout components
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── ClientLayout.tsx
│   │   ├── GlobalErrorBoundary.tsx
│   │   └── PageTransition/
│   │
│   └── vendor/                   # Third-party UI libraries
│       ├── shadcn/              # shadcn/ui components
│       └── magicui/             # Magic UI components
│
├── shared/                       # Shared across all modules
│   ├── hooks/                   # Shared hooks
│   ├── utils/                   # Shared utilities
│   ├── constants/               # Shared constants
│   └── lib/                     # External service integrations
│
└── store/                        # State management
    └── usePreferencesStore.ts
```

## Naming Conventions

### Files

- **Components**: `PascalCase.tsx` (e.g., `AnimatedHeader.tsx`)
- **Hooks**: `useCamelCase.ts` (e.g., `useFlamesEngine.ts`)
- **Types**: `camelCase.types.ts` or just `types.ts`
- **Constants**: `camelCase.constants.ts` or just `constants.ts`
- **Utilities**: `camelCase.utils.ts` or just `utils.ts`
- **Barrel exports**: `index.ts`

### Folders

- **Modules**: `kebab-case` (e.g., `how-it-works`)
- **Components**: `PascalCase` (e.g., `AnimatedHeader/`)
- **Feature folders**: `kebab-case` (e.g., `shared/`)

## Migration Status

### Phase 1: Structure Setup ✅

- [x] Create modules directory
- [x] Create shared directory
- [x] Update tsconfig.json with new aliases

### Phase 2: Module Migration ✅

- [x] Migrate home module
- [x] Migrate charts module
- [x] Migrate manual module
- [x] Migrate how-it-works module
- [x] Migrate about module
- [x] Migrate privacy module

### Phase 3: Component Reorganization (Optional)

- [ ] Consider moving shadcn/ to vendor/shadcn/
- [ ] Consider moving magicui/ to vendor/magicui/

### Phase 4: Cleanup (READY TO EXECUTE)

- [ ] Remove deprecated src/pages/ folder
- [ ] Remove deprecated src/features/ folder
- [ ] Update all imports
- [ ] Delete unused files

## Files Marked for Deletion

After migration is complete, the following files/folders should be deleted:

```
src/pages/                        # Replaced by modules
src/features/                     # Replaced by modules  
src/components/homepage/          # Moved to modules/home
src/components/about/             # Moved to modules/about
src/components/gamification/      # Moved or deprecated
src/constants/                    # Moved to shared/constants
```

## Import Path Changes

| Old Path | New Path |
|----------|----------|
| `@pages/HomePage` | `@modules/home` |
| `@features/flamesGame/*` | `@modules/home/*` |
| `@features/howItWorks/*` | `@modules/how-it-works/*` |
| `@components/homepage/*` | `@modules/home/components/*` |
| `@ui/*` | `@core/*` |
| `@shadcn/*` | `@vendor/shadcn/*` |
| `@magicui/*` | `@vendor/magicui/*` |
| `@/constants/*` | `@shared/constants/*` |
