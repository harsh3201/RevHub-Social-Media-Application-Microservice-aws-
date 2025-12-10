@echo off
echo ========================================
echo RevHub Health Check
echo ========================================

echo.
echo Checking Infrastructure...
echo --------------------------
echo Consul:
curl -s http://localhost:8500/v1/status/leader
echo.

echo.
echo Checking Backend Services...
echo --------------------------
echo API Gateway (8080):
curl -s http://localhost:8080/actuator/health
echo.

echo User Service (8081):
curl -s http://localhost:8081/actuator/health
echo.

echo Post Service (8082):
curl -s http://localhost:8082/actuator/health
echo.

echo Social Service (8083):
curl -s http://localhost:8083/actuator/health
echo.

echo Chat Service (8084):
curl -s http://localhost:8084/actuator/health
echo.

echo Notification Service (8085):
curl -s http://localhost:8085/actuator/health
echo.

echo Feed Service (8086):
curl -s http://localhost:8086/actuator/health
echo.

echo Search Service (8087):
curl -s http://localhost:8087/actuator/health
echo.

echo Saga Orchestrator (8088):
curl -s http://localhost:8088/actuator/health
echo.

echo.
echo Checking Frontend Services...
echo --------------------------
echo Shell App (4200):
curl -s -o nul -w "%%{http_code}" http://localhost:4200
echo.

echo.
echo ========================================
echo Health check complete!
echo ========================================
pause
