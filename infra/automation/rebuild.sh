#!/usr/bin/env bash
set -euo pipefail

ICI="$(cd "$(dirname "$0")" && pwd)"
VAGRANT_DIR="$HOME/mini-cv/vagrant-ubuntu"

echo "== 1. Suppression complète =="
(cd "$ICI" && terraform destroy -auto-approve)
(cd "$VAGRANT_DIR" && vagrant destroy -f)

echo "== 2. Reconstruction =="
(cd "$VAGRANT_DIR" && vagrant up)
(cd "$ICI" && terraform init -input=false && terraform apply -auto-approve)

echo "== 3. Vérification =="
(cd "$VAGRANT_DIR" && vagrant ssh -c "sudo k3s kubectl get nodes; docker --version")
aws --endpoint-url http://localhost:4566 s3 ls | grep mini-cv-auto
