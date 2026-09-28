// Géométrie vectorielle pour les morphings : chaque forme est un polygone fermé
// ré-échantillonné sur le même nombre de points, en partant du sommet haut et en
// tournant dans le sens horaire. Deux formes compatibles s'interpolent point à point.

import { Easing, interpolate } from 'remotion';

export type Pt = [number, number];

export const N_POINTS = 72;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Progression 0 → 1 lissée entre deux frames.
export const ease = (frame: number, start: number, duration: number): number =>
  interpolate(frame, [start, start + duration], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const lerpPt = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

// Ré-échantillonne un polygone fermé en `n` points équidistants le long du périmètre.
export const resample = (poly: Pt[], n: number = N_POINTS): Pt[] => {
  const closed = [...poly, poly[0]];
  const seg: number[] = [];
  let total = 0;
  for (let i = 0; i < closed.length - 1; i++) {
    const d = Math.hypot(closed[i + 1][0] - closed[i][0], closed[i + 1][1] - closed[i][1]);
    seg.push(d);
    total += d;
  }
  const out: Pt[] = [];
  let i = 0;
  let acc = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / n) * total;
    while (i < seg.length - 1 && acc + seg[i] < target) {
      acc += seg[i];
      i++;
    }
    const t = seg[i] === 0 ? 0 : (target - acc) / seg[i];
    out.push(lerpPt(closed[i], closed[i + 1], t));
  }
  return out;
};

export const circle = (r: number): Pt[] =>
  Array.from({ length: N_POINTS }, (_, i) => {
    const a = -Math.PI / 2 + (i / N_POINTS) * Math.PI * 2;
    return [r * Math.cos(a), r * Math.sin(a)] as Pt;
  });

export const polygon = (sides: number, r: number): Pt[] =>
  resample(
    Array.from({ length: sides }, (_, i) => {
      const a = -Math.PI / 2 + (i / sides) * Math.PI * 2;
      return [r * Math.cos(a), r * Math.sin(a)] as Pt;
    }),
  );

// Rectangle aux extrémités arrondies (« capsule »), démarré au milieu du bord haut.
export const capsule = (w: number, h: number): Pt[] => {
  const r = h / 2;
  const half = w / 2 - r;
  const pts: Pt[] = [[0, -r], [half, -r]];
  for (let k = 1; k < 16; k++) {
    const a = -Math.PI / 2 + (k / 16) * Math.PI;
    pts.push([half + r * Math.cos(a), r * Math.sin(a)]);
  }
  pts.push([half, r], [-half, r]);
  for (let k = 1; k < 16; k++) {
    const a = Math.PI / 2 + (k / 16) * Math.PI;
    pts.push([-half + r * Math.cos(a), r * Math.sin(a)]);
  }
  pts.push([-half, -r]);
  return resample(pts);
};

export const morph = (a: Pt[], b: Pt[], t: number): Pt[] => a.map((p, i) => lerpPt(p, b[i], t));

export const toPath = (pts: Pt[], cx = 0, cy = 0): string =>
  'M' + pts.map(([x, y]) => `${(x + cx).toFixed(2)},${(y + cy).toFixed(2)}`).join('L') + 'Z';

// Courbe de Bézier cubique.
export type Cubic = [Pt, Pt, Pt, Pt];

export const bezier = ([p0, p1, p2, p3]: Cubic, t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};

export const cubicPath = ([p0, p1, p2, p3]: Cubic): string =>
  `M${p0[0]},${p0[1]} C${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`;

export const cubicLength = (c: Cubic): number => {
  let len = 0;
  let prev = c[0];
  for (let k = 1; k <= 40; k++) {
    const p = bezier(c, k / 40);
    len += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    prev = p;
  }
  return len;
};

// Courbe « verticale » entre deux centres : départ et arrivée tangents à l'axe vertical.
export const verticalCurve = (from: Pt, to: Pt): Cubic => {
  const dy = to[1] - from[1];
  return [from, [from[0], from[1] + dy * 0.55], [to[0], to[1] - dy * 0.55], to];
};

// Croix et coche partagent la même structure (M L M L) : leurs coordonnées s'interpolent.
const CROSS: Pt[] = [[-16, -16], [16, 16], [16, -16], [-16, 16]];
const CHECK: Pt[] = [[-20, 2], [-6, 16], [-6, 16], [22, -18]];

export const markPath = (t: number, cx: number, cy: number): string => {
  const p = CROSS.map((c, i) => lerpPt(c, CHECK[i], t));
  return `M${p[0][0] + cx},${p[0][1] + cy} L${p[1][0] + cx},${p[1][1] + cy} M${p[2][0] + cx},${p[2][1] + cy} L${p[3][0] + cx},${p[3][1] + cy}`;
};
