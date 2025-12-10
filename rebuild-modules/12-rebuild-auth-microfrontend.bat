@echo off
echo ========================================
echo STEP 12: REBUILD AUTH MICROFRONTEND
echo ========================================
echo.

cd ..\frontend-services\auth-microfrontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: auth-microfrontend npm install failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ auth-microfrontend dependencies installed
echo.

echo ========================================
echo ✓ AUTH MICROFRONTEND READY
echo ========================================
echo.
echo To start: cd ..\frontend-services\auth-microfrontend ^&^& npm start
pause
