pipeline {
    agent any

    stages {
        stage('Code Quality') {
            steps {
                bat '''
                where sonar-scanner >nul 2>nul || npm install -g sonar-scanner
                cd server
                npm ci
                npm run test:coverage
                cd ..
                sonar-scanner ^
                  -Dsonar.host.url=https://sonarcloud.io ^
                  -Dsonar.projectKey=bhanuja4776_HD ^
                  -Dsonar.organization=bhanuja4776 ^
                  -Dsonar.sources=server ^
                  -Dsonar.tests=server/tests ^
                  -Dsonar.javascript.lcov.reportPaths=server/coverage/lcov.info ^
                  -Dsonar.login=578955d67936c804bd61112ba8952e050c5f1df0
                '''
            }
        }
    }
}
