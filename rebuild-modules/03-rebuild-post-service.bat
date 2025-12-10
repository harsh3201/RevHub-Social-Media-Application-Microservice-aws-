@echo off
echo ========================================
echo STEP 3: REBUILD POST SERVICE
echo ========================================
echo.

cd ..\backend-services\post-service
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: post-service build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ post-service built successfully
echo.

echo ========================================
echo ✓ POST SERVICE READY
echo ========================================
echo.
echo To start: cd ..\backend-services\post-service ^&^& mvn spring-boot:run
pause
