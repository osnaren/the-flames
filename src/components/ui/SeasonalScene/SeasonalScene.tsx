'use client';

import type { SeasonalTheme } from '@/themes/seasonal/types';
import { memo, type CSSProperties, type ReactNode } from 'react';
import * as P from './pieces';

type Vars = Record<`--${string}`, string>;

interface PieceProps {
  className?: string;
  style: CSSProperties;
  anim?: string;
  vars?: Vars;
  children: ReactNode;
}

/** Absolutely positioned illustration; animation runs on this wrapper. */
function Piece({ className = '', style, anim = '', vars, children }: PieceProps) {
  return (
    <div className={`scene-piece ${anim} ${className}`} style={{ ...style, ...vars }}>
      {children}
    </div>
  );
}

/** An ornament hanging on a thread from just below the header, swaying gently. */
function Hang({
  left,
  right,
  thread,
  width,
  ratio,
  dur = '4.5s',
  delay = '0s',
  sway = '5deg',
  className = '',
  color = 'rgb(148 163 184 / 0.7)',
  children,
}: {
  left?: string;
  right?: string;
  thread: number;
  width: string;
  ratio: number;
  dur?: string;
  delay?: string;
  sway?: string;
  className?: string;
  color?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`scene-piece scene-sway top-14 md:top-16 ${className}`}
      style={{ left, right, width, '--dur': dur, '--delay': delay, '--sway': sway } as CSSProperties}
    >
      <div className="mx-auto w-px" style={{ height: thread, background: color }} />
      <div style={{ width: '100%', aspectRatio: ratio }}>{children}</div>
    </div>
  );
}

const v = (vars: Vars) => vars;

/** Warm ember horizon for the classic FLAMES theme. */
function DefaultScene() {
  const tongues = [
    { left: '-2%', w: '9vw', h: 'clamp(70px, 12vw, 150px)', dur: '1.8s', delay: '0s', hue: '#f97316' },
    { left: '6%', w: '6vw', h: 'clamp(50px, 8vw, 110px)', dur: '1.5s', delay: '-0.4s', hue: '#ef4444' },
    { left: '88%', w: '7vw', h: 'clamp(60px, 10vw, 130px)', dur: '1.7s', delay: '-0.8s', hue: '#f97316' },
    { left: '95%', w: '6vw', h: 'clamp(50px, 8vw, 110px)', dur: '1.4s', delay: '-0.2s', hue: '#dc2626' },
  ];
  return (
    <>
      <div
        className="scene-piece inset-x-0 bottom-0 h-[22vh]"
        style={{
          backgroundImage: 'radial-gradient(ellipse 70% 100% at 50% 100%, rgb(249 115 22 / 0.18), transparent 70%)',
        }}
      />
      {tongues.map((t) => (
        <Piece
          key={t.left}
          anim="scene-flicker"
          className="bottom-[-12px] opacity-70"
          style={{ left: t.left, width: t.w, minWidth: 34, height: t.h }}
          vars={v({ '--dur': t.dur, '--delay': t.delay })}
        >
          <P.FlameTongue hue={t.hue} />
        </Piece>
      ))}
      {[
        ['14%', '30%', '3.1s', '0s'],
        ['82%', '22%', '2.6s', '-1s'],
        ['72%', '62%', '3.6s', '-2s'],
      ].map(([left, top, dur, delay]) => (
        <Piece
          key={left}
          anim="scene-twinkle"
          className="hidden h-4 w-4 opacity-70 sm:block"
          style={{ left, top }}
          vars={v({ '--dur': dur, '--delay': delay })}
        >
          <P.Sparkle fill="#fdba74" />
        </Piece>
      ))}
    </>
  );
}

