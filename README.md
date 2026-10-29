# DevSecOps Portfolio

**Wissal Elkouk** - étudiante en master DevOps Cloud

Dans ce projet, j'ai fait évoluer mon mini CV en un petit portfolio DevSecOps en HTML5, CSS3 et JavaScript. Le code est versionné avec Git et publié sur GitHub, et le site est servi par Nginx dans un conteneur Docker.

## Capture d'écran de la nouvelle version

**1. En-tête et About**

![Portfolio - partie 1](portfolio-1.png)

**2. Skills et Projects**

![Portfolio - partie 2](portfolio-2.png)

**3. Experience et Contact**

![Portfolio - partie 3](portfolio-3.png)

## Sections du portfolio

About, Skills, DevSecOps Skills, Projects, Experience, Contact.

## Principales améliorations

- Le CV d'une page est devenu un portfolio avec une barre de navigation et un défilement fluide vers chaque section.
- J'ai classé mes compétences par catégories : DevOps, Sécurité, Systèmes et réseaux, Web.
- Les projets sont présentés sous forme de cartes, et l'expérience sous forme de frise chronologique.
- J'ai ajouté un mode sombre et un mode clair, mémorisé dans le navigateur.
- Le site est responsive : il s'adapte aux écrans de téléphone.
- Le formulaire de contact envoie les données à l'API Express (voir Activité 4).
- J'ai ajouté des protections de sécurité :
  - une politique `Content-Security-Policy` qui n'autorise que les scripts et styles du site ;
  - des liens externes avec `rel="noopener noreferrer"` ;
  - aucun mot de passe ni token dans le dépôt, avec un push par clé SSH.

## Étape 8 : section DevSecOps Skills

J'ai ajouté une section **DevSecOps Skills** qui affiche les technologies de la chaîne DevSecOps : Git, Docker, Jenkins, Kubernetes, Ansible, Terraform et Argo CD.

Chaque technologie est une carte avec une courte description. Un badge indique ce que j'ai **utilisé dans le projet** (Git, Docker, Jenkins), ce que je maîtrise déjà (**compétence acquise** : Kubernetes) et ce que je suis encore **en train d'apprendre** (Ansible, Terraform, Argo CD). J'ai aussi ajouté un lien « DevSecOps » dans le menu.

![Section DevSecOps Skills](portfolio-devsecops.png)

## Étape 9 : section Projects générée en JavaScript

Au lieu d'écrire mes projets à la main en HTML, je les ai mis dans un **tableau d'objets** en JavaScript. Une fonction crée une carte pour chaque objet et l'affiche dans la page. Pour ajouter un projet, il me suffit d'ajouter un objet au tableau.

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
  // ... la description, les technologies et le lien sont créés de la même façon

  carte.append(titre, description, tags);
  return carte;
}

const conteneurProjets = document.getElementById("projects-list");
projets.forEach((projet) => conteneurProjets.appendChild(creerCarte(projet)));
```

J'ai utilisé `createElement` et `textContent` plutôt que `innerHTML`, pour que le texte soit traité comme du texte et non comme du HTML (cela évite l'injection de code).

![Section Projects générée en JavaScript](portfolio-projects.png)

## Étape 10 : Dockerfile avec Nginx

J'ai créé un `Dockerfile` pour servir mon portfolio avec Nginx dans un conteneur.

```dockerfile
FROM nginx:alpine
COPY index.html style.css script.js photo.jpg /usr/share/nginx/html/
EXPOSE 80
```

**Explication :**

- `FROM nginx:alpine` : je pars de l'image officielle de Nginx basée sur Alpine Linux. Elle est très légère, ce qui réduit aussi la surface d'attaque.
- `COPY ...` : je copie seulement les fichiers du site dans le dossier que Nginx sert par défaut (`/usr/share/nginx/html/`). Les captures, le README et le dossier `.git` ne sont pas dans l'image, grâce au fichier `.dockerignore`.
- `EXPOSE 80` : le conteneur écoute sur le port 80.
- Je n'ai pas besoin de commande de démarrage, car l'image Nginx lance déjà le serveur.

**Construire et lancer le conteneur :**

```bash
docker build -t devsecops-portfolio .
docker run -d --name portfolio -p 8081:80 devsecops-portfolio
```

J'ai utilisé le port 8081 de la VM, car le port 8080 est déjà pris par Jenkins. Le site est accessible sur `http://IP_DE_LA_VM:8081`.

## Étape 11 : image Docker `cv-docker`

J'ai construit l'image Docker à partir du `Dockerfile` de l'étape 10, en la nommant `cv-docker`.

**Commande utilisée :**

```bash
docker build -t cv-docker .
```

- `docker build` construit une image à partir d'un Dockerfile.
- `-t cv-docker` donne le nom (le « tag ») `cv-docker` à l'image.
- Le point `.` indique que le Dockerfile et les fichiers du site sont dans le dossier courant.

Pour vérifier que l'image existe :

```bash
docker images cv-docker
```

**Capture d'écran du résultat :**

Construction de l'image : la ligne `naming to docker.io/library/cv-docker:latest` confirme que l'image s'appelle bien `cv-docker`.

![Construction de l'image cv-docker](cv-docker-build.png)

Vérification avec `docker images cv-docker` : l'image `cv-docker:latest` existe (environ 94 Mo sur le disque).

![Image cv-docker dans docker images](cv-docker-images.png)

## Étape 12 : exécuter le conteneur et accéder au portfolio

J'ai lancé un conteneur à partir de l'image `cv-docker` en exposant le portfolio sur le port 8081 de la VM.

**Commande `docker run` :**

```bash
docker run -d --name cv-portfolio -p 8081:80 cv-docker
```

- `-d` : le conteneur tourne en arrière-plan.
- `--name cv-portfolio` : je donne un nom au conteneur.
- `-p 8081:80` : le port 8081 de la VM est relié au port 80 de Nginx dans le conteneur. J'ai pris le 8081 parce que le 8080 est déjà utilisé par Jenkins.
- `cv-docker` : l'image construite à l'étape 11.

![Commande docker run](docker-run.png)

**Résultat de `docker ps` :**

```
CONTAINER ID   IMAGE       COMMAND                  CREATED         STATUS         PORTS                                     NAMES
05c68f7fbd00   cv-docker   "/docker-entrypoint.…"   9 seconds ago   Up 9 seconds   0.0.0.0:8081->80/tcp, [::]:8081->80/tcp   cv-portfolio
```

Le conteneur `cv-portfolio` est en marche (`Up`) et le port 8081 de la VM est relié au port 80 du conteneur.

![Résultat de docker ps](docker-ps.png)

**Vérification depuis la machine physique :** dans le navigateur de Windows, j'ai ouvert `http://172.25.127.242:8081`. Le portfolio s'affiche, servi par Nginx depuis le conteneur.

![Portfolio affiché depuis la machine physique](portfolio-8081.png)

## Étape 13 : déploiement avec Docker Compose

J'ai déployé le portfolio avec Docker Compose. Au lieu de la longue commande `docker run`, les réglages sont écrits dans un fichier `docker-compose.yml`, et une seule commande lance tout.

**Fichier `docker-compose.yml` :**

```yaml
services:
  portfolio:
    build: .
    image: cv-docker
    container_name: cv-compose
    ports:
      - "8082:80"
    restart: unless-stopped
```

- `build: .` et `image: cv-docker` : le service utilise l'image `cv-docker` (construite à partir du Dockerfile si elle n'existe pas).
- `container_name: cv-compose` : le nom du conteneur.
- `ports: "8082:80"` : le port 8082 de la VM est relié au port 80 de Nginx. J'ai pris le 8082 parce que le 8081 est déjà utilisé par le conteneur de l'étape 12.
- `restart: unless-stopped` : le conteneur redémarre tout seul avec la VM.

