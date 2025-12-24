pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME        = 'harsh4801'
        DOCKER_HUB_CREDENTIALS_ID  = 'docker-hub-token-id-new'
        EC2_SSH_CREDENTIALS_ID     = 'ec2-ssh-key-id'
        EC2_IP                     = '3.231.75.61'
        COMPOSE_PROJECT_NAME       = 'revhub_cicd'
    }

    tools {
        maven 'MAVEN3'
    }

    stages {

        stage('Initialize') {
            steps {
                echo 'Pipeline started'
            }
        }

        stage('Build Backend Microservices') {
            steps {
                script {
                    def services = [
                        'api-gateway',
                        'user-service',
                        'post-service',
                        'social-service',
                        'chat-service',
                        'feed-service',
                        'notification-service',
                        'search-service',
                        'saga-orchestrator'
                    ]

                    services.each { service ->
                        echo "Building ${service}"
                        dir("backend-services/${service}") {
                            if (isUnix()) {
                                sh 'mvn clean package -DskipTests'
                            } else {
                                bat 'mvn clean package -DskipTests'
                            }
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = [
                        'api-gateway',
                        'user-service',
                        'post-service',
                        'social-service',
                        'chat-service',
                        'feed-service',
                        'notification-service',
                        'search-service',
                        'saga-orchestrator'
                    ]

                    services.each { service ->
                        if (isUnix()) {
                            sh "docker-compose build ${service}"
                        } else {
                            bat "docker-compose build ${service}"
                        }
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: env.DOCKER_HUB_CREDENTIALS_ID,
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    script {
                        if (isUnix()) {
                            sh 'docker logout || true'
                            sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                            sh 'docker-compose push'
                        } else {
                            bat 'docker logout || exit 0'
                            bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                            bat 'docker-compose push'
                        }
                    }
                }
            }
        }

        stage('Deploy to EC2 (NON-BLOCKING)') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    unstable('EC2 deployment failed, build is still valid')

                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: env.EC2_SSH_CREDENTIALS_ID,
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USER'
                        )
                    ]) {
                        script {
                            if (isUnix()) {
                                sh """
                                    scp -o StrictHostKeyChecking=no -i \$SSH_KEY docker-compose.yml \
                                        \$SSH_USER@${EC2_IP}:/home/ubuntu/docker-compose.yml

                                    ssh -o StrictHostKeyChecking=no -i \$SSH_KEY \$SSH_USER@${EC2_IP} '
                                        docker-compose pull
                                        docker-compose down
                                        docker-compose up -d
                                    '
                                """
                            } else {
                                // --- WINDOWS DEPLOYMENT ---
                                
                                // 1. Copy key to local file (safest way to handle permissions)
                                bat 'copy /Y "%SSH_KEY%" private_key.pem'
                                
                                // 2. Fix Permissions: Remove inheritance, Grant Administrators Read-Only
                                // "Administrators" group is standard and includes Local System credentials
                                bat 'icacls private_key.pem /inheritance:r /grant:r Administrators:R'
                                
                                // 3. Deploy
                                bat """
                                    "C:\\Windows\\System32\\OpenSSH\\scp.exe" -o StrictHostKeyChecking=no -i private_key.pem docker-compose.yml ^
                                        %SSH_USER%@${EC2_IP}:/home/ubuntu/docker-compose.yml
                                """

                                bat """
                                    "C:\\Windows\\System32\\OpenSSH\\ssh.exe" -o StrictHostKeyChecking=no -i private_key.pem %SSH_USER%@${EC2_IP} ^
                                    "export DOCKER_HUB_USERNAME=${DOCKER_HUB_USERNAME} && docker-compose pull && docker-compose down && docker-compose up -d"
                                """
                                
                                // 4. Cleanup
                                bat 'del private_key.pem'
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build & Push successful'
        }
        unstable {
            echo 'EC2 deployment failed, but build is valid'
        }
        failure {
            echo 'Build failed'
        }
    }
}
