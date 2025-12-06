'use client';

import Card from '@/components/ui/Card';
import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { motion, useInView } from 'framer-motion';
import { Flame, Heart, Shield, Sparkles, Users, Zap } from 'lucide-react';
import { useRef } from 'react';
import { GiBigDiamondRing, GiBrokenHeart } from 'react-icons/gi';

interface MeaningCard {
  letter: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

const meaningCards: MeaningCard[] = [
  {
    letter: 'F',
    title: 'Friends',
    description: 'A beautiful friendship awaits. The foundation of all great relationships!',
    icon: <Users className="h-8 w-8" />,
    color: 'var(--tertiary)',
    bgGradient: 'from-tertiary/10 to-tertiary/5',
  },
  {
    letter: 'L',
    title: 'Love',
    description: 'True love is in the cards. Hearts beating as one!',
    icon: <Heart className="h-8 w-8 fill-current" />,
    color: 'var(--error)',
    bgGradient: 'from-error/10 to-error/5',
  },
  {
    letter: 'A',
    title: 'Affection',
    description: 'Deep care and tenderness. A bond that warms the soul!',
    icon: <Sparkles className="h-8 w-8" />,
    color: 'var(--secondary)',
    bgGradient: 'from-secondary/10 to-secondary/5',
  },
  {
    letter: 'M',
    title: 'Marriage',
    description: 'Wedding bells are ringing! A lifetime commitment awaits!',
    icon: <GiBigDiamondRing className="h-8 w-8" />,
    color: 'var(--primary)',
    bgGradient: 'from-primary/10 to-primary/5',
  },
  {
    letter: 'E',
    title: 'Enemies',
    description: 'A rivalry for the ages. May the best prevail!',
    icon: <GiBrokenHeart className="h-8 w-8" />,
    color: 'var(--warning)',
    bgGradient: 'from-warning/10 to-warning/5',
  },
  {
    letter: 'S',
    title: 'Siblings',
    description: 'A brotherly/sisterly bond. Family-like connection!',
    icon: <Shield className="h-8 w-8" />,
    color: 'var(--success)',
    bgGradient: 'from-success/10 to-success/5',
  },
];

/**
 * Enhanced Meaning Section showing the significance of each FLAMES letter
 * with interactive cards and rich animations
 */
export default function MeaningSection() {
  const { shouldAnimate } = useAnimationPreferences();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={containerRef}
      className="relative py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Section Header */}
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-4 flex items-center justify-center gap-3"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <motion.div
            animate={shouldAnimate ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Flame className="text-primary h-10 w-10" />
          </motion.div>
        </motion.div>

        <motion.h2
          className="font-heading text-on-surface mb-4 text-3xl font-bold md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          What Does Each Letter Mean?
        </motion.h2>

        <motion.p
          className="text-on-surface-variant mx-auto max-w-2xl text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Each letter in{' '}
          <span className="text-primary font-semibold">
            F<span className="text-secondary">L</span>
            <span className="text-tertiary">A</span>
            <span className="text-primary">M</span>
            <span className="text-warning">E</span>
            <span className="text-success">S</span>
          </span>{' '}
          represents a unique relationship destiny!
        </motion.p>
      </motion.div>

      {/* Meaning Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {meaningCards.map((card, idx) => (
          <motion.div
            key={card.letter}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.5 + idx * 0.1,
              type: 'spring',
              stiffness: 200,
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group"
          >
            <Card
              className={`relative h-full overflow-hidden bg-linear-to-br p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${card.bgGradient}`}
            >
              {/* Background decoration */}
              {shouldAnimate && (
                <motion.div
                  className="absolute -top-10 -right-10 opacity-10"
                  style={{ color: card.color }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="h-40 w-40" />
                </motion.div>
              )}

              {/* Letter Badge */}
              <motion.div
                className="mb-4 flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.6 + idx * 0.1 }}
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold text-white shadow-lg"
                  style={{ backgroundColor: card.color }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  animate={shouldAnimate ? { boxShadow: [`0 4px 15px ${card.color}40`, `0 8px 25px ${card.color}60`, `0 4px 15px ${card.color}40`] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {card.letter}
                </motion.div>
                <motion.div
                  className="transition-colors duration-300"
                  style={{ color: card.color }}
                  whileHover={{ scale: 1.1 }}
                >
                  {card.icon}
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h3
                className="font-heading text-on-surface mb-2 text-xl font-bold"
                style={{ color: card.color }}
              >
                {card.title}
              </motion.h3>

              {/* Description */}
              <p className="text-on-surface-variant text-sm leading-relaxed">{card.description}</p>

              {/* Hover effect line */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 origin-left"
                style={{ backgroundColor: card.color }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
