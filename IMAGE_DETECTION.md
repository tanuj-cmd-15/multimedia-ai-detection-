# 🖼️ AI-Generated Image Detection

## Overview

SwarParikshan includes a powerful AI-generated image detection module powered by ResNet-18 architecture with Grad-CAM explainability. This module can identify whether an image is real (camera-captured) or AI-generated (synthetic).

---

## 🎯 Features

### Detection Capabilities
- **Binary Classification**: Distinguishes between real and AI-generated images
- **High Confidence Scoring**: Provides percentage confidence for predictions
- **Multiple Format Support**: JPG, JPEG, PNG images up to 10MB
- **Fast Inference**: Real-time processing on both CPU and GPU

### Explainable AI
- **Grad-CAM Visualization**: Generates heatmap showing decision-making regions
- **Visual Transparency**: Highlights areas that most influenced the model's prediction
- **Intuitive Display**: Red/yellow regions indicate high contribution, blue indicates low contribution

---

## 🏗️ Architecture

### Model: ResNet-18

ResNet-18 (Residual Network with 18 layers) is a convolutional neural network architecture that uses skip connections to enable training of very deep networks.

```
Input Image (224x224x3)
    ↓
Conv1 + BN + ReLU + MaxPool
    ↓
Residual Block 1 (64 channels)
    ↓
Residual Block 2 (128 channels)
    ↓
Residual Block 3 (256 channels)
    ↓
Residual Block 4 (512 channels)
    ↓
Global Average Pooling
    ↓
Fully Connected Layer (2 classes)
    ↓
Softmax → [Real, AI-Generated]
```

### Why ResNet-18?

1. **Residual Connections**: Skip connections help preserve gradient flow
2. **Efficient**: Fewer parameters than deeper ResNets while maintaining accuracy
3. **Transfer Learning**: Pre-trained on ImageNet, fine-tuned for deepfake detection
4. **Proven Track Record**: Widely used in computer vision tasks

---

## 🔬 Grad-CAM Visualization

### What is Grad-CAM?

**Gradient-weighted Class Activation Mapping (Grad-CAM)** is an explainable AI technique that produces visual explanations for decisions from CNN-based models.

### How It Works

1. **Forward Pass**: Input image processed through the network
2. **Target Layer**: Activations captured from last convolutional layer (layer4)
3. **Gradients**: Computed with respect to target class
4. **Weights**: Gradients averaged to get importance weights
5. **Heatmap**: Weighted combination of feature maps
6. **Overlay**: Heatmap superimposed on original image

### Interpreting Heatmaps

- **Red/Yellow Regions**: High contribution to prediction (model focused here)
- **Green Regions**: Medium contribution
- **Blue Regions**: Low contribution (less relevant for decision)
- **Spatial Patterns**: Shows which image areas influenced the classification

### Example Interpretations

#### Real Image Heatmap
- Uniform distribution across natural features
- Focus on textures, faces, objects
- Consistent with camera characteristics

#### AI-Generated Image Heatmap
- Focus on artifact-prone regions
- Highlights unnatural patterns
- Emphasizes GAN-specific anomalies

---

## 🚀 Usage

### Web Interface

1. Navigate to the **Image** tab in the navigation bar
2. Drag & drop an image or click to select
3. Click **"Analyze Image"** button
4. View results:
   - Prediction (REAL or AI-GENERATED)
   - Confidence score
   - Detailed probability scores
   - Grad-CAM heatmap visualization

### API Usage

#### Python Example

```python
import requests
import json

# API endpoint
url = "http://localhost:5001/predict"

# Upload image
with open("image.jpg", "rb") as f:
    files = {"image": f}
    response = requests.post(url, files=files)

# Parse response
result = response.json()
print(f"Prediction: {result['prediction']}")
print(f"Confidence: {result['confidence']}%")
print(f"\nScores:")
print(f"  Real: {result['scores']['real']}%")
print(f"  AI-Generated: {result['scores']['fake']}%")

# Image information
print(f"\nImage Info:")
print(f"  Size: {result['image_info']['width']}x{result['image_info']['height']}")
print(f"  Format: {result['image_info']['format']}")

# Save heatmap
import base64
heatmap_data = base64.b64decode(result['heatmap'])
with open("heatmap.png", "wb") as f:
    f.write(heatmap_data)
print("\nHeatmap saved to heatmap.png")
```

#### JavaScript Example

```javascript
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('http://localhost:5001/predict', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Prediction:', result.prediction);
console.log('Confidence:', result.confidence + '%');
console.log('Heatmap:', result.heatmap); // Base64 encoded
```

#### cURL Example

```bash
curl -X POST http://localhost:5001/predict \
  -F "image=@/path/to/image.jpg" \
  | jq '.'
```

---

## 📊 Response Format

