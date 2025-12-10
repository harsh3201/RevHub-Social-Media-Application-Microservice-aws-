@echo off
echo ========================================
echo STEP 10: REBUILD API GATEWAY
echo ========================================
echo.

cd ..\backend-services\api-gateway
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: api-gateway build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ api-gateway built successfully
echo.

echo ========================================
echo ✓ API GATEWAY READY
echo ========================================
echo.
echo To start: cd ..\backend-services\api-gateway ^&^& mvn spring-boot:run
pause
