@echo off
echo ========================================
echo  MayaBhedak - Quick Start
echo ========================================
echo.
echo This starts ONLY the completed services:
echo   1. Infrastructure (Docker)
echo   2. Auth Service (8082)
echo   3. Trial Service (8083)
echo   4. Image Detection (5001)
echo   5. Frontend (3000)
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo [1/5] Starting Infrastructure...
echo ========================================
docker-compose -f docker-compose-infra.yml up -d

if errorlevel 1 (
    echo.
    echo ERROR: Docker failed to start!
    echo.
    echo Make sure Docker Desktop is running.
    echo Or start PostgreSQL and Redis manually.
    pause
    exit /b 1
)

echo Waiting for services to be ready...
timeout /t 10 /nobreak

echo.
echo [2/5] Starting Auth Service (Port 8082)...
echo ========================================
start "Auth Service - 8082" cmd /k "cd /d %~dp0auth-service && echo Starting Auth Service... && mvn spring-boot:run"
timeout /t 8 /nobreak

echo.
echo [3/5] Starting Trial Service (Port 8083)...
echo ========================================
start "Trial Service - 8083" cmd /k "cd /d %~dp0trial-service && echo Starting Trial Service... && mvn spring-boot:run"
timeout /t 8 /nobreak

echo.
echo [4/5] Starting Image Detection (Port 5001)...
echo ========================================
start "Image Service - 5001" cmd /k "cd /d d:\Tushar\Application\AI-Generated-Image-Detector && echo Starting Image Detection... && python app.py"
timeout /t 5 /nobreak

echo.
echo [5/5] Starting Frontend (Port 3000)...
echo ========================================
start "Frontend - 3000" cmd /k "cd /d %~dp0frontend && echo Starting Frontend... && npm run dev"

echo.
echo ========================================
echo  STARTUP COMPLETE!
echo ========================================
echo.
echo Services are starting in separate windows.
echo Please wait 30-60 seconds for all services to be ready.
echo.
echo Access the application:
echo   Frontend:      http://localhost:3000
echo   Auth Service:  http://localhost:8082/actuator/health
echo   Trial Service: http://localhost:8083/actuator/health
echo   Image Service: http://localhost:5001/health
echo.
echo Database:
echo   PostgreSQL:    localhost:5432 (database: mayabhedak)
echo   Redis:         localhost:6379
echo.
echo ========================================
echo.
echo To stop all services:
echo   1. Close each terminal window
echo   2. Run: docker-compose -f docker-compose-infra.yml down
echo.
echo ========================================
echo.
echo Check each terminal window for startup status.
echo Look for "Started" messages.
echo.
pause
