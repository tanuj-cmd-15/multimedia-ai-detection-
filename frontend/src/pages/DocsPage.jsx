import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HiBookOpen, 
  HiLightningBolt, 
  HiChip, 
  HiCode,
  HiShieldCheck,
  HiDocumentText,
  HiAcademicCap,
  HiCube,
  HiBeaker
} from 'react-icons/hi'

const DocsPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <HiBookOpen /> },
    { id: 'howItWorks', label: 'How It Works', icon: <HiBeaker /> },
    { id: 'technology', label: 'Technology', icon: <HiChip /> },
    { id: 'api', label: 'API Reference', icon: <HiCode /> },
    { id: 'faq', label: 'FAQ', icon: <HiDocumentText /> },
  ]
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center">
            <HiAcademicCap className="mr-4 text-accent-blue" />
            Documentation & <span className="gradient-text ml-3">About</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Learn about SwarParikshan's audio deepfake detection technology, architecture, and how to integrate it
          </p>
        </motion.div>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent-blue text-white'
                  : 'bg-navy-800 text-gray-400 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card-dark p-8"
        >
          {activeTab === 'overview' && <OverviewContent />}
          {activeTab === 'howItWorks' && <HowItWorksContent />}
          {activeTab === 'technology' && <TechnologyContent />}
          {activeTab === 'api' && <APIContent />}
          {activeTab === 'faq' && <FAQContent />}
        </motion.div>
      </div>
    </div>
  )
}

