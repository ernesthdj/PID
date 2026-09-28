import React from 'react';
import { random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, MONO } from '../ui/theme';
import { Pt, bezier, capsule, ease, lerp, lerpPt, morph, polygon, toPath } from './geom';
import { Stage, mono } from './stage';

// ─── Mise en place ─────────────────────────────────────────────────────────────
const A: Pt = [500, 600]; // objet de la requête n°1
const B: Pt = [1420, 600]; // objet de la requête n°2
const S1: Pt = [500, 410]; // propriété statique, requête n°1
const S2: Pt = [1420, 410];
const V: Pt = [960, 870]; // coffre de la session
const VW = 400;
const VH = 150;

const HEX = polygon(6, 92);
const CAPS = capsule(330, 64);

// ─── Chronologie (frames) ──────────────────────────────────────────────────────
const T_BUILD = 40;
const T_SHAPE = 100;
const T_STATIC = 118;
const T_LINK = 145;
const T_SER = 180;
const T_OPEN1 = 205;
const T_TRAVEL1 = 222;
const T_CLOSE1 = 262;
const T_DIE = 290;
const T_REQ2 = 345;
const T_OPEN2 = 375;
const T_TRAVEL2 = 392;
const T_WAKE = 432;
const T_STATIC2 = 470;
export const SINGLETON_MOTION_FRAMES = 560;

const SHARDS = 22;
const DEBRIS = 26;

const Timeline: React.FC<{ x0: number; x1: number; start: number; label: string; dim: number }> = ({
  x0,
  x1,
  start,
  label,
  dim,
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, start, 30);
  const color = dim > 0.5 ? C.dim : C.cyan;
  return (
    <g opacity={ease(frame, start, 10)}>
      <line x1={x0} y1={300} x2={lerp(x0, x1, p)} y2={300} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <circle cx={x0} cy={300} r={8} fill={color} />
      <text x={x0} y={282} fontFamily={MONO} fontSize={22} fill={color}>
        {label}
      </text>
    </g>
  );
};

const StaticBox: React.FC<{ at: Pt; appear: number; vanish?: number }> = ({ at, appear, vanish }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - appear, fps, config: { damping: 12 } });
  const gone = vanish === undefined ? 0 : ease(frame, vanish, 10);
  return (
    <g transform={`translate(${at[0]} ${at[1]}) scale(${pop})`} opacity={1 - gone}>
      <rect x={-160} y={-30} width={320} height={60} rx={10} fill={C.panel} stroke={C.violet} strokeWidth={3} />
      <text textAnchor="middle" y={9} fontFamily={MONO} fontSize={26} fill={C.violet}>
        static $s_Instance
      </text>
    </g>
  );
};

// Lien pointillé qui se dessine puis « coule » vers sa cible.
const Link: React.FC<{ from: Pt; to: Pt; start: number; color: string; end?: number }> = ({ from, to, start, color, end }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, start, 20);
  const gone = end === undefined ? 0 : ease(frame, end, 10);
  const tip = lerpPt(from, to, p);
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={tip[0]}
      y2={tip[1]}
      stroke={color}
      strokeWidth={3}
      strokeDasharray="10 10"
      strokeDashoffset={-frame * 1.5}
      opacity={p * (1 - gone)}
    />
  );
};

