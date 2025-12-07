import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = generatePageMetadata({
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found. Return to FLAMES Game to play!',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex gap-2">
        {['F', 'L', 'A', 'M', 'E', 'S'].map((letter, i) => (
          <div
            key={letter}
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-pink-500/20 to-purple-500/20 text-2xl font-bold text-gray-400 dark:from-pink-500/10 dark:to-purple-500/10"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {letter}
          </div>
        ))}
      </div>

      <h1 className="mb-4 text-6xl font-bold text-gray-800 dark:text-white">404</h1>

      <h2 className="mb-4 text-2xl font-semibold text-gray-600 dark:text-gray-300">
        Oops! This page got lost in the flames
      </h2>

      <p className="text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Don&apos;t worry, you can still discover
        your relationship compatibility!
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-pink-500 to-purple-600 px-6 py-3 font-medium text-white transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-lg"
        >
          Play FLAMES Game
        </Link>
        <Link
          href="/how-it-works"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Learn How It Works
        </Link>
      </div>

      {/* SEO-friendly links for crawlers */}
      <nav className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700" aria-label="Helpful links">
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Popular pages:</p>
        <ul className="flex flex-wrap justify-center gap-4 text-sm">
          <li>
            <Link href="/" className="text-pink-600 hover:underline dark:text-pink-400">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-pink-600 hover:underline dark:text-pink-400">
              About
            </Link>
          </li>
          <li>
            <Link href="/how-it-works" className="text-pink-600 hover:underline dark:text-pink-400">
              How It Works
            </Link>
          </li>
          <li>
            <Link href="/charts" className="text-pink-600 hover:underline dark:text-pink-400">
              Charts
            </Link>
          </li>
          <li>
            <Link href="/manual" className="text-pink-600 hover:underline dark:text-pink-400">
              Manual Mode
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
