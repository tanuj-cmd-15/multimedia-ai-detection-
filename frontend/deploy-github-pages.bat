@echo off
echo ========================================
echo Deploying MayaBhedak to GitHub Pages
echo ========================================
echo.

cd /d %~dp0

echo [1/5] Installing gh-pages package...
call npm install --save-dev gh-pages

echo.
echo [2/5] Building production bundle...
call npm run build

echo.
echo [3/5] Adding homepage to package.json...
echo NOTE: Manually add this line to package.json:
echo   "homepage": "https://YOUR_USERNAME.github.io/mayabhedak"
pause

echo.
echo [4/5] Adding deploy scripts to package.json...
echo NOTE: Add these to "scripts" in package.json:
echo   "predeploy": "npm run build",
echo   "deploy": "gh-pages -d dist"
pause

echo.
echo [5/5] Deploying...
call npm run deploy

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your site will be live at:
echo https://YOUR_USERNAME.github.io/mayabhedak
echo.
echo Note: May take 5-10 minutes to go live
pause
