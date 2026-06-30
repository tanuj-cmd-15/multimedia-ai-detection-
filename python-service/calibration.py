"""
Confidence Calibration Module
Implements temperature scaling and Platt scaling for reliable confidence scores
"""

import numpy as np
import torch
import torch.nn as nn
from scipy.optimize import minimize
import json
import os
from typing import Tuple, Optional

class TemperatureScaling(nn.Module):
    """
    Temperature Scaling for confidence calibration
    Learns a single scalar parameter T to scale logits: softmax(logits/T)
    """
    def __init__(self):
        super(TemperatureScaling, self).__init__()
        self.temperature = nn.Parameter(torch.ones(1) * 1.5)
    
    def forward(self, logits):
        """
        Scale logits by temperature
        
        Args:
            logits: Model output logits (before softmax)
        
        Returns:
            Calibrated probabilities
        """
        temperature = self.temperature.unsqueeze(1).expand(logits.size(0), logits.size(1))
        return torch.softmax(logits / temperature, dim=1)
    
    def fit(self, logits, labels, max_iter=50, lr=0.01):
        """
        Optimize temperature parameter on validation set
        
        Args:
            logits: Validation set logits
            labels: True labels
            max_iter: Maximum optimization iterations
            lr: Learning rate
        """
        nll_criterion = nn.CrossEntropyLoss()
        optimizer = torch.optim.LBFGS([self.temperature], lr=lr, max_iter=max_iter)
        
        def eval():
            optimizer.zero_grad()
            loss = nll_criterion(self.forward(logits), labels)
            loss.backward()
            return loss
        
        optimizer.step(eval)

class PlattScaling:
