#!/usr/bin/env python
# coding: utf-8

"""
╔══════════════════════════════════════════════════════════════════╗
║  Audio Deepfake Detection - Model Inference Service             ║
║  CNN-BiLSTM-Attention Model - REST API                          ║
╚══════════════════════════════════════════════════════════════════╝
"""

import os
import sys
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import librosa
from scipy.fftpack import dct
from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import tempfile
import warnings
warnings.filterwarnings('ignore')

# ══════════════════════════════════════════════════════════════════
#  CONFIGURATION
# ══════════════════════════════════════════════════════════════════

CHECKPOINT_PATH = r'D:\Tushar\Application\cnnbilstem\outputs\checkpoints\ckpt_best.pth'

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# ══════════════════════════════════════════════════════════════════
#  MODEL ARCHITECTURE
# ══════════════════════════════════════════════════════════════════

class CNNBlock(nn.Module):
    def __init__(self, in_ch, out_ch, kernel=3, stride=1, pad=1, pool_freq=True):
        super().__init__()
        self.conv = nn.Conv2d(in_ch, out_ch, kernel, stride=stride, padding=pad, bias=False)
        self.bn = nn.BatchNorm2d(out_ch)
        self.act = nn.GELU()
        self.pool = nn.MaxPool2d(kernel_size=(2, 1), stride=(2, 1)) if pool_freq else nn.Identity()
    
    def forward(self, x):
        return self.pool(self.act(self.bn(self.conv(x))))

class MultiHeadAttention(nn.Module):
    def __init__(self, embed_dim: int, num_heads: int, dropout: float = 0.1):
        super().__init__()
        self.attn = nn.MultiheadAttention(embed_dim, num_heads, dropout=dropout, batch_first=True)
        self.norm = nn.LayerNorm(embed_dim)
        self.drop = nn.Dropout(dropout)
    
    def forward(self, x):
        attn_out, attn_weights = self.attn(x, x, x)
        x = self.norm(x + self.drop(attn_out))
        return x, attn_weights

