# HealthyColors Development Server Stopper
# Chay file nay de stop toan bo website

Write-Host ""
Write-Host "====================================================" -ForegroundColor Red
Write-Host "   HealthyColors - Development Server Stopper     " -ForegroundColor Red
Write-Host "====================================================" -ForegroundColor Red
Write-Host ""

Write-Host "Finding running processes..." -ForegroundColor Cyan
Write-Host ""

# Find node processes on specific ports
$port5000 = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
$port3000 = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

$stopped = 0

# Stop backend (port 5000)
if ($port5000) {
    Write-Host "   Backend (Port 5000) - PID: $($port5000.OwningProcess)" -ForegroundColor Yellow
    Stop-Process -Id $port5000.OwningProcess -Force -ErrorAction SilentlyContinue
    Write-Host "   Backend stopped" -ForegroundColor Green
    $stopped++
}

# Stop frontend (port 3000)
if ($port3000) {
    Write-Host "   Frontend (Port 3000) - PID: $($port3000.OwningProcess)" -ForegroundColor Yellow
    Stop-Process -Id $port3000.OwningProcess -Force -ErrorAction SilentlyContinue
    Write-Host "   Frontend stopped" -ForegroundColor Green
    $stopped++
}

Write-Host ""

if ($stopped -eq 0) {
    Write-Host "No services running" -ForegroundColor Gray
} else {
    Write-Host "====================================================" -ForegroundColor Green
    Write-Host "           SERVICES STOPPED ($stopped)                     " -ForegroundColor Green
    Write-Host "====================================================" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
