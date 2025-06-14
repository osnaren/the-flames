import { AnimatePresence, motion } from 'framer-motion';
import { Award, Calendar, Clock, Lock, Share2, Star, Target, Trophy } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { usePairingHistory } from '@/hooks/usePairingHistory';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt?: number;
  category: 'achievement' | 'milestone' | 'streak' | 'discovery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
}

interface BadgeShowcaseProps {
  isVisible: boolean;
  onClose: () => void;
}

const RARITY_COLORS = {
  common: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    border: 'border-gray-300 dark:border-gray-600',
    glow: 'shadow-gray-500/20',
    text: 'text-gray-700 dark:text-gray-300',
  },
  rare: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    border: 'border-blue-300 dark:border-blue-600',
    glow: 'shadow-blue-500/30',
    text: 'text-blue-700 dark:text-blue-300',
  },
  epic: {
    bg: 'bg-purple-100 dark:bg-purple-900',
    border: 'border-purple-300 dark:border-purple-600',
    glow: 'shadow-purple-500/40',
    text: 'text-purple-700 dark:text-purple-300',
  },
  legendary: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    border: 'border-yellow-300 dark:border-yellow-600',
    glow: 'shadow-yellow-500/50',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
};

const CATEGORY_ICONS = {
  achievement: Trophy,
  milestone: Target,
  streak: Calendar,
  discovery: Star,
};

