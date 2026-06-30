"""
Celery Tasks for Async Audio Processing
Handles large audio files (>15s) asynchronously
"""

import os
import time
from celery import Celery
from celery.utils.log import get_task_logger
import torch
import librosa
import numpy as np
from model_inference import extract_features, load_model, apply_calibration

logger = get_task_logger(__name__)

# Celery configuration
celery_app = Celery(
    'audio_tasks',
    broker=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/1'),
    backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/2')
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=600,  # 10 minutes max
    task_soft_time_limit=540,  # 9 minutes soft limit
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=50,
)

# Load model once at worker startup
model = None
device = None

@celery_app.task(bind=True, name='audio_tasks.process_audio_async')
def process_audio_async(self, audio_path, model_version='2.0.0'):
    """
    Process audio file asynchronously
    
    Args:
        audio_path: Path to audio file
        model_version: Model version for tracking
    
    Returns:
        dict: Detection results with verdict, confidence, suspicious regions
    """
    global model, device
    
    try:
        # Update task state
        self.update_state(state='PROCESSING', meta={'progress': 0, 'status': 'Loading audio'})
        
        # Load model if not loaded
