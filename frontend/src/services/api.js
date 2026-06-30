import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get machine ID from localStorage
const getMachineId = () => {
  let machineId = localStorage.getItem('swarparikshan_machine_id')
  if (!machineId) {
    machineId = 'machine_' + Math.random().toString(36).substring(2, 15) + Date.now()
    localStorage.setItem('swarparikshan_machine_id', machineId)
  }
  return machineId
}

// Get user from localStorage
const getUser = () => {
  const userStr = localStorage.getItem('swarparikshan_user')
  return userStr ? JSON.parse(userStr) : null
}

export const analyzeAudio = async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);
  
  const user = getUser()
  const headers = {
    'Content-Type': 'multipart/form-data',
  }
  
  if (user) {
    if (user.apiKey) {
      headers['X-API-Key'] = user.apiKey
    } else {
      headers['X-User-Email'] = user.email
    }
  } else {
    headers['X-Machine-Id'] = getMachineId()
  }
  
  const response = await api.post('/analyze', formData, { headers });
  return response.data;
};

export const getRecentAnalyses = async () => {
  const user = getUser()
  const headers = {}
  
  if (user && user.email) {
    headers['X-User-Email'] = user.email
  }
  
  const response = await api.get('/analyses/recent', { headers });
  return response.data;
};

export const getAllAnalyses = async () => {
  const user = getUser()
  const headers = {}
  
  if (user && user.email) {
    headers['X-User-Email'] = user.email
  }
  
  const response = await api.get('/analyses', { headers });
  return response.data;
};

export const getAnalysisById = async (id) => {
  const response = await api.get(`/analyses/${id}`);
  return response.data;
};

export const getUsageLimit = async () => {
  const user = getUser()
  const headers = {}
  
  if (user && user.email) {
    headers['X-User-Email'] = user.email
  } else {
    headers['X-Machine-Id'] = getMachineId()
  }
  
  const response = await api.get('/usage-limit', { headers });
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Auth endpoints
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const regenerateApiKey = async (userId) => {
  const response = await api.post(`/auth/regenerate-api-key/${userId}`);
  return response.data;
};

export default api;
