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
  funFact: string;
  icon: React.ReactNode;
  colorClass: string;
  bgColorClass: string;
  borderColorClass: string;
}

const meaningCards: MeaningCard[] = [
  {
    letter: 'F',
    title: 'Friends',
    description: 'The ultimate "let\'s just be friends" energy.',
    funFact: 'Hey, at least they\'ll share their fries with you! 🍟',
    icon: <Users className="h-8 w-8" />,
    colorClass: 'text-friendship dark:text-friendship',
    bgColorClass: 'bg-friendship-container/20 dark:bg-friendship-container/30',
    borderColorClass: 'border-friendship/30 dark:border-friendship/40',
  },
  {
    letter: 'L',
    title: 'Love',
    description: 'Cupid just did a happy dance! 💘',
    funFact: 'Time to start practicing your "meet the parents" speech!',
    icon: <Heart className="h-8 w-8 fill-current" />,
    colorClass: 'text-love dark:text-love',
    bgColorClass: 'bg-love-container/20 dark:bg-love-container/30',
    borderColorClass: 'border-love/30 dark:border-love/40',
  },
  {
    letter: 'A',
    title: 'Affection',
    description: 'More than friends, less than "putting a ring on it".',
    funFact: 'Expect butterflies, chocolates, and awkward hand-holding! 🦋',
    icon: <Sparkles className="h-8 w-8" />,
    colorClass: 'text-affection dark:text-affection',
    bgColorClass: 'bg-affection-container/20 dark:bg-affection-container/30',
    borderColorClass: 'border-affection/30 dark:border-affection/40',
  },
  {
    letter: 'M',
    title: 'Marriage',
    description: 'The algorithm says: "Start shopping for rings!" 💍',
    funFact: 'Your aunties already started planning the wedding menu.',
    icon: <GiBigDiamondRing className="h-8 w-8" />,
    colorClass: 'text-marriage dark:text-marriage',
    bgColorClass: 'bg-marriage-container/20 dark:bg-marriage-container/30',
    borderColorClass: 'border-marriage/30 dark:border-marriage/40',
  },
  {
    letter: 'E',
    title: 'Enemies',
    description: 'Plot twist! You\'re destined to be frenemies.',
    funFact: 'Keep your friends close, and this one... closer? 😈',
    icon: <GiBrokenHeart className="h-8 w-8" />,
    colorClass: 'text-enemy dark:text-enemy',
    bgColorClass: 'bg-enemy-container/20 dark:bg-enemy-container/30',
    borderColorClass: 'border-enemy/30 dark:border-enemy/40',
  },
  {
    letter: 'S',
    title: 'Siblings',
    description: 'Congratulations! You\'ve gained a sibling from another parent.',
    funFact: 'Get ready for fights over the TV remote! 📺',
    icon: <Shield className="h-8 w-8" />,
    colorClass: 'text-siblings dark:text-siblings',
    bgColorClass: 'bg-siblings-container/20 dark:bg-siblings-container/30',
    borderColorClass: 'border-siblings/30 dark:border-siblings/40',
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
          The Sacred Scrolls of{' '}
          <span className="text-primary">FLAMES</span>
        </motion.h2>

        <motion.p
          className="text-on-surface-variant mx-auto max-w-2xl text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Behold! Each letter holds the key to your romantic destiny.{' '}
          <span className="text-on-surface font-medium">No pressure</span>, but this is literally{' '}
          <motion.span
            className="text-primary font-semibold"
            animate={shouldAnimate ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ancient playground wisdom
          </motion.span>{' '}
          passed down through generations of 5th graders. 📜✨
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
              className={`relative h-full overflow-hidden border p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${card.bgColorClass} ${card.borderColorClass}`}
            >
              {/* Background decoration */}
              {shouldAnimate && (
                <motion.div
                  className={`absolute -top-10 -right-10 opacity-10 ${card.colorClass}`}
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
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold shadow-lg ${card.bgColorClass} ${card.colorClass} border-2 ${card.borderColorClass}`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  animate={
                    shouldAnimate
                      ? {
                          scale: [1, 1.05, 1],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {card.letter}
                </motion.div>
                <motion.div className={`transition-colors duration-300 ${card.colorClass}`} whileHover={{ scale: 1.1 }}>
                  {card.icon}
                </motion.div>
              </motion.div>

              {/* Title */}
              <h3 className={`font-heading mb-2 text-xl font-bold ${card.colorClass}`}>{card.title}</h3>

              {/* Description */}
              <p className="text-on-surface mb-3 text-sm leading-relaxed">{card.description}</p>

              {/* Fun Fact */}
              <p className="text-on-surface-variant text-xs italic opacity-80">{card.funFact}</p>

              {/* Hover effect line */}
              <motion.div
                className={`absolute bottom-0 left-0 h-1 origin-left ${card.bgColorClass}`}
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
