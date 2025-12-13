# EC2 Deployment Script
# Usage: ./deploy_ec2.sh <docker-hub-username>

HUB_USER=$1

if [ -z "$HUB_USER" ]; then
    echo "Error: Docker Hub username required."
    exit 1
fi

# Stop existing containers
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.frontend.yml down

# Pull latest images
docker-compose -f docker-compose.yml pull
docker-compose -f docker-compose.frontend.yml pull

# Start Backend
docker-compose -f docker-compose.yml up -d

# Wait for backend to stabilize (optional, but good practice)
echo "Waiting for backend services..."
sleep 30

# Start Frontend
docker-compose -f docker-compose.frontend.yml up -d

echo "Deployment Complete!"
