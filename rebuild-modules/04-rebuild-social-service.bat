@echo off
echo ========================================
echo STEP 4: REBUILD SOCIAL SERVICE
echo ========================================
echo.

cd ..\backend-services\social-service
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: social-service build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ social-service built successfully
echo.

echo ========================================
echo ✓ SOCIAL SERVICE READY
echo ========================================
echo.
echo To start: cd ..\backend-services\social-service ^&^& mvn spring-boot:run
pause
