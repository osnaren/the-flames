/**
 * Hand-drawn SVG pieces used by the seasonal scenes.
 * Pure presentational markup: no state, no animation (animation lives on the
 * wrapping element so it can run on the compositor).
 */

export function Heart({ fill = '#ec4899', shine = true }: { fill?: string; shine?: boolean }) {
  return (
    <svg viewBox="0 0 64 58">
      <path
        d="M32 56S2 38 2 18C2 8.6 9.6 1 19 1c5.6 0 10.4 2.8 13 7 2.6-4.2 7.4-7 13-7 9.4 0 17 7.6 17 17 0 20-30 38-30 38z"
        fill={fill}
      />
      {shine && <ellipse cx="18" cy="16" rx="7" ry="4.5" fill="#fff" opacity="0.45" transform="rotate(-30 18 16)" />}
    </svg>
  );
}

export function ChineseLantern({ body = '#d7263d', trim = '#f4b400' }: { body?: string; trim?: string }) {
  return (
    <svg viewBox="0 0 80 130">
      <rect x="28" y="0" width="24" height="10" rx="3" fill={trim} />
      <ellipse cx="40" cy="58" rx="38" ry="46" fill={body} />
      <path
        d="M40 12c-14 10-14 82 0 92M40 12c14 10 14 82 0 92M40 12c-28 8-28 84 0 92M40 12c28 8 28 84 0 92"
        stroke={trim}
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      <ellipse cx="26" cy="40" rx="8" ry="14" fill="#fff" opacity="0.18" />
      <rect x="26" y="102" width="28" height="9" rx="3" fill={trim} />
      <path d="M34 111v16M40 111v19M46 111v16" stroke={trim} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Kandil({ a = '#f59e0b', b = '#db2777' }: { a?: string; b?: string }) {
  return (
    <svg viewBox="0 0 90 140">
      <path d="M45 0l40 40-40 60L5 40z" fill={a} />
      <path d="M45 0l40 40H5z" fill={b} />
      <path d="M45 100l-14 22h28z" fill={b} />
      <path d="M45 18l18 22-18 34-18-34z" fill="#fff7c2" opacity="0.65" />
      <circle cx="45" cy="44" r="6" fill="#fff" opacity="0.8" />
      <path d="M33 122v14M45 122v18M57 122v14" stroke={a} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Fanous({ frame = '#c9a227', glass = '#2dd4bf' }: { frame?: string; glass?: string }) {
  return (
    <svg viewBox="0 0 70 140">
      <circle cx="35" cy="6" r="5" fill="none" stroke={frame} strokeWidth="3" />
      <path d="M20 14h30l8 18H12z" fill={frame} />
      <path d="M14 32h42l-6 62H20z" fill={glass} opacity="0.55" />
      <path d="M14 32h42l-6 62H20zM35 32v62M24 32l3 62M46 32l-3 62" stroke={frame} strokeWidth="2.5" fill="none" />
      <ellipse cx="35" cy="66" rx="7" ry="11" fill="#fff6c4" opacity="0.95" />
      <path d="M18 94h34l-6 14H24z" fill={frame} />
      <path d="M35 108v26" stroke={frame} strokeWidth="2.5" />
      <circle cx="35" cy="135" r="4" fill={frame} />
    </svg>
  );
}

export function DiyaBase() {
  return (
    <svg viewBox="0 0 100 50">
      <path d="M2 14c10 26 30 34 48 34s38-8 48-34c-14 6-30 9-48 9S16 20 2 14z" fill="#b45309" />
      <path d="M2 14c14 6 30 9 48 9s34-3 48-9c-14-4-30-6-48-6S16 10 2 14z" fill="#f59e0b" />
      <path d="M20 30c8 6 18 9 30 9s22-3 30-9" stroke="#fde68a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="34" r="2.2" fill="#fde68a" />
      <circle cx="50" cy="37" r="2.2" fill="#fde68a" />
      <circle cx="65" cy="34" r="2.2" fill="#fde68a" />
    </svg>
  );
}

export function Flame({ outer = '#f97316', inner = '#fde047' }: { outer?: string; inner?: string }) {
  return (
    <svg viewBox="0 0 40 64">
      <path d="M20 2C28 18 38 26 38 42a18 18 0 0 1-36 0C2 30 12 22 20 2z" fill={outer} />
      <path d="M20 22c5 10 10 14 10 22a10 10 0 0 1-20 0c0-7 6-12 10-22z" fill={inner} />
      <ellipse cx="20" cy="50" rx="4" ry="6" fill="#fff" opacity="0.85" />
    </svg>
  );
}

export function Pumpkin({ glow = '#fde047' }: { glow?: string }) {
  return (
    <svg viewBox="0 0 120 100">
      <path d="M56 14c0-8 4-12 10-14l3 4c-5 2-7 6-7 10z" fill="#3f6212" />
      <ellipse cx="60" cy="58" rx="56" ry="40" fill="#ea580c" />
      <ellipse cx="38" cy="58" rx="22" ry="38" fill="#f97316" />
      <ellipse cx="82" cy="58" rx="22" ry="38" fill="#f97316" />
      <ellipse cx="60" cy="58" rx="18" ry="40" fill="#fb923c" />
      <path d="M34 48l12-10 6 14zM86 48L74 38l-6 14zM38 70c8 10 36 10 44 0l-6 4-4-4-6 5-6-5-6 5-6-5-4 4z" fill={glow} />
    </svg>
  );
}

export function Bat({ fill = '#1f1631' }: { fill?: string }) {
  return (
    <svg viewBox="0 0 100 40">
      <path
        d="M50 14c3-6 6-8 6-8s0 6 2 8c10-4 18-12 20-14 2 8 10 12 22 12-10 4-14 12-14 20-6-6-14-8-20-4-4-4-6-2-8 4h-16c-2-6-4-8-8-4-6-4-14-2-20 4 0-8-4-16-14-20 12 0 20-4 22-12 2 2 10 10 20 14 2-2 2-8 2-8s3 2 6 8z"
        fill={fill}
      />
    </svg>
  );
}

export function Moon({ fill = '#fef3c7', crescent = false }: { fill?: string; crescent?: boolean }) {
  return (
    <svg viewBox="0 0 100 100">
      {crescent ? (
        <path d="M58 4A46 46 0 1 0 96 66 38 38 0 1 1 58 4z" fill={fill} />
      ) : (
        <>
          <circle cx="50" cy="50" r="46" fill={fill} />
          <circle cx="34" cy="38" r="8" fill="#000" opacity="0.06" />
          <circle cx="62" cy="64" r="11" fill="#000" opacity="0.06" />
          <circle cx="66" cy="30" r="5" fill="#000" opacity="0.05" />
        </>
      )}
    </svg>
  );
}

export function Star({ fill = '#fde68a' }: { fill?: string }) {
  return (
    <svg viewBox="0 0 40 40">
      <path d="M20 0l5 14 15 1-12 9 4 16-12-9-12 9 4-16L0 15l15-1z" fill={fill} />
    </svg>
  );
}

export function Sparkle({ fill = '#fff' }: { fill?: string }) {
  return (
    <svg viewBox="0 0 40 40">
      <path d="M20 0c2 12 8 18 20 20-12 2-18 8-20 20-2-12-8-18-20-20 12-2 18-8 20-20z" fill={fill} />
    </svg>
  );
}

export function PineTree({ snow = true }: { snow?: boolean }) {
  return (
    <svg viewBox="0 0 100 160">
      <rect x="44" y="132" width="12" height="26" fill="#78350f" />
      <path d="M50 8l34 50H66l26 38H70l26 40H4l26-40H8l26-38H16z" fill="#166534" />
      {snow && (
        <path
          d="M50 8l12 18c-8 4-16 4-24 0zM34 58h32l8 12c-16 6-32 6-48 0zM30 96h40l10 14c-20 6-40 6-60 0z"
          fill="#f8fafc"
          opacity="0.9"
        />
      )}
      <circle cx="40" cy="80" r="3.5" fill="#ef4444" />
      <circle cx="62" cy="104" r="3.5" fill="#fbbf24" />
      <circle cx="46" cy="120" r="3.5" fill="#60a5fa" />
    </svg>
  );
}

export function Bulb({ color = '#fbbf24' }: { color?: string }) {
  return (
    <svg viewBox="0 0 20 34">
      <rect x="6" y="0" width="8" height="7" rx="1.5" fill="#475569" />
      <path d="M10 6c6 4 9 10 9 16a9 9 0 0 1-18 0c0-6 3-12 9-16z" fill={color} />
      <ellipse cx="7" cy="19" rx="2" ry="4" fill="#fff" opacity="0.5" />
    </svg>
  );
}

export function Firework({ color = '#f472b6', accent = '#fde68a' }: { color?: string; accent?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);
  return (
    <svg viewBox="-60 -60 120 120">
      {rays.map((angle, i) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <line x1="0" y1="-12" x2="0" y2="-48" stroke={i % 2 ? accent : color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="-54" r="3" fill={i % 2 ? color : accent} />
        </g>
      ))}
      <circle r="6" fill={accent} />
    </svg>
  );
}

export function Skyline({ fill = '#1e1b4b', windows = '#fde68a' }: { fill?: string; windows?: string }) {
  return (
    <svg viewBox="0 0 800 160" preserveAspectRatio="none">
      <path
        d="M0 160V96h40V70h30v26h24V50h44v46h20V80h36V30h12V14h8v16h12v66h28V64h46v32h22V44h40v52h26V76h36v20h30V36h50v60h24V60h40v36h30V84h40v-30h34v106z"
        fill={fill}
      />
      {[60, 112, 190, 206, 270, 318, 392, 450, 530, 600, 616, 700, 740].map((x, i) => (
        <rect key={x} x={x} y={70 + (i % 4) * 14} width="6" height="8" fill={windows} opacity={0.5 + (i % 3) * 0.2} />
      ))}
    </svg>
  );
}

export function MosqueSkyline({ fill = '#064e3b' }: { fill?: string }) {
  return (
    <svg viewBox="0 0 800 170" preserveAspectRatio="none">
      <path
        d="M0 170V120h60v-20c0-18 22-30 22-30s22 12 22 30v20h40V40l6-14 6 14v80h30V96c0-36 60-58 74-76 14 18 74 40 74 76v24h30V40l6-14 6 14v80h50v-16c0-14 16-24 16-24s16 10 16 24v16h70V50l6-12 6 12v70h40v-14c0-16 18-26 18-26s18 10 18 26v14h82v50z"
        fill={fill}
      />
    </svg>
  );
}

export function Pookalam() {
  const ring = (r: number, n: number, color: string, size: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      return (
        <ellipse
          key={`${r}-${i}`}
          cx={Math.cos(a) * r}
          cy={Math.sin(a) * r}
          rx={size}
          ry={size * 0.6}
          fill={color}
          transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * r} ${Math.sin(a) * r})`}
        />
      );
    });
  return (
    <svg viewBox="-100 -100 200 200">
      <circle r="98" fill="#facc15" />
      <circle r="84" fill="#f97316" />
      {ring(76, 28, '#dc2626', 8)}
      <circle r="62" fill="#fef3c7" />
      {ring(54, 20, '#a21caf', 7)}
      <circle r="42" fill="#16a34a" />
      {ring(34, 12, '#fde047', 8)}
      <circle r="22" fill="#dc2626" />
      <circle r="12" fill="#fff7ed" />
    </svg>
  );
}

export function Mandala({ a = '#db2777', b = '#f59e0b', c = '#7c3aed' }: { a?: string; b?: string; c?: string }) {
  const petals = (n: number, r: number, len: number, color: string) =>
    Array.from({ length: n }, (_, i) => (
      <path
        key={`${r}-${i}`}
        d={`M0 ${-r}c${len / 3} ${-len / 2} ${len / 3} ${-len} 0 ${-len * 1.2}c${-len / 3} ${len * 0.2} ${-len / 3} ${len * 0.7} 0 ${len * 1.2}z`}
        fill={color}
        transform={`rotate(${(i * 360) / n})`}
      />
    ));
  return (
    <svg viewBox="-100 -100 200 200">
      {petals(16, 52, 36, a)}
      {petals(12, 30, 26, b)}
      {petals(8, 12, 18, c)}
      <circle r="14" fill={b} />
      <circle r="6" fill="#fff" />
      {Array.from({ length: 24 }, (_, i) => {
        const ang = (i / 24) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(ang) * 94} cy={Math.sin(ang) * 94} r="3" fill={c} />;
      })}
    </svg>
  );
}

export function Balloon({ color = '#ec4899' }: { color?: string }) {
  return (
    <svg viewBox="0 0 60 120">
      <ellipse cx="30" cy="34" rx="26" ry="32" fill={color} />
      <ellipse cx="20" cy="22" rx="6" ry="10" fill="#fff" opacity="0.35" transform="rotate(-20 20 22)" />
      <path d="M26 66h8l-4 6z" fill={color} />
      <path d="M30 72c-6 12 6 20 0 30s6 14 0 18" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function Branch({
  blossom = '#f9a8d4',
  center = '#be185d',
  leaf,
}: {
  blossom?: string;
  center?: string;
  leaf?: boolean;
}) {
  const flowers = [
    [70, 40],
    [120, 70],
    [160, 52],
    [200, 96],
    [240, 80],
    [100, 110],
    [270, 120],
    [180, 130],
  ];
  return (
    <svg viewBox="0 0 320 200">
      <path
        d="M0 10c60 10 110 40 150 70s80 50 160 60"
        stroke="#5b3a29"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M90 46c10 30 0 60-10 70M190 90c20-20 40-30 70-30M150 80c10 20 30 40 40 54"
        stroke="#5b3a29"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      {flowers.map(([x, y], i) =>
        leaf ? (
          <path
            key={i}
            d={`M${x} ${y}l6-14 4 8 8-6-2 10 10 2-8 6 6 6-10 0-2 10-6-8-6 8-2-10-10 0 6-6-8-6 10-2-2-10 8 6z`}
            fill={i % 3 === 0 ? '#c2410c' : i % 3 === 1 ? '#d97706' : '#b91c1c'}
          />
        ) : (
          <g key={i} transform={`translate(${x} ${y})`}>
            {Array.from({ length: 5 }, (_, p) => (
              <ellipse key={p} cx="0" cy="-8" rx="6" ry="8" fill={blossom} transform={`rotate(${p * 72})`} />
            ))}
            <circle r="3.5" fill={center} />
          </g>
        )
      )}
    </svg>
  );
}

export function Cloud({ fill = '#94a3b8' }: { fill?: string }) {
  return (
    <svg viewBox="0 0 200 90">
      <path d="M30 86a28 28 0 0 1 0-56 40 40 0 0 1 76-14 34 34 0 0 1 58 20 26 26 0 0 1 6 50z" fill={fill} />
    </svg>
  );
}

export function PaperBoat({ fill = '#f8fafc' }: { fill?: string }) {
  return (
    <svg viewBox="0 0 100 60">
      <path d="M2 30h96L80 56H20z" fill={fill} />
      <path d="M30 30L50 2l20 28z" fill={fill} opacity="0.85" />
      <path d="M50 2v28" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  );
}

export function Sun({ fill = '#fbbf24' }: { fill?: string }) {
  return (
    <svg viewBox="-60 -60 120 120">
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d="M0-58l5 16H-5z" fill={fill} opacity="0.85" transform={`rotate(${i * 22.5})`} />
      ))}
      <circle r="34" fill={fill} />
      <circle r="26" fill="#fde68a" opacity="0.7" />
    </svg>
  );
}

export function PongalPot() {
  return (
    <svg viewBox="0 0 120 120">
      <path d="M22 44c-14 20-10 56 38 72 48-16 52-52 38-72z" fill="#b45309" />
      <path d="M30 70c20 10 40 10 60 0" stroke="#fde68a" strokeWidth="4" fill="none" />
      <path d="M36 82c16 8 32 8 48 0" stroke="#dc2626" strokeWidth="3" fill="none" />
      <rect x="24" y="36" width="72" height="10" rx="5" fill="#92400e" />
      <path d="M28 38c4-18 60-18 64 0-10-6-20 4-32-2s-22 6-32 2z" fill="#fefce8" />
      <path
        d="M8 40c6-10 4-24 10-30M112 40c-6-10-4-24-10-30"
        stroke="#65a30d"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Sugarcane() {
  return (
    <svg viewBox="0 0 30 200">
      <rect x="10" y="20" width="10" height="180" rx="5" fill="#7c2d12" />
      {[50, 90, 130, 170].map((y) => (
        <rect key={y} x="9" y={y} width="12" height="3" fill="#431407" />
      ))}
      <path
        d="M15 22C5 8-6 6-10 0M15 22C24 6 34 4 40 0M15 22c0-10 4-18 2-22"
        stroke="#4d7c0f"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Rakhi() {
  return (
    <svg viewBox="-60 -60 120 120">
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-34"
          rx="10"
          ry="18"
          fill={i % 2 ? '#f59e0b' : '#e11d74'}
          transform={`rotate(${i * 30})`}
        />
      ))}
      <circle r="24" fill="#fde047" />
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-13" rx="5" ry="9" fill="#dc2626" transform={`rotate(${i * 45})`} />
      ))}
      <circle r="7" fill="#16a34a" />
      <circle r="3" fill="#fff" />
    </svg>
  );
}

export function Marigold({ fill = '#f59e0b' }: { fill?: string }) {
  return (
    <svg viewBox="-20 -20 40 40">
      {Array.from({ length: 10 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-10" rx="5" ry="9" fill={fill} transform={`rotate(${i * 36})`} />
      ))}
      <circle r="7" fill="#ea580c" />
    </svg>
  );
}

export function Splash({ fill = '#ec4899' }: { fill?: string }) {
  return (
    <svg viewBox="0 0 200 200">
      <path
        d="M100 18c20 0 26 26 44 30s40-10 46 10-22 30-18 50 30 30 16 48-38 0-52 12-14 40-36 38-18-30-38-36-46 14-56-6 16-34 10-52S-6 78 10 64s40 6 54-6S80 18 100 18z"
        fill={fill}
      />
      <circle cx="174" cy="30" r="9" fill={fill} />
      <circle cx="20" cy="170" r="12" fill={fill} />
      <circle cx="186" cy="150" r="6" fill={fill} />
    </svg>
  );
}

export function FlameTongue({ hue = '#f97316' }: { hue?: string }) {
  return (
    <svg viewBox="0 0 60 120">
      <path d="M30 0c14 30 30 46 30 74a30 30 0 0 1-60 0C0 50 18 34 30 0z" fill={hue} />
      <path d="M30 40c8 16 16 26 16 40a16 16 0 0 1-32 0c0-14 8-22 16-40z" fill="#fbbf24" opacity="0.9" />
    </svg>
  );
}

export function Coin() {
  return (
    <svg viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="19" fill="#f4b400" />
      <circle cx="20" cy="20" r="14" fill="none" stroke="#b45309" strokeWidth="2" />
      <rect x="15" y="15" width="10" height="10" fill="#b45309" />
    </svg>
  );
}

export function Band({ a = '#2563eb', b = '#f59e0b', c = '#10b981' }: { a?: string; b?: string; c?: string }) {
  return (
    <svg viewBox="-50 -50 100 100">
      <circle r="38" fill="none" stroke={a} strokeWidth="10" />
      <circle r="38" fill="none" stroke={b} strokeWidth="10" strokeDasharray="14 22" />
      <circle r="38" fill="none" stroke={c} strokeWidth="10" strokeDasharray="6 30" strokeDashoffset="18" />
      <circle cx="0" cy="-38" r="9" fill="#ec4899" />
    </svg>
  );
}

export function Web() {
  return (
    <svg viewBox="0 0 160 160">
      <g stroke="#cbd5e1" strokeWidth="1.5" fill="none" opacity="0.8">
        <path d="M0 0L160 160M0 0L160 60M0 0L60 160M0 0L160 110M0 0L110 160" />
        {[30, 60, 95, 130].map((r) => (
          <path key={r} d={`M${r} 0Q${r * 0.55} ${r * 0.2} ${r * 0.72} ${r * 0.72}Q${r * 0.2} ${r * 0.55} 0 ${r}`} />
        ))}
      </g>
    </svg>
  );
}

export function Spider() {
  return (
    <svg viewBox="0 0 40 60">
      <path d="M20 0v26" stroke="#94a3b8" strokeWidth="1" />
      <ellipse cx="20" cy="36" rx="9" ry="11" fill="#1f1631" />
      <path
        d="M12 32L0 24M12 38L0 40M12 44L2 54M28 32l12-8M28 38l12 2M28 44l10 10"
        stroke="#1f1631"
        strokeWidth="2.5"
      />
      <circle cx="17" cy="34" r="2" fill="#f97316" />
      <circle cx="23" cy="34" r="2" fill="#f97316" />
    </svg>
  );
}
