# Graph Report - .  (2026-09-12)

## Corpus Check
- Corpus is ~15,962 words - fits in a single context window. You may not need a graph.

## Summary
- 135 nodes · 133 edges · 45 communities (33 shown, 12 thin omitted)
- Extraction: 78% EXTRACTED · 20% INFERRED · 2% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.87)
- Token cost: 270,745 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Bootstrap & config racine (0509 + 1209)|Bootstrap & config racine (05/09 + 12/09)]]
- [[_COMMUNITY_Bootstrap PID & matieres prevues (2908 + 1209)|Bootstrap PID & matieres prevues (29/08 + 12/09)]]
- [[_COMMUNITY_Autoloader & fonctions PID_IncludePathTo|Autoloader & fonctions PID_Include/PathTo]]
- [[_COMMUNITY_Exercices dir1dir2 (1209) & grille d'examen|Exercices dir1/dir2 (12/09) & grille d'examen]]
- [[_COMMUNITY_Cahier des charges & modalites d'examen|Cahier des charges & modalites d'examen]]
- [[_COMMUNITY_Classe CPersonne (dir1trucmachin)|Classe CPersonne (dir1/truc/machin)]]
- [[_COMMUNITY_Classe CPersonne2 (dir1dir2)|Classe CPersonne2 (dir1/dir2)]]
- [[_COMMUNITY_Bootstrap dir1truc|Bootstrap dir1/truc]]
- [[_COMMUNITY_Bootstrap dir1trucmachin|Bootstrap dir1/truc/machin]]
- [[_COMMUNITY_Bootstrap racine _htdocs|Bootstrap racine _htdocs]]
- [[_COMMUNITY_Bootstrap dir1|Bootstrap dir1]]
- [[_COMMUNITY_Bootstrap dir1dir2|Bootstrap dir1/dir2]]
- [[_COMMUNITY_Bootstrap dir.0|Bootstrap dir.0]]
- [[_COMMUNITY_Classes Personne & test_poo (0509+1209)|Classes Personne & test_poo (05/09+12/09)]]
- [[_COMMUNITY_Methodes CPersonne2 (NomPrenomconstruct)|Methodes CPersonne2 (Nom/Prenom/construct)]]
- [[_COMMUNITY_Methodes CPersonne (NomPrenomconstruct)|Methodes CPersonne (Nom/Prenom/construct)]]
- [[_COMMUNITY_index.php (0509, dir.0)|index.php (05/09, dir.0)]]
- [[_COMMUNITY_index.php (0509, dir1dir2)|index.php (05/09, dir1/dir2)]]
- [[_COMMUNITY_index.php (0509, dir1truc)|index.php (05/09, dir1/truc)]]
- [[_COMMUNITY_index.php (0509, dir1trucmachin)|index.php (05/09, dir1/truc/machin)]]
- [[_COMMUNITY_Classe CAutre (0509)|Classe CAutre (05/09)]]
- [[_COMMUNITY_index.php (1209, dir.0)|index.php (12/09, dir.0)]]
- [[_COMMUNITY_Classe CAutre (dir1trucmachin)|Classe CAutre (dir1/truc/machin)]]
- [[_COMMUNITY_Evaluations (dossier de cours)|Evaluations (dossier de cours)]]

## God Nodes (most connected - your core abstractions)
1. `CPersonne2` - 5 edges
2. `CPersonne` - 5 edges
3. `index.php — PID Framework Core (05/09 root)` - 5 edges
4. `index.php — PID Framework Core with Existence-Check Retry (12/09 root)` - 5 edges
5. `PID bootstrap IIFE (dir1/dir2/index.php, 12/09)` - 5 edges
6. `Savoir et savoir-faire à maîtriser (16 points)` - 5 edges
7. `PID_PathTo()` - 4 edges
8. `PID_PathTo()` - 4 edges
9. `PID_PathTo()` - 4 edges
10. `PID_PathTo()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `CLAUDE.md (PID project instructions)` --conceptually_related_to--> `Capacités terminales du PID`  [INFERRED]
  CLAUDE.md → Suivit_Cours/Synthèse/PID.dossier.20260824.pdf
- `PID bootstrap IIFE (dir1/dir2/index.php, 12/09)` --conceptually_related_to--> `Squelette de site sécurisant l'accès (objectif pédagogique)`  [INFERRED]
  Suivit_Cours/12_09_2026/pid_avant_cours.20260912/_htdocs/dir1/dir2/index.php → Suivit_Cours/Synthèse/plan_du_cours.20260824 (1).txt
- `class CPersonne2` --conceptually_related_to--> `Savoir et savoir-faire à maîtriser (16 points)`  [INFERRED]
  Suivit_Cours/12_09_2026/pid_avant_cours.20260912/_htdocs/dir1/dir2/personne.php → Suivit_Cours/Synthèse/PID.dossier.20260824.pdf
