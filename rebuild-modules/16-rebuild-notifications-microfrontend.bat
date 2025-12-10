@echo off
echo ========================================
echo STEP 16: REBUILD NOTIFICATIONS MICROFRONTEND
echo ========================================
echo.

cd ..\frontend-services\notifications-microfrontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: notifications-microfrontend npm install failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ notifications-microfrontend dependencies installed
echo.

echo ========================================
echo ✓ NOTIFICATIONS MICROFRONTEND READY
echo ========================================
echo.
echo To start: cd ..\frontend-services\notifications-microfrontend ^&^& npm start
pause
