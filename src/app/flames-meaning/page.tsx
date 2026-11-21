import {
  CONTENT_PUBLISHED,
  CONTENT_UPDATED,
  faqPageSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generatePageMetadata,
  pagesSEO,
  siteConfig,
  type FaqEntry,
} from '@/lib/seo';
import { ArrowRight, Flame } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = generatePageMetadata({
  title: pagesSEO.flamesMeaning.title,
  description: pagesSEO.flamesMeaning.description,
  keywords: pagesSEO.flamesMeaning.keywords,
  path: '/flames-meaning',
  ogImage: pagesSEO.flamesMeaning.ogImage,
});

const LETTERS = [
  {
    letter: 'F',
    name: 'Friends',
    color: 'from-blue-500 to-cyan-500',
    also: 'Friendship',
    body: 'F is the friendship result. FLAMES is saying the two of you get along easily: shared jokes, loyalty and zero awkwardness. Plenty of players secretly hope for F when they test a best friend’s name, and plenty of love stories start here too.',
  },
  {
    letter: 'L',
    name: 'Love',
    color: 'from-pink-500 to-rose-500',
    also: 'Lovers',
    body: 'L is the result everyone is hoping for: a romantic match. Older notebooks often write it as Lovers. It is the result most people rush to share.',
  },
  {
    letter: 'A',
    name: 'Affection',
    color: 'from-amber-500 to-orange-500',
    also: 'Adore, Affectionate (and Anger in the Philippines)',
    body: 'A stands for Affection: fondness, care and warmth that is more than friendship but not quite love. Some versions call it Adore or Affectionate. In the Filipino version of FLAMES, A means Anger, which completely changes the mood.',
  },
  {
    letter: 'M',
    name: 'Marriage',
    color: 'from-emerald-500 to-green-500',
    also: 'Married',
    body: 'M is the wedding result, the one that gets the loudest reaction in a classroom. FLAMES has no idea about your future, but it is happy to pick a date for you anyway.',
  },
  {
    letter: 'E',
    name: 'Enemies',
    color: 'from-red-500 to-red-600',
    also: 'Enemy (and Engagement in the Philippines)',
    body: 'E means Enemies, a playful rivalry. Even Romeo and Juliet come out as E. Filipino players often read E as Engagement instead, which turns the result from a feud into a proposal.',
  },
  {
    letter: 'S',
    name: 'Siblings',
    color: 'from-purple-500 to-violet-500',
    also: 'Sister, Sweethearts, Soulmates',
    body: 'S stands for Siblings: a brother-and-sister style bond. Some versions use Sister, and others swap it for something more romantic, like Sweethearts or Soulmates in the Philippines. A few variations drop the S altogether and play FLAME.',
  },
];

const VARIANTS = [
  ['Most common', 'Friends', 'Love', 'Affection', 'Marriage', 'Enemies', 'Siblings'],
  ['Alternate wording', 'Friendship', 'Lovers', 'Affectionate', 'Marriage', 'Enemy', 'Sister'],
  ['Philippines', 'Friends', 'Lovers', 'Anger', 'Marriage', 'Engagement', 'Soulmates'],
];

const FAQ: FaqEntry[] = [
  {
    question: 'What is the full form of FLAMES?',
    answer:
      'The full form of FLAMES is Friends, Love, Affection, Marriage, Enemies and Siblings. Each letter is a possible relationship result in the FLAMES name game.',
  },
  {
    question: 'What does A mean in FLAMES?',
    answer:
      'A means Affection in the standard game: fondness and care. Some versions say Adore or Affectionate, and in the Philippines A stands for Anger.',
  },
  {
    question: 'What does S mean in FLAMES?',
    answer:
      'S usually means Siblings, a brother-and-sister style bond. Other versions use Sister, Sweethearts or Soulmates.',
  },
  {
    question: 'What does FLAMES mean in the Philippines?',
    answer:
      'Many Filipino players read FLAMES as Friends, Lovers, Anger, Marriage, Engagement and Soulmates. The counting rules are the same as everywhere else.',
  },
  {
    question: 'Which FLAMES result is the best?',
    answer:
      'Most people cheer for L (Love) or M (Marriage), but every letter is just for fun. F (Friends) is the safest bet if you are testing a best friend.',
  },
  {
    question: 'Can my FLAMES result change?',
    answer:
      'The same two spellings always give the same result. Using a nickname, a full name or a different spelling changes the letters, so it can change the result.',
  },
];

const pageUrl = `${siteConfig.url}/flames-meaning`;
const schemas = [
  generateArticleSchema({
    title: 'FLAMES meaning and full form: what each letter stands for',
    description: pagesSEO.flamesMeaning.description,
    url: pageUrl,
    datePublished: CONTENT_PUBLISHED,
    dateModified: CONTENT_UPDATED,
  }),
  faqPageSchema(FAQ, pageUrl),
  generateBreadcrumbSchema([
    { name: 'FLAMES Calculator', url: '/' },
    { name: 'FLAMES Meaning', url: '/flames-meaning' },
  ]),
];

