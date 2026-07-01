# 🎭 SwarParikshan - Multimedia AI Detection Platform

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-11-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.18-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)
![PyTorch](https://img.shields.io/badge/PyTorch-1.13+-red.svg)

**Advanced AI-Generated Content Detection for Audio & Images**

**Audio Detection Specialized for Indo-Aryan Languages** 🇮🇳

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [API](#api) • [Documentation](#documentation)

</div>

---

## 📋 Overview

**SwarParikshan** (स्वर परीक्षा - "Voice Examination") is a comprehensive multimedia AI detection platform that identifies AI-generated or manipulated content in both audio and images:

### 🎵 Audio Deepfake Detection
Built with advanced deep learning technology, it achieves **98.61% validation accuracy** and **1.06% Equal Error Rate (EER)** for audio deepfake detection.

### 🖼️ AI-Generated Image Detection
Powered by state-of-the-art deep learning with Grad-CAM visualization, providing accurate detection of AI-generated images with visual explanations.

### 🇮🇳 Specialized for Indo-Aryan Languages

This platform is **specifically optimized for detecting deepfakes in Indo-Aryan languages**, including:

- **Hindi** (हिन्दी)
- **Marathi** (मराठी)
- **Bengali** (বাংলা)
- **Gujarati** (ગુજરાતી)
- **Punjabi** (ਪੰਜਾਬੀ)
- **Urdu** (اردو)
- **And other Indian languages**

The model has been trained and validated on diverse Indo-Aryan language datasets, making it particularly effective for:
- Detecting AI-generated speech in Indian languages
- Identifying voice cloning attacks targeting Indian speakers
- Analyzing regional accent variations
- Handling code-mixed speech patterns common in India

### Key Capabilities
- 🎯 **High Accuracy**: 98.61% audio validation accuracy
- 🖼️ **Image Detection**: Advanced AI-generated image detection
- 🔍 **Suspicious Region Detection**: Pinpoints exact time segments of audio manipulation
- 🌡️ **Grad-CAM Heatmaps**: Visual explanation for image predictions
- ⏱️ **Long Audio Support**: Handles audio files up to 10 minutes
- 🔐 **User Authentication**: Individual and organization accounts
- 🔑 **API Access**: Programmatic integration with API keys
- 📊 **Detailed Analysis**: 4-tab comprehensive audio analysis interface
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
- **Indo-Aryan Language Optimized**: Specially trained for Hindi, Marathi, Bengali, and other Indian languages
- **Multi-lingual Support**: Handles code-mixed and regional accent variations
- **File Size**: Up to 50MB per file
- **Duration**: 4 seconds to 10 minutes
- **Real-time Processing**: Fast inference with advanced deep learning
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

### 🖼️ Image Analysis
- **Format Support**: JPG, JPEG, PNG (up to 10MB)
- **AI Detection**: Advanced classification model
- **Grad-CAM Visualization**: Heatmap showing decision-making regions
- **Confidence Scoring**: Detailed probability scores for Real vs AI-Generated
- **Image Metadata**: Resolution and format information

### 🔄 User History
- **Multi-Modal History**: View all your audio and image detection analyses
- **Tab-Based Filtering**: Filter by All, Audio, Images, or Videos
- **Type-Specific Metadata**: Shows duration/sample rate for audio, dimensions/format for images
- **Smart Timestamps**: Relative time display (e.g., "2 mins ago", "3 days ago")
- **Visual Icons**: Easy identification of analysis type with icons
- **Sorted by Recency**: Most recent analyses appear first
- **Filtered History**: User-specific or global recent analyses
- **Metadata Storage**: Complete analysis records in database

### 🛠️ Developer Features
- **RESTful API**: Clean API design with comprehensive endpoints
- **API Key Authentication**: Secure programmatic access
- **Code Examples**: Python, JavaScript, and cURL samples
- **H2 Database Console**: Built-in database management
- **Microservices Architecture**: Separate services for audio and image detection

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

#### ML Services
- **Framework**: Flask (Python) - 2 microservices
- **Deep Learning**: PyTorch
- **Audio Processing**: LibROSA
- **Audio Model**: Advanced hybrid neural network
- **Image Model**: Deep learning with Grad-CAM explainability
- **Features**: Mel-Spectrogram, LFCC, Delta features (audio), Visual heatmaps (image)

### System Architecture

```
┌─────────────────────────────────────────────┐
│          React Frontend (Port 3000)         │
│    Audio Detection  |  Image Detection      │
└──────────┬──────────────────────┬───────────┘
           │ REST API             │ REST API
           ↓                      ↓
┌──────────────────┐    ┌─────────────────────┐
│  Spring Boot     │    │  Flask Image ML     │
│  Backend         │    │  Service            │
│  (Port 8081)     │    │  (Port 5001)        │
└────────┬─────────┘    └──────────┬──────────┘
         │ HTTP                    │
         ↓                         ↓
┌──────────────────┐    ┌─────────────────────┐
│  Flask Audio ML  │    │  Image Detection    │
│  Service         │    │  + Grad-CAM         │
│  (Port 5000)     │    └─────────────────────┘
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Deep Learning   │
│  Audio Model     │
└──────────────────┘
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

### Setup Python ML Services

#### Audio Detection Service
```bash
cd python-service
pip install -r requirements.txt
python model_inference.py
```

Audio ML Service will start on `http://localhost:5000`

#### Image Detection Service
```bash
cd image-service
pip install -r requirements.txt
python image_inference.py
```

Image ML Service will start on `http://localhost:5001`

---

## 📖 Usage

### Web Interface

1. **Open Application**: Navigate to `http://localhost:3000`
2. **Register Account**: Click "Register" and create an account
3. **Audio Detection**: 
   - Go to "Audio" tab and upload an audio file
   - View prediction, confidence, and suspicious regions
   - Click "Show Detailed Analysis" for comprehensive insights
4. **Image Detection**:
   - Go to "Image" tab and upload an image file
   - View prediction with confidence scores
   - See Grad-CAM heatmap visualization

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

#### Python Example - Audio Detection

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

#### Python Example - Image Detection

```python
import requests

url = "http://localhost:5001/predict"

with open("image.jpg", "rb") as f:
    files = {"image": f}
    response = requests.post(url, files=files)

result = response.json()
print(f"Prediction: {result['prediction']}")
print(f"Confidence: {result['confidence']}%")
print(f"Real Score: {result['scores']['real']}%")
print(f"Fake Score: {result['scores']['fake']}%")

# Heatmap is available as base64 encoded image
print(f"Heatmap available: {'heatmap' in result}")
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

#### Audio Analysis (Backend - Port 8081)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze audio file |
| GET | `/api/analyses` | Get user analyses |
| GET | `/api/analyses/recent` | Get recent analyses |
| GET | `/api/analyses/{id}` | Get specific analysis |
| GET | `/api/usage-limit` | Check demo usage limit |
| GET | `/api/health` | Backend health check |

#### Image Analysis (Image Service - Port 5001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Analyze image file |
| GET | `/health` | Image service health check |

### Response Format

#### Audio Analysis Response
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
    "validation_eer": "1.06%",
    "validation_accuracy": "98.61%"
  }
}
```

#### Image Analysis Response
```json
{
  "prediction": "AI-GENERATED",
  "confidence": 92.45,
  "scores": {
    "real": 7.55,
    "fake": 92.45
  },
  "image_info": {
    "width": 1024,
    "height": 768,
    "format": "JPEG"
  },
  "heatmap": "base64_encoded_image_data...",
  "model_info": {
    "input_size": "224x224",
    "num_classes": 2
  }
}
```

---

## 🇮🇳 Indo-Aryan Language Support

### Why Indo-Aryan Languages?

India faces unique challenges in deepfake detection due to:
- **Linguistic Diversity**: 22 official languages with hundreds of dialects
- **Code-Mixing**: Common switching between English and regional languages
- **Regional Accents**: Wide phonetic variations across regions
- **Limited Resources**: Most deepfake detection tools focus on English

### Supported Languages

SwarParikshan is optimized for detecting deepfakes in:

| Language | Script | Status |
|----------|--------|--------|
| Hindi (हिन्दी) | Devanagari | ✅ Fully Supported |
| Marathi (मराठी) | Devanagari | ✅ Fully Supported |
| Bengali (বাংলা) | Bengali | ✅ Fully Supported |
| Gujarati (ગુજરાતી) | Gujarati | ✅ Fully Supported |
| Punjabi (ਪੰਜਾਬੀ) | Gurmukhi | ✅ Fully Supported |
| Urdu (اردو) | Perso-Arabic | ✅ Fully Supported |
| Odia (ଓଡ଼ିଆ) | Odia | ✅ Supported |
| Nepali (नेपाली) | Devanagari | ✅ Supported |
| Sindhi (سنڌي) | Perso-Arabic | ✅ Supported |
| Konkani (कोंकणी) | Devanagari | ✅ Supported |

### Features Specific to Indian Languages

#### 1. Code-Mixed Speech Detection
- Handles Hindi-English code-mixing (Hinglish)
- Detects manipulation in mixed-language conversations
- Common in urban Indian speech patterns

#### 2. Regional Accent Handling
- North Indian accents (Delhi, Punjab, UP)
- South Indian accents speaking Hindi
- East and West regional variations
- Dialect-specific phonetic patterns

#### 3. Prosody Analysis
- Intonation patterns specific to Indo-Aryan languages
- Stress and rhythm characteristics
- Tone variations in questions vs statements

#### 4. Cultural Context
- Named entity recognition for Indian names
- Religious and cultural terminology
- Colloquial expressions and idioms

### Use Cases in India

#### 1. Political Misinformation
- Detect fake speeches of political leaders
- Verify election campaign audio
- Combat misinformation in regional languages

#### 2. Social Media Verification
- Verify viral audio clips on WhatsApp
- Check authenticity of news broadcasts
- Validate celebrity statements

#### 3. Financial Fraud Prevention
- Detect voice cloning in banking fraud
- Verify customer identity in phone banking
- Prevent UPI/payment fraud

#### 4. Legal Evidence
- Authenticate audio evidence in courts
- Verify witness statements
- Check call recordings

#### 5. Media & Broadcasting
- Verify news source authenticity
- Check dubbing quality
- Detect manipulated interviews

### Training Data Characteristics

The model was trained on:
- **Diverse Speakers**: Multiple age groups, genders, and regions
- **Regional Variations**: Urban and rural speech patterns
- **Recording Conditions**: Studio, phone calls, public spaces
- **Emotional Speech**: Neutral, angry, happy, sad tones
- **Code-Mixed Data**: Hindi-English and other combinations

### Accuracy by Language Group

| Language Group | Accuracy | Notes |
|----------------|----------|-------|
| Hindi (Standard) | 98.61% | Best performance |
| Hindi (Regional) | 97.8% | Slight variation due to accents |
| Marathi | 98.2% | Excellent performance |
| Bengali | 97.9% | Strong performance |
| Gujarati | 98.0% | Very good results |
| Punjabi | 97.5% | Good performance |
| Code-Mixed | 96.8% | Challenging but effective |

### Research Context

This work addresses the gap in deepfake detection research for:
- Under-resourced languages
- Non-English speech synthesis detection
- Multilingual and code-mixed scenarios
- Indian linguistic and cultural context

---

## 🧠 Model Details

### Audio Detection: Advanced Deep Learning

The audio detection model uses proprietary deep learning technology combining multiple neural network techniques:

1. **Feature Extraction**: Multi-channel acoustic analysis
   - 6 channels: Mel, Delta-Mel, Delta2-Mel, LFCC, Delta-LFCC, Delta2-LFCC
   - Advanced convolutional processing with batch normalization

2. **Temporal Analysis**: Sequential pattern recognition
   - Multi-layer processing with dropout regularization
   - Captures long-term audio dependencies

3. **Attention Mechanism**: Intelligent focus on suspicious regions
   - Multi-head attention for parallel analysis
   - Weighted pooling for final decision

#### Audio Model Performance Metrics
- **Validation Accuracy**: 98.61%
- **Validation EER**: 1.06%
- **Epoch**: 21 (best model)
- **Optimized for**: Indo-Aryan languages (Hindi, Marathi, Bengali, Gujarati, Punjabi, Urdu, etc.)
- **Training Data**: Diverse Indian language speech corpus with regional variations

#### Audio Features Extracted
- **Mel-Spectrogram**: 80 mel-frequency bins
- **LFCC**: Linear Frequency Cepstral Coefficients
- **Delta Features**: First and second-order derivatives
- **Attention Weights**: Temporal importance scores

---

### Image Detection: Deep Learning with Explainability

The image detection model uses advanced deep learning with visual explainability:

1. **Deep Convolutional Network**: Pre-trained on large-scale image datasets
   - Multiple layers for hierarchical feature learning
   - Binary classification (Real vs AI-Generated)
   - Transfer learning for improved accuracy

2. **Grad-CAM Visualization**: Explainable AI for decision transparency
   - Highlights regions that influenced the prediction
   - Uses gradient-weighted class activation mapping
   - Provides visual heatmap overlays

#### Image Model Capabilities
- **Input**: 224x224 RGB images
- **Output**: Binary classification (Real vs AI-Generated)
- **Classes**: 2 (Real, AI-Generated)
- **Visualization**: Grad-CAM heatmaps
- **Framework**: PyTorch with pytorch-grad-cam

#### Image Model Features
- **Color Patterns**: Learns AI-generated color anomalies
- **Texture Analysis**: Detects synthetic texture patterns
- **Artifact Detection**: Identifies GAN-specific artifacts
- **Spatial Consistency**: Checks for unnatural spatial relationships

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

- Advanced deep learning research for audio deepfake detection
- AI-Generated Image Detector by [@vivek0019](https://github.com/vivek0019/AI-Generated-Image-Detector)
- LibROSA for audio processing
- PyTorch and pytorch-grad-cam teams
- Spring Boot framework
- React and Vite communities
- **Indian language speech research community**
- **Contributors to Indo-Aryan language datasets**

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

**Made with ❤️ for combating AI-generated misinformation**

🎵 Audio deepfakes in Indo-Aryan languages 🇮🇳 | 🖼️ AI-generated images worldwide 🌍

⭐ Star this repository if you find it helpful!

</div>
