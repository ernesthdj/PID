import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, MONO } from '../ui/theme';
import { CodeBlock, Panel, Reveal, SceneFrame, Tag, ramp } from '../ui/kit';

// Étape d'un organigramme : s'allume quand `frame` atteint `at`, puis reste « faite ».
interface FlowStepProps {
  at: number;
  title: React.ReactNode;
  detail?: React.ReactNode;
  accent?: string;
  width?: number;
}

const FlowStep: React.FC<FlowStepProps> = ({ at, title, detail, accent = C.cyan, width = 900 }) => {
  const frame = useCurrentFrame();
  const shown = ramp(frame, at, 10);
  const lit = frame >= at && frame < at + 45;
  return (
    <div
      style={{
        opacity: shown,
        transform: `translateX(${(1 - shown) * -24}px)`,
        width,
        border: `2px solid ${lit ? accent : C.panelEdge}`,
        backgroundColor: lit ? 'rgba(79, 209, 197, 0.08)' : C.panel,
        borderRadius: 12,
        padding: '10px 24px',
      }}
    >
      <div style={{ fontSize: 26 }}>{title}</div>
      {detail ? <div style={{ fontSize: 21, color: C.muted, marginTop: 4 }}>{detail}</div> : null}
    </div>
  );
};

const Arrow: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ opacity: ramp(frame, at, 8), color: C.dim, fontSize: 16, paddingLeft: 40, lineHeight: 1 }}>▼</div>
  );
};

const code = (s: string): React.ReactNode => <span style={{ fontFamily: MONO, color: C.cyan }}>{s}</span>;

// ─── 05 · Autoloader ───────────────────────────────────────────────────────────

export const Autoloader: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const s = [15, 60, 105, 150, 205, 265, 320];
  return (
    <SceneFrame
      chapter="05"
      title="Autoloader : trouver une classe à la demande"
      duration={duration}
      source="_htdocs/index.php · spl_autoload_register(…)"
    >
      <div style={{ display: 'flex', gap: 56 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <FlowStep at={s[0]} title={<>{code('new CMonApp()')} — PHP ne connaît pas encore cette classe</>} />
          <Arrow at={s[1] - 5} />
          <FlowStep
            at={s[1]}
            title={<>1re lettre du nom → nature du type</>}
            detail={
              <>
                {code('C')} class · {code('I')} interface · {code('T')} trait → cherche « MonApp »
              </>
            }
          />
          <Arrow at={s[2] - 5} />
          <FlowStep
            at={s[2]}
            accent={C.amber}
            title={<>Déjà dans le registre {code('.class.register.php')} ?</>}
            detail="Oui → on inclut directement le fichier connu (cache)."
          />
          <Arrow at={s[3] - 5} />
          <FlowStep
            at={s[3]}
            title="Non → explorer le disque depuis la racine, dossier par dossier"
            detail={
              <>
                candidats {code('class.MonApp.php')} puis {code('MonApp.php')} · {code('token_get_all')} vérifie que
                le fichier déclare bien « class CMonApp »
              </>
            }
          />
          <Arrow at={s[4] - 5} />
          <FlowStep
            at={s[4]}
            accent={C.green}
            title="Mémoriser le chemin trouvé dans le registre"
            detail="Le fichier .class.register.php est réécrit : la prochaine requête ne cherchera plus."
          />
          <Arrow at={s[5] - 5} />
          <FlowStep
            at={s[5]}
            accent={C.violet}
            title={<>Inclure, puis {code('class_exists()')} — sinon oublier l'entrée et refaire une passe</>}
            detail="2 passes maximum : si le fichier a été déplacé, le cache périmé est corrigé tout seul."
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ opacity: ramp(frame, s[4] + 10, 12) }}>
            <div style={{ fontSize: 24, color: C.muted, marginBottom: 12 }}>.class.register.php (généré)</div>
            <CodeBlock
              fontSize={21}
              delay={s[4] + 10}
              lines={[
                'define("PID_CLASS_REGISTER",',
                '[',
                '    "CApplication" => ".pid/application.php",',
                '    "CMonApp" => "monapp.php"',
                ']);',
              ]}
            />
          </div>
          <Reveal delay={s[6]}>
            <Panel accent={C.amber} style={{ padding: 24 }}>
              <div style={{ fontSize: 24, lineHeight: 1.45 }}>
                <b style={{ color: C.amber }}>Remarque :</b> {code('monapp.php')} n'est trouvé via « MonApp.php »
                que parce que Windows ignore la casse. Sur un serveur Linux, il faudrait respecter la casse du nom.
              </div>
            </Panel>
          </Reveal>
        </div>
      </div>
    </SceneFrame>
  );
};

// ─── 06 · Singleton CApplication ───────────────────────────────────────────────

interface LaneProps {
  label: string;
  steps: { at: number; text: React.ReactNode; color?: string }[];
}

const Lane: React.FC<LaneProps> = ({ label, steps }) => {
  const frame = useCurrentFrame();
  return (
    <Panel style={{ width: 640, padding: 28 }}>
      <div style={{ fontFamily: MONO, fontSize: 24, color: C.cyan, marginBottom: 16 }}>{label}</div>
      {steps.map((st, i) => (
        <div
          key={i}
          style={{
            opacity: ramp(frame, st.at, 10),
            fontSize: 26,
            lineHeight: 1.45,
            color: st.color ?? C.ink,
            marginBottom: 10,
          }}
        >
          {st.text}
        </div>
      ))}
    </Panel>
  );
};

export const Singleton: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const stored = ramp(frame, 125, 15);
  const reused = frame >= 200 ? 0.5 + 0.5 * Math.sin((frame - 200) / 6) : 0;
  return (
    <SceneFrame
      chapter="06"
      title="CApplication : un singleton qui survit dans la session"
      duration={duration}
      source="_htdocs/.pid/application.php · CApplication::Instance()"
    >
      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        <Lane
          label="Requête HTTP n°1"
          steps={[
            { at: 15, text: <>{code('CApplication::Instance()')}</> },
            { at: 35, text: <>{code('$s_Instance')} vide → {code('session_start()')}</> },
            { at: 60, text: "Rien dans la session", color: C.muted },
            { at: 85, text: <>{code('new CMonApp(...$arguments)')} (classe lue dans la config)</> },
            { at: 110, text: <>Le constructeur s'enregistre : statique <b>et</b> session</>, color: C.green },
          ]}
        />
        <div style={{ width: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80 }}>
          <div style={{ fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 12 }}>$_SESSION</div>
          <div
            style={{
              width: 320,
              padding: 24,
              borderRadius: 16,
              border: `2px dashed ${C.amber}`,
              textAlign: 'center',
              fontFamily: MONO,
              fontSize: 22,
            }}
          >
            ["PID_APPLICATION"]
            <div
              style={{
                marginTop: 16,
                opacity: stored,
                transform: `scale(${0.8 + 0.2 * stored})`,
                padding: 16,
                borderRadius: 12,
                backgroundColor: 'rgba(246, 178, 90, 0.15)',
                color: C.amber,
                boxShadow: `0 0 ${30 * reused}px rgba(104, 211, 145, ${0.7 * reused})`,
              }}
            >
              objet CMonApp
            </div>
          </div>
        </div>
        <Lane
          label="Requête HTTP n°2"
          steps={[
            { at: 160, text: <>{code('CApplication::Instance()')}</> },
            { at: 180, text: <>{code('$s_Instance')} vide à nouveau → {code('session_start()')}</> },
            { at: 200, text: "Objet trouvé, de la bonne classe → réutilisé", color: C.green },
            { at: 225, text: <>PHP le désérialise et appelle {code('__wakeup()')} — aucun {code('new')}</> },
          ]}
        />
      </div>
      <Reveal delay={255}>
        <div style={{ display: 'flex', gap: 32, marginTop: 40 }}>
          <Panel accent={C.cyan} style={{ flex: 1, padding: 24 }}>
            <div style={{ fontSize: 26, lineHeight: 1.4 }}>
              Les propriétés <b>statiques</b> meurent à la fin de chaque requête : c'est la <b>session</b> qui
              garde l'application d'une page à l'autre, pour chaque visiteur.
            </div>
          </Panel>
          <Panel style={{ flex: 1, padding: 24 }}>
            <div style={{ fontSize: 26, lineHeight: 1.4, color: C.muted }}>
              Classe fille via {code('PID_APPLICATION_CLASSNAME')}, arguments via{' '}
              {code('PID_APPLICATION_INSTANCIATOR_ARGUMENTS')} et l'opérateur d'étalement {code('...')}.
            </div>
          </Panel>
        </div>
      </Reveal>
    </SceneFrame>
  );
};

