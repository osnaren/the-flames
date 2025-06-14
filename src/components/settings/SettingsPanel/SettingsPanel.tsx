import { AnimatePresence, motion } from 'framer-motion';
import { Award, Calendar, Headphones, Moon, Palette, Settings, Sun, Vibrate, Volume2, VolumeX, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useSeasonalTheme } from '@/themes/seasonal/useSeasonalTheme';

interface SettingsPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isVisible, onClose }: SettingsPanelProps) {
  const {
    isDarkTheme,
    animationsEnabled,
    isSoundEnabled,
    isHapticEnabled,
    volume,
    seasonalTheme,
    toggleTheme,
    toggleAnimations,
    toggleSound,
    toggleHaptic,
    setVolume,
    setSeasonalTheme,
  } = usePreferencesStore();

  const { playSound } = useSoundEffects();
  const { hapticFeedback, capabilities, testHaptic: testHapticFunction } = useHapticFeedback();
  const { getAvailableThemes, setManualTheme, currentTheme } = useSeasonalTheme();

  const [activeTab, setActiveTab] = useState<'general' | 'audio' | 'themes' | 'gamification'>('general');

  const handleVolumeChange = useCallback(
    async (newVolume: number) => {
      setVolume(newVolume);
      if (isSoundEnabled) {
        await playSound('click', { volume: newVolume });
      }
    },
    [setVolume, isSoundEnabled, playSound]
  );

  const handleThemeChange = useCallback(
    async (theme: string) => {
      await playSound('click');
      hapticFeedback.tap();

      if (theme === 'auto') {
        setManualTheme(null);
      } else {
        setManualTheme(theme as any);
      }
    },
    [playSound, hapticFeedback, setManualTheme]
  );

  const handleTestSound = useCallback(async () => {
    await playSound('success');
    toast.success('Sound test complete!', { duration: 1500 });
  }, [playSound]);

  const handleTestHaptic = useCallback(async () => {
    const success = await testHapticFunction();
    if (success) {
      toast.success('Haptic test complete!', { duration: 1500 });
    } else {
      toast.error('Haptic feedback not available on this device', { duration: 2000 });
    }
  }, [testHapticFunction]);

  const availableThemes = getAvailableThemes();

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
          className="relative mx-4 h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6" />
              <div>
                <h2 className="text-2xl font-bold">Settings</h2>
                <p className="text-sm opacity-90">Customize your FLAMES experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b bg-gray-50 dark:bg-gray-800">
            <div className="flex">
              {[
                { id: 'general', label: 'General', icon: Settings },
                { id: 'audio', label: 'Audio & Haptics', icon: Headphones },
                { id: 'themes', label: 'Themes', icon: Palette },
                { id: 'gamification', label: 'Gamification', icon: Award },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'border-b-2 border-blue-500 bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>

                  {/* Dark Theme Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isDarkTheme ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                      <div>
                        <label className="font-medium text-gray-900 dark:text-white">Theme</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {isDarkTheme ? 'Dark mode' : 'Light mode'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isDarkTheme ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isDarkTheme ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Animations Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" />
                      <div>
                        <label className="font-medium text-gray-900 dark:text-white">Animations</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enable smooth animations and transitions
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleAnimations}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        animationsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Audio & Haptics Tab */}
            {activeTab === 'audio' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audio Settings</h3>

                  {/* Sound Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isSoundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                      <div>
                        <label className="font-medium text-gray-900 dark:text-white">Sound Effects</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Play sounds for interactions and game events
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleSound}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isSoundEnabled ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isSoundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Volume Slider */}
                  {isSoundEnabled && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        Volume: {Math.round(volume * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                      <button
                        onClick={handleTestSound}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Test Sound
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Haptic Feedback</h3>

                  {/* Haptic Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Vibrate className="h-5 w-5" />
                      <div>
                        <label className="font-medium text-gray-900 dark:text-white">Vibration</label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {capabilities.isSupported
                            ? 'Provide haptic feedback for interactions'
                            : 'Not supported on this device'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleHaptic}
                      disabled={!capabilities.isSupported}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isHapticEnabled && capabilities.isSupported ? 'bg-blue-600' : 'bg-gray-200'
                      } ${!capabilities.isSupported ? 'opacity-50' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isHapticEnabled && capabilities.isSupported ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Haptic Test */}
                  {isHapticEnabled && capabilities.isSupported && (
                    <button
                      onClick={handleTestHaptic}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Test Haptic Feedback
                    </button>
                  )}

                  {/* Device Capabilities */}
                  <div className="rounded-lg bg-gray-100 p-4 text-sm dark:bg-gray-800">
                    <h4 className="font-medium text-gray-900 dark:text-white">Device Support</h4>
                    <ul className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                      <li>Mobile Device: {capabilities.isMobile ? '✅' : '❌'}</li>
                      <li>Vibration API: {capabilities.hasVibrationAPI ? '✅' : '❌'}</li>
                      <li>Gamepad Haptics: {capabilities.hasGamepadHaptics ? '✅' : '❌'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Themes Tab */}
            {activeTab === 'themes' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Seasonal Themes</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose how themes are applied to your FLAMES experience
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Auto Theme Option */}
                    <button
                      onClick={() => handleThemeChange('auto')}
                      className={`rounded-lg border-2 p-4 text-left transition-all ${
                        seasonalTheme === 'auto'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Auto</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Changes automatically with seasons</p>
                        </div>
                      </div>
                    </button>

                    {/* Manual Theme Options */}
                    {availableThemes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`rounded-lg border-2 p-4 text-left transition-all ${
                          seasonalTheme === theme.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Palette className="h-5 w-5 text-purple-600" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {theme.name}
                              {theme.isActive && ' (Active)'}
                              {theme.isDetected && seasonalTheme === 'auto' && ' (Detected)'}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{theme.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gamification Tab */}
            {activeTab === 'gamification' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievement System</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customize how badges and achievements are displayed
                  </p>

                  <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                    <h4 className="font-medium text-gray-900 dark:text-white">Badge Notifications</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Get notified when you unlock new badges and achievements
                    </p>
                    <div className="mt-3 space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Show badge unlock animations</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Play celebration sounds</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Display progress indicators</span>
                      </label>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                    <h4 className="font-medium text-gray-900 dark:text-white">Statistics</h4>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Track your progress and view detailed statistics
                    </p>
                    <div className="mt-3 space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Save pairing history</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Track streaks and patterns</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Enable anonymous mode</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
