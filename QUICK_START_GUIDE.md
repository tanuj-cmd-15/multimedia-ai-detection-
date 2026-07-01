# MayaBhedak - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### STEP 1: Answer These Questions (2 minutes)

**Check what you have installed:**
```powershell
# Check Java
java -version

# Check Maven
mvn -version

# Check Node
node -version

# Check Python
python --version

# Check Docker
docker --version
```

**Copy the output and tell me what's installed!**

---

### STEP 2: Start Infrastructure (5 minutes)

**Option A: Use Docker (EASIEST - Recommended)**
```powershell
# Navigate to project
cd d:\Tushar\Application\swarparikshan-app

# Start infrastructure
docker-compose -f docker-compose-infra.yml up -d

# Check status
docker ps

# You should see:
# - mayabhedak-postgres
# - mayabhedak-redis
# - mayabhedak-minio
# - mayabhedak-adminer (DB UI)
# - mayabhedak-redis-ui
```

**Option B: Install Locally**
- PostgreSQL: https://www.postgresql.org/download/windows/
- Redis: https://github.com/microsoftarchive/redis/releases

---

### STEP 3: Setup External Services (15 minutes)

#### A. Google OAuth Credentials
1. Go to: https://console.cloud.google.com/
2. Create new project: "MayaBhedak"
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:8082/auth/oauth2/callback/google`
6. Copy Client ID and Client Secret

#### B. Twilio (SMS/OTP)
1. Go to: https://www.twilio.com/try-twilio
2. Sign up (FREE $15 credit)
3. Get a phone number
4. Copy: Account SID, Auth Token, Phone Number

#### C. SendGrid (Email)
1. Go to: https://signup.sendgrid.com/
2. Sign up (FREE 100 emails/day)
3. Create API Key
4. Copy API Key

---

## 📋 What Information Do I Need From You?

**Please reply with:**

1. **Installed Software:**
   ```
   Java: YES/NO (version: ___)
   Maven: YES/NO
   Docker: YES/NO
   ```

2. **Preferred Setup:**
   - [ ] Use Docker for everything (I'll handle it)
   - [ ] Install services locally (more work, more control)

3. **External Services:**
   - [ ] I have Google OAuth credentials
   - [ ] I have Twilio account
   - [ ] I have SendGrid API key
   - [ ] I need help setting these up

4. **Time Available:**
   - [ ] I have 2-3 hours NOW (let's build auth service today!)
   - [ ] I have 30 minutes now (let's setup infrastructure)
   - [ ] I'll do this over the week (give me full roadmap)

---

## 🎯 Once You Answer, I'll Provide:

Based on your answers, I'll generate:

1. ✅ **Exact .env file** with your credentials
2. ✅ **Complete auth-service code** (working Spring Boot project)
3. ✅ **Step-by-step commands** to run everything
4. ✅ **Testing scripts** (Postman collections)

---

## ⚡ Super Quick Test (Right Now - 2 minutes)

**Let's verify Docker works:**

```powershell
# Start just Postgres and Redis
docker-compose -f docker-compose-infra.yml up -d postgres redis

# Check they're running
docker ps

# Test Postgres
docker exec -it mayabhedak-postgres psql -U mayabhedak_user -d mayabhedak -c "SELECT 'Database working!' as status"

# Test Redis
docker exec -it mayabhedak-redis redis-cli -a changeme123 ping
```

**Did both work? Tell me!**

---

## 💬 Example Responses

**Good Response:**
```
1. Installed: Java 11, Maven 3.8, Docker 20.10
2. Setup: Use Docker for everything
3. External: I have Google OAuth, need help with Twilio/SendGrid
4. Time: 2 hours now, let's build!
```

**Also Good:**
```
1. Only have Java and Maven, no Docker
2. Will install Postgres/Redis locally
3. No external accounts yet
4. 30 minutes now, more tomorrow
```

---

**👉 Reply with your status and I'll generate the exact next steps!**