function ValentineScene() {
  const hearts = [
    { left: '4%', thread: 50, w: 'clamp(26px, 3.4vw, 46px)', fill: '#ec4899', dur: '4.2s', delay: '0s' },
    { left: '11%', thread: 90, w: 'clamp(20px, 2.6vw, 36px)', fill: '#f43f5e', dur: '5s', delay: '-1s' },
    { left: '18%', thread: 34, w: 'clamp(22px, 3vw, 40px)', fill: '#fb7185', dur: '4.6s', delay: '-2s', hide: true },
    { right: '17%', thread: 70, w: 'clamp(22px, 3vw, 40px)', fill: '#f472b6', dur: '4.4s', delay: '-0.5s', hide: true },
    { right: '10%', thread: 40, w: 'clamp(26px, 3.4vw, 46px)', fill: '#e11d48', dur: '5.2s', delay: '-1.5s' },
    { right: '3%', thread: 96, w: 'clamp(20px, 2.6vw, 36px)', fill: '#ec4899', dur: '4.8s', delay: '-2.5s' },
  ];
  return (
    <>
      {hearts.map((h, i) => (
        <Hang
          key={i}
          left={h.left}
          right={h.right}
          thread={h.thread}
          width={h.w}
          ratio={64 / 58}
          dur={h.dur}
          delay={h.delay}
          color="rgb(244 114 182 / 0.6)"
          className={h.hide ? 'hidden md:block' : ''}
        >
          <P.Heart fill={h.fill} />
        </Hang>
      ))}
      {[
        ['6%', '#f43f5e', '20s', '0s'],
        ['86%', '#ec4899', '24s', '-9s'],
        ['46%', '#fb7185', '28s', '-16s'],
      ].map(([left, color, dur, delay]) => (
        <Piece
          key={left}
          anim="scene-rise"
          className="bottom-0 h-[clamp(70px,9vw,110px)] w-[clamp(36px,4.5vw,56px)] opacity-80"
          style={{ left }}
          vars={v({ '--dur': dur, '--delay': delay, '--drift': '24px' })}
        >
          <P.Balloon color={color} />
        </Piece>
      ))}
    </>
  );
}

function HalloweenScene() {
  return (
    <>
      <Piece
        anim="scene-bob"
        className="top-20 right-[6%] h-[clamp(90px,13vw,180px)] w-[clamp(90px,13vw,180px)] opacity-90"
        style={{}}
        vars={v({ '--dur': '9s', '--bob': '-6px' })}
      >
        <P.Moon fill="#fef3c7" />
      </Piece>
      <Piece
        className="top-14 left-0 h-[clamp(100px,14vw,170px)] w-[clamp(100px,14vw,170px)] opacity-70 md:top-16"
        style={{}}
      >
        <P.Web />
      </Piece>
      <Piece
        anim="scene-bob"
        className="top-24 left-[9%] hidden h-14 w-8 sm:block"
        style={{}}
        vars={v({ '--dur': '3s', '--bob': '14px' })}
      >
        <P.Spider />
      </Piece>
      {[
        ['30%', '24s', '0s'],
        ['18%', '31s', '-12s'],
        ['42%', '28s', '-20s'],
      ].map(([top, dur, delay]) => (
        <Piece
          key={top}
          anim="scene-fly"
          className="left-0 h-6 w-14 opacity-80"
          style={{ top }}
          vars={v({ '--dur': dur, '--delay': delay })}
        >
          <div className="scene-flap h-full w-full">
            <P.Bat />
          </div>
        </Piece>
      ))}
      {[
        ['1%', 'clamp(70px,10vw,140px)', '0s'],
        ['12%', 'clamp(50px,7vw,100px)', '-1.4s'],
        ['84%', 'clamp(60px,9vw,120px)', '-0.7s'],
      ].map(([left, size, delay]) => (
        <Piece
          key={left}
          anim="scene-bob"
          className="bottom-1"
          style={{ left, width: size, height: `calc(${size} * 0.83)` }}
          vars={v({ '--dur': '4s', '--delay': delay, '--bob': '-4px' })}
        >
          <P.Pumpkin />
        </Piece>
      ))}
    </>
  );
}

