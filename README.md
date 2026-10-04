# TP : Ubuntu Server, SSH, Docker et Jenkins

## Environnement

| Élément | Valeur |
|---|---|
| Hyperviseur | Hyper-V (VM génération 2) |
| Système invité | Ubuntu Server 26.04 LTS |
| Ressources de la VM | 2 vCPU, 4 Go de RAM (mémoire dynamique désactivée), 60 Go de disque |
| Machine physique | Windows (PowerShell) |
| Utilisateur de la VM | `wissal` |

---

## 1. Installation d'Ubuntu Server et accès SSH sécurisé

1. Créer la VM dans Hyper-V et installer Ubuntu Server 26.04 en cochant **Install OpenSSH server**.
2. Mettre à jour le système :
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
3. Activer le pare-feu en autorisant SSH :
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw enable
   sudo ufw status
   ```

![Pare-feu UFW](captures/ufw.png)

---

## 2. Test de l'accès SSH depuis la machine physique

Sur Windows (PowerShell) :

```powershell
ssh-keygen -t ed25519 -C "acces-vm"
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh wissal@IP_DE_LA_VM "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
ssh wissal@IP_DE_LA_VM
```

La connexion se fait avec la clé SSH, sans mot de passe utilisateur.

![Connexion SSH](captures/ssh.png)

---

## 3. Installation de Docker sur la VM

Installation via le dépôt officiel de Docker. Toutes les commandes sont lancées dans la VM, en SSH.

### Étape 1 : mettre à jour et installer les prérequis

```bash
sudo apt update
sudo apt install -y ca-certificates curl
```

### Étape 2 : ajouter la clé GPG officielle de Docker

```bash
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

### Étape 3 : ajouter le dépôt Docker

```bash
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

### Étape 4 : installer Docker

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Étape 5 : activer le service et utiliser Docker sans `sudo`

```bash
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

### Étape 6 : vérifier l'installation

```bash
docker --version
docker compose version
docker run hello-world
```

Le message `Hello from Docker!` confirme que l'installation fonctionne.

![Docker hello-world](captures/docker-hello-world.png)

### Problème rencontré : processus `Killed` pendant l'installation

Sur la première VM, `apt` était interrompu par le noyau (`Out of memory: Killed process ... (apt)` visible avec `sudo dmesg`).
Cause : la **mémoire dynamique** d'Hyper-V. Solution : VM éteinte, désactiver la mémoire dynamique et fixer 4 Go de RAM.

```powershell
Set-VMMemory -VMName "NOM_DE_LA_VM" -DynamicMemoryEnabled $false -StartupBytes 4GB
```

---

## 4. Installation de Jenkins

_À compléter._
