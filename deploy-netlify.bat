@echo off
echo ========================================
echo  MayaBhedak - Netlify Deployment
echo ========================================
echo.

REM Navigate to frontend directory
cd frontend

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/4] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/4] Checking Netlify CLI...
where netlify >nul 2>nul
if %errorlevel% neq 0 (
    echo Netlify CLI not found. Installing...
    call npm install -g netlify-cli
)

echo.
echo [4/4] Deploying to Netlify...
echo.
echo Choose deployment type:
echo 1. Deploy for testing (draft)
echo 2. Deploy to production
echo.
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    netlify deploy
) else if "%choice%"=="2" (
    netlify deploy --prod
) else (
    echo Invalid choice
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Deployment Complete!
echo ========================================
echo.
echo Your site is now live on Netlify.
echo Check the URL above to access it.
echo.
pause
