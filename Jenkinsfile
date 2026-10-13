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
  }
}
