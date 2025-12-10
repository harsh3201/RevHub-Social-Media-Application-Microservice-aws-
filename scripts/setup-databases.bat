@echo off
echo ========================================
echo Setting Up Databases
echo ========================================

cd ..

echo Waiting for MySQL to be ready...
timeout /t 10 /nobreak

echo Initializing MySQL...
docker exec -i revhub-mysql mysql -uroot -proot < infrastructure\databases\mysql-init.sql
if %errorlevel% equ 0 (
    echo MySQL initialized successfully
) else (
    echo MySQL initialization failed
)

echo.
echo Waiting for MongoDB to be ready...
timeout /t 5 /nobreak

echo Initializing MongoDB...
docker exec -i revhub-mongodb mongosh -u root -p root --authenticationDatabase admin < infrastructure\databases\mongodb-init.js
if %errorlevel% equ 0 (
    echo MongoDB initialized successfully
) else (
    echo MongoDB initialization failed
)

echo.
echo ========================================
echo Database setup complete!
echo ========================================
pause
