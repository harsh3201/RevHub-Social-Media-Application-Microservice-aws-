@echo off
echo ========================================
echo RevHub Service Logs
echo ========================================
echo.
echo Available services:
echo 1. api-gateway
echo 2. user-service
echo 3. post-service
echo 4. social-service
echo 5. chat-service
echo 6. notification-service
echo 7. feed-service
echo 8. search-service
echo 9. saga-orchestrator
echo 10. consul
echo 11. kafka
echo 12. mysql
echo 13. mongodb
echo.
set /p service="Enter service name: "

cd ..
docker logs -f revhub-%service%
