'use client';

import { faqData, generateFAQSchema } from '@/lib/seo';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQItem[];
  title?: string;
  showSchema?: boolean;
  className?: string;
}

/**
 * SEO-friendly FAQ Section Component
 * Renders FAQ content with proper semantic HTML and JSON-LD structured data
 */
export function FAQSection({
  faqs = faqData,
  title = 'Frequently Asked Questions',
  showSchema = true,
  className = '',
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate schema for SEO
  const schema = generateFAQSchema(faqs);

  return (
    <section
      className={`py-12 ${className}`}
      aria-labelledby="faq-heading"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* JSON-LD Structured Data */}
      {showSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      )}

      <div className="mx-auto max-w-3xl px-4">
        <h2 id="faq-heading" className="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="pr-4 text-lg font-medium text-gray-800 dark:text-white" itemProp="name">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-300" itemProp="text">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
