'use client';

import { SparklesText } from '@/components/magicui/sparkles-text';
import { Button } from '@/components/shadcn/button';
import { FocusCards } from '@/components/ui/focus-cards';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { StoryTimeline } from './components/StoryTimeline';

const focusCards = [
  {
    title: 'Backbench Chronicles',
    src: 'https://cdn.osnaren.com/the-flames/v1/assets/about/students-writing.webp',
  },
  {
    title: 'Chalkboard Confessions',
    src: 'https://cdn.osnaren.com/the-flames/v1/assets/about/blackboard-flames.webp',
  },
  {
    title: 'Secret Notebooks',
    src: 'https://cdn.osnaren.com/the-flames/v1/assets/about/hiding-notebook.webp',
  },
];

const timelineData = [
  {
    title: 'The Origin Story',
    img: 'https://cdn.osnaren.com/the-flames/v1/assets/about/origin.webp',
    content: (
      <div className="space-y-4">
        <p className="text-on-surface-variant text-lg">
          Picture this: a boring Tuesday afternoon, a student who definitely should&apos;ve been paying attention in
          class, a rough notebook, and a name written with trembling hands. 📓✨
        </p>
        <p className="text-on-surface-variant text-lg">
          F.L.A.M.E.S. wasn&apos;t invented—it was <span className="text-primary font-semibold">discovered</span>. Like
          gravity, but for romance. A sacred ritual passed down through generations of backbenchers, whispered in hushed
          tones during lunch breaks.
        </p>
        <p className="text-on-surface-variant/80 text-base italic">
          Legend has it, the first person to play it ended up marrying their crush. Or became enemies. History is fuzzy
          on this one. 🤷‍♂️
        </p>
      </div>
    ),
  },
  {
    title: 'The Ancient Algorithm',
    img: 'https://cdn.osnaren.com/the-flames/v1/assets/about/algorithm.webp',
    content: (
      <div className="space-y-4">
        <p className="text-on-surface-variant text-lg">
          The rules are simple, the stakes are high, and the math... well, the math is just chaos dressed in a lab coat:
        </p>
        <ul className="list-none space-y-3 pl-2 text-lg">
          <li className="flex items-center gap-3">
            <span className="text-friendship bg-friendship-container/30 flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold">
              F
            </span>
            <span>
              <span className="text-friendship font-semibold">Friends</span> — &quot;Let&apos;s pretend this
              doesn&apos;t hurt&quot;
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-love bg-love-container/30 flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold">
              L
            </span>
            <span>
              <span className="text-love font-semibold">Love</span> — Jackpot! Time to panic! 💕
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-affection bg-affection-container/30 flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold">
              A
            </span>
            <span>
              <span className="text-affection font-semibold">Affection</span> — The &quot;it&apos;s complicated&quot;
              zone
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-marriage bg-marriage-container/30 flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold">
              M
            </span>
            <span>
              <span className="text-marriage font-semibold">Marriage</span> — Start planning the wedding! 💍
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-enemy bg-enemy-container/30 flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold">
              E
            </span>
            <span>
              <span className="text-enemy font-semibold">Enemies</span> — Plot twist! Grab popcorn 🍿
            </span>
          </li>
          <li className="flex items-center gap-3">
            <span className="text-siblings bg-siblings-container/30 flex h-8 w-8 items-center justify-center rounded-lg text-xl font-bold">
              S
            </span>
            <span>
              <span className="text-siblings font-semibold">Siblings</span> — Instant family expansion
            </span>
          </li>
        </ul>
        <p className="text-on-surface-variant/80 text-base italic">
          Scientists have tried to explain it. They failed. Some things are beyond science. 🔬❌
        </p>
      </div>
    ),
  },
  {
    title: 'The Digital Renaissance',
    img: 'https://cdn.osnaren.com/the-flames/v1/assets/about/digital.webp',
    content: (
      <div className="space-y-4">
        <p className="text-on-surface-variant text-lg">
          We couldn&apos;t let this masterpiece of human innovation stay trapped in dusty notebooks. So we did what any
          reasonable developer would do—we put it on the internet. 🚀
        </p>
        <p className="text-on-surface-variant text-lg">
          <span className="text-primary font-semibold">No more paper cuts.</span>{' '}
          <span className="text-secondary font-semibold">No more suspicious teachers.</span>{' '}
          <span className="text-tertiary font-semibold">No more &quot;accidentally&quot; losing the notebook.</span>
        </p>
        <p className="text-on-surface-variant text-lg">
          Just pure, unfiltered, scientifically questionable destiny prediction—now with{' '}
          <span className="font-semibold">animations</span>, <span className="font-semibold">sound effects</span>, and{' '}
          <span className="font-semibold">zero math homework on the back of the page</span>.
        </p>
        <p className="text-on-surface-variant/80 text-base italic">Your 10-year-old self would be so proud. 🥹</p>
      </div>
    ),
  },
];

/**
 * About Page Component
 *
 * Showcases the story behind FLAMES with animated sections,
 * timeline, and image gallery.
 */
