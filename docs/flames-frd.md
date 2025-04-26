# 🔥 The Flames App – Feature Requirements Document (FRD)

---

## 🧠 1. Philosophy and Vision

**The Flames App** isn't just another game recreation.  
It’s a **revival of a memory** — **re-imagined** with **modern web craftsmanship**.

| Our Values                           | How it reflects                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| 🎨 **Playful Craftsmanship**         | Every click, animation, and glow feels intentionally crafted                               |
| ❤️ **Emotional Nostalgia**           | Bringing back the childhood excitement of FLAMES in a mature, elegant, and magical wrapper |
| 🔥 **High Standards, Low Rush**      | Every element is polished to feel like art, not rushed code                                |
| 🚀 **Launch Ready, Lifetime Worthy** | Built to endure — designed for emotional stickiness, not fleeting attention                |

---

## 🎮 2. Core Gameplay Flow (Auto Mode)

| Step                         | Detail                                                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 📝 Name Input                | Two input fields for names (Name 1 and Name 2)                                                                       |
| ✂️ Strike Out Common Letters | Visually show strikeouts of matched letters (one letter cancels one letter, even if repeated)                        |
| 🔢 Count Remaining Letters   | After strikeout, calculate the total number of unmatched letters                                                     |
| 🎰 FLAMES Letter Slot Reveal | Animate FLAMES letters cycling like a slot machine, eliminate one at a time based on count                           |
| 🔥 Result Card               | Display the final relationship result (Friendship, Love, Affection, Marriage, Enemy, Siblings) with a magical reveal |
| 🎉 Confetti & Glow           | Trigger custom confetti + radial glow based on the result type                                                       |

---

## ✏️ 3. Manual Mode (Paper & Pencil Simulation)

| Feature                 | Detail                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------- |
| ✏️ Editable Names       | Handwriting-style editable fields; users type names manually                           |
| ✍️ Confirm Names        | After typing, confirm each name with a ✔️ checkmark; locks it as read-only             |
| ✏️ Pencil Cursor        | Cursor changes to pencil when interacting                                              |
| ✂️ Strike Letters       | Users manually strike letters by clicking/dragging across                              |
| 🔠 FLAMES Word Static   | Below names, static "FLAMES" word; users manually strike out letters based on counting |
| 🧹 Eraser & Reset Tools | Eraser tool to undo strikes; full reset option to clear and restart                    |
| 📤 Share Option         | Once result is manually determined, offer same sharing flow as Auto Mode               |

---

## 📊 4. Global Charts

| Feature               | Detail                                                              |
| --------------------- | ------------------------------------------------------------------- |
| 📈 Total Matches      | Display the count of all matches played                             |
| 🔥 Today’s Matches    | Display matches played today with trending indicator                |
| 🏆 Top Names          | Leaderboard of the most popular names                               |
| ❤️ Top Results        | Breakdown by FLAMES outcomes (e.g., Love 34%, Friendship 22%, etc.) |
| 👫 Popular Pairs      | Top pairings submitted globally                                     |
| 📅 Time Filters       | Switch view between Today / This Week / All Time                    |
| 🔄 Live Update Button | Option to refresh the data without page reload                      |
| 🎉 Visual Flair       | Animations when switching filters or refreshing stats               |

---

## 📤 5. Sharing Experience

| Feature                  | Detail                                                                |
| ------------------------ | --------------------------------------------------------------------- |
| 📎 Copy Link             | Copy a personalized deep link (with ?name1&name2)                     |
| 📸 Download Result Image | Export the result card with a tasteful watermark (`🔥 TheFlames.app`) |
| 📲 Native Share          | On mobile, use `navigator.share()` API for direct sharing             |
| 🖥️ Desktop Popover       | On desktop, open a styled modal with sharing options                  |
| 🎯 Deep Link Behavior    | Shared links preload names and directly show results on arrival       |

---

## 🛠️ 6. Settings & Controls

| Feature                   | Detail                                                                         |
| ------------------------- | ------------------------------------------------------------------------------ |
| 🎛️ Floating Control Panel | Sticky floating settings button                                                |
| 🌞 Theme Toggle           | Light/Dark mode switching, persistent with localStorage                        |
| ✨ Animation Toggle       | Enable/disable all motion/animation effects (respects reduced motion settings) |
| 🔈 Sound Toggle           | Future-proof: Option to toggle sound effects on/off                            |
| 📤 Quick Jump             | "Back to Input" button for ease of navigation                                  |

---

## 🎨 7. Look and Feel

| Attribute         | Execution                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------- |
| 🌈 Brand Colors   | Primary: #f97316 (Flame Orange), Secondary: #fbbf24 (Gold), Tertiary: #c084fc (Magic Purple) |
| 🔤 Fonts          | Body: Noto Sans, Headings: DM Serif Display, Special letters (FLAMES): Rubik Mono One        |
| ✨ Visual Tone    | Magical, nostalgic, fun but elegant                                                          |
| 🎨 Theme System   | Full light/dark theme, color tokens based on Material Theme Builder setup                    |
| 🌊 Transitions    | Smooth, liquid-like motion between states; subtle parallax and easing                        |
| 🎊 Confetti       | Side cannons with custom emojis depending on result type                                     |
| 📱 Responsiveness | Mobile-first design; tablet and desktop adaptivity; touch-friendly tap zones                 |

---

