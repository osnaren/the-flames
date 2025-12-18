import { memo } from 'react';

function SEOContentComponent() {
  return (
    <article className="prose prose-pink dark:prose-invert sr-only mx-auto mt-16 max-w-2xl px-4 pb-12 text-center md:text-left">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">What is the FLAMES Game?</h2>
      <p className="text-gray-600 dark:text-gray-300">
        The FLAMES game is a classic childhood relationship calculator that predicts the compatibility between two
        people. Often searched as "flames games" or "love calculator", the acronym FLAMES stands for Friends, Lovers,
        Affection, Marriage, Enemies, and Siblings. It's a fun, nostalgic way to see what the future might hold for you
        and your crush!
      </p>

      <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-gray-100">How to Play FLAMES Online</h3>
      <p className="text-gray-600 dark:text-gray-300">Playing our online FLAMES calculator is simple:</p>
      <ol className="list-decimal pl-5 text-left text-gray-600 dark:text-gray-300">
        <li>Enter your name in the first box.</li>
        <li>Enter your partner's or crush's name in the second box.</li>
        <li>Click the "Calculate" button to see the magic happen!</li>
      </ol>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Our algorithm will cross out the common letters in both names and count the remaining characters to determine
        your relationship status. Will it be love, friendship, or something else? Try it now to find out!
      </p>

      <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-gray-100">FLAMES Meanings</h3>
      <ul className="grid grid-cols-2 gap-2 text-left text-gray-600 sm:grid-cols-3 dark:text-gray-300">
        <li>
          <strong>F</strong> - Friends 🤝
        </li>
        <li>
          <strong>L</strong> - Love ❤️
        </li>
        <li>
          <strong>A</strong> - Affection 🥰
        </li>
        <li>
          <strong>M</strong> - Marriage 💍
        </li>
        <li>
          <strong>E</strong> - Enemies ⚔️
        </li>
        <li>
          <strong>S</strong> - Siblings 👫
        </li>
      </ul>
    </article>
  );
}

export const SEOContent = memo(SEOContentComponent);
