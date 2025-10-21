# HealthyColors Development Server Starter
# Chay file nay de start toan bo website

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "    HealthyColors - Development Server Starter     " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

# Check SQL Server
Write-Host "Checking SQL Server..." -ForegroundColor Cyan
$sqlService = Get-Service MSSQLSERVER -ErrorAction SilentlyContinue
if ($sqlService.Status -ne "Running") {
    Write-Host "   SQL Server is not running!" -ForegroundColor Yellow
    Write-Host "   Starting SQL Server..." -ForegroundColor Yellow
    Start-Service MSSQLSERVER
    Start-Sleep -Seconds 3
}
Write-Host "SQL Server is running" -ForegroundColor Green

# Check if ports are available
Write-Host ""
Write-Host "Checking ports..." -ForegroundColor Cyan

$port5000 = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host "    Port 5000 is already in use!" -ForegroundColor Yellow
    $kill = Read-Host "   Kill existing process? (y/n)"
    if ($kill -eq "y") {
        Stop-Process -Id $port5000.OwningProcess -Force
        Write-Host "   Process killed" -ForegroundColor Green
    }
}

$port3000 = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "    Port 3000 is already in use!" -ForegroundColor Yellow
    $kill = Read-Host "   Kill existing process? (y/n)"
    if ($kill -eq "y") {
        Stop-Process -Id $port3000.OwningProcess -Force
        Write-Host "   Process killed" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "   Starting Backend API (Port 5000)..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "src\backend"
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$backendPath'; Write-Host '===============================' -ForegroundColor Green; Write-Host '   BACKEND SERVER (Port 5000)' -ForegroundColor Green; Write-Host '===============================' -ForegroundColor Green; Write-Host ''; node server.js"
)

# Wait for backend to start
Write-Host "   Waiting for backend to start..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Test backend
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -ErrorAction Stop
    Write-Host "   Backend started successfully!" -ForegroundColor Green
} catch {
    Write-Host "   Backend failed to start!" -ForegroundColor Red
    Write-Host "   Check the backend terminal for errors" -ForegroundColor Yellow
    exit 1
}

# Start Frontend
Write-Host ""
Write-Host "   Starting Frontend Web (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$PSScriptRoot'; Write-Host '===============================' -ForegroundColor Blue; Write-Host '   FRONTEND WEB (Port 3000)' -ForegroundColor Blue; Write-Host '===============================' -ForegroundColor Blue; Write-Host ''; npm run dev"
)

# Wait for frontend to start
Write-Host "   Waiting for frontend to start..." -ForegroundColor Gray
Start-Sleep -Seconds 7

# Test frontend
try {
    $web = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction Stop
    Write-Host "   Frontend started successfully!" -ForegroundColor Green
} catch {
    Write-Host "    Frontend is starting..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "              SERVER STARTED!                       " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "   Frontend:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend:   " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "   Health:    " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: " -NoNewline -ForegroundColor Yellow
Write-Host "2 terminal windows da duoc mo" -ForegroundColor White
Write-Host "   - Backend Terminal (Port 5000)" -ForegroundColor Gray
Write-Host "   - Frontend Terminal (Port 3000)" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop: " -NoNewline -ForegroundColor Red
Write-Host "Close terminal windows hoac nhan Ctrl+C" -ForegroundColor White
Write-Host ""

# Open browser
Write-Host "Opening browser..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Development server ready! Have fun coding!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
