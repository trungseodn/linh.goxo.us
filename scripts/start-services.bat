@echo off
echo ========================================================
echo   ZT-REEL (Linh): Checking PostgreSQL & Redis Services
echo ========================================================

echo [1/2] Checking Redis (6379)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (!(Test-NetConnection -ComputerName 127.0.0.1 -Port 6379 -InformationLevel Quiet)) { Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = 'D:\projects\trung-reel\tools\redis\redis-server.exe redis.conf'; CurrentDirectory = 'D:\projects\trung-reel\tools\redis' } }" >nul 2>&1

echo [2/2] Checking PostgreSQL (5432)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (!(Test-NetConnection -ComputerName 127.0.0.1 -Port 5432 -InformationLevel Quiet)) { Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = 'D:\projects\trung-reel\tools\pgsql\bin\pg_ctl.exe -D D:\projects\trung-reel\tools\pgsql\data -l D:\projects\trung-reel\tools\pgsql\server.log start'; CurrentDirectory = 'D:\projects\trung-reel\tools\pgsql\bin' } }" >nul 2>&1

echo.
echo Database and Cache:
echo - PostgreSQL: localhost:5432 (DB: ztreel)
echo - Redis:      localhost:6379
echo ========================================================
