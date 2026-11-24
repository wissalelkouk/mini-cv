pipeline {
  agent any
  options {
    disableConcurrentBuilds()
    timeout(time: 120, unit: 'MINUTES')
  }

  environment {
    REGISTRY = "172.19.145.50:30500"
    IMAGE_API = "${REGISTRY}/portfolio/api"
    IMAGE_FRONTEND = "${REGISTRY}/portfolio/frontend"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script { env.GIT_SHA = sh(script: 'git rev-parse --short=7 HEAD', returnStdout: true).trim() }
        echo "Git SHA : ${env.GIT_SHA}"
      }
    }

    stage('Tests frontend') {
      steps {
        dir('portfolio-next') {
          sh 'node -v && npm -v && npm ci'
          sh 'npm test -- --ci'
        }
      }
    }

    stage('Tests API') {
      steps {
        dir('api') {
          sh 'npm ci'
          sh 'npm test'
        }
      }
    }

    stage('Gitleaks (secrets)') {
      steps {
        sh '''
          docker run --rm -v "$WORKSPACE:/repo" -w /repo --entrypoint sh zricethezav/gitleaks:latest \
            -c "git config --global --add safe.directory /repo && gitleaks detect --source /repo --redact --exit-code 1 --verbose"
        '''
      }
    }

    stage('Semgrep (SAST)') {
      steps {
        sh '''
          docker run --rm -v "$WORKSPACE:/src" semgrep/semgrep semgrep scan \
            --config p/javascript --config p/nodejs --metrics=off \
            --severity ERROR --error \
            --exclude node_modules --exclude .next portfolio-next api
        '''
      }
    }

    stage('npm audit') {
      steps {
        dir('portfolio-next') { sh 'npm audit --audit-level=critical' }
        dir('api')            { sh 'npm audit --audit-level=critical' }
      }
    }

    stage('OWASP Dependency-Check') {
      steps {
        withCredentials([string(credentialsId: 'nvd-api-key', variable: 'NVD_API_KEY')]) {
          sh '''
            mkdir -p reports && chmod 777 reports
            docker run --rm -e JAVA_OPTS="-Xmx1g" \
              -v "$WORKSPACE:/src" -v dc-data:/usr/share/dependency-check/data \
              owasp/dependency-check:latest \
              --scan /src/api/package-lock.json --scan /src/portfolio-next/package-lock.json \
              --format HTML --format JSON --out /src/reports \
              --failOnCVSS 9 --nvdApiKey "$NVD_API_KEY"
          '''
        }
      }
      post {
        always { archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true }
      }
    }

    stage('Build images Docker') {
      steps {
        sh '''
          docker build -t devsecops-portfolio:${GIT_SHA} -t devsecops-portfolio:latest --build-arg API_URL=http://api:4000 ./portfolio-next
          docker build -t devsecops-api:${GIT_SHA} -t devsecops-api:latest ./api
          docker images | grep -E "devsecops-(portfolio|api)"
        '''
      }
    }

    stage('Trivy (images)') {
      steps {
        sh '''
          for img in devsecops-portfolio devsecops-api; do
            docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache/ \
              aquasec/trivy:latest image --skip-db-update --timeout 10m --exit-code 0 --severity HIGH,CRITICAL --ignore-unfixed --no-progress $img:${GIT_SHA}
            docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache/ \
              aquasec/trivy:latest image --skip-db-update --timeout 10m --exit-code 1 --severity CRITICAL --ignore-unfixed --no-progress --quiet $img:${GIT_SHA}
          done
        '''
      }
    }

    // ============================================
    // AJOUTS POUR LA SECTION 41 (Activités 216-218)
    // ============================================

    stage('SBOM (Syft)') {
      steps {
        sh '''
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            anchore/syft:latest devsecops-portfolio:${GIT_SHA} -o spdx-json > sbom-frontend.json
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            anchore/syft:latest devsecops-api:${GIT_SHA} -o spdx-json > sbom-api.json
        '''
      }
      post {
        always { archiveArtifacts artifacts: 'sbom-*.json', allowEmptyArchive: true }
      }
    }

    stage('Push vers Zot') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'zot-admin', usernameVariable: 'ZOT_USER', passwordVariable: 'ZOT_PASS')]) {
          sh '''
            echo "$ZOT_PASS" | docker login ${REGISTRY} -u "$ZOT_USER" --password-stdin
            docker tag devsecops-portfolio:${GIT_SHA} ${IMAGE_FRONTEND}:${GIT_SHA}
            docker tag devsecops-api:${GIT_SHA}       ${IMAGE_API}:${GIT_SHA}
            docker push ${IMAGE_FRONTEND}:${GIT_SHA}
            docker push ${IMAGE_API}:${GIT_SHA}
          '''
        }
      }
    }

    stage('Signature Cosign') {
      steps {
        withCredentials([
          file(credentialsId: 'cosign-key', variable: 'COSIGN_KEY'),
          string(credentialsId: 'cosign-password', variable: 'COSIGN_PASSWORD')
        ]) {
          sh '''
            export COSIGN_PASSWORD
            cosign sign --key "$COSIGN_KEY" --yes ${IMAGE_FRONTEND}:${GIT_SHA}
            cosign sign --key "$COSIGN_KEY" --yes ${IMAGE_API}:${GIT_SHA}
          '''
        }
      }
    }

    stage('Mise à jour GitOps') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'github-gitops', usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
          sh '''
            rm -rf /tmp/gitops-repo
            git clone https://${GH_USER}:${GH_TOKEN}@github.com/wissalelkouk/devsecops-portfolio-gitops.git /tmp/gitops-repo
            cd /tmp/gitops-repo
            
            API_DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' ${IMAGE_API}:${GIT_SHA} | cut -d'@' -f2)
            FE_DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' ${IMAGE_FRONTEND}:${GIT_SHA} | cut -d'@' -f2)
            
            cd overlays/dev
            kustomize edit set image ${IMAGE_API}=${IMAGE_API}@${API_DIGEST}
            kustomize edit set image ${IMAGE_FRONTEND}=${IMAGE_FRONTEND}@${FE_DIGEST}
            
            cd /tmp/gitops-repo
            git config user.email "jenkins@local"
            git config user.name "Jenkins CI"
            git add .
            git commit -m "ci: mise à jour dev avec build ${GIT_SHA}" || echo "Rien à commiter"
            git push origin main
          '''
        }
      }
    }

    stage('Migration DB (PreSync)') {
      steps {
        sh '''
          kubectl -n portfolio delete job db-migration --ignore-not-found
          kubectl -n portfolio create job db-migration --image=${IMAGE_API}:${GIT_SHA} -- npm run migrate
          kubectl -n portfolio wait --for=condition=complete job/db-migration --timeout=120s
        '''
      }
    }
  }
}
