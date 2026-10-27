pipeline {
  agent any
  options {
    disableConcurrentBuilds()
    timeout(time: 120, unit: 'MINUTES')
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
              aquasec/trivy:latest image --exit-code 0 --severity HIGH,CRITICAL --ignore-unfixed --no-progress $img:${GIT_SHA}
            docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache/ \
              aquasec/trivy:latest image --exit-code 1 --severity CRITICAL --ignore-unfixed --no-progress --quiet $img:${GIT_SHA}
          done
        '''
      }
    }
  }
}
