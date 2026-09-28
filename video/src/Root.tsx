import React from 'react';
import { Composition } from 'remotion';
import { PID_TOTAL_FRAMES, PidFramework } from './compositions/PidFramework';
import { PID_MOTION_FRAMES, PidMotion } from './compositions/PidMotion';
import { FPS } from './ui/theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="PidFramework"
      component={PidFramework}
      durationInFrames={PID_TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="PidMotion"
      component={PidMotion}
      durationInFrames={PID_MOTION_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
