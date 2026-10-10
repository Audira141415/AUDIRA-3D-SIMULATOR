@echo off
setlocal enabledelayedexpansion

title AUDIRA 3D CONSTRUCTION SIMULATOR - Launcher
color 0b

echo ===============================================================================
echo                AUDIRA 3D CONSTRUCTION SIMULATOR
echo         3D World Builder + Construction Simulator in Browser
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

:: 3. Launch Development Server
echo [INFO] Menjalankan AUDIRA 3D Simulator (Vite React Three Fiber)...
echo [INFO] Frontend: http://localhost:5173
echo.

start "AUDIRA 3D Web Editor" cmd /k "pnpm dev:web"

:: Wait 3 seconds then open browser
timeout /t 3 >nul
start http://localhost:5173/

echo ===============================================================================
echo [SUCCESS] Simulator aktif! Buka browser di http://localhost:5173
echo Untuk menghentikan simulator, jalankan stop.bat
echo ===============================================================================
pause
