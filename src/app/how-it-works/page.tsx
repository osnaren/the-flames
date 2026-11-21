import {
  CONTENT_UPDATED,
  generateBreadcrumbSchema,
  generatePageMetadata,
  HOW_TO_STEPS,
  howToSchema,
  pagesSEO,
  siteConfig,
  WORKED_EXAMPLES,
} from '@/lib/seo';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import for client component
const HowItWorksPage = dynamic(() => import('@modules/how-it-works/HowItWorksPage'), {
  ssr: true,
});

// Page-specific SEO metadata
export const metadata: Metadata = generatePageMetadata({
  title: pagesSEO.howItWorks.title,
  description: pagesSEO.howItWorks.description,
  keywords: pagesSEO.howItWorks.keywords,
  path: '/how-it-works',
  ogImage: pagesSEO.howItWorks.ogImage,
});

const pageUrl = `${siteConfig.url}/how-it-works`;
const schemas = [
  generateBreadcrumbSchema([
    { name: 'FLAMES Calculator', url: '/' },
    { name: 'How to Play FLAMES', url: '/how-it-works' },
  ]),
  howToSchema(pageUrl),
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />
      <HowItWorksPage />

      {/* Plain-text rules (server-rendered) so readers and search engines get the whole method at a glance. */}
      <section aria-labelledby="flames-rules" className="deferred-content mx-auto w-full max-w-3xl px-4 pt-4 pb-16">
        <div className="border-outline-variant/40 bg-surface-container-low/80 space-y-5 rounded-3xl border p-6 sm:p-8">
          <h2 id="flames-rules" className="font-heading text-on-surface text-2xl font-bold">
            FLAMES rules: how to play FLAMES with names
          </h2>
          <ol className="text-on-surface-variant list-decimal space-y-2 pl-5 text-sm leading-7">
            {HOW_TO_STEPS.map((step, index) => (
              <li key={step.name} id={`step-${index + 1}`}>
                <strong className="text-on-surface">{step.name}.</strong> {step.text}
              </li>
            ))}
          </ol>
          <div className="space-y-2">
            <h3 className="text-on-surface font-semibold">Examples</h3>
            <ul className="text-on-surface-variant list-disc space-y-1 pl-5 text-sm leading-7">
              {WORKED_EXAMPLES.map((example) => (
                <li key={example.names.join('-')}>
                  <strong className="text-on-surface">
                    {example.names[0]} + {example.names[1]}
                  </strong>
                  : {example.count} letters left, strikes {example.struck} → {example.result}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-on-surface font-semibold">Rules that vary between players</h3>
            <ul className="text-on-surface-variant list-disc space-y-1 pl-5 text-sm leading-7">
              <li>
                <strong className="text-on-surface">Does the order of the names matter?</strong> No. Swapping the two
                names leaves the same letters, so the count and the result stay the same.
              </li>
              <li>
                <strong className="text-on-surface">Repeated letters.</strong> This calculator cancels shared letters
                one pair at a time, the most common rule. Some players cross out every copy of a shared letter instead,
                which can change the result: Sarah + Max is 6 letters and Marriage with pairs, but 5 letters and Friends
                when every A is crossed out.
              </li>
              <li>
                <strong className="text-on-surface">No letters left.</strong> If every letter cancels (Mary + Army), the
                count is zero. This calculator still finishes the count and lands on Affection.
              </li>
            </ul>
          </div>
          <p className="text-on-surface-variant text-sm leading-7">
            Ready? Try it with any two names in the{' '}
            <Link href="/" className="text-primary font-medium underline underline-offset-4">
              free FLAMES calculator
            </Link>
            , or see{' '}
            <Link href="/flames-meaning" className="text-primary font-medium underline underline-offset-4">
              what each FLAMES letter means
            </Link>
            .
          </p>
          <p className="text-on-surface-variant text-xs">
            Updated <time dateTime={CONTENT_UPDATED}>21 November 2026</time> · FLAMES Game team, osLabs
          </p>
        </div>
      </section>
    </>
  );
}
