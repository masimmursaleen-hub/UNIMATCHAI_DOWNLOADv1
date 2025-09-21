@echo off
:: --------------------------------------
:: UniMatch AI - Run Backend Silently + Open Frontend
:: --------------------------------------

cd /d "%~dp0"

:: 0️⃣ Set execution policy for PowerShell (if needed)
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

:: 1️⃣ Install npm dependencies
call npm install

:: 2️⃣ Start Node backend in hidden window
start "" /min cmd /c "node server.js"

:: 3️⃣ Wait 3 seconds for server to start
timeout /t 3 /nobreak >nul

:: 4️⃣ Open frontend in default browser
start "" "http://localhost:5000"

exit