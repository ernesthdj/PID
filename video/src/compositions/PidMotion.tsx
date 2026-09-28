import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { C } from '../ui/theme';
import { AUTOLOADER_MOTION_FRAMES, AutoloaderMotion } from '../motion/AutoloaderMotion';
import { BOOTSTRAP_MOTION_FRAMES, BootstrapMotion } from '../motion/BootstrapMotion';
import { PAGE_MOTION_FRAMES, PageMotion } from '../motion/PageMotion';
import { SINGLETON_MOTION_FRAMES, SingletonMotion } from '../motion/SingletonMotion';

// Chapitres en motion design vectoriel, dans l'ordre du cheminement d'une requête.
const SCENES: { id: string; duration: number; Component: React.FC<{ duration: number }> }[] = [
  { id: 'bootstrap', duration: BOOTSTRAP_MOTION_FRAMES, Component: BootstrapMotion },
  { id: 'autoloader', duration: AUTOLOADER_MOTION_FRAMES, Component: AutoloaderMotion },
  { id: 'singleton', duration: SINGLETON_MOTION_FRAMES, Component: SingletonMotion },
  { id: 'page', duration: PAGE_MOTION_FRAMES, Component: PageMotion },
];

export const PID_MOTION_FRAMES = SCENES.reduce((sum, s) => sum + s.duration, 0);

export const PidMotion: React.FC = () => (
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
