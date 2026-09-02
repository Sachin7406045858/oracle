@echo off
echo Starting backend in a new window...
start "Apex Backend (port 4000)" cmd /k "cd /d "%~dp0server" && npm run dev"

echo Starting frontend in this window...
echo (Close this window, or press Ctrl+C, to stop the frontend. Close the other window to stop the backend.)
echo.
call npm run dev
pause