function ChristmasScene() {
  const bulbs = Array.from({ length: 14 }, (_, i) => i);
  const colors = ['#ef4444', '#fbbf24', '#22c55e', '#60a5fa'];
  return (
    <>
      <div className="scene-piece inset-x-0 top-14 flex justify-between px-[2%] md:top-16">
        {bulbs.map((i) => (
          <div
            key={i}
            className={`scene-twinkle h-6 w-3.5 ${i % 2 ? 'mt-3' : ''} ${i > 4 && i < 10 ? 'hidden md:block' : ''}`}
            style={{ '--dur': '1.8s', '--delay': `${-(i % 4) * 0.45}s`, '--twinkle-min': '0.45' } as CSSProperties}
          >
            <P.Bulb color={colors[i % 4]} />
          </div>
        ))}
      </div>
      <div
        className="scene-piece inset-x-0 bottom-0 h-[9vh] opacity-90 dark:opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 100% at 20% 100%, #f8fafc 60%, transparent 61%), radial-gradient(ellipse 70% 100% at 85% 100%, #f1f5f9 60%, transparent 61%)',
        }}
      />
      {[
        ['0%', 'clamp(80px,11vw,150px)'],
        ['7%', 'clamp(60px,8vw,110px)'],
        ['86%', 'clamp(70px,10vw,140px)'],
        ['93%', 'clamp(56px,7vw,100px)'],
      ].map(([left, w]) => (
        <Piece key={left} className="bottom-[3vh] opacity-90" style={{ left, width: w, height: `calc(${w} * 1.6)` }}>
          <P.PineTree />
        </Piece>
      ))}
      {['3.5%', '90%'].map((left) => (
        <Piece
          key={left}
          anim="scene-twinkle"
          className="bottom-[calc(3vh+clamp(120px,17vw,235px))] h-6 w-6"
          style={{ left }}
          vars={v({ '--dur': '2s', '--twinkle-min': '0.6' })}
        >
          <P.Star fill="#facc15" />
        </Piece>
      ))}
    </>
  );
}

function NewYearScene() {
  const bursts = [
    { left: '6%', top: '18%', size: 'clamp(90px,12vw,170px)', c: '#f472b6', a: '#fde68a', dur: '3.4s', delay: '0s' },
    {
      left: '80%',
      top: '14%',
      size: 'clamp(110px,14vw,200px)',
      c: '#60a5fa',
      a: '#e0f2fe',
      dur: '3.8s',
      delay: '-1.2s',
    },
    {
      left: '70%',
      top: '42%',
      size: 'clamp(70px,9vw,130px)',
      c: '#facc15',
      a: '#fff',
      dur: '3.1s',
      delay: '-2.1s',
      hide: true,
    },
    {
      left: '16%',
      top: '48%',
      size: 'clamp(70px,9vw,130px)',
      c: '#a78bfa',
      a: '#fde68a',
      dur: '3.6s',
      delay: '-0.6s',
      hide: true,
    },
    {
      left: '45%',
      top: '8%',
      size: 'clamp(60px,8vw,110px)',
      c: '#34d399',
      a: '#fff',
      dur: '4.2s',
      delay: '-2.8s',
      hide: true,
    },
  ];
  return (
    <>
      {bursts.map((b) => (
        <Piece
          key={b.left + b.top}
          anim="scene-burst"
          className={b.hide ? 'hidden md:block' : ''}
          style={{ left: b.left, top: b.top, width: b.size, height: b.size }}
          vars={v({ '--dur': b.dur, '--delay': b.delay })}
        >
          <P.Firework color={b.c} accent={b.a} />
        </Piece>
      ))}
      <Piece className="inset-x-0 bottom-0 h-[clamp(70px,13vh,150px)] opacity-80" style={{}}>
        <P.Skyline />
      </Piece>
    </>
  );
}

