'use client';

import { useAnimationPreferences } from '@/hooks/useAnimationPreferences';
import { motion, Variants } from 'framer-motion';
import { Flame } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { memo, useState } from 'react';

type LogoProps = {
  variant?: 'static' | 'animated';
  animationType?: 'continuous' | 'onHover';
  className?: string;
  showText?: boolean;
  textClassName?: string;
};

const AnimatedLogo = dynamic(() => import('./AnimatedLogo'), { ssr: false });

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
  const [isHovering, setIsHovering] = useState(false);
  const [animationRequested, setAnimationRequested] = useState(false);

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
      onHoverStart={() => {
        setIsHovering(true);
        if (shouldAnimate && isAnimated) setAnimationRequested(true);
      }}
      onHoverEnd={() => setIsHovering(false)}
    >
      <Link href="/" className="group flex items-center gap-2" aria-label={showText ? 'FLAMES Home' : 'Home'}>
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
          {staticElement}
          {isAnimated && shouldAnimate && animationRequested && (
            <div className="bg-surface absolute inset-0">
              <AnimatedLogo playing={!playOnHover || isHovering} />
            </div>
          )}
          {isAnimated && shouldAnimate && isHovering && (
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
            className={`font-handwriting from-primary-container to-error-container bg-linear-to-r bg-size-[200%] bg-clip-text text-xl font-bold text-transparent ${textClassName}`}
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