### Success Response

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
  "heatmap": "iVBORw0KGgoAAAANSUhEUgAA... (base64 encoded PNG)",
  "model_info": {
    "architecture": "ResNet-18",
    "input_size": "224x224",
    "num_classes": 2
  }
}
```

### Error Response

```json
{
  "error": "No image file provided"
}
```

---

## 🔍 Detection Patterns

### What the Model Detects

#### 1. GAN Artifacts
- **Checkerboard patterns**: Common in upsampling layers
- **Color bleeding**: Unnatural color transitions
- **High-frequency noise**: Specific to generative models

#### 2. Texture Inconsistencies
- **Synthetic textures**: Unnatural fabric, skin, or material patterns
- **Repetitive patterns**: Unusual repetition in backgrounds
- **Blur anomalies**: Inconsistent depth of field

#### 3. Facial Features (if present)
- **Asymmetry issues**: Unnatural facial symmetry
- **Eye reflections**: Missing or incorrect light reflections
- **Hair details**: Synthetic-looking hair strands
- **Teeth patterns**: Unnatural tooth arrangements

#### 4. Background Analysis
- **Blurred regions**: Inconsistent background blur
- **Object placement**: Unnatural spatial relationships
- **Lighting**: Inconsistent light sources

---

## 🎓 Model Training

### Training Data Characteristics

The model was trained to recognize:
- **Real Images**: Camera-captured photos from various sources
- **AI-Generated Images**: Outputs from various GAN architectures
  - StyleGAN
  - ProGAN
  - CycleGAN
  - Other generative models

### Data Augmentation

Training included augmentation techniques:
- Random cropping and resizing
- Horizontal flipping
- Color jittering
- Random rotations
- Brightness/contrast adjustments

---

## ⚙️ Technical Details

### Model Specifications

| Parameter | Value |
|-----------|-------|
| Architecture | ResNet-18 |
| Input Size | 224 × 224 × 3 |
| Output Classes | 2 (Real, AI-Generated) |
| Parameters | ~11 million |
| Pre-training | ImageNet |
| Framework | PyTorch |

### Processing Pipeline

1. **Image Loading**: PIL opens image, converts to RGB
2. **Preprocessing**: Resize to 224×224, normalize
3. **Forward Pass**: Model inference
4. **Softmax**: Convert logits to probabilities
5. **Grad-CAM**: Generate explanation heatmap
6. **Post-processing**: Overlay heatmap on original image
7. **Encoding**: Convert heatmap to base64 for API response

### Performance Considerations

#### GPU Acceleration
- Model automatically uses CUDA if available
- CPU fallback for systems without GPU
- Inference time: <1 second per image (GPU), ~3 seconds (CPU)

#### Memory Usage
- Model size: ~45 MB
- Peak memory: ~500 MB during inference
- Suitable for standard hardware

---

## 🛠️ Installation & Setup

### Prerequisites

```bash
pip install torch torchvision
pip install flask flask-cors
pip install pillow numpy
pip install pytorch-grad-cam
```

### Model File

The trained model is located at:
```
D:\Tushar\Application\AI-Generated-Image-Detector\best_model.pth
```

### Starting the Service

```bash
cd image-service
python image_inference.py
```

Service will start on `http://localhost:5001`

---

## 📈 Use Cases

### 1. Social Media Verification
- Verify authenticity of viral images
- Detect manipulated profile pictures
- Identify synthetic content in posts

### 2. News & Journalism
- Verify image sources
- Detect manipulated news photos
- Fact-checking visual content

### 3. E-commerce
- Detect fake product images
- Verify seller authenticity
- Identify stock photo manipulation

### 4. Legal & Forensics
- Authenticate evidence images
- Detect manipulated documents
- Verify identity photos

### 5. Content Moderation
- Flag synthetic content
- Detect deepfake imagery
- Maintain platform integrity

---

## ⚠️ Limitations

### Known Limitations

1. **Image Quality**: Very low-resolution images may reduce accuracy
2. **Compression**: Heavy JPEG compression can affect detection
3. **Artistic Filters**: Heavy filters may confuse the model
4. **Hybrid Images**: Part real, part synthetic may yield unclear results
5. **New GAN Architectures**: Very recent GAN models may not be recognized

### Best Practices

- Use high-quality, uncompressed images when possible
- Avoid heavily filtered or edited images
- Consider confidence scores alongside predictions
- Use Grad-CAM to understand model decisions
- Combine with human judgment for critical decisions

---

## 🔐 Security Considerations

### Data Privacy
- Images are processed in-memory
- No images are permanently stored
- Temporary files are immediately deleted after processing

### API Security
- CORS enabled for frontend integration
- File size limits prevent resource abuse
- Input validation prevents malicious uploads

---

## 🚀 Future Enhancements

### Planned Features

1. **Video Frame Analysis**: Extend to video deepfake detection
2. **Batch Processing**: Analyze multiple images simultaneously
3. **Advanced Metrics**: Additional explainability features
4. **Model Updates**: Regular retraining with new GAN architectures
5. **Multi-modal Analysis**: Combine with metadata analysis

---

## 📚 References

### Academic Papers

1. **ResNet**: [Deep Residual Learning for Image Recognition](https://arxiv.org/abs/1512.03385)
2. **Grad-CAM**: [Visual Explanations from Deep Networks via Gradient-based Localization](https://arxiv.org/abs/1610.02391)
3. **GAN Detection**: Various papers on detecting GAN-generated images

### Related Resources

- [PyTorch Documentation](https://pytorch.org/docs/)
- [Grad-CAM GitHub](https://github.com/jacobgil/pytorch-grad-cam)
- [Original Implementation](https://github.com/vivek0019/AI-Generated-Image-Detector)

---

## 📧 Support

For questions or issues related to image detection:
1. Check the [main README](README.md)
2. Review this documentation
3. Open an issue on GitHub
4. Contact the development team

---

<div align="center">

**Empowering users to identify AI-generated imagery** 🖼️

Built with PyTorch • ResNet-18 • Grad-CAM

</div>
