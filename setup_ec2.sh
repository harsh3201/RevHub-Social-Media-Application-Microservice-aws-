#!/bin/bash

# 1. Update Packages
echo "Updating packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. Install Docker & Utilities
echo "Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg lsb-release git unzip
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 3. Enable Docker and add user to group
echo "Configuring Docker permissions..."
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu

# 4. Install Legacy Docker Compose (standalone) as fallback/alias
echo "Installing standalone Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 5. Create Swap File (Critical for Flex instances to prevent OOM kills)
echo "Setting up 4GB Swap file..."
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 6. Final Check
echo "Setup Complete! Please logout and log back in for group changes to take effect."
docker --version
docker-compose --version
