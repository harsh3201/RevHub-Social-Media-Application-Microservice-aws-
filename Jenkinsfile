pipeline {
    agent any

    environment {
        // --- CONFIGURATION ---
        DOCKER_HUB_USERNAME = 'harsh4801' 
        DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-token-id-new'
        EC2_SSH_CREDENTIALS_ID = 'ec2-ssh-key-id'
        EC2_IP = '54.243.234.6' // Updated from new user screenshot
        
        COMPOSE_PROJECT_NAME = "revhub_cicd"
    }

    tools {
        // Requires 'Maven' to be configured in Jenkins Global Tool Configuration
        maven 'MAVEN3'
    }

    stages {
        stage('Initialize') {
            steps {
                echo 'Starting Pipeline...'
                script {
                     // Check env vars
                     if (!env.DOCKER_HUB_USERNAME) {
                         echo 'WARNING: DOCKER_HUB_USERNAME is not set. Images may fail to push properly if dependent on this var.'
                     }
                }
            }
        }

        stage('Build Backend Microservices') {
            steps {
                script {
                    def services = [
                        'api-gateway', 'user-service', 'post-service',
                        'social-service', 'chat-service', 'feed-service',
                        'notification-service', 'search-service', 'saga-orchestrator'
                    ]
                    services.each { service ->
                        echo "Building ${service}..."
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
                echo 'Building Docker Images (Backend Only - Frontend uses pre-built images)...'
                script {
                    // List of services EXACTLY as they appear in docker-compose.yml
                    def backendServices = [
                        'api-gateway', 'user-service', 'post-service',
                        'social-service', 'chat-service', 'feed-service',
                        'notification-service', 'search-service', 'saga-orchestrator'
                    ]
                    
                    if (isUnix()) {
                        // Build Backend Services one by one
                        backendServices.each { service ->
                            echo "Building Backend: ${service}..."
                            sh "docker-compose -f docker-compose.yml build ${service}"
                        }
                    } else {
                        // Build Backend Services one by one
                        backendServices.each { service ->
                            echo "Building Backend: ${service}..."
                            bat "docker-compose -f docker-compose.yml build ${service}"
                        }
                    }
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing Images to Docker Hub...'
                script {
                    withCredentials([
                        usernamePassword(
                            credentialsId: env.DOCKER_HUB_CREDENTIALS_ID,
                            usernameVariable: 'DOCKER_USER',
                            passwordVariable: 'DOCKER_PASS'
                        )
                        ]) {

                // ---- Windows Jenkins Agent ----
                        if (!isUnix()) {

                    // Always logout first to avoid cached bad credentials
                            bat 'docker logout || exit 0'

                    // Docker login using Jenkins credentials
                    bat '''
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    '''

                    // Services to push
                    def backendServices = [
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

                    backendServices.each { service ->
                        bat "docker-compose -f docker-compose.yml push ${service}"
                    }

                }
                // ---- Linux Jenkins Agent ----
                else {

                    sh 'docker logout || true'

                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''

                    def backendServices = [
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

                    backendServices.each { service ->
                        sh "docker-compose -f docker-compose.yml push ${service}"
                    }
                }
            }
        }
    }
}

        stage('Deploy to EC2') {
            steps {
                echo 'Deploying to EC2 Instance...'
                sshagent (credentials: ["${env.EC2_SSH_CREDENTIALS_ID}"]) {
                    // Copy Compose Files to EC2
                    sh "scp -o StrictHostKeyChecking=no docker-compose.yml ubuntu@${env.EC2_IP}:/home/ubuntu/docker-compose.yml"
                    // ssh into EC2 and run deployment script commands
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${env.EC2_IP} '
                            export DOCKER_HUB_USERNAME=${env.DOCKER_HUB_USERNAME}
                            
                            # Pull latest images (Backend matches pushed, Frontend matches Docker Hub latest)
                            docker-compose -f docker-compose.yml pull
                            
                            # Restart Stack
                            docker-compose -f docker-compose.yml down
                            docker-compose -f docker-compose.yml up -d
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo 'Deployment Failed.'
        }
    }
}
