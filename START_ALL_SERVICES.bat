@echo off
echo ========================================
echo  MayaBhedak - Starting All Services
echo ========================================
echo.

echo This will open 4 terminal windows:
echo 1. Backend (Java) - Port 8081
echo 2. Image Service (Python) - Port 5001
echo 3. Audio Service (Python) - Port 5000
echo 4. Frontend (React) - Port 3000
echo.
echo Press any key to start...
pause

REM Start Backend
start "Backend - Port 8081" cmd /k "cd /d d:\Tushar\Application\swarparikshan-app\backend && mvn spring-boot:run"

REM Wait 5 seconds
timeout /t 5 /nobreak

REM Start Image Detection Service
start "Image Service - Port 5001" cmd /k "cd /d d:\Tushar\Application\AI-Generated-Image-Detector && python app.py"

REM Wait 3 seconds
timeout /t 3 /nobreak

REM Start Audio Detection Service (if exists)
echo.
echo NOTE: Audio service needs to be configured.
echo Check START_APPLICATION.md for details.
echo.

REM Wait 3 seconds
timeout /t 3 /nobreak

REM Start Frontend
start "Frontend - Port 3000" cmd /k "cd /d d:\Tushar\Application\swarparikshan-app\frontend && npm install && npm run dev"

echo.
echo ========================================
echo  All Services Starting...
echo ========================================
echo.
echo Check each terminal window for status.
echo.
echo Backend:  http://localhost:8081
echo Image:    http://localhost:5001
echo Audio:    http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause
