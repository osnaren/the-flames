'use client';

import { SparklesText } from '@/components/magicui/sparkles-text';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Badge } from '@components/shadcn/badge';
import { Button } from '@components/shadcn/button';
import { RetroGrid } from '@components/shadcn/retro-grid';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { apiDocsConfig } from '../config';

export function ApiHero() {
  const { hero } = apiDocsConfig;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hero.cta.primary.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error('Failed to copy endpoint snippet', error);
    }
  };

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center space-y-8 overflow-hidden px-4 text-center">
      <RetroGrid
        className="opacity-100"
        lightLineColor="rgba(0, 0, 0, 0.15)"
        darkLineColor="rgba(255, 255, 255, 0.1)"
      />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="z-10"
      >
        {hero.eyebrow && (
          <Badge variant="outline" className="border-primary/40 bg-primary/10 mb-4 text-xs tracking-wide uppercase">
            {hero.eyebrow}
          </Badge>
        )}
        <SparklesText
          className="mb-4 text-5xl font-extrabold tracking-tighter md:text-7xl"
          colors={{ first: '#3b82f6', second: '#8b5cf6' }}
        >
          {hero.title}
        </SparklesText>
        <h2 className="font-heading text-muted-foreground text-xl font-light tracking-wide md:text-2xl">
          Build with FLAMES
        </h2>
      </motion.div>

      {/* Description */}
      <div className="z-10 mx-auto max-w-2xl">
        <TextAnimate
          animation="blurInUp"
          by="word"
          className="text-muted-foreground/90 text-base leading-relaxed md:text-lg"
        >
          {hero.subtitle}
        </TextAnimate>
      </div>

      {/* Feature Badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="z-10 flex flex-wrap justify-center gap-3"
      >
        {hero.features.map((feature) => (
          <span
            key={feature.label}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium ring-1 ring-inset ${feature.badgeClass}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {feature.label}
          </span>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="z-10 flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
      >
        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 hover:shadow-primary/25 h-12 rounded-full px-8 text-base shadow-lg transition-all"
          onClick={handleCopy}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span className="ml-2">{copied ? 'Copied!' : hero.cta.primary.label}</span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="hover:bg-muted/50 h-12 rounded-full border-2 px-8 text-base transition-all"
          asChild
        >
          <Link href={hero.cta.secondary.href} target="_blank" rel="noreferrer">
            <ExternalLink size={18} className="mr-2" />
            {hero.cta.secondary.label}
          </Link>
        </Button>
      </motion.div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="z-10 grid w-full max-w-3xl gap-4 pt-8 sm:grid-cols-3"
      >
        {hero.metrics.map((metric) => (
          <div
            key={metric.label}
            className="border-border bg-surface-container-low hover:bg-surface-container hover:border-primary/30 rounded-2xl border p-5 text-center shadow-sm transition-all duration-300"
          >
            <p className="text-accent-foreground text-xs font-medium tracking-wide uppercase">{metric.label}</p>
            <p className="text-foreground mt-1 text-3xl font-bold">{metric.value}</p>
            <p className="text-accent-foreground mt-1 text-xs">{metric.helper}</p>
          </div>
        ))}
      </motion.div>

      {/* Status Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="z-10 flex flex-wrap items-center justify-center gap-3 pt-4 text-xs"
      >
        <span className="rounded-full border border-green-600/40 bg-green-100 px-4 py-1.5 font-medium text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-400">
          Uptime {hero.status.uptime}
        </span>
        <span className="border-border bg-surface-container text-muted-foreground rounded-full border px-4 py-1.5">
          Last deploy {hero.status.lastDeploy}
        </span>
        <span className="border-primary/40 bg-primary/10 text-primary rounded-full border px-4 py-1.5 font-mono">
          POST {apiDocsConfig.endpoint.path}
        </span>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 animate-bounce"
      >
        <ArrowRight className="text-muted-foreground h-6 w-6 rotate-90" />
      </motion.div>
    </section>
  );
}
