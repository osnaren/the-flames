import Image from 'next/image';
import { useState } from 'react';
import { FLAMES_DATA } from '../../constants';
import type { NonNullFlamesResult } from '../../types';
import { RESULT_ICONS } from './resultCard.constants';

export function preloadResultIcon(result: NonNullFlamesResult) {
  const icon = new window.Image();
  icon.src = RESULT_ICONS[result];
  return icon.decode().catch(() => {});
}

export function ResultIcon({ result, className }: { result: NonNullFlamesResult; className: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <span aria-hidden="true" className="absolute text-[2.5em] leading-none">
          {FLAMES_DATA.find((item) => item.letter === result)?.emoji}
        </span>
      )}
      <Image
        src={RESULT_ICONS[result]}
        alt=""
        width={120}
        height={120}
        loading="eager"
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? '' : 'opacity-0'}`}
      />
    </>
  );
}
