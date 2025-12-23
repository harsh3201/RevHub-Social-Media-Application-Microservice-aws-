# Start RevHub Application (Developer Mode)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Starting RevHub Social Media App" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check Docker
Write-Host "`n[1/3] Checking Docker Status..." -ForegroundColor Yellow
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker is NOT running. Please start Docker Desktop and try again."
    exit 1
}
Write-Host "Docker is running." -ForegroundColor Green

# 2. Start Backend Services
Write-Host "`n[2/3] Starting Backend Microservices (Docker)..." -ForegroundColor Yellow
docker-compose -f docker-compose.yml up -d

# Wait for essential services
Write-Host "Waiting for core services to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Check if backend is up
$runningContainers = docker ps --format "{{.Names}}"
if ($runningContainers -match "revhub-api-gateway") {
    Write-Host "Backend Services Started Successfully!" -ForegroundColor Green
    Write-Host "API Gateway: http://localhost:8090" -ForegroundColor Gray
} else {
    Write-Warning "Backend services might not have started correctly. Check 'docker ps'."
}

# 3. Start Frontend Applications
Write-Host "`n[3/3] Launching Frontend Micro-Frontends..." -ForegroundColor Yellow
Write-Host "This will open separate windows for each micro-frontend." -ForegroundColor Gray

$frontends = @(
    "auth-microfrontend",
    "feed-microfrontend",
    "profile-microfrontend",
    "chat-microfrontend",
    "notifications-microfrontend",
    "shell-app" 
)

foreach ($app in $frontends) {
    $path = Join-Path (Get-Location) "frontend-services\$app"
    if (Test-Path $path) {
        Write-Host "Starting $app..."
        # Launch independent PowerShell windows for each NPM Start command
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Write-Title '$app'; cd '$path'; Write-Host 'Starting $app...'; npm start}"
    } else {
        Write-Error "Could not find folder: $path"
    }
}

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "1. Wait for all popup windows to show 'Compiled successfully'."
Write-Host "2. Access the App: http://localhost:4200"
Write-Host "3. Press any key to exit this launcher (services will keep running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
