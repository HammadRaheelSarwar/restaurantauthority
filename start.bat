@echo off
title Restaurant Electrical Authority (REA) Launcher
echo ========================================================
echo  RESTAURANT ELECTRICAL AUTHORITY (REA) PLATFORM
echo  Starting Backend API & Frontend Web Server...
echo ========================================================
echo.
start "REA Backend API (Port 5000)" cmd /k "cd backend && node src/server.js"
start "REA Frontend Web (Port 5173)" cmd /k "cd frontend && npm.cmd run dev"
echo.
echo Services launched successfully:
echo   - Frontend Web App:  http://localhost:5173/login
echo   - Backend API:       http://localhost:5000/api/health
echo.
echo Press any key to open the web platform in your browser...
pause >nul
start http://localhost:5173/login
