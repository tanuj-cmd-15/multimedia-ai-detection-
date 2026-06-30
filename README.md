# 🎵 SwarParikshan - Audio Deepfake Detection Platform

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-11-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.18-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)
![PyTorch](https://img.shields.io/badge/PyTorch-1.13+-red.svg)

**Advanced Audio Deepfake Detection using CNN-BiLSTM-Attention Model**

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [API](#api) • [Documentation](#documentation)

</div>

---

## 📋 Overview

**SwarParikshan** (स्वर परीक्षा - "Voice Examination") is a state-of-the-art audio deepfake detection platform that uses advanced deep learning to identify AI-generated or manipulated audio. Built with a powerful CNN-BiLSTM-Attention architecture, it achieves **98.61% validation accuracy** and **1.06% Equal Error Rate (EER)**.

### Key Capabilities
- 🎯 **High Accuracy**: 98.61% validation accuracy
- 🔍 **Suspicious Region Detection**: Pinpoints exact time segments of manipulation
- ⏱️ **Long Audio Support**: Handles files up to 10 minutes
- 🔐 **User Authentication**: Individual and organization accounts
- 🔑 **API Access**: Programmatic integration with API keys
- 📊 **Detailed Analysis**: 4-tab comprehensive analysis interface
- 🚀 **Production Ready**: Full-stack application with rate limiting

---

## ✨ Features

### 🔐 Authentication & Access Control
- **User Registration**: Individual and Organization account types
- **Secure Login**: Session-based authentication
- **API Key Management**: Generate and regenerate API keys
- **Rate Limiting**: 3 free detections for demo users, unlimited for registered users

### 🎵 Audio Analysis
- **Multi-format Support**: WAV, MP3, FLAC, OGG, M4A
- **File Size**: Up to 50MB per file
- **Duration**: 4 seconds to 10 minutes
- **Real-time Processing**: Fast inference with CNN-BiLSTM-Attention model
- **Confidence Scoring**: Detailed probability scores for Real vs AI-Generated

### 🔍 Suspicious Region Detection
- **Time-based Segmentation**: Identifies exact timestamps of manipulation
- **Intensity Scoring**: Measures suspicion level (High/Medium)
- **Visual Heatmap**: Interactive attention weight visualization
- **Anomaly Detection**: Statistical analysis of spectral features

### 📊 Detailed Analysis
- **Overview Tab**: Prediction, confidence, and scores
- **Suspicious Regions Tab**: Time segments with manipulation indicators
- **Attention Analysis Tab**: Visual heatmap of model focus
- **Features Tab**: Acoustic feature statistics

### 🔄 User History
- **Personal Dashboard**: View all your past analyses
- **Filtered History**: User-specific or global recent analyses
- **Metadata Storage**: Complete analysis records in database

### 🛠️ Developer Features
- **RESTful API**: Clean API design with comprehensive endpoints
- **API Key Authentication**: Secure programmatic access
- **Code Examples**: Python, JavaScript, and cURL samples
- **H2 Database Console**: Built-in database management

---

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **HTTP Client**: Axios

#### Backend
- **Framework**: Spring Boot 2.7.18
- **Language**: Java 11
- **ORM**: Hibernate/JPA
- **Database**: H2 (development), PostgreSQL-ready (production)
- **API**: RESTful with CORS support

#### ML Service
- **Framework**: Flask (Python)
- **Deep Learning**: PyTorch
- **Audio Processing**: LibROSA
- **Model**: CNN-BiLSTM-Attention
- **Features**: Mel-Spectrogram, LFCC, Delta features

### System Architecture

```
┌─────────────────┐
│   React         │
│   Frontend      │ ← http://localhost:3000
│   (Port 3000)   │
└────────┬────────┘
         │ REST API
         ↓
┌─────────────────┐
│   Spring Boot   │
│   Backend       │ ← http://localhost:8081
│   (Port 8081)   │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│   Flask ML      │
│   Service       │ ← http://localhost:5000
│   (Port 5000)   │
└─────────────────┘
         │
         ↓
┌─────────────────┐
│   CNN-BiLSTM    │
│   Attention     │
│   Model         │
└─────────────────┘
```

---

## 🚀 Installation

### Prerequisites
- **Java**: JDK 11 or higher
- **Node.js**: v16 or higher
- **Python**: 3.8 or higher
- **Maven**: 3.6 or higher
- **Git**: Latest version

### Clone Repository

```bash
git clone https://github.com/tanuj-cmd-15/multimedia-ai-detection-.git
cd multimedia-ai-detection-
```

### Setup Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:8081`

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on `http://localhost:3000`

### Setup Python ML Service

```bash
cd python-service
pip install -r requirements.txt
python model_inference.py
```

ML Service will start on `http://localhost:5000`

---

## 📖 Usage

### Web Interface

1. **Open Application**: Navigate to `http://localhost:3000`
2. **Register Account**: Click "Register" and create an account
3. **Upload Audio**: Go to "Detection" and upload an audio file
4. **View Results**: See prediction, confidence, and suspicious regions
5. **Detailed Analysis**: Click "Show Detailed Analysis" for comprehensive insights

### API Usage

#### Register User

```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "userType": "INDIVIDUAL"
  }'
```

#### Login

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Analyze Audio

```bash
curl -X POST http://localhost:8081/api/analyze \
  -H "X-API-Key: your_api_key_here" \
  -F "audio=@audio.wav"
```

#### Python Example

```python
import requests

api_key = "sk_xxxxxxxxxxxxx"
url = "http://localhost:8081/api/analyze"

with open("audio.wav", "rb") as f:
    files = {"audio": f}
    headers = {"X-API-Key": api_key}
    response = requests.post(url, files=files, headers=headers)

result = response.json()
print(f"Prediction: {result['prediction']}")
print(f"Confidence: {result['confidence']}%")

# View suspicious regions
for region in result['suspicious_regions']:
    print(f"Suspicious: {region['start_time']}s - {region['end_time']}s")
    print(f"  Intensity: {region['intensity']}")
    print(f"  Level: {region['suspicion_level']}")
```

---

## 🔌 API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/regenerate-api-key/{userId}` | Regenerate API key |

### Analysis Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze audio file |
| GET | `/api/analyses` | Get user analyses |
| GET | `/api/analyses/recent` | Get recent analyses |
| GET | `/api/analyses/{id}` | Get specific analysis |
| GET | `/api/usage-limit` | Check demo usage limit |
| GET | `/api/health` | Backend health check |

### Response Format

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
    }
  ],
  "attention_weights": [
    {"time": 0.0, "weight": 0.0123},
    {"time": 0.25, "weight": 0.0156}
  ],
  "features": {
    "mel_mean": -45.6789,
    "mel_std": 12.3456,
    "attention_peak_frame": 234,
    "attention_concentration": 0.0567
  },
  "model_info": {
    "architecture": "CNN-BiLSTM-Attention",
    "validation_eer": "1.06%",
    "validation_accuracy": "98.61%"
  }
}
```

---

## 🧠 Model Details

### CNN-BiLSTM-Attention Architecture

The model combines three powerful components:

1. **CNN Layers**: Extract spatial features from spectrograms
   - 6 channels: Mel, Delta-Mel, Delta2-Mel, LFCC, Delta-LFCC, Delta2-LFCC
   - Multiple convolutional blocks with batch normalization

2. **Bidirectional LSTM**: Capture temporal dependencies
   - 2 layers with 128 hidden units
   - Dropout for regularization

3. **Multi-Head Attention**: Focus on important time segments
   - 4 attention heads
   - Weighted pooling for final embedding

### Performance Metrics
- **Validation Accuracy**: 98.61%
- **Validation EER**: 1.06%
- **Epoch**: 21 (best model)

### Features Extracted
- **Mel-Spectrogram**: 80 mel-frequency bins
- **LFCC**: Linear Frequency Cepstral Coefficients
- **Delta Features**: First and second-order derivatives
- **Attention Weights**: Temporal importance scores

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_type VARCHAR(255) NOT NULL,
    organization_name VARCHAR(255),
    api_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMP,
    last_login_at TIMESTAMP
);
```

