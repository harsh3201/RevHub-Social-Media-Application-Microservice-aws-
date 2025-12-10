@echo off
echo ========================================
echo Fixing CORS and Rebuilding Services
echo ========================================

cd ..\backend-services

echo [1/3] Rebuilding Chat Service...
cd chat-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo Failed to build Chat Service
    pause
    exit /b 1
)
cd ..

echo [2/3] Rebuilding Post Service...
cd post-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo Failed to build Post Service
    pause
    exit /b 1
)
cd ..

echo [3/3] Rebuilding Social Service...
cd social-service
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo Failed to build Social Service
    pause
    exit /b 1
)
cd ..

echo ========================================
echo All services rebuilt successfully!
echo Now restart services manually
echo ========================================
pause
