import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, MONO } from '../ui/theme';
import {
  Pt,
  bezier,
  circle,
  cubicLength,
  cubicPath,
  ease,
  lerp,
  markPath,
  morph,
  polygon,
  toPath,
  verticalCurve,
} from './geom';
import { Stage, mono } from './stage';

type Kind = 'dir' | 'file' | 'marker' | 'request';

interface TreeNode {
  id: string;
  label: string;
  at: Pt;
  kind: Kind;
  parent?: string;
  depth: number;
}

const NODES: TreeNode[] = [
  { id: 'root', label: '_htdocs/', at: [1000, 270], kind: 'dir', depth: 0 },
  { id: 'cfg', label: '.pid.config.php', at: [560, 450], kind: 'marker', parent: 'root', depth: 1 },
  { id: 'pid', label: '.pid/', at: [840, 450], kind: 'dir', parent: 'root', depth: 1 },
  { id: 'idx', label: 'index.php', at: [1110, 450], kind: 'file', parent: 'root', depth: 1 },
  { id: 'dir1', label: 'dir1/', at: [1420, 450], kind: 'dir', parent: 'root', depth: 1 },
  { id: 'truc', label: 'truc/', at: [1420, 610], kind: 'dir', parent: 'dir1', depth: 2 },
  { id: 'machin', label: 'machin/', at: [1420, 770], kind: 'dir', parent: 'truc', depth: 3 },
  { id: 'req', label: 'index.php', at: [1420, 920], kind: 'request', parent: 'machin', depth: 4 },
];

const byId = (id: string): TreeNode => {
  const n = NODES.find((x) => x.id === id);
  if (!n) throw new Error(`nœud inconnu : ${id}`);
  return n;
};

const SHAPE: Record<Kind, Pt[]> = {
  dir: polygon(6, 34),
  file: circle(22),
  marker: polygon(4, 38),
  request: circle(24),
};

const COLOR: Record<Kind, string> = {
  dir: C.ink,
  file: C.muted,
  marker: C.amber,
  request: C.cyan,
};

// ─── Chronologie (frames) ──────────────────────────────────────────────────────
const T_ARRIVE = 70; // la requête entre
const T_LAND = 118; // … et touche index.php
const T_MORPH = 128; // cercle → losange « sonde »
const HOP0 = 160; // première remontée
const HOP_LEN = 58;
const CLIMB = ['req', 'machin', 'truc', 'dir1', 'root'];
const T_FOUND = HOP0 + HOP_LEN * 3 + 30; // arrivée à la racine
const T_BEAM = T_FOUND + 8;
const T_FINAL = T_BEAM + 60;

const hopStart = (i: number): number => HOP0 + i * HOP_LEN;
const hopEnd = (i: number): number => hopStart(i) + 30;

// Fragments « ../ » : un par dossier franchi au-dessus de machin/.
const CW = 22; // largeur d'un caractère Consolas 40px
const STR_X = 120;
const STR_Y = 1010;
const PREFIX = 'PID_PATH_TO_ROOT = "';
const SLOT_X = STR_X + PREFIX.length * CW;

const Ripple: React.FC<{ at: Pt; start: number; color: string }> = ({ at, start, color }) => {
  const frame = useCurrentFrame();
  const t = ease(frame, start, 26);
  if (t <= 0 || t >= 1) return null;
  return <circle cx={at[0]} cy={at[1]} r={lerp(30, 110, t)} fill="none" stroke={color} strokeWidth={3} opacity={1 - t} />;
};

