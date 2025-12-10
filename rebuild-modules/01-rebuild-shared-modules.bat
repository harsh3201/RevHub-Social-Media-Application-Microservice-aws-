@echo off
echo ========================================
echo STEP 1: REBUILD SHARED MODULES
echo ========================================
echo.

echo [1/3] Building common-dto...
cd ..\shared\common-dto
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: common-dto build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
echo ✓ common-dto built successfully
echo.

echo [2/3] Building event-schemas...
cd ..\event-schemas
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: event-schemas build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
echo ✓ event-schemas built successfully
echo.

echo [3/3] Building utilities...
cd ..\utilities
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: utilities build failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ utilities built successfully
echo.

echo ========================================
echo ✓ ALL SHARED MODULES BUILT SUCCESSFULLY
echo ========================================
pause
