pipeline {
  agent any
  environment {
    NODE_VERSION = '18'
    DEPLOY_DIR = '/var/www/his-fe'
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Setup Node') {
      steps {
        sh 'node -v'
      }
    }
    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }
    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }
    stage('Test') {
      steps {
        sh 'npm run test -- --watchAll=false'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Deploy') {
      steps {
        sh '''
          rm -rf ${DEPLOY_DIR}/*
          cp -R build/* ${DEPLOY_DIR}/
        '''
      }
    }
  }
  post {
    always {
      cleanWs()
    }
    success {
      echo 'CI/CD pipeline completed successfully!'
    }
    failure {
      echo 'CI/CD pipeline failed.'
    }
  }
}