**Commande utilisée :**

```bash
docker compose up -d
```

`up` crée et démarre les conteneurs décrits dans le fichier, et `-d` les lance en arrière-plan.

![Commande docker compose up -d](compose-up.png)

**Résultat de `docker compose ps` :**

```
NAME         IMAGE       COMMAND                  SERVICE     CREATED          STATUS          PORTS
cv-compose   cv-docker   "/docker-entrypoint.…"   portfolio   15 seconds ago   Up 14 seconds   0.0.0.0:8082->80/tcp, [::]:8082->80/tcp
```

Le service `portfolio` tourne dans le conteneur `cv-compose` (statut `Up`), et le port 8082 de la VM est relié au port 80.

![Résultat de docker compose ps](compose-ps.png)

**Capture d'écran :** le portfolio est accessible depuis la machine physique à l'adresse `http://172.25.127.242:8082`.

![Portfolio déployé avec Docker Compose](portfolio-8082.png)

## Étape 14 : publication des modifications sur GitHub via SSH

J'ai publié toutes les modifications du projet (Dockerfile, `docker-compose.yml`, README et captures) sur GitHub en utilisant ma clé SSH, sans mot de passe ni token.

**Commandes Git utilisées :**

```bash
cd ~/mini-cv
ssh -T git@github.com
git remote -v
git status
git add .
git commit -m "Etape 14 : publication des modifications via SSH"
git push
git log --oneline -5
```

- `ssh -T git@github.com` : teste que GitHub reconnaît ma clé SSH.
- `git remote -v` : vérifie que le dépôt utilise bien l'adresse SSH `git@github.com:wissalelkouk/mini-cv.git`.
- `git status` : liste les fichiers modifiés ou nouveaux.
- `git add .` : prépare tous les changements pour le commit.
- `git commit -m "..."` : enregistre les changements avec un message.
- `git push` : envoie les commits vers GitHub, par SSH.
- `git log --oneline -5` : affiche les derniers commits pour vérifier.

**Lien du dépôt GitHub mis à jour :**

https://github.com/wissalelkouk/mini-cv

## Étape 15 : installer Vagrant et créer une première VM

Pour automatiser la création de machines virtuelles, j'ai installé **Vagrant** dans ma VM Ubuntu Server. Vagrant crée une VM à partir d'un fichier texte, le `Vagrantfile`, avec une seule commande.

Ma VM tourne déjà dans Hyper-V : la VM créée par Vagrant est donc une VM dans une VM (virtualisation imbriquée). J'ai activé l'option côté Hyper-V (VM éteinte, PowerShell en administrateur) :

```powershell
Set-VMProcessor -VMName "ubuntu server 26" -ExposeVirtualizationExtensions $true
```

**Vérification des ressources (RAM, disque, virtualisation) :**

```bash
free -h
df -h /
nproc
ls -l /dev/kvm
```

**Installation de Vagrant** (dépôt officiel HashiCorp) :

```bash
wget -qO- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com noble main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update
sudo apt install -y vagrant
vagrant --version
```

Résultat : `Vagrant 2.4.9`. J'ai utilisé le dépôt `noble` (Ubuntu 24.04) car HashiCorp ne propose pas encore de paquets pour Ubuntu 26.04.

**Installation de KVM, libvirt et du plugin Vagrant :**

```bash
sudo apt install -y qemu-system-x86 libvirt-daemon-system libvirt-clients libvirt-dev \
  build-essential ruby-dev libxslt-dev libxml2-dev zlib1g-dev pkg-config dnsmasq-base
sudo usermod -aG libvirt,kvm $USER
vagrant plugin install vagrant-libvirt
export VAGRANT_DEFAULT_PROVIDER=libvirt
```

J'ai choisi KVM avec libvirt plutôt que VirtualBox : KVM fait partie du noyau Linux, alors que VirtualBox doit compiler un module pour le noyau de ma VM.

**Premier `Vagrantfile` :**

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "alvistack/ubuntu-24.04"
  config.vm.synced_folder ".", "/vagrant", disabled: true

  config.vm.provider :libvirt do |libvirt|
    libvirt.driver = "kvm"
    libvirt.memory = 1024
    libvirt.cpus = 1
  end
end
```

- `config.vm.box` : l'image Ubuntu Server utilisée comme point de départ.
- `synced_folder ... disabled: true` : désactive le partage de dossier avec la VM, inutile ici.
- `libvirt.memory` et `libvirt.cpus` : 1 Go de RAM et 1 processeur pour la VM Vagrant.

**Commande pour créer la VM :**

```bash
mkdir ~/vagrant-ubuntu && cd ~/vagrant-ubuntu
vagrant up
```

La première fois, Vagrant télécharge la box, puis crée et démarre la VM.

![Commande vagrant up](vagrant-up.png)

## Étape 16 : connexion à la VM avec `vagrant ssh`

Depuis la VM principale, dans le dossier du projet :

```bash
vagrant ssh
```

Résultat : l'invite change et devient `vagrant@ubuntu:~$`. Je suis dans la VM créée par Vagrant. Pour le vérifier, j'ai affiché sa mémoire :

```
vagrant@ubuntu:~$ free -h
               total        used        free      shared  buff/cache   available
