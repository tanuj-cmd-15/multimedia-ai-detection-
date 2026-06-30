@echo off
echo ====================================
echo  SwarParikshan - Starting All Services
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo [1/3] Starting Python ML Service (Flask)...
start "Python Service" cmd /k "cd python-service && python model_inference.py"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Java Backend (Spring Boot)...
start "Java Backend" cmd /k "cd backend && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo [3/3] Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ====================================
echo  All Services Started!
echo ====================================
echo.
echo Python Service: http://localhost:5000
echo Java Backend:   http://localhost:8080
echo React Frontend: http://localhost:3000
echo.
echo Press any key to open the application in browser...
pause >nul

start http://localhost:3000

echo.
echo Services are running in separate windows.
echo Close those windows to stop the services.
pause
