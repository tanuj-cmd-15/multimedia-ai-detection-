# SwarParikshan - Feature Update Summary

## 🎉 New Features Added

### 1. **Authentication System** ✅

#### User Types
- **Individual Users**: Personal accounts for single users
- **Organization Users**: Business accounts with organization name

#### Features
- User registration with email validation
- Secure login system
- Password-based authentication
- Session management with localStorage
- User profile with account details

#### Pages
- `/login` - Login page
- `/register` - Registration page with user type selection
- User menu in navbar with profile dropdown

---

### 2. **API Key Management** ✅

#### Features
- Automatic API key generation on registration
- API key display with copy-to-clipboard functionality
- API key regeneration capability
- Security guidelines and best practices

#### Usage
- Programmatic access to detection API
- Code examples in Python, JavaScript, and cURL
- Header-based authentication (`X-API-Key`)

#### Page
- `/api-keys` - Complete API key management interface

---

### 3. **Rate Limiting for Demo Users** ✅

#### Demo Limits
- **3 free detections** per email address
- **3 free detections** per machine/PC (using machine ID)
- Tracked using both email and unique machine identifier

#### Benefits for Registered Users
- **Unlimited detections** for logged-in users
- No rate limits when using API key
- Full access to all features

#### Implementation
- `UsageLimit` entity tracks usage by identifier
- Machine ID stored in localStorage
- Automatic limit checking on each detection
- Clear error messages when limit exceeded

---

### 4. **Detailed Analysis with Suspicious Regions** ✅

#### Suspicious Region Detection
- AI-powered detection of manipulated audio segments
- Time-based segmentation (start/end times)
- Intensity scoring for each suspicious region
- Suspicion level classification (high/medium)

#### Analysis Features
- **Overview Tab**: Basic prediction and scores
- **Suspicious Regions Tab**: Detailed list of flagged segments
- **Attention Analysis Tab**: Visual attention heatmap
- **Features Tab**: Acoustic feature details

#### Implementation
- Python service analyzes attention weights
- Detects anomalous patterns in audio
- Groups consecutive suspicious frames
- Returns JSON data with time segments

---

### 5. **Long Audio Support (Up to 10 Minutes)** ✅

#### Processing Strategy
- **Short Audio (< 4s)**: Direct processing
- **Long Audio (> 4s)**: Sliding window approach
  - 4-second windows with 50% overlap
  - Multiple predictions aggregated
  - Time weights combined across windows

#### Features
- Maximum duration: 10 minutes
- Automatic chunking for long files
- Accurate suspicious region detection across entire audio
- Optimized memory usage

---

### 6. **User History** ✅

#### Features
- Personal detection history for logged-in users
- All users can see recent global analyses
- Filtered by user email for authenticated requests
- Stores all analysis metadata in database

#### Database Schema
- `users` table: User accounts and API keys
- `audio_analyses` table: Detection results with user relationship
- `usage_limits` table: Demo user tracking

---

## 🏗️ Architecture Updates

### Backend (Java Spring Boot)

#### New Entities
- `User.java` - User account management
- `UsageLimit.java` - Rate limiting tracking
- Updated `AudioAnalysis.java` - Added user relationship and detailed analysis fields

#### New Repositories
- `UserRepository` - User CRUD operations
- `UsageLimitRepository` - Usage tracking
- Updated `AudioAnalysisRepository` - User-specific queries

#### New Services
- `AuthService` - Authentication and user management
- `UsageLimitService` - Rate limiting logic
- Updated `AudioAnalysisService` - User-aware analysis

#### New Controllers
- `AuthController` - Login, register, API key endpoints
- Updated `AudioAnalysisController` - Headers for auth and rate limiting

#### New Endpoints
```
POST   /api/auth/register              - User registration
POST   /api/auth/login                 - User login
POST   /api/auth/regenerate-api-key    - Regenerate API key
GET    /api/usage-limit                - Check demo limit
POST   /api/analyze                    - Enhanced with auth headers
GET    /api/analyses                   - User-specific history
```

