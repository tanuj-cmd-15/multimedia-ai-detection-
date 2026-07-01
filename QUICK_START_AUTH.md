# 🚀 Auth Service - 5 Minute Quick Start

## Prerequisites
- Docker Desktop installed
- Java 11 or higher
- Maven 3.6 or higher

## Setup (First Time Only)

### Step 1: Generate JWT Keys (30 seconds)
```bash
generate-jwt-keys.bat
```

### Step 2: Copy Environment File (10 seconds)
```bash
copy .env.example .env
```

### Step 3: Start Infrastructure (1 minute)
```bash
docker-compose up -d postgres redis
```
Wait 30 seconds for databases to initialize.

## Run Auth Service

### Option A: Quick Start Script
```bash
start-auth-service.bat
```

### Option B: Manual Start
```bash
cd auth-service
mvn spring-boot:run
```

## Test It Works

### 1. Check Health
```bash
curl http://localhost:8082/auth/health
```

Expected: `{"status":"UP","service":"auth-service"}`

### 2. Register a User
```bash
curl -X POST http://localhost:8082/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"demo@test.com\",\"password\":\"Demo1234\",\"fullName\":\"Demo User\"}"
```

### 3. Login
```bash
curl -X POST http://localhost:8082/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"demo@test.com\",\"password\":\"Demo1234\"}"
```

You'll get back JWT tokens!

## What Works Now

✅ **Email/Password Login** - Ready to use  
⚠️ **Google OAuth** - Needs Google credentials  
⚠️ **Mobile OTP** - Needs Twilio credentials  

## Enable Full Features

Edit `.env` and add:

```bash
# Google OAuth (get from console.cloud.google.com)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret

# Twilio SMS (get from twilio.com)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

Restart the service.

## Troubleshooting

### "Failed to load private key"
Run `generate-jwt-keys.bat`

### "Database connection failed"
```bash
docker-compose restart postgres
docker-compose logs postgres
```

### "Build failed"
```bash
cd auth-service
mvn clean install
```

## Next Steps

1. ✅ Auth Service working
2. 🔄 Build Trial Service (port 8083)
3. 🔄 Build API Gateway (port 8080)
4. 🔄 Update Frontend to use new auth

## Help

- Full guide: `AUTH_SERVICE_SETUP.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Check logs: `docker-compose logs auth-service`
