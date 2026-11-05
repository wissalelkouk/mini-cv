# Activité 5 : CI/CD sécurisé

Pipeline GitHub Actions pour `portfolio-next` (frontend Next.js), `api` (Express + Prisma) et `release` (semantic-release). Workflows : `ci.yml`, CodeQL, Dependabot, `commits.yml` (Conventional Commits) et `release.yml`. Les captures sont dans `captures/`.

## Avancement

| Tâches | Sujet | État |
|---|---|---|
| 70 | Tests frontend et API | Fait |
| 71 | Secrets, SAST, dépendances | Fait |
| 72, 73 | Build des images, scan Trivy | Fait (réserve : voir section 3) |
| 74 | CodeQL et comparaison avec Semgrep | Tableau à compléter (alertes CodeQL) |
| 75 | Dependabot | Fait |
| 76, 77 | Permissions, pinning par SHA | Fait |
| 78 | Comparaison avec Jenkins | Fait |
| 79 à 83 | Git workflow, protection de `main`, Conventional Commits, SemVer | Fait (contrôle Conventional Commits à ajouter aux contrôles requis) |
| 84 | semantic-release | Configuré, capture de la release à ajouter |
| 85 à 89 | Mesures, multi-stage, Buildx, multi-architecture | À faire |
| 90 à 95 | Harbor | À faire |
| 96 à 105 | SBOM, Cosign, attestations, SLSA, attaque simulée | À faire |

---

## 1. Tests CI (tâche 70)

Le workflow `ci.yml` lance les tests du frontend et de l'API sur chaque `push` sur `main` et sur chaque `pull_request`. Premier run vert sur la PR #1.

