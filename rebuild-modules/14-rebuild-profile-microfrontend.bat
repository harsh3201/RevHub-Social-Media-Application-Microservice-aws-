@echo off
echo ========================================
echo STEP 14: REBUILD PROFILE MICROFRONTEND
echo ========================================
echo.

cd ..\frontend-services\profile-microfrontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: profile-microfrontend npm install failed!
    cd ..\..\rebuild-modules
    pause
    exit /b 1
)
cd ..\..\rebuild-modules
echo ✓ profile-microfrontend dependencies installed
echo.

echo ========================================
echo ✓ PROFILE MICROFRONTEND READY
echo ========================================
echo.
echo To start: cd ..\frontend-services\profile-microfrontend ^&^& npm start
pause