export const BootstrapMotion: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Caméra : léger zoom vers la zone d'action, puis recul pour la conclusion.
  const zoom = lerp(1, 1.06, ease(frame, 0, 200)) * lerp(1, 0.94, ease(frame, T_FINAL, 40));
  const treeFade = lerp(1, 0.15, ease(frame, T_FINAL + 10, 30));

  // Position de la sonde : trajectoire d'entrée, puis remontée arête par arête.
  const entry: [Pt, Pt, Pt, Pt] = [[-80, 1100], [400, 1150], [1100, 700], byId('req').at];
  let probe: Pt = bezier(entry, ease(frame, T_ARRIVE, T_LAND - T_ARRIVE));
  for (let i = 0; i < 4; i++) {
    const child = byId(CLIMB[i]).at;
    const parent = byId(CLIMB[i + 1]).at;
    if (frame >= hopStart(i)) {
      const curve = verticalCurve(parent, child);
      probe = bezier(curve, 1 - ease(frame, hopStart(i), 30));
    }
  }
  const morphT = ease(frame, T_MORPH, 22);
  const hopPulse = Array.from({ length: 4 }, (_, i) => spring({ frame: frame - hopEnd(i), fps, config: { damping: 9 } }));
  const landed = hopPulse.reduce((acc, p, i) => (frame >= hopEnd(i) ? p : acc), 1);
  const probeScale = frame < T_ARRIVE ? 0 : 0.85 + 0.15 * landed;
  const probeColor = morphT < 0.5 ? C.cyan : C.amber;
  const probeShape = morph(circle(18), polygon(4, 26), morphT);

  // Traînée lumineuse de la requête pendant son entrée.
  const trail = Array.from({ length: 10 }, (_, k) => {
    const t = ease(frame - k * 2, T_ARRIVE, T_LAND - T_ARRIVE);
    return { p: bezier(entry, t), o: t > 0 && t < 1 ? (1 - k / 10) * 0.5 : 0, r: 16 - k };
  });

  const beam = ease(frame, T_BEAM, 22);
  const cfgFound = ease(frame, T_BEAM + 18, 14);

  // Nombre de fragments « ../ » posés dans la constante.
  const tokens = [1, 2, 3].map((k) => {
    const i = k; // hop 1 → truc, 2 → dir1, 3 → root
    const from = byId(CLIMB[i + 1]).at;
    const to: Pt = [SLOT_X + (k - 1) * 3 * CW, STR_Y - 12];
    const t = ease(frame, hopEnd(i) + 4, 26);
    const arc: [Pt, Pt, Pt, Pt] = [from, [from[0], from[1] - 160], [to[0], to[1] - 260], to];
    return { t, pos: bezier(arc, t), started: frame >= hopEnd(i) + 4 };
  });
  const placed = tokens.filter((tk) => tk.t >= 1).length;
  const dotSlash = 1 - ease(frame, hopEnd(1) + 20, 10);

  // Conclusion : la constante grossit et remonte au centre.
  const fin = ease(frame, T_FINAL + 10, 34);
  const strScale = lerp(1, 1.6, fin);
  const strW = (PREFIX.length + 11) * CW;
  const strDx = lerp(0, 960 - 1.6 * (STR_X + strW / 2), fin);
  const strDy = lerp(0, 600 - 1.6 * STR_Y, fin);

  return (
    <Stage
      chapter="02"
      title="Bootstrap — trouver la racine"
      duration={duration}
      captions={[
        { from: 20, to: T_LAND + 10, text: <>Le visiteur demande {mono('dir1/truc/machin/')}</> },
        { from: T_LAND + 10, to: HOP0 + 20, text: <>Le script devient une sonde : il cherche le losange {mono('.pid.config.php', C.amber)}</> },
        { from: HOP0 + 20, to: T_FOUND, text: <>Absent ? On remonte d'un dossier, et le chemin s'allonge d'un {mono('../')}</> },
        { from: T_FOUND, to: duration, text: <>Trouvé : la racine est à {mono('../../../', C.green)} de la page demandée</> },
      ]}
    >
      <g
        transform={`translate(${960 * (1 - zoom)} ${540 * (1 - zoom)}) scale(${zoom})`}
        opacity={treeFade}
      >
        {/* Arêtes qui se dessinent */}
        {NODES.filter((n) => n.parent).map((n) => {
          const curve = verticalCurve(byId(n.parent as string).at, n.at);
          const len = cubicLength(curve);
          const p = ease(frame, 8 + n.depth * 10, 30);
          const hop = CLIMB.indexOf(n.id);
          const climbP = hop >= 0 ? ease(frame, hopStart(hop), 30) : 0;
          const isBeam = n.id === 'cfg';
          return (
            <g key={n.id}>
              <path
                d={cubicPath(curve)}
                fill="none"
                stroke={C.panelEdge}
                strokeWidth={3}
                strokeDasharray={len}
                strokeDashoffset={len * (1 - p)}
              />
              {hop >= 0 ? (
                <path
                  d={cubicPath(curve)}
                  fill="none"
                  stroke={C.amber}
                  strokeWidth={4}
                  strokeDasharray={len}
                  strokeDashoffset={-len * (1 - climbP)}
                  opacity={0.75}
                />
              ) : null}
              {isBeam ? (
                <path
                  d={cubicPath(curve)}
                  fill="none"
                  stroke={C.green}
                  strokeWidth={6}
                  strokeDasharray={len}
                  strokeDashoffset={len * (1 - beam)}
                  style={{ filter: `drop-shadow(0 0 8px ${C.green})` }}
                />
              ) : null}
            </g>
          );
        })}

        {/* Nœuds qui éclosent */}
        {NODES.map((n) => {
          const pop = spring({ frame: frame - (4 + n.depth * 10), fps, config: { damping: 12 } });
          const color = n.kind === 'marker' && cfgFound > 0.5 ? C.green : COLOR[n.kind];
          const glow = n.kind === 'marker' ? cfgFound : 0;
          return (
            <g key={n.id} transform={`translate(${n.at[0]} ${n.at[1]}) scale(${pop * (1 + 0.25 * glow)})`}>
              <path
                d={toPath(SHAPE[n.kind])}
                fill={C.bg}
                stroke={color}
                strokeWidth={3}
                style={glow > 0 ? { filter: `drop-shadow(0 0 ${14 * glow}px ${C.green})` } : undefined}
              />
              <text
                y={n.kind === 'marker' ? 72 : 62}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize={22}
                fill={n.kind === 'request' ? C.cyan : C.muted}
                stroke={C.bg}
                strokeWidth={10}
                paintOrder="stroke"
              >
                {n.label}
              </text>
            </g>
          );
        })}

        <Ripple at={byId('req').at} start={T_LAND} color={C.cyan} />

        {/* Croix à chaque échec */}
        {[0, 1, 2].map((i) => {
          const at = byId(CLIMB[i + 1]).at;
          const t = ease(frame, hopEnd(i), 12);
          const out = 1 - ease(frame, hopEnd(i) + 30, 14);
          return (
            <g key={i} opacity={t * out}>
              <Ripple at={at} start={hopEnd(i)} color={C.red} />
              <path d={markPath(0, at[0] + 70, at[1])} stroke={C.red} strokeWidth={6} strokeLinecap="round" fill="none" />
            </g>
          );
        })}

        {/* Racine : la croix se transforme en coche */}
        <g opacity={ease(frame, hopEnd(3), 10)}>
          <Ripple at={byId('root').at} start={hopEnd(3)} color={C.amber} />
          <path
            d={markPath(cfgFound, byId('cfg').at[0] + 80, byId('cfg').at[1] - 10)}
            stroke={cfgFound > 0.5 ? C.green : C.red}
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <Ripple at={byId('cfg').at} start={T_BEAM + 18} color={C.green} />

        {/* Traînée + sonde */}
        {trail.map((tr, k) => (
          <circle key={k} cx={tr.p[0]} cy={tr.p[1]} r={Math.max(2, tr.r)} fill={C.cyan} opacity={tr.o} />
        ))}
        <g
          transform={`translate(${probe[0]} ${probe[1]}) scale(${probeScale}) rotate(${lerp(0, 90, morphT)})`}
          opacity={1 - ease(frame, T_BEAM, 20)}
        >
          <path
            d={toPath(probeShape)}
            fill={probeColor}
            fillOpacity={0.9}
            style={{ filter: `drop-shadow(0 0 12px ${probeColor})` }}
          />
        </g>
      </g>

      {/* Fragments « ../ » en vol */}
      {tokens.map((tk, k) =>
        tk.started && tk.t < 1 ? (
          <text
            key={k}
            x={tk.pos[0]}
            y={tk.pos[1] + 12}
            fontFamily="Consolas, monospace"
            fontSize={lerp(30, 40, tk.t)}
            fill={C.amber}
            style={{ filter: `drop-shadow(0 0 6px ${C.amber})` }}
          >
            ../
          </text>
        ) : null,
      )}

      {/* La constante qui se construit */}
      <g
        transform={`translate(${strDx} ${strDy}) scale(${strScale})`}
        opacity={ease(frame, HOP0, 20)}
      >
        <text x={STR_X} y={STR_Y} fontFamily="Consolas, monospace" fontSize={40} fill={C.ink}>
          {PREFIX}
        </text>
        <text x={SLOT_X} y={STR_Y} fontFamily="Consolas, monospace" fontSize={40} fill={C.muted} opacity={dotSlash}>
          ./
        </text>
        {Array.from({ length: placed }, (_, k) => (
          <text key={k} x={SLOT_X + k * 3 * CW} y={STR_Y} fontFamily="Consolas, monospace" fontSize={40} fill={placed === 3 ? C.green : C.amber}>
            ../
          </text>
        ))}
        <text
          x={SLOT_X + (placed === 0 ? 2 : placed * 3) * CW}
          y={STR_Y}
          fontFamily="Consolas, monospace"
          fontSize={40}
          fill={C.ink}
        >
          ";
        </text>
      </g>
    </Stage>
  );
};

export const BOOTSTRAP_MOTION_FRAMES = T_FINAL + 90;
