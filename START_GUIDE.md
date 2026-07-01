# 🚀 MayaBhedak - Complete Startup Guide

## Current Status

Your application has **two architectures** available:

### ✅ Architecture 1: Legacy Monolithic (Working)
- Backend Service (Port 8081)
- Image Detection (Port 5001)
- Audio Detection (Port 5000)
- Frontend (Port 3000)

### 🔄 Architecture 2: Microservices (In Progress)
- ✅ Auth Service (Port 8082) - **COMPLETE**
- ✅ Trial Service (Port 8083) - **COMPLETE**
- 🟡 API Gateway (Port 8080) - **70% COMPLETE**
- 🟡 Support Service (Port 8084) - **60% COMPLETE**
- 🟡 Notification Service (Port 8085) - **40% COMPLETE**

---

## 🎯 Choose Your Path

### Option A: Run Complete Application (Recommended)
Uses the new microservices where ready, falls back to legacy where needed.

```powershell
.\RUN_FULL_APP.bat
```

This will start:
1. Infrastructure (PostgreSQL + Redis) via Docker
2. Auth Service (8082)
3. Trial Service (8083)
4. API Gateway (8080)
5. Legacy Backend (8081)
6. Image Detection (5001)
7. Frontend (3000)

---

### Option B: Run Legacy Only (Quick Test)
Uses the existing working services.

```powershell
.\START_ALL_SERVICES.bat
```

This will start:
1. Backend (8081)
2. Image Detection (5001)
3. Frontend (3000)

---

### Option C: Docker Compose (Full Stack)
Run everything in Docker containers.

```powershell
docker-compose up -d
```

---

## 📋 Prerequisites

### Required:
- ✅ **Java 17+** (for Spring Boot services)
- ✅ **Maven** (for building Java services)
- ✅ **Node.js 18+** (for React frontend)
- ✅ **Python 3.8+** (for ML services)

### Infrastructure (Choose One):
- **Option A:** Docker Desktop (easiest)
- **Option B:** Local PostgreSQL 15 + Redis 7

---

## 🔧 Step-by-Step Manual Startup

### Step 1: Start Infrastructure

#### Using Docker (Recommended):
```powershell
docker-compose -f docker-compose-infra.yml up -d
```

#### Without Docker:
1. Install PostgreSQL 15
   - Create database: `mayabhedak`
   - Username: `mayabhedak`
   - Password: `mayabhedak_password`

2. Install Redis 7
   - Start on default port 6379

### Step 2: Configure Environment

Copy the example environment file:
```powershell
copy .env.example .env
```

Edit `.env` and configure:
- Database credentials
- Redis connection
- JWT secret keys
- Google OAuth credentials (if using)
- Twilio credentials (if using)
- SendGrid credentials (if using)

### Step 3: Generate JWT Keys

Run the key generation script:
```powershell
.\generate-jwt-keys.bat
```

This creates:
- `auth-service/src/main/resources/secrets/private_key.pem`
- `auth-service/src/main/resources/secrets/public_key.pem`
- `gateway/src/main/resources/secrets/public_key.pem`

### Step 4: Start Microservices

Open **separate terminal windows** for each service:

#### Terminal 1 - Auth Service:
```powershell
cd auth-service
mvn spring-boot:run
```
Wait for: `Started AuthServiceApplication`

#### Terminal 2 - Trial Service:
```powershell
cd trial-service
mvn spring-boot:run
```
Wait for: `Started TrialServiceApplication`

#### Terminal 3 - API Gateway:
```powershell
cd gateway
mvn spring-boot:run
```
Wait for: `Netty started on port 8080`

#### Terminal 4 - Legacy Backend:
```powershell
cd backend
mvn spring-boot:run
```
Wait for: `Started DeepfakeDetectionApplication`

#### Terminal 5 - Image Detection:
```powershell
cd d:\Tushar\Application\AI-Generated-Image-Detector
python app.py
```
Wait for: `Running on http://0.0.0.0:5001`

#### Terminal 6 - Frontend:
```powershell
cd frontend
npm install
npm run dev
```
Wait for: `Local: http://localhost:3000`

---

## ✅ Verify Services

### Check Health Endpoints:

```powershell
# API Gateway (should return aggregated health)
curl http://localhost:8080/actuator/health

# Auth Service
curl http://localhost:8082/actuator/health

# Trial Service
curl http://localhost:8083/actuator/health

# Legacy Backend
curl http://localhost:8081/api/health

# Image Service
curl http://localhost:5001/health
```

### Check Databases:

```powershell
# PostgreSQL
docker exec -it mayabhedak-postgres psql -U mayabhedak -d mayabhedak -c "\dt"

# Redis
docker exec -it mayabhedak-redis redis-cli ping
```

---

## 🌐 Access Points

### User-Facing:
- **Frontend:** http://localhost:3000
- **API Gateway:** http://localhost:8080 (use this for API calls)

### Direct Service Access (Development):
- Auth Service: http://localhost:8082
- Trial Service: http://localhost:8083
- Backend Service: http://localhost:8081
- Image Detection: http://localhost:5001

### Infrastructure:
- PostgreSQL: localhost:5432
- Redis: localhost:6379

---

## 🐛 Troubleshooting

### "Port already in use"
```powershell
# Find process
netstat -ano | findstr :8080

# Kill process
taskkill /PID <PID> /F
```

### "Connection refused to PostgreSQL"
```powershell
# Check Docker container
docker ps | findstr postgres

# Check logs
docker logs mayabhedak-postgres

# Restart
docker-compose -f docker-compose-infra.yml restart postgres
```

### "JWT validation failed"
Make sure you've run `generate-jwt-keys.bat` and both services have the keys.

### "Maven not found"
Install Maven:
```powershell
choco install maven
```

### "npm not found"
Install Node.js from https://nodejs.org/

---

## 📊 Service Startup Order

1. **Infrastructure** (PostgreSQL, Redis) - Must be first
2. **Auth Service** (8082) - Manages authentication
3. **Trial Service** (8083) - Manages subscriptions
4. **API Gateway** (8080) - Routes requests to services
5. **Legacy Backend** (8081) - ML coordination
6. **Image Detection** (5001) - AI detection
7. **Frontend** (3000) - User interface

---

## 🎯 Quick Commands

### Start Everything:
```powershell
.\RUN_FULL_APP.bat
```

### Start Infrastructure Only:
```powershell
docker-compose -f docker-compose-infra.yml up -d
```

### Stop Infrastructure:
```powershell
docker-compose -f docker-compose-infra.yml down
```

### View Logs:
```powershell
docker-compose -f docker-compose-infra.yml logs -f
```

### Clean Restart:
```powershell
docker-compose -f docker-compose-infra.yml down -v
docker-compose -f docker-compose-infra.yml up -d
```

---

## 📝 Next Steps After Startup

1. **Register a user** at http://localhost:3000/register
2. **Verify email** (check console logs for verification code)
3. **Log in** and get free trial (50 audio + 50 image detections)
4. **Test detection** by uploading audio/image files
5. **Check your usage** in the dashboard

---

## 🆘 Need Help?

If services fail to start:
1. Check the terminal window for error messages
2. Verify all prerequisites are installed
3. Ensure ports are not in use
4. Check `.env` configuration
5. Verify database is running

---

**Ready to start?** Run `.\RUN_FULL_APP.bat` now! 🚀
