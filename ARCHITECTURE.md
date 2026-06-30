# SwarParikshan - System Architecture

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER'S BROWSER                             │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    React.js Frontend                           │  │
│  │  - Single Page Application (SPA)                              │  │
│  │  - React Router for navigation                                │  │
│  │  - Tailwind CSS for styling                                   │  │
│  │  - Framer Motion for animations                               │  │
│  │  - Axios for HTTP requests                                    │  │
│  │  - React Dropzone for file uploads                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                               │                                       │
└───────────────────────────────┼───────────────────────────────────────┘
                                │
                    HTTP REST API (JSON)
                    Port: 3000 → 8080
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                    Java Spring Boot Backend                            │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                   Controller Layer                            │    │
│  │  - AudioAnalysisController: REST API endpoints               │    │
│  │  - CORS configuration                                         │    │
│  │  - Request/Response handling                                  │    │
│  └────────────────┬─────────────────────────────────────────────┘    │
│                   │                                                    │
│  ┌────────────────▼─────────────────────────────────────────────┐    │
│  │                   Service Layer                               │    │
│  │  - AudioAnalysisService: Business logic                      │    │
│  │  - PythonModelService: Python service integration            │    │
│  │  - Data transformation                                        │    │
│  └────────────────┬─────────────────────────────────────────────┘    │
│                   │                                                    │
│  ┌────────────────▼─────────────────────────────────────────────┐    │
│  │                   Repository Layer                            │    │
│  │  - AudioAnalysisRepository: JPA Repository                   │    │
│  │  - Custom query methods                                       │    │
│  └────────────────┬─────────────────────────────────────────────┘    │
│                   │                                                    │
│  ┌────────────────▼─────────────────────────────────────────────┐    │
│  │                   Data Layer                                  │    │
│  │  - AudioAnalysis Entity: JPA mapped entity                   │    │
│  │  - Hibernate ORM                                              │    │
│  └────────────────┬─────────────────────────────────────────────┘    │
│                   │                                                    │
│  ┌────────────────▼─────────────────────────────────────────────┐    │
│  │                   Database (H2/PostgreSQL)                    │    │
│  │  - audio_analyses table                                       │    │
│  │  - Stores all detection results                              │    │
│  └──────────────────────────────────────────────────────────────┘    │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │
                     HTTP POST (Multipart Form)
                     Port: 8080 → 5000
                                 │
┌────────────────────────────────▼───────────────────────────────────────┐
│                    Python Flask ML Service                              │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                   Flask REST API                                 │  │
│  │  - /health: Health check endpoint                              │  │
│  │  - /predict: Audio prediction endpoint                         │  │
│  │  - CORS enabled                                                 │  │
│  └────────────────┬────────────────────────────────────────────────┘  │
│                   │                                                     │
│  ┌────────────────▼────────────────────────────────────────────────┐  │
│  │               Feature Extraction Pipeline                       │  │
│  │  1. Audio loading (librosa)                                    │  │
│  │  2. Mel-Spectrogram computation                                │  │
│  │  3. LFCC computation                                            │  │
│  │  4. Delta and Delta-Delta features                             │  │
│  │  5. Normalization                                               │  │
│  │  6. Time alignment                                              │  │
│  └────────────────┬────────────────────────────────────────────────┘  │
│                   │                                                     │
│  ┌────────────────▼────────────────────────────────────────────────┐  │
│  │            CNN-BiLSTM-Attention Model                           │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │  CNN Encoder (Feature Extraction)                        │  │  │
│  │  │  - 4 convolutional blocks                                │  │  │
│  │  │  - Batch normalization                                   │  │  │
│  │  │  - GELU activation                                        │  │  │
│  │  │  - Frequency axis pooling                                │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │                            │                                     │  │
│  │  ┌──────────────────────────▼──────────────────────────────┐  │  │
│  │  │  Bidirectional LSTM (Temporal Modeling)                  │  │  │
│  │  │  - 2 layers                                              │  │  │
│  │  │  - 256 hidden units                                      │  │  │
│  │  │  - Dropout regularization                                │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │                            │                                     │  │
│  │  ┌──────────────────────────▼──────────────────────────────┐  │  │
│  │  │  Multi-Head Attention (4 heads)                          │  │  │
│  │  │  - Self-attention over time steps                        │  │  │
│  │  │  - Learned attention weights                             │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │                            │                                     │  │
│  │  ┌──────────────────────────▼──────────────────────────────┐  │  │
│  │  │  Classification Head                                     │  │  │
│  │  │  - Layer normalization                                   │  │  │
│  │  │  - Dropout                                                │  │  │
│  │  │  - Dense layers with GELU                                │  │  │
│  │  │  - Output: [Real, Fake] logits                          │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                   Model Checkpoint (.pth)                        │  │
│  │  - Trained weights                                              │  │
│  │  - Model configuration                                           │  │
│  │  - Validation metrics                                            │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Component Responsibilities

