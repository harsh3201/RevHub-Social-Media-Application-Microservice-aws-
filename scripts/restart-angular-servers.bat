@echo off
echo ========================================
echo Restarting Angular Dev Servers
echo ========================================
echo.

echo Stopping all Angular dev servers...

:: Kill processes on Angular ports
for %%p in (4200 4201 4202 4203 4204 4205) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%%p "') do (
        echo Stopping process on port %%p (PID: %%a)
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo Waiting for ports to be released...
timeout /t 5 /nobreak >nul

echo.
echo Starting Angular dev servers with proxy configuration...

cd /d "%~dp0..\frontend-services\shell-app"
start "Shell App" cmd /k "echo Starting Shell App on port 4200 && ng serve --port 4200"

timeout /t 3 /nobreak >nul

cd /d "%~dp0..\frontend-services\auth-microfrontend"
start "Auth Microfrontend" cmd /k "echo Starting Auth Microfrontend on port 4201 && ng serve --port 4201"

timeout /t 3 /nobreak >nul

cd /d "%~dp0..\frontend-services\feed-microfrontend"
start "Feed Microfrontend" cmd /k "echo Starting Feed Microfrontend on port 4202 && ng serve --port 4202"

timeout /t 3 /nobreak >nul

cd /d "%~dp0..\frontend-services\profile-microfrontend"
start "Profile Microfrontend" cmd /k "echo Starting Profile Microfrontend on port 4203 && ng serve --port 4203"

timeout /t 3 /nobreak >nul

cd /d "%~dp0..\frontend-services\chat-microfrontend"
start "Chat Microfrontend" cmd /k "echo Starting Chat Microfrontend on port 4204 && ng serve --port 4204"

timeout /t 3 /nobreak >nul

cd /d "%~dp0..\frontend-services\notifications-microfrontend"
start "Notifications Microfrontend" cmd /k "echo Starting Notifications Microfrontend on port 4205 && ng serve --port 4205"

echo.
echo All Angular dev servers are starting...
echo Wait 60-90 seconds for all services to be ready.
echo.
echo Access points:
echo - Main App: http://localhost:4200
echo - Auth: http://localhost:4201
echo - Feed: http://localhost:4202
echo - Profile: http://localhost:4203
echo - Chat: http://localhost:4204
echo - Notifications: http://localhost:4205
echo.
pause