- `Grille de cotation de l'examen` --conceptually_related_to--> `Savoir et savoir-faire à maîtriser (16 points)`  [INFERRED]
  Suivit_Cours/Synthèse/modalites_examen.20260824 (2).txt → Suivit_Cours/Synthèse/PID.dossier.20260824.pdf
- `PID bootstrap IIFE (dir1/dir2/index.php, 12/09)` --semantically_similar_to--> `PID bootstrap IIFE (dir1/truc/index.php, 12/09)`  [INFERRED] [semantically similar]
  Suivit_Cours/12_09_2026/pid_avant_cours.20260912/_htdocs/dir1/dir2/index.php → Suivit_Cours/12_09_2026/pid_avant_cours.20260912/_htdocs/dir1/truc/index.php

## Hyperedges (group relationships)
- **PID Class Autoloading Mechanism (05/09)** — pid0905_autoloader, pid0905_classregister, pid0905_fn_PID_Include, pid0905_pidconfig [INFERRED 0.85]
- **Self-Locating Root Bootstrap Pattern (per-directory index.php copies)** — pid0905_indexphp, pid0905_dir0_indexphp, pid0905_dir1_indexphp, pid0905_dir1dir2_indexphp, pid0905_dir1truc_indexphp, pid0905_dir1trucmachin_indexphp [INFERRED 0.85]
- **PID Framework Iterative Refinement Across Course Sessions** — pid0905_indexphp, pid0905_autoloader, pid0912_indexphp, pid0912_autoloader [INFERRED 0.85]
- **PID index.php bootstrap propagated across site tree via PID_SETUP_INDEX_FILES** — index_root_2908_bootstrap, index_dir1_2908_bootstrap, index_dir2_2908_bootstrap, index_dir2_1209_bootstrap, index_truc_1209_bootstrap, index_machin_1209_bootstrap [INFERRED 0.85]
- **Convergent site requirements across course synthesis documents** — dossier_modalites_certification, plan_cours_fonctionnalites, modalites_examen_consignes [INFERRED 0.85]
- **Repeated OOP class exercise pattern (Nom/Prenom accessor pattern)** — personne_dir2_CPersonne2, personne_machin_CPersonne, personne_machin_CAutre [INFERRED 0.75]

## Communities (45 total, 12 thin omitted)

### Community 0 - "Bootstrap & config racine (05/09 + 12/09)"
Cohesion: 0.19
Nodes (13): .class.register.php (05/09), dir1/index.content.php (05/09), dir1/index.php (05/09), dir1/truc/machin/personne.php — classes CAutre, CPersonne (05/09), index.content.php — Root Homepage (05/09), index.php — PID Framework Core (05/09 root), .pid.config.php (05/09), .class.register.php (12/09) (+5 more)

### Community 1 - "Bootstrap PID & matieres prevues (29/08 + 12/09)"
Cohesion: 0.24
Nodes (11): Matières prévues et modalités de l'UE, PID bootstrap IIFE (dir1/index.php, 29/08, pre-autoloader version), PID bootstrap IIFE (dir1/dir2/index.php, 12/09), PID bootstrap IIFE (dir1/dir2/index.php, 29/08, later-version anomaly), PID bootstrap IIFE (dir1/truc/machin/index.php, 12/09), PID bootstrap IIFE (root index.php, 29/08, pre-autoloader version), PID bootstrap IIFE (dir1/truc/index.php, 12/09), index.content.php — Page d'accueil du site (+3 more)

### Community 2 - "Autoloader & fonctions PID_Include/PathTo"
Cohesion: 0.2
Nodes (11): spl_autoload_register closure (05/09), dir1/dir2/a_inclure.php (05/09), dir1/dir2/page12.php — PID_PathTo/PID_Include Test (05/09), dir1/dir2/personne.php — class CPersonne2 (05/09), function PID_Include() (05/09), function PID_IncludeOnce() (05/09), function PID_PathTo() (05/09), spl_autoload_register closure with class_exists retry loop (12/09) (+3 more)

### Community 3 - "Exercices dir1/dir2 (12/09) & grille d'examen"
Cohesion: 0.24
Nodes (9): a_inclure.php (test include content), Savoir et savoir-faire à maîtriser (16 points), PID_Include(), PID_PathTo(), spl_autoload_register class/interface/trait autoloader, Grille de cotation de l'examen, page12.php (PID_PathTo/PID_Include test script), class CPersonne2 (+1 more)

