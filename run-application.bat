@echo off
echo ==============================================
echo      Starting RevHub Microservices App
echo ==============================================

echo 1. Checking Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running! Please start Docker Desktop and try again.
    pause
    exit /b
)

echo 2. Building and Starting Backend Services & Infrastructure...
echo    This may take 5-10 minutes on the first run.
echo.
docker-compose up -d --build

echo.
echo ==============================================
echo Services are starting...
echo.
echo Useful Links:
echo - Consul Dashboard: http://localhost:8500
echo - API Gateway:      http://localhost:8080
echo.
echo To start the Frontend:
echo 1. Open a new terminal.
echo 2. cd frontend-services/shell-app
echo 3. npm install (if first time)
echo 4. npm start
echo 5. Go to http://localhost:4200
echo.
echo ==============================================
pause
