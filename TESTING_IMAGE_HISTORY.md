# Testing Image Detection History - Quick Start Guide

## Prerequisites
All services should be running:
- ✅ Backend (Spring Boot): http://localhost:8081
- ✅ Python Audio Service: http://localhost:5000
- ✅ Python Image Service: http://localhost:5001
- ✅ Frontend (React): http://localhost:3000

## Test Scenario 1: Demo User (Guest) - Image Detection

### Step 1: Upload an Image
1. Open http://localhost:3000/image-detection
2. Click "Drag & drop an image here, or click to select"
3. Select any image file (JPG, PNG) from your computer
4. Click "Analyze Image" button
5. Wait for the analysis to complete

### Step 2: Verify Results Display
Expected results should show:
- ✅ Prediction: REAL or AI-GENERATED
- ✅ Confidence percentage
- ✅ Detailed scores (Real Image %, AI-Generated %)
- ✅ Grad-CAM Heatmap visualization
- ✅ Model information (ResNet-18, 224x224, 2 classes)
- ✅ Interpretation message

### Step 3: Check History Page
1. Navigate to http://localhost:3000/history
2. Click on "Images" tab
3. Verify your image analysis appears with:
   - Image icon (camera/photo icon)
   - Prediction result (REAL/AI-GENERATED)
   - Confidence percentage
   - Image dimensions and format
   - Real score and Fake score
   - Timestamp (e.g., "Just now" or "2 mins ago")

### Step 4: Check "All" Tab
1. Click on "All" tab
2. Verify both audio and image analyses appear together
3. Check that count badges are correct on each tab

## Test Scenario 2: Multiple Image Uploads

### Step 1: Upload Multiple Images
1. Go to http://localhost:3000/image-detection
2. Upload and analyze 3 different images
3. Wait for each analysis to complete

### Step 2: Verify History Updates
1. Go to http://localhost:3000/history
2. Click "Images" tab
3. Verify all 3 image analyses appear
4. Check that they are sorted by timestamp (newest first)
5. Verify the count badge shows "3" on Images tab

## Test Scenario 3: Mixed Audio and Image History

### Step 1: Create Mixed History
1. Upload and analyze 2 audio files at http://localhost:3000/audio-detection
2. Upload and analyze 2 images at http://localhost:3000/image-detection

### Step 2: Verify History Filtering
1. Go to http://localhost:3000/history
2. Check "All" tab:
   - Should show 4 total analyses (2 audio + 2 images)
   - Should be sorted by timestamp
   - Each should have appropriate icon (music note vs camera)
3. Check "Audio" tab:
   - Should show 2 audio analyses
   - Badge should show "2"
4. Check "Images" tab:
   - Should show 2 image analyses
   - Badge should show "2"

### Step 3: Verify Metadata Display
1. In "All" tab, verify each analysis shows correct type-specific info:
   - Audio analyses: Duration, Sample Rate, Real/Fake scores
   - Image analyses: Dimensions (width×height), Format, Real/Fake scores

## Test Scenario 4: Authenticated User

### Step 1: Register/Login
1. Go to http://localhost:3000/login
2. Either login or register a new account
3. Wait for successful login

### Step 2: Upload Image as Authenticated User
1. Go to http://localhost:3000/image-detection
2. Upload and analyze an image
3. Verify analysis completes successfully

### Step 3: Check User-Specific History
1. Go to http://localhost:3000/history
2. Verify only your analyses appear (not demo user analyses)
3. Upload another image and verify it appears in history

## Test Scenario 5: API Key Usage

### Step 1: Generate API Key
1. Login to your account
2. Go to http://localhost:3000/api-keys
3. Click "Generate New API Key"
4. Copy the API key

### Step 2: Test with API Key
1. Use Postman or curl to test:
```bash
curl -X POST http://localhost:8081/api/analyze-image \
  -H "X-API-Key: YOUR_API_KEY_HERE" \
  -F "image=@/path/to/your/image.jpg"
```

### Step 3: Verify in History
1. Go to http://localhost:3000/history
2. Verify the API-analyzed image appears in your history

## Test Scenario 6: Usage Limits (Demo Users)

### Step 1: Use Demo Account
1. Open browser in incognito/private mode
2. Go to http://localhost:3000/image-detection
3. Upload and analyze 3 images (demo limit)

### Step 2: Verify Limit Enforcement
1. Try to upload a 4th image
2. Should see error: "Demo limit exceeded. Please login or register to continue."
3. Verify remaining count decreases with each upload

## Test Scenario 7: Timestamp Formatting

### Step 1: Check Recent Timestamps
1. Upload an image now
2. Check history immediately
3. Should show "Just now"

### Step 2: Wait and Check
1. Wait 2-3 minutes
2. Refresh history page
3. Should show "2 mins ago" or "3 mins ago"

