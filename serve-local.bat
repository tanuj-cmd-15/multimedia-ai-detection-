@echo off
echo ========================================
echo  MayaBhedak - Local Server
echo ========================================
echo.

cd frontend

REM Check if dist folder exists
if not exist "dist" (
    echo Build folder not found. Building now...
    call npm install
    call npm run build
)

echo.
echo Starting local server...
echo.
echo Server will be available at:
echo   - http://localhost:3000
echo   - http://127.0.0.1:3000
echo.
echo To access from other devices on your network:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    echo   - http:%%a:3000
)
echo.
echo Press Ctrl+C to stop the server
echo.

REM Try different server options
where serve >nul 2>nul
if %errorlevel% equ 0 (
    serve -s dist -p 3000
) else (
    REM Fallback to http-server
    where http-server >nul 2>nul
    if %errorlevel% equ 0 (
        http-server dist -p 3000
    ) else (
        REM Fallback to Python
        echo Installing serve package...
        npm install -g serve
        serve -s dist -p 3000
    )
)

pause
