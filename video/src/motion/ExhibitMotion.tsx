import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, MONO } from '../ui/theme';
import { Pt, bezier, capsule, ease, lerpPt, morph, roundedRect, toPath } from './geom';
import { CodeNode, CodeNodeCfg, Mark, Pill, Ripple, Spark, Wire, bump } from './parts';
import { Stage, mono } from './stage';

// ─── Chronologie (frames) ──────────────────────────────────────────────────────
const T_MORPH = 130;
const T_MOVE = 162;
const T_SYSTEM = 185;
const T_CALL = 215; // appel de Exhibit()
const F = (i: number): number => T_CALL + 30 + i * 40;
const T_A_END = 500;
const T_JS = 520; // bascule vers le premier JavaScript
const T_HTML = T_JS + 30;
const T_READY = T_JS + 130;
const T_READ1 = T_READY + 40;
const T_READ2 = T_READ1 + 50;
const T_FINAL = T_READ2 + 60;
export const EXHIBIT_MOTION_FRAMES = 860;

// ─── Mise en place, partie « Exhibit » ─────────────────────────────────────────
const OBJ: Pt = [430, 330];
const EX: Pt = [430, 600];
const GATE: Pt = [900, 600];
const DOC: Pt = [1370, 560];
const DOC_W = 560;
const DOC_H = 780;
const SLOT_W = 500;

const CODE: CodeNodeCfg = {
  lines: [
    'private function Exhibit_R(&$result, &$knownObjects)',
    '{',
    '    foreach (get_mangled_object_vars($this) as $name => $value)',
    '    {',
    '        if (is_object($value) && !is_callable($value))',
    '            $value = $app->ObjectToArray($value, $knownObjects);',
    '        if (is_array($value)) $result[$name] = $app->ArrayToArray(…);',
    '        else if (is_string($value) || is_bool($value) ||',
    '                 $value === null || is_numeric($value))',
    '            $result[$name] = $value;     // sinon : ignoré (closure…)',
    '    }',
    '}',
  ],
  title: 'TExhibitable::Exhibit()',
  note: 'extrait simplifié · _htdocs/.pid/exhibitable.php',
  codeAt: [960, 590],
  nodeAt: EX,
  tShow: 10,
  tMorph: T_MORPH,
  tMove: T_MOVE,
  accent: C.cyan,
  fontSize: 22,
};

interface Field {
  text: string;
  y: number;
  color: string;
  rejected?: boolean;
}

const FIELDS: Field[] = [
  { text: '"m_Nom"    => "Dupont"', y: -300, color: C.green },
  { text: '"m_Age"    => 42', y: -240, color: C.green },
  { text: '"m_Actif"  => true', y: -180, color: C.green },
  { text: 'm_Callback  (closure)', y: -120, color: C.red, rejected: true },
  { text: '"m_Adresse" => [ "ville" => "Namur" ]', y: -120, color: C.violet },
];

const FLY = 30;

const FieldView: React.FC<{ f: Field; i: number }> = ({ f, i }) => {
  const frame = useCurrentFrame();
  const start = F(i);
  if (frame < start) return null;
  const slot: Pt = [DOC[0], DOC[1] + f.y];
  if (f.rejected) {
    // Atteint le portail, est refusée, puis tombe.
    const t = ease(frame, start, 26);
    const pos = lerpPt(EX, GATE, t);
    const fall = ease(frame, start + 40, 40);
    const o = 1 - fall;
    if (o <= 0) return null;
    return (
      <g transform={`translate(${pos[0]} ${pos[1] + 220 * fall * fall}) rotate(${fall * 28})`} opacity={o}>
        <path d={toPath(capsule(f.text.length * 12 + 40, 38))} fill={C.bg} stroke={f.color} strokeWidth={2} />
        <text y={7} textAnchor="middle" fontFamily="Consolas, monospace" fontSize={20} fill={f.color}>
          {f.text}
        </text>
      </g>
    );
  }
  const t = ease(frame, start, FLY);
  const mid: Pt = [(EX[0] + slot[0]) / 2, Math.min(EX[1], slot[1]) - 80];
  const pos = bezier([EX, lerpPt(EX, mid, 0.8), lerpPt(slot, mid, 0.8), slot], t);
  const settle = ease(frame, start + FLY - 8, 12);
  const shape = morph(capsule(120, 30), roundedRect(SLOT_W, 36, 8), settle);
  const flash = bump(frame, start + FLY, 20);
  return (
    <g transform={`translate(${pos[0]} ${pos[1]})`}>
      <path
        d={toPath(shape)}
        fill={settle > 0.5 ? 'rgba(20, 36, 58, 0.9)' : f.color}
        stroke={f.color}
        strokeWidth={2}
        style={{ filter: `drop-shadow(0 0 ${t < 1 ? 10 : 12 * flash}px ${f.color})` }}
      />
      <text
        x={-SLOT_W / 2 + 16}
        y={6}
        fontFamily="Consolas, monospace"
        fontSize={19}
        fill={C.ink}
        opacity={settle}
        xmlSpace="preserve"
      >
        {f.text}
      </text>
    </g>
  );
};

