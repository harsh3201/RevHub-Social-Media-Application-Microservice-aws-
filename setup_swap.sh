#!/bin/bash

echo "==========================================="
echo "   Setting up Swap Space for EC2 Free Tier"
echo "==========================================="

# 1. Create a 4GB Swap File
echo "Creating 4GB swap file (this may take a minute)..."
sudo fallocate -l 4G /swapfile
if [ $? -ne 0 ]; then
    echo "fallocate failed, trying dd..."
    sudo dd if=/dev/zero of=/swapfile bs=128M count=32
fi

# 2. Set permissions
sudo chmod 600 /swapfile

# 3. Setup swap area
sudo mkswap /swapfile

# 4. Enable swap
sudo swapon /swapfile

# 5. Make permanent
echo "/swapfile swap swap defaults 0 0" | sudo tee -a /etc/fstab

# 6. Verify
echo "Swap created successfully!"
screen -ls
free -h
echo "==========================================="
echo "You can now try running Docker Containers on t2.micro"
