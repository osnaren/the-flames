<div align="center">
  <h1>🔥 The Flames</h1>
  <p><strong>The nostalgic childhood game, reimagined for the modern web</strong></p>
  
  <p>
    <a href="https://theflames.app">Play Now</a> •
    <a href="https://theflames.app/how-it-works">How It Works</a> •
    <a href="https://theflames.app/charts">Global Charts</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwindcss" alt="Tailwind CSS" />
  </p>
</div>

---

## ✨ What is FLAMES?

Remember passing notes in class, crossing out letters, and counting down to find out if your crush liked you back? **FLAMES** is that magical childhood game — **F**riends, **L**ove, **A**ffection, **M**arriage, **E**nemy, or **S**iblings — brought to life with stunning animations and modern web technology.

Enter two names. Watch the magic happen. Discover your destiny. 💕

## 🎮 Features

| Feature | Description |
|---------|-------------|
| 🎰 **Slot Machine Reveal** | Watch FLAMES letters spin and land like a casino jackpot |
| ✨ **Auto Mode** | Beautiful animated experience with confetti, glows, and transitions |
| ✏️ **Manual Mode** | Paper-and-pencil style for the traditional experience |
| 📊 **Global Charts** | See trending names and results from players worldwide |
| 🎨 **Seasonal Themes** | Valentine's, Halloween, Christmas, and more! |
| 🔊 **Sound & Haptics** | Immersive audio feedback and vibrations |
| 🏆 **Achievements** | Unlock badges as you play |
| 📱 **Mobile First** | Perfect on any device |
| 🌙 **Dark Mode** | Easy on the eyes |
| 📤 **Share Results** | Download and share your result cards |

## 🔮 FLAMES Meanings

| Letter | Meaning | Emoji |
|:------:|---------|:-----:|
| **F** | Friendship | 🤝 |
| **L** | Love | ❤️ |
| **A** | Affection | 💕 |
| **M** | Marriage | 💍 |
| **E** | Enemy | ⚔️ |
| **S** | Siblings | 👫 |

## 🚀 Quick Start

Try it now at **[theflames.app](https://theflames.app)** — no signup required!

Or check out:

- 📖 [How It Works](https://theflames.app/how-it-works) — Learn the algorithm step by step
- ✏️ [Manual Mode](https://theflames.app/manual) — Play the old-school way
- 📊 [Global Charts](https://theflames.app/charts) — See trending results
- 📚 [API Docs](https://theflames.app/api-docs) — Build with our API

## 🔥 The Algorithm

The FLAMES calculation is beautifully simple:

1. **Cross out common letters** between both names
2. **Count** the remaining letters
3. **Eliminate** FLAMES letters one by one using the count
4. **The last letter standing** reveals your fate!

<details>
<summary><strong>Example: "ALICE" & "LIAM"</strong></summary>

1. Find common letters: `A`, `L` and `I` appear in both
2. Cross them out: `ALICE` → `CE` | `LIAM` → `M`
3. Count remaining: 2 + 1 = **3**
4. Count through F-L-A-M-E-S, eliminate at 3, repeat...
5. Result: Your **F**LAMES destiny! 🔥

</details>

---

## 💻 For Developers

### Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Database:** [Supabase](https://supabase.com/)
- **State:** [Zustand](https://zustand-demo.pmnd.rs/)

### Local Development

```bash
# Clone the repo
git clone https://github.com/osnaren/the-flames.git
cd the-flames

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your Supabase credentials

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript checks |

### API

The FLAMES API is free to use:

```bash
curl -X POST https://theflames.app/api/flames \
  -H "Content-Type: application/json" \
  -d '{"name1": "Alice", "name2": "Bob"}'
```

See [API Documentation](https://theflames.app/api-docs) for details.

## 📄 License

This project is licensed under the **[CC BY-NC-SA 4.0](LICENSE)** (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International).

- ✅ Share and adapt for non-commercial purposes
- ✅ Give appropriate credit
- ❌ Commercial use without permission
- ❌ Distribution without same license

> **Note:** The FLAMES algorithm itself is common knowledge and is not claimed as proprietary. This license applies to the unique implementation, design, and codebase of this project.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) first.

## 🙏 Acknowledgments

- The countless students who played FLAMES in classrooms around the world
- All contributors and supporters of this project
- [shadcn/ui](https://ui.shadcn.com/) and [Magic UI](https://magicui.design/) for beautiful components

---

<div align="center">
  <p>Made with 🔥 by <a href="https://osnaren.com">OSLabs</a></p>
  <p>
    <a href="https://theflames.app">Play Now</a> •
    <a href="https://github.com/osnaren/the-flames/issues">Report Bug</a> •
    <a href="https://github.com/osnaren/the-flames/discussions">Discussions</a>
  </p>
</div>
