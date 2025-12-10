@echo off
echo ========================================
echo Building All RevHub Microservices
echo ========================================

cd ..

echo [1/9] Building API Gateway...
cd backend-services\api-gateway
call mvn clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo [2/9] Building User Service...
cd backend-services\user-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo [3/9] Building Post Service...
cd backend-services\post-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo [4/9] Building Social Service...
cd backend-services\social-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo [5/9] Building Chat Service...
cd backend-services\chat-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo [6/9] Building Notification Service...
cd backend-services\notification-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo [7/9] Building Feed Service...
cd backend-services\feed-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo [8/9] Building Search Service...
cd backend-services\search-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo [9/9] Building Saga Orchestrator...
cd backend-services\saga-orchestrator
call mvn clean package -DskipTests
if %errorlevel% neq 0 exit /b %errorlevel%
cd ..\..

echo ========================================
echo All services built successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Start infrastructure: docker-compose up -d consul kafka mysql mongodb zookeeper
echo 2. Deploy all services: docker-compose up --build
echo 3. Access API Gateway: http://localhost:8080
echo 4. Access Consul UI: http://localhost:8500
echo.
pause
