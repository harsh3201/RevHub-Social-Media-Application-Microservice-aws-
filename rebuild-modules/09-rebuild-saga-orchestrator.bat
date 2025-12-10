@echo off
echo ========================================
echo STEP 9: REBUILD SAGA ORCHESTRATOR
echo ========================================
echo.

cd ..\backend-services\saga-orchestrator
call mvn clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: saga-orchestrator build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ saga-orchestrator built successfully
echo.

echo ========================================
echo ✓ SAGA ORCHESTRATOR READY
echo ========================================
echo.
echo To start: cd ..\backend-services\saga-orchestrator ^&^& mvn spring-boot:run
pause
