@echo off
echo ========================================
echo STEP 7: REBUILD FEED SERVICE
echo ========================================
echo.

cd ..\backend-services\feed-service
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: feed-service build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ feed-service built successfully
echo.

echo ========================================
echo ✓ FEED SERVICE READY
echo ========================================
echo.
echo To start: cd ..\backend-services\feed-service ^&^& mvn spring-boot:run
pause
