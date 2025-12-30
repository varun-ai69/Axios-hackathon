@echo off
echo ========================================
echo   Starting Backend and Frontend Servers
echo ========================================
echo.

REM Get the current directory (project root)
cd /d "%~dp0"

REM Start backend server in a new window
echo [1/2] Starting Backend Server (port 3000)...
start "Backend Server - Port 3000" cmd /k "cd /d %~dp0backend && node server.js"

REM Wait a moment for backend to initialize
echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

REM Start frontend server in a new window (CRA will auto-detect port 3001 if 3000 is taken)
echo [2/2] Starting Frontend Server...
start "Frontend Server - React App" cmd /k "cd /d %~dp0frontend && set PORT=3001 && npm start"

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:3000
echo Frontend App: http://localhost:3001
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
echo Press any key to close this window...
pause >nul

