@echo off
echo ========================================
echo Starting RevHub Backend Services
echo ========================================

cd ..

echo Starting all backend microservices...
docker-compose up -d api-gateway user-service post-service social-service chat-service notification-service feed-service search-service saga-orchestrator

echo.
echo Waiting for services to start (45 seconds)...
timeout /t 45 /nobreak

echo.
echo ========================================
echo Backend Services Status
echo ========================================
docker ps --filter "name=revhub"

echo.
echo ========================================
echo Health Check
echo ========================================
echo Checking API Gateway...
curl -s http://localhost:8080/actuator/health
echo.
echo Checking User Service...
curl -s http://localhost:8081/actuator/health
echo.

echo.
echo ========================================
echo Backend services are running!
echo API Gateway: http://localhost:8080
echo Consul UI: http://localhost:8500
echo ========================================
pause
