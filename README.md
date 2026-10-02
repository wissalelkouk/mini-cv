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
