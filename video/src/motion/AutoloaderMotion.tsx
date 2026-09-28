import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, MONO } from '../ui/theme';
import { Pt, circle, ease, lerp, lerpPt, polygon, roundedRect, toPath } from './geom';
import { CodeLine, CodeNode, CodeNodeCfg, FlyChip, Mark, Pill, Ripple, Spark, Wire, bump } from './parts';
import { Stage, mono } from './stage';

// ─── Chronologie (frames) ──────────────────────────────────────────────────────
const T_MORPH = 150;
const T_MOVE = 182;
const T_SYSTEM = 200;
const T_FIRE = 262;
const T_HIT = T_FIRE + 30;
const T_SPLIT = 312;
const T_ASK = 360;
const T_NO = T_ASK + 34;
const T_DIVE = 425;
const T_CAND1 = 450;
const T_CAND2 = 485;
const T_FOUND = T_CAND2 + 30;
const T_PEEK = T_FOUND + 8;
const T_VERIFIED = T_PEEK + 34;
const T_MEMO = 575;
const T_WRITE = T_MEMO + 34;
const T_INCLUDE = 630;
const T_DONE = T_INCLUDE + 26;
export const AUTOLOADER_MOTION_FRAMES = 740;

// ─── Mise en place du système ──────────────────────────────────────────────────
const TRIGGER: Pt = [300, 470];
const AUTO: Pt = [860, 470];
const REG: Pt = [1480, 470];
const REG_W = 560;
const REG_H = 190;
const ROOT: Pt = [860, 700];
const DISK: { name: string; at: Pt; dir: boolean }[] = [
  { name: '.pid/', at: [520, 880], dir: true },
  { name: 'dir1/', at: [740, 880], dir: true },
  { name: 'index.php', at: [980, 880], dir: false },
  { name: 'monapp.php', at: [1220, 880], dir: false },
];
const MONAPP = DISK[3].at;

const CODE: CodeNodeCfg = {
  lines: [
    'spl_autoload_register(function($className)',
    '{',
    '    $kind = ["class", "interface", "trait"][strpos("CIT", $className[0])];',
    '    if (!isset($PID_CLASS_REGISTER[$className]))',
    '    {',
    '        $filePath = $exploreToFind(PID_PATH_TO_ROOT, $kind, $className);',
    '        $PID_CLASS_REGISTER[$className] = $filePath;  // + fichier réécrit',
    '    }',
    '    PID_Include($PID_CLASS_REGISTER[$className]);',
    '});',
  ],
  title: 'Autoloader',
  note: 'extrait simplifié · _htdocs/index.php',
  codeAt: [960, 590],
  nodeAt: AUTO,
  tShow: 10,
  tMorph: T_MORPH,
  tMove: T_MOVE,
  accent: C.cyan,
};

// Registre .class.register.php : un document dont les lignes s'allument.
const Registry: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - (T_SYSTEM + 10), fps, config: { damping: 14 } });
  const scan = ease(frame, T_ASK + 10, 22);
  const scanning = frame >= T_ASK + 10 && frame < T_NO + 6;
  const written = ease(frame, T_WRITE, 16);
  const glow = bump(frame, T_WRITE, 30);
  return (
    <g transform={`translate(${REG[0]} ${REG[1]}) scale(${pop})`}>
      <path
        d={toPath(roundedRect(REG_W, REG_H, 16))}
        fill="#0A1422"
        stroke={C.amber}
        strokeWidth={3}
        style={{ filter: `drop-shadow(0 0 ${6 + 16 * glow}px ${C.amber})` }}
      />
      <text x={-REG_W / 2} y={-REG_H / 2 - 18} fontFamily={MONO} fontSize={22} fill={C.amber}>
        .class.register.php
      </text>
      <CodeLine text={'"CApplication" => ".pid/application.php",'} x={-REG_W / 2 + 24} y={-24} size={21} opacity={1} />
      <g opacity={written}>
        <CodeLine text={'"CMonApp" => "monapp.php"'} x={-REG_W / 2 + 24} y={20} size={21} opacity={1} />
        <rect x={-REG_W / 2 + 12} y={-6} width={REG_W - 24} height={36} rx={6} fill={C.amber} opacity={0.18 * glow + 0.06} />
      </g>
      {scanning ? (
        <rect
          x={-REG_W / 2 + 8}
          y={lerp(-REG_H / 2 + 12, REG_H / 2 - 20, scan)}
          width={REG_W - 16}
          height={8}
          rx={4}
          fill={C.cyan}
          opacity={0.6}
        />
      ) : null}
    </g>
  );
};

