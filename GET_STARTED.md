# 🚀 Get Started with SwarParikshan

Welcome! This guide will get you up and running in just a few minutes.

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Update Model Path (1 minute)
Open this file:
```
python-service/model_inference.py
```

Find line 38 and update:
```python
CHECKPOINT_PATH = r'D:\Tushar\Application\cnnbilstem\outputs\checkpoints\ckpt_best.pth'
```

### Step 2: Install Dependencies (3 minutes)

**Python:**
```bash
cd python-service
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
mvn clean install
```

### Step 3: Start Services (1 minute)

**Option A - Automatic (Windows):**
```bash
START_ALL.bat
```

**Option B - Manual:**
Open 3 terminals:

Terminal 1:
```bash
cd python-service
python model_inference.py
```

Terminal 2:
```bash
cd backend
mvn spring-boot:run
```

Terminal 3:
```bash
cd frontend
npm run dev
```

### Step 4: Open Application
Visit: **http://localhost:3000**

---

## 🎯 First Test

1. Click **"Detection"** in navbar
2. Upload an audio file (WAV, MP3, etc.)
3. Click **"Analyze Audio"**
4. View results!

---

## 📁 What You Got

### Frontend (React)
Beautiful, modern web interface with:
- Home page
- Detection interface
- Analysis history
- Responsive design

### Backend (Java Spring Boot)
RESTful API with:
- Audio analysis endpoints
- Database persistence
- Python service integration

### ML Service (Python)
Deep learning model with:
- CNN-BiLSTM-Attention architecture
- Feature extraction
- Real-time inference

---

## 🌐 Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 8080 | http://localhost:8080 |
| Python | 5000 | http://localhost:5000 |

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | Main documentation |
| **QUICK_START.md** | Fast setup guide |
| **SETUP_GUIDE.md** | Detailed setup with troubleshooting |
| **ARCHITECTURE.md** | System architecture details |
| **PROJECT_SUMMARY.md** | Complete project overview |
| **CHECKLIST.md** | Setup verification checklist |
| **GET_STARTED.md** | This file |

---

## ❓ Common Questions

**Q: Do I need GPU?**
A: No, CPU works fine (slower but functional)

**Q: Which audio formats are supported?**
A: WAV, MP3, FLAC, OGG, M4A

**Q: Max file size?**
A: 50MB

**Q: How accurate is it?**
A: ~98.4% based on model training

**Q: Can I use this commercially?**
A: Check license terms

---

## 🐛 Something Not Working?

### Quick Fixes

**Python service won't start:**
```bash
# Update model path in model_inference.py line 38
```

**Backend won't start:**
```bash
# Check Java version
java -version
# Should be 17+
```

**Frontend won't start:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

**Can't upload files:**
```bash
# Check all 3 services are running
# Check no CORS errors in browser console
```

---

## ✅ Verify Installation

Run these commands to check everything:

```bash
# Check services
curl http://localhost:5000/health    # Python
curl http://localhost:8080/api/health # Backend
curl http://localhost:3000           # Frontend (or use browser)
```

All should return responses (not errors).

---

## 🎓 Next Steps

### Learn More
1. Read **ARCHITECTURE.md** for technical details
2. Check **API Endpoints** in README.md
3. Explore the **Frontend** components
4. Customize the **UI/UX**

### Enhance
1. Add authentication
2. Implement batch processing
3. Add more visualizations
4. Deploy to cloud

### Share
1. Show to colleagues
2. Get feedback
3. Contribute improvements
4. Report issues

---

## 🎉 You're Ready!

Your audio deepfake detection platform is now ready to use.

Upload audio files and start detecting deepfakes!

---

## 💡 Tips

- Start with small audio files (<5MB) for faster testing
- Check the History page to see all your analyses
- The model works better with clean audio (no background noise)
- Results include detailed feature analysis for research purposes

---

## 📞 Need Help?

1. **Check Logs**
   - Python: Terminal output
   - Backend: Spring Boot console
   - Frontend: Browser console (F12)

2. **Review Docs**
   - SETUP_GUIDE.md has detailed troubleshooting
   - CHECKLIST.md helps verify everything

3. **Verify Setup**
   - All services running?
   - Ports available?
   - Dependencies installed?

---

## 🌟 Features at a Glance

✅ Upload audio files (drag & drop)
✅ Real-time deepfake detection
✅ Confidence scores
✅ Detailed analysis results
✅ Feature visualization
✅ Analysis history
✅ Professional UI
✅ Responsive design
✅ Database persistence
✅ REST API

---

**Start detecting audio deepfakes now!** 🎵🔍

Open http://localhost:3000 and upload your first audio file.

---

*Built with React, Spring Boot, and PyTorch*
*Inspired by AuriGin.ai design*
