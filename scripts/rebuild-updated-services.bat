@echo off
echo ========================================
echo Rebuilding Updated Services
echo ========================================

cd ..\backend-services

echo [1/4] Building Post Service...
cd post-service
call mvn clean package -DskipTests
cd ..

echo [2/4] Building Social Service...
cd social-service
call mvn clean package -DskipTests
cd ..

echo [3/4] Building Notification Service...
cd notification-service
call mvn clean package -DskipTests
cd ..

echo [4/4] Building Feed Service...
cd feed-service
call mvn clean package -DskipTests
cd ..

echo ========================================
echo All services built successfully!
echo ========================================
pause
