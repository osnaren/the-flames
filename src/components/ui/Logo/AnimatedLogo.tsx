'use client';

import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useState } from 'react';

export default function AnimatedLogo({ playing, onReady }: { playing: boolean; onReady?: () => void }) {
  const [player, setPlayer] = useState<DotLottie | null>(null);

  // Report once the animation file has loaded, so the static icon can hand over
  // without a blank frame while the .lottie file is still downloading.
  useEffect(() => {
    if (!player || !onReady) return;
    if (player.isLoaded) {
      onReady();
      return;
    }
    player.addEventListener('load', onReady);
    return () => player.removeEventListener('load', onReady);
  }, [player, onReady]);

  useEffect(() => {
    if (playing) player?.play();
    else player?.pause();
  }, [player, playing]);

  return (
    <DotLottieReact
      src="https://cdn.osnaren.com/the-flames/v1/assets/logo.lottie"
      autoplay={playing}
      loop
      style={{ width: 32, height: 32 }}
      aria-hidden="true"
      dotLottieRefCallback={setPlayer}
    />
  );
}