class CNNBiLSTMAttention(nn.Module):
    def __init__(self, cfg: dict):
        super().__init__()
        C = cfg
        chs = C['cnn_channels']
        self.n_mels = C['n_mels']
        
        cnn_layers = []
        for i in range(len(chs) - 1):
            pool = (i < len(chs) - 2)
            cnn_layers.append(CNNBlock(chs[i], chs[i + 1], pool_freq=pool))
        self.cnn = nn.Sequential(*cnn_layers)
        self.freq_pool = nn.AdaptiveAvgPool2d((4, None))
        
        lstm_in = chs[-1] * 4
        lstm_hid = C['lstm_hidden']
        lstm_out = lstm_hid * 2
        
        self.lstm = nn.LSTM(
            input_size=lstm_in, hidden_size=lstm_hid,
            num_layers=C['lstm_layers'], batch_first=True,
            bidirectional=True,
            dropout=C['lstm_dropout'] if C['lstm_layers'] > 1 else 0.0,
        )
        
        self.attn = MultiHeadAttention(embed_dim=lstm_out, num_heads=C['attn_heads'], dropout=0.1)
        self.query = nn.Linear(lstm_out, 1)
        
        drop = C['dropout']
        self.head = nn.Sequential(
            nn.LayerNorm(lstm_out),
            nn.Dropout(drop),
            nn.Linear(lstm_out, lstm_out // 2),
            nn.GELU(),
            nn.Dropout(drop * 0.75),
            nn.Linear(lstm_out // 2, C['num_classes']),
        )
    
    def forward(self, x: torch.Tensor) -> dict:
        B = x.size(0)
        x = self.cnn(x)
        x = self.freq_pool(x)
        B, C, F, T = x.shape
        x = x.permute(0, 3, 1, 2)
        x = x.contiguous().view(B, T, C * F)
        x, _ = self.lstm(x)
        x, attn_w = self.attn(x)
        scores = self.query(x).squeeze(-1)
        weights = torch.softmax(scores, dim=-1)
        emb = (weights.unsqueeze(-1) * x).sum(dim=1)
        logits = self.head(emb)
        
        return {
            'logits': logits,
            'embedding': emb,
            'attn_weights': attn_w,
            'time_weights': weights,
        }

# ══════════════════════════════════════════════════════════════════
#  FEATURE EXTRACTION
# ══════════════════════════════════════════════════════════════════

def build_linear_filterbank(sr: int, n_fft: int, n_filters: int) -> np.ndarray:
    freqs = np.linspace(0, sr / 2.0, n_fft // 2 + 1)
    filter_freqs = np.linspace(0, sr / 2.0, n_filters + 2)
    filters = np.zeros((n_filters, n_fft // 2 + 1), dtype=np.float32)
    for i in range(n_filters):
        f_lo = filter_freqs[i]
        f_mid = filter_freqs[i + 1]
        f_hi = filter_freqs[i + 2]
        up = (freqs - f_lo) / (f_mid - f_lo + 1e-12)
        down = (f_hi - freqs) / (f_hi - f_mid + 1e-12)
        filters[i] = np.maximum(0.0, np.minimum(up, down))
    return filters

def compute_lfcc(wav: np.ndarray, cfg: dict, linear_fb: np.ndarray) -> np.ndarray:
    power_spec = np.abs(librosa.stft(wav, n_fft=cfg['n_fft'], 
                                      hop_length=cfg['hop_length'],
                                      win_length=cfg['win_length'])) ** 2
    linear_spec = linear_fb @ power_spec
    linear_spec = np.maximum(linear_spec, 1e-9)
    log_spec = np.log(linear_spec)
    lfcc = dct(log_spec, type=2, axis=0, norm='ortho')[:cfg['n_lfcc']]
    return lfcc.astype(np.float32)

def compute_mel(wav: np.ndarray, cfg: dict) -> np.ndarray:
    mel = librosa.feature.melspectrogram(
        y=wav, sr=cfg['sample_rate'], n_fft=cfg['n_fft'],
        hop_length=cfg['hop_length'], win_length=cfg['win_length'],
        n_mels=cfg['n_mels'], fmin=cfg['fmin'], fmax=cfg['fmax'],
    )
    log_mel = librosa.power_to_db(mel, ref=np.max)
    return log_mel.astype(np.float32)

def compute_deltas(feat: np.ndarray, width: int = 9) -> tuple:
    delta = librosa.feature.delta(feat, width=width, order=1)
    delta2 = librosa.feature.delta(feat, width=width, order=2)
    return delta.astype(np.float32), delta2.astype(np.float32)

def _norm(x: np.ndarray) -> np.ndarray:
    mn, mx = x.min(), x.max()
    return ((x - mn) / (mx - mn + 1e-9)).astype(np.float32)

def extract_features(wav: np.ndarray, cfg: dict, target_T: int, linear_fb: np.ndarray) -> np.ndarray:
    mel = compute_mel(wav, cfg)
    d_mel, dd_mel = compute_deltas(mel, cfg['delta_width'])
    
    lfcc = compute_lfcc(wav, cfg, linear_fb)
    d_lfcc, dd_lfcc = compute_deltas(lfcc, cfg['delta_width'])
    
    def resize_freq(feat, target_h):
        if feat.shape[0] == target_h:
            return feat
        out = np.zeros((target_h, feat.shape[1]), dtype=np.float32)
        for t in range(feat.shape[1]):
            out[:, t] = np.interp(
                np.linspace(0, feat.shape[0] - 1, target_h),
                np.arange(feat.shape[0]),
                feat[:, t]
            )
        return out
    
    n_mels = cfg['n_mels']
    lfcc = resize_freq(lfcc, n_mels)
    d_lfcc = resize_freq(d_lfcc, n_mels)
    dd_lfcc = resize_freq(dd_lfcc, n_mels)
    
    channels = [_norm(mel), _norm(d_mel), _norm(dd_mel),
                _norm(lfcc), _norm(d_lfcc), _norm(dd_lfcc)]
    
    def resize_time(feat, target_t):
        T = feat.shape[1]
        if T == target_t:
            return feat
        elif T < target_t:
            pad = target_t - T
            return np.pad(feat, ((0, 0), (0, pad)), mode='edge')
        else:
            return feat[:, :target_t]
    
    channels = [resize_time(c, target_T) for c in channels]
    return np.stack(channels, axis=0)

# ══════════════════════════════════════════════════════════════════
#  LOAD MODEL
# ══════════════════════════════════════════════════════════════════

print('='*80)
print('  AUDIO DEEPFAKE DETECTION - MODEL INFERENCE SERVICE')
print('='*80)
print(f'\nDevice: {device}')
print(f'Checkpoint: {CHECKPOINT_PATH}')

if not os.path.exists(CHECKPOINT_PATH):
    print(f'\n❌ ERROR: Checkpoint not found at {CHECKPOINT_PATH}')
    sys.exit(1)

checkpoint = torch.load(CHECKPOINT_PATH, map_location=device, weights_only=False)
CONFIG = checkpoint['config']

print(f'\nModel Info:')
print(f'  Epoch: {checkpoint["epoch"]}')
print(f'  Val EER: {checkpoint.get("val_eer", "N/A"):.2f}%')
print(f'  Val Accuracy: {checkpoint.get("val_acc", "N/A"):.2f}%')

LINEAR_FB = build_linear_filterbank(CONFIG['sample_rate'], CONFIG['n_fft'], 
                                     CONFIG['n_linear_filters'])

model = CNNBiLSTMAttention(CONFIG).to(device)
model.load_state_dict(checkpoint['model_state'])
model.eval()

print('✅ Model loaded successfully!')

# ══════════════════════════════════════════════════════════════════
#  SUSPICIOUS REGIONS DETECTION
# ══════════════════════════════════════════════════════════════════

def detect_suspicious_regions(time_weights: np.ndarray, duration: float, cfg: dict) -> list:
    """
    Detect suspicious regions in audio based on attention patterns.
    High attention peaks may indicate manipulated or synthetic segments.
    """
    # Calculate statistics
    mean_weight = np.mean(time_weights)
    std_weight = np.std(time_weights)
    threshold = mean_weight + 1.5 * std_weight  # Regions significantly above average
    
    # Find peaks (suspicious regions)
    suspicious_indices = np.where(time_weights > threshold)[0]
    
    if len(suspicious_indices) == 0:
        return []
    
    # Group consecutive indices into regions
    regions = []
    start_idx = suspicious_indices[0]
    end_idx = start_idx
    
    for i in range(1, len(suspicious_indices)):
        if suspicious_indices[i] == end_idx + 1:
            end_idx = suspicious_indices[i]
        else:
            # Save current region
            start_time = (start_idx / len(time_weights)) * duration
            end_time = ((end_idx + 1) / len(time_weights)) * duration
            intensity = float(np.mean(time_weights[start_idx:end_idx+1]))
            
            regions.append({
                'start_time': round(start_time, 2),
                'end_time': round(end_time, 2),
                'intensity': round(intensity, 4),
                'suspicion_level': 'high' if intensity > threshold + std_weight else 'medium'
            })
            
            start_idx = suspicious_indices[i]
            end_idx = start_idx
    
    # Add last region
    start_time = (start_idx / len(time_weights)) * duration
    end_time = ((end_idx + 1) / len(time_weights)) * duration
    intensity = float(np.mean(time_weights[start_idx:end_idx+1]))
    
    regions.append({
        'start_time': round(start_time, 2),
        'end_time': round(end_time, 2),
        'intensity': round(intensity, 4),
        'suspicion_level': 'high' if intensity > threshold + std_weight else 'medium'
    })
    
    return regions

def prepare_attention_data(time_weights: np.ndarray, duration: float) -> list:
    """
    Prepare attention weights for frontend visualization.
    Downsample to ~100 points for efficient rendering.
    """
    target_points = min(100, len(time_weights))
    
    if len(time_weights) <= target_points:
        # Use all points
        indices = np.arange(len(time_weights))
    else:
        # Downsample
        indices = np.linspace(0, len(time_weights) - 1, target_points, dtype=int)
    
    attention_data = []
    for idx in indices:
        time = (idx / len(time_weights)) * duration
        weight = float(time_weights[idx])
        attention_data.append({
            'time': round(time, 2),
            'weight': round(weight, 4)
        })
    
    return attention_data

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
        'model_accuracy': f"{checkpoint.get('val_acc', 0):.2f}%"
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        # Save temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            audio_file.save(temp_file.name)
            temp_path = temp_file.name
        
        # Load audio
        wav_full, sr = librosa.load(temp_path, sr=CONFIG['sample_rate'], mono=True)
        original_duration = len(wav_full) / sr
        
        # Check duration limits (max 10 minutes)
        MAX_DURATION_MINUTES = 10
        if original_duration > MAX_DURATION_MINUTES * 60:
            os.remove(temp_path)
            return jsonify({
                'error': f'Audio file too long. Maximum duration is {MAX_DURATION_MINUTES} minutes.'
            }), 400
        
        # For audio > 4 seconds, use sliding window approach
        if original_duration > 4.0:
            results = process_long_audio(wav_full, sr, CONFIG, LINEAR_FB)
        else:
            # Process short audio normally
            max_len = int(CONFIG['max_duration'] * CONFIG['sample_rate'])
            target_T = max_len // CONFIG['hop_length']
            
            wav = wav_full.copy()
            if len(wav) < max_len:
                wav = np.pad(wav, (0, max_len - len(wav)))
            else:
                start = (len(wav) - max_len) // 2
                wav = wav[start: start + max_len]
            
            features = extract_features(wav, CONFIG, target_T, LINEAR_FB)
            feat_tensor = torch.tensor(features, dtype=torch.float32).unsqueeze(0).to(device)
            
            with torch.no_grad():
                output = model(feat_tensor)
            
            logits = output['logits'].cpu().numpy()[0]
            probs = F.softmax(output['logits'], dim=-1).cpu().numpy()[0]
            prediction = int(np.argmax(probs))
            confidence = float(probs[prediction]) * 100
            time_weights = output['time_weights'].cpu().numpy()[0]
            
            results = {
                'prediction': prediction,
                'probs': probs,
                'time_weights': time_weights,
                'duration': original_duration
            }
        
        # Clean up temp file
        os.remove(temp_path)
        
        # Prepare response
        label_map = {0: 'REAL', 1: 'AI-GENERATED'}
        prediction_label = label_map[results['prediction']]
        confidence = float(results['probs'][results['prediction']]) * 100
        
        # Feature statistics
        mel_spec = compute_mel(wav_full, CONFIG)
        mel_mean = float(np.mean(mel_spec))
        mel_std = float(np.std(mel_spec))
        
        attention_peak = int(np.argmax(results['time_weights']))
        attention_concentration = float(np.std(results['time_weights']))
        
        # Detect suspicious regions
        suspicious_regions = detect_suspicious_regions(results['time_weights'], results['duration'], CONFIG)
        
        # Prepare attention weights for visualization
        attention_weights_data = prepare_attention_data(results['time_weights'], results['duration'])
        
        response = {
            'prediction': prediction_label,
            'confidence': round(confidence, 2),
            'scores': {
                'real': round(float(results['probs'][0] * 100), 2),
                'fake': round(float(results['probs'][1] * 100), 2)
            },
            'audio_info': {
                'duration': round(results['duration'], 2),
                'sample_rate': int(sr)
            },
            'features': {
                'mel_mean': round(mel_mean, 4),
                'mel_std': round(mel_std, 4),
                'attention_peak_frame': attention_peak,
                'attention_concentration': round(attention_concentration, 4)
            },
            'model_info': {
                'architecture': 'CNN-BiLSTM-Attention',
                'validation_eer': f"{checkpoint.get('val_eer', 0):.2f}%",
                'validation_accuracy': f"{checkpoint.get('val_acc', 0):.2f}%"
            },
            'suspicious_regions': suspicious_regions,
            'attention_weights': attention_weights_data
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def process_long_audio(wav: np.ndarray, sr: int, cfg: dict, linear_fb: np.ndarray) -> dict:
    """
    Process long audio files (> 4 seconds) using sliding window approach.
    Detect suspicious regions across the entire audio.
    """
    duration = len(wav) / sr
    window_size = int(cfg['max_duration'] * sr)  # 4 seconds
    hop_size = int(window_size * 0.5)  # 50% overlap
    target_T = window_size // cfg['hop_length']
    
    predictions = []
    all_probs = []
    time_weights_list = []
    
    # Process audio in windows
    start_idx = 0
    while start_idx < len(wav):
        end_idx = min(start_idx + window_size, len(wav))
        window = wav[start_idx:end_idx]
        
        # Pad if needed
        if len(window) < window_size:
            window = np.pad(window, (0, window_size - len(window)))
        
        # Extract features and predict
        features = extract_features(window, cfg, target_T, linear_fb)
        feat_tensor = torch.tensor(features, dtype=torch.float32).unsqueeze(0).to(device)
        
        with torch.no_grad():
            output = model(feat_tensor)
        
        logits = output['logits'].cpu().numpy()[0]
        probs = F.softmax(output['logits'], dim=-1).cpu().numpy()[0]
        time_weights = output['time_weights'].cpu().numpy()[0]
        
        predictions.append(int(np.argmax(probs)))
        all_probs.append(probs)
        time_weights_list.append(time_weights)
        
        start_idx += hop_size
        
        # Stop if we've covered the audio
        if end_idx >= len(wav):
            break
    
    # Aggregate results
    avg_probs = np.mean(all_probs, axis=0)
    final_prediction = int(np.argmax(avg_probs))
    
    # Combine time weights (map back to original duration)
    combined_time_weights = np.zeros(int(duration * sr / cfg['hop_length']))
    weight_counts = np.zeros_like(combined_time_weights)
    
    start_frame = 0
    hop_frames = hop_size // cfg['hop_length']
    for weights in time_weights_list:
        end_frame = min(start_frame + len(weights), len(combined_time_weights))
        actual_len = end_frame - start_frame
        combined_time_weights[start_frame:end_frame] += weights[:actual_len]
        weight_counts[start_frame:end_frame] += 1
        start_frame += hop_frames
    
    # Average overlapping regions
    combined_time_weights = np.divide(
        combined_time_weights, 
        weight_counts,
        where=weight_counts > 0
    )
    
    # Normalize
    if combined_time_weights.sum() > 0:
        combined_time_weights = combined_time_weights / combined_time_weights.sum()
    
    return {
        'prediction': final_prediction,
        'probs': avg_probs,
        'time_weights': combined_time_weights,
        'duration': duration,
        'num_windows': len(predictions)
    }

if __name__ == '__main__':
    print('\n'+'='*80)
    print('  Starting Flask API Server')
    print('='*80)
    print('\n  API Endpoints:')
    print('    GET  /health  - Health check')
    print('    POST /predict - Audio deepfake detection')
    print('\n')
    app.run(host='0.0.0.0', port=5000, debug=False)
