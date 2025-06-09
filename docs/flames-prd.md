# The Flames App – Product Requirements Document (PRD)

## 1. Overview & Vision

**Product Name:**  
_The Flames_

**Overview:**  
_The Flames_ is a modern, interactive, and emotionally engaging web application that re-imagines the classic childhood FLAMES game. The app guides users through a playful process where they enter two names, see dynamic visual effects (including animations, confetti bursts, glow transitions, and slot-machine style result reveal), and learn the relationship result (Friendship, Love, Affection, Marriage, Enemy, or Siblings). In addition, it features a manual mode (paper & pencil experience) and a global charts section for displaying trending results based on aggregated user data.

**Vision:**  
To create an experience that is nostalgic yet innovative, combining fun, visual storytelling with modern design and technology. The app should engage users, drive shareability, and feel like a complete product—polished, accessible, and ready for public launch.

---

## 2. Objectives

- **Engagement:**  
  Deliver a delightful and memorable user experience by blending playful animations, interactive UI elements, and a touch of nostalgia.

- **Scalability:**  
  Build a modular, maintainable, and scalable codebase using React with TypeScript, making it easy to add new features (e.g., global charts, manual mode, sharing enhancements).

- **Accessibility & Performance:**  
  Ensure the experience is accessible (high contrast, ARIA labels, keyboard navigation, reduced motion support) and performant across devices.

- **Shareability:**  
  Enable users to share their personalized results using native share options (on mobile) or a desktop fallback (copy link/download image).

- **Data-Driven Insights:**  
  Lay the groundwork for a real backend that captures match results, enabling global charts, leaderboards, and trends in the future.

---

## 3. Target Audience

- **Primary Audience:**  
  Young adults and teens who appreciate nostalgia, interactive web games, and sharing fun experiences on social media.
- **Secondary Audience:**  
  Educators or event organizers who might use a fun, ice-breaker tool; and social media users looking for shareable, quirky content.

---

## 4. Scope

**In-Scope:**

- Core FLAMES game logic and visual flow
- Two modes of play:
  - **Auto Mode:** Fully animated, interactive experience that calculates the FLAMES result automatically.
  - **Manual Mode:** A paper-and-pencil inspired mode where users manually strike out common letters and eliminate FLAMES letters.
- Global Charts UI (initially with mock data, with backend integration pending)
- Smart sharing functionality that supports both mobile (via native share APIs) and desktop (via modal/dropdown options, copy link, download image).
- Floating Control Panel for theme, animation, and sound toggles.
- Detailed “How It Works” page with an interactive visual tutorial that explains the FLAMES counting process.
- Comprehensive UI/UX polish with dark/light themes, responsive design, and accessibility enhancements.

**Out-of-Scope:**

- Full backend integration for global charts (to be revisited after MVP)
- Extensive user authentication and data privacy management (app data remains anonymous)
- Advanced analytics or AI-driven enhancements (future roadmap items)

---

## 5. Features & Functional Requirements

### Core Game Flow (Auto Mode)

- **Name Input:**
  - Two input fields for entering names.
  - Validation with Zod (non-empty, non-identical, character rules).
- **Common Letter Strike:**
  - Visually striking out common letters with burning or crossed-out animations.
- **Slot Machine Reveal:**
  - A slot-style animation that cycles through “F L A M E S” and stops sequentially.
  - Results card appears directly below the name-strike and slot animation section.
- **Result Display:**
  - Final result shown with emotional cues (emoji, meaningful text, glowing effects).
  - Display result mapping (e.g., “A = Affection”).

### Manual Mode (Paper & Pencil Experience)

- **Editable Name Fields:**
  - Two editable fields with pencil writing fonts, locking on confirmation (with a checkmark icon).
  - Transition to a readonly state with pencil-cursor style.
- **Interactive Letter Strike:**
  - After name entry, present letters as tiles.
  - Allow users to manually strike out common letters using a pencil cursor.
- **Manual FLAMES Elimination:**
  - Display static FLAMES letters.
  - Users manually strike out letters one-by-one, with eraser and undo functions.
  - Final result is revealed after all elimination is done.

### Global Charts (UI for Analytics)

- **Display & Aggregation:**
  - Show total matches, daily matches, and trending results based on FLAMES outcomes.
  - Display popular names with medal icons (🥇, 🥈, 🥉) and pairings.
- **Filtering Options:**
  - Time filters (Today, This Week, All Time).
