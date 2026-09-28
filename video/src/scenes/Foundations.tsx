import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT, MONO } from '../ui/theme';
import { CodeBlock, Panel, Reveal, SceneFrame, Tag, ramp, useAppear } from '../ui/kit';

// ─── 00 · Titre ────────────────────────────────────────────────────────────────

const CHAPTERS = ['Trouver la racine', 'Charger les classes', "Garder l'application", 'Écrire la page'];

export const Intro: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const title = useAppear(8);
  const line = ramp(frame, 20, 30);
  const out = 1 - ramp(frame, duration - 12, 12);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        fontFamily: FONT,
        color: C.ink,
        justifyContent: 'center',
        paddingLeft: 160,
        opacity: out,
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 28, color: C.cyan, letterSpacing: 4, opacity: title }}>
        COURS PID · SÉANCES DU 29/08 AU 19/09/2026
      </div>
      <div
        style={{
          fontSize: 112,
          fontWeight: 700,
          marginTop: 24,
          opacity: title,
          transform: `translateY(${(1 - title) * 40}px)`,
        }}
      >
        Le framework PID
      </div>
      <div style={{ height: 4, width: 720 * line, backgroundColor: C.cyan, marginTop: 24 }} />
      <Reveal delay={30}>
        <div style={{ fontSize: 40, color: C.muted, marginTop: 32 }}>
          Anatomie d'une requête : du fichier <span style={{ fontFamily: MONO, color: C.ink }}>index.php</span> à la
          page HTML
        </div>
      </Reveal>
      <div style={{ display: 'flex', gap: 24, marginTop: 64 }}>
        {CHAPTERS.map((c, i) => (
          <Reveal key={c} delay={50 + i * 8}>
            <Tag color={i % 2 === 0 ? C.cyan : C.amber}>
              {String(i + 1).padStart(2, '0')} · {c}
            </Tag>
          </Reveal>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Arborescence partagée par les chapitres 01 et 02 ──────────────────────────

interface TreeRow {
  name: string;
  depth: number;
  kind: 'dir' | 'file' | 'marker' | 'request';
}

const TREE: TreeRow[] = [
  { name: '_htdocs/', depth: 0, kind: 'dir' },
  { name: '.pid.config.php', depth: 1, kind: 'marker' },
  { name: '.pid/', depth: 1, kind: 'dir' },
  { name: 'index.php', depth: 1, kind: 'file' },
  { name: 'dir1/', depth: 1, kind: 'dir' },
  { name: 'truc/', depth: 2, kind: 'dir' },
  { name: 'machin/', depth: 3, kind: 'dir' },
  { name: 'index.php', depth: 4, kind: 'request' },
];

const ROW_H = 60;

interface TreeProps {
  highlightRow?: number;
  markerFound?: number;
  requestGlow?: number;
}

const Tree: React.FC<TreeProps> = ({ highlightRow, markerFound = 0, requestGlow = 0 }) => (
  <div style={{ position: 'relative', fontFamily: MONO, fontSize: 30 }}>
    {TREE.map((row, i) => {
      let color: string = row.kind === 'dir' ? C.ink : C.muted;
      if (row.kind === 'marker') color = markerFound > 0.5 ? C.green : C.amber;
      if (row.kind === 'request') color = C.cyan;
      const isHi = highlightRow === i;
      return (
        <div
          key={i}
          style={{
            height: ROW_H,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 24 + row.depth * 48,
            color,
            backgroundColor: isHi ? 'rgba(246, 178, 90, 0.14)' : 'transparent',
            borderRadius: 8,
            boxShadow:
              row.kind === 'request' ? `0 0 ${24 * requestGlow}px rgba(79, 209, 197, ${0.6 * requestGlow})` : 'none',
          }}
        >
          <span style={{ color: C.dim, marginRight: 12 }}>{row.depth === 0 ? '' : '└─'}</span>
          {row.name}
          {row.kind === 'marker' ? <span style={{ marginLeft: 16, fontSize: 20, whiteSpace: 'nowrap' }}>◆ marqueur de racine</span> : null}
          {row.kind === 'request' ? <span style={{ marginLeft: 16, fontSize: 22 }}>◀ requête HTTP</span> : null}
        </div>
      );
    })}
  </div>
);

// ─── 01 · Le problème ──────────────────────────────────────────────────────────

export const Problem: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <SceneFrame chapter="01" title="Le problème : où est la racine du site ?" duration={duration} source="_htdocs/">
      <div style={{ display: 'flex', gap: 96 }}>
        <Panel style={{ width: 760 }}>
          <Tree requestGlow={ramp(frame, 20, 20) * glow} />
        </Panel>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40, paddingTop: 16 }}>
          <Reveal delay={30}>
            <div style={{ fontSize: 40, lineHeight: 1.3 }}>
              Le visiteur demande <span style={{ fontFamily: MONO, color: C.cyan }}>dir1/truc/machin/</span>
            </div>
          </Reveal>
          <Reveal delay={70}>
            <div style={{ fontSize: 34, color: C.muted, lineHeight: 1.4 }}>
              PHP exécute ce fichier <b style={{ color: C.ink }}>depuis son propre dossier</b>. Les chemins relatifs
              partent donc de <span style={{ fontFamily: MONO }}>machin/</span>, pas de la racine.
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Panel accent={C.amber} style={{ padding: 28 }}>
              <div style={{ fontSize: 34, color: C.amber }}>
                Comment retrouver la configuration et le framework sans écrire de chemin absolu en dur ?
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={170}>
            <div style={{ fontSize: 28, color: C.muted }}>
              Réponse du cours : chaque dossier contient une <b style={{ color: C.ink }}>copie identique</b> de{' '}
              <span style={{ fontFamily: MONO }}>index.php</span>, qui part à la recherche d'un fichier-marqueur.
            </div>
          </Reveal>
        </div>
      </div>
    </SceneFrame>
  );
};

