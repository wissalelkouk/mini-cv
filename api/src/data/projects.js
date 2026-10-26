export const projects = [
  {
    slug: "infrastructure-devops",
    title: "Infrastructure DevOps",
    description: "VM Ubuntu Server sous Hyper-V, accès SSH par clé et pare-feu UFW.",
    details: "Installation d'Ubuntu Server 26.04, connexion SSH par clé depuis la machine physique et pare-feu UFW.",
    technologies: ["Ubuntu", "SSH", "UFW", "Hyper-V"],
  },
  {
    slug: "docker-nginx",
    title: "Portfolio avec Docker et Nginx",
    description: "Image Docker et déploiement avec Docker Compose.",
    details: "Un Dockerfile sert le portfolio avec Nginx, puis docker compose up -d le déploie sur la VM.",
    technologies: ["Docker", "Nginx", "Docker Compose"],
  },
  {
    slug: "jenkins-ci",
    title: "Serveur Jenkins",
    description: "Jenkins installé en service et pipeline CI.",
    details: "Jenkins récupère le dépôt GitHub, installe les dépendances et construit l'application Next.js.",
    technologies: ["Jenkins", "Pipeline", "CI/CD"],
  },
  {
    slug: "vagrant-vm",
    title: "VM automatisée avec Vagrant",
    description: "Création d'une VM Ubuntu avec un Vagrantfile.",
    details: "Un Vagrantfile fixe le nom, l'adresse IP privée, la mémoire et le nombre de CPU de la VM.",
    technologies: ["Vagrant", "KVM", "libvirt"],
  },
];
