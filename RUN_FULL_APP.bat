@echo off
echo ========================================
echo  MayaBhedak - Full Application Startup
echo ========================================
echo.
echo This will start all services in separate windows:
echo.
echo INFRASTRUCTURE:
echo   - PostgreSQL (Port 5432)
echo   - Redis (Port 6379)
echo.
echo MICROSERVICES (New Architecture):
echo   1. Auth Service (Port 8082) - Spring Boot
echo   2. Trial Service (Port 8083) - Spring Boot
echo   3. API Gateway (Port 8080) - Spring Cloud Gateway
echo.
echo ML SERVICES (Legacy):
echo   4. Backend Service (Port 8081) - Spring Boot
echo   5. Image Detection (Port 5001) - Python/Flask
echo.
echo FRONTEND:
echo   6. React Frontend (Port 3000)
echo.
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo.
    echo Please create .env file from .env.example:
    echo   copy .env.example .env
    echo.
    echo Then configure your environment variables.
    pause
    exit /b 1
)

echo Step 1: Starting Infrastructure (PostgreSQL + Redis)...
echo ========================================
echo.
echo Option A: Using Docker (Recommended)
echo   docker-compose -f docker-compose-infra.yml up -d
echo.
echo Option B: Manual Setup
echo   - Install PostgreSQL 15 and create database 'mayabhedak'
echo   - Install Redis 7 and start on port 6379
echo.
set /p choice="Do you have Docker installed? (y/n): "
if /i "%choice%"=="y" (
    echo Starting Docker containers...
    docker-compose -f docker-compose-infra.yml up -d
    echo.
    echo Waiting for services to be ready...
    timeout /t 10 /nobreak
) else (
    echo.
    echo Make sure PostgreSQL and Redis are running manually.
    echo Press any key when ready...
    pause
)

echo.
echo ========================================
echo Step 2: Starting Auth Service (Port 8082)
echo ========================================
start "Auth Service - 8082" cmd /k "cd /d %~dp0auth-service && mvn spring-boot:run"
timeout /t 5 /nobreak

echo.
echo ========================================
echo Step 3: Starting Trial Service (Port 8083)
echo ========================================
start "Trial Service - 8083" cmd /k "cd /d %~dp0trial-service && mvn spring-boot:run"
timeout /t 5 /nobreak

echo.
echo ========================================
echo Step 4: Starting API Gateway (Port 8080)
echo ========================================
echo NOTE: Gateway routes all requests to other services
start "API Gateway - 8080" cmd /k "cd /d %~dp0gateway && mvn spring-boot:run"
timeout /t 5 /nobreak

echo.
echo ========================================
echo Step 5: Starting Legacy Backend (Port 8081)
echo ========================================
start "Backend - 8081" cmd /k "cd /d %~dp0backend && mvn spring-boot:run"
timeout /t 5 /nobreak

echo.
echo ========================================
echo Step 6: Starting Image Detection (Port 5001)
echo ========================================
start "Image Service - 5001" cmd /k "cd /d d:\Tushar\Application\AI-Generated-Image-Detector && python app.py"
timeout /t 3 /nobreak

echo.
echo ========================================
echo Step 7: Starting Frontend (Port 3000)
echo ========================================
start "Frontend - 3000" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo  ALL SERVICES STARTING...
echo ========================================
echo.
echo Check each terminal window for startup status.
echo.
echo Services will be available at:
echo   API Gateway:    http://localhost:8080 (MAIN ENTRY POINT)
echo   Auth Service:   http://localhost:8082
echo   Trial Service:  http://localhost:8083
echo   Backend:        http://localhost:8081
echo   Image Service:  http://localhost:5001
echo   Frontend:       http://localhost:3000
echo.
echo Database:
echo   PostgreSQL:     localhost:5432 (database: mayabhedak)
echo   Redis:          localhost:6379
echo.
echo ========================================
echo IMPORTANT: Access the app through the Gateway!
echo.
echo   Frontend: http://localhost:3000
echo   API:      http://localhost:8080/api
echo.
echo ========================================
echo.
echo Startup logs are in each terminal window.
echo Close this window when done reviewing.
echo.
pause