// ─── 02 · Bootstrap : la remontée ──────────────────────────────────────────────

const ATTEMPTS = [
  { prefix: './', row: 6 },
  { prefix: '../', row: 5 },
  { prefix: '../../', row: 4 },
  { prefix: '../../../', row: 0 },
];
const STEP = 45;
const FIRST = 30;

export const Bootstrap: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const current = Math.min(ATTEMPTS.length - 1, Math.max(0, Math.floor((frame - FIRST) / STEP)));
  const started = frame >= FIRST;
  const foundAt = FIRST + STEP * 3 + 20;
  const found = ramp(frame, foundAt, 10);

  return (
    <SceneFrame
      chapter="02"
      title="Bootstrap : remonter jusqu'au marqueur"
      duration={duration}
      source="_htdocs/index.php (lignes 5-31)"
    >
      <div style={{ display: 'flex', gap: 64 }}>
        <Panel style={{ width: 720 }}>
          <Tree highlightRow={started ? ATTEMPTS[current].row : undefined} markerFound={found} />
        </Panel>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ATTEMPTS.map((a, i) => {
            const at = FIRST + i * STEP;
            const visible = ramp(frame, at, 10);
            const isLast = i === ATTEMPTS.length - 1;
            const verdict = ramp(frame, isLast ? foundAt : at + 25, 8);
            return (
              <div
                key={a.prefix}
                style={{
                  opacity: visible,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  fontFamily: MONO,
                  fontSize: 30,
                }}
              >
                <span style={{ color: C.dim, width: 48 }}>{i + 1}.</span>
                <span>
                  file_exists(<span style={{ color: C.amber }}>"{a.prefix}.pid.config.php"</span>)
                </span>
                <span style={{ opacity: verdict, color: isLast ? C.green : C.red, fontSize: 34 }}>
                  {isLast ? '✓' : '✗'}
                </span>
              </div>
            );
          })}
          <div style={{ opacity: found, marginTop: 16 }}>
            <CodeBlock
              lines={['define("PID_PATH_TO_ROOT", "../../../");']}
              fontSize={28}
              style={{ borderColor: C.green }}
            />
          </div>
          <Reveal delay={foundAt + 30}>
            <CodeBlock
              fontSize={22}
              delay={foundAt + 30}
              lines={[
                '$relativePathToRoot = "./";',
                'for (...; $remainingUpSteps > 0; $remainingUpSteps--)',
                '{',
                '    if (file_exists($relativePathToRoot . PID_CONFIG_FILENAME))',
                '    { define("PID_PATH_TO_ROOT", $relativePathToRoot); break; }',
                '    $relativePathToRoot .= "../";   // (simplifié)',
                '}',
              ]}
            />
          </Reveal>
        </div>
      </div>
    </SceneFrame>
  );
};

// ─── 03 · Configuration contrôlée ──────────────────────────────────────────────

const REQUIRED = [
  'PID_SETUP_ACTION_NAME',
  'PID_SETUP_INDEX_FILES',
  'PID_INDEX_CONTENT_FILENAME',
  'PID_DEFAULT_INDEX_CONTENT',
  'PID_CLASS_REGISTER_FILENAME',
  'PID_CHARSET',
  'PID_APPLICATION_SESSION_ITEM_NAME',
  'PID_FOLDER_PATH',
];

