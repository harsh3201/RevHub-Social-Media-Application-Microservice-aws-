@echo off
echo ========================================
echo STEP 5: REBUILD CHAT SERVICE
echo ========================================
echo.

cd ..\backend-services\chat-service
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: chat-service build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ chat-service built successfully
echo.

echo ========================================
echo ✓ CHAT SERVICE READY
echo ========================================
echo.
echo To start: cd ..\backend-services\chat-service ^&^& mvn spring-boot:run
pause