![CI #1 vert](captures/01-ci-tests-frontend-vert.png)

## 2. Secrets, SAST et audit des dépendances (tâche 71)

`ci.yml` contient six jobs : tests frontend, tests API, scan des secrets (Gitleaks), SAST (Semgrep), audit des dépendances (`npm audit`) et build des images Docker avec scan Trivy. Au premier essai, Semgrep et Trivy sont rouges.

![Jobs Semgrep et Trivy rouges](captures/02-jobs-semgrep-trivy-rouges.png)

**Semgrep** : 20 findings bloquants au premier run.

![Semgrep 20 findings](captures/03-semgrep-20-findings.png)

Au run suivant, Semgrep signale 16 findings, tous de la même règle : des actions référencées par un tag modifiable au lieu d'un SHA de commit. Ils sont corrigés par le pinning (section 9).

![Semgrep 16 findings](captures/05-semgrep-16-findings-tags-mutables.png)

## 3. Build des images et scan Trivy (tâches 72, 73)

Les deux images (frontend et API) sont construites avec Buildx, puis scannées par Trivy. Les rapports sont affichés dans le log et envoyés au format SARIF à l'onglet Security.

**Problèmes rencontrés :**

1. Le premier job de scan lançait Trivy sur des images construites dans un autre job. Chaque job tourne sur un nouveau runner : les images n'existent pas. Le build et les scans sont maintenant dans un seul job, `build-and-scan-images`.
2. L'action `trivy-action` a ensuite cessé de fonctionner : `@0.24.0` échoue en quelques secondes, et `@0.35.0` échoue à l'installation (code 6). Les fichiers `trivy-api.sarif` et `trivy-frontend.sarif` ne sont pas créés, et les étapes d'envoi échouent à leur tour.
3. Correction : Trivy est lancé depuis l'image officielle `ghcr.io/aquasecurity/trivy:0.69.3` avec `docker run`, sans action tierce. Les envois SARIF ne s'exécutent que si le fichier existe.

![Trivy, fichiers SARIF absents](captures/04-trivy-sarif-fichier-absent.png)

Systèmes détectés dans les images : frontend sur Alpine 3.24.3, API sur Debian 12.15.

![Logs Trivy](captures/08-trivy-scan-logs.png)

Résultats Trivy (vulnérabilités HIGH et CRITICAL par image) : à compléter.

**Limites actuelles :**

- les étapes Trivy utilisent `--exit-code 0` : le job échoue si Trivy plante, mais pas à cause d'une vulnérabilité ;
- l'image Trivy est référencée par un tag, pas par un digest.

## 4. CodeQL et comparaison avec Semgrep (tâche 74)

CodeQL est activé sur le dépôt. Il analyse les workflows (`actions`) et le code (`javascript-typescript`) sur chaque PR et chaque push sur `main`.

![CI vert sur la PR #2](captures/06-ci-pr2-vert-codeql.png)
![Analyses CodeQL](captures/07-codeql-analyses.png)
![CI sur main après fusion de la PR #2](captures/09-ci-main-merge-pr2.png)

| Sujet | Semgrep | CodeQL |
|---|---|---|
| Actions référencées par un tag mutable (`ci.yml`) | 16 alertes, une seule règle | à compléter |
| Configuration Dependabot sans `cooldown` | 5 alertes (une règle, 5 blocs) | à compléter |
| Code applicatif (API, Next.js) | 0 alerte | à compléter |
| Périmètre | règles `p/ci`, `p/javascript`, `p/typescript`, `p/owasp-top-ten` | analyses `actions` et `javascript-typescript` |

## 5. Dependabot (tâche 75)

La PR #3 ajoute `.github/dependabot.yml`. Son premier run échoue sur Semgrep, qui relève 5 findings sur la configuration (pas de `cooldown`). Après ajout d'un `cooldown` de 7 jours à chaque bloc, le run suivant est vert.

![PR Dependabot, Semgrep rouge](captures/10-pr-dependabot-config-semgrep-rouge.png)
![Semgrep, 5 findings cooldown](captures/11-semgrep-cooldown-5-findings.png)
![CI de la PR #3 verte](captures/12-ci-pr3-vert.png)

Dependabot surveille `portfolio-next`, `api`, les workflows GitHub Actions et les deux Dockerfile. L'onglet Dependency graph propose aussi un export SBOM.

![Dependency graph](captures/14-dependabot-graph.png)

Exemple de PR ouverte automatiquement par Dependabot (image `node` 22-alpine vers 25-alpine) :

![PR Dependabot #17](captures/15-dependabot-pr-17.png)

Certaines PR échouent sur les contrôles obligatoires, ce qui est le comportement voulu : une montée de version qui casse le projet n'est pas fusionnée.

![Contrôles en échec](captures/16-pr-dependabot-checks-en-echec.png)

Trois exemples de cassures :

- `npm ci` échoue sur un conflit de dépendances (`ERESOLVE`) quand `react-dom` est mis à jour seul ;
- les tests du frontend échouent car `react` et `react-dom` n'ont pas la même version ;
- le build de l'image API échoue à l'étape `RUN npx prisma generate`.

![Erreur npm ci](captures/17-dependabot-react-erreur-npm-ci.png)
![Tests frontend, version de React](captures/27-tests-frontend-react-version.png)
![Build API, Prisma](captures/26-build-api-prisma-echec.png)

Correction (PR #18) : `react` et `react-dom` sont mis à jour dans le même groupe, de même que `prisma` et `@prisma/*`, et les montées de version majeure de `node` sont ignorées pour les deux Dockerfile.

## 6. Git workflow (tâches 79 à 83)

### Convention de nommage des branches (tâche 79)

Format `<type>/<description-courte-en-kebab-case>`, avec les types de Conventional Commits : `feat/`, `fix/`, `ci/`, `chore/`, `docs/`. Exemples du dépôt : `ci/add-test-workflow`, `feat/add-api`, `chore/add-dependabot`, `ci/make-audit-blocking`, `fix/dockerfile-duplicate-env`. Dependabot crée ses branches sous la forme `dependabot/<écosystème>/<paquet>`.

Le flux est : branche, Pull Request, contrôles, fusion.

### Protection de `main` (tâche 80)

Le ruleset `protect-main` est actif, avec 4 règles sur `main`, dont : pas de suppression de la branche, Pull Request obligatoire avant fusion et contrôles obligatoires. La liste de contournement (bypass) est vide, donc la règle s'applique aussi au propriétaire du dépôt.

![Liste des rulesets](captures/19-ruleset-liste.png)
![Ruleset actif, bypass vide](captures/20-ruleset-actif-bypass-vide.png)
![Règles cochées](captures/21-ruleset-regles.png)

**Test : push direct refusé.** Un commit vide poussé sur `main` est rejeté (`GH013`) : les changements doivent passer par une Pull Request et les 6 contrôles obligatoires doivent être verts.

![Push direct refusé](captures/18-push-direct-refuse.png)

### Contrôles obligatoires avant fusion (tâche 81)

Six contrôles sont requis : tests frontend, tests API, scan des secrets, SAST, audit des dépendances, build et scan des images. Le contrôle Conventional Commits, apparu avec `commits.yml`, reste à ajouter à cette liste.

Tant que les contrôles ne sont pas passés, GitHub refuse la fusion.

![Fusion bloquée](captures/13-merge-bloque-regles.png)

La PR #21 rend le job `npm audit` bloquant (suppression de `continue-on-error`). Elle est fusionnée avec ses contrôles verts.

![PR #21 fusionnée](captures/22-pr21-fusionnee.png)

La PR #23 (`fix(deps): update release dependencies and audit them in ci`) ajoute l'audit du dossier `release/`. Elle est **bloquée par un contrôle en échec** : « Audit dépendances » est rouge, les 11 autres sont verts, et le bouton de fusion est désactivé.

![PR #23 bloquée](captures/24-pr23-bloquee-audit.png)

Le log montre 37 vulnérabilités (36 moderate, 1 high), dont `undici`, toutes sous `node_modules/npm/node_modules/`.

![Audit de release, undici](captures/25-audit-release-undici.png)

### Exception d'audit documentée

| Point | Contenu |
|---|---|
| Constat | 1 alerte high (`undici`) et 36 moderate, toutes sous `node_modules/npm/node_modules/` |
| Origine | `npm@11.21.1` embarqué dans `@semantic-release/npm@13.2.0`, dépendance de `semantic-release@25.0.9` |
| Pas de correction possible | `npm audit fix` ne modifie pas un paquet embarqué ; un override vers `npm@12.2.1` n'a rien changé (audit identique) |
| Pourquoi c'est acceptable | `.releaserc.json` ne charge que `commit-analyzer`, `release-notes-generator` et `github` : le plugin npm n'est pas utilisé (lecture de la configuration, pas test d'exécution) |
| Garde-fou | `.github/scripts/audit-release.js` reste bloquant pour toute autre alerte high ou critical et affiche ce qu'il ignore |

### Conventional Commits (tâche 82)

Le workflow `commits.yml` vérifie le message de chaque commit d'une Pull Request (types `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, avec `!` possible). Les préfixes de Dependabot (`chore(deps)`, `ci(deps)`) respectent ce format.

### Semantic Versioning (tâche 83)

Versions `MAJOR.MINOR.PATCH` : `fix` donne un PATCH, `feat` un MINOR, `feat!` ou `BREAKING CHANGE` un MAJOR. Les types `ci`, `chore` et `docs` ne déclenchent pas de release.

## 7. Release automatique (tâche 84)

`release.yml` lance semantic-release à chaque push sur `main` (plugins `commit-analyzer`, `release-notes-generator`, `github`). Il n'écrit aucun commit sur `main`, car le ruleset l'interdit : le changelog est dans la note de la release GitHub. Seul ce job reçoit `contents: write`. Les outils sont installés par `npm ci` depuis un `package-lock.json` verrouillé.

Le premier run est vert, mais ne publie rien tant qu'aucun commit `feat:` ou `fix:` n'est arrivé sur `main`. Les runs rouges de Dependabot (`/release` et `/portfolio-next`) sont visibles dans la même liste.

![Release et runs Dependabot](captures/23-release-workflow-et-dependabot.png)

À compléter : capture de la page Releases (tag `v1.0.0`).

## 8. Permissions du `GITHUB_TOKEN` (tâche 76)

`ci.yml` déclare `permissions: contents: read` pour tout le workflow. Chaque job n'ajoute que ce dont il a besoin : `security-events: write` pour l'envoi SARIF (Semgrep et Trivy), et `contents: write` (avec `issues` et `pull-requests`) uniquement pour le job Release.

## 9. Pinning par SHA et surface d'attaque (tâche 77)

Toutes les actions tierces sont référencées par un SHA de commit, avec la version en commentaire.

| Action | Version | SHA |
|---|---|---|
| `actions/checkout` | v4 | `11d5960a326750d5838078e36cf38b85af677262` |
| `actions/setup-node` | v4 | `49933ea5288caeca8642d1e84afbd3f7d6820020` |
| `docker/setup-buildx-action` | v3 | `8d2750c68a42422c14e847fe6c8ac0403b4cbd6f` |
| `docker/build-push-action` | v5 | `ca052bb54ab0790a636c9b5f226502c73d547a25` |
| `github/codeql-action/upload-sarif` | v4 | `1fc58d04a4d4374f921bdac573c3811c240f9c26` |
| `gitleaks/gitleaks-action` | v2 | `ff98106e4c7b2bc287b24eaf42907196329070c7` |

Semgrep a signalé les 16 références par tag (règle `github-actions-mutable-action-tag`). Dependabot met à jour ces SHA grâce au commentaire de version.

**Pourquoi la chaîne CI/CD est elle-même une surface d'attaque.** Un pipeline s'exécute avec des secrets et un jeton qui peut écrire dans le dépôt. Une action tierce, une image ou une dépendance du pipeline s'exécute avec ces droits : si elle est compromise, l'attaquant exécute du code dans notre chaîne de livraison. Un tag peut être déplacé par le propriétaire de l'action, un SHA de commit non. Cela justifie de réduire les permissions, d'épingler les versions et de contrôler les dépendances du pipeline lui-même (audit de `release/`). Cas vécu ici : la dépendance à `trivy-action` a cassé le pipeline, puis Trivy a été lancé depuis son image officielle.

## 10. Comparaison avec Jenkins (tâche 78)

| Critère | Jenkins (activité 4) | GitHub Actions |
|---|---|---|
| Exécution | serveur à installer et à maintenir sur la VM | runners hébergés par GitHub |
| Configuration | `Jenkinsfile` (Checkout, Install dependencies, Build) | YAML dans `.github/workflows` |
| Déclenchement | à configurer | `push` et `pull_request` natifs |
| Intégration aux branches | pas de lien avec les règles de fusion | contrôles obligatoires via le ruleset |
| Sécurité | secrets et plugins à gérer sur la VM | permissions du jeton par job, actions épinglables par SHA |

## 11. Dockerfiles : mesures avant/après (tâches 85 à 89)

Le Dockerfile du frontend est déjà multi-stage (`deps`, `build`, `run`). Celui de l'API est en une seule étape.

| Image | Taille | Temps de build | HIGH | CRITICAL |
|---|---|---|---|---|
| API avant | 882 Mo | à compléter | à compléter | à compléter |
| API après | à compléter | à compléter | à compléter | à compléter |
| Frontend avant | à compléter | à compléter | à compléter | à compléter |
| Frontend après | 334 Mo | 7 min 02 (sans cache) | à compléter | à compléter |

À faire : Dockerfile multi-stage de l'API, BuildKit/Buildx, image multi-architecture (`amd64`, `arm64`) et sortie de `docker buildx imagetools inspect`.

## 12. Registre privé Harbor (tâches 90 à 95)

À faire.

## 13. Software Supply Chain Security (tâches 96 à 105)

À faire : SBOM avec Syft, signature Cosign, attestations de build, provenance, SLSA et simulation d'attaque.

## Difficultés rencontrées

| Problème | Cause | Solution |
|---|---|---|
| Workflow invalide (« Invalid workflow file ») | Mauvaise indentation après un collage | Vérification de la syntaxe YAML avant chaque push |
| Tests frontend en échec | Test écrit pour Jest, script remplacé par Vitest | Retour au script Jest d'origine |
| Trivy en échec en quelques secondes | Images construites dans un autre job, puis `trivy-action` indisponible | Build et scan dans un même job, Trivy lancé depuis son image officielle |
| 16 alertes Semgrep | Actions référencées par tag | Pinning par SHA |
| PR Dependabot cassées | `react` et `react-dom` mis à jour séparément | Groupes dans `dependabot.yml` |
| Audit de `release/` en échec | `undici` embarqué dans le `npm` d'un plugin non utilisé | Exception limitée et documentée |
