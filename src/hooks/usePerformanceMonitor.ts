import { useCallback, useEffect, useRef, useState } from 'react';
import { useDeviceCapabilities } from './useDeviceCapabilities';

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  frameTime: number;
  isPerformanceLow: boolean;
  qualityLevel: 'low' | 'medium' | 'high' | 'ultra';
  particleCount: number;
  maxParticles: number;
  shouldReduceEffects: boolean;
}

export interface PerformanceSettings {
  targetFPS: number;
  memoryThreshold: number;
  autoAdjustQuality: boolean;
  minFramesForAdjustment: number;
}

const DEFAULT_SETTINGS: PerformanceSettings = {
  targetFPS: 60,
  memoryThreshold: 50, // MB
  autoAdjustQuality: true,
  minFramesForAdjustment: 60, // 1 second at 60fps
};

export function usePerformanceMonitor(settings: Partial<PerformanceSettings> = {}) {
  const config = { ...DEFAULT_SETTINGS, ...settings };
  const deviceCapabilities = useDeviceCapabilities();

  const [metrics, setMetrics] = useState<PerformanceMetrics>(() => ({
    fps: 60,
    memoryUsage: 0,
    frameTime: 16.67,
    isPerformanceLow: false,
    qualityLevel: 'high',
    particleCount: 0,
    maxParticles: 100,
    shouldReduceEffects: false,
  }));

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const animationIdRef = useRef<number>();
  const adjustmentCounterRef = useRef(0);

  // Calculate initial quality level based on device capabilities
  const getInitialQualityLevel = useCallback((): PerformanceMetrics['qualityLevel'] => {
    if (deviceCapabilities.isLowPowerMode) return 'low';
    if (deviceCapabilities.isMobile) {
      if (deviceCapabilities.deviceMemory < 2) return 'low';
      if (deviceCapabilities.deviceMemory < 4) return 'medium';
      return 'high';
    }
    if (deviceCapabilities.deviceMemory < 4) return 'medium';
    if (deviceCapabilities.deviceMemory >= 8) return 'ultra';
    return 'high';
  }, [deviceCapabilities.isLowPowerMode, deviceCapabilities.isMobile, deviceCapabilities.deviceMemory]);

  // Get quality-based settings
  const getQualitySettings = useCallback((quality: PerformanceMetrics['qualityLevel']) => {
    const settings = {
      low: { maxParticles: 25, shouldReduceEffects: true },
      medium: { maxParticles: 50, shouldReduceEffects: false },
      high: { maxParticles: 100, shouldReduceEffects: false },
      ultra: { maxParticles: 200, shouldReduceEffects: false },
    };
    return settings[quality];
  }, []);

  // Performance monitoring loop
  const monitorPerformance = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;

    frameCountRef.current++;

    // Calculate FPS every second
    if (deltaTime >= 1000) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
      fpsHistoryRef.current.push(fps);

      // Keep only last 10 FPS readings
      if (fpsHistoryRef.current.length > 10) {
        fpsHistoryRef.current.shift();
      }

      const avgFPS = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
      const frameTime = 1000 / fps;

      // Get memory usage if available
      let memoryUsage = 0;
      if ('memory' in performance) {
        const memory = (performance as PerformanceWithMemory).memory;
        memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
      }

      const isPerformanceLow = avgFPS < config.targetFPS * 0.8 || memoryUsage > config.memoryThreshold;

      setMetrics((prev) => {
        let newQualityLevel = prev.qualityLevel;

        // Auto-adjust quality if enabled
        if (config.autoAdjustQuality && adjustmentCounterRef.current >= config.minFramesForAdjustment) {
          if (isPerformanceLow && prev.qualityLevel !== 'low') {
            const levels: PerformanceMetrics['qualityLevel'][] = ['ultra', 'high', 'medium', 'low'];
            const currentIndex = levels.indexOf(prev.qualityLevel);
            newQualityLevel = levels[Math.min(currentIndex + 1, levels.length - 1)];
            adjustmentCounterRef.current = 0; // Reset counter after adjustment
          } else if (!isPerformanceLow && avgFPS > config.targetFPS * 0.95 && prev.qualityLevel !== 'ultra') {
            const levels: PerformanceMetrics['qualityLevel'][] = ['low', 'medium', 'high', 'ultra'];
            const currentIndex = levels.indexOf(prev.qualityLevel);
            newQualityLevel = levels[Math.min(currentIndex + 1, levels.length - 1)];
            adjustmentCounterRef.current = 0; // Reset counter after adjustment
          }
        }

        const qualitySettings = getQualitySettings(newQualityLevel);

        return {
          ...prev,
          fps: Math.round(avgFPS),
          memoryUsage: Math.round(memoryUsage),
          frameTime: Math.round(frameTime * 100) / 100,
          isPerformanceLow,
          qualityLevel: newQualityLevel,
          maxParticles: qualitySettings.maxParticles,
          shouldReduceEffects: qualitySettings.shouldReduceEffects || deviceCapabilities.reducedMotion,
        };
      });

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }

    adjustmentCounterRef.current++;
    animationIdRef.current = requestAnimationFrame(monitorPerformance);
  }, [config, deviceCapabilities.reducedMotion, getQualitySettings]);

  // Start/stop monitoring
  useEffect(() => {
    // Set initial quality level
    const initialQuality = getInitialQualityLevel();
    setMetrics((prev) => ({
      ...prev,
      qualityLevel: initialQuality,
      ...getQualitySettings(initialQuality),
    }));

    animationIdRef.current = requestAnimationFrame(monitorPerformance);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [monitorPerformance, getInitialQualityLevel, getQualitySettings]);

  // Manual quality adjustment
  const setQualityLevel = useCallback(
    (level: PerformanceMetrics['qualityLevel']) => {
      setMetrics((prev) => ({
        ...prev,
        qualityLevel: level,
        ...getQualitySettings(level),
      }));
    },
    [getQualitySettings]
  );

  // Update particle count (called by particle systems)
  const updateParticleCount = useCallback((count: number) => {
    setMetrics((prev) => ({ ...prev, particleCount: count }));
  }, []);

  return {
    metrics,
    setQualityLevel,
    updateParticleCount,
    isMonitoring: !!animationIdRef.current,
  };
}

// Type definition for performance.memory
interface PerformanceMemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface PerformanceWithMemory extends Performance {
  memory: PerformanceMemoryInfo;
}