export const SingletonMotion: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Construction : des éclats convergent vers le contour de l'hexagone.
  const shards = Array.from({ length: SHARDS }, (_, k) => {
    const target = HEX[Math.floor((k / SHARDS) * HEX.length)];
    const start: Pt = [lerp(-500, 500, random(`sx${k}`)), lerp(-420, 380, random(`sy${k}`))];
    const t = ease(frame, T_BUILD + k * 1.5, 45);
    const pos = lerpPt(start, target, t);
    const rot = lerp(random(`r${k}`) * 720 - 360, 0, t);
    return { pos, rot, t };
  });
  const shapeIn = ease(frame, T_SHAPE, 18);

  // 2. Sérialisation : hexagone → capsule, voyage vers le coffre, puis retour.
  const ser = ease(frame, T_SER, 24);
  const wake = ease(frame, T_WAKE, 24);
  const shapeT = frame < T_WAKE ? ser : 1 - wake;
  const shape = morph(HEX, CAPS, shapeT);

  const go: [Pt, Pt, Pt, Pt] = [A, [A[0], A[1] + 200], [V[0] - 300, V[1]], V];
  const back: [Pt, Pt, Pt, Pt] = [V, [V[0] + 300, V[1]], [B[0], B[1] + 220], B];
  const t1 = ease(frame, T_TRAVEL1, 40);
  const t2 = ease(frame, T_TRAVEL2, 40);
  const objPos: Pt = frame < T_TRAVEL2 ? bezier(go, t1) : bezier(back, t2);
  const objScale = frame < T_TRAVEL2 ? lerp(1, 0.85, t1) : lerp(0.85, 1, t2);

  // Coffre : portes coulissantes.
  const door =
    frame < T_OPEN2
      ? ease(frame, T_OPEN1, 16) * (1 - ease(frame, T_CLOSE1, 16))
      : ease(frame, T_OPEN2, 16) * (1 - ease(frame, T_TRAVEL2 + 40, 16));
  const stored = frame >= T_CLOSE1 + 10 && frame < T_OPEN2;

  const wakePulse = spring({ frame: frame - (T_WAKE + 24), fps, config: { damping: 8 } });
  const hexStroke = frame >= T_WAKE + 12 ? C.green : C.cyan;

  // Disparition de la statique : débris soumis à la gravité.
  const debris = Array.from({ length: DEBRIS }, (_, k) => {
    const t = ease(frame, T_DIE + random(`d${k}`) * 10, 50);
    const x0 = S1[0] + lerp(-150, 150, random(`dx${k}`));
    const y0 = S1[1] + lerp(-24, 24, random(`dy${k}`));
    const vx = lerp(-160, 160, random(`vx${k}`));
    return {
      x: x0 + vx * t,
      y: y0 - 60 * t + 380 * t * t,
      rot: 400 * t * (random(`vr${k}`) - 0.5),
      o: frame >= T_DIE ? 1 - t : 0,
    };
  });

  return (
    <Stage
      chapter="06"
      title="CApplication — un singleton qui dort dans la session"
      duration={duration}
      captions={[
        { from: 10, to: T_STATIC, text: <>Requête 1 : {mono('Instance()')} ne trouve rien → {mono('new CMonApp()')}</> },
        { from: T_STATIC, to: T_SER, text: <>Le constructeur s'enregistre : en statique… et dans la session</> },
        { from: T_SER, to: T_DIE, text: <>Fin du script : PHP <b>sérialise</b> l'objet et le range dans la session</> },
        { from: T_DIE, to: T_REQ2, text: <>Fin de la requête : les statiques disparaissent. Seule la session survit.</> },
        { from: T_REQ2, to: T_WAKE, text: <>Requête 2 : {mono('Instance()')} ouvre la session…</> },
        { from: T_WAKE, to: duration, text: <>…et réveille le même objet avec {mono('__wakeup()', C.green)} : aucun {mono('new')}</> },
      ]}
    >
      <Timeline x0={120} x1={860} start={0} label="REQUÊTE HTTP n°1" dim={ease(frame, T_DIE, 20)} />
      <Timeline x0={1060} x1={1800} start={T_REQ2 - 10} label="REQUÊTE HTTP n°2" dim={0} />

      {/* Coffre de la session */}
      <g opacity={ease(frame, 20, 20)}>
        <defs>
          <clipPath id="vault">
            <rect x={V[0] - VW / 2} y={V[1] - VH / 2} width={VW} height={VH} rx={20} />
          </clipPath>
        </defs>
        <rect
          x={V[0] - VW / 2 - 10}
          y={V[1] - VH / 2 - 10}
          width={VW + 20}
          height={VH + 20}
          rx={26}
          fill="#0A1422"
          stroke={C.amber}
          strokeWidth={3}
        />
        <text x={V[0]} y={V[1] + VH / 2 + 50} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={C.amber}>
          $_SESSION["PID_APPLICATION"]
        </text>
      </g>

      {/* Liens statique / session */}
      <Link from={[S1[0], S1[1] + 30]} to={[A[0], A[1] - 96]} start={T_STATIC + 10} color={C.violet} end={T_DIE} />
      <Link from={[A[0], A[1] + 96]} to={[V[0] - 120, V[1] - VH / 2 - 12]} start={T_LINK} color={C.amber} end={T_SER} />
      <Link from={[S2[0], S2[1] + 30]} to={[B[0], B[1] - 96]} start={T_STATIC2 + 10} color={C.violet} />

      <StaticBox at={S1} appear={T_STATIC} vanish={T_DIE} />
      {frame >= T_STATIC2 ? <StaticBox at={S2} appear={T_STATIC2} /> : null}

      {debris.map((d, k) =>
        d.o > 0 ? (
          <rect
            key={k}
            x={d.x - 6}
            y={d.y - 6}
            width={12}
            height={12}
            fill={C.violet}
            opacity={d.o}
            transform={`rotate(${d.rot} ${d.x} ${d.y})`}
          />
        ) : null,
      )}

      {/* Éclats de construction */}
      {shards.map((s, k) =>
        s.t > 0 && shapeIn < 1 ? (
          <path
            key={k}
            d="M0,-12 L10,8 L-10,8 Z"
            fill={C.cyan}
            opacity={(1 - shapeIn) * Math.min(1, s.t * 3)}
            transform={`translate(${A[0] + s.pos[0]} ${A[1] + s.pos[1]}) rotate(${s.rot})`}
          />
        ) : null,
      )}

      {/* L'objet : hexagone ⇄ capsule sérialisée (dessiné sous les portes du coffre) */}
      <g>
        <g transform={`translate(${objPos[0]} ${objPos[1]}) scale(${objScale * (1 + 0.12 * (1 - wakePulse) * (frame >= T_WAKE + 24 ? 1 : 0))})`} opacity={shapeIn}>
          <path
            d={toPath(shape)}
            fill="rgba(79, 209, 197, 0.12)"
            stroke={shapeT > 0.5 ? C.amber : hexStroke}
            strokeWidth={4}
            style={{ filter: `drop-shadow(0 0 10px ${shapeT > 0.5 ? C.amber : hexStroke})` }}
          />
          <text textAnchor="middle" y={10} fontFamily={MONO} fontSize={28} fill={C.ink} opacity={1 - Math.min(1, shapeT * 2)}>
            CMonApp
          </text>
          <text
            textAnchor="middle"
            y={9}
            fontFamily={MONO}
            fontSize={24}
            fill={C.amber}
            opacity={Math.max(0, shapeT * 2 - 1)}
          >
            O:7:"CMonApp":…
          </text>
        </g>
      </g>

      {/* Portes du coffre */}
      <g clipPath="url(#vault)" opacity={ease(frame, 20, 20)}>
        <rect x={V[0] - VW / 2 - (VW / 2) * door} y={V[1] - VH / 2} width={VW / 2} height={VH} fill={C.panel} stroke={C.panelEdge} strokeWidth={2} />
        <rect x={V[0] + (VW / 2) * door} y={V[1] - VH / 2} width={VW / 2} height={VH} fill={C.panel} stroke={C.panelEdge} strokeWidth={2} />
        <circle cx={V[0]} cy={V[1]} r={14} fill={stored ? C.amber : C.panelEdge} opacity={1 - door} style={stored ? { filter: `drop-shadow(0 0 10px ${C.amber})` } : undefined} />
      </g>

      {/* Réveil : onde + badge */}
      {frame >= T_WAKE + 20 ? (
        <circle
          cx={B[0]}
          cy={B[1]}
          r={lerp(90, 200, ease(frame, T_WAKE + 20, 30))}
          fill="none"
          stroke={C.green}
          strokeWidth={3}
          opacity={1 - ease(frame, T_WAKE + 20, 30)}
        />
      ) : null}
    </Stage>
  );
};