Mem:           962Mi       317Mi       595Mi       2.4Mi       192Mi       644Mi
```

La VM a bien 1 Go de RAM, comme dans le Vagrantfile. Je sors avec `exit`.

![Connexion avec vagrant ssh](vagrant-ssh.png)

**Comparaison avec la création manuelle de la VM :**

| Critère | VM créée à la main (Hyper-V) | VM créée avec Vagrant |
|---|---|---|
| Création | Plusieurs étapes dans l'interface, puis l'installateur d'Ubuntu | Une commande : `vagrant up` |
| Durée | Environ 20 à 30 minutes | Quelques minutes, surtout le téléchargement de la box |
| Reproductibilité | Les réglages dépendent de ce dont je me souviens | Le `Vagrantfile` décrit tout et peut être versionné avec Git |
| Risque d'erreur | Oublis possibles (RAM, ISO, SSH, clavier) | Résultat identique à chaque lancement |
| Accès | Configurer SSH, l'utilisateur et le mot de passe | `vagrant ssh`, sans rien configurer |
| Suppression | Manuelle | `vagrant destroy` |

La création manuelle donne plus de contrôle, par exemple sur le partitionnement. Vagrant est bien plus rapide et reproductible, ce qui convient à l'automatisation.

## Étape 17 : configuration automatique de la VM

J'ai modifié le `Vagrantfile` pour fixer le nom de la VM, son adresse IP privée, sa mémoire et son nombre de processeurs :

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "alvistack/ubuntu-24.04"
  config.vm.define "ubuntu-tp"
  config.vm.hostname = "ubuntu-tp"
  config.vm.network "private_network", ip: "192.168.56.10"
  config.vm.synced_folder ".", "/vagrant", disabled: true

  config.vm.provider :libvirt do |libvirt|
    libvirt.driver = "kvm"
    libvirt.memory = 1536
    libvirt.cpus = 2
  end
end
```

- `config.vm.define "ubuntu-tp"` et `config.vm.hostname` : le nom de la VM.
- `config.vm.network "private_network", ip: ...` : l'adresse IP privée `192.168.56.10`.
- `libvirt.memory = 1536` : 1,5 Go de RAM.
- `libvirt.cpus = 2` : deux processeurs.

J'ai supprimé l'ancienne VM puis recréé la nouvelle :

```bash
vagrant destroy -f
vagrant up
vagrant status
```

Fin de `vagrant up` :

```
==> ubuntu-tp: Machine booted and ready!
==> ubuntu-tp: Setting hostname...
==> ubuntu-tp: Configuring and enabling network interfaces...
```

Résultat de `vagrant status` :

```
Current machine states:

ubuntu-tp                 running (libvirt)
```

![Résultat de vagrant status](vagrant-status.png)

Pour vérifier que les réglages sont appliqués, j'ai interrogé la VM :

```bash
vagrant ssh -c "hostname; ip -4 a show | grep inet; free -h | head -2; nproc"
```

```
ubuntu-tp
    inet 192.168.121.81/24 ... scope global dynamic eth0
    inet 192.168.56.10/24 brd 192.168.56.255 scope global eth1
               total        used        free      shared  buff/cache   available
Mem:           1.4Gi       336Mi       1.1Gi       2.4Mi       194Mi       1.1Gi
2
```

![Vérification des réglages de la VM](vagrant-config.png)

Le nom est `ubuntu-tp`, l'adresse privée est `192.168.56.10`, la VM a 1,5 Go de RAM et 2 processeurs. Le message `[fog][WARNING] Unrecognized arguments: libvirt_ip_command` qui apparaît à chaque commande est un simple avertissement du plugin, sans effet sur le résultat.

## Activité 2 - V. Migration du Portfolio vers Next.js

### Étape 18 : nouvelle version avec Next.js

J'ai créé le projet dans le dossier `portfolio-next` du dépôt, avec Node.js 22 :

```bash
npx create-next-app@latest portfolio-next --js --app --eslint --no-tailwind --no-src-dir --use-npm --import-alias "@/*"
```

- `--js` : JavaScript (sans TypeScript).
- `--app` : routeur « App Router », où chaque dossier de `app/` est une page.
- `--no-tailwind` : j'utilise mon propre CSS.
- `--import-alias "@/*"` : permet d'écrire `@/components/Header` pour importer un fichier.

J'ai conservé les mêmes sections que la version HTML : About, Skills (avec DevSecOps Skills), Projects, Experience et Contact.

Pour lancer l'application :

```bash
cd portfolio-next
npm run build
npm start -- -H 0.0.0.0 -p 3000
```

Elle est accessible depuis la machine physique sur `http://IP_DE_LA_VM:3000`.

![Application Next.js](captures/18-next-app.png)

### Étape 19 : composants réutilisables

J'ai découpé la page en composants, un fichier par partie :

```
portfolio-next/
├── app/
│   ├── layout.js          # structure commune : Header + page + Footer
│   ├── page.js            # page d'accueil : About, Skills, Projects, Experience, Contact
│   └── globals.css
├── components/
│   ├── Header.js          # barre de navigation
│   ├── About.js           # photo, nom, présentation
│   ├── Skills.js          # compétences et DevSecOps Skills
│   ├── Projects.js        # cartes des projets
│   ├── Experience.js      # frise chronologique
│   ├── Contact.js         # e-mail et GitHub
│   └── Footer.js          # pied de page
└── data/
    ├── projects.js
    ├── skills.js
    └── experience.js
```

`Header` et `Footer` sont placés une seule fois dans `app/layout.js`, donc ils apparaissent sur toutes les pages. `app/page.js` assemble les autres composants :

```javascript
export default function Home() {
  return (
    <>
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </>
  );
}
```

![Structure des composants](captures/19-structure.png)

### Étape 20 : données séparées

Les informations des projets et des compétences ne sont plus écrites dans les composants : elles sont dans le dossier `data/`. Exemple, `data/projects.js` :

```javascript
export const projects = [
  {
    slug: "docker-nginx",
    title: "Portfolio avec Docker et Nginx",
    description: "Image Docker et déploiement avec Docker Compose.",
    details: "Un Dockerfile sert le portfolio avec Nginx, puis docker compose up -d le déploie sur la VM.",
    technologies: ["Docker", "Nginx", "Docker Compose"],
  },
  // ... autres projets
];
```

Le composant `Projects` importe ces données et crée une carte pour chaque objet :

```javascript
import { projects } from "@/data/projects";

{projects.map((p) => (
  <article className="card" key={p.slug}>
    <h3>{p.title}</h3>
    <p>{p.description}</p>
  </article>
))}
```

Pour ajouter un projet, il suffit d'ajouter un objet dans `data/projects.js`, sans toucher aux composants.

![Fichier de données](captures/20-donnees.png)

### Étape 21 : pages dédiées aux projets

J'ai ajouté deux routes :

| Route | Fichier | Rôle |
|---|---|---|
| `/projects` | `app/projects/page.js` | Liste de tous les projets |
| `/projects/nom-du-projet` | `app/projects/[slug]/page.js` | Page d'un projet |

Le dossier `[slug]` est une **route dynamique** : la partie de l'adresse après `/projects/` (par exemple `docker-nginx`) est lue dans `params`, puis le projet correspondant est cherché dans `data/projects.js`. Si le nom n'existe pas, la page affiche une erreur 404.

```javascript
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  // affiche le titre, les détails et les technologies
}
```

`generateStaticParams` indique à Next.js de générer à l'avance une page pour chaque projet pendant le build.

![Page /projects](captures/21-projects.png)

![Page /projects/docker-nginx](captures/21-projet-detail.png)

## Activité 2 - VI. Premier pipeline Jenkins

