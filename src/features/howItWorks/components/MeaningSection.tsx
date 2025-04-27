import Card from '@components/ui/Card';
import { motion } from 'framer-motion';
import { BellRing, Heart, Star, Sword, Users } from 'lucide-react';

// Meaning cards with brand colors from FRD and one-liners
const meaningCards = [
  {
    letter: 'F',
    meaning: 'Friendship',
    oneLiner: 'Built different. Partners in crime.',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    letter: 'L',
    meaning: 'Love',
    oneLiner: 'Butterflies? More like fireworks.',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
  },
  {
    letter: 'A',
    meaning: 'Affection',
    oneLiner: 'Too sweet to handle. Proceed carefully.',
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
  },
  {
    letter: 'M',
    meaning: 'Marriage',
    oneLiner: 'From matches to milestones.',
    icon: BellRing,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/30',
  },
  {
    letter: 'E',
    meaning: 'Enemy',
    oneLiner: 'Warning: drama ahead.',
    icon: Sword,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/30',
  },
  {
    letter: 'S',
    meaning: 'Siblings',
    oneLiner: 'Can’t get rid of each other. Ever.',
    icon: Users,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
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
      <Card className="cursor-default p-8 shadow-lg dark:shadow-blue-900/20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <h2 className="font-heading mb-8 text-center text-3xl font-bold">What Each Letter Means</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meaningCards.map(({ letter, meaning, oneLiner, icon: Icon, color, bgColor }, index) => (
              <motion.div
                key={letter}
                className={`rounded-lg p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${bgColor}`}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${bgColor} ${color} ring-2 ring-current/20`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className={`font-heading text-xl font-bold ${color}`}>
                      {letter} - {meaning}
                    </div>
                    <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">{oneLiner}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.p
            className="mt-10 text-center text-base text-gray-600 italic dark:text-gray-400"
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