### Frontend (React.js)
**Technology Stack:**
- React 18.2
- React Router DOM 6
- Axios
- Tailwind CSS
- Framer Motion
- React Dropzone
- React Icons

**Key Responsibilities:**
1. User interface rendering
2. File upload handling
3. API communication with backend
4. State management
5. Route management
6. Real-time UI updates
7. Responsive design

**Pages:**
- `HomePage`: Marketing/landing page
- `DetectionPage`: Audio upload and analysis interface
- `HistoryPage`: View past analyses

**Components:**
- `Navbar`: Navigation bar
- `ResultCard`: Display analysis results

---

### Backend (Java Spring Boot + Hibernate)
**Technology Stack:**
- Spring Boot 3.1.5
- Spring Data JPA
- Hibernate ORM
- H2 Database (dev) / PostgreSQL (prod)
- Maven
- Lombok

**Key Responsibilities:**
1. REST API endpoints
2. Request validation
3. Business logic orchestration
4. Database persistence
5. Python service integration
6. CORS configuration
7. Error handling

**Layers:**
- **Controller**: REST endpoints, request/response handling
- **Service**: Business logic, data transformation
- **Repository**: Database operations (JPA)
- **Model**: Entity classes (JPA annotations)
- **DTO**: Data transfer objects
- **Config**: Application configuration

**Database Schema:**
```sql
audio_analyses
├── id (PRIMARY KEY)
├── filename (VARCHAR)
├── prediction (VARCHAR: 'REAL' | 'AI-GENERATED')
├── confidence (DOUBLE)
├── real_score (DOUBLE)
├── fake_score (DOUBLE)
├── duration (DOUBLE)
├── sample_rate (INTEGER)
├── mel_mean (DOUBLE)
├── mel_std (DOUBLE)
├── attention_peak_frame (INTEGER)
├── attention_concentration (DOUBLE)
└── analyzed_at (TIMESTAMP)
```

---

### Python Service (Flask + PyTorch)
**Technology Stack:**
- Flask 2.3
- Flask-CORS
- PyTorch 2.0
- Librosa 0.10
- NumPy
- SciPy

**Key Responsibilities:**
1. Deep learning model inference
2. Audio feature extraction
3. Preprocessing pipeline
4. REST API for predictions
5. Model checkpoint management

**Processing Pipeline:**
1. **Audio Loading**: Load and resample to 16kHz
2. **Padding/Trimming**: Adjust to 4 seconds (64,000 samples)
3. **Feature Extraction**:
   - Mel-Spectrogram (80 bins)
   - LFCC (60 coefficients)
   - Delta features (Δ)
   - Delta-Delta features (ΔΔ)
4. **Normalization**: Scale features to [0, 1]
5. **Model Inference**: Forward pass through CNN-BiLSTM-Attention
6. **Post-processing**: Softmax, confidence scores