export const Config: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  return (
    <SceneFrame
      chapter="03"
      title="Charger la configuration, et refuser l'incomplet"
      duration={duration}
      source="_htdocs/index.php · _htdocs/.pid.config.php"
    >
      <div style={{ display: 'flex', gap: 80 }}>
        <Panel style={{ width: 860 }}>
          <div style={{ fontSize: 28, color: C.muted, marginBottom: 20 }}>
            include_once(PID_PATH_TO_ROOT . ".pid.config.php") puis vérification :
          </div>
          {REQUIRED.map((name, i) => {
            const at = 20 + i * 12;
            const ok = ramp(frame, at + 6, 6);
            return (
              <div
                key={name}
                style={{
                  opacity: ramp(frame, at, 8),
                  fontFamily: MONO,
                  fontSize: 28,
                  lineHeight: 1.7,
                  display: 'flex',
                  gap: 16,
                }}
              >
                <span style={{ color: C.green, opacity: ok, width: 32 }}>✓</span>
                <span>defined("{name}")</span>
              </div>
            );
          })}
        </Panel>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <Reveal delay={130}>
            <Panel accent={C.cyan}>
              <div style={{ fontSize: 30 }}>
                <span style={{ fontFamily: MONO, color: C.cyan }}>PID_CHARSET</span> doit valoir
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                <Tag color={C.amber}>windows-1252</Tag>
                <Tag color={C.muted}>ou</Tag>
                <Tag color={C.amber}>utf-8</Tag>
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={165}>
            <Panel accent={C.red}>
              <div style={{ fontFamily: MONO, fontSize: 24, color: C.red, lineHeight: 1.5 }}>
                die("PID error : missing some constant(s) in .pid.config.php : …");
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={195}>
            <div style={{ fontSize: 32, color: C.muted, lineHeight: 1.4 }}>
              Principe : <b style={{ color: C.ink }}>échouer tôt et clairement</b>. Une configuration incomplète
              arrête tout, avec un message qui dit quoi corriger.
            </div>
          </Reveal>
        </div>
      </div>
    </SceneFrame>
  );
};

// ─── 04 · PID_PathTo ───────────────────────────────────────────────────────────

const PATHS = [
  { input: '"css/site.css"', output: '"../../../css/site.css"', note: 'interne : préfixé par la racine' },
  { input: '"*page.php"', output: '"../../..//.pid/page.php"', note: '* = dossier du framework (double « / » toléré)' },
  { input: '"https://…"', output: '"https://…"', note: 'externe (« : » avant « / ») : inchangé' },
];

export const PathTo: React.FC<{ duration: number }> = ({ duration }) => (
  <SceneFrame
    chapter="04"
    title="PID_PathTo : écrire les chemins depuis la racine"
    duration={duration}
    source="_htdocs/index.php · function PID_PathTo()"
  >
    <Reveal delay={10}>
      <div style={{ fontSize: 34, color: C.muted, marginBottom: 48 }}>
        Le développeur raisonne depuis la racine ; la fonction traduit pour la page demandée{' '}
        <span style={{ fontFamily: MONO, color: C.cyan }}>(ici dir1/truc/machin/)</span>.
      </div>
    </Reveal>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {PATHS.map((p, i) => (
        <Reveal key={p.input} delay={40 + i * 35}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontFamily: MONO, fontSize: 30 }}>
            <Panel style={{ width: 520, padding: 20 }}>
              PID_PathTo(<span style={{ color: C.amber }}>{p.input}</span>)
            </Panel>
            <span style={{ color: C.cyan, fontSize: 40 }}>→</span>
            <Panel accent={C.green} style={{ width: 520, padding: 20, color: C.green }}>
              {p.output}
            </Panel>
            <span style={{ fontFamily: FONT, fontSize: 26, color: C.muted }}>{p.note}</span>
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal delay={170}>
      <div style={{ fontSize: 30, color: C.muted, marginTop: 56 }}>
        Par défaut la fonction vérifie que le fichier existe, sinon elle renvoie{' '}
        <span style={{ fontFamily: MONO, color: C.red }}>false</span>.{' '}
        <span style={{ fontFamily: MONO, color: C.ink }}>PID_Include</span> s'appuie dessus pour inclure sans
        planter.
      </div>
    </Reveal>
  </SceneFrame>
);
