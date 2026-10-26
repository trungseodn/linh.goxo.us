@echo off
echo ========================================================
echo   ZT-REEL (linh.goxo.us): Starting Full System
echo ========================================================

call "%~dp0scripts\start-services.bat"

echo.
echo Starting NestJS API (Port 3005)...
start "ZT-REEL Linh API (Port 3005)" cmd /k "npm run start:dev --workspace=apps/api"

echo Starting React Frontend (Port 5175)...
start "ZT-REEL Linh Web (Port 5175)" cmd /k "npm run dev --workspace=apps/web"

echo.
echo ========================================================
echo System is starting up:
echo - Frontend: https://localhost:5175
echo - Backend:  http://localhost:3005/api
echo - Account:  admin / 12345 (or admin@gmail.com)
echo ========================================================
