# Start RevHub Application (Full Docker Mode)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Starting RevHub Social Media App (Full Docker)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check Docker
Write-Host "`n[1/2] Checking Docker Status..." -ForegroundColor Yellow
docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker is NOT running. Please start Docker Desktop and try again."
    exit 1
}
Write-Host "Docker is running." -ForegroundColor Green

# 2. Start Services
Write-Host "`n[2/2] Starting All Services (Backend + Frontend)..." -ForegroundColor Yellow
Write-Host "This may take a while to build all images..." -ForegroundColor Gray

# Use .env.docker file
if (Test-Path ".env.docker") {
    docker-compose --env-file .env.docker -f docker-compose.yml up -d --build --remove-orphans
}
else {
    Write-Warning ".env.docker not found. Trying default environment..."
    docker-compose -f docker-compose.yml up -d --build --remove-orphans
}

# Wait a moment
Start-Sleep -Seconds 10

# Check status
Write-Host "`nChecking Status..." -ForegroundColor Yellow
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "   Startup command executed!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Access the App: http://localhost:4200"
Write-Host "API Gateway: http://localhost:8090"

