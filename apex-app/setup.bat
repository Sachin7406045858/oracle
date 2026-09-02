@echo off
setlocal

echo ===================================================
echo  Apex App - one-click setup
echo ===================================================
echo.

echo [1/4] Removing old node_modules / lockfiles (if any)...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /q package-lock.json
if exist server\node_modules rmdir /s /q server\node_modules
if exist server\package-lock.json del /q server\package-lock.json

echo [2/4] Installing frontend dependencies...
call npm install
if errorlevel 1 goto :error

echo [3/4] Installing backend dependencies...
call npm install --prefix server
if errorlevel 1 goto :error

echo [4/4] Preparing server\.env (only if it does not exist yet)...
if not exist server\.env (
  copy server\.env.example server\.env >nul
  echo   Created server\.env from the template.
  echo   IMPORTANT: open server\.env in Notepad and fill in the real
  echo   TOKEN_URL / CLIENT_ID / CLIENT_SECRET / SCOPE / USERNAME / PASSWORD
  echo   values before starting the app.
) else (
  echo   server\.env already exists, leaving it untouched.
)

echo.
echo ===================================================
echo  Setup complete.
echo  Next: double-click run.bat to start the app.
echo ===================================================
pause
exit /b 0

:error
echo.
echo Setup failed - see the error above.
pause
exit /b 1
