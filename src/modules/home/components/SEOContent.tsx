import { memo } from 'react';

function SEOContentComponent() {
  return (
    <article className="mx-auto mt-16 max-w-2xl border-t border-pink-200/50 px-1 pt-10 pb-12 text-left dark:border-pink-900/40">
      <div className="space-y-4">
        <h2 className="font-heading text-on-surface text-2xl font-bold">What is the FLAMES Game?</h2>
        <p className="text-on-surface-variant text-sm leading-7">
          FLAMES is a classic relationship game where two names are compared to reveal one of six playful outcomes:
          Friends, Love, Affection, Marriage, Enemies, or Siblings. This online FLAMES calculator keeps the nostalgic
          notebook game simple: enter two names, run the count, and get an instant result you can share.
        </p>
        <p className="text-on-surface-variant text-sm leading-7">
          People search for it as "flames game", "flame game", "flames online", and "flames game online". The result is
          for entertainment only, but the calculation follows the traditional paper-and-pencil method many players used
          at school.
        </p>
      </div>

      <section className="mt-8 space-y-3" aria-labelledby="how-to-play-flames">
        <h3 id="how-to-play-flames" className="font-heading text-on-surface text-xl font-semibold">
          How to Play FLAMES Online
        </h3>
        <ol className="text-on-surface-variant list-decimal space-y-2 pl-5 text-sm leading-7">
          <li>Enter your name in the first box.</li>
          <li>Enter the other person's name in the second box.</li>
          <li>Remove letters that both names share.</li>
          <li>Count the letters that remain.</li>
          <li>Use that count to cycle through F-L-A-M-E-S until one result is left.</li>
        </ol>
        <p className="text-on-surface-variant text-sm leading-7">
          The automatic mode does the work for you. If you want the traditional experience, Manual Mode lets you cross
          out letters yourself and follow the FLAMES count step by step.
        </p>
      </section>

      <section className="mt-8 space-y-3" aria-labelledby="flames-meanings">
        <h3 id="flames-meanings" className="font-heading text-on-surface text-xl font-semibold">
          FLAMES Meanings
        </h3>
        <ul className="text-on-surface-variant grid grid-cols-1 gap-2 text-sm leading-7 sm:grid-cols-2">
          <li>
            <strong>F</strong> - Friends, a strong friendly bond.
          </li>
          <li>
            <strong>L</strong> - Love, a romantic match.
          </li>
          <li>
            <strong>A</strong> - Affection, warmth and care.
          </li>
          <li>
            <strong>M</strong> - Marriage, long-term compatibility.
          </li>
          <li>
            <strong>E</strong> - Enemies, clashing personalities.
          </li>
          <li>
            <strong>S</strong> - Siblings, a family-like connection.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-3" aria-labelledby="flames-privacy">
        <h3 id="flames-privacy" className="font-heading text-on-surface text-xl font-semibold">
          Private, Free, and Quick
        </h3>
        <p className="text-on-surface-variant text-sm leading-7">
          FLAMES Game is free to use and does not require an account. Names are used to calculate the result in the
          moment; the site only uses anonymous statistics for charts and trends.
        </p>
      </section>
    </article>
  );
}

export const SEOContent = memo(SEOContentComponent);
