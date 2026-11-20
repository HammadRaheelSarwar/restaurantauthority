Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " RESTAURANT ELECTRICAL AUTHORITY (REA) PLATFORM" -ForegroundColor White
Write-Host " Starting Backend API & Frontend Web Server..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; node src/server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm.cmd run dev"

Write-Host ""
Write-Host "Services launched successfully:" -ForegroundColor Green
Write-Host "  - Frontend Web App:  http://localhost:5173/login" -ForegroundColor White
Write-Host "  - Backend API:       http://localhost:5000/api/health" -ForegroundColor White
Write-Host ""
Start-Process "http://localhost:5173/login"
