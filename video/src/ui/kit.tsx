import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, MONO } from './theme';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Progression 0 → 1 entre deux frames.
export const ramp = (frame: number, start: number, duration = 15): number =>
  interpolate(frame, [start, start + duration], [0, 1], CLAMP);

// Entrée « ressort » sans rebond, décalée de `delay` frames.
export const useAppear = (delay: number): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200 } });
};

interface RevealProps {
  delay: number;
  children: React.ReactNode;
  distance?: number;
  style?: React.CSSProperties;
}

// Apparition en fondu + glissement vers le haut.
export const Reveal: React.FC<RevealProps> = ({ delay, children, distance = 24, style }) => {
  const p = useAppear(delay);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * distance}px)`, ...style }}>
      {children}
    </div>
  );
};

interface SceneFrameProps {
  chapter: string;
  title: string;
  duration: number;
  source?: string;
  children: React.ReactNode;
}

// Cadre commun à chaque chapitre : grille, en-tête, source du code, fondus d'entrée et de sortie.
export const SceneFrame: React.FC<SceneFrameProps> = ({ chapter, title, duration, source, children }) => {
  const frame = useCurrentFrame();
  const fadeIn = ramp(frame, 0, 12);
  const fadeOut = 1 - ramp(frame, duration - 12, 12);
  const underline = ramp(frame, 6, 24);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        fontFamily: FONT,
        color: C.ink,
        fontVariantLigatures: 'none',
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      <div style={{ position: 'absolute', top: 56, left: 96, right: 96 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
          <span style={{ fontFamily: MONO, fontSize: 28, color: C.cyan, letterSpacing: 2 }}>{chapter}</span>
          <span style={{ fontSize: 48, fontWeight: 600 }}>{title}</span>
        </div>
        <div style={{ marginTop: 16, height: 2, width: 1728 * underline, backgroundColor: C.panelEdge }} />
      </div>
      <div style={{ position: 'absolute', top: 184, left: 96, right: 96, bottom: 96 }}>{children}</div>
      {source ? (
        <div style={{ position: 'absolute', bottom: 40, left: 96, fontFamily: MONO, fontSize: 20, color: C.dim }}>
          source · {source}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

interface PanelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}

export const Panel: React.FC<PanelProps> = ({ children, style, accent }) => (
  <div
    style={{
      backgroundColor: C.panel,
      border: `2px solid ${accent ?? C.panelEdge}`,
      borderRadius: 16,
      padding: 32,
      ...style,
    }}
  >
    {children}
  </div>
);

// Coloration syntaxique minimale : chaînes, variables, mots-clés, commentaires.
const KEYWORDS = new Set([
  'function', 'if', 'else', 'for', 'foreach', 'return', 'new', 'class', 'extends', 'public', 'protected',
  'private', 'static', 'define', 'die', 'break', 'use', 'trait', 'null', 'self', 'parent', 'print',
]);

const TOKEN = /("[^"]*"|\$[A-Za-z_]\w*|\/\/.*$|\b[A-Za-z_]\w*\b)/g;

const colorize = (line: string): React.ReactNode[] => {
  const parts = line.split(TOKEN);
  return parts.map((part, i) => {
    let color: string = C.ink;
    if (part.startsWith('"')) color = C.amber;
    else if (part.startsWith('$')) color = C.violet;
    else if (part.startsWith('//')) color = C.dim;
    else if (KEYWORDS.has(part)) color = C.cyan;
    return (
      <span key={i} style={{ color }}>
        {part}
      </span>
    );
  });
};

interface CodeBlockProps {
  lines: string[];
  active?: number[];
  delay?: number;
  fontSize?: number;
  plain?: boolean;
  style?: React.CSSProperties;
}

// Bloc de code révélé ligne par ligne ; les lignes `active` sont surlignées, les autres atténuées.
export const CodeBlock: React.FC<CodeBlockProps> = ({ lines, active, delay = 0, fontSize = 24, plain = false, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize,
        lineHeight: 1.5,
        backgroundColor: '#0A1422',
        border: `2px solid ${C.panelEdge}`,
        borderRadius: 12,
        padding: '20px 24px',
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {lines.map((line, i) => {
        const shown = ramp(frame, delay + i * 3, 8);
        const isActive = active === undefined || active.includes(i);
        return (
          <div
            key={i}
            style={{
              opacity: shown * (isActive ? 1 : 0.35),
              backgroundColor: active !== undefined && isActive ? 'rgba(79, 209, 197, 0.10)' : 'transparent',
              borderLeft: `4px solid ${active !== undefined && isActive ? C.cyan : 'transparent'}`,
              paddingLeft: 12,
            }}
          >
            {plain ? line : colorize(line)}
            {line === '' ? ' ' : null}
          </div>
        );
      })}
    </div>
  );
};

interface TagProps {
  children: React.ReactNode;
  color: string;
}

export const Tag: React.FC<TagProps> = ({ children, color }) => (
  <span
    style={{
      display: 'inline-block',
      fontFamily: MONO,
      fontSize: 22,
      color,
      border: `2px solid ${color}`,
      borderRadius: 8,
      padding: '4px 12px',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);
