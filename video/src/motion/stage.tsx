import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT, MONO } from '../ui/theme';
import { ease } from './geom';

export interface Caption {
  from: number;
  to: number;
  text: React.ReactNode;
}

interface StageProps {
  chapter: string;
  title: string;
  duration: number;
  captions: Caption[];
  children: React.ReactNode;
}

// Scène vectorielle plein cadre : fond à grille, repère de chapitre, légende qui change par phase.
export const Stage: React.FC<StageProps> = ({ chapter, title, duration, captions, children }) => {
  const frame = useCurrentFrame();
  const alpha = Math.min(ease(frame, 0, 15), 1 - ease(frame, duration - 15, 15));
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `radial-gradient(circle at 50% 45%, rgba(79, 209, 197, 0.06), transparent 60%), linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        fontFamily: FONT,
        color: C.ink,
        fontVariantLigatures: 'none',
        opacity: alpha,
      }}
    >
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        {children}
      </svg>
      <div style={{ position: 'absolute', top: 48, left: 72, display: 'flex', gap: 20, alignItems: 'baseline' }}>
        <span style={{ fontFamily: MONO, fontSize: 24, color: C.cyan, letterSpacing: 2 }}>{chapter}</span>
        <span style={{ fontSize: 30, fontWeight: 600, color: C.muted }}>{title}</span>
      </div>
      {captions.map((c, i) => {
        const a = Math.min(ease(frame, c.from, 12), 1 - ease(frame, c.to - 12, 12));
        if (a <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 100,
              left: 72,
              width: 900,
              fontSize: 40,
              lineHeight: 1.3,
              opacity: a,
              transform: `translateY(${(1 - a) * 14}px)`,
            }}
          >
            {c.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const mono = (s: string, color: string = C.cyan): React.ReactNode => (
  <span style={{ fontFamily: MONO, color }}>{s}</span>
);
