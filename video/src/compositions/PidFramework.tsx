import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { C } from '../ui/theme';
import { Bootstrap, Config, Intro, PathTo, Problem } from '../scenes/Foundations';
import { Autoloader, Bridge, Escape, Page, Recap, Singleton } from '../scenes/Runtime';

// Durée de chaque chapitre, en frames (30 fps).
const SCENES: { id: string; duration: number; Component: React.FC<{ duration: number }> }[] = [
  { id: 'intro', duration: 150, Component: Intro },
  { id: 'probleme', duration: 240, Component: Problem },
  { id: 'bootstrap', duration: 330, Component: Bootstrap },
  { id: 'config', duration: 250, Component: Config },
  { id: 'pathto', duration: 230, Component: PathTo },
  { id: 'autoloader', duration: 400, Component: Autoloader },
  { id: 'singleton', duration: 330, Component: Singleton },
  { id: 'page', duration: 390, Component: Page },
  { id: 'escape', duration: 270, Component: Escape },
  { id: 'bridge', duration: 270, Component: Bridge },
  { id: 'recap', duration: 210, Component: Recap },
];

export const PID_TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.duration, 0);

export const PidFramework: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Series>
      {SCENES.map(({ id, duration, Component }) => (
        <Series.Sequence key={id} durationInFrames={duration}>
          <Component duration={duration} />
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
