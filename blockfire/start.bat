@echo off
title Blockfire server
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download the LTS version from https://nodejs.org and run this again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing, this only happens the first time...
  call npm install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
start "" cmd /c "timeout /t 2 >nul & start http://localhost:3000"
echo Keep this window open while you play. Close it to stop the game.
node server.js
pause
