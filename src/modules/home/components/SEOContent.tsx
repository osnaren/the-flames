import { CONTENT_UPDATED, HOME_FAQ, HOW_TO_STEPS, RESULT_MEANINGS, WORKED_EXAMPLES } from '@/lib/seo/content';
import Link from 'next/link';

const linkClass = 'text-primary font-medium underline underline-offset-4';
const updatedLabel = new Date(`${CONTENT_UPDATED}T00:00:00Z`).toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * The FLAMES guide under the calculator. Server-rendered, outside the game's
 * client boundary, so search engines and AI answer engines read it in the
 * first HTML response. FAQ text is shared with the FAQPage JSON-LD.
 */
export function SEOContent() {
  return (
    <article
      className="deferred-content mx-auto max-w-2xl space-y-10 border-t border-pink-200/50 px-4 pt-10 pb-14 text-left dark:border-pink-900/40"
      aria-labelledby="flames-calculator-guide"
    >
      <header className="space-y-3">
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">The complete FLAMES guide</p>
        <h2 id="flames-calculator-guide" className="font-heading text-on-surface text-2xl font-bold sm:text-3xl">
          FLAMES calculator: play the FLAMES game online
        </h2>
        <p className="text-on-surface-variant text-sm leading-7">
          FLAMES is the classic notebook name game. Write two names, cancel the letters they share, and count what is
          left around the word <strong>F-L-A-M-E-S</strong> to find out if you are{' '}
          <strong>Friends, Love, Affection, Marriage, Enemies or Siblings</strong>. This free FLAMES love calculator
          does the counting for you and shows every crossed-out letter, so you can check the result just like on paper.
          Prefer to do it by hand? Try{' '}
          <Link href="/manual" className={linkClass}>
            manual FLAMES mode
          </Link>
          .
        </p>
        <p className="text-on-surface-variant text-xs">
          Updated <time dateTime={CONTENT_UPDATED}>{updatedLabel}</time> · Written by the FLAMES Game team at osLabs
        </p>
      </header>

      <section className="space-y-3" aria-labelledby="flames-meaning">
        <h2 id="flames-meaning" className="font-heading text-on-surface text-xl font-semibold">
          FLAMES meaning: what each letter stands for
        </h2>
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {RESULT_MEANINGS.map((item) => (
            <div key={item.letter} className="bg-surface-container-low/70 rounded-xl px-4 py-3">
              <dt className="text-on-surface font-semibold">
                {item.letter} — {item.name}
              </dt>
              <dd className="text-on-surface-variant text-sm leading-6">{item.text}</dd>
            </div>
          ))}
        </dl>
        <p className="text-on-surface-variant text-sm leading-7">
          Want the full story of every letter and its regional versions? Read{' '}
          <Link href="/flames-meaning" className={linkClass}>
            FLAMES meaning and full form
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="how-to-play-flames">
        <h2 id="how-to-play-flames" className="font-heading text-on-surface text-xl font-semibold">
          How to play FLAMES with two names
        </h2>
        <ol className="text-on-surface-variant list-decimal space-y-2 pl-5 text-sm leading-7">
          {HOW_TO_STEPS.map((step, index) => (
            <li key={step.name} id={`step-${index + 1}`}>
              <strong className="text-on-surface">{step.name}.</strong> {step.text}
            </li>
          ))}
        </ol>
        <p className="text-on-surface-variant text-sm leading-7">
          See each step animated in our{' '}
          <Link href="/how-it-works" className={linkClass}>
            interactive guide to how FLAMES works
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4" aria-labelledby="flames-examples">
        <h2 id="flames-examples" className="font-heading text-on-surface text-xl font-semibold">
          FLAMES examples, worked out step by step
        </h2>
        <div className="space-y-3">
          {WORKED_EXAMPLES.map((example) => (
            <div
              key={example.names.join('-')}
              className="bg-surface-container-low/70 rounded-xl px-4 py-3 text-sm leading-7"
            >
              <h3 className="text-on-surface font-semibold">
                {example.names[0]} and {example.names[1]} → {example.result}
              </h3>
              <p className="text-on-surface-variant">
                Common letters: {example.common}. Letters left: <strong>{example.left}</strong> = {example.count}.
                Counting {example.count} each round strikes out {example.struck}, leaving{' '}
                <strong>{example.result}</strong>.
              </p>
            </div>
          ))}
        </div>
        <p className="text-on-surface-variant text-sm leading-7">
          Yes, Romeo and Juliet come out as Enemies. Considering how their story went, FLAMES might be onto something.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="flames-variants">
        <h2 id="flames-variants" className="font-heading text-on-surface text-xl font-semibold">
          FLAMES rules and regional variations
        </h2>
        <ul className="text-on-surface-variant list-disc space-y-2 pl-5 text-sm leading-7">
          <li>
            <strong>Cancelling repeated letters.</strong> This calculator cancels one pair at a time: if one name has
            three As and the other has one, only one A from each name is crossed out. Some schoolyards cross out every
            copy of a shared letter instead, which can change the result.
          </li>
          <li>
            <strong>Counting.</strong> Most players strike the letter they land on and keep counting from the next one
            until one letter is left. A quicker version counts around FLAMES just once and takes the letter it lands on.
          </li>
          <li>
            <strong>Philippines.</strong> Many Filipino players read FLAMES as Friends, Lovers, Anger, Marriage,
            Engagement and Soulmates.
          </li>
          <li>
            <strong>Around the world.</strong> Most FLAMES players on this site are in India, the Philippines, the
            United States, Malaysia, the UAE and Sri Lanka. First names are traditional; full names make a fun second
            round.
          </li>
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="flames-accuracy">
        <h2 id="flames-accuracy" className="font-heading text-on-surface text-xl font-semibold">
          Is the FLAMES game accurate?
        </h2>
        <p className="text-on-surface-variant text-sm leading-7">
          The calculator is exact: the same two spellings always produce the same letters, count and result, and you can
          verify every step. What FLAMES cannot do is measure love. It uses nothing but letters, not birthdays,
          personalities or anything about your relationship, so treat it as the fun schoolyard ritual it has always
          been. Curious what other players are getting? Explore the{' '}
          <Link href="/charts" className={linkClass}>
            live FLAMES charts
          </Link>
          .
        </p>
      </section>

      <section className="space-y-4" aria-labelledby="flames-questions">
        <h2 id="flames-questions" className="font-heading text-on-surface text-xl font-semibold">
          FLAMES game FAQ
        </h2>
        <div className="space-y-2">
          {HOME_FAQ.map((entry) => (
            <details
              key={entry.question}
              className="bg-surface-container-low/70 group rounded-xl px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="text-on-surface flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
                <h3>{entry.question}</h3>
                <span aria-hidden="true" className="text-on-surface-variant transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="text-on-surface-variant mt-2 text-sm leading-7">{entry.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="text-on-surface-variant text-sm leading-7">
        FLAMES Game is a free project by osLabs. Read{' '}
        <Link href="/about" className={linkClass}>
          the story behind FLAMES
        </Link>
        , our{' '}
        <Link href="/privacy" className={linkClass}>
          privacy policy
        </Link>
        , or build with the{' '}
        <Link href="/api-docs" className={linkClass}>
          FLAMES API
        </Link>
        .
      </p>
    </article>
  );
}
