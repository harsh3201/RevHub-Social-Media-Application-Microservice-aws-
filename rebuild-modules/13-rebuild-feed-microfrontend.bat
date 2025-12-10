@echo off
echo ========================================
echo STEP 13: REBUILD FEED MICROFRONTEND
echo ========================================
echo.

cd ..\frontend-services\feed-microfrontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: feed-microfrontend npm install failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ feed-microfrontend dependencies installed
echo.

echo ========================================
echo ✓ FEED MICROFRONTEND READY
echo ========================================
echo.
echo To start: cd ..\frontend-services\feed-microfrontend ^&^& npm start
pause
