@echo off
title AUDIRA 3D SIMULATOR - Stopper
color 0c

echo ===============================================================================
echo                AUDIRA 3D CONSTRUCTION SIMULATOR - STOPPING
echo ===============================================================================
echo.

echo [INFO] Menutup proses dev server di port 5173 dan 3000...

:: Kill processes on port 5173
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /f /pid %%a >nul 2>nul
)

:: Kill processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /f /pid %%a >nul 2>nul
)

echo [SUCCESS] Semua proses AUDIRA 3D SIMULATOR telah dihentikan secara bersih.
timeout /t 2 >nul
exit /b 0
