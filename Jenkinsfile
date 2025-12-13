pipeline {
    agent any

    environment {
        // --- CONFIGURATION ---
        DOCKER_HUB_USERNAME = 'Harsh4801' 
        DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-token-id'
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
                echo 'Building Docker Images (Sequentially one-by-one to save resources)...'
                script {
                    // List of services EXACTLY as they appear in docker-compose.yml
                    def backendServices = [
                        'api-gateway', 'user-service', 'post-service',
                        'social-service', 'chat-service', 'feed-service',
                        'notification-service', 'search-service', 'saga-orchestrator'
                    ]
                    
                    def frontendServices = [
                        'shell-app', 'auth-microfrontend', 'profile-microfrontend',
                        'feed-microfrontend', 'chat-microfrontend', 'notifications-microfrontend'
                    ]

                    if (isUnix()) {
                        // Build Backend Services one by one
                        backendServices.each { service ->
                            echo "Building Backend: ${service}..."
                            sh "docker-compose -f docker-compose.yml build ${service}"
                        }
                        
                        // Build Frontend Services one by one
                        frontendServices.each { service ->
                            echo "Building Frontend: ${service}..."
                            sh "docker-compose -f docker-compose.frontend.yml build ${service}"
                        }
                    } else {
                        // Build Backend Services one by one
                        backendServices.each { service ->
                            echo "Building Backend: ${service}..."
                            bat "docker-compose -f docker-compose.yml build ${service}"
                        }
                        
                        // Build Frontend Services one by one
                        frontendServices.each { service ->
                            echo "Building Frontend: ${service}..."
                            bat "docker-compose -f docker-compose.frontend.yml build ${service}"
                        }
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing Images to Docker Hub...'
                script {
                    // Requires 'withCredentials' plugin in Jenkins
                    withCredentials([usernamePassword(credentialsId: "${env.DOCKER_HUB_CREDENTIALS_ID}", passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        if (isUnix()) {
                            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                            sh 'docker-compose -f docker-compose.yml push'
                            sh 'docker-compose -f docker-compose.frontend.yml push'
                        } else {
                            // POWERSHELL LOGIN STRATEGY (Best for Windows consistency)
                            // 1. Write password to file
                            writeFile file: 'docker_pass.txt', text: DOCKER_PASS
                            
                            // 2. Use PowerShell to check length (DEBUG) and login
                            powershell '''
                                $pass = Get-Content docker_pass.txt
                                Write-Host "DEBUG: Password length is $($pass.Length)"
                                Get-Content docker_pass.txt | docker login -u $env:DOCKER_USER --password-stdin
                            '''
                            
                            // 3. Cleanup
                            bat 'del docker_pass.txt'
                            
                            bat 'docker-compose -f docker-compose.yml push'
                            bat 'docker-compose -f docker-compose.frontend.yml push'
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
                    sh "scp -o StrictHostKeyChecking=no docker-compose.frontend.yml ubuntu@${env.EC2_IP}:/home/ubuntu/docker-compose.frontend.yml"
                    // ssh into EC2 and run deployment script commands
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${env.EC2_IP} '
                            export DOCKER_HUB_USERNAME=${env.DOCKER_HUB_USERNAME}
                            
                            # Pull latest images
                            docker-compose -f docker-compose.yml pull
                            docker-compose -f docker-compose.frontend.yml pull
                            
                            # Restart Backend
                            docker-compose -f docker-compose.yml down
                            docker-compose -f docker-compose.yml up -d
                            
                            # Restart Frontend
                            docker-compose -f docker-compose.frontend.yml down
                            docker-compose -f docker-compose.frontend.yml up -d
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
