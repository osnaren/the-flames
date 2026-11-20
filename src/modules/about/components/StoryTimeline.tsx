'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface StoryItem {
  title: string;
  img: string;
  content: React.ReactNode;
}

interface StoryTimelineProps {
  items: StoryItem[];
}

const reveal = {
  hidden: { opacity: 0, y: 40 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

/**
 * Story chapters joined by a timeline. Each chapter reveals once as it scrolls
 * into view and then stays put, so readers never scroll through empty space.
 */
export function StoryTimeline({ items }: StoryTimelineProps) {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 py-12 md:py-20" aria-label="The FLAMES story">
      {/* Timeline spine */}
      <div
        aria-hidden="true"
        className="from-primary/0 via-primary/40 to-primary/0 absolute top-0 bottom-0 left-8 w-px bg-linear-to-b md:left-1/2"
      />

      <ol className="space-y-14 md:space-y-24">
        {items.map((item, index) => {
          const flip = index % 2 === 1;
          return (
            <li key={item.title} className="relative pl-12 md:pl-0">
              {/* Chapter marker */}
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="bg-surface ring-primary/30 text-primary absolute top-2 left-8 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full text-sm font-bold shadow-md ring-2 md:left-1/2"
                aria-hidden="true"
              >
                {index + 1}
              </motion.span>

              <motion.article
                variants={reveal}
                initial="hidden"
                whileInView="shown"
                viewport={{ once: true, amount: 0.2 }}
                className={`grid items-center gap-6 md:grid-cols-2 md:gap-16 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}
              >
                <div className={`space-y-4 ${flip ? 'md:pl-10' : 'md:pr-10'}`}>
                  <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">Chapter {index + 1}</p>
                  <h3 className="from-primary to-tertiary bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
                    {item.title}
                  </h3>
                  <div className="text-on-surface-variant text-base md:text-lg">{item.content}</div>
                </div>
                <div
                  className={`border-outline-variant/30 bg-surface-container-high/50 group relative aspect-video overflow-hidden rounded-2xl border shadow-xl md:aspect-4/3 ${flip ? 'md:mr-10' : 'md:ml-10'}`}
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index === 0}
                  />
                </div>
              </motion.article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