// ─── 07 · CPage::WriteDocument ─────────────────────────────────────────────────

const PAGE_STEPS: { label: React.ReactNode; lines: number[] }[] = [
  { label: <>En-tête HTTP {code('content-type')} + charset</>, lines: [0] },
  { label: <>Doctype, {code('<html>')}, balises meta charset</>, lines: [1, 2, 3, 4, 5] },
  { label: <>CSS puis JS : ceux de l'application, puis ceux de la page</>, lines: [6] },
  { label: <>{code('<title>')} échappé par {code('IntoHtml')}</>, lines: [7] },
  { label: <>HEAD : contenu fourni, sinon le hook {code('WriteHead()')}</>, lines: [8] },
  { label: <>BODY : contenu fourni, sinon le hook {code('WriteBody()')}</>, lines: [9, 10, 11, 12, 13, 14] },
];

const HTML_OUT = [
  'HTTP ▸ content-type:text/html;charset=windows-1252',
  '<!doctype html>',
  '<html lang="be-fr">',
  '  <head>',
  '    <meta charset="windows-1252"/>',
  '    <meta http-equiv="content-type" content="…"/>',
  '    <!-- <link …/> et <script …> : aucun ici -->',
  '    <title>Liste de &lt;fruits&gt; &amp; légumes</title>',
  '  </head>',
  '  <body>',
  '    <h1>Liste de &lt;fruits&gt; &amp; légumes</h1>',
  '    <article>',
  '      <ol><li>Pomme</li><li>Poire</li> …</ol>',
  '    </article>',
  '  </body></html>',
];

const STEP_LEN = 45;
const STEP_START = 20;

export const Page: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const idx = Math.min(PAGE_STEPS.length - 1, Math.max(0, Math.floor((frame - STEP_START) / STEP_LEN)));
  const done = frame >= STEP_START + STEP_LEN * PAGE_STEPS.length;
  const shownLines = PAGE_STEPS.slice(0, idx + 1).flatMap((st) => st.lines);
  const lines = HTML_OUT.map((l, i) => (shownLines.includes(i) ? l : ''));

  return (
    <SceneFrame
      chapter="07"
      title="CPage::WriteDocument : produire la page, étape par étape"
      duration={duration}
      source="_htdocs/.pid/page.php · _htdocs/index.content.php"
    >
      <div style={{ display: 'flex', gap: 48 }}>
        <div style={{ width: 700, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PAGE_STEPS.map((st, i) => {
            const at = STEP_START + i * STEP_LEN;
            const active = !done && i === idx;
            return (
              <div
                key={i}
                style={{
                  opacity: ramp(frame, at, 10),
                  display: 'flex',
                  gap: 16,
                  alignItems: 'baseline',
                  fontSize: 26,
                  padding: '10px 16px',
                  borderRadius: 10,
                  backgroundColor: active ? 'rgba(79, 209, 197, 0.10)' : 'transparent',
                  borderLeft: `4px solid ${active ? C.cyan : C.panelEdge}`,
                }}
              >
                <span style={{ fontFamily: MONO, color: C.cyan }}>{i + 1}</span>
                <span>{st.label}</span>
              </div>
            );
          })}
          <Reveal delay={STEP_START + STEP_LEN * PAGE_STEPS.length}>
            <Panel accent={C.violet} style={{ padding: 22, marginTop: 12 }}>
              <div style={{ fontSize: 24, lineHeight: 1.45 }}>
                <b style={{ color: C.violet }}>Patron « méthode de gabarit »</b> : {code('CettePage extends CPage')}{' '}
                ne redéfinit que {code('WriteBody()')}. L'ordre du document reste imposé par la classe mère.
              </div>
            </Panel>
          </Reveal>
        </div>
        <CodeBlock
          plain
          fontSize={21}
          lines={lines}
          active={done ? undefined : PAGE_STEPS[idx].lines}
          style={{ flex: 1, color: C.ink }}
        />
      </div>
    </SceneFrame>
  );
};

// ─── 08 · Échappement HTML ─────────────────────────────────────────────────────

export const Escape: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const swallow = ramp(frame, 90, 20);
  return (
    <SceneFrame
      chapter="08"
      title="IntoHtml : ne jamais afficher une donnée brute"
      duration={duration}
      source="_htdocs/.pid/application.php · IntoHtml() / IntoAttr()"
    >
      <Reveal delay={10}>
        <div style={{ fontFamily: MONO, fontSize: 34, marginBottom: 40 }}>
          Donnée : <span style={{ color: C.amber }}>"Liste de &lt;fruits&gt; &amp; légumes"</span>
        </div>
      </Reveal>
      <div style={{ display: 'flex', gap: 40 }}>
        <Reveal delay={40} style={{ flex: 1 }}>
          <Panel accent={C.red}>
            <div style={{ fontSize: 26, color: C.red, marginBottom: 16 }}>✗ Sans échappement</div>
            <div style={{ fontFamily: MONO, fontSize: 26, color: C.muted }}>
              Le navigateur lit {'<fruits>'} comme une balise…
            </div>
            <div style={{ fontSize: 36, marginTop: 20 }}>
              Liste de{' '}
              <span style={{ opacity: 1 - swallow, fontFamily: MONO, color: C.red }}>&lt;fruits&gt;</span> &amp;
              légumes
            </div>
            <div style={{ fontSize: 24, color: C.muted, marginTop: 20, opacity: ramp(frame, 115, 12) }}>
              … le texte disparaît. Avec {code('<script>')}, il serait exécuté : faille XSS (injection de script
              dans la page).
            </div>
          </Panel>
        </Reveal>
        <Reveal delay={140} style={{ flex: 1 }}>
          <Panel accent={C.green}>
            <div style={{ fontSize: 26, color: C.green, marginBottom: 16 }}>✓ Avec IntoHtml()</div>
            <div style={{ fontFamily: MONO, fontSize: 24, color: C.muted }}>
              Liste de &amp;lt;fruits&amp;gt; &amp;amp; légumes
            </div>
            <div style={{ fontSize: 36, marginTop: 20 }}>Liste de &lt;fruits&gt; &amp; légumes</div>
            <div style={{ fontSize: 24, color: C.muted, marginTop: 20 }}>
              Affiché tel quel, jamais interprété.
            </div>
          </Panel>
        </Reveal>
      </div>
      <Reveal delay={190}>
        <div style={{ display: 'flex', gap: 24, marginTop: 40, alignItems: 'center' }}>
          <Tag color={C.amber}>&amp; → &amp;amp; en premier</Tag>
          <span style={{ fontSize: 26, color: C.muted }}>
            sinon le « &amp; » de « &amp;lt; » serait échappé une deuxième fois. {code('IntoAttr()')} échappe en
            plus {code('"')} et les retours à la ligne, pour les attributs.
          </span>
        </div>
      </Reveal>
    </SceneFrame>
  );
};

