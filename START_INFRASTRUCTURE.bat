@echo off
echo ========================================
echo Starting MayaBhedak Infrastructure
echo ========================================
echo.

cd /d %~dp0

echo [1/4] Starting Docker containers...
docker-compose -f docker-compose-infra.yml up -d

echo.
echo [2/4] Waiting for services to be ready...
timeout /t 15 /nobreak

echo.
echo [3/4] Checking container status...
docker ps

echo.
echo [4/4] Testing connections...
echo Testing PostgreSQL...
docker exec mayabhedak-postgres psql -U mayabhedak_user -d mayabhedak -c "SELECT 'Database Ready!' as status"

echo.
echo Testing Redis...
docker exec mayabhedak-redis redis-cli -a changeme123 ping

echo.
echo ========================================
echo Infrastructure Started Successfully!
echo ========================================
echo.
echo Database UI: http://localhost:8088
echo Redis UI: http://localhost:8089
echo.
echo Press any key to open Database UI...
pause
start http://localhost:8088

