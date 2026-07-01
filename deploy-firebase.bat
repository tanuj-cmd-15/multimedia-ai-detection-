@echo off
echo ========================================
echo  MayaBhedak - Firebase Hosting Deploy
echo ========================================
echo.

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
echo [3/4] Checking Firebase CLI...
where firebase >nul 2>nul
if %errorlevel% neq 0 (
    echo Firebase CLI not found. Installing...
    call npm install -g firebase-tools
)

echo.
echo [4/4] Deploying to Firebase...
echo.
echo First time setup:
echo   firebase login
echo   firebase init hosting
echo   (Select: dist as public directory, SPA: Yes)
echo.
echo Then deploy:
firebase deploy

echo.
echo ========================================
echo  Deployment Complete!
echo ========================================
echo.
pause
