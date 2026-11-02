@echo off
title AUDIRA 3D SIMULATOR - Launcher Menu
color 0e

echo ===============================================================================
echo                AUDIRA 3D CONSTRUCTION SIMULATOR - LAUNCHER
echo ===============================================================================
echo.
echo Pilih mode yang ingin Anda jalankan:
echo.
echo [1] Versi Web Browser + Komponen API (start_web.bat)
echo [2] Versi Desktop Native Tauri 2.x  (start_app.bat)
echo [3] Hentikan Semua Proses          (stop.bat)
echo.
set /p choice="Masukkan pilihan [1/2/3] (Default 1): "

if "%choice%"=="2" goto launch_app
if "%choice%"=="3" goto launch_stop
goto launch_web

:launch_web
call "%~dp0start_web.bat"
exit /b 0

:launch_app
call "%~dp0start_app.bat"
exit /b 0

:launch_stop
call "%~dp0stop.bat"
exit /b 0
