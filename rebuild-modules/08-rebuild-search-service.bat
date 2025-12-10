@echo off
echo ========================================
echo STEP 8: REBUILD SEARCH SERVICE
echo ========================================
echo.

cd ..\backend-services\search-service
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: search-service build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ search-service built successfully
echo.

echo ========================================
echo ✓ SEARCH SERVICE READY
echo ========================================
echo.
echo To start: cd ..\backend-services\search-service ^&^& mvn spring-boot:run
pause
