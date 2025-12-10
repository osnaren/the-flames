'use client';

import { SparklesText } from '@/components/magicui/sparkles-text';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Button } from '@/components/shadcn/button';
import { RetroGrid } from '@/components/shadcn/retro-grid';
import { FocusCards } from '@/components/ui/focus-cards';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { StoryTimeline } from './components/StoryTimeline';

const focusCards = [
  {
    title: 'Backbench Chronicles',
    src: '/assets/about/students-writing.png',
  },
  {
    title: 'Chalkboard Confessions',
    src: '/assets/about/blackboard-flames.png',
  },
  {
    title: 'Secret Notebooks',
    src: '/assets/about/hiding-notebook.png',
  },
];

const timelineData = [
  {
    title: 'The Origin',
    img: '/assets/about/origin.png',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground text-lg">
          It started in the back of a classroom. A bored student, a rough notebook, and a name written in secret.
        </p>
        <p className="text-muted-foreground text-lg">
          F.L.A.M.E.S. wasn't just a game; it was a ritual. A way to peek into a future that felt infinite and
          terrifyingly exciting.
        </p>
      </div>
    ),
  },
  {
    title: 'The Algorithm',
    img: '/assets/about/algorithm.png',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground text-lg">
          Cross out the common letters. Count the remains. Iterate through the acronym:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-lg font-medium">
          <li>
            <span className="text-red-500">F</span>riends
          </li>
          <li>
            <span className="text-pink-500">L</span>overs
          </li>
          <li>
            <span className="text-purple-500">A</span>ffection
          </li>
          <li>
            <span className="text-orange-500">M</span>arriage
          </li>
          <li>
            <span className="text-blue-500">E</span>nemies
          </li>
          <li>
            <span className="text-gray-500">S</span>iblings
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: 'The Digital Era',
    img: '/assets/about/digital.png',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground text-lg">
          We brought this nostalgia to the web. No more paper waste, no more getting caught by the teacher. Just pure,
          unadulterated destiny prediction.
        </p>
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
        <RetroGrid className="opacity-50" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
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
            className="font-heading text-muted-foreground text-2xl font-light tracking-wide md:text-4xl"
          >
            The Nostalgia Project
          </h2>
        </motion.div>

        <div className="z-10 mx-auto mt-8 max-w-2xl">
          <TextAnimate
            animation="blurInUp"
            by="word"
            className="font-handwriting text-muted-foreground/80 text-lg leading-relaxed md:text-xl"
          >
            Remember the days of scribbling names on the back of your rough notebook? Crossing out letters, counting the
            remains, and predicting your destiny?
          </TextAnimate>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 animate-bounce"
          aria-hidden="true"
        >
          <ArrowRight className="text-muted-foreground h-8 w-8 rotate-90" />
        </motion.div>
      </section>

      {/* Sticky Scroll Story Section */}
      <StoryTimeline items={timelineData} />

      {/* Image Gallery Section */}
      <section className="bg-muted/10 px-4 py-32" aria-labelledby="gallery-heading">
        <div className="container mx-auto space-y-16">
          <div className="space-y-4 text-center">
            <h2 id="gallery-heading" className="font-heading text-3xl font-bold tracking-tight md:text-5xl">
              Captured Memories
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Snapshots of the past, reimagined for the future.
            </p>
          </div>
          <FocusCards cards={focusCards} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden px-4 py-32" aria-labelledby="cta-heading">
        <div className="from-background to-primary/5 absolute inset-0 -z-10 bg-linear-to-b" aria-hidden="true" />
        <div className="relative z-10 container mx-auto space-y-10 text-center">
          <h2 id="cta-heading" className="font-heading text-4xl font-bold tracking-tighter md:text-6xl">
            Ready to find out your destiny?
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl font-light md:text-2xl">
            Don't let the past stay in the past. The flames are still burning.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 pt-8 sm:flex-row">
            <Link href="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="hover:bg-muted/50 h-14 rounded-full border-2 px-10 text-lg transition-all"
              >
                How it Works
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 hover:shadow-primary/25 h-14 rounded-full px-10 text-lg shadow-lg transition-all"
              >
                Play Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
