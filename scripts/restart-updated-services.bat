@echo off
echo ========================================
echo Starting Updated Services
echo ========================================

cd ..\backend-services

echo [1/4] Starting Post Service (8082)...
start "Post Service" cmd /k "cd post-service && java -jar target\post-service-1.0.0.jar"
timeout /t 15 /nobreak

echo [2/4] Starting Social Service (8083)...
start "Social Service" cmd /k "cd social-service && java -jar target\social-service-1.0.0.jar"
timeout /t 15 /nobreak

echo [3/4] Starting Notification Service (8085)...
start "Notification Service" cmd /k "cd notification-service && java -jar target\notification-service-1.0.0.jar"
timeout /t 15 /nobreak

echo [4/4] Starting Feed Service (8086)...
start "Feed Service" cmd /k "cd feed-service && java -jar target\feed-service-1.0.0.jar"
timeout /t 15 /nobreak

echo ========================================
echo All services started!
echo Check Consul at http://localhost:8500
echo ========================================
pause
