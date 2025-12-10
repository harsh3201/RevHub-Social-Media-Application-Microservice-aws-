@echo off
echo ========================================
echo Starting RevHub Infrastructure
echo ========================================

cd ..

echo Starting Consul, Kafka, MySQL, MongoDB, Zookeeper...
docker-compose up -d consul kafka mysql mongodb zookeeper

echo.
echo Waiting for services to be ready (30 seconds)...
timeout /t 30 /nobreak

echo.
echo ========================================
echo Infrastructure Status
echo ========================================
docker ps --filter "name=revhub"

echo.
echo ========================================
echo Service URLs
echo ========================================
echo Consul UI: http://localhost:8500
echo MySQL: localhost:3306 (user: root, password: root)
echo MongoDB: localhost:27017 (user: root, password: root)
echo Kafka: localhost:9092
echo.
echo Infrastructure is ready!
echo ========================================
pause