function DiwaliScene() {
  const diyas = ['2%', '9%', '16%', '78%', '85%', '92%'];
  return (
    <>
      <Hang
        left="3%"
        thread={40}
        width="clamp(44px,5.5vw,80px)"
        ratio={90 / 140}
        dur="5s"
        color="rgb(245 158 11 / 0.7)"
      >
        <P.Kandil />
      </Hang>
      <Hang
        left="13%"
        thread={90}
        width="clamp(30px,3.6vw,52px)"
        ratio={90 / 140}
        dur="4.4s"
        delay="-1.5s"
        color="rgb(245 158 11 / 0.7)"
        className="hidden sm:block"
      >
        <P.Kandil a="#db2777" b="#7c3aed" />
      </Hang>
      <Hang
        right="4%"
        thread={60}
        width="clamp(44px,5.5vw,80px)"
        ratio={90 / 140}
        dur="5.4s"
        delay="-2.2s"
        color="rgb(245 158 11 / 0.7)"
      >
        <P.Kandil a="#a855f7" b="#f59e0b" />
      </Hang>
      <Piece
        anim="scene-spin"
        className="-right-[8vw] -bottom-[8vw] hidden h-[30vw] max-h-[340px] w-[30vw] max-w-[340px] opacity-25 md:block"
        style={{}}
        vars={v({ '--dur': '90s' })}
      >
        <P.Mandala />
      </Piece>
      {diyas.map((left, i) => (
        <div
          key={left}
          className={`scene-piece bottom-1 w-[clamp(46px,5vw,76px)] ${i === 2 || i === 3 ? 'hidden sm:block' : ''}`}
          style={{ left }}
        >
          <div
            className="scene-flicker mx-auto -mb-1 h-[clamp(20px,2.4vw,34px)] w-[42%]"
            style={{ '--dur': `${1.3 + (i % 3) * 0.25}s`, '--delay': `${-i * 0.3}s` } as CSSProperties}
          >
            <P.Flame />
          </div>
          <div style={{ aspectRatio: 2 }}>
            <P.DiyaBase />
          </div>
        </div>
      ))}
    </>
  );
}

function HoliScene() {
  const splashes = [
    { cls: '-top-[6vw] -left-[6vw]', size: '28vw', fill: '#ec4899', dur: '7s' },
    { cls: '-top-[4vw] -right-[7vw]', size: '24vw', fill: '#22c55e', dur: '8s' },
    { cls: '-bottom-[7vw] -left-[5vw]', size: '26vw', fill: '#facc15', dur: '9s' },
    { cls: '-bottom-[6vw] -right-[6vw]', size: '27vw', fill: '#8b5cf6', dur: '7.5s' },
    { cls: 'top-[40%] -right-[9vw] hidden md:block', size: '16vw', fill: '#3b82f6', dur: '8.5s' },
  ];
  return (
    <>
      {splashes.map((s) => (
        <Piece
          key={s.fill}
          anim="motion-pulse"
          className={`opacity-30 ${s.cls}`}
          style={{ width: s.size, height: s.size, maxWidth: 360, maxHeight: 360 }}
          vars={v({ '--pulse-duration': s.dur, '--pulse-scale': '1.08' })}
        >
          <P.Splash fill={s.fill} />
        </Piece>
      ))}
      {[
        ['8%', '#f472b6', '16s', '0s'],
        ['30%', '#facc15', '19s', '-6s'],
        ['68%', '#4ade80', '17s', '-11s'],
        ['90%', '#a78bfa', '21s', '-3s'],
      ].map(([left, color, dur, delay]) => (
        <Piece
          key={left}
          anim="scene-rise"
          className="bottom-0 h-[clamp(36px,4vw,56px)] w-[clamp(36px,4vw,56px)] opacity-60"
          style={{ left }}
          vars={v({ '--dur': dur, '--delay': delay, '--drift': '-30px' })}
        >
          <P.Splash fill={color} />
        </Piece>
      ))}
    </>
  );
}

