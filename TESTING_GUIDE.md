# SwarParikshan - Testing Guide

## 🚀 Quick Start

### Prerequisites
All three services should be running:
1. **Frontend**: `http://localhost:3000`
2. **Backend**: `http://localhost:8081`
3. **Python ML Service**: `http://localhost:5000`

---

## 📋 Test Scenarios

### Scenario 1: Demo User Experience (Rate Limiting)

**Test the 3-detection limit for anonymous users**

1. Open browser at `http://localhost:3000`
2. Click "Detection" in navbar
3. Upload an audio file (Detection #1)
   - ✅ Should work successfully
   - ✅ Should show analysis results
   - ✅ Should show suspicious regions (if any)

4. Click "New Analysis" and upload another audio (Detection #2)
   - ✅ Should work successfully
   - ⚠️ May show warning: "2 detections remaining"

5. Upload a third audio (Detection #3)
   - ✅ Should work successfully
   - ⚠️ Should show warning: "1 detection remaining"

6. Try to upload a 4th audio
   - ❌ Should fail with error
   - 📢 Message: "Demo limit exceeded! Please login or register"

---

### Scenario 2: User Registration & Login

**Test account creation and authentication**

#### Register Individual User

1. Click "Register" button in navbar
2. Select "Individual" account type
3. Fill form:
   ```
   Name: John Doe
   Email: john@example.com
   Password: password123
   Confirm Password: password123
   ```
4. Click "Create Account"
   - ✅ Should redirect to Detection page
   - ✅ Should see user name in navbar
   - ✅ Should have unlimited detections

#### Register Organization User

1. Logout (click user menu → Logout)
2. Click "Register" again
3. Select "Organization" account type
4. Fill form:
   ```
   Name: Jane Smith
   Email: jane@company.com
   Organization Name: Tech Corp
   Password: password123
   Confirm Password: password123
   ```
5. Click "Create Account"
   - ✅ Should redirect to Detection page
   - ✅ Should see user name in navbar

#### Test Login

1. Logout
2. Click "Login" button
3. Enter credentials:
   ```
   Email: john@example.com
   Password: password123
   ```
4. Click "Login"
   - ✅ Should redirect to Detection page
   - ✅ Should restore user session

---

### Scenario 3: API Key Management

**Test API key generation and usage**

1. Login to your account
2. Click user menu → "API Keys"
3. View your API key
   - ✅ Should show format: `sk_xxxxxxxxxxxxxxxx`
   - ✅ Copy button should work

4. Test API key with Python:
   ```python
   import requests
   
   api_key = "YOUR_API_KEY_HERE"
   url = "http://localhost:8081/api/analyze"
   
   with open("test_audio.wav", "rb") as f:
       files = {"audio": f}
       headers = {"X-API-Key": api_key}
       response = requests.post(url, files=files, headers=headers)
   
   print(response.json())
   ```
   - ✅ Should return analysis result
   - ✅ No rate limiting for API users

5. Test API key regeneration:
   - Click "Regenerate API Key"
   - Confirm dialog
   - ✅ New key should be generated
   - ❌ Old key should no longer work

---

### Scenario 4: Suspicious Region Detection

**Test detailed analysis for audio files**

#### Short Audio (< 4 seconds)

1. Upload a short audio file
2. Click "Show Detailed Analysis" button
3. Navigate through tabs:
   - **Overview**: Basic prediction info
   - **Suspicious Regions**: Should show regions or "No suspicious regions"
   - **Attention Analysis**: Visual heatmap
   - **Features**: Acoustic features

#### Long Audio (> 4 seconds, up to 10 minutes)

1. Upload a longer audio file (e.g., 30 seconds)
2. Wait for processing (may take longer)
3. View detailed analysis
   - ✅ Should show multiple suspicious regions (if AI-generated)
   - ✅ Attention heatmap should span full duration
   - ✅ Time segments should be accurate

4. For AI-generated audio:
   - ✅ Suspicious regions tab should highlight segments
   - ✅ Each region shows start/end times
   - ✅ Intensity and suspicion level displayed
   - ✅ Regions color-coded (high=red, medium=orange)

---

### Scenario 5: User History

**Test personal detection history**

#### Logged-In User

1. Login to your account
2. Upload several audio files for analysis
3. Click "History" in navbar
4. View your personal history
   - ✅ Should show only YOUR analyses
   - ✅ Sorted by most recent first
   - ✅ Each entry shows prediction, confidence, scores

#### Anonymous User

1. Logout
2. Click "History"
   - ✅ Should show recent global analyses
   - ✅ Not filtered by user
   - ⚠️ May show analyses from all users

---

### Scenario 6: Long Audio Processing

**Test the 10-minute limit and sliding window**

1. Prepare test audio files:
   - 5 seconds
   - 30 seconds
   - 2 minutes
   - 5 minutes
   - 10 minutes
   - 11 minutes (should fail)

2. Upload each file and verify:
   - ✅ < 10 min: Should process successfully
   - ✅ Longer audio takes more time
   - ✅ Suspicious regions accurate across duration
   - ❌ > 10 min: Should show error message

---

## 🧪 API Testing with cURL

### Health Check
```bash
curl http://localhost:8081/api/health
```

### Demo User (Anonymous)
```bash
curl -X POST http://localhost:8081/api/analyze \
  -H "X-Machine-Id: test_machine_123" \
  -F "audio=@test_audio.wav"
```

### Logged-In User
```bash
curl -X POST http://localhost:8081/api/analyze \
  -H "X-User-Email: john@example.com" \
  -F "audio=@test_audio.wav"
```

### API Key User
```bash
curl -X POST http://localhost:8081/api/analyze \
  -H "X-API-Key: sk_xxxxxxxxxxxxx" \
  -F "audio=@test_audio.wav"
```

### Check Usage Limit
```bash
curl -X GET "http://localhost:8081/api/usage-limit" \
  -H "X-Machine-Id: test_machine_123"
```

### User Registration
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "userType": "INDIVIDUAL"
  }'
```

### User Login
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 🔍 Database Testing

### View Users
```bash
# Access H2 Console
http://localhost:8081/h2-console

JDBC URL: jdbc:h2:mem:deepfakedb
Username: sa
Password: (leave empty)
```

### Useful SQL Queries

#### View all users
```sql
SELECT * FROM users;
```

#### View user analyses
```sql
SELECT u.name, u.email, a.filename, a.prediction, a.confidence
FROM users u
LEFT JOIN audio_analyses a ON u.id = a.user_id
ORDER BY a.analyzed_at DESC;
```

#### Check usage limits
```sql
SELECT * FROM usage_limits 
ORDER BY last_used_at DESC;
```

#### Count analyses per user
```sql
SELECT u.name, COUNT(a.id) as total_analyses
FROM users u
LEFT JOIN audio_analyses a ON u.id = a.user_id
GROUP BY u.id, u.name;
```

---

## ✅ Expected Behaviors

### Demo Users
- ✅ Can analyze 3 audio files for free
- ✅ Tracked by email OR machine ID
- ✅ Get clear error after limit
- ✅ Prompted to register

### Registered Users
- ✅ Unlimited detections
- ✅ Personal history
- ✅ API key access
- ✅ Can regenerate API key

### Audio Processing
- ✅ Short audio (< 4s): Direct processing
- ✅ Long audio (4s - 10min): Sliding window
- ✅ Very long (> 10min): Rejected with error
- ✅ Suspicious regions detected accurately

### Detailed Analysis
- ✅ 4 tabs of information
- ✅ Visual attention heatmap
- ✅ Suspicious region timeline
- ✅ Color-coded severity levels
- ✅ Time-accurate segments

---

## 🐛 Common Issues & Solutions

### Issue: Backend not starting
**Solution**: 
```bash
# Check if port 8081 is in use
netstat -ano | findstr :8081
# Kill the process if needed
taskkill /F /PID <PID>
```

### Issue: Frontend can't connect to backend
**Solution**: 
- Check if backend is running: `http://localhost:8081/api/health`
- Verify port in `frontend/src/services/api.js` is 8081

### Issue: Python service not loading model
**Solution**: 
- Verify checkpoint path in `python-service/model_inference.py`
- Check path: `D:\Tushar\Application\cnnbilstem\outputs\checkpoints\ckpt_best.pth`

### Issue: Demo limit not working
**Solution**: 
- Clear browser localStorage
- Machine ID is cached in localStorage
- Check H2 database: `SELECT * FROM usage_limits`

### Issue: Suspicious regions not showing
**Solution**: 
- Check Python service logs
- Verify audio is > 4 seconds for better detection
- AI-generated audio shows more regions than real audio

---

## 📊 Test Results Template

Use this template to document your testing:

```
Test Date: ____________
Tester: ____________

[ ] Demo user 3-detection limit
[ ] User registration (Individual)
[ ] User registration (Organization)
[ ] User login/logout
[ ] API key generation
[ ] API key copy functionality
[ ] API key regeneration
[ ] Authenticated audio upload
[ ] Anonymous audio upload
[ ] Short audio processing (< 4s)
[ ] Long audio processing (> 4s)
[ ] Very long audio (> 10min) rejection
[ ] Suspicious region detection
[ ] Detailed analysis tabs
[ ] Attention heatmap visualization
[ ] User-specific history
[ ] API endpoint authentication
[ ] Rate limit enforcement
[ ] Machine ID generation
[ ] Usage limit tracking

Issues Found:
___________________________________
___________________________________
___________________________________
```

---

## 🎯 Success Criteria

All tests should pass with:
- ✅ No errors in browser console
- ✅ No errors in backend logs
- ✅ No errors in Python service logs
- ✅ UI responsive and intuitive
- ✅ Data persisted correctly in database
- ✅ Rate limiting enforced properly
- ✅ Suspicious regions detected accurately

---

**Happy Testing! 🚀**
