# Deploying RevHub to Amazon EC2

This guide walks you through setting up your AWS EC2 instance to host the RevHub application.

## Prerequisites
- An AWS Account
- A Docker Hub Account (to store your images)

## Step 1: Launch an EC2 Instance
1.  Go to AWS Console -> **EC2** -> **Launch Instance**.
2.  **Name**: RevHub-Server
3.  **OS Image**: Ubuntu Server 24.04 LTS (Recommended) or Amazon Linux 2023.
4.  **Instance Type**: `t2.medium` (Minimum) or `t2.large` (Recommended).
    *   *Note: `t2.micro` is too small for running 10+ Java microservices.*
5.  **Key Pair**: Create a new key pair (e.g., `revhub-key`) and **download the .pem file**.
6.  **Network Settings**:
    -   Allow SSH (Port 22)
    -   Allow HTTP (Port 80)
    -   **Important**: Edit Security Group to allow Custom TCP ports:
        -   `8090` (API Gateway)
        -   `4200` (Frontend Shell)
        -   `8500` (Consul - Optional, for debugging)
7.  **Storage**: Increase root volume to at least **20 GB**.
8.  Click **Launch Instance**.

## Step 2: Install Docker on EC2
1.  SSH into your instance:
    ```bash
    ssh -i revhub-key.pem ubuntu@<your-ec2-public-ip>
    ```
2.  Run the following commands to install Docker & Docker Compose:
    ```bash
    # Update packages
    sudo apt-get update
    
    # Install Docker
    sudo apt-get install -y docker.io
    
    # Start and Enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add user to docker group (avoids sudo)
    sudo usermod -aG docker $USER
    
    # Install Docker Compose
    sudo apt-get install -y docker-compose
    ```
3.  **Log out and log back in** for group changes to take effect.

## Step 3: Deployment Strategies

### Option A: Manual Deployment (Copy Files)
1.  Copy your `docker-compose.yml`, `docker-compose.frontend.yml` and `.env` files to the EC2 instance using SCP (or copy-paste via nano).
2.  Run:
    ```bash
    docker-compose -f docker-compose.yml up -d --build
    docker-compose -f docker-compose.frontend.yml up -d --build
    ```
    *Note: This builds from source on the server, which is slow and high CPU usage.*

### Option B: Automated Deployment via Jenkins (Recommended)
1.  **Configure Jenkins**:
    -   Add your Docker Hub credentials in Jenkins.
    -   Add your EC2 SSH Key (.pem) as a "SSH Username with private key" credential in Jenkins.
2.  **Update Jenkinsfile**:
    -   Uncomment the "Deploy to EC2" stage in the provided Jenkinsfile.
    -   Replace `YOUR_EC2_IP` with your actual EC2 Public IP.
    -   Replace `YOUR_DOCKERHUB_USER` with your Docker Hub username.
3.  **Run Pipeline**:
    -   Jenkins will build artifacts, build Docker images, push them to Docker Hub.
    -   Jenkins will SSH into EC2, pull those images, and restart the app.

## Troubleshooting
-   **Services Crashing?**: Check RAM usage with `htop` or `docker stats`. You might need a larger instance type.
-   **Cannot Connect?**: Verify specific ports (8090, 4200) are open in the AWS Security Group.