- **Mock Data Handling:**
  - Initially display dummy data; later, integrate with Supabase/Postgres for real aggregated metrics.

### Sharing & Social

- **Share Button:**
  - On mobile, trigger `navigator.share()` for native share sheets.
  - On desktop, open a modal/dropdown with options:
    - **Copy Link:** Copies URL with query parameters (e.g., `?name1=Naren&name2=Priya`).
    - **Download Result Card:** Exports the result card as a PNG (using html2canvas) with watermark/logo.
    - **Additional Social Options:** (Optional buttons for Twitter, etc.)

### Floating Control Panel

- **Theme Toggle:**
  - Light/dark mode switching with persistent settings (localStorage).
- **Animation Toggle:**
  - Enable/disable animations.
- **Sound Toggle:**
  - Optional sound control for SFX.

### How It Works Page

- **Interactive Tutorial:**
  - Explain step-by-step the FLAMES counting logic through animations.
  - Use a visual simulation where the count (e.g., 8) is highlighted on the FLAMES letters.
  - Show guidance text such as “Repeat this process until one letter remains” and reveal the final mapping.

---

## 6. Non-Functional Requirements

- **Performance:**  
  Ensure smooth animations and transitions; optimize for low-end devices by throttling heavy effects (e.g., confetti particles).

- **Accessibility:**  
  All elements should meet WCAG standards—proper contrast, ARIA labels, keyboard navigation, and reduced motion support for users with preferences.

- **Scalability:**  
  The codebase should be modular (using a clean folder structure with separate components, features, hooks, and utilities) to allow easy integration of future features.

- **Responsiveness:**  
  UI must adapt seamlessly across desktops, tablets, and mobile devices.

- **Maintainability:**  
  Follow best coding practices (clean separation of concerns, use TypeScript, clear state management, reusable components) to ease future enhancements.

- **Security:**  
  Minimal risk as no personal information is stored; public write access to the database is protected by row-level security and rate limiting mechanisms.

---

## 7. Technical Architecture

### Frontend

- **Framework:** React with TypeScript
- **Styling:** Tailwind CSS combined with SCSS for global theming
- **Animations:** Framer Motion, GSAP (for specialized effects), and native CSS transitions
- **Routing:** React Router

### Backend (for Global Charts Data, future integration)

- **Database:** Supabase (Postgres) with a table `flames_matches` to record:
  - `id`, `name1`, `name2`, `result`, `country` (optional), `created_at`
- **APIs:** Use Supabase REST API to fetch aggregated data for charts
- **Security:** Use Row-Level Security (RLS) on Supabase, and rate limiting for public insertions.

### Integration & Sharing

- **Image Export:** Using `html2canvas` for generating downloadable result cards with watermark.
- **Sharing:** Use native share API on mobile; fallback modal on desktop.

### Code Organization

- Modular folder structure:
  - `components/` for UI elements and layout components
  - `features/flamesGame/` for core game logic
  - `hooks/` for global state and preferences
  - `pages/` for major views (HomePage, HowItWorks)
  - `styles/` for global SCSS and theme variables
  - `lib/` for utilities and configuration (e.g., share functions, result visual configs)
  - `types/` for TypeScript interfaces and types

---

## 8. Roadmap & Milestones

### MVP Phase

1. **Core Gameplay:** Auto mode with animated FLAMES results, manual mode basic functionality.
2. **Visual Polish:** Implement and refine glowing effects, confetti, and dynamic result animations.
3. **Sharing Functionality:** Enable URL-based sharing, copy-to-clipboard, and image export.
4. **Global Charts UI:** Build frontend components with dummy data integration.

### Post-MVP Enhancements

1. **Backend Data Aggregation:** Integrate Supabase for real-time global charts.
2. **Advanced Sharing:** Add dynamic Open Graph meta tags and platform-specific sharing options.
3. **User Engagement:** Implement additional micro-interactions, sound effects, and optional features like trending near you.
4. **Future Features:** Consider manual mode expansion, community feedback mechanisms, or an “About” page.

---

## 9. Conclusion

_The Flames_ is designed to be a nostalgic yet modern and engaging experience with a solid, scalable foundation. The PRD outlines the core functionalities, UI/UX enhancements, and technical underpinnings required for a high-quality product launch.  
Focus on delivering a seamless, delightful user experience that entices sharing and virality while ensuring maintainability for future growth.