function OnamScene() {
  return (
    <>
      <Piece
        anim="scene-spin"
        className="-bottom-[10vw] -left-[8vw] h-[30vw] max-h-[340px] min-h-[170px] w-[30vw] max-w-[340px] min-w-[170px] opacity-85"
        style={{}}
        vars={v({ '--dur': '120s' })}
      >
        <P.Pookalam />
      </Piece>
      <Piece
        anim="scene-spin"
        className="-top-[6vw] -right-[8vw] hidden h-[22vw] max-h-[260px] w-[22vw] max-w-[260px] opacity-60 md:block"
        style={{}}
        vars={v({ '--dur': '140s' })}
      >
        <P.Pookalam />
      </Piece>
      {['22%', '90%'].map((left, i) => (
        <Piece
          key={left}
          anim="scene-sway"
          className="bottom-[-10px] h-[clamp(120px,22vh,240px)] w-[clamp(40px,5vw,70px)] origin-bottom opacity-80"
          style={{ left, transformOrigin: 'bottom center' }}
          vars={v({ '--dur': '6s', '--delay': `${-i * 2}s`, '--sway': '4deg' })}
        >
          <svg viewBox="0 0 60 200">
            <path d="M30 200V60" stroke="#3f6212" strokeWidth="6" />
            <path
              d="M30 70C10 50 0 20 4 0c14 14 26 40 26 70zM30 100c20-20 30-46 26-66-14 14-26 36-26 66zM30 130C12 116 2 92 6 74c12 12 22 30 24 56z"
              fill="#4d7c0f"
            />
          </svg>
        </Piece>
      ))}
      {['22%', '74%'].map((left, i) => (
        <Piece
          key={left}
          anim="scene-twinkle"
          className="top-28 hidden h-8 w-8 md:block"
          style={{ left }}
          vars={v({ '--dur': '3s', '--delay': `${-i}s` })}
        >
          <P.Marigold fill={i ? '#facc15' : '#f97316'} />
        </Piece>
      ))}
    </>
  );
}

function PongalScene() {
  return (
    <>
      <Piece
        anim="scene-spin"
        className="top-20 right-[5%] h-[clamp(90px,12vw,170px)] w-[clamp(90px,12vw,170px)] opacity-90"
        style={{}}
        vars={v({ '--dur': '50s' })}
      >
        <P.Sun />
      </Piece>
      <Piece
        anim="scene-bob"
        className="bottom-1 left-[3%] h-[clamp(80px,11vw,140px)] w-[clamp(80px,11vw,140px)]"
        style={{}}
        vars={v({ '--dur': '5s', '--bob': '-3px' })}
      >
        <P.PongalPot />
      </Piece>
      {['0%', '15%', '84%', '92%'].map((left, i) => (
        <Piece
          key={left}
          anim="scene-sway"
          className={`bottom-[-6px] h-[clamp(130px,24vh,240px)] w-[clamp(18px,2vw,28px)] ${i === 1 ? 'hidden sm:block' : ''}`}
          style={{ left, transformOrigin: 'bottom center' }}
          vars={v({ '--dur': `${5 + i}s`, '--delay': `${-i}s`, '--sway': '3deg' })}
        >
          <P.Sugarcane />
        </Piece>
      ))}
      <Piece
        anim="scene-spin"
        className="-right-[6vw] -bottom-[6vw] hidden h-[22vw] max-h-[260px] w-[22vw] max-w-[260px] opacity-30 md:block"
        style={{}}
        vars={v({ '--dur': '100s' })}
      >
        <P.Mandala a="#dc2626" b="#f59e0b" c="#16a34a" />
      </Piece>
    </>
  );
}

