# 🎯 SwarParikshan - Setup & Launch Checklist

Use this checklist to ensure everything is set up correctly before launching the application.

---

## 📋 Pre-Launch Checklist

### 1. Software Installation
- [ ] Java 17+ installed (`java -version`)
- [ ] Maven 3.6+ installed (`mvn -version`)
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] Git installed (optional) (`git --version`)

### 2. Model Setup
- [ ] Model checkpoint file (`ckpt_best.pth`) is available
- [ ] Model path in `python-service/model_inference.py` is updated (line 38)
- [ ] Model file size is reasonable (< 500MB)
- [ ] Can access model directory

### 3. Python Service Setup
- [ ] Navigated to `python-service` folder
- [ ] Created virtual environment (optional)
- [ ] Activated virtual environment
- [ ] Installed requirements: `pip install -r requirements.txt`
- [ ] All Python packages installed without errors
- [ ] Updated CHECKPOINT_PATH in model_inference.py

### 4. Backend Setup
- [ ] Navigated to `backend` folder
- [ ] Maven dependencies downloaded: `mvn clean install`
- [ ] Build completed successfully (no errors)
- [ ] Port 8080 is available (not in use)

### 5. Frontend Setup
- [ ] Navigated to `frontend` folder
- [ ] Node modules installed: `npm install`
- [ ] No critical vulnerabilities in dependencies
- [ ] Port 3000 is available (not in use)

---

## 🚀 Launch Checklist

### Before Starting Services

- [ ] All previous services are stopped
- [ ] Ports 3000, 5000, 8080 are free
- [ ] You have 3 terminal windows ready
- [ ] Model checkpoint path is correct

### Service 1: Python ML Service

**Terminal 1:**
```bash
cd python-service
python model_inference.py
```

**Check:**
- [ ] No import errors
- [ ] Model loaded successfully message appears
- [ ] "Starting Flask API Server" message appears
- [ ] Server running on port 5000
- [ ] No CUDA errors (if using CPU)

**Test:**
```bash
curl http://localhost:5000/health
```
- [ ] Returns JSON with model info

### Service 2: Java Backend

**Terminal 2:**
```bash
cd backend
mvn spring-boot:run
```

**Check:**
- [ ] Maven downloads dependencies (first time)
- [ ] Application starts without errors
- [ ] "Started DeepfakeDetectionApplication" message appears
- [ ] Server running on port 8080
- [ ] H2 database initialized

**Test:**
```bash
curl http://localhost:8080/api/health
```
- [ ] Returns: `{"status":"healthy",...}`

### Service 3: React Frontend

**Terminal 3:**
```bash
cd frontend
npm run dev
```

**Check:**
- [ ] Vite server starts
- [ ] No compilation errors
- [ ] "Local: http://localhost:3000/" appears
- [ ] Port shown is accessible

**Test:**
- [ ] Open browser: http://localhost:3000
- [ ] Home page loads correctly
- [ ] No console errors in browser

---

## 🧪 Functionality Testing

### Test 1: Basic Navigation
- [ ] Home page loads
- [ ] Can navigate to Detection page
- [ ] Can navigate to History page
- [ ] Navbar highlights active page
- [ ] Back button works
- [ ] All links work

### Test 2: File Upload
- [ ] Can click upload area
- [ ] File dialog opens
- [ ] Can select audio file
- [ ] File appears in UI after selection
- [ ] File details shown (name, size)
- [ ] Can remove selected file
- [ ] "Analyze Audio" button is enabled

### Test 3: Audio Analysis
- [ ] Click "Analyze Audio" button
- [ ] Loading indicator appears
- [ ] No errors in browser console
- [ ] No errors in terminal logs
- [ ] Analysis completes (wait 2-10 seconds)
- [ ] Results appear

### Test 4: Results Display
- [ ] Prediction shown (REAL or AI-GENERATED)
- [ ] Confidence percentage displayed
- [ ] Score bars visible
- [ ] Audio info shown (duration, sample rate)
- [ ] Feature statistics displayed
- [ ] Model info shown
- [ ] Interpretation text appears
- [ ] Results look professional