// ─── 09 · Pont vers Laravel ────────────────────────────────────────────────────

const BRIDGE = [
  ['.pid.config.php', '.env + config/'],
  ['index.php copié dans chaque dossier', 'un seul point d’entrée : public/index.php'],
  ['autoloader + .class.register.php', 'Composer (PSR-4) : le nom de classe donne le chemin'],
  ['CApplication en session', 'conteneur app(), reconstruit à chaque requête'],
  ['CPage + WriteBody()', 'vues Blade : @extends / @section'],
  ['IntoHtml()', '{{ }} échappe automatiquement'],
];

export const Bridge: React.FC<{ duration: number }> = ({ duration }) => (
  <SceneFrame
    chapter="09"
    title="Et dans le projet ? Le même mécanisme, côté Laravel"
    duration={duration}
    source="docs/academique/Laravel ↔ framework PID — Correspondances.md"
  >
    <div style={{ display: 'flex', fontSize: 24, color: C.muted, marginBottom: 16, fontFamily: MONO }}>
      <span style={{ width: 760 }}>COURS (écrit à la main)</span>
      <span>LARAVEL (fourni)</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {BRIDGE.map(([pid, lara], i) => (
        <Reveal key={pid} delay={20 + i * 22}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Panel style={{ width: 680, padding: '16px 24px', fontFamily: MONO, fontSize: 26 }}>{pid}</Panel>
            <span style={{ width: 80, textAlign: 'center', color: C.cyan, fontSize: 36 }}>⇄</span>
            <Panel accent={C.violet} style={{ flex: 1, padding: '16px 24px', fontSize: 26 }}>
              {lara}
            </Panel>
          </div>
        </Reveal>
      ))}
    </div>
    <Reveal delay={170}>
      <div style={{ fontSize: 28, color: C.muted, marginTop: 36 }}>
        À l'oral : partir du mécanisme vu en cours, puis dire ce que Laravel fait à sa place.{' '}
        <span style={{ color: C.amber }}>Correspondances à vérifier dès que Laravel sera installé.</span>
      </div>
    </Reveal>
  </SceneFrame>
);