function LunarScene() {
  const lanterns = [
    { left: '2%', thread: 30, w: 'clamp(40px,5vw,72px)', dur: '5s' },
    { left: '10%', thread: 80, w: 'clamp(30px,3.6vw,52px)', dur: '4.4s', hide: true },
    { right: '11%', thread: 60, w: 'clamp(34px,4vw,58px)', dur: '4.8s', hide: true },
    { right: '2%', thread: 26, w: 'clamp(40px,5vw,72px)', dur: '5.6s' },
  ];
  return (
    <>
      {lanterns.map((l, i) => (
        <Hang
          key={i}
          left={l.left}
          right={l.right}
          thread={l.thread}
          width={l.w}
          ratio={80 / 130}
          dur={l.dur}
          delay={`${-i * 1.1}s`}
          color="rgb(244 180 0 / 0.75)"
          className={l.hide ? 'hidden sm:block' : ''}
        >
          <P.ChineseLantern />
        </Hang>
      ))}
      <Piece
        anim="scene-sway"
        className="bottom-[8vh] -left-6 hidden h-[clamp(140px,18vw,240px)] w-[clamp(220px,28vw,380px)] opacity-80 md:block"
        style={{ transformOrigin: 'left center' }}
        vars={v({ '--dur': '8s', '--sway': '2deg' })}
      >
        <P.PlumBranch />
      </Piece>
      {[
        ['20%', '12s'],
        ['76%', '15s'],
      ].map(([left, dur], i) => (
        <Piece
          key={left}
          anim="scene-rise"
          className="bottom-0 h-8 w-8 opacity-90"
          style={{ left }}
          vars={v({ '--dur': dur, '--delay': `${-i * 5}s` })}
        >
          <P.Coin />
        </Piece>
      ))}
    </>
  );
}

function EidScene() {
  return (
    <>
      <Piece
        anim="scene-bob"
        className="top-20 right-[7%] h-[clamp(80px,11vw,150px)] w-[clamp(80px,11vw,150px)]"
        style={{}}
        vars={v({ '--dur': '8s', '--bob': '-6px', '--bob-tilt': '-6deg' })}
      >
        <P.Moon crescent fill="#fcd34d" />
      </Piece>
      {[
        ['72%', '18%'],
        ['88%', '34%'],
        ['60%', '9%'],
        ['24%', '14%'],
        ['10%', '30%'],
      ].map(([left, top], i) => (
        <Piece
          key={left}
          anim="scene-twinkle"
          className={`h-5 w-5 ${i > 2 ? 'hidden sm:block' : ''}`}
          style={{ left, top }}
          vars={v({ '--dur': `${2 + i * 0.4}s`, '--delay': `${-i * 0.6}s` })}
        >
          <P.Star fill="#fde68a" />
        </Piece>
      ))}
      {[
        { left: '3%', thread: 36, w: 'clamp(36px,4.4vw,62px)', glass: '#2dd4bf' },
        { left: '12%', thread: 84, w: 'clamp(28px,3.2vw,46px)', glass: '#a78bfa', hide: true },
      ].map((l, i) => (
        <Hang
          key={l.left}
          left={l.left}
          thread={l.thread}
          width={l.w}
          ratio={70 / 140}
          dur={`${5 + i}s`}
          delay={`${-i * 1.6}s`}
          color="rgb(201 162 39 / 0.7)"
          className={l.hide ? 'hidden sm:block' : ''}
        >
          <P.Fanous glass={l.glass} />
        </Hang>
      ))}
      <Piece className="inset-x-0 bottom-0 h-[clamp(70px,13vh,150px)] opacity-75" style={{}}>
        <P.MosqueSkyline fill="#0f766e" />
      </Piece>
    </>
  );
}

function RakhiScene() {
  return (
    <>
      <div className="scene-piece inset-x-0 top-14 h-10 md:top-16">
        <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="h-full w-full">
          <path d="M0 6Q250 40 500 20T1000 6" stroke="#e11d74" strokeWidth="3" fill="none" />
          <path d="M0 10Q250 44 500 24T1000 10" stroke="#f59e0b" strokeWidth="3" fill="none" strokeDasharray="8 8" />
        </svg>
      </div>
      <Piece
        anim="scene-spin"
        className="top-[4.75rem] left-1/2 hidden h-16 w-16 -translate-x-1/2 md:block"
        style={{}}
        vars={v({ '--dur': '30s' })}
      >
        <P.Rakhi />
      </Piece>
      {['2%', '8%', '90%', '96%'].map((left, i) => (
        <Hang
          key={left}
          left={left}
          thread={0}
          width="clamp(16px,1.8vw,26px)"
          ratio={1}
          dur={`${4 + (i % 2)}s`}
          delay={`${-i}s`}
          className={i === 1 || i === 2 ? 'hidden sm:block' : ''}
        >
          <div className="flex flex-col gap-0.5">
            {Array.from({ length: 7 }, (_, j) => (
              <P.Marigold key={j} fill={j % 2 ? '#f97316' : '#facc15'} />
            ))}
          </div>
        </Hang>
      ))}
      {['14%', '80%'].map((left, i) => (
        <Piece
          key={left}
          anim="scene-bob"
          className="bottom-6 hidden h-16 w-16 opacity-80 sm:block"
          style={{ left }}
          vars={v({ '--dur': '4.5s', '--delay': `${-i * 1.5}s` })}
        >
          <P.Rakhi />
        </Piece>
      ))}
    </>
  );
}

