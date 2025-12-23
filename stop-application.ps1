# Stop RevHub Application

Write-Host "Stopping RevHub Services..." -ForegroundColor Yellow

# 1. Stop Docker Services
Write-Host "Stopping Backend/Docker Containers..." -ForegroundColor Cyan
docker-compose -f docker-compose.yml stop

# 2. Kill Node/Angular Processes
# Note: This finds node processes. It might be aggressive if user has other node apps.
Write-Host "Stopping Frontend (Node) Processes..." -ForegroundColor Cyan
taskkill /F /IM node.exe /T 2>$null

Write-Host "All services stopped." -ForegroundColor Green
Start-Sleep -Seconds 2
