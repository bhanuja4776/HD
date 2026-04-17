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

        stage('Release') {
            when {
                branch 'main'
            }
            steps {
                bat '''
                setlocal enabledelayedexpansion

                for /f %%i in ('powershell -NoProfile -Command "(Get-Date).ToString('yyyyMMddHHmmss')"') do set RELEASE_VERSION=v1.0.%%i
                echo Releasing version !RELEASE_VERSION!

                git fetch --tags
                git rev-parse "!RELEASE_VERSION!" >nul 2>nul && (
                  echo Tag !RELEASE_VERSION! already exists. Skipping tag creation.
                ) || (
                  git tag "!RELEASE_VERSION!"
                  git push origin "!RELEASE_VERSION!"
                )

                docker compose down --remove-orphans
                docker compose up -d --remove-orphans
                docker compose ps

                endlocal
                '''
            }
        }
    }
}
