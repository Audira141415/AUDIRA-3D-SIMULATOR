@echo off
setlocal enabledelayedexpansion

title AUDIRA 3D CONSTRUCTION SIMULATOR - Desktop Launcher (Tauri 2.x)
color 0a

echo ===============================================================================
echo               AUDIRA 3D CONSTRUCTION SIMULATOR (DESKTOP APP)
echo       Native GPU Window (Tauri 2.x) + High Performance 144Hz + Fastify API
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

:: 3. Check Rust and Cargo
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Rust / Cargo tidak ditemukan di PATH sistem!
    echo Desktop native memerlukan Rust untuk menjalankan Tauri 2.x.
    echo Kunjungi: https://rustup.rs/ untuk menginstal Rust.
    pause
    exit /b 1
)

:: 4. Start Backend API if not running
netstat -ano | findstr :3000 >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Menjalankan AUDIRA Backend Fastify API di port 3000...
    start "AUDIRA API Backend" /min cmd /c "pnpm dev:api"
    timeout /t 2 >nul
) else (
    echo [INFO] Backend API sudah aktif di port 3000.
)

:: 5. Launch Tauri Desktop Application
echo [INFO] Membuka jendela native AUDIRA 3D Simulator (Tauri 2.x)...
echo [INFO] Resolusi: 1440x900 (GPU Hardware Acceleration)
echo.

call pnpm dev:desktop

echo ===============================================================================
echo [INFO] Aplikasi desktop telah ditutup.
echo Untuk membersihkan semua proses background, jalankan stop.bat
echo ===============================================================================
pause

