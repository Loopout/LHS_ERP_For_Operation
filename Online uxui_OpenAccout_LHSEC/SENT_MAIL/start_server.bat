@echo off
title Auto Mail Sender Server
echo ===================================================
echo       Starting Auto Mail Sender Server...
echo ===================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please download and install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b
)

:: Check if node_modules exists, if not run npm install
if not exist "node_modules\" (
    echo [INFO] Installing required dependencies (first-time setup)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b
    )
)

echo [INFO] Starting server on http://localhost:3000 ...
echo [INFO] Press Ctrl+C to stop the server.
echo.

:: Automatically open browser
start http://localhost:3000

:: Run server
node server.js

pause