export default function AboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section
        className="relative flex min-h-[90vh] flex-col items-center justify-center space-y-8 overflow-hidden px-4 text-center"
        aria-labelledby="about-hero-title"
      >
        {/* Keep theme repaints inside the hero instead of a 600vw animated 3D layer. */}
        <div
          aria-hidden="true"
          className="text-on-surface/10 pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] mask-[linear-gradient(to_top,transparent,#000)] bg-size-[60px_60px]"
        />

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="z-10"
        >
          <SparklesText
            as="h1"
            className="mb-4 text-6xl font-extrabold tracking-tighter md:text-8xl"
            colors={{ first: '#FF5733', second: '#C70039' }}
          >
            FLAMES
          </SparklesText>
          <h2
            id="about-hero-title"
            className="font-heading text-on-surface-variant text-2xl font-light tracking-wide md:text-4xl"
          >
            The Nostalgia Project
          </h2>
        </motion.div>

        <div className="z-10 mx-auto mt-8 max-w-2xl space-y-4">
          <p className="font-handwriting text-on-surface-variant/90 text-lg leading-relaxed md:text-xl">
            Remember the days when your biggest worry was whether your crush would notice you? When a simple game could
            determine your entire romantic future? When &quot;passing notes&quot; was the original DM?
          </p>
          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="text-on-surface-variant/70 text-base italic"
          >
            Yeah, we missed those days too. So we brought them back. ✨
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 animate-bounce"
          aria-hidden="true"
        >
          <ArrowRight className="text-on-surface-variant h-8 w-8 rotate-90" />
        </motion.div>
      </section>

      <section className="mx-auto max-w-3xl space-y-4 px-4 py-12" aria-labelledby="project-creator">
        <h2 id="project-creator" className="font-heading text-on-surface text-2xl font-bold">
          About this FLAMES app
        </h2>
        <p className="text-on-surface-variant leading-7">
          FLAMES Game is a free browser project by osLabs, bringing the paper-and-pencil name game online with animated
          calculations, manual play, and shareable result cards. You can explore the implementation in the{' '}
          <a href="https://github.com/osnaren/the-flames" className="text-primary underline underline-offset-4">
            public source repository
          </a>{' '}
          or follow our{' '}
          <Link href="/how-it-works" className="text-primary underline underline-offset-4">
            explanation of the rules
          </Link>
          .
        </p>
        <p className="text-on-surface-variant leading-7">
          The schoolyard stories below are playful nostalgia, not a documented history of who invented FLAMES. The game
          is for entertainment and has no scientific validity as a relationship test.
        </p>
      </section>

      {/* Sticky Scroll Story Section */}
      <StoryTimeline items={timelineData} />

      {/* Image Gallery Section */}
      <section className="deferred-content bg-surface-container/30 px-4 py-32" aria-labelledby="gallery-heading">
        <div className="container mx-auto space-y-16">
          <div className="space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="text-primary h-6 w-6" />
            </motion.div>
            <h2
              id="gallery-heading"
              className="font-heading text-on-surface text-3xl font-bold tracking-tight md:text-5xl"
            >
              The Evidence Room
            </h2>
            <p className="text-on-surface-variant mx-auto max-w-2xl text-lg">
              Actual* footage of FLAMES being played throughout history.
              <span className="text-on-surface-variant mt-1 block text-sm italic">
                *May or may not be AI-generated because we couldn&apos;t find our old notebooks 📚
              </span>
            </p>
          </div>
          <FocusCards cards={focusCards} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="deferred-content relative overflow-hidden px-4 py-32" aria-labelledby="cta-heading">
        <div
          className="from-background via-primary-container/10 to-background absolute inset-0 -z-10 bg-linear-to-b"
          aria-hidden="true"
        />
        <div className="relative z-10 container mx-auto space-y-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              id="cta-heading"
              className="font-heading text-on-surface text-4xl font-bold tracking-tighter md:text-6xl"
            >
              Enough Nostalgia. Let&apos;s Get Awkward.
            </h2>
            <p className="text-on-surface-variant mx-auto mt-6 max-w-2xl text-xl font-light md:text-2xl">
              Your destiny awaits. Your crush&apos;s name is probably already on your mind.
              <span className="text-primary font-medium"> Go ahead, we won&apos;t judge.</span>
            </p>
            <p className="text-on-surface-variant mx-auto mt-3 max-w-xl text-base italic">
              (Okay, maybe a little. But only if you get &quot;Enemies.&quot; 😈)
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center gap-6 pt-8 sm:flex-row"
          >
            <Link href="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="border-outline hover:bg-surface-container h-14 cursor-pointer rounded-full border-2 px-10 text-lg transition-all"
              >
                How Does This Magic Work?
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                className="bg-primary text-on-primary hover:bg-primary/90 h-14 cursor-pointer rounded-full px-10 text-lg shadow-lg transition-all hover:shadow-xl"
              >
                Test My Fate <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-on-surface pt-6 text-sm"
          >
            🔥 Free to play • 💕 Made for fun • 📊 Zero scientific validity
          </motion.p>
        </div>
      </section>
    </div>
  );
}