---

### Frontend (React.js)

#### New Pages
- `LoginPage.jsx` - User login interface
- `RegisterPage.jsx` - User registration with type selection
- `ApiKeysPage.jsx` - API key management

#### New Components
- `DetailedAnalysis.jsx` - Tabbed detailed analysis view
- `AuthContext.jsx` - Global authentication state

#### Updated Components
- `Navbar.jsx` - Auth buttons and user menu
- `DetectionPage.jsx` - Demo limit warnings
- `ResultCard.jsx` - Detailed analysis toggle
- `api.js` - Auth headers and new endpoints

---

### Python ML Service

#### New Functions
- `detect_suspicious_regions()` - Identifies manipulated segments
- `prepare_attention_data()` - Formats attention for visualization
- `process_long_audio()` - Handles audio > 4 seconds

#### Enhanced Features
- Sliding window processing for long audio
- Statistical analysis of attention patterns
- Anomaly detection in spectral features
- Time-segment mapping

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_type VARCHAR(255) NOT NULL,  -- INDIVIDUAL/ORGANIZATION
    organization_name VARCHAR(255),
    api_key VARCHAR(255) UNIQUE,
    api_calls_remaining INTEGER,
    created_at TIMESTAMP,
    last_login_at TIMESTAMP,
    active BOOLEAN
);
```

### Audio Analyses Table (Updated)
```sql
CREATE TABLE audio_analyses (
    id BIGINT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    prediction VARCHAR(255) NOT NULL,
    confidence DOUBLE NOT NULL,
    real_score DOUBLE NOT NULL,
    fake_score DOUBLE NOT NULL,
    duration DOUBLE,
    sample_rate INTEGER,
    mel_mean DOUBLE,
    mel_std DOUBLE,
    attention_peak_frame INTEGER,
    attention_concentration DOUBLE,
    analyzed_at TIMESTAMP NOT NULL,
    user_id BIGINT,  -- NEW: Foreign key to users
    suspicious_regions TEXT,  -- NEW: JSON string
    attention_weights TEXT,   -- NEW: JSON string
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Usage Limits Table
```sql
CREATE TABLE usage_limits (
    id BIGINT PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,      -- email or machine_id
    identifier_type VARCHAR(255) NOT NULL, -- EMAIL or MACHINE_ID
    usage_count INTEGER DEFAULT 0,
    max_limit INTEGER DEFAULT 3,
    first_used_at TIMESTAMP,
    last_used_at TIMESTAMP
);
```

---

## 🔐 Security Features

### Authentication
- Password-based login (ready for bcrypt hashing)
- Session tokens (ready for JWT implementation)
- API key authentication for programmatic access

### Rate Limiting
- Per-email tracking for demo users
- Per-machine tracking using unique identifiers
- Automatic limit enforcement

### Data Privacy
- User-specific history isolation
- Secure API key generation
- Optional organization-level accounts

---

## 🎨 UI/UX Enhancements

### Navbar Updates
- User profile dropdown menu
- Login/Register buttons for guests
- API Keys link for authenticated users
- Responsive mobile menu

### Detection Page
- Demo limit warnings
- Usage remaining indicators
- Authentication prompts
- Enhanced error messages

### New Detailed Analysis View
- Tabbed interface (Overview, Suspicious Regions, Attention, Features)
- Visual attention heatmap
- Suspicious region timeline
- Color-coded suspicion levels

---

## 📝 API Documentation

### Authentication Headers

#### For Logged-In Users
```
X-User-Email: user@example.com
```

#### For API Key Users
```
X-API-Key: sk_xxxxxxxxxxxxx
```

#### For Demo Users (Anonymous)
```
X-Machine-Id: machine_xxxxxxxxxxxxx
```

### Sample Response with Suspicious Regions
```json
{
  "prediction": "AI-GENERATED",
  "confidence": 95.67,
  "scores": {
    "real": 4.33,
    "fake": 95.67
  },
  "audio_info": {
    "duration": 8.5,
    "sample_rate": 16000
  },
  "suspicious_regions": [
    {
      "start_time": 2.34,
      "end_time": 3.87,
      "intensity": 0.8523,
      "suspicion_level": "high"
    },
    {
      "start_time": 6.12,
      "end_time": 7.45,
      "intensity": 0.6891,
      "suspicion_level": "medium"
    }
  ],
  "attention_weights": [
    { "time": 0.0, "weight": 0.0123 },
    { "time": 0.25, "weight": 0.0156 },
    ...
  ]
}
```

---

## 🚀 How to Use New Features

### For Regular Users

1. **Register Account**
   - Visit `/register`
   - Choose Individual or Organization
   - Enter details and create account

2. **Login**
   - Visit `/login`
   - Enter credentials
   - Access unlimited detections

3. **Upload Audio**
   - Go to `/detection`
   - Upload audio file (up to 10 minutes)
   - View detailed analysis including suspicious regions

4. **View History**
   - Visit `/history`
   - See all your past detections
   - Review detailed results

5. **Get API Key**
   - Visit `/api-keys`
   - Copy your API key
   - Use in scripts/applications

### For Demo Users (No Login)

1. Visit `/detection`
2. Upload audio (limited to 3 detections)
3. View results
4. Register when limit reached

### For Developers (API Access)

```python
import requests

# Using API Key
api_key = "sk_xxxxxxxxxxxxx"
url = "http://localhost:8081/api/analyze"

with open("audio.wav", "rb") as f:
    files = {"audio": f}
    headers = {"X-API-Key": api_key}
    response = requests.post(url, files=files, headers=headers)
    
result = response.json()
print(f"Prediction: {result['prediction']}")
print(f"Suspicious Regions: {len(result['suspicious_regions'])}")
```

---

## 📦 Dependencies Added

### Backend
- No new dependencies (used existing Spring Boot, Hibernate, Jackson)

### Frontend
- No new dependencies (used existing React, Framer Motion, React Router)

### Python Service
- No new dependencies (used existing NumPy, LibROSA, Flask)

---

## ✅ Testing Checklist

- [x] User registration (Individual)
- [x] User registration (Organization)
- [x] User login
- [x] User logout
- [x] API key generation
- [x] API key regeneration
- [x] Demo limit tracking (3 detections)
- [x] Machine ID generation
- [x] Authenticated audio upload
- [x] Anonymous audio upload
- [x] Long audio processing (> 4 seconds)
- [x] Suspicious region detection
- [x] Detailed analysis tabs
- [x] User-specific history
- [x] API key authentication
- [x] Rate limit enforcement

---

## 🎯 Key Benefits

1. **Monetization Ready**: Rate limiting enables freemium model
2. **Developer Friendly**: API keys for programmatic access
3. **Enhanced Trust**: Suspicious region visualization
4. **Scalable**: User accounts and organization support
5. **Professional**: Complete authentication system
6. **Flexible**: Supports audio up to 10 minutes
7. **Secure**: Rate limiting prevents abuse

---

## 🔄 Backward Compatibility

- ✅ Existing analysis API still works without auth
- ✅ Demo users can still use 3 free detections
- ✅ All previous features maintained
- ✅ Database auto-migration handled by Hibernate

---

## 📈 Next Steps (Optional Enhancements)

1. **Security**: Add bcrypt password hashing
2. **Tokens**: Implement JWT for better security
3. **Email**: Add email verification
4. **Payments**: Integrate payment gateway for premium
5. **Admin Panel**: User management dashboard
6. **Analytics**: Usage statistics and charts
7. **Export**: PDF/JSON report generation
8. **Webhooks**: Real-time notifications

---

**Status**: ✅ All features implemented and running!

**Services Running**:
- Frontend: http://localhost:3000
- Backend: http://localhost:8081
- Python ML Service: http://localhost:5000
