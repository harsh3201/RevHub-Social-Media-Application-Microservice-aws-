@echo off
echo ========================================
echo STEP 2: REBUILD USER SERVICE
echo ========================================
echo.

cd ..\backend-services\user-service
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: user-service build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ user-service built successfully
echo.

echo ========================================
echo ✓ USER SERVICE READY
echo ========================================
echo.
echo To start: cd ..\backend-services\user-service ^&^& mvn spring-boot:run
pause
