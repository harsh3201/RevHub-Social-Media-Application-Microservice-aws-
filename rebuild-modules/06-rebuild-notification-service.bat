@echo off
echo ========================================
echo STEP 6: REBUILD NOTIFICATION SERVICE
echo ========================================
echo.

cd ..\backend-services\notification-service
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: notification-service build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ notification-service built successfully
echo.

echo ========================================
echo ✓ NOTIFICATION SERVICE READY
echo ========================================
echo.
echo To start: cd ..\backend-services\notification-service ^&^& mvn spring-boot:run
pause
