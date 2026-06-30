# 🚀 SwarParikshan - Quick Reference

## Services Status

```
✅ Frontend:     http://localhost:3000
✅ Backend:      http://localhost:8081
✅ ML Service:   http://localhost:5000
✅ H2 Console:   http://localhost:8081/h2-console
```

---

## 🎯 Key Features

### 1. Demo Users (No Login)
- **3 free detections** per email or PC
- Tracked by machine ID in browser
- Clear error when limit reached

### 2. Registered Users
- **Unlimited detections**
- Personal history
- API key access
- Two account types: Individual or Organization

### 3. Audio Analysis
- **Short audio** (< 4s): Direct processing
- **Long audio** (4s - 10min): Sliding window
- **Suspicious regions**: Time-based segments
- **Detailed analysis**: 4 tabs of information

### 4. API Access
- **API keys** for programmatic use
- **No rate limits** with API key
- Examples in Python, JS, cURL

---

## 📝 Quick Commands

### Start Services

```bash
# Terminal 1 - Python Service
cd D:\Tushar\Application\swarparikshan-app\python-service
python model_inference.py

# Terminal 2 - Backend
cd D:\Tushar\Application\swarparikshan-app\backend
mvn spring-boot:run

# Terminal 3 - Frontend
cd D:\Tushar\Application\swarparikshan-app\frontend
npm run dev
```

### Test API

```bash
# Health check
curl http://localhost:8081/api/health

# Upload audio (demo)
curl -X POST http://localhost:8081/api/analyze \
  -H "X-Machine-Id: test123" \
  -F "audio=@audio.wav"

# Upload with API key
curl -X POST http://localhost:8081/api/analyze \
  -H "X-API-Key: sk_xxxxx" \
  -F "audio=@audio.wav"
```

---

## 🔑 API Endpoints

### Authentication
```
POST /api/auth/register    - Register user
POST /api/auth/login       - Login
POST /api/auth/regenerate-api-key - Regenerate key
```

### Analysis
```
POST /api/analyze          - Analyze audio
GET  /api/analyses         - Get user history
GET  /api/analyses/recent  - Recent analyses
GET  /api/usage-limit      - Check demo limit
```

---

## 🎨 UI Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page |
| Detection | `/detection` | Upload & analyze |
| History | `/history` | Past analyses |
| Docs | `/docs` | Documentation |
| Login | `/login` | User login |
| Register | `/register` | Create account |
| API Keys | `/api-keys` | Manage API keys |

---

## 📊 Database Tables

### Users
- Email, password, name
- User type (Individual/Organization)
- API key
- Created/last login timestamps

### Audio Analyses
- Filename, prediction, confidence
- Scores (real/fake)
- Audio info (duration, sample rate)
- Features (mel, attention)
- **Suspicious regions** (JSON)
- **Attention weights** (JSON)
- User relationship

### Usage Limits
- Identifier (email/machine_id)
- Usage count (0-3)
- Timestamps

---

## 🔐 Authentication Headers

```bash
# Demo user
-H "X-Machine-Id: machine_xxx"

# Logged-in user
-H "X-User-Email: user@example.com"

# API key
-H "X-API-Key: sk_xxxxxxxxxxxxx"
```

---

## 🐛 Troubleshooting

### Services not starting?

```bash
# Check ports
netstat -ano | findstr ":3000"
netstat -ano | findstr ":8081"
netstat -ano | findstr ":5000"

# Kill process if needed
taskkill /F /PID <PID>
```

### Frontend can't connect to backend?

1. Check backend is running: `http://localhost:8081/api/health`
2. Verify port in `frontend/src/services/api.js` is 8081
3. Check browser console for errors

### Python service not loading model?

1. Verify checkpoint path in `model_inference.py`
2. Check: `D:\Tushar\Application\cnnbilstem\outputs\checkpoints\ckpt_best.pth`
3. Ensure Python dependencies installed

### Demo limit not working?

1. Clear browser localStorage
2. Check H2 console: `SELECT * FROM usage_limits`
3. Machine ID is in localStorage: `swarparikshan_machine_id`

---

## 📋 Test Checklist

- [ ] Register new user
- [ ] Login/logout
- [ ] Get API key
- [ ] Upload short audio (< 4s)
- [ ] Upload long audio (> 4s)
- [ ] View suspicious regions
- [ ] Check detailed analysis tabs
- [ ] Verify demo limit (3 detections)
- [ ] Test API with cURL/Python
- [ ] Check user history

---

## 💡 Usage Tips

### For Best Results
- Use audio files in WAV format
- Clear speech, minimal background noise
- Duration: 4s - 10min for detailed analysis
- AI-generated audio shows more suspicious regions

### Demo Users
- Use same email for 3 free tests
- Different emails = new 3 tests
- Clear browser data = new machine ID

### Registered Users
- Unlimited detections
- Save your API key securely
- Use API key in scripts for automation

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `COMPLETE_IMPLEMENTATION_SUMMARY.md` | Full feature list |
| `FEATURE_UPDATE_SUMMARY.md` | Detailed features |
| `TESTING_GUIDE.md` | Step-by-step testing |
| `QUICK_REFERENCE.md` | This file |
| `ARCHITECTURE.md` | System design |
| `QUICK_START.md` | Getting started |

---

## 🎓 Code Examples

### Python
```python
import requests

response = requests.post(
    'http://localhost:8081/api/analyze',
    files={'audio': open('audio.wav', 'rb')},
    headers={'X-API-Key': 'sk_xxxxx'}
)

result = response.json()
print(f"Prediction: {result['prediction']}")

for region in result['suspicious_regions']:
    print(f"Suspicious: {region['start_time']}s - {region['end_time']}s")
```

### JavaScript
```javascript
const formData = new FormData();
formData.append('audio', audioFile);

fetch('http://localhost:8081/api/analyze', {
  method: 'POST',
  headers: {
    'X-API-Key': 'sk_xxxxx'
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🎉 Success Indicators

### Working Correctly
- ✅ All 3 services running
- ✅ Can register and login
- ✅ Demo limit enforced (3 detections)
- ✅ Audio analysis returns results
- ✅ Suspicious regions displayed
- ✅ API key works for uploads
- ✅ History shows user analyses

### Common Issues
- ❌ Port already in use → Kill process
- ❌ Model not found → Check checkpoint path
- ❌ Demo limit ignored → Clear localStorage
- ❌ API key invalid → Regenerate from /api-keys

---

## 📞 Support

### Check Logs
- **Frontend**: Browser console (F12)
- **Backend**: Terminal running Spring Boot
- **Python**: Terminal running Flask

### Database
- Access H2 console: `http://localhost:8081/h2-console`
- JDBC URL: `jdbc:h2:mem:deepfakedb`
- Username: `sa`
- Password: (empty)

---

## 🚀 Deployment Checklist

For production deployment:

- [ ] Add password hashing (bcrypt)
- [ ] Implement JWT tokens
- [ ] Use production database (PostgreSQL/MySQL)
- [ ] Add HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Add email verification
- [ ] Set up logging/monitoring
- [ ] Add rate limiting middleware
- [ ] Configure environment variables
- [ ] Add backup strategy

---

**Quick Start**: Open `http://localhost:3000` and register an account!

**Documentation**: See `TESTING_GUIDE.md` for detailed instructions

**Status**: ✅ All features complete and ready to use!
