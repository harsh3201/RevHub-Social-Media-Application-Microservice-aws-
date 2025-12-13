docker login -u $1 -p $2

# Build and Push Backend Images
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml push

# Build and Push Frontend Images
docker-compose -f docker-compose.frontend.yml build
docker-compose -f docker-compose.frontend.yml push
