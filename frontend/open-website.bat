@echo off
cd /d "%~dp0.."
start "Shopping Bazar Services" cmd /k "npm start"
timeout /t 2 /nobreak > nul
start "Shopping Bazar" "http://localhost:4000"
