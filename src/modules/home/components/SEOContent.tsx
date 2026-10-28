import Link from 'next/link';

// Keep useful content outside the game's client Suspense boundary.
export function SEOContent() {
  const linkClass = 'text-primary underline underline-offset-4';

  return (
    <article className="deferred-content mx-auto max-w-2xl space-y-8 border-t border-pink-200/50 px-4 pt-10 pb-12 text-left dark:border-pink-900/40">
      <section className="space-y-4" aria-labelledby="flames-calculator-guide">
        <h2 id="flames-calculator-guide" className="font-heading text-on-surface text-2xl font-bold">
          What is the FLAMES calculator?
        </h2>
        <p className="text-on-surface-variant text-sm leading-7">
          FLAMES is a paper-and-pencil name game with six possible results: Friends, Love, Affection, Marriage, Enemies,
          or Siblings. This free online calculator brings the notebook game to your browser. Enter two names above and
          watch the matching letters and elimination rounds, or work through the count yourself in{' '}
          <Link href="/manual" className={linkClass}>
            manual FLAMES mode
          </Link>
          .
        </p>
        <p className="text-on-surface-variant text-sm leading-7">
          The result is just for fun. Names and letter counts cannot measure love, predict marriage, or tell you how
          compatible two people are in real life.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="how-to-play-flames">
        <h2 id="how-to-play-flames" className="font-heading text-on-surface text-xl font-semibold">
          How to calculate FLAMES with two names
        </h2>
        <ol className="text-on-surface-variant list-decimal space-y-2 pl-5 text-sm leading-7">
          <li>Enter both names. Capital letters are treated as lowercase; spaces and punctuation do not count.</li>
          <li>Cancel matching letters one pair at a time, removing one occurrence from each name.</li>
          <li>Count all the uncancelled letters left across both names.</li>
          <li>Start at F and count around F-L-A-M-E-S using that number. Remove the letter you land on.</li>
          <li>Resume from the next letter and repeat the same count until one letter remains.</li>
        </ol>
        <p className="text-on-surface-variant text-sm leading-7">
          Repeated letters cancel only while a matching occurrence remains in the other name. If one name has three As
          and the other has one, only one A from each name is removed. Our{' '}
          <Link href="/how-it-works" className={linkClass}>
            interactive FLAMES rules and walkthrough
          </Link>{' '}
          shows the process step by step.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="flames-example">
        <h2 id="flames-example" className="font-heading text-on-surface text-xl font-semibold">
          Worked example: Rahul and Priya
        </h2>
        <p className="text-on-surface-variant text-sm leading-7">
          Write <strong>rahul</strong> and <strong>priya</strong>. Cancel R and A from each name. That leaves{' '}
          <strong>hul</strong> and <strong>piy</strong>: six letters altogether. Counting six each round removes{' '}
          <strong>S, F, A, L, then E</strong>. The remaining letter is <strong>M — Marriage</strong>, a playful label
          rather than a judgment about Rahul and Priya.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="flames-meanings">
        <h2 id="flames-meanings" className="font-heading text-on-surface text-xl font-semibold">
          FLAMES full form and meanings
        </h2>
        <ul className="text-on-surface-variant grid grid-cols-1 gap-2 text-sm leading-7 sm:grid-cols-2">
          <li>
            <strong>F — Friends:</strong> a friendship result.
          </li>
          <li>
            <strong>L — Love:</strong> also called Lovers in some versions.
          </li>
          <li>
            <strong>A — Affection:</strong> fondness and care.
          </li>
          <li>
            <strong>M — Marriage:</strong> the game&apos;s wedding result.
          </li>
          <li>
            <strong>E — Enemies:</strong> a pretend rivalry.
          </li>
          <li>
            <strong>S — Siblings:</strong> a sibling-like bond.
          </li>
        </ul>
      </section>

      <section className="space-y-4" aria-labelledby="flames-questions">
        <h2 id="flames-questions" className="font-heading text-on-surface text-xl font-semibold">
          Common questions about FLAMES
        </h2>
        <div className="text-on-surface-variant space-y-4 text-sm leading-7">
          <div>
            <h3 className="text-on-surface font-semibold">Should I use full names or nicknames?</h3>
            <p>
              Either works. Choose the spelling you want to play with. Adding a surname or using a nickname changes the
              letters and may change the result. The same two spellings give the same result.
            </p>
          </div>
          <div>
            <h3 className="text-on-surface font-semibold">Is FLAMES a love compatibility test?</h3>
            <p>
              It is a name-counting game, not a scientific test. It does not use birthdays, personalities, or anything
              about your relationship. Enjoy the result without using it to make relationship decisions.
            </p>
          </div>
          <div>
            <h3 className="text-on-surface font-semibold">Can I play for free and share the result?</h3>
            <p>
              Yes. No account or payment is required. After playing, use the result controls to share a link or download
              a result card. A shared link contains the names you entered.
            </p>
          </div>
          <div>
            <h3 className="text-on-surface font-semibold">Are my names saved?</h3>
            <p>
              The game keeps recent name pairings in your browser&apos;s local storage. Global charts use anonymous
              result statistics. See our{' '}
              <Link href="/privacy" className={linkClass}>
                privacy policy
              </Link>{' '}
              for details.
            </p>
          </div>
        </div>
      </section>
      <p className="text-on-surface-variant text-sm leading-7">
        FLAMES Game is a project by osLabs. Learn{' '}
        <Link href="/about" className={linkClass}>
          about the project
        </Link>{' '}
        or explore the{' '}
        <Link href="/api-docs" className={linkClass}>
          FLAMES API documentation
        </Link>
        .
      </p>
    </article>
  );
}