// ─── 10 · Récapitulatif ────────────────────────────────────────────────────────

const CHAIN = ['Requête', 'index.php', 'racine', 'config', 'autoloader', 'CApplication', 'CPage', 'HTML'];

export const Recap: React.FC<{ duration: number }> = ({ duration }) => (
  <SceneFrame chapter="10" title="En résumé : le chemin d'une requête" duration={duration}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 80, flexWrap: 'nowrap' }}>
      {CHAIN.map((step, i) => (
        <React.Fragment key={step}>
          <Reveal delay={10 + i * 10} distance={40}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 26,
                padding: '18px 20px',
                borderRadius: 12,
                border: `2px solid ${i === 0 || i === CHAIN.length - 1 ? C.cyan : C.panelEdge}`,
                backgroundColor: C.panel,
              }}
            >
              {step}
            </div>
          </Reveal>
          {i < CHAIN.length - 1 ? (
            <Reveal delay={15 + i * 10}>
              <span style={{ color: C.dim, fontSize: 30 }}>→</span>
            </Reveal>
          ) : null}
        </React.Fragment>
      ))}
    </div>
    <div style={{ display: 'flex', gap: 40, marginTop: 100 }}>
      <Reveal delay={110} style={{ flex: 1 }}>
        <Panel accent={C.green}>
          <div style={{ fontSize: 26, color: C.green, marginBottom: 12 }}>Vu en cours (29/08 → 19/09)</div>
          <div style={{ fontSize: 26, lineHeight: 1.5 }}>
            POO en PHP : classes, héritage, singleton, trait, interface Iterator, hooks de gabarit.
          </div>
        </Panel>
      </Reveal>
      <Reveal delay={130} style={{ flex: 1 }}>
        <Panel accent={C.amber}>
          <div style={{ fontSize: 26, color: C.amber, marginBottom: 12 }}>Pas encore abordé</div>
          <div style={{ fontSize: 26, lineHeight: 1.5 }}>
            MySQL, comptes et rôles, sécurité des comptes, JavaScript/jQuery, AJAX.
          </div>
        </Panel>
      </Reveal>
    </div>
  </SceneFrame>
);
