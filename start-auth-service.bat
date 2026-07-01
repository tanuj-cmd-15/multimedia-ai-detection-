@echo off
echo ========================================
echo MayaBhedak - Auth Service Startup
echo ========================================
echo.

REM Check if JWT keys exist
if not exist "auth-service\src\main\resources\secrets\private_key.pem" (
    echo ERROR: JWT keys not found!
    echo Please run generate-jwt-keys.bat first.
    echo.
    pause
    exit /b 1
)

echo [1/4] Starting PostgreSQL and Redis...
docker-compose up -d postgres redis

echo.
echo [2/4] Waiting for databases to be ready (30 seconds)...
timeout /t 30 /nobreak

echo.
echo [3/4] Building Auth Service...
cd auth-service
call mvn clean package -DskipTests
if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [4/4] Starting Auth Service...
start "Auth Service" mvn spring-boot:run

echo.
echo ========================================
echo Auth Service started successfully!
echo ========================================
echo.
echo Service URL: http://localhost:8082
echo Health Check: http://localhost:8082/auth/health
echo.
echo Available Endpoints:
echo   POST /auth/register - Register new user
echo   POST /auth/login - Login with email/password
echo   POST /auth/otp/request - Request mobile OTP
echo   POST /auth/otp/verify - Verify OTP
echo.
echo Press Ctrl+C to stop the service
echo.
pause
