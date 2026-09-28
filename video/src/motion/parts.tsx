import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, MONO } from '../ui/theme';
import { Pt, bezier, capsule, ease, lerp, lerpPt, markPath, morph, roundedRect, toPath } from './geom';

// Largeur d'un caractère Consolas, en fraction de la taille de police.
export const CHAR = 0.55;

// Impulsion 1 → 0 qui démarre à `start` : « bosse » pour les pulsations.
export const bump = (frame: number, start: number, duration = 20): number =>
  frame < start ? 0 : 1 - ease(frame, start, duration);

// ─── Coloration syntaxique en SVG ──────────────────────────────────────────────

const KEYWORDS = new Set([
  'function', 'if', 'else', 'for', 'foreach', 'return', 'new', 'class', 'extends', 'public', 'protected',
  'private', 'static', 'as', 'null', 'self', 'print',
]);
const TOKEN = /("[^"]*"|\$[A-Za-z_]\w*|\/\/.*$|\b[A-Za-z_]\w*\b)/g;

const tokenColor = (part: string): string => {
  if (part.startsWith('"')) return C.amber;
  if (part.startsWith('$')) return C.violet;
  if (part.startsWith('//')) return C.dim;
  if (KEYWORDS.has(part)) return C.cyan;
  return C.ink;
};

export const CodeLine: React.FC<{ text: string; x: number; y: number; size: number; opacity: number }> = ({
  text,
  x,
  y,
  size,
  opacity,
}) => (
  <text x={x} y={y} fontFamily="Consolas, monospace" fontSize={size} opacity={opacity} xmlSpace="preserve">
    {text.split(TOKEN).map((part, i) => (
      <tspan key={i} fill={tokenColor(part)}>
        {part}
      </tspan>
    ))}
  </text>
);

// ─── Motif « Code → Nœud » ─────────────────────────────────────────────────────

export interface CodeNodeCfg {
  lines: string[];
  title: string;
  note: string;
  codeAt: Pt; // où le code est montré (lisible)
  nodeAt: Pt; // où le nœud s'installe dans le système
  tShow: number;
  tMorph: number;
  tMove: number;
  accent: string;
  fontSize?: number;
}

const LINE_H = 1.5;

const dims = (cfg: CodeNodeCfg) => {
  const size = cfg.fontSize ?? 24;
  const longest = Math.max(...cfg.lines.map((l) => l.length));
  const w = longest * size * CHAR + 72;
  const h = cfg.lines.length * size * LINE_H + 64;
  const nodeW = cfg.title.length * 28 * CHAR + 72;
  const nodeH = 76;
  return { size, w, h, nodeW, nodeH };
};

export const codeNodePos = (frame: number, cfg: CodeNodeCfg): Pt =>
  lerpPt(cfg.codeAt, cfg.nodeAt, ease(frame, cfg.tMove, 32));

// Bords du nœud installé, pour y accrocher des liens.
export const codeNodeSize = (cfg: CodeNodeCfg): { w: number; h: number } => {
  const d = dims(cfg);
  return { w: d.nodeW, h: d.nodeH };
};

export const CodeNode: React.FC<{ cfg: CodeNodeCfg; pulse?: number; stroke?: string }> = ({ cfg, pulse = 0, stroke }) => {
  const frame = useCurrentFrame();
  const { size, w, h, nodeW, nodeH } = dims(cfg);
  const drawn = ease(frame, cfg.tShow, 24);
  const m = ease(frame, cfg.tMorph, 32);
  const shape = morph(roundedRect(w, h, 18), roundedRect(nodeW, nodeH, nodeH / 2), m);
  const [x, y] = codeNodePos(frame, cfg);
  const perimeter = 2 * (w + h);
  const color = stroke ?? cfg.accent;
  const textAlpha = 1 - Math.min(1, m * 1.8);

  return (
    <g transform={`translate(${x} ${y}) scale(${1 + 0.14 * pulse})`}>
      <path
        d={toPath(shape)}
        fill="rgba(10, 20, 34, 0.94)"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={m > 0 ? undefined : perimeter}
        strokeDashoffset={m > 0 ? undefined : perimeter * (1 - drawn)}
        style={{ filter: `drop-shadow(0 0 ${6 + 18 * pulse}px ${color})` }}
      />
      {textAlpha > 0
        ? cfg.lines.map((line, i) => {
            const y0 = -h / 2 + 32 + size + i * size * LINE_H;
            return (
              <g key={i} transform={`translate(0 ${y0 * (1 - m)}) scale(1 ${1 - m})`}>
                <CodeLine
                  text={line}
                  x={-w / 2 + 36}
                  y={0}
                  size={size}
                  opacity={ease(frame, cfg.tShow + 10 + i * 3, 10) * textAlpha}
                />
              </g>
            );
          })
        : null}
      <text
        y={h / 2 + 40}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={20}
        fill={C.dim}
        opacity={drawn * textAlpha}
      >
        {cfg.note}
      </text>
      <text
        y={10}
        textAnchor="middle"
        fontFamily="Consolas, monospace"
        fontSize={28}
        fontWeight={700}
        fill={color}
        opacity={ease(frame, cfg.tMorph + 18, 14)}
      >
        {cfg.title}
      </text>
    </g>
  );
};

