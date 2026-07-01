# Image Detection History Implementation

## Overview
This document describes the implementation of the image detection history feature in the SwarParikshan application. Users can now view both audio and image detection history in a unified history page with tabs to filter by modality.

## Features Implemented

### 1. Backend Components

#### Database Model
- **ImageAnalysis Entity** (`ImageAnalysis.java`)
  - Stores image detection results in the database
  - Fields: filename, prediction, confidence, realScore, fakeScore, width, height, format, modelArchitecture, modelInputSize, modelNumClasses, heatmap (base64), analyzedAt, user
  - Automatic timestamp on creation
  - Relationship with User entity (Many-to-One)

#### Repository Layer
- **ImageAnalysisRepository** (`ImageAnalysisRepository.java`)
  - JPA repository for ImageAnalysis entity
  - Methods:
    - `findByUserOrderByAnalyzedAtDesc(User user)` - Get all analyses for a user
    - `findTop10ByOrderByAnalyzedAtDesc()` - Get 10 most recent analyses (global)
    - `findTop10ByUserOrderByAnalyzedAtDesc(User user)` - Get 10 most recent for a user

#### Service Layer
- **ImageAnalysisService** (`ImageAnalysisService.java`)
  - Business logic for image analysis operations
  - Methods:
    - `saveAnalysis()` - Save prediction results to database
    - `getUserAnalyses()` - Get all analyses for a user
    - `getAllAnalyses()` - Get all analyses (admin)
    - `getRecentAnalyses()` - Get recent analyses (global)
    - `getRecentUserAnalyses()` - Get recent analyses for a user
    - `getAnalysisById()` - Get specific analysis by ID
    - `convertToResponse()` - Convert entity to DTO

#### Controller Layer
- **ImageAnalysisController** (`ImageAnalysisController.java`)
  - REST API endpoints for image analysis
  - Endpoints:
    - `POST /api/analyze-image` - Analyze image and save to database
    - `GET /api/image-analyses` - Get all image analyses
    - `GET /api/image-analyses/recent` - Get recent image analyses
    - `GET /api/image-analyses/{id}` - Get specific analysis
  - Features:
    - API key authentication support
    - User email authentication support
    - Machine ID for demo users
    - Usage limit tracking
    - Proxies requests to Python image service (port 5001)
    - Stores results in database

#### DTO Layer
- **ImagePredictionResponse** (`ImagePredictionResponse.java`)
  - Data Transfer Object for image analysis responses
  - Nested classes: Scores, ImageInfo, ModelInfo
  - Matches frontend expected format

### 2. Frontend Components

#### History Page
- **HistoryPage.jsx** (Updated)
  - Multi-modal history display with tabs
  - Tabs: All, Audio, Images, Videos
  - Features:
    - Tab-based filtering
    - Count badges on each tab
    - Type-specific icons (HiMusicNote, HiPhotograph, HiVideoCamera)
    - Conditional rendering based on analysis type
    - Audio-specific metadata: duration, sample rate, real/fake scores
    - Image-specific metadata: dimensions, format, real/fake scores
    - Video-specific metadata: duration, resolution, real/fake scores
    - Responsive grid layout
    - Animated transitions
    - Timestamp formatting with relative time
  - Added `formatTimestamp()` helper function:
    - Shows "Just now" for <1 minute ago
    - Shows "X mins ago" for <1 hour
    - Shows "X hours ago" for <1 day
    - Shows "X days ago" for <1 week
    - Shows formatted date for older entries

#### Image Detection Page
- **ImageDetectionPage.jsx** (Updated)
  - Now uses backend API endpoint (`/api/analyze-image`) instead of direct Python service call
  - Results are automatically saved to database
  - Supports API key, email authentication, and demo usage
  - Handles response format from backend (with optional wrapper)

#### API Service
- **api.js** (Updated)
  - New functions:
    - `analyzeImage()` - Updated to use backend endpoint with auth headers
    - `getRecentImageAnalyses()` - Fetch recent image analyses
    - `getAllImageAnalyses()` - Fetch all image analyses
    - `getImageAnalysisById()` - Fetch specific image analysis
  - Authentication support:
    - API key header (X-API-Key)
    - User email header (X-User-Email)
    - Machine ID header (X-Machine-Id)

### 3. Database Schema

The `image_analyses` table is automatically created by Hibernate with the following structure:

```sql
CREATE TABLE image_analyses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    prediction VARCHAR(50) NOT NULL,
    confidence DOUBLE NOT NULL,
    real_score DOUBLE NOT NULL,
    fake_score DOUBLE NOT NULL,
    width INTEGER,
    height INTEGER,
    format VARCHAR(20),
    model_architecture VARCHAR(100),
    model_input_size VARCHAR(50),
    model_num_classes INTEGER,
    heatmap TEXT,
    analyzed_at TIMESTAMP NOT NULL,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Architecture Flow

### Image Analysis Flow
1. User uploads image on ImageDetectionPage
2. Frontend calls `analyzeImage()` from api.js
3. Request goes to backend `/api/analyze-image` endpoint
4. Backend validates authentication (API key, email, or machine ID)
5. Backend checks usage limits for demo users
6. Backend forwards image to Python service (localhost:5001)
7. Python service analyzes image and returns prediction
8. Backend saves analysis to database (ImageAnalysis entity)
9. Backend returns response to frontend
10. Frontend displays results with heatmap

### History Retrieval Flow
1. User opens History page
2. Frontend fetches audio analyses from `/api/analyses/recent`
3. Frontend fetches image analyses from `/api/image-analyses/recent`
4. Results are merged and sorted by timestamp
5. User can filter by tab (All/Audio/Images/Videos)
6. Each analysis shows type-specific metadata

## Usage Limits

- Demo users (without login): 3 detections total (shared between audio and image)
- Registered users: Unlimited (or based on subscription tier)
- Usage is tracked per email or machine ID
- Limit enforced at backend level

## API Endpoints

### Image Analysis Endpoints

#### Analyze Image
```
POST /api/analyze-image
Headers:
  - X-API-Key: <api_key> (optional, for authenticated users)
  - X-User-Email: <email> (optional, for authenticated users)
  - X-Machine-Id: <machine_id> (optional, for demo users)