## ♿ 8. Accessibility Commitments

| Area                | Detail                                                       |
| ------------------- | ------------------------------------------------------------ |
| 🦮 ARIA Labels      | For all interactive elements                                 |
| 🧠 Focus Management | Tab flows for input fields, buttons, and modal close         |
| 🧑‍🦯 Reduced Motion   | Respect `prefers-reduced-motion` CSS media query             |
| 🎨 Contrast         | All text and UI elements pass WCAG 2.1 AA contrast standards |

---

## 🚀 9. Technical Excellence

| Area                       | Detail                                                     |
| -------------------------- | ---------------------------------------------------------- |
| 🧱 Code Modularity         | Feature folders, clean separation of concerns              |
| 🧹 Performance             | Memoization of components, efficient animation management  |
| ⚡ Lightweight             | Optimized confetti density, progressive enhancements       |
| 🔒 Security                | Minimal user data exposure; Supabase RLS rules enforced    |
| 🛡️ Graceful Error Handling | Fallbacks if share fails, route guards for invalid queries |

---

## 📈 10. Future Enhancements (Post-Launch Ideas)

| Feature              | Detail                                                   |
| -------------------- | -------------------------------------------------------- |
| 🌎 Trending Near You | Geo-IP based charts                                      |
| 🔈 Sound Effects     | Fun sounds for strikes, slot stops, confetti             |
| ✨ Easter Eggs       | Special results for iconic names                         |
| 🧩 Seasonal Themes   | Custom backgrounds for Valentine’s, Friendship Day, etc. |
| 💬 Reactions         | Users can react with emojis to their results             |

---

## 👥 11. Target Users

- Millennials and Gen Z users
- Social media sharers, couples, students
- Anyone with nostalgia for classroom games and playful quizzes

---

## 🌐 12. Pages & Routes

### 1. `/` — **Home Page (Auto Mode)**

- Name input with validation
- Common letter strike animation
- FLAMES counting via slot animation
- Result card with emotional result
- Sharing options (native + desktop)
- Floating Control Panel

### 2. `/manual` — **Manual Mode**

- Editable name fields with pencil-style font
- Pencil-cursor for striking common letters
- Static FLAMES bar to strike manually
- Tools: Reset, Eraser, Share
- Optional paper/chalkboard texture background

### 3. `/how-it-works` — **Visual Tutorial**

- Explains letter elimination with step-by-step animations
- Animated FLAMES counter visual (e.g., count 8 lands on A)
- Final result reveal
- Letter meanings with emoji grid
- CTA to “Try Now”

### 4. `/charts` — **Global Charts Page**

- Stats cards (total matches, today’s count, trending result)
- Name leaderboard with rank indicators
- Result distribution bar chart
- Popular pairings
- Time filters (Today / Week / All Time)
- Connected to real DB (or fallback dummy data)

### 5. `/*` — **404 Not Found Page**

- Styled fallback with CTA to go back home

---

## 🔢 13. FLAMES Logic (Game Mechanics)

### Step 1: Name Input

User enters two names (e.g., Naren, Priya)

### Step 2: Remove Common Letters

- Count letters in both names
- Remove common characters (one match = one elimination)
- Total remaining letters = `X`

### Step 3: FLAMES Count

- FLAMES = [F, L, A, M, E, S]
- Start from first letter, count through the array **circularly** up to `X`
- Remove the letter where you land
- Repeat process with the new reduced FLAMES array and same count `X`
- Final letter remaining = Relationship result

### Final Mapping

| Letter | Meaning    | Emoji |
| ------ | ---------- | ----- |
| F      | Friendship | 🤝    |
| L      | Love       | ❤️    |
| A      | Affection  | 💕    |
| M      | Marriage   | 💍    |
| E      | Enemy      | 💣    |
| S      | Siblings   | 🧸    |

---

## 💎 14. Features

### 🔥 Core Game Flow

- Name validation with Zod
- Visual strikeout of common letters
- Slot machine reveal of FLAMES letters
- Animated glowing result card
- Accessibility: keyboard, aria labels, reduced motion

### 📝 Manual Mode

- Pencil-style editable names
- Manual strikeout via cursor
- Static FLAMES bar for elimination
- Result shown only after user completes steps
- Optional texture background, sound FX

### 📤 Share Functionality

- URL parameter support (`?name1=X&name2=Y`)
- Mobile: `navigator.share()` → native share sheet
- Desktop: modal dropdown with:
  - Copy link
  - Download result card (html2canvas + watermark)
  - Social sharing options (optional)

### 🎛️ Floating Control Panel

- Theme toggle (dark/light)
- Animation toggle (enable/disable effects)
- Sound toggle (for future SFX)
- Responsive & styled with icons

### 📊 Global Charts

- Real-time or mock display
- Filters: Today / Week / All Time
- Stats: Match count, name popularity, result distribution
- Confetti or animation bursts on refresh
- Optional sharing of top results

### 📚 How It Works Page

- Step-by-step tutorial
- FLAMES counter animation
- Letter strikeout visualization
- Grid of letter meanings
- CTA to play

---

## 🎯 Final Note

The Flames app **isn't about rushing features.**  
It’s about **recreating magic**, pixel by pixel, line by line.

Our motto:

> “If it doesn’t feel magical to you, it’s not ready for the world.”

Every animation, every glow, every word matters — because this is **OSLabs** — and **our creations set the standard.**
