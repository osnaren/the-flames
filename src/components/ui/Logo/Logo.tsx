import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, Variants } from 'framer-motion';
import { Flame } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type LogoProps = {
  variant?: 'static' | 'animated';
  animationType?: 'continuous' | 'onHover';
  className?: string;
  showText?: boolean;
  textClassName?: string;
};

const LOTTIE_URL = 'https://lottie.host/9cb4acbd-ebc9-47d5-a93d-b74645e73999/cjJpSqtrEH.lottie';

function Logo({
  variant = 'static',
  animationType = 'onHover',
  className,
  showText = true,
  textClassName = '',
}: LogoProps) {
  const { shouldAnimate } = useAnimationPreferences();
  const isAnimated = variant === 'animated';
  const playOnHover = animationType === 'onHover';
  const [dotLottieInstance, setDotLottieInstance] = useState<DotLottie | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Optimize the callback to prevent unnecessary re-renders
  const dotLottieRefCallback = useCallback((dotLottie: DotLottie | null) => {
    setDotLottieInstance(dotLottie);
  }, []);

  // For hover animation control
  useEffect(() => {
    if (shouldAnimate && playOnHover && dotLottieInstance) {
      if (isHovering) {
        dotLottieInstance.play();
      } else {
        dotLottieInstance.stop();
      }
    }
  }, [isHovering, playOnHover, dotLottieInstance, shouldAnimate]);

  // For continuous animation, ensure it's always playing
  useEffect(() => {
    if (shouldAnimate && !playOnHover && dotLottieInstance) {
      dotLottieInstance.play();
    }
  }, [dotLottieInstance, playOnHover, shouldAnimate]);

  const lottieElement = (
    <DotLottieReact
      src={LOTTIE_URL}
      autoplay={shouldAnimate && !playOnHover}
      loop={true}
      style={{ width: 30, height: 30 }}
      className="text-primary-container text-glow-sm h-8 transition-transform group-hover:scale-110"
      aria-hidden="true"
      dotLottieRefCallback={dotLottieRefCallback}
    />
  );

  const staticElement = (
    <Flame
      className="text-primary-container text-glow-sm h-6 w-6 transition-transform group-hover:scale-110"
      aria-hidden="true"
    />
  );

  // Text animation variants
  const textVariants = {
    hover: {
      backgroundPosition: ['0% 50%', '100% 50%'],
      transition: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' },
    },
  } as Variants;

  return (
    <motion.div
      className={`flex items-center ${className || ''}`}
      whileHover={{ scale: shouldAnimate ? 1.05 : 1 }}
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <Link to="/" className="group flex items-center gap-2" aria-label={showText ? 'FLAMES Home' : 'Home'}>
        <div className={`relative flex items-center justify-center ${isHovering ? 'animate-pulse' : ''}`}>
          {isAnimated ? lottieElement : staticElement}
          {isAnimated && shouldAnimate && (
            <motion.div
              className="bg-primary-container/20 absolute h-8 w-8 rounded-full"
              animate={{
                opacity: [0.4, 0.2, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              aria-hidden="true"
            />
          )}
        </div>

        {showText && (
          <motion.span
            initial="initial"
            whileHover="hover"
            variants={textVariants}
            className={`from-primary-container to-error-container bg-gradient-to-r bg-[size:200%] bg-clip-text text-xl font-bold text-transparent ${textClassName}`}
          >
            FLAMES
          </motion.span>
        )}
      </Link>
    </motion.div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(Logo);
