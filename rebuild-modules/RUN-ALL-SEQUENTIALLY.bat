@echo off
color 0A
echo ========================================
echo REVHUB - SEQUENTIAL REBUILD ALL MODULES
echo ========================================
echo.
echo This will rebuild and prepare all 16 modules
echo Press Ctrl+C to cancel, or
pause
echo.

call 01-rebuild-shared-modules.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 02-rebuild-user-service.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 03-rebuild-post-service.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 04-rebuild-social-service.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 05-rebuild-chat-service.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 06-rebuild-notification-service.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 07-rebuild-feed-service.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 08-rebuild-search-service.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 09-rebuild-saga-orchestrator.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 10-rebuild-api-gateway.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 11-rebuild-shell-app.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 12-rebuild-auth-microfrontend.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 13-rebuild-feed-microfrontend.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 14-rebuild-profile-microfrontend.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 15-rebuild-chat-microfrontend.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

call 16-rebuild-notifications-microfrontend.bat
if %ERRORLEVEL% NEQ 0 exit /b 1

echo.
echo ========================================
echo ✓ ALL 16 MODULES REBUILT SUCCESSFULLY!
echo ========================================
echo.
echo Next: Start infrastructure and services
echo   1. Start infrastructure: cd ..\scripts ^&^& start-infrastructure.bat
echo   2. Start backend: cd ..\scripts ^&^& start-backend-services.bat
echo   3. Start frontend: cd ..\scripts ^&^& start-all-frontends.bat
echo.
pause
