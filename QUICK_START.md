# Quick Start Guide

## 🚀 Fastest Way to Get Started

### Prerequisites
- ✅ Java 17+ installed
- ✅ Python 3.8+ installed  
- ✅ Node.js 16+ installed
- ✅ Model checkpoint file at correct path

### One-Command Start (Windows)

```bash
START_ALL.bat
```

This script will:
1. Start Python ML service on port 5000
2. Start Java backend on port 8080
3. Start React frontend on port 3000
4. Open the application in your browser

---

## 📝 Manual Start (Step by Step)

### Terminal 1: Python Service
```bash
cd python-service
python model_inference.py
```
Wait for: "Model loaded successfully!"

### Terminal 2: Java Backend
```bash
cd backend
mvn spring-boot:run
```
Wait for: "Started DeepfakeDetectionApplication"

### Terminal 3: React Frontend
```bash
cd frontend
npm run dev
```
Wait for: "Local: http://localhost:3000/"

---

## ✅ Verification

Visit these URLs to verify services:

1. **Frontend**: http://localhost:3000
   - Should show SwarParikshan home page

2. **Backend**: http://localhost:8080/api/health
   - Should return JSON: `{"status":"healthy"}`

3. **Python Service**: http://localhost:5000/health
   - Should return JSON with model info

---

## 🎯 First Test

1. Open http://localhost:3000/detection
2. Upload an audio file (WAV, MP3, etc.)
3. Click "Analyze Audio"
4. View results!

---

## 🛑 Stop Services

**Windows Batch Script Users:**
- Close the three command windows that opened

**Manual Start Users:**
- Press `Ctrl+C` in each terminal

---

## ⚠️ Common Issues

### Issue: Python service fails to start
**Fix**: Update checkpoint path in `python-service/model_inference.py` line 38

### Issue: Backend fails to start
**Fix**: Ensure port 8080 is not in use. Check with `netstat -ano | findstr :8080`

### Issue: Frontend can't connect
**Fix**: Ensure backend is running on port 8080

---

## 📞 Need Help?

See `SETUP_GUIDE.md` for detailed troubleshooting.
