/**
 * Particle Shape Drawing Functions
 * Canvas-based drawing utilities for seasonal theme particles
 */

// --- Basic Shapes ---

export const drawHeart = (ctx: CanvasRenderingContext2D, size: number): void => {
  const width = size;
  const height = size;
  ctx.beginPath();
  const topCurveHeight = height * 0.3;
  ctx.moveTo(0, topCurveHeight);
  ctx.bezierCurveTo(0, 0, -width / 2, 0, -width / 2, topCurveHeight);
  ctx.bezierCurveTo(-width / 2, (height + topCurveHeight) / 2, 0, (height + topCurveHeight) / 2, 0, height);
  ctx.bezierCurveTo(
    0,
    (height + topCurveHeight) / 2,
    width / 2,
    (height + topCurveHeight) / 2,
    width / 2,
    topCurveHeight
  );
  ctx.bezierCurveTo(width / 2, 0, 0, 0, 0, topCurveHeight);
  ctx.fill();
};

export const drawStar = (ctx: CanvasRenderingContext2D, size: number, points = 5): void => {
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.4;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
};

export const drawCircle = (ctx: CanvasRenderingContext2D, size: number): void => {
  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.fill();
};

export const drawFlame = (ctx: CanvasRenderingContext2D, size: number): void => {
  const w = size;
  const h = size * 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.quadraticCurveTo(w / 2, 0, w / 3, h / 2);
  ctx.quadraticCurveTo(0, h * 0.3, -w / 3, h / 2);
  ctx.quadraticCurveTo(-w / 2, 0, 0, -h / 2);
  ctx.fill();
};

// --- Christmas Shapes ---

export const drawSnowflake = (ctx: CanvasRenderingContext2D, size: number): void => {
  const radius = size / 2;
  ctx.lineWidth = Math.max(1, size / 10);

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Sub-branches
    const branchLength = radius * 0.3;
    const branchPoint = 0.7;
    const branchAngle1 = angle + Math.PI / 6;
    const branchAngle2 = angle - Math.PI / 6;

    ctx.beginPath();
    ctx.moveTo(x * branchPoint, y * branchPoint);
    ctx.lineTo(
      x * branchPoint + Math.cos(branchAngle1) * branchLength,
      y * branchPoint + Math.sin(branchAngle1) * branchLength
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x * branchPoint, y * branchPoint);
    ctx.lineTo(
      x * branchPoint + Math.cos(branchAngle2) * branchLength,
      y * branchPoint + Math.sin(branchAngle2) * branchLength
    );
    ctx.stroke();
  }
};

// --- Halloween Shapes ---

export const drawPumpkin = (ctx: CanvasRenderingContext2D, size: number): void => {
  const width = size;
  const height = size;
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  const ridgeColor = ctx.fillStyle;
  ctx.strokeStyle = typeof ridgeColor === 'string' ? ridgeColor : '#ff6600';
  ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo((i * width) / 6, -height / 2);
    ctx.lineTo((i * width) / 6, height / 2);
    ctx.stroke();
  }
};

export const drawBat = (ctx: CanvasRenderingContext2D, size: number): void => {
  const width = size;
  const height = size * 0.6;

  // Body
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 8, height / 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Left wing
  ctx.beginPath();
  ctx.moveTo(-width / 8, 0);
  ctx.quadraticCurveTo(-width / 3, -height / 3, -width / 2, 0);
  ctx.quadraticCurveTo(-width / 3, height / 4, -width / 8, 0);
  ctx.fill();

  // Right wing
  ctx.beginPath();
  ctx.moveTo(width / 8, 0);
  ctx.quadraticCurveTo(width / 3, -height / 3, width / 2, 0);
  ctx.quadraticCurveTo(width / 3, height / 4, width / 8, 0);
  ctx.fill();
};

// --- New Year Shapes ---

export const drawFirework = (ctx: CanvasRenderingContext2D, size: number): void => {
  const rays = 8;
  const outerRadius = size / 2;
  const innerRadius = size / 6;
  ctx.lineWidth = Math.max(1, size / 12);

  for (let i = 0; i < rays; i++) {
    const angle = (i * Math.PI * 2) / rays;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
    ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius, size / 10, 0, Math.PI * 2);
    ctx.fill();
  }
};

