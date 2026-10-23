'use client';

import { DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useState } from 'react';

export default function AnimatedLogo({ playing }: { playing: boolean }) {
  const [player, setPlayer] = useState<DotLottie | null>(null);

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
