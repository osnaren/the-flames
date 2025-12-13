# Contributing to The Flames

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to The Flames. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/your-username/the-flames.git
   cd the-flames
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and fill in the required values.

   ```bash
   cp .env.example .env.local
   ```

5. **Start the development server**:

   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your feature or fix:

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. Make your changes.
3. Run linting and formatting checks:

   ```bash
   npm run lint
   npm run format
   ```

4. Run tests to ensure no regressions:

   ```bash
   npm test
   ```

## Pull Request Process

1. Ensure your code adheres to the project's coding standards.
2. Update the documentation if you've changed APIs or features.
3. Submit a Pull Request (PR) to the `main` branch.
4. Provide a clear description of the changes and link to any relevant issues.

## Coding Standards

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Formatting**: Prettier (run `npm run format`)
- **Linting**: ESLint (run `npm run lint`)

### Component Structure

We follow a Feature-based architecture:

- `src/modules/` contains self-contained features.
- `src/components/ui/` contains shared atomic components.

Please refer to `docs/TECHNICAL_DOCUMENTATION.md` for more details on the architecture.

## Reporting Bugs

This section guides you through submitting a bug report.

- Use a clear and descriptive title.
- Describe the exact steps to reproduce the problem.
- Describe the behavior you observed after following the steps.
- Explain which behavior you expected to see instead and why.
- Include screenshots if possible.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
