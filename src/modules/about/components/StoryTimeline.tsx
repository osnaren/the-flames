'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

interface StoryItem {
  title: string;
  img: string;
  content: React.ReactNode;
}

interface StoryTimelineProps {
  items: StoryItem[];
}

const StoryCard = ({ item, index }: { item: StoryItem; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, {
    margin: '-25% 0px -25% 0px',
    once: false,
  });

  return (
    <div
      ref={cardRef}
      className="flex min-h-[70vh] w-full shrink-0 snap-center items-center justify-center px-4 py-8 md:min-h-[75vh] md:py-12"
    >
      <motion.div
        initial={false}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.96 }}
        transition={{
          duration: 0.35,
          ease: [0.32, 0.72, 0, 1], // Snappy ease-out
        }}
        className="bg-surface-container/95 dark:bg-surface-container/90 border-outline-variant/30 grid w-full max-w-5xl items-center gap-6 rounded-2xl border p-6 shadow-2xl backdrop-blur-xl md:grid-cols-2 md:gap-12 md:rounded-3xl md:p-8"
      >
        <div className="order-2 space-y-4 md:order-1 md:space-y-6">
          <motion.h3
            initial={false}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3, delay: isInView ? 0.1 : 0, ease: [0.32, 0.72, 0, 1] }}
            className="from-primary to-tertiary bg-linear-to-r bg-clip-text text-3xl font-bold text-transparent md:text-5xl lg:text-6xl"
          >
            {item.title}
          </motion.h3>
          <motion.div
            initial={false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.3, delay: isInView ? 0.15 : 0, ease: [0.32, 0.72, 0, 1] }}
            className="text-on-surface-variant text-base md:text-lg"
          >
            {item.content}
          </motion.div>
        </div>
        <motion.div
          initial={false}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, delay: isInView ? 0.05 : 0, ease: [0.32, 0.72, 0, 1] }}
          className="bg-surface-container-high/50 border-outline-variant/20 relative order-1 flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border shadow-inner md:order-2 md:aspect-4/3 md:rounded-2xl"
        >
          <Image
            src={item.img}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 90vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority={index === 0}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export function StoryTimeline({ items }: StoryTimelineProps) {
  return (
    <section className="w-full" aria-label="Story Timeline">
      {items.map((item, index) => (
        <StoryCard key={index} item={item} index={index} />
      ))}
    </section>
  );
}
