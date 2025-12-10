@echo off
echo ========================================
echo Copying Frontend Components from Monolith
echo ========================================

set MONOLITH=c:\Users\dodda\RevHubTeam4\RevHub\RevHub\RevHub\src\app
set MICRO=c:\Users\dodda\RevHub-Microservices\frontend-services

echo [1/5] Copying Post Card Component...
xcopy /E /I /Y "%MONOLITH%\modules\feed\post-card" "%MICRO%\feed-microfrontend\src\app\components\post-card"

echo [2/5] Copying Services...
xcopy /E /I /Y "%MONOLITH%\core\services" "%MICRO%\feed-microfrontend\src\app\services"

echo [3/5] Copying Profile Components...
xcopy /E /I /Y "%MONOLITH%\modules\profile" "%MICRO%\profile-microfrontend\src\app\components"

echo [4/5] Copying Chat Components...
xcopy /E /I /Y "%MONOLITH%\modules\chat" "%MICRO%\chat-microfrontend\src\app\components"

echo [5/5] Copying Notification Components...
xcopy /E /I /Y "%MONOLITH%\modules\notifications" "%MICRO%\notifications-microfrontend\src\app\components"

echo ========================================
echo Components copied successfully!
echo Next: Update imports and test
echo ========================================
pause
