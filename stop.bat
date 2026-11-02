@echo off
title AUDIRA 3D SIMULATOR - Stopper
color 0c

echo ===============================================================================
echo                AUDIRA 3D CONSTRUCTION SIMULATOR - STOPPING
echo ===============================================================================
echo.

echo [INFO] Menutup proses AUDIRA 3D Simulator (Web, API, dan Desktop App)...

:: 1. Kill Desktop Native App if running
taskkill /f /im audira_3d_simulator.exe >nul 2>nul
taskkill /f /im audira-3d-simulator.exe >nul 2>nul
taskkill /f /im tauri.exe >nul 2>nul

:: 2. Kill processes on port 5173 (Web Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /f /pid %%a >nul 2>nul
)

:: 3. Kill processes on port 3000 (Backend Fastify API)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    taskkill /f /pid %%a >nul 2>nul
)

echo [SUCCESS] Semua proses AUDIRA 3D SIMULATOR telah dihentikan secara bersih.
timeout /t 2 >nul
exit /b 0