Body: multipart/form-data
  - image: <file>
Response:
  - For authenticated users: ImagePredictionResponse
  - For demo users: { analysis: ImagePredictionResponse, demo_remaining: number }
```

#### Get All Image Analyses
```
GET /api/image-analyses
Headers:
  - X-User-Email: <email> (optional)
Response: List<ImagePredictionResponse>
```

#### Get Recent Image Analyses
```
GET /api/image-analyses/recent
Headers:
  - X-User-Email: <email> (optional)
Response: List<ImagePredictionResponse> (top 10)
```

#### Get Image Analysis by ID
```
GET /api/image-analyses/{id}
Response: ImagePredictionResponse
```

## Frontend Components Structure

```
HistoryPage
├── Tabs (All, Audio, Images, Videos)
├── Analysis Cards
│   ├── Type Icon (Music/Photo/Video)
│   ├── Result Icon (Check/X Circle)
│   ├── Prediction & Confidence
│   ├── Type-Specific Metadata
│   │   ├── Audio: duration, sample rate, scores
│   │   ├── Image: dimensions, format, scores
│   │   └── Video: duration, resolution, scores
│   └── Timestamp
└── Empty State Messages
```

## Testing

### Manual Testing Steps

1. **Start all services**:
   ```bash
   # Terminal 1: Backend (Java Spring Boot)
   cd backend
   mvn spring-boot:run
   
   # Terminal 2: Python Audio Service
   cd python-service
   python app.py
   
   # Terminal 3: Python Image Service
   cd image-service
   python image_inference.py
   
   # Terminal 4: Frontend (React)
   cd frontend
   npm start
   ```

2. **Test Image Detection**:
   - Open http://localhost:3000/image-detection
   - Upload an image
   - Verify analysis results appear
   - Check that results are saved

3. **Test History Page**:
   - Open http://localhost:3000/history
   - Verify audio analyses appear in "Audio" tab
   - Verify image analyses appear in "Images" tab
   - Verify all analyses appear in "All" tab
   - Test tab switching and filtering
   - Verify counts are correct on tab badges

4. **Test Authentication**:
   - Test as guest user (demo mode)
   - Test as logged-in user
   - Test with API key
   - Verify usage limits for demo users

## Files Modified/Created

### Backend Files Created
- `backend/src/main/java/com/swarparikshan/deepfake/model/ImageAnalysis.java`
- `backend/src/main/java/com/swarparikshan/deepfake/repository/ImageAnalysisRepository.java`
- `backend/src/main/java/com/swarparikshan/deepfake/dto/ImagePredictionResponse.java`
- `backend/src/main/java/com/swarparikshan/deepfake/service/ImageAnalysisService.java`
- `backend/src/main/java/com/swarparikshan/deepfake/controller/ImageAnalysisController.java`

### Frontend Files Modified
- `frontend/src/pages/HistoryPage.jsx`
  - Added multi-modal support
  - Added tab filtering
  - Added formatTimestamp function
  - Updated to fetch from backend API
- `frontend/src/pages/ImageDetectionPage.jsx`
  - Updated to use backend endpoint
  - Handles wrapped response format
- `frontend/src/services/api.js`
  - Updated analyzeImage() to use backend
  - Added getRecentImageAnalyses()
  - Added getAllImageAnalyses()
  - Added getImageAnalysisById()

### Documentation Files Created
- `IMAGE_DETECTION_HISTORY.md` (this file)

## Database Migrations

No manual migrations needed. The application uses `spring.jpa.hibernate.ddl-auto=update`, which automatically creates/updates the `image_analyses` table when the application starts.

## Security Considerations

- API endpoints validate authentication via API key, email, or machine ID
- Usage limits prevent abuse from demo users
- File type validation ensures only images are processed
- File size limits (50MB max) prevent DOS attacks
- SQL injection protected by JPA/Hibernate
- XSS protected by React's automatic escaping

## Performance Considerations

- Recent analyses limited to top 10 for performance
- Database queries use proper indexing (on analyzedAt, user_id)
- Lazy loading for user relationship to avoid N+1 queries
- Heatmap stored as TEXT (base64) in database for easy retrieval

## Future Enhancements

1. **Pagination**: Add pagination for history page when user has many analyses
2. **Search/Filter**: Add search by filename, date range, prediction type
3. **Export**: Allow users to export history as CSV/PDF
4. **Batch Analysis**: Support uploading multiple images at once
5. **Video Detection**: Implement video analysis and add to history
6. **Analytics Dashboard**: Show statistics and trends across analyses
7. **Comparison View**: Compare multiple analyses side-by-side

## Troubleshooting

### Image analyses not appearing in history
- Check that backend is running on port 8081
- Check that image service is running on port 5001
- Verify database connection in application.properties
- Check browser console for API errors

### Database table not created
- Ensure `spring.jpa.hibernate.ddl-auto=update` in application.properties
- Check backend logs for Hibernate SQL statements
- Verify H2 console at http://localhost:8081/h2-console

### Authentication errors
- Check that user is properly logged in (check localStorage)
- Verify API key is valid
- Check that headers are being sent correctly

## Conclusion

The image detection history feature is now fully integrated into the SwarParikshan application. Users can view their detection history across multiple modalities (audio, image, video) in a unified interface with proper authentication, usage limits, and database persistence.
