@echo off
echo ========================================
echo Starting All RevHub Micro-Frontends
echo ========================================
echo.
echo This will open 6 terminal windows
echo Press Ctrl+C in each window to stop
echo.
pause

cd ..\frontend-services

start "Shell App (4200)" cmd /k "cd shell-app && npm install && npm start"
timeout /t 5 /nobreak

start "Auth MFE (4201)" cmd /k "cd auth-microfrontend && npm install && npm start"
timeout /t 5 /nobreak

start "Feed MFE (4202)" cmd /k "cd feed-microfrontend && npm install && npm start"
timeout /t 5 /nobreak

start "Profile MFE (4203)" cmd /k "cd profile-microfrontend && npm install && npm start"
timeout /t 5 /nobreak

start "Chat MFE (4204)" cmd /k "cd chat-microfrontend && npm install && npm start"
timeout /t 5 /nobreak

start "Notifications MFE (4205)" cmd /k "cd notifications-microfrontend && npm install && npm start"

echo.
echo ========================================
echo All frontends are starting...
echo Wait 2-3 minutes for all to be ready
echo.
echo Access the application at:
echo http://localhost:4200
echo ========================================