export function BadgeShowcase({ isVisible, onClose }: BadgeShowcaseProps) {
  const { badges, stats } = usePairingHistory();
  const { playSound } = useSoundEffects();
  const { hapticFeedback } = useHapticFeedback();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rarity' | 'category'>('date');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  // Enhanced badge data with categories and rarity
  const enhancedBadges = useMemo(() => {
    return badges.map((badge): Badge => {
      let category: Badge['category'] = 'achievement';
      let rarity: Badge['rarity'] = 'common';
      let progress = 0;
      let maxProgress = 1;

      // Determine category and rarity based on badge ID
      switch (badge.id) {
        case 'heartthrob': {
          category = 'streak';
          rarity = 'rare';
          progress = Math.min(3, stats.maxConsecutiveLove);
          maxProgress = 3;
          break;
        }
        case 'flames-explorer': {
          category = 'discovery';
          rarity = 'epic';
          progress = stats.uniqueResults.size;
          maxProgress = 6;
          break;
        }
        case 'friendship-guru': {
          category = 'milestone';
          rarity = 'rare';
          progress = stats.resultCounts.F;
          maxProgress = 5;
          break;
        }
        case 'love-magnet': {
          category = 'milestone';
          rarity = 'epic';
          progress = stats.resultCounts.L;
          maxProgress = 10;
          break;
        }
        case 'matchmaker': {
          category = 'milestone';
          rarity = 'rare';
          progress = stats.resultCounts.M;
          maxProgress = 5;
          break;
        }
        case 'peacekeeper': {
          category = 'achievement';
          rarity = 'legendary';
          break;
        }
        case 'century-club': {
          category = 'milestone';
          rarity = 'legendary';
          progress = stats.totalPairings;
          maxProgress = 100;
          break;
        }
        case 'daily-player': {
          category = 'streak';
          rarity = 'epic';
          break;
        }
      }

      return {
        ...badge,
        category,
        rarity,
        progress: badge.unlocked ? maxProgress : progress,
        maxProgress,
      };
    });
  }, [badges, stats]);

  // Filter and sort badges
  const filteredBadges = useMemo(() => {
    let filtered = enhancedBadges;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((badge) => badge.category === selectedCategory);
    }

    // Filter by unlocked status
    if (showUnlockedOnly) {
      filtered = filtered.filter((badge) => badge.unlocked);
    }

    // Sort badges
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          if (a.unlocked && b.unlocked) {
            return (b.unlockedAt || 0) - (a.unlockedAt || 0);
          }
          return a.unlocked === b.unlocked ? 0 : a.unlocked ? -1 : 1;
        case 'rarity':
          const rarityOrder = ['common', 'rare', 'epic', 'legendary'];
          return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [enhancedBadges, selectedCategory, sortBy, showUnlockedOnly]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts = enhancedBadges.reduce(
      (acc, badge) => {
        acc[badge.category] = (acc[badge.category] || 0) + 1;
        if (badge.unlocked) {
          acc[`${badge.category}_unlocked`] = (acc[`${badge.category}_unlocked`] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      all: enhancedBadges.length,
      all_unlocked: enhancedBadges.filter((b) => b.unlocked).length,
      achievement: counts.achievement || 0,
      achievement_unlocked: counts.achievement_unlocked || 0,
      milestone: counts.milestone || 0,
      milestone_unlocked: counts.milestone_unlocked || 0,
      streak: counts.streak || 0,
      streak_unlocked: counts.streak_unlocked || 0,
      discovery: counts.discovery || 0,
      discovery_unlocked: counts.discovery_unlocked || 0,
    };
  }, [enhancedBadges]);

  const handleBadgeClick = useCallback(
    async (badge: Badge) => {
      await playSound('click');
      hapticFeedback.tap();

      if (badge.unlocked) {
        // Show badge details or share
        toast.success(`${badge.emoji} ${badge.title}\n${badge.description}`, {
          duration: 3000,
        });
      } else {
        // Show progress
        if (badge.progress && badge.maxProgress) {
          toast(`Progress: ${badge.progress}/${badge.maxProgress}`, {
            icon: '📊',
            duration: 2000,
          });
        }
      }
    },
    [playSound, hapticFeedback]
  );

  const handleShareBadge = useCallback(
    async (badge: Badge) => {
      await playSound('success');
      hapticFeedback.success();

      const shareText = `I just unlocked the "${badge.title}" badge in FLAMES! ${badge.emoji} ${badge.description}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: `FLAMES Badge: ${badge.title}`,
            text: shareText,
            url: window.location.origin,
          });
        } catch (error) {
          console.warn('Share failed:', error);
        }
      } else {
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(`${shareText}\n\nPlay FLAMES: ${window.location.origin}`);
          toast.success('Badge details copied to clipboard!');
        } catch (error) {
          console.warn('Clipboard write failed:', error);
          toast.error('Could not copy to clipboard');
        }
      }
    },
    [playSound, hapticFeedback]
  );

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative mx-4 h-[80vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6" />
              <div>
                <h2 className="text-2xl font-bold">Badge Collection</h2>
                <p className="text-sm opacity-90">
                  {categoryCounts.all_unlocked} of {categoryCounts.all} badges unlocked
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="border-b bg-gray-50 p-4 dark:bg-gray-800">
            <div className="mb-4 flex flex-wrap gap-2">
              {['all', 'achievement', 'milestone', 'streak', 'discovery'].map((category) => {
                const count = (categoryCounts as any)[category];
                const unlockedCount = (categoryCounts as any)[`${category}_unlocked`];
                const Icon = category === 'all' ? Award : CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS];

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="capitalize">{category}</span>
                    <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">
                      {unlockedCount}/{count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-lg border bg-white px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              >
                <option value="date">Sort by Date</option>
                <option value="rarity">Sort by Rarity</option>
                <option value="category">Sort by Category</option>
              </select>

              {/* Filter Toggle */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showUnlockedOnly}
                  onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                  className="rounded"
                />
                <span>Unlocked only</span>
              </label>
            </div>
          </div>

          {/* Badge Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBadges.map((badge, index) => {
                const rarityStyle = RARITY_COLORS[badge.rarity];
                const CategoryIcon = CATEGORY_ICONS[badge.category];

                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 hover:scale-105 ${
                      badge.unlocked
                        ? `${rarityStyle.bg} ${rarityStyle.border} shadow-lg ${rarityStyle.glow}`
                        : 'border-gray-300 bg-gray-100 opacity-60 dark:border-gray-600 dark:bg-gray-800'
                    }`}
                    onClick={() => handleBadgeClick(badge)}
                  >
                    {/* Rarity Indicator */}
                    <div
                      className={`absolute top-2 right-2 rounded-full px-2 py-1 text-xs font-medium ${rarityStyle.text} ${rarityStyle.bg}`}
                    >
                      {badge.rarity}
                    </div>

                    {/* Lock Overlay for Locked Badges */}
                    {!badge.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <Lock className="h-8 w-8 text-gray-500" />
                      </div>
                    )}

                    {/* Badge Content */}
                    <div className="text-center">
                      <div className="mb-3 text-4xl">{badge.emoji}</div>

                      <div className="mb-2 flex items-center justify-center gap-2">
                        <CategoryIcon className="h-4 w-4 text-gray-500" />
                        <h3 className="font-bold text-gray-900 dark:text-white">{badge.title}</h3>
                      </div>

                      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>

                      {/* Progress Bar */}
                      {badge.progress !== undefined && badge.maxProgress && !badge.unlocked && (
                        <div className="mb-3">
                          <div className="mb-1 flex justify-between text-xs text-gray-500">
                            <span>Progress</span>
                            <span>
                              {badge.progress}/{badge.maxProgress}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                              style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Unlock Date */}
                      {badge.unlocked && badge.unlockedAt && (
                        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Share Button */}
                      {badge.unlocked && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareBadge(badge);
                          }}
                          className="mt-2 flex items-center justify-center gap-1 rounded-full bg-black/10 px-3 py-1 text-xs font-medium transition-colors hover:bg-black/20"
                        >
                          <Share2 className="h-3 w-3" />
                          Share
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredBadges.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Award className="mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No badges found</h3>
                <p className="text-sm text-gray-500">Try adjusting your filters to see more badges.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
