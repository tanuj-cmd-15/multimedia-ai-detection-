# SwarParikshan - Complete Setup Guide

This guide will walk you through setting up the complete application step by step.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Java 17+ installed (`java -version`)
- [ ] Maven 3.6+ installed (`mvn -version`)
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version` or `yarn --version`)
- [ ] Model checkpoint file (`ckpt_best.pth`)

## 🎯 Step-by-Step Setup

### Step 1: Python Service (ML Model)

#### 1.1 Navigate to python-service folder
```bash
cd D:\Tushar\Application\swarparikshan-app\python-service
```

#### 1.2 Create virtual environment (recommended)
```bash
python -m venv venv
```

#### 1.3 Activate virtual environment
**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

#### 1.4 Install Python dependencies
```bash
pip install -r requirements.txt
```

#### 1.5 Update model checkpoint path
Open `model_inference.py` and update line 38:
```python
CHECKPOINT_PATH = r'D:\Tushar\Application\cnnbilstem\outputs\checkpoints\ckpt_best.pth'
```

#### 1.6 Start Python service
```bash
python model_inference.py
```

✅ Verify: You should see:
```
Device: cuda (or cpu)
Checkpoint: ...
Model loaded successfully!
Starting Flask API Server
```

Server running at: `http://localhost:5000`

---

### Step 2: Java Spring Boot Backend

#### 2.1 Open new terminal and navigate to backend folder
```bash
cd D:\Tushar\Application\swarparikshan-app\backend
```

#### 2.2 Build the project
```bash
mvn clean install
```

This will:
- Download all Maven dependencies
- Compile Java code
- Run tests (if any)
- Package the application

#### 2.3 Start Spring Boot application
```bash
mvn spring-boot:run
```

**Alternative Method - Using IDE:**
1. Open `backend` folder in IntelliJ IDEA or Eclipse
2. Wait for Maven to resolve dependencies
3. Run `DeepfakeDetectionApplication.java`

✅ Verify: You should see:
```
Started DeepfakeDetectionApplication in X.X seconds
```

Server running at: `http://localhost:8080`

#### 2.4 Test Backend Health
Open browser or use curl:
```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "SwarParikshan Audio Deepfake Detection"
}
```

---

### Step 3: React Frontend

#### 3.1 Open new terminal and navigate to frontend folder
```bash
cd D:\Tushar\Application\swarparikshan-app\frontend
```

#### 3.2 Install Node.js dependencies
```bash
npm install
```
Or if using yarn:
```bash
yarn install
```

This will install:
- React and React DOM
- React Router
- Axios for API calls
- Tailwind CSS
- Framer Motion for animations
- React Icons
- And more...

#### 3.3 Start development server
```bash
npm run dev
```
Or with yarn:
```bash
yarn dev
```

✅ Verify: You should see:
```
  VITE ready in X ms
  ➜  Local:   http://localhost:3000/
```

Server running at: `http://localhost:3000`

---

## 🧪 Testing the Complete Application

### Test 1: Frontend Access
1. Open browser: `http://localhost:3000`
2. You should see the SwarParikshan home page
3. Navigate to "Detection" page

### Test 2: File Upload
1. Go to Detection page
2. Drag and drop or click to upload an audio file
3. Click "Analyze Audio"
4. View results

### Test 3: Check History
1. Go to History page
2. View your recent analyses

### Test 4: API Testing

**Test Python Service:**
```bash
curl -X POST http://localhost:5000/predict \
  -F "audio=@D:\path\to\your\audio.wav"
```

**Test Java Backend:**
```bash
curl -X POST http://localhost:8080/api/analyze \
  -F "audio=@D:\path\to\your\audio.wav"
```

---

## 🐛 Troubleshooting

### Problem: Python service won't start

**Error: ModuleNotFoundError**
```
Solution: Install missing packages
pip install torch librosa flask flask-cors scipy numpy
```

**Error: Checkpoint not found**
```
Solution: Update CHECKPOINT_PATH in model_inference.py
CHECKPOINT_PATH = r'CORRECT_PATH\ckpt_best.pth'
```

**Error: CUDA out of memory**
```
Solution: Run on CPU
device = torch.device('cpu')
```

---

### Problem: Backend won't start

**Error: Port 8080 already in use**
```
Solution: Change port in application.properties
server.port=8081
```

**Error: Java version incompatible**
```
Solution: Install Java 17+
Download from: https://www.oracle.com/java/technologies/downloads/
```

**Error: Maven not found**
```
Solution: Install Maven
Download from: https://maven.apache.org/download.cgi
Add to PATH
```

---

### Problem: Frontend won't start

**Error: Port 3000 in use**
```
Solution: Vite will automatically use next available port
Or edit vite.config.js to change port
```

**Error: Module not found**
```
Solution: Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: Cannot connect to backend**
```
Solution: Check backend is running on port 8080
Update API_BASE_URL in src/services/api.js if needed
```

---

## 🔧 Configuration Tips

### Change Ports

**Python Service (Flask):**
Edit `model_inference.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=False)
```

**Java Backend:**
Edit `application.properties`:
```properties
server.port=8081
```

**React Frontend:**
Edit `vite.config.js`:
```javascript
server: {
  port: 3001
}
```

### Enable CORS for Different Domains

**Backend CorsConfig.java:**
```java
.allowedOrigins("http://localhost:3000", "http://your-domain.com")
```

---

## 📊 Database Access

### H2 Console (Development)
1. Open: `http://localhost:8080/h2-console`
2. JDBC URL: `jdbc:h2:mem:deepfakedb`
3. Username: `sa`
4. Password: (leave empty)

### View Stored Analyses
```sql
SELECT * FROM audio_analyses;
```

---

## 🚀 Production Deployment

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output: dist/ folder
```

**Backend:**
```bash
cd backend
mvn clean package
# Output: target/deepfake-detection-1.0.0.jar
```

**Run Production JAR:**
```bash
java -jar target/deepfake-detection-1.0.0.jar
```

**Python Service with Gunicorn:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 model_inference:app
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Python service responds at `http://localhost:5000/health`
- [ ] Backend responds at `http://localhost:8080/api/health`
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Can navigate between pages
- [ ] Can upload audio file
- [ ] Results display correctly
- [ ] History page shows analyses

---

## 📞 Getting Help

If you encounter issues:

1. Check all services are running (Python, Java, React)
2. Verify port numbers are correct
3. Check console/terminal for error messages
4. Ensure model checkpoint path is correct
5. Verify network connectivity between services

---

## 🎉 Success!

If all services are running and responding:

**Congratulations! 🎊**

Your SwarParikshan Audio Deepfake Detection Platform is now fully operational!

- Upload audio files for analysis
- View detailed results
- Track your detection history
- Enjoy the modern, responsive UI

---

**Need help? Check the main README.md or open an issue on GitHub.**