### Test 5: Analysis History
- [ ] Navigate to History page
- [ ] Recent analysis appears in list
- [ ] Analysis details are correct
- [ ] Timestamp is shown
- [ ] Color coding matches prediction
- [ ] Can see multiple analyses if available

### Test 6: Error Handling
- [ ] Try uploading non-audio file
- [ ] Error message appears
- [ ] App doesn't crash
- [ ] Can try again after error
- [ ] Large files rejected (>50MB)

---

## 🔧 Troubleshooting Checklist

### Python Service Issues
- [ ] Checkpoint path is correct
- [ ] All Python packages installed
- [ ] Python version is 3.8+
- [ ] No CUDA errors (or running on CPU)
- [ ] Port 5000 not in use
- [ ] File permissions correct

### Backend Issues
- [ ] Java version is 17+
- [ ] Maven build successful
- [ ] Port 8080 not in use
- [ ] No dependency conflicts
- [ ] Python service is running
- [ ] Can connect to Python service

### Frontend Issues
- [ ] Node version is 16+
- [ ] npm install completed
- [ ] Port 3000 not in use
- [ ] Backend is running
- [ ] No CORS errors
- [ ] Build files generated

### Common Errors
- [ ] "Connection refused" → Backend not running
- [ ] "CORS error" → Backend CORS config issue
- [ ] "Checkpoint not found" → Model path wrong
- [ ] "Port already in use" → Kill process using port
- [ ] "Module not found" → Dependencies not installed

---

## ✅ Success Criteria

Your application is working correctly when:

1. **All Services Running**
   - [ ] Python service: http://localhost:5000 ✓
   - [ ] Java backend: http://localhost:8080 ✓
   - [ ] React frontend: http://localhost:3000 ✓

2. **Basic Functionality**
   - [ ] Can upload audio file
   - [ ] Analysis completes
   - [ ] Results display correctly
   - [ ] History updates

3. **No Errors**
   - [ ] No console errors
   - [ ] No terminal errors
   - [ ] No CORS errors
   - [ ] No timeout errors

4. **Performance**
   - [ ] Analysis completes in <10 seconds
   - [ ] UI is responsive
   - [ ] No hanging/freezing

5. **Visual Quality**
   - [ ] UI looks professional
   - [ ] Colors are correct
   - [ ] Fonts load properly
   - [ ] Animations work smoothly

---

## 🎉 Ready for Use!

If all checkboxes are checked, congratulations! 

Your **SwarParikshan Audio Deepfake Detection Platform** is fully operational and ready for use.

### Next Steps:
1. Test with various audio files
2. Explore all features
3. Check analysis history
4. Consider optional enhancements (see PROJECT_SUMMARY.md)

---

## 📊 Performance Benchmarks

Record your first analysis:

- File size: _______ MB
- Analysis time: _______ seconds
- Prediction: _____________
- Confidence: _______% 

**Expected:**
- File size: 0.5 - 5 MB
- Analysis time: 2 - 10 seconds
- Confidence: 70 - 99%

---

## 💾 Backup Checklist (Important!)

Before making any changes:
- [ ] Model checkpoint file backed up
- [ ] Configuration files saved
- [ ] Database exported (if production)
- [ ] Source code committed to Git

---

## 🔄 Update Checklist (When Modifying)

When updating the application:
- [ ] Test on development first
- [ ] Update documentation
- [ ] Backup current version
- [ ] Test all features after update
- [ ] Update version numbers

---

## 📞 Support

If you encounter issues:

1. Check terminal/console logs
2. Verify all checkboxes above
3. Review SETUP_GUIDE.md
4. Check ARCHITECTURE.md for technical details
5. Ensure ports are not in use
6. Restart services

---

**Happy Deepfake Detecting! 🎵🔍**