### Audio Analyses Table
```sql
CREATE TABLE audio_analyses (
    id BIGINT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    prediction VARCHAR(255) NOT NULL,
    confidence DOUBLE NOT NULL,
    real_score DOUBLE NOT NULL,
    fake_score DOUBLE NOT NULL,
    duration DOUBLE,
    suspicious_regions TEXT,
    attention_weights TEXT,
    analyzed_at TIMESTAMP,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Usage Limits Table
```sql
CREATE TABLE usage_limits (
    id BIGINT PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    identifier_type VARCHAR(255) NOT NULL,
    usage_count INTEGER DEFAULT 0,
    max_limit INTEGER DEFAULT 3,
    first_used_at TIMESTAMP,
    last_used_at TIMESTAMP
);
```

---

## 📚 Documentation

Comprehensive documentation is available in the repository:

- **[COMPLETE_IMPLEMENTATION_SUMMARY.md](COMPLETE_IMPLEMENTATION_SUMMARY.md)** - Full technical details
- **[FEATURE_UPDATE_SUMMARY.md](FEATURE_UPDATE_SUMMARY.md)** - Feature breakdown
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Step-by-step testing procedures
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick command reference
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture details

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test

# Python tests
cd python-service
pytest
```

### Manual Testing

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive testing procedures.

---

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Production Considerations

1. **Security**
   - Add bcrypt password hashing
   - Implement JWT tokens
   - Enable HTTPS/SSL
   - Configure CORS properly

2. **Database**
   - Migrate from H2 to PostgreSQL
   - Set up backup strategy
   - Configure connection pooling

3. **Scaling**
   - Load balancing for backend
   - CDN for frontend assets
   - Caching layer (Redis)
   - Message queue for async processing

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Tushar/Tanuj** - Initial work - [@tanuj-cmd-15](https://github.com/tanuj-cmd-15)

---

## 🙏 Acknowledgments

- CNN-BiLSTM-Attention model architecture
- LibROSA for audio processing
- Spring Boot framework
- React and Vite communities
- PyTorch team

---

## 📧 Contact

For questions or support, please open an issue on GitHub or contact:
- Email: [your-email@example.com]
- GitHub: [@tanuj-cmd-15](https://github.com/tanuj-cmd-15)

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=tanuj-cmd-15/multimedia-ai-detection-&type=Date)](https://star-history.com/#tanuj-cmd-15/multimedia-ai-detection-&Date)

---

<div align="center">

**Made with ❤️ for combating audio deepfakes**

⭐ Star this repository if you find it helpful!

</div>