// ─── Pièces réutilisables ──────────────────────────────────────────────────────

// Nœud « pilule » avec titre, qui éclot en ressort.
export const Pill: React.FC<{ at: Pt; title: string; appear: number; color: string; pulse?: number; sub?: string }> = ({
  at,
  title,
  appear,
  color,
  pulse = 0,
  sub,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - appear, fps, config: { damping: 12 } });
  const w = title.length * 26 * CHAR + 60;
  return (
    <g transform={`translate(${at[0]} ${at[1]}) scale(${pop * (1 + 0.14 * pulse)})`}>
      <path
        d={toPath(roundedRect(w, 64, 32))}
        fill={C.panel}
        stroke={color}
        strokeWidth={3}
        style={{ filter: `drop-shadow(0 0 ${4 + 16 * pulse}px ${color})` }}
      />
      <text y={9} textAnchor="middle" fontFamily="Consolas, monospace" fontSize={26} fill={color}>
        {title}
      </text>
      {sub ? (
        <text y={62} textAnchor="middle" fontFamily={MONO} fontSize={19} fill={C.muted}>
          {sub}
        </text>
      ) : null}
    </g>
  );
};

// Étiquette de texte qui vole en arc d'un point à un autre.
export const FlyChip: React.FC<{
  text: string;
  from: Pt;
  to: Pt;
  start: number;
  duration?: number;
  color: string;
  lift?: number;
  hold?: number;
}> = ({ text, from, to, start, duration = 28, color, lift = 140, hold = 0 }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > start + duration + hold) return null;
  const t = ease(frame, start, duration);
  const mid: Pt = [(from[0] + to[0]) / 2, Math.min(from[1], to[1]) - lift];
  const pos = bezier([from, lerpPt(from, mid, 0.8), lerpPt(to, mid, 0.8), to], t);
  const w = text.length * 22 * CHAR + 32;
  return (
    <g transform={`translate(${pos[0]} ${pos[1]})`}>
      <path d={toPath(capsule(w, 40))} fill={C.bg} stroke={color} strokeWidth={2} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
      <text y={7} textAnchor="middle" fontFamily="Consolas, monospace" fontSize={22} fill={color}>
        {text}
      </text>
    </g>
  );
};

// Particule qui file le long d'une ligne (appel, retour de valeur).
export const Spark: React.FC<{ from: Pt; to: Pt; start: number; duration?: number; color: string }> = ({
  from,
  to,
  start,
  duration = 22,
  color,
}) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > start + duration) return null;
  return (
    <>
      {Array.from({ length: 6 }, (_, k) => {
        const t = ease(frame - k * 1.5, start, duration);
        const p = lerpPt(from, to, t);
        return <circle key={k} cx={p[0]} cy={p[1]} r={9 - k} fill={color} opacity={(1 - k / 6) * (t < 1 ? 1 : 0)} />;
      })}
    </>
  );
};

export const Ripple: React.FC<{ at: Pt; start: number; color: string; from?: number; to?: number }> = ({
  at,
  start,
  color,
  from = 30,
  to = 120,
}) => {
  const frame = useCurrentFrame();
  const t = ease(frame, start, 26);
  if (t <= 0 || t >= 1) return null;
  return <circle cx={at[0]} cy={at[1]} r={lerp(from, to, t)} fill="none" stroke={color} strokeWidth={3} opacity={1 - t} />;
};

// Marque ✗ qui peut basculer en ✓ (t = 0 → croix, 1 → coche).
export const Mark: React.FC<{ at: Pt; appear: number; toCheck?: number; vanish?: number }> = ({ at, appear, toCheck, vanish }) => {
  const frame = useCurrentFrame();
  const t = toCheck === undefined ? 0 : ease(frame, toCheck, 14);
  const a = ease(frame, appear, 10) * (vanish === undefined ? 1 : 1 - ease(frame, vanish, 12));
  if (a <= 0) return null;
  return (
    <path
      d={markPath(t, at[0], at[1])}
      stroke={t > 0.5 ? C.green : C.red}
      strokeWidth={6}
      strokeLinecap="round"
      fill="none"
      opacity={a}
    />
  );
};

// Lien en pointillés qui se dessine puis « coule ».
export const Wire: React.FC<{ from: Pt; to: Pt; start: number; color: string; dashed?: boolean; opacity?: number }> = ({
  from,
  to,
  start,
  color,
  dashed = true,
  opacity = 0.7,
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, start, 20);
  if (p <= 0) return null;
  const tip = lerpPt(from, to, p);
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={tip[0]}
      y2={tip[1]}
      stroke={color}
      strokeWidth={3}
      strokeDasharray={dashed ? '10 10' : undefined}
      strokeDashoffset={dashed ? -frame * 1.2 : undefined}
      opacity={opacity}
    />
  );
};
