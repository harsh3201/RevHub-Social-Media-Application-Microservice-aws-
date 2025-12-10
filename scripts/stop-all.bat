@echo off
echo ========================================
echo Stopping All RevHub Services
echo ========================================

cd ..

echo Stopping Docker containers...
docker-compose down

echo.
echo ========================================
echo All services stopped!
echo ========================================
echo.
echo To remove volumes (WARNING: deletes all data):
echo docker-compose down -v
echo.
pause
