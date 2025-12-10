@echo off
echo ========================================
echo STEP 11: REBUILD SHELL APP
echo ========================================
echo.

cd ..\frontend-services\shell-app
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: shell-app npm install failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ shell-app dependencies installed
echo.

echo ========================================
echo ✓ SHELL APP READY
echo ========================================
echo.
echo To start: cd ..\frontend-services\shell-app ^&^& npm start
pause
