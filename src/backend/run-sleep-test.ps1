# Test Sleep Tracker Script
# Run this script to test all sleep tracker functionality

Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host "🧪 SLEEP TRACKER TEST SUITE" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host ""

# Check if server is running
Write-Host "🔍 Checking if server is running..." -ForegroundColor Cyan
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "✅ Server is running (found $($nodeProcesses.Count) Node.js processes)" -ForegroundColor Green
} else {
    Write-Host "❌ Server is NOT running!" -ForegroundColor Red
    Write-Host "   Please start the server first:" -ForegroundColor Yellow
    Write-Host "   cd D:\TLU\CNPM\HealthCare" -ForegroundColor White
    Write-Host "   .\start-dev.ps1" -ForegroundColor White
    Write-Host ""
    $response = Read-Host "Do you want to start the server now? (y/n)"
    if ($response -eq 'y') {
        Write-Host "Starting server..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\TLU\CNPM\HealthCare; .\start-dev.ps1"
        Write-Host "⏳ Waiting 5 seconds for server to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    } else {
        Write-Host "Exiting..." -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host "🚀 Running tests..." -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host ""

# Check if node-fetch is installed
$packageJsonPath = "package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    if (-not ($packageJson.dependencies.'node-fetch' -or $packageJson.devDependencies.'node-fetch')) {
        Write-Host "⚠️  node-fetch not found in package.json" -ForegroundColor Yellow
        Write-Host "   Installing node-fetch..." -ForegroundColor Cyan
        npm install node-fetch@2
    }
}

# Run the test
node test-sleep-tracker.js

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host "✅ Test completed!" -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 For more information, see TEST_SLEEP_TRACKER_README.md" -ForegroundColor Cyan