Le `Jenkinsfile` est à la racine du dépôt. J'ai créé un job Jenkins de type **Pipeline**, avec la définition **Pipeline script from SCM** : Git, l'adresse `https://github.com/wissalelkouk/mini-cv.git`, la branche `*/main` et le chemin `Jenkinsfile`. Node.js est installé sur la VM, donc Jenkins peut utiliser `npm` directement.

### Étape 22 : récupérer le dépôt GitHub

```groovy
pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'ls -la'
      }
    }
  }
}
```

`checkout scm` récupère le dépôt configuré dans le job. `ls -la` affiche les fichiers récupérés.

![Pipeline exécuté](captures/22-pipeline.png)

### Étape 23 : installer les dépendances

J'ai ajouté un stage qui installe les dépendances dans `portfolio-next` :

```groovy
    stage('Install dependencies') {
      steps {
        dir('portfolio-next') {
          sh 'node -v && npm -v && npm ci'
        }
      }
    }
```

`dir('portfolio-next')` se place dans le dossier du projet Next.js. `npm ci` installe exactement les versions du fichier `package-lock.json`, ce qui rend le résultat reproductible.

![Stage Install dependencies](captures/23-stage-install.png)

### Étape 24 : construire l'application

J'ai ajouté le stage de build :

```groovy
    stage('Build') {
      steps {
        dir('portfolio-next') {
          sh 'npm run build'
        }
      }
    }
```

Le `Jenkinsfile` final contient les trois stages : Checkout, Install dependencies et Build.

```groovy
pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        dir('portfolio-next') {
          sh 'node -v && npm -v && npm ci'
        }
      }
    }

    stage('Build') {
      steps {
        dir('portfolio-next') {
          sh 'npm run build'
        }
      }
    }
  }
}
```

![Résultat du build](captures/24-build.png)

## Lancer le site sans Docker

```bash
python3 -m http.server 8000
```

Puis j'ouvre `http://IP_DE_LA_VM:8000` dans le navigateur.

## Commandes Git utilisées

```bash
git add .
git commit -m "Message du commit"
git push
```


---

## Activité 3 : Ansible, API Express et Docker Compose

Cette activité automatise l'administration d'un serveur avec Ansible, ajoute une API Node.js / Express au portfolio, puis exécute le frontend et l'API ensemble avec Docker Compose.

---

## VII. Automatisation avec Ansible

### Étape 25 : installer Ansible sur la VM d'administration

Ansible est installé sur la VM Ubuntu Server, qui sert de machine d'administration. Ansible n'a pas besoin d'agent sur les serveurs gérés : il se connecte en SSH.

```
sudo apt update
sudo apt install -y ansible
ansible --version
```

![Version d'Ansible](captures/act3-25-ansible-version.png)

### Étape 26 : inventaire et test de communication

Le serveur géré est la VM Ubuntu créée avec Vagrant (`ubuntu-tp`, IP `192.168.56.10`).

Fichier `ansible/inventory` :

```
[ubuntu]
192.168.56.10

[ubuntu:vars]
ansible_user=vagrant
ansible_ssh_private_key_file=~/vagrant-ubuntu/.vagrant/machines/ubuntu-tp/libvirt/private_key
```

Le fichier contient seulement le **chemin** de la clé privée, jamais la clé elle-même. Le dossier `.vagrant/` n'est pas versionné. Le fichier `ansible/ansible.cfg` indique `inventory = inventory`, donc l'option `-i` n'est pas nécessaire.

Avant le premier test, j'ai enregistré l'empreinte SSH du serveur :

```
ssh-keyscan -H 192.168.56.10 >> ~/.ssh/known_hosts
```

Commande de test, lancée depuis le dossier `ansible/` :

```
ansible all -m ping
```

La réponse `"ping": "pong"` prouve que la connexion SSH fonctionne et que Python est disponible sur le serveur.

![ansible all -m ping](captures/act3-26-ansible-ping.png)

### Étape 27 : premier playbook, installer git et curl

Fichier `ansible/install-git-curl.yml` :

```yaml
---
- name: Installer git et curl sur le serveur Ubuntu
  hosts: all
  become: true

  tasks:
    - name: Installer les paquets git et curl
      ansible.builtin.apt:
        name:
          - git
          - curl
        state: present
        update_cache: true
        cache_valid_time: 3600

    - name: Verifier la version de git
      ansible.builtin.command: git --version
      register: git_version
      changed_when: false

    - name: Afficher la version de git
      ansible.builtin.debug:
        msg: "{{ git_version.stdout }}"
```

- `become: true` : les tâches s'exécutent avec les droits `sudo`.
- `state: present` : le paquet doit être installé. S'il l'est déjà, Ansible ne fait rien.

```
ansible-playbook install-git-curl.yml
```

La capture ci-dessous montre une exécution où les paquets étaient déjà présents : `changed=0` et `failed=0`. C'est l'**idempotence** d'Ansible, qui relance le playbook sans rien modifier inutilement.

![Exécution du playbook git et curl](captures/act3-27-playbook-git-curl.png)

### Étape 28 : installer Docker automatiquement

Fichier `ansible/install-docker.yml`. Il ajoute le dépôt officiel de Docker (clé GPG et dépôt APT), installe Docker Engine et le plugin Compose, active le service et ajoute l'utilisateur `vagrant` au groupe `docker`.

```yaml
---
- name: Installer Docker sur une nouvelle VM Ubuntu
  hosts: all
  become: true

  vars:
    docker_user: vagrant

  tasks:
    - name: Installer les prerequis
      ansible.builtin.apt:
        name:
          - ca-certificates
          - curl
          - gnupg
        state: present
        update_cache: true

    - name: Creer le dossier des cles APT
      ansible.builtin.file:
        path: /etc/apt/keyrings
        state: directory
        mode: "0755"

    - name: Telecharger la cle GPG officielle de Docker
      ansible.builtin.get_url:
        url: https://download.docker.com/linux/ubuntu/gpg
        dest: /etc/apt/keyrings/docker.asc
        mode: "0644"

    - name: Ajouter le depot APT de Docker
      ansible.builtin.apt_repository:
        repo: >-
          deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc]
          https://download.docker.com/linux/ubuntu
          {{ ansible_facts['distribution_release'] }} stable
        filename: docker
        state: present

    - name: Installer Docker Engine et Compose
      ansible.builtin.apt:
        name:
          - docker-ce
          - docker-ce-cli
          - containerd.io
          - docker-buildx-plugin
          - docker-compose-plugin
        state: present
        update_cache: true

    - name: Demarrer et activer le service Docker
      ansible.builtin.service:
        name: docker
        state: started
        enabled: true

    - name: Ajouter l'utilisateur au groupe docker
      ansible.builtin.user:
        name: "{{ docker_user }}"
        groups: docker
        append: true

    - name: Verifier la version de Docker
      ansible.builtin.command: docker --version
      register: docker_version
      changed_when: false

    - name: Afficher la version de Docker
      ansible.builtin.debug:
        msg: "{{ docker_version.stdout }}"
```

```
ansible-playbook install-docker.yml
ansible all -m command -a "docker --version"
```

Le statut `CHANGED` du module `command` apparaît à chaque exécution : il ne signifie pas que Docker a été réinstallé.

![docker --version](captures/act3-28-docker-version.png)

---

## VIII. Création de l'API Node.js / Express

### Étape 29 : structure du projet et démarrage

L'API est dans le dossier `api/`. Elle a son propre `package.json` et se lance indépendamment du frontend.

```
api/
├── server.js          # routes Express
├── package.json
├── Dockerfile
├── .dockerignore
└── data/
    ├── profile.js
    ├── projects.js
    └── skills.js
```

Dépendances : `express` (serveur HTTP), `cors` (n'autorise qu'une origine précise) et `helmet` (en-têtes de sécurité HTTP).

```
cd api
npm install
npm start
```

![API démarrée](captures/act3-29-api-start.png)

### Étape 30 : route `GET /api/health`

Elle indique que l'API fonctionne. Elle sert aussi de test de santé (`healthcheck`) à Docker Compose.

```
curl http://localhost:4000/api/health
```

![Route health](captures/act3-30-health.png)

### Étape 31 : route `GET /api/profile`

Elle retourne les informations principales du portfolio : nom, titre, résumé et liens GitHub.

```
curl http://localhost:4000/api/profile
```

![Route profile](captures/act3-31-profile.png)

### Étape 32 : route `GET /api/projects`

Elle retourne la liste des projets du portfolio. Les données viennent de `api/data/projects.js`, copié depuis le frontend.

```
curl http://localhost:4000/api/projects
```

![Route projects](captures/act3-32-projects.png)

### Étape 33 : route `GET /api/skills`

Elle retourne les compétences en deux listes : `skills` (par catégorie) et `devsecops` (outils DevSecOps utilisés ou non).

```
curl http://localhost:4000/api/skills
```

Code de `api/server.js` :

```js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { profile } from "./data/profile.js";
import { projects } from "./data/projects.js";
import { skills, devsecops } from "./data/skills.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "devsecops-api",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/profile", (req, res) => res.json(profile));
app.get("/api/projects", (req, res) => res.json(projects));
app.get("/api/skills", (req, res) => res.json({ skills, devsecops }));

app.use((req, res) => res.status(404).json({ error: "Route introuvable" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API demarree sur le port ${PORT}`);
});
```

![Route skills](captures/act3-33-skills.png)

### Étape 34 : le frontend lit les projets depuis l'API

Un fichier `portfolio-next/lib/api.js` appelle l'API côté serveur. Le composant `Projects` devient asynchrone (Server Component) : il lit les projets depuis l'API au lieu de `data/projects.js`.

```js
import { connection } from "next/server";