function FriendshipScene() {
  const balloons = [
    ['4%', '#2563eb', '17s', '0s'],
    ['14%', '#f59e0b', '21s', '-7s'],
    ['36%', '#10b981', '24s', '-14s'],
    ['62%', '#ec4899', '19s', '-4s'],
    ['82%', '#8b5cf6', '22s', '-10s'],
    ['92%', '#f97316', '18s', '-16s'],
  ];
  return (
    <>
      {balloons.map(([left, color, dur, delay], i) => (
        <Piece
          key={left}
          anim="scene-rise"
          className={`bottom-0 h-[clamp(70px,9vw,110px)] w-[clamp(36px,4.5vw,56px)] opacity-85 ${i === 2 || i === 3 ? 'hidden sm:block' : ''}`}
          style={{ left }}
          vars={v({ '--dur': dur, '--delay': delay, '--drift': i % 2 ? '-26px' : '26px' })}
        >
          <P.Balloon color={color} />
        </Piece>
      ))}
      {[
        ['5%', '30%'],
        ['86%', '22%'],
      ].map(([left, top], i) => (
        <Piece
          key={left}
          anim="scene-spin"
          className="hidden h-16 w-16 opacity-70 md:block"
          style={{ left, top }}
          vars={v({ '--dur': `${18 + i * 6}s` })}
        >
          <P.Band />
        </Piece>
      ))}
    </>
  );
}

function SpringScene() {
  return (
    <>
      <Piece
        anim="scene-sway"
        className="top-14 -left-4 h-[clamp(130px,18vw,250px)] w-[clamp(210px,30vw,400px)] md:top-16"
        style={{ transformOrigin: 'left top' }}
        vars={v({ '--dur': '7s', '--sway': '2deg' })}
      >
        <P.Branch />
      </Piece>
      <Piece
        anim="scene-sway"
        className="-right-4 bottom-[6vh] hidden h-[clamp(120px,15vw,210px)] w-[clamp(190px,24vw,330px)] opacity-90 md:block"
        style={{ transformOrigin: 'right center' }}
        vars={v({ '--dur': '8.5s', '--sway': '2deg', '--delay': '-3s' })}
      >
        <div className="h-full w-full -scale-x-100">
          <P.Branch blossom="#fbcfe8" center="#db2777" />
        </div>
      </Piece>
      <div
        className="scene-piece inset-x-0 bottom-0 h-[8vh]"
        style={{
          backgroundImage: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgb(132 204 22 / 0.25), transparent 70%)',
        }}
      />
    </>
  );
}