### Community 4 - "Cahier des charges & modalites d'examen"
Cohesion: 0.25
Nodes (8): CLAUDE.md (PID project instructions), Capacités terminales du PID, Modalités de la certification (spécifications du site), Modalités d'évaluation menant à la certification (SR1-SR3 / DM1-DM6), JOURNAL.md (PID project journal), Consignes du site pour l'examen oral, Consignes du projet personnel d'examen, Fonctionnalités visées du squelette (comptes, sécurité, accès restreints)

### Community 7 - "Bootstrap dir1/truc"
Cohesion: 0.8
Nodes (3): PID_Include(), PID_IncludeOnce(), PID_PathTo()

### Community 8 - "Bootstrap dir1/truc/machin"
Cohesion: 0.8
Nodes (3): PID_Include(), PID_IncludeOnce(), PID_PathTo()

### Community 9 - "Bootstrap racine _htdocs"
Cohesion: 0.8
Nodes (3): PID_Include(), PID_IncludeOnce(), PID_PathTo()

### Community 10 - "Bootstrap dir1"
Cohesion: 0.8
Nodes (3): PID_Include(), PID_IncludeOnce(), PID_PathTo()

### Community 11 - "Bootstrap dir1/dir2"
Cohesion: 0.8
Nodes (3): PID_Include(), PID_IncludeOnce(), PID_PathTo()

### Community 12 - "Bootstrap dir.0"
Cohesion: 0.8
Nodes (3): PID_Include(), PID_IncludeOnce(), PID_PathTo()

### Community 13 - "Classes Personne & test_poo (05/09+12/09)"
Cohesion: 0.5
Nodes (4): class CPersonne (05/09), class CPersonne2 (05/09), dir.0/test_poo.php — POO Test Script (05/09), dir.0/test_poo.php — POO Test Script (12/09)

## Ambiguous Edges - Review These
- `dir1/dir2/page12.php — PID_PathTo/PID_Include Test (05/09)` → `dir1/dir2/personne.php — class CPersonne2 (05/09)`  [AMBIGUOUS]
  Suivit_Cours/05_09_2026/pid.20260905/_htdocs/dir1/dir2/personne.php · relation: conceptually_related_to
- `PID bootstrap IIFE (dir1/dir2/index.php, 12/09)` → `.pid.config.php (framework config, 29/08)`  [AMBIGUOUS]
  Suivit_Cours/12_09_2026/pid_avant_cours.20260912/_htdocs/dir1/dir2/index.php · relation: shares_data_with
- `PID bootstrap IIFE (root index.php, 29/08, pre-autoloader version)` → `PID bootstrap IIFE (dir1/dir2/index.php, 29/08, later-version anomaly)`  [AMBIGUOUS]
  Suivit_Cours/29_08_2026/pid.20260829/_htdocs/dir1/dir2/index.php · relation: semantically_similar_to

## Knowledge Gaps
- **25 isolated node(s):** `dir.0/index.php (05/09)`, `dir1/index.php (05/09)`, `dir1/dir2/a_inclure.php (05/09)`, `dir1/dir2/index.php (05/09)`, `dir1/dir2/personne.php — class CPersonne2 (05/09)` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `dir1/dir2/page12.php — PID_PathTo/PID_Include Test (05/09)` and `dir1/dir2/personne.php — class CPersonne2 (05/09)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `PID bootstrap IIFE (dir1/dir2/index.php, 12/09)` and `.pid.config.php (framework config, 29/08)`?**
  _Edge tagged AMBIGUOUS (relation: shares_data_with) - confidence is low._
- **What is the exact relationship between `PID bootstrap IIFE (root index.php, 29/08, pre-autoloader version)` and `PID bootstrap IIFE (dir1/dir2/index.php, 29/08, later-version anomaly)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `Savoir et savoir-faire à maîtriser (16 points)` connect `Exercices dir1/dir2 (12/09) & grille d'examen` to `Bootstrap PID & matieres prevues (29/08 + 12/09)`, `Cahier des charges & modalites d'examen`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `PID bootstrap IIFE (dir1/dir2/index.php, 12/09)` connect `Bootstrap PID & matieres prevues (29/08 + 12/09)` to `Exercices dir1/dir2 (12/09) & grille d'examen`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Modalités de la certification (spécifications du site)` connect `Cahier des charges & modalites d'examen` to `Exercices dir1/dir2 (12/09) & grille d'examen`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `PID bootstrap IIFE (dir1/dir2/index.php, 12/09)` (e.g. with `PID bootstrap IIFE (dir1/truc/index.php, 12/09)` and `PID bootstrap IIFE (dir1/dir2/index.php, 29/08, later-version anomaly)`) actually correct?**
  _`PID bootstrap IIFE (dir1/dir2/index.php, 12/09)` has 3 INFERRED edges - model-reasoned connections that need verification._