// Appelé côté serveur : API_URL n'est jamais envoyée au navigateur.
const API_URL = process.env.API_URL || "http://localhost:4000";

async function get(path) {
  // Les données sont lues à chaque requête, pas pendant le build.
  await connection();
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API ${path} : erreur ${res.status}`);
  }
  return res.json();
}

export const getProjects = () => get("/api/projects");
export const getSkills = () => get("/api/skills");
```

Dans le composant : `const projects = await getProjects();`.

Le projet utilise Next.js 16 avec **Cache Components**, qui interdit `export const dynamic = "force-dynamic"`. J'ai donc utilisé `await connection()`, qui indique que les données sont lues à chaque requête, et j'ai entouré les composants d'un `<Suspense>` dans `app/page.js`. Ainsi, `npm run build` n'a pas besoin que l'API soit démarrée. Les pages `/projects/[slug]` utilisent encore les données locales.

![Projets affichés depuis l'API](captures/act3-34-projects-api.png)

### Étape 35 : le frontend lit les compétences depuis l'API

Même principe : `Skills` appelle `getSkills()`, qui retourne `{ skills, devsecops }`. Les sections « Skills » et « DevSecOps Skills » sont donc alimentées par l'API.

```js
const { skills, devsecops } = await getSkills();
```

![Compétences affichées depuis l'API](captures/act3-35-skills-api.png)

---

## IX. Variables d'environnement et configuration

### Étape 36 : variable `API_URL`

Le frontend lit l'adresse de l'API dans `process.env.API_URL`.

**Pourquoi l'URL de l'API ne doit pas être codée en dur ?**

- L'adresse change selon l'environnement : `http://localhost:4000` en développement, `http://api:4000` dans Docker Compose, une autre adresse en production.
- Avec une variable, on déploie la **même image** partout sans modifier le code ni reconstruire.
- Cela évite de publier des adresses internes sur GitHub. La même pratique s'applique ensuite aux clés et aux tokens.

`API_URL` n'a pas le préfixe `NEXT_PUBLIC_` : elle reste côté serveur et n'est pas envoyée au navigateur.

### Étape 37 : fichier `.env.example`

Fichier `.env.example` à la racine du dépôt :

```
# Copier ce fichier en .env (non versionne) puis adapter si besoin.
# URL de l'API vue par le frontend :
#   - avec Docker Compose : http://api:4000 (nom du service sur le reseau Compose)
#   - en local (npm run dev dans portfolio-next) : http://localhost:4000
API_URL=http://api:4000

# Port d'ecoute de l'API
PORT=4000

# Origine autorisee par CORS (utile seulement pour des appels depuis le navigateur)
CORS_ORIGIN=http://localhost:3000
```

Il ne contient aucun secret. Le vrai fichier `.env` est ignoré par Git (`.gitignore`).

---

## X. Dockerisation frontend + API

### Étape 38 : Dockerfile du frontend

Fichier `portfolio-next/Dockerfile`, en trois étapes (**multi-stage**) :

```dockerfile
# 1) Installation des dependances
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Build de l'application
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Image finale, minimale
FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
```

- `deps` installe les dépendances, `build` compile l'application, `run` ne garde que le résultat (mode `standalone` de Next.js, activé avec `output: "standalone"` dans `next.config.mjs`).
- L'image finale est plus légère : elle ne contient ni les sources ni les outils de build.
- Le conteneur s'exécute avec l'utilisateur `node`, non root.

**Variante utilisée sur ma VM : `Dockerfile.prebuilt`.** Le réseau de la VM faisait échouer `npm ci` dans Docker (`ETIMEDOUT` après plus de 800 secondes). J'ai donc construit l'image à partir du build `standalone` généré sur la VM par `npm run build`. Le `Dockerfile` multi-stage reste la méthode de référence sur un réseau normal.

```dockerfile
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0

COPY .next/standalone ./
COPY .next/static ./portfolio-next/.next/static
COPY public ./portfolio-next/public

USER node
EXPOSE 3000
CMD ["node", "portfolio-next/server.js"]
```

Le chemin `portfolio-next/server.js` vient du fait que Next.js a pris `mini-cv/` comme racine (deux `package-lock.json`). Cette variante demande de lancer `npm run build` dans `portfolio-next` avant de construire l'image.

### Étape 39 : Dockerfile de l'API

Fichier `api/Dockerfile` :

```dockerfile
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

USER node
EXPOSE 4000
CMD ["node", "server.js"]
```

- `package*.json` est copié avant le code : tant que les dépendances ne changent pas, Docker réutilise le cache.
- `--omit=dev` n'installe que les dépendances de production.
- Le conteneur tourne avec l'utilisateur `node`, non root, et expose le port 4000.

### Étape 40 : construire les deux images

```
# Frontend (depuis portfolio-next/, avec le build standalone déjà généré)
cd portfolio-next
npm run build
docker build -f Dockerfile.prebuilt -t devsecops-portfolio .

# API
cd ..
docker build --network=host -t devsecops-api ./api

docker images | grep devsecops
```

Avec un réseau normal, la première commande est simplement `docker build -t devsecops-portfolio ./portfolio-next`.

![Images Docker construites](captures/act3-40-images.png)

### Étape 41 : Docker Compose

Fichier `docker-compose.yml` :

```yaml
services:
  api:
    build: ./api
    image: devsecops-api
    container_name: devsecops-api
    environment:
      - PORT=${PORT:-4000}
      - CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:3000}
    ports:
      - "4000:4000"
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:4000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 5s
    restart: unless-stopped

  frontend:
    build:
      context: ./portfolio-next
      dockerfile: Dockerfile.prebuilt
    image: devsecops-portfolio
    container_name: devsecops-frontend
    environment:
      - API_URL=${API_URL:-http://api:4000}
    ports:
      - "3000:3000"
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped
```

- `api` et `frontend` sont deux services lancés ensemble par une seule commande.
- `API_URL=http://api:4000` : `api` est le nom du service, résolu par le DNS du réseau Compose.
- `healthcheck` sur l'API, et `depends_on` avec `condition: service_healthy` : le frontend ne démarre que lorsque l'API répond.
- Le test de santé utilise Node avec `127.0.0.1` : `wget` d'Alpine résout `localhost` en IPv6 alors que l'API écoute en IPv4, ce qui rendait le conteneur `unhealthy`.
- L'ancien fichier de l'étape 13 est conservé sous le nom `docker-compose.static.yml`.

```
cp .env.example .env
docker compose up -d
docker compose ps
```

La ligne `cv-compose` correspond au conteneur Nginx de l'étape 13, qui tourne toujours. Les deux nouveaux services sont `devsecops-api` (`healthy`) et `devsecops-frontend` (`Up`).

![docker compose ps](captures/act3-41-compose-ps.png)

### Étape 42 : communication frontend → API par le réseau Compose

Le frontend (conteneur `devsecops-frontend`) appelle l'API par `http://api:4000`, le nom du service sur le réseau interne créé par Compose, et non par `localhost`.

Preuve : la commande suivante s'exécute **dans le conteneur du frontend** et contacte l'API par son nom de service.

```
docker compose exec frontend wget -qO- http://api:4000/api/health
```

![Appel de l'API depuis le conteneur du frontend](captures/act3-42-portfolio-apihealth.png)

Le portfolio, servi par le conteneur sur le port 3000, affiche les données fournies par l'API (profil, compétences et section « DevSecOps Skills »).

![Portfolio affichant les données de l'API](captures/act3-42-portfolio-api.png)

---

# Activité 4 - Automatisation, API sécurisée, PostgreSQL, tests et pipeline DevSecOps

Dans cette activité, j'ai ajouté un backend Express sécurisé au portfolio, une base PostgreSQL, des tests automatisés, un déploiement automatique avec Vagrant et Ansible, et un pipeline Jenkins DevSecOps.

```
mini-cv/
├── .env.example  .gitignore  docker-compose.yml  Jenkinsfile
├── ansible/playbook.yml
├── api/              (Express, Prisma, tests Vitest)
├── portfolio-next/   (Next.js, tests Jest)
├── integration/      (test front -> API -> PostgreSQL)
└── vagrant-ubuntu/Vagrantfile
```

## 12. Évolution et sécurisation de l'API

### Étape 46 : route `POST /api/contact`

L'API Express est dans `api/`. La route `POST /api/contact` reçoit les données du formulaire de contact et les enregistre en base.

**Requête :**

```
curl -i -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Wissal","email":"wissal@example.com","message":"Bonjour, ceci est un test."}'
```

**Réponse (201 Created) :**

```
{"status":"ok","id":1}
```

### Étape 47 : formulaire Next.js connecté à l'API

Le composant `components/ContactForm.js` envoie les données en `POST` vers `/api/contact`. Une règle `rewrites` dans `next.config.mjs` redirige `/api/*` vers l'API Express : le navigateur n'appelle donc qu'un seul domaine, sans IP codée en dur et sans CORS.

**Capture d'un envoi réussi :**

![Formulaire de contact : envoi réussi](captures/act4/47-formulaire-envoye.png)

### Étape 48 : validation stricte avec Zod

Le schéma est dans `api/src/schemas.js`. Il fixe des longueurs minimales et maximales, vérifie le format de l'email et utilise `.strict()` pour refuser tout champ en trop (protection contre le mass assignment).

**Exemple de requête refusée (400) :**

```
curl -i -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"W","email":"x","message":"c"}'
```

```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"status":"error","message":"Données invalides","details":[{"champ":"name","message":"Too small: expected string to have >=2 characters"},{"champ":"email","message":"Invalid email address"},{"champ":"message","message":"Too small: expected string to have >=10 characters"}]}
```

![Formulaire : erreur de validation affichée](captures/act4/48-formulaire-erreur.png)

### Étape 49 : gestion centralisée des erreurs

Toutes les erreurs passent par un seul middleware (`api/src/errors.js`). Les erreurs 4xx renvoient un message clair, et toute erreur 5xx renvoie un message générique, sans stack trace ni détail technique.

**Exemple de réponse d'erreur (JSON invalide) :**

```
HTTP/1.1 400 Bad Request

{"status":"error","message":"JSON invalide"}
```

**Exemple de route inconnue :**

```
HTTP/1.1 404 Not Found

{"status":"error","message":"Route introuvable"}
```

### Étape 50 : headers de sécurité avec Helmet

`app.use(helmet())` dans `api/src/app.js`.

```
curl -I http://localhost:4000/api/health
```

```
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
```

### Étape 51 : rate limiting

`POST /api/contact` est limité à 5 requêtes par 15 minutes et par IP (`express-rate-limit`). La limite se règle avec la variable `RATE_LIMIT_MAX`. Au-delà, l'API répond 429.

```
for i in $(seq 1 7); do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" -d '{"name":"Wissal","email":"w@example.com","message":"Message de test"}'; done
```

**Exemple de réponse 429 :**

wissal@wissal:~/mini-cv$ curl -i -X POST http://localhost:4000/api/contact -H "Content-Type: application/json" -d '{"name":"Wissal","email":"w@example.com","message":"Message de test long"}'
HTTP/1.1 429 Too Many Requests
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Vary: Origin
RateLimit-Policy: 5;w=900
RateLimit: limit=5, remaining=0, reset=865
Retry-After: 865
Content-Type: application/json; charset=utf-8
Content-Length: 71
ETag: W/"47-krP0sGG8R3CSD6za1b4G60E2qxQ"
Date: Wed, 28 Oct 2026 12:04:34 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"status":"error","message":"Trop de requêtes, réessayez plus tard."}
```

### Étape 52 : OWASP API Security Top 10 (2023)

| Risque | Concerne mon API ? | Mesure en place ou prévue |
|---|---|---|
| API1 - Broken Object Level Authorization | Faible : aucune ressource propre à un utilisateur | Aucune route de lecture n'est exposée |
| API2 - Broken Authentication | Faible : seule route publique `POST /api/contact` | Prévu : authentification si j'ajoute une route d'administration |
| API3 - Broken Object Property Level Authorization | Oui | Zod `.strict()` : seuls `name`, `email` et `message` sont acceptés |
| API4 - Unrestricted Resource Consumption | Oui | Rate limiting, corps limité à 10 ko, longueurs maximales dans Zod |
| API5 - Broken Function Level Authorization | Faible | Aucune route d'administration |
| API6 - Unrestricted Access to Sensitive Business Flows | Oui (spam du formulaire) | Rate limiting ; prévu : honeypot ou captcha |
| API7 - Server Side Request Forgery | Non | L'API ne fait aucune requête sortante |
| API8 - Security Misconfiguration | Oui | Helmet, CORS restreint, erreurs génériques sans stack trace, secrets dans `.env` (non versionné) |
| API9 - Improper Inventory Management | Oui | Deux routes seulement, documentées ici ; prévu : préfixe `/api/v1` |
| API10 - Unsafe Consumption of APIs | Non | Aucune API tierce ; PostgreSQL non exposé publiquement (127.0.0.1) |

## 13. Base de données PostgreSQL

### Étape 53 : service PostgreSQL dans Docker Compose

```yaml
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      retries: 10
```

Le port 5432 n'est publié que sur `127.0.0.1` : la base n'est pas accessible depuis le réseau.

```
docker compose ps
```

```
[À COMPLÉTER : coller la sortie de docker compose ps avec db, api et frontend]
```

### Étape 54 : enregistrement des messages dans PostgreSQL

La route `POST /api/contact` enregistre le message avec Prisma (`prisma.message.create`). Prisma envoie des requêtes paramétrées, ce qui protège contre l'injection SQL.

```
docker compose exec db psql -U portfolio -d portfolio -c "SELECT * FROM contact_messages;"
```

```
 id |  name  |       email        |          message           |        createdAt
----+--------+--------------------+----------------------------+-------------------------
  1 | Wissal | wissal@example.com | Bonjour, ceci est un test. | 2026-10-26 22:40:17.669
(1 row)
```

![Données enregistrées dans la table](captures/act4/54-table-contact-messages.png)

### Étape 55 : migrations avec Prisma

Le modèle est dans `api/prisma/schema.prisma`. Première migration :

```
cd api
npx prisma migrate dev --name init
```

```
Applying migration `20261026192941_init`

The following migration(s) have been created and applied from new schema changes:

prisma/migrations/
  └─ 20261026192941_init/
    └─ migration.sql

Your database is now in sync with your schema.
```

Pour exécuter les migrations existantes (production, conteneur, base vierge) :

```
npx prisma migrate deploy
```

Le conteneur `api` exécute `npx prisma migrate deploy` à chaque démarrage, avant de lancer le serveur.

### Étape 56 : variables de connexion dans `.env.example`

```
POSTGRES_USER=portfolio
POSTGRES_PASSWORD=change_me
POSTGRES_DB=portfolio
DATABASE_URL=postgresql://portfolio:change_me@localhost:5432/portfolio
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX=5
```

Le vrai fichier `.env` n'est jamais versionné (il est dans `.gitignore`) : il est créé à partir de `.env.example`, avec un mot de passe généré.

## 14. Tests applicatifs

### Étape 57 : test automatisé du frontend

Jest et React Testing Library testent le composant `ContactForm` : envoi réussi, erreur de validation renvoyée par l'API, serveur injoignable.

```
cd portfolio-next
npm test
```

```
 PASS  __tests__/ContactForm.test.js
  ✓ envoie le formulaire à /api/contact et affiche la confirmation (1496 ms)
  ✓ affiche l'erreur de validation renvoyée par l'API (901 ms)
  ✓ affiche une erreur si le serveur est injoignable (544 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

### Étape 58 : test automatisé de l'API

Vitest et Supertest testent les routes de l'API (la base est simulée).

```
cd api
npm test
```

```
 ✓ tests/security.test.js (14 tests)
 ✓ tests/contact.test.js (4 tests)
 ✓ tests/ratelimit.test.js (1 test)

 Test Files  3 passed (3)
      Tests  19 passed (19)
```

**Tests du frontend :**

![Tests frontend réussis](captures/act4/58-tests-front.png)

**Tests de l'API :**

![Tests API réussis](captures/act4/58-tests-api.png)

### Étape 59 : entrées invalides, injections et requêtes malformées

Le fichier `api/tests/security.test.js` vérifie que l'API refuse (400) et n'enregistre rien dans les cas suivants :

| Cas testé | Résultat attendu |
|---|---|
| Corps vide, email invalide, nom trop court, message trop long | 400 |
| Champ en trop (`isAdmin: true`, mass assignment) | 400 |
| Type incorrect (nombre à la place d'un texte) | 400 |
| Opérateur NoSQL dans l'email (`{"$ne": null}`) | 400 |
| Injection SQL dans l'email (`a@b.com' OR '1'='1`) | 400 |
| JSON malformé | 400 |
| Mauvais `Content-Type` | 400 |
| Corps de plus de 10 ko | 413 |
| Dépassement de la limite de requêtes | 429 |
| Erreur de la base de données | 500 générique, sans fuite d'information |

Une injection SQL placée dans le champ `name` (`Robert'); DROP TABLE contact_messages;--`) est valide pour le schéma : elle est enregistrée comme simple texte, car Prisma utilise des requêtes paramétrées. Le test vérifie que la chaîne arrive à Prisma sans modification.

### Étape 60 : tests d'intégration front → API → PostgreSQL

Le test `integration/contact.integration.test.mjs` s'exécute sur la vraie pile Docker Compose : il envoie la requête au frontend, qui la transmet à l'API, puis il vérifie dans PostgreSQL que la ligne existe.

```
docker compose up -d
node --test integration/contact.integration.test.mjs
```

```
✔ le front répond (1960.331869ms)
✔ front -> API -> PostgreSQL : un message valide est enregistré (1909.586284ms)
✔ un message invalide est refusé et non enregistré (681.525103ms)
✔ une injection SQL est stockée comme simple texte, la table survit (553.704217ms)
ℹ tests 4
ℹ pass 4
ℹ fail 0
```

![Tests d'intégration réussis](captures/act4/60-tests-integration.png)

## 11. Infrastructure automatisée avec Vagrant + Ansible

### Étape 43 : playbook Ansible

Le playbook `ansible/playbook.yml` installe Docker, Docker Compose et Git sur la VM, ajoute un swap de 2 Go (le build de Next.js consomme de la mémoire), clone le dépôt, génère le fichier `.env` avec un mot de passe aléatoire pour PostgreSQL, puis lance `docker compose up -d --build` et attend que le portfolio réponde.

Commande utilisée :

```
cd vagrant-ubuntu
ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook \
  -i .vagrant/provisioners/ansible/inventory/vagrant_ansible_inventory \
  ../ansible/playbook.yml
```

**Portfolio accessible sur la VM créée par Vagrant (`http://192.168.56.10:3000`, via un tunnel SSH) :**

![Portfolio déployé par Ansible](captures/act4/43-portfolio-vm.png)

### Étape 44 : Vagrant lance Ansible automatiquement

J'ai ajouté un provisioner Ansible au `Vagrantfile` :

```ruby
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "../ansible/playbook.yml"
    ansible.compatibility_mode = "2.0"
  end
```

Résultat : `vagrant up` crée la VM, configure Ansible, installe Docker et déploie le portfolio, sans aucune autre commande.

![Automatisation complète avec vagrant up](captures/act4/44-vagrant-up-complet.png)

### Étape 45 : destruction et recréation de la VM

```
vagrant destroy -f
vagrant up
vagrant ssh -c "curl -sI http://localhost:3000 | head -1; docker ps --format '{{.Names}}\t{{.Status}}'"
```

Après la destruction, la VM est entièrement recréée et le portfolio est redéployé automatiquement, sans intervention manuelle.

![vagrant destroy](captures/act4/45-vagrant-destroy.png)

![Portfolio redéployé après vagrant up](captures/act4/45-portfolio-redeploye.png)

[À COMPLÉTER : durée totale mesurée du `vagrant up` après la destruction]

## 15. Jenkins : tests et images Docker

Le `Jenkinsfile` est à la racine du dépôt. Les stages s'enchaînent dans cet ordre : Checkout, Tests frontend, Tests API, Gitleaks, Semgrep, npm audit, OWASP Dependency-Check, Build images Docker, Trivy.

### Étape 61 : tests du frontend et de l'API dans Jenkins

Les stages « Tests frontend » (`npm ci` puis `npm test`) et « Tests API » (`npm ci` puis `npm test`) s'exécutent automatiquement à chaque build.

![Stages de tests dans Jenkins](captures/act4/61-stages-tests.png)

### Étape 62 : construction des images Docker

Le stage « Build images Docker » construit `devsecops-portfolio` et `devsecops-api`.

![Stage de construction des images](captures/act4/62-build-images.png)

### Étape 63 : le Git SHA comme tag des images

Le stage Checkout calcule le SHA court du commit avec `git rev-parse --short=7 HEAD`, puis les images sont taguées avec :

```
docker build -t devsecops-portfolio:${GIT_SHA} -t devsecops-portfolio:latest ./portfolio-next
docker build -t devsecops-api:${GIT_SHA} -t devsecops-api:latest ./api
```

Exemple d'images générées :

```
[À COMPLÉTER : coller la sortie de docker images | grep devsecops avec les tags SHA]
```

## 16. Pipeline DevSecOps Jenkins

| Étape | Outil | Question | Échec du pipeline si |
|---|---|---|---|
| Secrets | Gitleaks | 64 | un secret est détecté (`--exit-code 1`) |
| SAST | Semgrep | 65 | un résultat de sévérité ERROR est trouvé (`--error`) |
| Dépendances Node.js | `npm audit` | 66 | une vulnérabilité critique est trouvée (`--audit-level=critical`) |
| Dépendances (complément) | OWASP Dependency-Check | 67 | une dépendance a un score CVSS de 9 ou plus (`--failOnCVSS 9`) |
| Images Docker | Trivy | 68 | une vulnérabilité critique est trouvée (`--exit-code 1 --severity CRITICAL`) |

### Étapes 64 à 66 : Gitleaks, Semgrep et npm audit

Gitleaks, Semgrep et Trivy s'exécutent dans des conteneurs Docker, donc rien n'est à installer sur le serveur Jenkins.

[À COMPLÉTER : résultat de chaque stage dans le build réussi]

### Étape 67 : OWASP Dependency-Check

Le rapport HTML et JSON est archivé dans les artefacts du build (`reports/`). La base de vulnérabilités NVD est téléchargée avec une clé d'API stockée dans un credential Jenkins (`nvd-api-key`), jamais dans le dépôt.

**Exemple de dépendance vulnérable détectée** (build Jenkins #12 : 716 dépendances analysées, une seule avec une vulnérabilité connue) :

```
deepmerge 4.3.1 | GHSA-gcqx-w48m-w2h4 | sévérité : low | score CVSS : 5.3
```

Cette dépendance est transitive : elle est tirée par Jest (`jest` → `@jest/core` → `jest-config` → `deepmerge`) dans `portfolio-next`. C'est un outil de test (dépendance de développement), pas une bibliothèque utilisée à l'exécution du portfolio. Je ne la corrige pas moi-même : la mise à jour dépend de Jest. Je l'accepte pour l'instant, vu sa gravité faible, et je surveillerai les prochaines versions de Jest.

Elle est inférieure au seuil d'échec du pipeline (`--failOnCVSS 9`) : elle est signalée dans le rapport, mais elle ne bloque pas le build. Seules les vulnérabilités critiques font échouer le pipeline.

![Rapport Dependency-Check](captures/act4/67-dependency-check.png)

### Étape 68 : scan des images avec Trivy

Chaque image est scannée avec Trivy : un premier passage affiche le tableau des vulnérabilités HIGH et CRITICAL, un second échoue si une vulnérabilité CRITICAL corrigeable existe.

[À COMPLÉTER : résumé du scan Trivy]

### Étape 69 : le pipeline échoue sur une vulnérabilité critique ou un secret

Chaque outil renvoie un code d'erreur dès qu'il détecte un secret ou une vulnérabilité critique : Jenkins arrête alors le pipeline à ce stage.

**Pipeline réussi :**

![Pipeline réussi](captures/act4/69-pipeline-reussi.png)

**Pipeline volontairement échoué** (branche temporaire `demo-fail` avec `minimist@1.2.0`, une dépendance vulnérable) :

![Pipeline échoué](captures/act4/69-pipeline-echoue.png)

[À COMPLÉTER : nom du stage en échec et message d'erreur]
