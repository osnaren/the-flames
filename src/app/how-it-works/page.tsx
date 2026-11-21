import {
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
        </div>
      </section>
    </>
  );
}
