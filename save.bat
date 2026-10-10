@echo off
setlocal enabledelayedexpansion

title AUDIRA 3D SIMULATOR - Git Quick Save ^& Push
color 0a

echo ===============================================================================
echo                AUDIRA 3D CONSTRUCTION SIMULATOR
echo              Quick Save ^& Push ke GitHub Repository
echo ===============================================================================
echo Target Remote : https://github.com/Audira141415/AUDIRA-3D-SIMULATOR.git
echo.

:: 1. Cek apakah Git terinstal
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git tidak ditemukan di PATH sistem!
    echo Silakan unduh dan pasang Git: https://git-scm.com/
    pause
    exit /b 1
)

:: 2. Inisialisasi Git repository jika belum ada
if not exist ".git" (
    echo [INFO] Menginisialisasi Git repository baru...
    git init
    git branch -M main
)

:: 3. Konfigurasi Remote URL
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Menambahkan remote origin...
    git remote add origin https://github.com/Audira141415/AUDIRA-3D-SIMULATOR.git
) else (
    git remote set-url origin https://github.com/Audira141415/AUDIRA-3D-SIMULATOR.git
)

:: 4. Tentukan pesan commit
set "COMMIT_MSG=%~1"
if "!COMMIT_MSG!"=="" (
    set /p "COMMIT_MSG=Masukkan pesan commit [Tekan Enter untuk default]: "
)

if "!COMMIT_MSG!"=="" (
    set "COMMIT_MSG=feat: update AUDIRA 3D Construction Simulator [%date% %time%]"
)

echo.
echo [INFO] Pesan commit: "!COMMIT_MSG!"
echo.

:: 5. Git Stage All Changes
echo [INFO] Menambahkan berkas ke Git index [git add -A]...
git add -A

:: 6. Git Commit
echo [INFO] Membuat commit...
git commit -m "!COMMIT_MSG!"
if %errorlevel% neq 0 (
    echo [INFO] Tidak ada perubahan baru untuk di-commit.
)

:: 7. Pastikan berada di branch main
git branch -M main

:: 8. Git Push ke GitHub
echo.
echo [INFO] Mengunggah perubahan ke GitHub [origin main]...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [WARNING] Push langsung gagal. Mencoba sinkronisasi remote via pull rebase...
    git pull origin main --rebase --allow-unrelated-histories
    echo [INFO] Mencoba push ulang setelah rebase...
    git push -u origin main
)

if %errorlevel% equ 0 (
    echo.
    echo ===============================================================================
    echo [SUCCESS] Semua perubahan berhasil di-push ke GitHub!
    echo URL: https://github.com/Audira141415/AUDIRA-3D-SIMULATOR
    echo ===============================================================================
) else (
    echo.
    echo ===============================================================================
    echo [ERROR] Gagal melakukan push ke GitHub.
    echo Pastikan Anda memiliki izin akses ke repositori:
    echo https://github.com/Audira141415/AUDIRA-3D-SIMULATOR
    echo ===============================================================================
)

echo.
pause