// ─── Mise en place, partie « premier JavaScript » ──────────────────────────────
const HTML_AT: Pt = [470, 600];
const READY_AT: Pt = [1100, 340];
const CONSOLE: Pt = [1420, 640];
const CON_W = 700;
const CON_H = 300;

const Panel: React.FC<{ at: Pt; w: number; h: number; color: string; appear: number; label: string; children?: React.ReactNode }> = ({
  at,
  w,
  h,
  color,
  appear,
  label,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, appear, 24);
  const perimeter = 2 * (w + h);
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <path
        d={toPath(roundedRect(w, h, 16))}
        fill="#0A1422"
        fillOpacity={p}
        stroke={color}
        strokeWidth={3}
        strokeDasharray={perimeter}
        strokeDashoffset={perimeter * (1 - p)}
      />
      <text x={-w / 2} y={-h / 2 - 16} fontFamily={MONO} fontSize={22} fill={C.muted} opacity={p}>
        {label}
      </text>
      {children}
    </g>
  );
};

export const ExhibitMotion: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const partA = 1 - ease(frame, T_A_END + 10, 20);
  const partB = ease(frame, T_JS, 20);
  const docIn = ease(frame, T_SYSTEM, 30);
  const docPerimeter = 2 * (DOC_W + DOC_H);
  const emits = FIELDS.map((_, i) => bump(frame, F(i), 12));
  const exPulse = Math.max(...emits, bump(frame, T_CALL, 20));
  const gatePulse = bump(frame, F(3) + 26, 18);
  const hero = ease(frame, T_A_END - 40, 30);
  const consoleLine = (text: string, y: number, from: number): React.ReactNode => (
    <text x={-CON_W / 2 + 24} y={y} fontFamily="Consolas, monospace" fontSize={24} fill={C.green} opacity={ease(frame, from, 10)} xmlSpace="preserve">
      {text}
    </text>
  );

  return (
    <Stage
      chapter="08"
      title="Exhibit() et premier JavaScript"
      duration={duration}
      captions={[
        { from: 0, to: T_MORPH + 10, text: <>Le vrai code : {mono('Exhibit()')} parcourt chaque membre de l'objet</> },
        { from: T_MORPH + 10, to: F(0), text: <>Il devient le nœud qui présente un objet comme un simple <b>tableau</b></> },
        { from: F(0), to: F(3), text: <>Texte, nombre, booléen : copiés tels quels. Un objet imbriqué est aplati à son tour</> },
        { from: F(3), to: T_JS, text: <>Une closure n'est pas présentable ({mono('is_callable', C.red)}) : elle est ignorée</> },
        { from: T_JS, to: T_READY, text: <>Premier JS : {mono('CPage')} pose les chemins du serveur dans des attributs {mono('data-*')} du {mono('<body>')}</> },
        { from: T_READY, to: duration, text: <>jQuery les lit quand le DOM est prêt : le JS connaît la racine du site</> },
      ]}
    >
      <g opacity={partA}>
        {/* Document cible : le tableau */}
        <g transform={`translate(${DOC[0]} ${DOC[1]})`}>
          <path
            d={toPath(roundedRect(DOC_W, DOC_H, 20))}
            fill="#0A1422"
            fillOpacity={docIn}
            stroke={hero > 0 ? C.green : C.panelEdge}
            strokeWidth={3}
            strokeDasharray={docPerimeter}
            strokeDashoffset={docPerimeter * (1 - docIn)}
            style={hero > 0 ? { filter: `drop-shadow(0 0 ${18 * hero}px ${C.green})` } : undefined}
          />
          <text x={-DOC_W / 2} y={-DOC_H / 2 - 16} fontFamily={MONO} fontSize={22} fill={C.muted} opacity={docIn}>
            tableau renvoyé par Exhibit()
          </text>
        </g>

        <Wire from={[OBJ[0], OBJ[1] + 36]} to={[EX[0], EX[1] - 40]} start={T_SYSTEM + 10} color={C.cyan} dashed={false} opacity={1} />
        <Pill at={OBJ} title="CPersonne  (objet)" appear={T_SYSTEM + 6} color={C.cyan} pulse={bump(frame, T_CALL, 16)} sub="TExhibitable + IExhibitable" />
        <Spark from={[OBJ[0], OBJ[1] + 36]} to={[EX[0], EX[1] - 40]} start={T_CALL} duration={24} color={C.cyan} />

        {/* Portail : refus des closures */}
        <g opacity={ease(frame, T_SYSTEM + 20, 20)}>
          <path d={toPath(roundedRect(16, 120, 6))} transform={`translate(${GATE[0] + 36} ${GATE[1]})`} fill={C.bg} stroke={C.red} strokeWidth={3} style={{ filter: `drop-shadow(0 0 ${4 + 14 * gatePulse}px ${C.red})` }} />
        </g>
        <Mark at={[GATE[0] + 36, GATE[1] - 90]} appear={F(3) + 24} vanish={F(3) + 70} />
        <Ripple at={[GATE[0] + 36, GATE[1]]} start={F(3) + 26} color={C.red} />

        {FIELDS.map((f, i) => (
          <FieldView key={i} f={f} i={i} />
        ))}

        <CodeNode cfg={CODE} pulse={exPulse} />
      </g>

      <g opacity={partB}>
        <Panel at={HTML_AT} w={800} h={220} color={C.cyan} appear={T_HTML} label="HTML produit par CPage">
          <text x={-370} y={-50} fontFamily="Consolas, monospace" fontSize={24} fill={C.cyan} opacity={ease(frame, T_HTML + 20, 14)} xmlSpace="preserve">
            {'<body'}
          </text>
          <text x={-340} y={0} fontFamily="Consolas, monospace" fontSize={24} fill={C.amber} opacity={ease(frame, T_HTML + 30, 14)} xmlSpace="preserve">
            {'data-path-to-root="/pid/"'}
          </text>
          <text x={-340} y={50} fontFamily="Consolas, monospace" fontSize={24} fill={C.amber} opacity={ease(frame, T_HTML + 40, 14)} xmlSpace="preserve">
            {'data-path-to-pid="/pid/.pid/">'}
          </text>
        </Panel>

        <Pill at={READY_AT} title="$(document).ready" appear={T_READY - 20} color={C.violet} pulse={bump(frame, T_READY, 16)} sub="application.js · jQuery 4" />
        <Wire from={[HTML_AT[0] + 400, HTML_AT[1] - 40]} to={[READY_AT[0] - 140, READY_AT[1] + 20]} start={T_READY - 10} color={C.violet} />
        <Spark from={[HTML_AT[0] + 400, HTML_AT[1] - 40]} to={[READY_AT[0] - 140, READY_AT[1] + 20]} start={T_READY} duration={26} color={C.violet} />

        <Panel at={CONSOLE} w={CON_W} h={CON_H} color={C.green} appear={T_READY - 10} label="console du navigateur">
          {consoleLine('PID framework is starting...', -60, T_READY + 26)}
          {consoleLine('* path to root      : /pid/', 0, T_READ1)}
          {consoleLine('* path to framework : /pid/.pid/', 50, T_READ2)}
        </Panel>
        <Wire from={[READY_AT[0], READY_AT[1] + 70]} to={[CONSOLE[0] + 230, CONSOLE[1] - CON_H / 2]} start={T_READY + 10} color={C.green} />
        <Spark from={[READY_AT[0], READY_AT[1] + 70]} to={[CONSOLE[0] + 230, CONSOLE[1] - CON_H / 2]} start={T_READ1 - 20} duration={24} color={C.green} />
        <Ripple at={[CONSOLE[0], CONSOLE[1]]} start={T_FINAL} color={C.green} from={80} to={260} />
      </g>
    </Stage>
  );
};