**Model Architecture:**
```
Input: (Batch, 6 Channels, 80 Freq Bins, ~400 Time Frames)
  ↓
CNN Blocks (4 layers)
  - Conv2D + BatchNorm + GELU + MaxPool
  - Channels: 6 → 32 → 64 → 128 → 256
  ↓
Frequency Pooling
  - Adaptive pooling to 4 bins
  ↓
Reshape for Sequence
  - (Batch, Time, Features)
  ↓
BiLSTM (2 layers)
  - 256 hidden units per direction
  - Total output: 512 features
  ↓
Multi-Head Attention (4 heads)
  - Self-attention over time dimension
  ↓
Attention Pooling
  - Learned weights over time steps
  ↓
Classification Head
  - Dense layers: 512 → 256 → 2
  - GELU activation, dropout
  ↓
Output: [Real Score, Fake Score]
```

---

## 🔄 Data Flow

### 1. User Uploads Audio
```
User Browser
  ↓ (File selection)
React Dropzone
  ↓ (File object)
React State (DetectionPage)
```

### 2. Analysis Request
```
Frontend (Axios)
  ↓ HTTP POST /api/analyze (multipart/form-data)
Backend Controller (AudioAnalysisController)
  ↓ Validate file
Service Layer (AudioAnalysisService)
  ↓ Call Python service
Python Service Client (PythonModelService)
  ↓ HTTP POST /predict (multipart/form-data)
Flask API (/predict endpoint)
```

### 3. Model Inference
```
Flask Handler
  ↓ Save temp file
Feature Extractor
  ↓ 6-channel features
PyTorch Model (forward pass)
  ↓ Logits
Softmax + Confidence
  ↓ JSON response
Flask Response
```

### 4. Result Processing
```
Python Service Response
  ↓ JSON
Backend Service
  ↓ Parse JSON, create entities
Repository Layer
  ↓ JPA save
Database (audio_analyses table)
  ↓ Return entity with ID
Service Layer
  ↓ Convert to DTO
Controller
  ↓ HTTP 200 OK + JSON
Frontend (Axios)
  ↓ Update state
React UI
  ↓ Display ResultCard
User sees results
```

---

## 🔐 Security Considerations

### 1. Input Validation
- File type checking (audio/* only)
- File size limit (50MB)
- File extension validation

### 2. CORS Configuration
- Configured in Spring Boot
- Allows cross-origin requests from frontend

### 3. Error Handling
- Try-catch blocks in all layers
- Graceful error responses
- No sensitive data in error messages

### 4. Temporary File Management
- Files cleaned up after processing
- No permanent storage on disk

---

## 📊 Performance Characteristics

### Latency Breakdown
1. File upload: ~100-500ms (depends on file size)
2. Backend processing: ~50ms
3. Python service:
   - Feature extraction: ~1-2 seconds
   - Model inference: ~100-300ms (GPU) or ~1-3s (CPU)
4. Database save: ~10ms
5. Response return: ~50ms

**Total**: ~2-5 seconds for typical audio file

### Scalability
- **Frontend**: Static files, CDN-ready
- **Backend**: Stateless, horizontally scalable
- **Python**: Can use multiple workers (gunicorn)
- **Database**: Connection pooling, indexing

---

## 🔧 Configuration Points

### Frontend
- `vite.config.js`: Dev server, proxy settings
- `tailwind.config.js`: Theme, colors
- `src/services/api.js`: Backend URL

### Backend
- `application.properties`: 
  - Server port
  - Database connection
  - File upload limits
  - Python service URL

### Python Service
- `model_inference.py`:
  - Model checkpoint path
  - Flask host/port
  - Device (CPU/GPU)

---

## 📈 Future Enhancements

1. **Authentication & Authorization**
   - User accounts
   - JWT tokens
   - Role-based access

2. **Batch Processing**
   - Multiple file upload
   - Async processing
   - Progress tracking

3. **Advanced Analytics**
   - Statistical dashboards
   - Export reports
   - Visualization improvements

4. **Model Improvements**
   - Model versioning
   - A/B testing
   - Continuous learning

5. **Production Features**
   - Rate limiting
   - Caching
   - Load balancing
   - Monitoring & logging

---

**This architecture provides a solid foundation for a production-ready audio deepfake detection platform.**
