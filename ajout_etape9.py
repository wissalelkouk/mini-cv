#!/usr/bin/env python3
"""Étape 9 : la section Projects est générée en JavaScript à partir d'un tableau d'objets."""
import re

JS = """
// Étape 9 : section Projects générée dynamiquement à partir d'un tableau d'objets
const projets = [
  {
    titre: "Infrastructure DevOps",
    description: "VM Ubuntu Server 26.04 sous Hyper-V, accès SSH par clé et pare-feu UFW.",
    technologies: ["Ubuntu", "SSH", "UFW", "Hyper-V"],
  },
  {
    titre: "Docker sur la VM",
    description: "Installation de Docker depuis le dépôt officiel et test avec hello-world.",
    technologies: ["Docker", "Linux"],
  },
  {
    titre: "Serveur Jenkins",
    description: "Jenkins installé en service et accessible depuis la machine physique.",
    technologies: ["Jenkins", "Java", "CI/CD"],
  },
  {
    titre: "Push GitHub via SSH",
    description: "Clé SSH ajoutée à GitHub, dépôt local configuré pour pousser sans mot de passe.",
    technologies: ["Git", "GitHub", "SSH"],
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

  const description = document.createElement("p");
  description.textContent = projet.description;

  const tags = document.createElement("ul");
  tags.className = "chips";
  projet.technologies.forEach((techno) => {
    const li = document.createElement("li");
    li.textContent = techno;
    tags.appendChild(li);
  });

  carte.append(titre, description, tags);

  if (projet.lien && projet.lien.startsWith("https://")) {
    const lien = document.createElement("a");
    lien.href = projet.lien;
    lien.target = "_blank";
    lien.rel = "noopener noreferrer";
    lien.textContent = "Voir sur GitHub";
    carte.appendChild(lien);
  }
  return carte;
}

const conteneurProjets = document.getElementById("projects-list");
projets.forEach((projet) => conteneurProjets.appendChild(creerCarte(projet)));
"""

CSS = """
/* Étape 9 : cartes Projects générées en JavaScript */
.projet { display: flex; flex-direction: column; gap: 8px; }
.projet h3 { margin: 0; }
.projet a { margin-top: auto; font-size: 0.9rem; }
"""

html = open("index.html", encoding="utf-8").read()
if 'id="projects-list"' in html:
    print("L'étape 9 est déjà appliquée : rien à faire.")
else:
    nouveau, n = re.subn(
        r'(<section id="projects">\s*<h2>Projects</h2>\s*)<div class="grid">.*?</div>(\s*</section>)',
        r'\1<div class="grid" id="projects-list"></div>\2',
        html, count=1, flags=re.DOTALL)
    assert n == 1, "Section Projects introuvable dans index.html"
    open("index.html", "w", encoding="utf-8").write(nouveau)
    with open("script.js", "a", encoding="utf-8") as f:
        f.write(JS)
    with open("style.css", "a", encoding="utf-8") as f:
        f.write(CSS)
    print("Section Projects dynamique ajoutée.")
