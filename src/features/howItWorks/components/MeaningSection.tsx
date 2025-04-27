import Card from '@components/ui/Card';
import { motion } from 'framer-motion';
import { BellRing, Handshake, Heart, Smile, Star, Sword } from 'lucide-react';

// Meaning cards with theme-aligned colors from design system
const meaningCards = [
  {
    letter: 'F',
    meaning: 'Friendship',
    oneLiner: 'Built different. Partners in crime.',
    icon: Handshake,
    emoji: '🤝',
    color: 'text-friendship',
    bgColor: 'bg-friendship-container/20',
    ringColor: 'ring-friendship/20',
  },
  {
    letter: 'L',
    meaning: 'Love',
    oneLiner: 'Butterflies? More like fireworks.',
    icon: Heart,
    emoji: '❤️',
    color: 'text-love',
    bgColor: 'bg-love-container/20',
    ringColor: 'ring-love/20',
  },
  {
    letter: 'A',
    meaning: 'Affection',
    oneLiner: 'Too sweet to handle. Proceed carefully.',
    icon: Star,
    emoji: '⭐',
    color: 'text-affection',
    bgColor: 'bg-affection-container/20',
    ringColor: 'ring-affection/20',
  },
  {
    letter: 'M',
    meaning: 'Marriage',
    oneLiner: 'From matches to milestones.',
    icon: BellRing,
    emoji: '💍',
    color: 'text-marriage',
    bgColor: 'bg-marriage-container/20',
    ringColor: 'ring-marriage/20',
  },
  {
    letter: 'E',
    meaning: 'Enemy',
    oneLiner: 'Warning: drama ahead.',
    icon: Sword,
    emoji: '⚔️',
    color: 'text-enemy',
    bgColor: 'bg-enemy-container/20',
    ringColor: 'ring-enemy/20',
  },
  {
    letter: 'S',
    meaning: 'Siblings',
    oneLiner: 'Like two peas in a pod. Forever bonded.',
    icon: Smile,
    emoji: '👫',
    color: 'text-siblings',
    bgColor: 'bg-siblings-container/20',
    ringColor: 'ring-siblings/20',
  },
];

/**
 * Component to display the meaning of each FLAMES letter
 */
export default function MeaningSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="relative"
    >
      <Card className="cursor-default p-8 shadow-lg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <h2 className="font-heading text-on-surface mb-8 text-center text-3xl font-bold">What Each Letter Means</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meaningCards.map(({ letter, meaning, oneLiner, icon: _Icon, emoji, color, bgColor, ringColor }, index) => (
              <motion.div
                key={letter}
                className={`border-outline/5 rounded-lg border p-5 shadow-md backdrop-blur-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${bgColor}`}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${bgColor} ${color} ring-2 ${ringColor}`}
                  >
                    <span className="font-emoji text-2xl">{emoji}</span>
                  </div>
                  <div>
                    <div className={`font-heading text-xl font-bold ${color}`}>
                      {letter} - {meaning}
                    </div>
                    <div className="text-on-surface-variant mt-1 text-sm font-medium">{oneLiner}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p
            className="text-on-surface-variant mt-10 text-center text-base italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            "Remember scribbling this on the back of notebooks? Pure nostalgia! ✨"
          </motion.p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