### Step 3: Check Older Entries
If you have older entries (from previous sessions), verify they show:
- "X hours ago" for same day
- "X days ago" for this week
- Formatted date (e.g., "Jun 29, 2026, 10:30 AM") for older entries

## Test Scenario 8: Backend API Endpoints

### Test Image Analysis Endpoint
```bash
# With email header (demo user)
curl -X POST http://localhost:8081/api/analyze-image \
  -H "X-User-Email: demo@example.com" \
  -F "image=@/path/to/image.jpg"
```

### Test Get Recent Image Analyses
```bash
curl http://localhost:8081/api/image-analyses/recent
```

### Test Get All Image Analyses
```bash
curl http://localhost:8081/api/image-analyses
```

### Test Get Specific Analysis
```bash
curl http://localhost:8081/api/image-analyses/1
```

## Expected Responses

### Successful Image Analysis Response
```json
{
  "id": 1,
  "prediction": "REAL",
  "confidence": 97.5,
  "scores": {
    "real": 97.5,
    "fake": 2.5
  },
  "image_info": {
    "width": 1920,
    "height": 1080,
    "format": "JPEG"
  },
  "model_info": {
    "architecture": "ResNet-18",
    "input_size": "224x224",
    "num_classes": 2
  },
  "heatmap": "base64_encoded_string...",
  "analyzedAt": "2026-06-30T20:22:30"
}
```

### Demo User Response (with limit)
```json
{
  "analysis": {
    "id": 1,
    "prediction": "REAL",
    "confidence": 97.5,
    ...
  },
  "demo_remaining": 2
}
```

### Limit Exceeded Response
```json
{
  "error": "Demo limit exceeded. Please login or register to continue.",
  "limit_exceeded": true,
  "remaining": 0
}
```

## Troubleshooting

### Images Not Appearing in History
1. Check browser console for errors
2. Verify backend logs for errors (terminal running Spring Boot)
3. Check that image service is responding: http://localhost:5001/health
4. Verify database connection in H2 console: http://localhost:8081/h2-console

### Backend Errors
1. Check backend terminal for stack traces
2. Verify all dependencies compiled: `mvn clean compile`
3. Check that ImageAnalysisController is loaded
4. Verify database tables created (check H2 console)

### Frontend Errors
1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed API calls
4. Verify API calls going to correct endpoints (http://localhost:8081/api/...)

### Database Issues
1. Access H2 Console: http://localhost:8081/h2-console
2. Use JDBC URL: `jdbc:h2:mem:deepfakedb`
3. Username: `sa`, Password: (empty)
4. Run query to check tables:
   ```sql
   SELECT * FROM IMAGE_ANALYSES;
   ```

## Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads successfully
- [ ] Image service responds on port 5001
- [ ] Can upload and analyze images
- [ ] Results display with heatmap
- [ ] Image analyses appear in history
- [ ] Tab filtering works (All/Audio/Images/Videos)
- [ ] Count badges show correct numbers
- [ ] Timestamps format correctly
- [ ] Authentication works (demo, login, API key)
- [ ] Usage limits enforced for demo users
- [ ] Type-specific metadata displays correctly
- [ ] Mixed audio/image history works

## Additional Verification

### Check Database Content
```sql
-- In H2 Console (http://localhost:8081/h2-console)

-- View all image analyses
SELECT * FROM IMAGE_ANALYSES ORDER BY ANALYZED_AT DESC;

-- Count by prediction type
SELECT PREDICTION, COUNT(*) FROM IMAGE_ANALYSES GROUP BY PREDICTION;

-- View with user info
SELECT ia.ID, ia.FILENAME, ia.PREDICTION, ia.CONFIDENCE, u.EMAIL 
FROM IMAGE_ANALYSES ia 
LEFT JOIN USERS u ON ia.USER_ID = u.ID
ORDER BY ia.ANALYZED_AT DESC;
```

### Check API Health
```bash
# Backend health
curl http://localhost:8081/api/health

# Image service health (if implemented)
curl http://localhost:5001/health

# Audio service health
curl http://localhost:5000/health
```

## Next Steps

After successful testing:
1. ✅ Image detection history working
2. ⏭️ Implement video detection (Phase 2)
3. ⏭️ Add pagination for history page
4. ⏭️ Add search/filter functionality
5. ⏭️ Add export to CSV/PDF
6. ⏭️ Add analytics dashboard
7. ⏭️ Implement batch image upload

## Notes

- Demo users share usage limit across audio AND image detections (total 3)
- Authenticated users have unlimited detections
- All analyses are stored in database permanently (until manually deleted)
- Heatmaps are stored as base64 in database (TEXT column)
- History page shows top 10 recent analyses by default
- Timestamps use browser's local timezone

---

**Last Updated**: June 30, 2026
**Version**: 1.0.0
**Status**: ✅ Implemented and Ready for Testing
