# DevSecOps Portfolio

Évolution du mini CV en petit portfolio HTML5 / CSS3 / JavaScript, versionné avec Git et publié sur GitHub.

## Capture d'écran

**1. En-tête et About**

![Portfolio - partie 1](portfolio-1.png)

**2. Skills et Projects**

![Portfolio - partie 2](portfolio-2.png)

**3. Experience et Contact**

![Portfolio - partie 3](portfolio-3.png)

## Sections

About · Skills · Projects · Experience · Contact

## Section DevSecOps Skills (étape 8)

Une section **DevSecOps Skills** affiche les technologies de la chaîne DevSecOps : Git, Docker, Jenkins, Kubernetes, Ansible, Terraform et Argo CD.

- Chaque technologie est présentée sous forme de carte, avec une courte description.
- Un badge distingue ce qui a été **utilisé dans le projet** (Git, Docker, Jenkins) de ce qui est **en apprentissage** (Kubernetes, Ansible, Terraform, Argo CD).
- Un lien **DevSecOps** a été ajouté à la barre de navigation.

![Section DevSecOps Skills](portfolio-devsecops.png)

## Section Projects dynamique (étape 9)

La section **Projects** n'est plus écrite à la main en HTML : elle est **générée en JavaScript** à partir d'un tableau d'objets. Pour ajouter un projet, il suffit d'ajouter un objet au tableau.

Extrait de `script.js` :

```javascript
const projets = [
  {
    titre: "Serveur Jenkins",
    description: "Jenkins installé en service et accessible depuis la machine physique.",
    technologies: ["Jenkins", "Java", "CI/CD"],
  },
  {
    titre: "DevSecOps Portfolio",
    description: "Ce site : HTML5, CSS3 et JavaScript, versionné avec Git.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Git"],
    lien: "https://github.com/wissalelkouk/mini-cv",
  },
];

function creerCarte(projet) {
  const carte = document.createElement("article");
  carte.className = "card projet";

  const titre = document.createElement("h3");
  titre.textContent = projet.titre;
  // ... description, technologies et lien sont créés de la même façon

  carte.append(titre, description, tags);
  return carte;
}

const conteneurProjets = document.getElementById("projects-list");
projets.forEach((projet) => conteneurProjets.appendChild(creerCarte(projet)));
```

Les cartes sont construites avec `createElement` et `textContent`, sans `innerHTML` : le texte est traité comme du texte et non comme du HTML, ce qui évite l'injection de code. Le lien n'est affiché que s'il commence par `https://`.

![Section Projects générée en JavaScript](portfolio-projects.png)

## Principales améliorations

- **Structure multi-sections** : le CV d'une page devient un portfolio avec barre de navigation fixe et défilement fluide vers chaque section.
- **Compétences par catégories** : DevOps, Sécurité, Systèmes et réseaux, Web.
- **Projets** présentés sous forme de cartes (infrastructure, Jenkins, portfolio).
- **Parcours (Experience)** sous forme de frise chronologique.
- **Thème sombre ou clair**, mémorisé dans le navigateur.
- **Design responsive** : la page s'adapte aux écrans de téléphone.
- **Formulaire de contact** qui ouvre le client mail, sans envoyer de données à un serveur.
- **Approche sécurité (DevSecOps)** :
  - politique `Content-Security-Policy` : seuls les scripts et styles du site sont autorisés, pas de script en ligne ;
  - `referrer` désactivé ;
  - liens externes avec `rel="noopener noreferrer"` ;
  - champs du formulaire limités en longueur ;
  - aucun secret ni token dans le dépôt, push via clé SSH.

## Lancer le site

```bash
cd ~/mini-cv
python3 -m http.server 8000
```

Puis ouvrir `http://IP_DE_LA_VM:8000`.

## Commandes Git utilisées

```bash
git add .
git commit -m "Évolution du mini CV en DevSecOps Portfolio"
git push
```