// Petit disque : la racine et ses entrées.
const Disk: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const found = ease(frame, T_FOUND, 10);
  return (
    <g>
      {DISK.map((d, i) => {
        const len = Math.hypot(d.at[0] - ROOT[0], d.at[1] - ROOT[1]);
        const p = ease(frame, T_SYSTEM + 20 + i * 6, 24);
        return (
          <line
            key={d.name}
            x1={ROOT[0]}
            y1={ROOT[1]}
            x2={d.at[0]}
            y2={d.at[1]}
            stroke={C.panelEdge}
            strokeWidth={3}
            strokeDasharray={len}
            strokeDashoffset={len * (1 - p)}
          />
        );
      })}
      {[{ name: '_htdocs/  (racine)', at: ROOT, dir: true }, ...DISK].map((d, i) => {
        const pop = spring({ frame: frame - (T_SYSTEM + 16 + i * 6), fps, config: { damping: 12 } });
        const isTarget = d.at === MONAPP;
        const color = isTarget && found > 0.5 ? C.green : d.dir ? C.ink : C.muted;
        return (
          <g key={d.name} transform={`translate(${d.at[0]} ${d.at[1]}) scale(${pop * (1 + 0.25 * (isTarget ? bump(frame, T_FOUND, 24) : 0))})`}>
            <path d={toPath(d.dir ? polygon(6, 28) : circle(20))} fill={C.bg} stroke={color} strokeWidth={3} />
            <text
              y={i === 0 ? -44 : 56}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={21}
              fill={isTarget ? color : C.muted}
              stroke={C.bg}
              strokeWidth={8}
              paintOrder="stroke"
            >
              {d.name}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// Coup d'œil dans monapp.php : le nœud-fichier se rouvre en son code (rappel du motif).
const Peek: React.FC = () => {
  const frame = useCurrentFrame();
  const open = ease(frame, T_PEEK, 14) * (1 - ease(frame, T_MEMO - 6, 14));
  if (open <= 0) return null;
  const at: Pt = [MONAPP[0] + 60, MONAPP[1] - 150];
  const hl = ease(frame, T_PEEK + 14, 10);
  return (
    <g transform={`translate(${at[0]} ${at[1]}) scale(${open})`} opacity={open}>
      <path d={toPath(roundedRect(520, 70, 14))} fill="#0A1422" stroke={C.cyan} strokeWidth={2} />
      <rect x={-148} y={-20} width={112} height={34} rx={6} fill={C.green} opacity={0.25 * hl} />
      <CodeLine text="class CMonApp extends CApplication" x={-236} y={8} size={22} opacity={1} />
      <text x={-236} y={64} fontFamily={MONO} fontSize={18} fill={C.muted}>
        token_get_all : le fichier déclare bien la classe
      </text>
    </g>
  );
};

export const AutoloaderMotion: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const autoPulse = Math.max(bump(frame, T_HIT, 22), bump(frame, T_DONE, 24));
  const autoStroke = frame >= T_DONE ? C.green : C.cyan;
  const triggerOk = frame >= T_DONE + 10;

  // Le nom « CMonApp » se scinde : la lettre C s'envole et devient « class ».
  const split = ease(frame, T_SPLIT, 26);
  const splitVisible = frame >= T_SPLIT - 4 && frame < T_ASK + 20;
  const nameAt: Pt = [AUTO[0], AUTO[1] + 78];
  const cAt = lerpPt([nameAt[0] - 46, nameAt[1]], [AUTO[0], AUTO[1] - 86], split);

  return (
    <Stage
      chapter="05"
      title="Autoloader — trouver une classe à la demande"
      duration={duration}
      captions={[
        { from: 0, to: T_MORPH + 10, text: <>Le vrai code : la fonction que PHP appelle pour toute classe qu'il ne connaît pas</> },
        { from: T_MORPH + 10, to: T_FIRE, text: <>Ce code devient un acteur du système : le nœud {mono('Autoloader')}</> },
        { from: T_FIRE, to: T_ASK, text: <>{mono('new CMonApp()')} : classe inconnue → son nom part à l'autoloader. Lettre {mono('C')} = class</> },
        { from: T_ASK, to: T_DIVE, text: <>Le registre connaît-il {mono('CMonApp')} ? Non.</> },
        { from: T_DIVE, to: T_MEMO, text: <>Il cherche {mono('class.MonApp.php')}, puis {mono('MonApp.php')} depuis la racine, et lit le fichier pour vérifier</> },
        { from: T_MEMO, to: T_INCLUDE, text: <>Il note le chemin dans le registre : plus de fouille la prochaine fois</> },
        { from: T_INCLUDE, to: duration, text: <>Il inclut le fichier : la classe existe, le {mono('new')} peut continuer</> },
      ]}
    >
      {/* Liens du système */}
      <Wire from={[TRIGGER[0] + 110, TRIGGER[1]]} to={[AUTO[0] - 110, AUTO[1]]} start={T_SYSTEM + 30} color={C.panelEdge} dashed={false} opacity={1} />
      <Wire from={[AUTO[0] + 110, AUTO[1]]} to={[REG[0] - REG_W / 2, REG[1]]} start={T_SYSTEM + 36} color={C.panelEdge} dashed={false} opacity={1} />
      <Wire from={[AUTO[0], AUTO[1] + 40]} to={[ROOT[0], ROOT[1] - 30]} start={T_SYSTEM + 42} color={C.panelEdge} dashed={false} opacity={1} />

      <Disk />
      <Registry />
      <Pill
        at={TRIGGER}
        title={triggerOk ? 'new CMonApp() ✓' : 'new CMonApp()'}
        appear={T_SYSTEM}
        color={triggerOk ? C.green : C.violet}
        pulse={Math.max(bump(frame, T_FIRE, 16), bump(frame, T_DONE + 10, 24))}
        sub="monapp · index.content.php"
      />

      {/* 1. Le nom de classe part vers l'autoloader */}
      <FlyChip text='"CMonApp"' from={TRIGGER} to={nameAt} start={T_FIRE} duration={30} color={C.violet} lift={120} />
      {splitVisible ? (
        <g opacity={1 - ease(frame, T_ASK + 6, 14)}>
          <text x={nameAt[0] - 26} y={nameAt[1] + 8} fontFamily="Consolas, monospace" fontSize={26} fill={C.violet}>
            MonApp
          </text>
          <text x={cAt[0]} y={cAt[1] + 8} textAnchor="middle" fontFamily="Consolas, monospace" fontSize={lerp(26, 30, split)} fill={split > 0.6 ? C.cyan : C.violet}>
            {split > 0.6 ? 'class' : 'C'}
          </text>
        </g>
      ) : null}
      <Ripple at={AUTO} start={T_HIT} color={C.violet} from={60} to={180} />

      {/* 2. Question au registre */}
      <Spark from={[AUTO[0] + 110, AUTO[1]]} to={[REG[0] - REG_W / 2, REG[1]]} start={T_ASK} duration={20} color={C.cyan} />
      <Ripple at={REG} start={T_NO} color={C.red} from={100} to={320} />
      <Mark at={[REG[0] + REG_W / 2 + 50, REG[1]]} appear={T_NO} vanish={T_DIVE + 10} />

      {/* 3. Fouille du disque */}
      <Spark from={[AUTO[0], AUTO[1] + 40]} to={ROOT} start={T_DIVE} duration={20} color={C.amber} />
      <Ripple at={ROOT} start={T_DIVE + 20} color={C.amber} />
      <FlyChip text="class.MonApp.php" from={ROOT} to={[ROOT[0] - 260, ROOT[1] - 30]} start={T_CAND1} duration={20} color={C.amber} lift={30} hold={18} />
      <Mark at={[ROOT[0] - 420, ROOT[1] - 30]} appear={T_CAND1 + 16} vanish={T_CAND2} />
      <FlyChip text="MonApp.php" from={ROOT} to={MONAPP} start={T_CAND2} duration={30} color={C.amber} lift={40} />
      <Ripple at={MONAPP} start={T_FOUND} color={C.green} />
      <Peek />
      <Mark at={[MONAPP[0] + 330, MONAPP[1] - 150]} appear={T_VERIFIED} toCheck={T_VERIFIED} vanish={T_MEMO} />

      {/* 4. Mémorisation dans le registre */}
      <FlyChip text='"monapp.php"' from={MONAPP} to={[REG[0] - 40, REG[1] + 20]} start={T_MEMO} duration={34} color={C.amber} lift={200} />

      {/* 5. Inclusion */}
      <Spark from={MONAPP} to={[AUTO[0] + 40, AUTO[1] + 36]} start={T_INCLUDE} duration={26} color={C.green} />
      <Ripple at={AUTO} start={T_DONE} color={C.green} from={60} to={200} />
      <Spark from={[AUTO[0] - 110, AUTO[1]]} to={[TRIGGER[0] + 110, TRIGGER[1]]} start={T_DONE + 4} duration={18} color={C.green} />

      <CodeNode cfg={CODE} pulse={autoPulse} stroke={autoStroke} />
    </Stage>
  );
};