// Overview Content
const OverviewContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-3xl font-bold mb-4 text-accent-blue">About SwarParikshan</h2>
      <p className="text-gray-300 text-lg leading-relaxed mb-4">
        SwarParikshan (स्वर परीक्षा - "Voice Examination") is an advanced AI-powered platform for detecting 
        audio deepfakes and AI-generated synthetic voices. Built on cutting-edge deep learning technology, 
        it provides enterprise-grade detection with 98.4% accuracy.
      </p>
      <p className="text-gray-300 text-lg leading-relaxed">
        Our system analyzes audio recordings to determine if they were tampered with or artificially created. 
        Using spectral analysis, AI signature recognition, and voiceprint verification, we catch sophisticated 
        audio manipulation attempts including executive impersonation, vishing attacks, and media misrepresentation.
      </p>
    </section>
    
    <section>
      <h3 className="text-2xl font-bold mb-4">Key Features</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            title: 'Real-Time Detection',
            description: 'Analyze audio files in under 5 seconds with immediate results',
            icon: <HiLightningBolt className="text-yellow-500" />
          },
          {
            title: '98.4% Accuracy',
            description: 'Industry-leading detection across TTS, voice conversion, and cloning attacks',
            icon: <HiShieldCheck className="text-accent-green" />
          },
          {
            title: 'Advanced Analytics',
            description: 'Detailed feature analysis with spectral characteristics and attention heatmaps',
            icon: <HiChip className="text-purple-500" />
          },
          {
            title: 'Easy Integration',
            description: 'Simple REST API for seamless integration into your applications',
            icon: <HiCode className="text-accent-blue" />
          }
        ].map((feature, index) => (
          <div key={index} className="bg-navy-700 p-6 rounded-lg">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{feature.icon}</div>
              <div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    
    <section>
      <h3 className="text-2xl font-bold mb-4">Supported File Types</h3>
      <div className="bg-navy-700 p-6 rounded-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-accent-blue">Audio Formats:</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• WAV (Waveform Audio)</li>
              <li>• MP3 (MPEG Audio Layer 3)</li>
              <li>• FLAC (Free Lossless Audio Codec)</li>
              <li>• OGG (Ogg Vorbis)</li>
              <li>• M4A (MPEG-4 Audio)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-accent-blue">Specifications:</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• Max file size: 50 MB</li>
              <li>• Recommended duration: 2-10 seconds</li>
              <li>• Sample rate: 8kHz - 48kHz</li>
              <li>• Mono or stereo channels</li>
              <li>• Analysis time: 2-5 seconds</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
)

// How It Works Content
const HowItWorksContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-3xl font-bold mb-6 text-accent-blue">How Audio Deepfake Detection Works</h2>
      <p className="text-gray-300 text-lg leading-relaxed mb-8">
        Our detection system uses advanced machine learning techniques to identify artificial audio. 
        Here's how the process works from upload to result:
      </p>
      
      <div className="space-y-6">
        {[
          {
            step: 1,
            title: 'Audio Upload & Preprocessing',
            description: 'When you upload an audio file, it\'s first validated and preprocessed. The system resamples the audio to 16kHz, normalizes the amplitude, and trims or pads it to a standardized duration of 4 seconds (64,000 samples).',
            details: [
              'File validation (format, size)',
              'Audio loading with Librosa',
              'Resampling to 16kHz mono',
              'Padding or center-cropping to 4 seconds'
            ],
            color: 'blue'
          },
          {
            step: 2,
            title: 'Feature Extraction',
            description: 'The preprocessed audio undergoes sophisticated feature extraction to create a 6-channel representation capturing different aspects of the audio signal.',
            details: [
              'Mel-Spectrogram: Time-frequency representation (80 mel bins)',
              'LFCC: Linear Frequency Cepstral Coefficients (60 coefficients)',
              'Delta features: First-order derivatives (rate of change)',
              'Delta-Delta: Second-order derivatives (acceleration)',
              'All features normalized to [0, 1] range',
              'Final shape: (6 channels, 80 freq bins, ~400 time frames)'
            ],
            color: 'purple'
          },
          {
            step: 3,
            title: 'CNN Processing',
            description: 'The feature maps pass through a Convolutional Neural Network that extracts local spectro-temporal patterns indicative of synthetic audio.',
            details: [
              '4 convolutional blocks with increasing channel depth',
              'Batch normalization for training stability',
              'GELU activation functions',
              'MaxPooling along frequency axis',
              'Outputs: High-level feature representations'
            ],
            color: 'green'
          },
          {
            step: 4,
            title: 'BiLSTM Sequence Modeling',
            description: 'Bidirectional LSTM layers model temporal dependencies in both forward and backward directions, capturing long-range patterns in the audio.',
            details: [
              '2 BiLSTM layers with 256 hidden units each',
              'Processes sequence in both time directions',
              'Captures temporal evolution of audio features',
              'Output: 512-dimensional sequence representation'
            ],
            color: 'yellow'
          },
          {
            step: 5,
            title: 'Multi-Head Attention',
            description: 'The attention mechanism learns to focus on the most discriminative time frames, identifying which parts of the audio are most indicative of manipulation.',
            details: [
              '4 attention heads for diverse pattern detection',
              'Self-attention over time dimension',
              'Learned attention weights',
              'Weighted pooling for fixed-size embedding'
            ],
            color: 'red'
          },
          {
            step: 6,
            title: 'Classification & Results',
            description: 'The final classification head produces prediction scores, which are converted to probabilities and confidence metrics.',
            details: [
              'Dense layers: 512 → 256 → 2 classes',
              'Softmax activation for probability distribution',
              'Output: [Real probability, Fake probability]',
              'Confidence score: Maximum probability × 100',
              'Prediction: Class with highest probability'
            ],
            color: 'blue'
          }
        ].map((item) => (
          <div key={item.step} className="bg-navy-700 p-6 rounded-lg border-l-4 border-accent-blue">
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-accent-${item.color} flex items-center justify-center text-white font-bold text-xl`}>
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-300 mb-4">{item.description}</p>
                <ul className="space-y-1 text-sm text-gray-400">
                  {item.details.map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
    
    <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-lg border border-blue-500/30">
      <h3 className="text-2xl font-bold mb-4">Detection Methods</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            title: 'Spectrogram Analysis',
            description: 'Examines audio visual representations to detect anomalies in frequency patterns'
          },
          {
            title: 'AI Signature Recognition',
            description: 'Identifies artifacts common to synthetic audio generation models'
          },
          {
            title: 'Voiceprint Verification',
            description: 'Analyzes credibility scores for immediate action on risky audio'
          }
        ].map((method, index) => (
          <div key={index} className="bg-navy-800/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-accent-blue">{method.title}</h4>
            <p className="text-sm text-gray-400">{method.description}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
)

// Technology Content
const TechnologyContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-3xl font-bold mb-6 text-accent-blue">Technology Stack</h2>
      
      <div className="space-y-6">
        <div className="bg-navy-700 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <HiCube className="text-4xl text-accent-blue" />
            <h3 className="text-2xl font-bold">Model Architecture</h3>
          </div>
          <p className="text-gray-300 mb-4">
            CNN-BiLSTM-Attention: A hybrid deep learning architecture combining the strengths of convolutional neural networks, 
            recurrent neural networks, and attention mechanisms.
          </p>
          <div className="bg-navy-900 p-4 rounded font-mono text-sm text-gray-300 overflow-x-auto">
            <pre>{`
Input: (Batch, 6 Channels, 80 Freq Bins, ~400 Time Frames)
   ↓
CNN Encoder (4 blocks)
   - Conv2D + BatchNorm + GELU + MaxPool
   - Channels: 6 → 32 → 64 → 128 → 256
   ↓
Frequency Pooling (Adaptive → 4 bins)
   ↓
Reshape for Sequence (Batch, Time, 1024 Features)
   ↓
BiLSTM (2 layers)
   - 256 hidden units per direction
   - Total output: 512 features
   ↓
Multi-Head Attention (4 heads)
   - Self-attention over time steps
   - Learned attention weights
   ↓
Attention Pooling
   - Weighted sum over time dimension
   ↓
Classification Head
   - Dense: 512 → 256 → 2 classes
   - GELU + Dropout + LayerNorm
   ↓
Output: [P(Real), P(Fake)]
            `}</pre>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-navy-700 p-6 rounded-lg">
            <h4 className="text-xl font-bold mb-3 text-purple-400">Frontend</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• React 18.2</li>
              <li>• React Router DOM 6</li>
              <li>• Tailwind CSS 3</li>
              <li>• Framer Motion</li>
              <li>• Axios</li>
              <li>• React Dropzone</li>
              <li>• Vite Build Tool</li>
            </ul>
          </div>
          
          <div className="bg-navy-700 p-6 rounded-lg">
            <h4 className="text-xl font-bold mb-3 text-green-400">Backend</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Java 17</li>
              <li>• Spring Boot 3.1.5</li>
              <li>• Hibernate ORM</li>
              <li>• Spring Data JPA</li>
              <li>• H2 Database (Dev)</li>
              <li>• PostgreSQL (Prod)</li>
              <li>• Maven</li>
            </ul>
          </div>
          
          <div className="bg-navy-700 p-6 rounded-lg">
            <h4 className="text-xl font-bold mb-3 text-blue-400">ML Service</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Python 3.8+</li>
              <li>• PyTorch 2.0</li>
              <li>• Flask 2.3</li>
              <li>• Librosa 0.10</li>
              <li>• NumPy & SciPy</li>
              <li>• Flask-CORS</li>
              <li>• CUDA Support</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <section>
      <h3 className="text-2xl font-bold mb-4">Performance Characteristics</h3>
      <div className="bg-navy-700 p-6 rounded-lg">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-3 text-accent-blue">Latency Breakdown</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• File upload: ~100-500ms</li>
              <li>• Backend processing: ~50ms</li>
              <li>• Feature extraction: ~1-2 seconds</li>
              <li>• Model inference: ~100-300ms (GPU)</li>
              <li>• Database save: ~10ms</li>
              <li>• <strong>Total: 2-5 seconds</strong></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-accent-blue">Model Metrics</h4>
            <ul className="space-y-2 text-gray-300">
              <li>• Accuracy: 98.4%</li>
              <li>• EER: Check validation results</li>
              <li>• Parameters: ~2-3 million</li>
              <li>• Input size: 6×80×400</li>
              <li>• Inference device: GPU/CPU</li>
              <li>• Memory usage: ~500MB-1GB</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
)

// API Content
const APIContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-3xl font-bold mb-6 text-accent-blue">API Reference</h2>
      <p className="text-gray-300 mb-6">
        SwarParikshan provides a RESTful API for integrating audio deepfake detection into your applications.
      </p>
      
      {[
        {
          method: 'POST',
          endpoint: '/api/analyze',
          description: 'Analyze an audio file for deepfake detection',
          requestBody: `Content-Type: multipart/form-data
audio: [audio file]`,
          response: `{
  "id": 1,
  "prediction": "AI-GENERATED",
  "confidence": 95.67,
  "scores": {
    "real": 4.33,
    "fake": 95.67
  },
  "audioInfo": {
    "duration": 4.0,
    "sampleRate": 16000
  },
  "features": {
    "melMean": -23.4567,
    "melStd": 12.3456,
    "attentionPeakFrame": 234,
    "attentionConcentration": 0.1234
  },
  "modelInfo": {
    "architecture": "CNN-BiLSTM-Attention",
    "validationEer": "2.34%",
    "validationAccuracy": "98.4%"
  }
}`,
          color: 'green'
        },
        {
          method: 'GET',
          endpoint: '/api/analyses',
          description: 'Retrieve all audio analyses',
          requestBody: null,
          response: `[
  {
    "id": 1,
    "prediction": "AI-GENERATED",
    "confidence": 95.67,
    ...
  },
  {
    "id": 2,
    "prediction": "REAL",
    "confidence": 89.23,
    ...
  }
]`,
          color: 'blue'
        },
        {
          method: 'GET',
          endpoint: '/api/analyses/recent',
          description: 'Get the 10 most recent analyses',
          requestBody: null,
          response: `[
  {
    "id": 10,
    "prediction": "REAL",
    "confidence": 92.45,
    ...
  }
]`,
          color: 'blue'
        },
        {
          method: 'GET',
          endpoint: '/api/analyses/{id}',
          description: 'Get a specific analysis by ID',
          requestBody: null,
          response: `{
  "id": 1,
  "prediction": "AI-GENERATED",
  "confidence": 95.67,
  ...
}`,
          color: 'blue'
        },
        {
          method: 'GET',
          endpoint: '/api/health',
          description: 'Check API health status',
          requestBody: null,
          response: `{
  "status": "healthy",
  "service": "SwarParikshan Audio Deepfake Detection"
}`,
          color: 'purple'
        }
      ].map((api, index) => (
        <div key={index} className="bg-navy-700 p-6 rounded-lg border-l-4 border-accent-blue">
          <div className="flex items-center space-x-3 mb-3">
            <span className={`px-3 py-1 rounded font-bold text-sm ${
              api.method === 'POST' ? 'bg-green-500' :
              api.method === 'GET' ? 'bg-blue-500' :
              'bg-purple-500'
            }`}>
              {api.method}
            </span>
            <code className="text-accent-blue font-mono">{api.endpoint}</code>
          </div>
          
          <p className="text-gray-300 mb-4">{api.description}</p>
          
          {api.requestBody && (
            <div className="mb-4">
              <h5 className="font-semibold mb-2 text-sm text-gray-400">Request Body:</h5>
              <pre className="bg-navy-900 p-4 rounded text-sm text-gray-300 overflow-x-auto">
                {api.requestBody}
              </pre>
            </div>
          )}
          
          <div>
            <h5 className="font-semibold mb-2 text-sm text-gray-400">Response:</h5>
            <pre className="bg-navy-900 p-4 rounded text-sm text-gray-300 overflow-x-auto">
              {api.response}
            </pre>
          </div>
        </div>
      ))}
    </section>
    
    <section className="bg-blue-500/10 p-6 rounded-lg border border-blue-500/30">
      <h3 className="text-xl font-bold mb-4">Integration Example</h3>
      <div className="bg-navy-900 p-4 rounded">
        <pre className="text-sm text-gray-300 overflow-x-auto"><code>{`// JavaScript/Node.js Example
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const analyzeAudio = async (audioFilePath) => {
  const formData = new FormData();
  formData.append('audio', fs.createReadStream(audioFilePath));
  
  try {
    const response = await axios.post(
      'http://localhost:8081/api/analyze',
      formData,
      {
        headers: formData.getHeaders()
      }
    );
    
    console.log('Prediction:', response.data.prediction);
    console.log('Confidence:', response.data.confidence + '%');
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Usage
analyzeAudio('./audio/sample.wav');`}</code></pre>
      </div>
    </section>
  </div>
)

// FAQ Content
const FAQContent = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold mb-6 text-accent-blue">Frequently Asked Questions</h2>
    
    {[
      {
        question: 'What is SwarParikshan?',
        answer: 'SwarParikshan is an AI-powered audio deepfake detection platform that uses advanced deep learning to identify synthetic or manipulated audio. It analyzes audio files and provides a confidence score indicating whether the audio is real or AI-generated.'
      },
      {
        question: 'How accurate is the detection?',
        answer: 'Our CNN-BiLSTM-Attention model achieves approximately 98.4% accuracy on validation datasets. However, accuracy can vary depending on the quality of the audio, type of synthesis method used, and other factors. We provide confidence scores with each prediction to indicate certainty.'
      },
      {
        question: 'What audio formats are supported?',
        answer: 'We support WAV, MP3, FLAC, OGG, and M4A formats. Maximum file size is 50MB. For best results, use clear audio with minimal background noise and a duration of 2-10 seconds.'
      },
      {
        question: 'How long does analysis take?',
        answer: 'Analysis typically takes 2-5 seconds depending on file size and server load. This includes upload time, feature extraction, model inference, and result generation.'
      },
      {
        question: 'Do you store my audio files?',
        answer: 'No. Audio files are processed in memory and immediately deleted after analysis. We only store the analysis results (prediction, confidence scores, and metadata) in our database for history tracking.'
      },
      {
        question: 'Can I integrate this into my application?',
        answer: 'Yes! SwarParikshan provides a REST API that you can integrate into any application. See the API Reference tab for detailed documentation and code examples.'
      },
      {
        question: 'What types of deepfakes can it detect?',
        answer: 'Our model is trained to detect various types of audio synthesis including Text-to-Speech (TTS), voice conversion, voice cloning, and replay attacks. It can identify artifacts from popular synthesis methods like Tacotron, WaveNet, and various GANs.'
      },
      {
        question: 'Does it work on all languages?',
        answer: 'Yes. Our model is language-agnostic and analyzes acoustic properties rather than linguistic content. It works across 80+ languages and various accents, dialects, and recording conditions.'
      },
      {
        question: 'What is the difference between Real and AI-Generated?',
        answer: '"Real" means the audio appears to be genuinely recorded from a human voice without synthetic manipulation. "AI-Generated" indicates the audio shows characteristics of artificial synthesis or voice cloning technology.'
      },
      {
        question: 'Can it detect partially manipulated audio?',
        answer: 'The model analyzes the entire audio sample as a whole. If any portion contains synthetic elements, it may affect the overall prediction. For splice detection or segment-level analysis, specialized techniques would be needed.'
      },
      {
        question: 'What should I do if I get unexpected results?',
        answer: 'Consider these factors: (1) Audio quality - background noise can affect results, (2) Recording conditions - phone vs. studio quality, (3) Audio duration - very short clips (<1s) may be less accurate, (4) Confidence score - lower confidence indicates uncertainty.'
      },
      {
        question: 'Is GPU required for the model?',
        answer: 'No, the model works on CPU. GPU acceleration provides faster inference (~100-300ms vs ~1-3s on CPU), but is not required for functionality.'
      },
      {
        question: 'How can I improve detection accuracy?',
        answer: 'Use high-quality audio (≥16kHz sample rate), ensure clean recordings with minimal noise, provide sufficient duration (2-10 seconds), and avoid heavily compressed or degraded audio files.'
      },
      {
        question: 'What are the attention weights?',
        answer: 'Attention weights show which parts of the audio the model focused on when making its decision. High attention regions often contain the most discriminative features for deepfake detection.'
      },
      {
        question: 'Can I use this for commercial purposes?',
        answer: 'Please review the license terms. The application is provided for research and educational purposes. For commercial licensing, contact the developers.'
      }
    ].map((faq, index) => (
      <div key={index} className="bg-navy-700 p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-3 text-accent-blue">{faq.question}</h3>
        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
      </div>
    ))}
    
    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-lg border border-blue-500/30 text-center">
      <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
      <p className="text-gray-400 mb-4">
        Check our comprehensive documentation or reach out to our support team
      </p>
      <button className="btn-primary">
        Contact Support
      </button>
    </div>
  </div>
)

export default DocsPage