function MonsoonScene() {
  return (
    <>
      <div className="scene-piece inset-0 overflow-hidden opacity-40">
        <div
          className="scene-rain absolute inset-x-0 -top-full h-[200%]"
          style={
            {
              '--dur': '0.6s',
              backgroundImage:
                'repeating-linear-gradient(105deg, transparent 0 14px, rgb(125 211 252 / 0.55) 14px 15px, transparent 15px 42px)',
              backgroundSize: '100% 120px',
            } as CSSProperties
          }
        />
      </div>
      {[
        ['-4%', 'clamp(140px,22vw,300px)', '38s', '0s', '60px'],
        ['30%', 'clamp(120px,18vw,240px)', '44s', '-12s', '-50px'],
        ['70%', 'clamp(150px,24vw,320px)', '40s', '-20s', '40px'],
      ].map(([left, w, dur, delay, drift]) => (
        <Piece
          key={left}
          anim="scene-drift"
          className="top-14 opacity-60 md:top-16"
          style={{ left, width: w, height: `calc(${w} * 0.45)` }}
          vars={v({ '--dur': dur, '--delay': delay, '--drift': drift })}
        >
          <P.Cloud fill="#94a3b8" />
        </Piece>
      ))}
      <div
        className="scene-piece inset-x-0 bottom-0 h-[5vh]"
        style={{ backgroundImage: 'linear-gradient(to top, rgb(14 116 144 / 0.35), transparent)' }}
      />
      {['8%', '76%'].map((left, i) => (
        <Piece
          key={left}
          anim="scene-bob"
          className="bottom-[2vh] h-10 w-16"
          style={{ left }}
          vars={v({ '--dur': '3.2s', '--delay': `${-i * 1.2}s`, '--bob': '-5px', '--bob-tilt': '4deg' })}
        >
          <P.PaperBoat />
        </Piece>
      ))}
    </>
  );
}

function AutumnScene() {
  return (
    <>
      <Piece
        anim="scene-sway"
        className="top-14 -right-4 h-[clamp(130px,18vw,250px)] w-[clamp(210px,30vw,400px)] md:top-16"
        style={{ transformOrigin: 'right top' }}
        vars={v({ '--dur': '7.5s', '--sway': '2deg' })}
      >
        <div className="h-full w-full -scale-x-100">
          <P.MapleBranch />
        </div>
      </Piece>
      {[
        ['6%', '16s', '0s'],
        ['40%', '20s', '-7s'],
        ['78%', '18s', '-12s'],
      ].map(([left, dur, delay], i) => (
        <Piece
          key={left}
          anim="scene-fly"
          className="top-[30%] hidden h-7 w-7 opacity-80 sm:block"
          style={{ left: 0, top: `${24 + i * 14}%` }}
          vars={v({ '--dur': dur, '--delay': delay })}
        >
          <div className="scene-spin h-full w-full" style={{ '--dur': '6s' } as CSSProperties}>
            <svg viewBox="-20 -20 40 40">
              <path d={P.MAPLE_LEAF} fill={['#c2410c', '#d97706', '#b91c1c'][i % 3]} />
            </svg>
          </div>
        </Piece>
      ))}
      <div
        className="scene-piece inset-x-0 bottom-0 h-[10vh]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 30% 70% at 8% 100%, rgb(194 65 12 / 0.45), transparent 70%), radial-gradient(ellipse 30% 70% at 92% 100%, rgb(217 119 6 / 0.45), transparent 70%)',
        }}
      />
    </>
  );
}

const SCENES: Partial<Record<SeasonalTheme, () => ReactNode>> = {
  default: DefaultScene,
  valentine: ValentineScene,
  halloween: HalloweenScene,
  christmas: ChristmasScene,
  newYear: NewYearScene,
  diwali: DiwaliScene,
  holi: HoliScene,
  onam: OnamScene,
  pongal: PongalScene,
  lunarNewYear: LunarScene,
  eid: EidScene,
  rakhi: RakhiScene,
  friendship: FriendshipScene,
  spring: SpringScene,
  monsoon: MonsoonScene,
  autumn: AutumnScene,
};

/**
 * Illustrated, animated scenery for the active seasonal theme. Sits in the
 * fixed background layer, behind all content, and never captures input.
 */
function SeasonalScene({ theme, dimmed = false }: { theme: SeasonalTheme; dimmed?: boolean }) {
  const Scene = SCENES[theme];
  if (!Scene) return null;
  return (
    <div
      key={theme}
      aria-hidden="true"
      data-scene={theme}
      className="scene-root pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-700"
      style={{ opacity: dimmed ? 0.35 : 1 }}
    >
      <Scene />
    </div>
  );
}

export default memo(SeasonalScene);
