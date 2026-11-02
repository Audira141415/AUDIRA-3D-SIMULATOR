@echo off
setlocal enabledelayedexpansion

title AUDIRA 3D CONSTRUCTION SIMULATOR - Web Launcher
color 0b

echo ===============================================================================
echo                AUDIRA 3D CONSTRUCTION SIMULATOR (WEB SUITE)
echo        3D World Builder + Fastify API + Construction Sandbox in Browser
echo ===============================================================================
echo.

:: 1. Check Node.js and PNPM
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] pnpm tidak ditemukan di PATH sistem!
    echo Silakan install pnpm terlebih dahulu: npm install -g pnpm
    pause
    exit /b 1
)

:: 2. Check and Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Menginstal dependensi pnpm monorepo...
    call pnpm install
    if %errorlevel% neq 0 (
        echo [ERROR] Gagal menginstal dependensi!
        pause
        exit /b 1
    )
)

:: 3. Launch Web Suite (Vite R3F Editor & Fastify Backend API)
echo [INFO] Menjalankan AUDIRA 3D Simulator Web Suite...
echo [INFO] Frontend Editor : http://localhost:5173
echo [INFO] Backend API     : http://localhost:3000
echo.

start "AUDIRA 3D Web Suite" cmd /k "pnpm dev"

:: Wait 3 seconds then open browser to frontend
timeout /t 3 >nul
start http://localhost:5173/

echo ===============================================================================
echo [SUCCESS] Web Suite aktif!
echo - Web 3D Editor : http://localhost:5173
echo - API & Copilot : http://localhost:3000
echo Untuk menghentikan simulator, jalankan stop.bat
echo ===============================================================================
pause
