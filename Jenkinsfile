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
                    unstable('EC2 deployment failed, build is still successful')

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
                                // Windows Agent: Fix "Unprotected Private Key File" error
                                // 1. Copy key content to a local file
                                bat 'copy /Y "%SSH_KEY%" private_key.pem'
                                
                                // 2. Restrict permissions (Remove inheritance, Grant only current user read access)
                                // We use %USERNAME% which is the standard env var for the current user.
                                bat 'icacls private_key.pem /inheritance:r /grant:r "%USERNAME%":R'

                                // 3. Use the secured key file
                                bat """
                                    "C:\\Windows\\System32\\OpenSSH\\scp.exe" -o StrictHostKeyChecking=no -i private_key.pem docker-compose.yml ^
                                        %SSH_USER%@${EC2_IP}:/home/ubuntu/docker-compose.yml

                                    "C:\\Windows\\System32\\OpenSSH\\ssh.exe" -o StrictHostKeyChecking=no -i private_key.pem %SSH_USER%@${EC2_IP} ^
                                    "docker-compose pull && docker-compose down && docker-compose up -d"
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
