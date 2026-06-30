#!/usr/bin/env python
# coding: utf-8

"""
╔══════════════════════════════════════════════════════════════════╗
║  AI-Generated Image Detection - Model Inference Service         ║
║  ResNet-18 Classification with GradCAM - REST API               ║
╚══════════════════════════════════════════════════════════════════╝
"""

import os
import torch
import torch.nn as nn
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from torchvision import models, transforms
from PIL import Image
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
import tempfile
import base64
from io import BytesIO
import warnings
warnings.filterwarnings('ignore')

# ══════════════════════════════════════════════════════════════════
#  CONFIGURATION
# ══════════════════════════════════════════════════════════════════

MODEL_PATH = r'D:\Tushar\Application\AI-Generated-Image-Detector\best_model.pth'

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# ══════════════════════════════════════════════════════════════════
#  IMAGE TRANSFORM
# ══════════════════════════════════════════════════════════════════

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# ══════════════════════════════════════════════════════════════════
#  LOAD MODEL
# ══════════════════════════════════════════════════════════════════

print('='*80)
print('  AI-GENERATED IMAGE DETECTION - MODEL INFERENCE SERVICE')
print('='*80)
print(f'\nDevice: {device}')
print(f'Model Path: {MODEL_PATH}')

if not os.path.exists(MODEL_PATH):
    print(f'\n❌ ERROR: Model not found at {MODEL_PATH}')
    exit(1)

# Load ResNet-18 model
model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, 2)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

print('✅ Model loaded successfully!')

# ══════════════════════════════════════════════════════════════════
#  FLASK API
# ══════════════════════════════════════════════════════════════════

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': True,
        'device': str(device),
        'model_architecture': 'ResNet-18'
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        image_file = request.files['image']
        
        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            image_file.save(temp_file.name)
            temp_path = temp_file.name
        
        # Load and preprocess image
        image = Image.open(temp_path).convert('RGB')
        original_size = image.size
        
        input_tensor = transform(image).unsqueeze(0).to(device)
        
        # Label mapping
        label_map = {0: 'AI-GENERATED', 1: 'REAL'}
        
        # Model inference
        with torch.no_grad():
            outputs = model(input_tensor)
            probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]
        
        pred = int(np.argmax(probs))
        final_label = label_map[pred]
        confidence = float(np.max(probs)) * 100
        
        # Generate Grad-CAM visualization
        target_layers = [model.layer4[-1]]
        cam = GradCAM(model=model, target_layers=target_layers)
        targets = [ClassifierOutputTarget(pred)]
        grayscale_cam = cam(input_tensor=input_tensor, targets=targets)[0]
        
        # Create heatmap
        img_np = np.array(image.resize((224, 224)), dtype=np.float32) / 255.0
        visualization = show_cam_on_image(img_np, grayscale_cam, use_rgb=True)
        
        # Convert heatmap to base64
        vis_image = Image.fromarray(visualization)
        buffered = BytesIO()
        vis_image.save(buffered, format="PNG")
        heatmap_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        # Clean up temp file
        os.remove(temp_path)
        
        # Prepare response
        response = {
            'prediction': final_label,
            'confidence': round(confidence, 2),
            'scores': {
                'real': round(float(probs[1] * 100), 2),
                'fake': round(float(probs[0] * 100), 2)
            },
            'image_info': {
                'width': original_size[0],
                'height': original_size[1],
                'format': image.format or 'Unknown'
            },
            'heatmap': heatmap_base64,
            'model_info': {
                'architecture': 'ResNet-18',
                'input_size': '224x224',
                'num_classes': 2
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print('\n'+'='*80)
    print('  Starting Flask API Server')
    print('='*80)
    print('\n  API Endpoints:')
    print('    GET  /health  - Health check')
    print('    POST /predict - AI-generated image detection')
    print('\n')
    app.run(host='0.0.0.0', port=5001, debug=False)
