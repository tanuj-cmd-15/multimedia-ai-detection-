# 🚀 Start MayaBhedak Application - Complete Guide

## 📋 What You Need Running

Your application has 4 services:

1. **Backend (Java Spring Boot)** - Port 8081
2. **Audio Detection (Python)** - Port 5000
3. **Image Detection (Python)** - Port 5001
4. **Frontend (React)** - Port 3000

---

## ⚡ Quick Start (All Services)

I'll guide you step by step. Let's start!

---

## 🎯 STEP 1: Start Backend (Java)

### Open Terminal 1:

```powershell
cd d:\Tushar\Application\swarparikshan-app\backend
mvn spring-boot:run
```

**Wait for this message:**
```
Started DeepfakeDetectionApplication in X.XXX seconds
```

**Expected output:**
- Backend running on: http://localhost:8081
- H2 Database console: http://localhost:8081/h2-console

**Tell me when you see:** "Started DeepfakeDetectionApplication"

---

## 🎯 STEP 2: Start Audio Detection Service (Python)

### Where is your audio service?

Based on your folders, I see:
- `d:\Tushar\Application\cnnbilstem\` (your audio model)
- Model checkpoint: `d:\Tushar\Application\cnnbilstem\outputs\checkpoints\ckpt_best.pth`

**Question for you:**
1. Do you have a Python Flask/FastAPI service for audio detection?
2. Or should I create one from your model?

**If you have it:** Tell me the path
**If you don't:** I'll create one for you

---

## 🎯 STEP 3: Start Image Detection Service (Python)

### Where is your image service?

I see:
- `d:\Tushar\Application\AI-Generated-Image-Detector\app.py`
- Model: `d:\Tushar\Application\AI-Generated-Image-Detector\best_model.pth`

**Let's start this:**

### Open Terminal 2:

```powershell
cd d:\Tushar\Application\AI-Generated-Image-Detector
python app.py
```

**Expected output:**
- Running on http://localhost:5001

**Tell me:** Did it start successfully?

---

## 🎯 STEP 4: Start Frontend (React)

### Open Terminal 3:

```powershell
cd d:\Tushar\Application\swarparikshan-app\frontend
npm install
npm run dev
```

**Expected output:**
```
VITE ready in XXX ms
Local: http://localhost:3000
```

**Tell me:** Did it start successfully?

---

## ✅ Verification Checklist

After all services start, you should have:

- [ ] Backend: http://localhost:8081 (returns JSON)
- [ ] Image Service: http://localhost:5001 (Python running)
- [ ] Audio Service: http://localhost:5000 (Python running)
- [ ] Frontend: http://localhost:3000 (React app)

---

## 🔧 If You Get Errors

### Error: "mvn command not found"
**Solution:** Install Maven
```powershell
# Download from: https://maven.apache.org/download.cgi
# Or use: choco install maven
```

### Error: "python command not found"
**Solution:** 
```powershell
# Try: python3 app.py
# Or: py app.py
```

### Error: "npm command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Error: "Port already in use"
**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :8081
# Kill it
taskkill /PID <PID> /F
```

---

## 💬 What Should You Do NOW?

**STEP 1:** Open a terminal and run:
```powershell
cd d:\Tushar\Application\swarparikshan-app\backend
mvn spring-boot:run
```

**Then tell me:**
- ✅ "Backend started successfully"
- ❌ "Error: ..." (share the error)
- ❓ "Don't have Maven installed"
- 📁 "Where is audio service?"

**I'll wait for your response, then guide you to the next step!** 🚀
