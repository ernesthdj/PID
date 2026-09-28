import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, MONO } from '../ui/theme';
import { Pt, bezier, capsule, ease, lerpPt, morph, polygon, roundedRect, toPath } from './geom';
import { CodeNode, CodeNodeCfg, Pill, Ripple, Spark, Wire, bump } from './parts';
import { Stage, mono } from './stage';

// ─── Chronologie (frames) ──────────────────────────────────────────────────────
const T_MORPH = 160;
const T_MOVE = 192;
const T_SYSTEM = 212;
const T_HOOK = 500; // appel du hook WriteBody()
const T_FINAL = 730;
export const PAGE_MOTION_FRAMES = 820;

// ─── Mise en place ─────────────────────────────────────────────────────────────
const WDOC: Pt = [430, 560];
const APP: Pt = [430, 330];
const CHILD: Pt = [430, 830];
const FILTER: Pt = [860, 420];
const DOC: Pt = [1370, 560];
const DOC_W = 560;
const DOC_H = 780;
const SLOT_W = 500;

const CODE: CodeNodeCfg = {
  lines: [
    'public function WriteDocument($headContent = null, $bodyContent = null)',
    '{',
    '    self::DeclareContentType();                        // en-tête HTTP',
    '    print("<!doctype html> … <head><meta charset=…>");',
    '    foreach ([$app->Css(), $this->Css()] as $css) …     // <link>',
    '    print("<title>" . $app->IntoHtml($this->Title()) . "</title>");',
    '    if (!$this->WriteContent($headContent, …)) $this->WriteHead($tabs);',
    '    print("</head><body>");',
    '    if (!$this->WriteContent($bodyContent, …)) $this->WriteBody($tabs);',
    '    print("</body></html>");',
    '}',
  ],
  title: 'CPage::WriteDocument()',
  note: 'extrait simplifié · _htdocs/.pid/page.php',
  codeAt: [960, 590],
  nodeAt: WDOC,
  tShow: 10,
  tMorph: T_MORPH,
  tMove: T_MOVE,
  accent: C.cyan,
};

// Chaque brique : texte, source, emplacement dans le document, départ, passage par le filtre.
interface Brick {
  text: string;
  from: Pt;
  y: number;
  start: number;
  color: string;
  filtered?: boolean;
  ghost?: boolean;
}

const B = (i: number): number => T_SYSTEM + 50 + i * 36;
const BODY0 = T_HOOK + 40;

const BRICKS: Brick[] = [
  { text: 'HTTP  content-type: text/html;charset=…', from: WDOC, y: -330, start: B(0), color: C.violet },
  { text: '<!doctype html><html><head>', from: WDOC, y: -250, start: B(1), color: C.cyan },
  { text: '<meta charset="windows-1252"/>', from: WDOC, y: -200, start: B(2), color: C.cyan },
  { text: '<link …/>  (CSS/JS : aucun ici)', from: APP, y: -150, start: B(3), color: C.dim, ghost: true },
  { text: '<title>Liste de &lt;fruits&gt; &amp; …', from: WDOC, y: -100, start: B(4), color: C.green, filtered: true },
  { text: '</head><body>', from: WDOC, y: -30, start: B(4) + 90, color: C.cyan },
  { text: '<h1>Liste de &lt;fruits&gt; &amp; …</h1>', from: CHILD, y: 30, start: BODY0, color: C.violet },
  { text: '<article><ol>', from: CHILD, y: 80, start: BODY0 + 26, color: C.violet },
  { text: '  <li>Pomme</li>', from: CHILD, y: 125, start: BODY0 + 48, color: C.violet },
  { text: '  <li>Poire</li>', from: CHILD, y: 165, start: BODY0 + 66, color: C.violet },
  { text: '  <li>Raisin</li>', from: CHILD, y: 205, start: BODY0 + 84, color: C.violet },
  { text: '  <li>Tomate &amp; cerise</li>', from: CHILD, y: 245, start: BODY0 + 102, color: C.violet },
  { text: '</ol></article>', from: CHILD, y: 290, start: BODY0 + 124, color: C.violet },
  { text: '</body></html>', from: WDOC, y: 350, start: T_FINAL - 60, color: C.cyan },
];

const FLY = 30;
const FILTER_STOP = 22;

// Une brique vole de sa source vers sa place, en passant éventuellement par IntoHtml,
// et se transforme de pastille en ligne du document en atterrissant.
const BrickView: React.FC<{ b: Brick }> = ({ b }) => {
  const frame = useCurrentFrame();
  if (frame < b.start) return null;
  const slot: Pt = [DOC[0], DOC[1] + b.y];
  const extra = b.filtered ? FILTER_STOP + 10 : 0;
  let pos: Pt;
  let land: number;
  let color = b.color;
  if (b.filtered) {
    const t1 = ease(frame, b.start, FILTER_STOP);
    const t2 = ease(frame, b.start + FILTER_STOP + 10, FLY);
    pos =
      frame < b.start + FILTER_STOP + 10
        ? bezier([b.from, [b.from[0] + 200, b.from[1] - 120], [FILTER[0] - 200, FILTER[1]], FILTER], t1)
        : bezier([FILTER, [FILTER[0] + 200, FILTER[1]], [slot[0] - 400, slot[1]], slot], t2);
    land = t2;
    color = frame < b.start + FILTER_STOP + 4 ? C.amber : C.green;
  } else {
    const t = ease(frame, b.start, FLY);
    const mid: Pt = [(b.from[0] + slot[0]) / 2, Math.min(b.from[1], slot[1]) - 80];
    pos = bezier([b.from, lerpPt(b.from, mid, 0.8), lerpPt(slot, mid, 0.8), slot], t);
    land = t;
  }
  const settle = ease(frame, b.start + extra + FLY - 8, 12);
  const shape = morph(capsule(90, 30), roundedRect(SLOT_W, 36, 8), settle);
  const flash = bump(frame, b.start + extra + FLY, 20);
  return (
    <g transform={`translate(${pos[0]} ${pos[1]})`} opacity={b.ghost ? 0.55 : 1}>
      <path
        d={toPath(shape)}
        fill={settle > 0.5 ? 'rgba(20, 36, 58, 0.9)' : color}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={b.ghost ? '6 6' : undefined}
        style={{ filter: `drop-shadow(0 0 ${land < 1 ? 10 : 12 * flash}px ${color})` }}
      />
      <text
        x={-SLOT_W / 2 + 16}
        y={6}
        fontFamily="Consolas, monospace"
        fontSize={19}
        fill={b.ghost ? C.muted : C.ink}
        opacity={settle}
        xmlSpace="preserve"
      >
        {b.text}
      </text>
    </g>
  );
};

