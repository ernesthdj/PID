import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { C } from '../ui/theme';
import { BOOTSTRAP_MOTION_FRAMES, BootstrapMotion } from '../motion/BootstrapMotion';
import { SINGLETON_MOTION_FRAMES, SingletonMotion } from '../motion/SingletonMotion';

// Prototype « motion design » : deux chapitres en animation vectorielle.
export const PID_MOTION_FRAMES = BOOTSTRAP_MOTION_FRAMES + SINGLETON_MOTION_FRAMES;

export const PidMotion: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Series>
      <Series.Sequence durationInFrames={BOOTSTRAP_MOTION_FRAMES}>
        <BootstrapMotion duration={BOOTSTRAP_MOTION_FRAMES} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SINGLETON_MOTION_FRAMES}>
        <SingletonMotion duration={SINGLETON_MOTION_FRAMES} />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
