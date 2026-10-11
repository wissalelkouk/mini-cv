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
- Le formulaire de contact ouvre le client mail, sans envoyer de données à un serveur.
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

Pour vérifier que les réglages sont appliqués, j'ai interrogé la VM :

```bash
vagrant ssh -c "hostname; ip -4 a show | grep inet; free -h | head -2; nproc"
```

```
ubuntu-tp
    inet 192.168.121.123/24 ... scope global dynamic eth0
    inet 192.168.56.10/24 brd 192.168.56.255 scope global eth1
               total        used        free      shared  buff/cache   available
Mem:           1.4Gi       336Mi       1.1Gi       2.4Mi       194Mi       1.1Gi
2
```

Le nom est `ubuntu-tp`, l'adresse privée est `192.168.56.10`, la VM a 1,5 Go de RAM et 2 processeurs. Le message `[fog][WARNING] Unrecognized arguments: libvirt_ip_command` qui apparaît à chaque commande est un simple avertissement du plugin, sans effet sur le résultat.

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
