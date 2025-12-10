@echo off
echo ========================================
echo RevHub Complete Setup Script
echo ========================================
echo.
echo This will:
echo 1. Build all backend services
echo 2. Start infrastructure
echo 3. Start backend services
echo 4. Start all frontends
echo.
echo Total time: ~20-30 minutes
echo.
pause

echo.
echo [STEP 1/4] Building Backend Services...
echo ========================================
call build-all-services.bat
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [STEP 2/4] Starting Infrastructure...
echo ========================================
call start-infrastructure.bat

echo.
echo [STEP 3/4] Starting Backend Services...
echo ========================================
call start-backend-services.bat

echo.
echo [STEP 4/4] Starting Frontend Services...
echo ========================================
call start-all-frontends.bat

echo.
echo ========================================
echo 🎉 RevHub Setup Complete!
echo ========================================
echo.
echo Access your application at:
echo http://localhost:4200
echo.
echo API Gateway: http://localhost:8080
echo Consul UI: http://localhost:8500
echo.
pause
