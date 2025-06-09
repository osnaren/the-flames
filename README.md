# The Flames

**The Flames** is a playful love compatibility app built by OSLabs. Enter two names and watch dynamic animations reveal the classic FLAMES result — Friendship, Love, Affection, Marriage, Enemy or Siblings. It mixes nostalgia with polished visuals and smooth transitions.

## Tech Stack

- **React 19** with **TypeScript**
- **Vite** build tooling
- **Tailwind CSS** for styling and animations
- **Supabase** for backend and statistics
- **Framer Motion** for animations

## Development

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables** – create a `.env` file and provide:

   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Available scripts**

   | Command           | Description              |
   | ----------------- | ------------------------ |
   | `npm run dev`     | Start dev server         |
   | `npm run build`   | Production build         |
   | `npm run lint`    | Run ESLint               |
   | `npm run format`  | Run Prettier formatting  |
   | `npm run preview` | Preview production build |

4. **Linting & formatting**

   After running `npm install`, `npm run lint` and `npm run format` should work without additional setup.

## Contributing

Pull requests are welcome! Please run `npm run lint` and `npm run format` before submitting.
