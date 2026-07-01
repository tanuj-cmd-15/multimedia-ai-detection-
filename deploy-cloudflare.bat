@echo off
echo ========================================
echo  MayaBhedak - Cloudflare Pages Deploy
echo ========================================
echo.

cd frontend

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/3] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/3] Deploying to Cloudflare...
echo.
echo To deploy to Cloudflare Pages:
echo.
echo 1. Go to: https://pages.cloudflare.com/
echo 2. Sign up / Login with GitHub
echo 3. Click "Create a project"
echo 4. Connect your GitHub repository
echo 5. Use these build settings:
echo.
echo    Build command: cd frontend ^&^& npm install ^&^& npm run build
echo    Build output directory: frontend/dist
echo    Root directory: /
echo.
echo 6. Click "Save and Deploy"
echo.
echo Your build is ready in the 'dist' folder!
echo.
echo Alternatively, you can use Wrangler CLI:
echo    npm install -g wrangler
echo    wrangler pages publish dist --project-name=mayabhedak
echo.
pause
