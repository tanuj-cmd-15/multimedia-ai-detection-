# 🚀 How to Run MayaBhedak Application

## 📌 Quick Start (Easiest Way)

Just run this command:

```powershell
.\QUICK_START.bat
```

This will automatically:
1. ✅ Start PostgreSQL + Redis (via Docker)
2. ✅ Start Auth Service (handles login/registration)
3. ✅ Start Trial Service (manages subscriptions)
4. ✅ Start Image Detection (AI model)
5. ✅ Start Frontend (React app)

**Then open:** http://localhost:3000

---

## 🎯 What You Need Installed

### Required Software:
- [x] **Docker Desktop** - For PostgreSQL and Redis
- [x] **Java 17+** - For Spring Boot services
  - Check: `java -version`
  - Download: https://adoptium.net/
- [x] **Maven** - For building Java
  - Check: `mvn -version`
  - Install: `choco install maven`
- [x] **Node.js 18+** - For React frontend
  - Check: `node -version`
  - Download: https://nodejs.org/
- [x] **Python 3.8+** - For AI models
  - Check: `python --version`

---

## 🏃 Three Ways to Run

### Method 1: Quick Start (Recommended for Testing)
```powershell
.\QUICK_START.bat
```
**Starts:** Auth + Trial + Image Detection + Frontend

---

### Method 2: Full Application (Complete Microservices)
```powershell
.\RUN_FULL_APP.bat
```
**Starts:** All microservices + ML services + Frontend

---

### Method 3: Docker Compose (Production-like)
```powershell
docker-compose up -d
```
**Starts:** Everything in Docker containers

---

## 📋 Startup Steps (Manual)

If you want to start services manually:

### Step 1: Start Infrastructure
```powershell
docker-compose -f docker-compose-infra.yml up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

### Step 2: Start Auth Service
Open new terminal:
```powershell
cd auth-service
mvn spring-boot:run
```
Wait for: `Started AuthServiceApplication`

### Step 3: Start Trial Service
Open new terminal:
```powershell
cd trial-service
mvn spring-boot:run
```
Wait for: `Started TrialServiceApplication`

### Step 4: Start Image Detection
Open new terminal:
```powershell
cd d:\Tushar\Application\AI-Generated-Image-Detector
python app.py
```
Wait for: `Running on http://0.0.0.0:5001`

### Step 5: Start Frontend
Open new terminal:
```powershell
cd frontend
npm install
npm run dev
```
Wait for: `Local: http://localhost:3000`

---

## ✅ Verify Everything is Running

### Check Services:
```powershell
# Auth Service
curl http://localhost:8082/actuator/health

# Trial Service
curl http://localhost:8083/actuator/health

# Image Service
curl http://localhost:5001/health

# Frontend (open in browser)
# http://localhost:3000
```

### Check Database:
```powershell
# PostgreSQL
docker exec -it mayabhedak-postgres psql -U mayabhedak -d mayabhedak -c "\dt"

# Redis
docker exec -it mayabhedak-redis redis-cli ping
```

---

## 🌐 Access Points

After all services start:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application UI |
| Auth Service | http://localhost:8082 | Login/Registration API |
| Trial Service | http://localhost:8083 | Subscription management |
| Image Detection | http://localhost:5001 | AI image analysis |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache |

---

## 🎮 Test the Application

### 1. Register a New User
- Go to http://localhost:3000/register
- Enter email, password, full name
- Click "Register"

### 2. Login
- Go to http://localhost:3000/login
- Enter your credentials
- You automatically get **50 free image detections**

### 3. Upload an Image
- Go to detection page
- Upload an AI-generated or real image
- View the detection result

### 4. Check Your Usage
- View your remaining detections
- See trial expiry date (14 days)

---

## 🛑 Stop All Services

### Stop Application Services:
Close all terminal windows (or press Ctrl+C in each)

### Stop Infrastructure:
```powershell
docker-compose -f docker-compose-infra.yml down
```

### Stop and Remove Everything:
```powershell
docker-compose -f docker-compose-infra.yml down -v
```
⚠️ **Warning:** This deletes all data!

---

## 🐛 Common Issues

### Issue 1: "Port already in use"
**Solution:**
```powershell
# Find what's using the port
netstat -ano | findstr :8082

# Kill the process
taskkill /PID <PID> /F
```

### Issue 2: "Docker not found"
**Solution:**
1. Install Docker Desktop from https://www.docker.com/
2. Make sure it's running
3. Try again

### Issue 3: "mvn not found"
**Solution:**
```powershell
# Install Maven
choco install maven

# Or download from https://maven.apache.org/
```

### Issue 4: "Connection refused to database"
**Solution:**
```powershell
# Check if PostgreSQL is running
docker ps | findstr postgres

# If not, start it
docker-compose -f docker-compose-infra.yml up -d postgres

# Check logs
docker logs mayabhedak-postgres
```

### Issue 5: Frontend won't start
**Solution:**
```powershell
cd frontend
# Delete node_modules and reinstall
rmdir /s /q node_modules
npm install
npm run dev
```

### Issue 6: "JWT validation failed"
**Solution:**
```powershell
# Generate JWT keys
.\generate-jwt-keys.bat

# Restart Auth Service
```

---

## 📊 Service Startup Times

Typical startup times:
- Infrastructure (Docker): ~10 seconds
- Auth Service: ~30 seconds
- Trial Service: ~30 seconds
- Image Detection: ~10 seconds
- Frontend: ~20 seconds

**Total:** ~2 minutes for all services

---

## 🔍 Logs and Debugging

### View Docker Logs:
```powershell
# All services
docker-compose -f docker-compose-infra.yml logs -f

# Specific service
docker logs mayabhedak-postgres
docker logs mayabhedak-redis
```

### View Application Logs:
Check the terminal window for each service

### Database Access:
```powershell
# Connect to PostgreSQL
docker exec -it mayabhedak-postgres psql -U mayabhedak -d mayabhedak

# List tables
\dt

# View users
SELECT * FROM users;

# Exit
\q
```

---

## 📦 What Each Service Does

### Auth Service (Port 8082)
- User registration
- Login (email/password, Google OAuth, mobile OTP)
- JWT token generation
- Email verification
- Password reset

### Trial Service (Port 8083)
- Free trial initialization (50 detections)
- Usage tracking
- Quota enforcement
- Plan management (Free, Pro, Enterprise)
- Subscription upgrades

### Image Detection (Port 5001)
- AI-powered image analysis
- Detects AI-generated images
- Returns confidence score
- Supports multiple formats

### Frontend (Port 3000)
- User interface
- Authentication pages
- Detection interface
- Dashboard
- Settings

---

## 🎯 Next Steps After Running

1. **Register** and create your account
2. **Login** and get your free trial
3. **Test detection** with sample images
4. **Check the dashboard** to see your usage
5. **Explore settings** to update your profile

---

## 📞 Need Help?

If services fail to start:

1. ✅ Check you have all prerequisites installed
2. ✅ Make sure Docker is running
3. ✅ Verify ports are not in use
4. ✅ Check the terminal for error messages
5. ✅ Review the logs

**Still stuck?** Check:
- START_GUIDE.md - Detailed troubleshooting
- docker-compose logs - Infrastructure issues
- Service terminal windows - Application errors

---

## 🚀 Ready to Start?

Run this now:
```powershell
.\QUICK_START.bat
```

Then open: **http://localhost:3000**

**Happy testing!** 🎉