export const PageMotion: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const docIn = ease(frame, T_SYSTEM, 30);
  const docPerimeter = 2 * (DOC_W + DOC_H);
  const filterPulse = bump(frame, B(4) + FILTER_STOP, 20);
  const emits = BRICKS.filter((b) => b.from === WDOC).map((b) => bump(frame, b.start, 12));
  const wdocPulse = Math.max(...emits, bump(frame, T_HOOK, 20));
  const childPulse = Math.max(bump(frame, T_HOOK + 26, 20), ...BRICKS.filter((b) => b.from === CHILD).map((b) => bump(frame, b.start, 10)));
  const hero = ease(frame, T_FINAL, 30);

  return (
    <Stage
      chapter="07"
      title="CPage — fabriquer la page HTML"
      duration={duration}
      captions={[
        { from: 0, to: T_MORPH + 10, text: <>Le vrai code : {mono('WriteDocument()')} écrit toute la page, dans un ordre imposé</> },
        { from: T_MORPH + 10, to: B(0), text: <>Il devient le nœud qui fabrique le document</> },
        { from: B(0), to: B(4), text: <>D'abord l'en-tête HTTP et le squelette, puis les CSS/JS demandés à {mono('CApplication')}</> },
        { from: B(4), to: T_HOOK, text: <>Le titre traverse le filtre {mono('IntoHtml', C.green)} : {mono('<', C.amber)} et {mono('&', C.amber)} sont neutralisés</> },
        { from: T_HOOK, to: T_FINAL - 60, text: <>Aucun contenu fourni pour le body → il appelle le hook {mono('WriteBody()', C.violet)} de la classe fille</> },
        { from: T_FINAL - 60, to: duration, text: <>La classe mère impose l'ordre ; la classe fille ne remplit que sa partie</> },
      ]}
    >
      {/* Document cible */}
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
        <line x1={-DOC_W / 2 + 20} y1={-290} x2={DOC_W / 2 - 20} y2={-290} stroke={C.panelEdge} strokeDasharray="6 8" opacity={docIn} />
        <text x={-DOC_W / 2} y={-DOC_H / 2 - 16} fontFamily={MONO} fontSize={22} fill={C.muted} opacity={docIn}>
          réponse envoyée au navigateur
        </text>
      </g>

      {/* Liens du système */}
      <Wire from={[APP[0], APP[1] + 32]} to={[WDOC[0], WDOC[1] - 40]} start={T_SYSTEM + 10} color={C.panelEdge} dashed={false} opacity={1} />
      <Wire from={[WDOC[0], WDOC[1] + 40]} to={[CHILD[0], CHILD[1] - 32]} start={T_HOOK - 30} color={C.violet} />
      <text
        x={WDOC[0] + 24}
        y={(WDOC[1] + CHILD[1]) / 2 + 8}
        fontFamily={MONO}
        fontSize={20}
        fill={C.violet}
        opacity={ease(frame, T_HOOK - 20, 14)}
      >
        hook redéfini (extends)
      </text>

      {/* Filtre IntoHtml */}
      <g transform={`translate(${FILTER[0]} ${FILTER[1]}) scale(${ease(frame, T_SYSTEM + 30, 20) * (1 + 0.25 * filterPulse)})`}>
        <path
          d={toPath(polygon(4, 46))}
          fill={C.bg}
          stroke={C.green}
          strokeWidth={3}
          style={{ filter: `drop-shadow(0 0 ${4 + 16 * filterPulse}px ${C.green})` }}
        />
        <text y={82} textAnchor="middle" fontFamily="Consolas, monospace" fontSize={22} fill={C.green}>
          IntoHtml()
        </text>
      </g>
      <Ripple at={FILTER} start={B(4) + FILTER_STOP} color={C.green} />

      <Pill at={APP} title="CApplication" appear={T_SYSTEM + 6} color={C.cyan} pulse={bump(frame, B(3), 16)} sub="CSS/JS de toute l'application" />
      <Pill
        at={CHILD}
        title="CettePage::WriteBody()"
        appear={T_HOOK - 30}
        color={C.violet}
        pulse={childPulse}
        sub="classe fille"
      />

      {/* Appel du hook */}
      <Spark from={[WDOC[0], WDOC[1] + 40]} to={[CHILD[0], CHILD[1] - 32]} start={T_HOOK} duration={24} color={C.violet} />
      <Ripple at={CHILD} start={T_HOOK + 24} color={C.violet} from={60} to={220} />

      {BRICKS.map((b, i) => (
        <BrickView key={i} b={b} />
      ))}

      <CodeNode cfg={CODE} pulse={wdocPulse} />
    </Stage>
  );
};