export const drawConfetti = (ctx: CanvasRenderingContext2D, size: number): void => {
  const w = size * 0.4;
  const h = size;
  ctx.fillRect(-w / 2, -h / 2, w, h);
};

export const drawChampagne = (ctx: CanvasRenderingContext2D, size: number): void => {
  ctx.beginPath();
  ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(-size / 8, -size / 8, size / 8, 0, Math.PI * 2);
  ctx.fill();
};

// --- Diwali Shapes ---

export const drawDiya = (ctx: CanvasRenderingContext2D, size: number): void => {
  const w = size;
  const h = size * 0.6;

  // Oil lamp base
  ctx.beginPath();
  ctx.ellipse(0, h / 4, w / 2, h / 4, 0, 0, Math.PI);
  ctx.fill();

  // Flame
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.quadraticCurveTo(w / 4, -h / 4, w / 6, 0);
  ctx.quadraticCurveTo(0, -h / 6, -w / 6, 0);
  ctx.quadraticCurveTo(-w / 4, -h / 4, 0, -h / 2);
  ctx.fill();
};

export const drawRangoli = (ctx: CanvasRenderingContext2D, size: number): void => {
  const radius = size / 2;
  const petals = 6;

  ctx.beginPath();
  ctx.arc(0, 0, radius / 4, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(radius / 2, 0, radius / 3, radius / 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

export const drawSparkler = (ctx: CanvasRenderingContext2D, size: number): void => {
  const rays = 12;
  const radius = size / 2;
  ctx.lineWidth = Math.max(1, size / 15);

  for (let i = 0; i < rays; i++) {
    const angle = (i * Math.PI * 2) / rays;
    const length = i % 2 === 0 ? radius : radius * 0.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
    ctx.stroke();
  }
};

// --- Holi Shapes ---

export const drawColorSplash = (ctx: CanvasRenderingContext2D, size: number): void => {
  const points = 8;
  ctx.beginPath();
  for (let i = 0; i < points; i++) {
    const angle = (i * Math.PI * 2) / points;
    const variance = 0.6 + Math.random() * 0.4;
    const r = (size / 2) * variance;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else
      ctx.quadraticCurveTo(
        Math.cos(angle - Math.PI / points) * (size / 2) * 1.1,
        Math.sin(angle - Math.PI / points) * (size / 2) * 1.1,
        x,
        y
      );
  }
  ctx.closePath();
  ctx.fill();
};

export const drawGulal = (ctx: CanvasRenderingContext2D, size: number): void => {
  const circles = 4;
  for (let i = 0; i < circles; i++) {
    const offsetX = (Math.random() - 0.5) * size * 0.3;
    const offsetY = (Math.random() - 0.5) * size * 0.3;
    const r = (size / 4) * (0.6 + Math.random() * 0.4);
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, r, 0, Math.PI * 2);
    ctx.fill();
  }
};

export const drawWaterBalloon = (ctx: CanvasRenderingContext2D, size: number): void => {
  const w = size * 0.8;
  const h = size;

  ctx.beginPath();
  ctx.ellipse(0, size / 6, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Balloon knot
  ctx.beginPath();
  ctx.moveTo(-w / 8, -h / 2 + size / 6);
  ctx.lineTo(0, -h / 2 - size / 10 + size / 6);
  ctx.lineTo(w / 8, -h / 2 + size / 6);
  ctx.fill();
};

// --- Onam Shapes ---

export const drawFlower = (ctx: CanvasRenderingContext2D, size: number): void => {
  const petals = 5;
  const radius = size / 2;

  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals - Math.PI / 2;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -radius / 2, radius / 4, radius / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Center
  ctx.beginPath();
  ctx.arc(0, 0, radius / 4, 0, Math.PI * 2);
  ctx.fill();
};

export const drawBanana = (ctx: CanvasRenderingContext2D, size: number): void => {
  const w = size;
  const h = size * 0.4;

  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.quadraticCurveTo(-w / 4, -h, w / 4, -h / 2);
  ctx.quadraticCurveTo(w / 2, 0, w / 4, h / 2);
  ctx.quadraticCurveTo(-w / 4, h / 2, -w / 2, 0);
  ctx.fill();
};

export const drawUmbrella = (ctx: CanvasRenderingContext2D, size: number): void => {
  const radius = size / 2;

  ctx.beginPath();
  ctx.arc(0, 0, radius, Math.PI, 0);
  ctx.fill();

  ctx.lineWidth = size / 12;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, radius * 0.8);
  ctx.quadraticCurveTo(0, radius, -radius / 4, radius);
  ctx.stroke();
};

// --- Pongal Shapes ---

export const drawSugarcane = (ctx: CanvasRenderingContext2D, size: number): void => {
  const w = size / 4;
  const h = size;
  const segments = 4;

  for (let i = 0; i < segments; i++) {
    const y = -h / 2 + (i * h) / segments;
    ctx.fillRect(-w / 2, y, w, h / segments - 2);
  }

  // Leaves
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.quadraticCurveTo(w, -h / 2 - size / 4, w / 2, -h / 2 - size / 3);
  ctx.quadraticCurveTo(-w / 2, -h / 2 - size / 4, 0, -h / 2);
  ctx.fill();
};

export const drawPot = (ctx: CanvasRenderingContext2D, size: number): void => {
  const w = size;
  const h = size * 0.8;

  ctx.beginPath();
  ctx.moveTo(-w / 3, -h / 3);
  ctx.quadraticCurveTo(-w / 2, 0, -w / 3, h / 3);
  ctx.lineTo(w / 3, h / 3);
  ctx.quadraticCurveTo(w / 2, 0, w / 3, -h / 3);
  ctx.closePath();
  ctx.fill();

  // Rim
  ctx.beginPath();
  ctx.ellipse(0, -h / 3, w / 3, h / 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Overflowing
  ctx.beginPath();
  ctx.arc(0, -h / 3 - h / 10, w / 5, 0, Math.PI * 2);
  ctx.fill();
};

export const drawKolam = (ctx: CanvasRenderingContext2D, size: number): void => {
  const radius = size / 2;
  ctx.lineWidth = Math.max(1, size / 10);

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
  ctx.stroke();

  const dots = 4;
  for (let i = 0; i < dots; i++) {
    const angle = (i * Math.PI * 2) / dots;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * radius * 0.8, Math.sin(angle) * radius * 0.8, size / 10, 0, Math.PI * 2);
    ctx.fill();
  }
};

// --- Emoji Drawing ---

export const drawEmoji = (ctx: CanvasRenderingContext2D, size: number, emoji: string): void => {
  ctx.font = `${size}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 0, 0);
};

// --- Shape Renderer ---

import { ParticleShape } from '@/themes/seasonal/types';

export const drawParticleShape = (
  ctx: CanvasRenderingContext2D,
  shape: ParticleShape,
  size: number,
  emoji?: string
): void => {
  switch (shape) {
    case 'heart':
      drawHeart(ctx, size);
      break;
    case 'star':
      drawStar(ctx, size, 5);
      break;
    case 'snowflake':
      drawSnowflake(ctx, size);
      break;
    case 'pumpkin':
      drawPumpkin(ctx, size);
      break;
    case 'bat':
      drawBat(ctx, size);
      break;
    case 'flame':
      drawFlame(ctx, size);
      break;
    case 'firework':
      drawFirework(ctx, size);
      break;
    case 'confetti':
      drawConfetti(ctx, size);
      break;
    case 'champagne':
      drawChampagne(ctx, size);
      break;
    case 'diya':
      drawDiya(ctx, size);
      break;
    case 'rangoli':
      drawRangoli(ctx, size);
      break;
    case 'sparkler':
      drawSparkler(ctx, size);
      break;
    case 'colorSplash':
      drawColorSplash(ctx, size);
      break;
    case 'gulal':
      drawGulal(ctx, size);
      break;
    case 'waterBalloon':
      drawWaterBalloon(ctx, size);
      break;
    case 'flower':
      drawFlower(ctx, size);
      break;
    case 'banana':
      drawBanana(ctx, size);
      break;
    case 'umbrella':
      drawUmbrella(ctx, size);
      break;
    case 'sugarcane':
      drawSugarcane(ctx, size);
      break;
    case 'pot':
      drawPot(ctx, size);
      break;
    case 'kolam':
      drawKolam(ctx, size);
      break;
    case 'emoji':
      if (emoji) drawEmoji(ctx, size, emoji);
      break;
    case 'circle':
    default:
      drawCircle(ctx, size);
  }
};
