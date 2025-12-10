@echo off
echo ========================================
echo STEP 15: REBUILD CHAT MICROFRONTEND
echo ========================================
echo.

cd ..\frontend-services\chat-microfrontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: chat-microfrontend npm install failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ chat-microfrontend dependencies installed
echo.

echo ========================================
echo ✓ CHAT MICROFRONTEND READY
echo ========================================
echo.
echo To start: cd ..\frontend-services\chat-microfrontend ^&^& npm start
pause