export default function FlamesMeaningPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 pt-8 pb-16 md:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <nav aria-label="Breadcrumb" className="text-on-surface-variant mb-6 text-xs">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-primary underline-offset-4 hover:underline">
              FLAMES Calculator
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-on-surface font-medium">
            FLAMES Meaning
          </li>
        </ol>
      </nav>

      <header className="mb-10 space-y-4 text-center">
        <div className="mx-auto flex justify-center gap-1.5" aria-hidden="true">
          {LETTERS.map((item, index) => (
            <span
              key={item.letter}
              className={`motion-letter-pop flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br text-xl font-black text-white shadow-md sm:h-12 sm:w-12 ${item.color}`}
              style={{ ['--letter-delay' as string]: `${index * 0.06}s` }}
            >
              {item.letter}
            </span>
          ))}
        </div>
        <h1 className="font-heading text-on-surface text-3xl font-bold sm:text-4xl">FLAMES meaning and full form</h1>
        <p className="text-on-surface-variant mx-auto max-w-2xl text-base leading-7 sm:text-lg">
          <strong className="text-on-surface">
            FLAMES stands for Friends, Love, Affection, Marriage, Enemies and Siblings.
          </strong>{' '}
          Each letter is a possible result of the FLAMES name game. Here is what every letter means, how the names
          change around the world, and how your letter is picked.
        </p>
        <p className="text-on-surface-variant text-xs">
          Updated <time dateTime={CONTENT_UPDATED}>21 November 2026</time> · FLAMES Game team, osLabs
        </p>
      </header>

      <section aria-labelledby="letters" className="space-y-4">
        <h2 id="letters" className="font-heading text-on-surface text-2xl font-bold">
          What each FLAMES letter means
        </h2>
        {LETTERS.map((item) => (
          <section
            key={item.letter}
            aria-labelledby={`letter-${item.letter}`}
            className="border-outline-variant/40 bg-surface-container-low/80 flex gap-4 rounded-2xl border p-5"
          >
            <span
              aria-hidden="true"
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-2xl font-black text-white ${item.color}`}
            >
              {item.letter}
            </span>
            <div className="space-y-1.5">
              <h3 id={`letter-${item.letter}`} className="text-on-surface text-lg font-semibold">
                {item.letter} stands for {item.name}
              </h3>
              <p className="text-on-surface-variant text-sm leading-7">{item.body}</p>
              <p className="text-on-surface-variant text-xs">
                Also written as: <span className="text-on-surface">{item.also}</span>
              </p>
            </div>
          </section>
        ))}
      </section>

      <section aria-labelledby="variants" className="mt-12 space-y-4">
        <h2 id="variants" className="font-heading text-on-surface text-2xl font-bold">
          FLAMES full form in different versions
        </h2>
        <p className="text-on-surface-variant text-sm leading-7">
          The counting is the same everywhere, but the words behind the letters vary from school to school and country
          to country.
        </p>
        <div className="border-outline-variant/40 overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">FLAMES letter meanings by version</caption>
            <thead className="bg-surface-container-high/70 text-on-surface">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-semibold">
                  Version
                </th>
                {['F', 'L', 'A', 'M', 'E', 'S'].map((letter) => (
                  <th key={letter} scope="col" className="px-3 py-2.5 font-semibold">
                    {letter}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              {VARIANTS.map(([version, ...words]) => (
                <tr key={version} className="border-outline-variant/30 border-t">
                  <th scope="row" className="text-on-surface px-3 py-2.5 font-medium">
                    {version}
                  </th>
                  {words.map((word, index) => (
                    <td key={index} className="px-3 py-2.5">
                      {word}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="how-picked" className="mt-12 space-y-3">
        <h2 id="how-picked" className="font-heading text-on-surface text-2xl font-bold">
          How your FLAMES letter is chosen
        </h2>
        <p className="text-on-surface-variant text-sm leading-7">
          Write both names, cross out the letters they share, and count the letters that are left. Count that many steps
          around F-L-A-M-E-S, strike out the letter you land on, and keep going from the next letter until only one is
          left. For example, <strong>Rahul and Priya</strong> leave 6 letters, which strikes out S, F, A, L and E and
          leaves <strong>M for Marriage</strong>.
        </p>
        <p className="text-on-surface-variant text-sm leading-7">
          Follow every step with animations in{' '}
          <Link href="/how-it-works" className="text-primary font-medium underline underline-offset-4">
            how to play FLAMES
          </Link>
          , or let the calculator do the counting.
        </p>
      </section>

      <section aria-labelledby="meaning-faq" className="mt-12 space-y-3">
        <h2 id="meaning-faq" className="font-heading text-on-surface text-2xl font-bold">
          FLAMES meaning FAQ
        </h2>
        {FAQ.map((entry) => (
          <details key={entry.question} className="bg-surface-container-low/80 group rounded-xl px-4 py-3">
            <summary className="text-on-surface flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
              <h3>{entry.question}</h3>
              <span aria-hidden="true" className="text-on-surface-variant transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="text-on-surface-variant mt-2 text-sm leading-7">{entry.answer}</p>
          </details>
        ))}
      </section>

      <aside className="mt-12 flex flex-col items-center gap-3 rounded-3xl bg-linear-to-br from-orange-500 via-rose-500 to-pink-500 px-6 py-8 text-center text-white shadow-lg shadow-rose-500/20">
        <p className="font-heading text-2xl font-bold">Find your FLAMES letter</p>
        <p className="max-w-md text-sm text-white/90">
          Enter two names and watch the letters cancel out, step by step.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 shadow-md transition-transform hover:-translate-y-0.5"
        >
          <Flame className="h-4 w-4" aria-hidden="true" />
          Open the FLAMES calculator
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </aside>
    </article>
  );
}
