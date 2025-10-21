# HealthyColors Firewall Setup Script
# Chạy với quyền Administrator để mở port cho frontend và backend

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "    HealthyColors - Firewall Setup                  " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

# Kiểm tra quyền Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: Script này cần quyền Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Hướng dẫn:" -ForegroundColor Yellow
    Write-Host "1. Đóng cửa sổ này" -ForegroundColor White
    Write-Host "2. Click chuột phải vào PowerShell" -ForegroundColor White
    Write-Host "3. Chọn 'Run as Administrator'" -ForegroundColor White
    Write-Host "4. Chạy lại: .\setup-firewall.ps1" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

Write-Host "✓ Running with Administrator privileges" -ForegroundColor Green
Write-Host ""

# Xóa các rule cũ nếu có
Write-Host "Kiểm tra và xóa các firewall rules cũ..." -ForegroundColor Cyan
try {
    Remove-NetFirewallRule -DisplayName "HealthyColors Frontend" -ErrorAction SilentlyContinue
    Remove-NetFirewallRule -DisplayName "HealthyColors Backend" -ErrorAction SilentlyContinue
    Write-Host "   Đã xóa các rules cũ (nếu có)" -ForegroundColor Gray
} catch {
    Write-Host "   Không có rules cũ" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Tạo firewall rules mới..." -ForegroundColor Cyan

# Tạo rule cho Frontend (port 3000)
try {
    New-NetFirewallRule `
        -DisplayName "HealthyColors Frontend" `
        -Description "Cho phép truy cập Frontend từ mạng LAN (port 3000)" `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 3000 `
        -Action Allow `
        -Profile Private,Domain `
        -Enabled True | Out-Null
    
    Write-Host "   ✓ Frontend (port 3000) - OK" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Frontend (port 3000) - FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Tạo rule cho Backend (port 5000)
try {
    New-NetFirewallRule `
        -DisplayName "HealthyColors Backend" `
        -Description "Cho phép truy cập Backend API từ mạng LAN (port 5000)" `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 5000 `
        -Action Allow `
        -Profile Private,Domain `
        -Enabled True | Out-Null
    
    Write-Host "   ✓ Backend (port 5000) - OK" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Backend (port 5000) - FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "              SETUP COMPLETE!                       " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

# Hiển thị thông tin mạng
Write-Host "Thông tin kết nối:" -ForegroundColor Cyan
Write-Host ""

# Lấy địa chỉ IP
$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" }

if ($ipAddresses) {
    foreach ($ip in $ipAddresses) {
        Write-Host "   Địa chỉ IP mạng LAN: " -NoNewline -ForegroundColor White
        Write-Host "$($ip.IPAddress)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   Frontend URL: " -NoNewline -ForegroundColor White
        Write-Host "http://$($ip.IPAddress):3000" -ForegroundColor Green
        Write-Host "   Backend API:  " -NoNewline -ForegroundColor White
        Write-Host "http://$($ip.IPAddress):5000/api" -ForegroundColor Green
        Write-Host ""
    }
} else {
    Write-Host "   Không tìm thấy địa chỉ IP mạng LAN!" -ForegroundColor Yellow
    Write-Host "   Đảm bảo máy tính đã kết nối vào mạng" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Các bước tiếp theo:" -ForegroundColor Yellow
Write-Host "1. Khởi động server: " -NoNewline -ForegroundColor White
Write-Host ".\start-dev.ps1" -ForegroundColor Cyan
Write-Host "2. Trên thiết bị khác (cùng mạng WiFi), mở trình duyệt" -ForegroundColor White
Write-Host "3. Truy cập: " -NoNewline -ForegroundColor White
Write-Host "http://<IP_ADDRESS>:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Lưu ý:" -ForegroundColor Red
Write-Host "- Đảm bảo máy tính và thiết bị khác cùng mạng WiFi" -ForegroundColor White
Write-Host "- Nếu vẫn không truy cập được, tạm thời tắt Firewall:" -ForegroundColor White
Write-Host "  netsh advfirewall set allprofiles state off" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
