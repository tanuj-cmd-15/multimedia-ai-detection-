import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { HiUpload, HiX, HiCheckCircle, HiXCircle, HiInformationCircle } from 'react-icons/hi'
import { analyzeAudio } from '../services/api'
import ResultCard from '../components/ResultCard'

const DetectionPage = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setResult(null)
      setError(null)
    }
  }, [])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.wav', '.mp3', '.flac', '.ogg', '.m4a']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024 // 50MB
  })
  
  const handleAnalyze = async () => {
    if (!file) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await analyzeAudio(file)
      
      // Check if response contains demo_remaining (for non-authenticated users)
      if (response.demo_remaining !== undefined) {
        setResult(response.analysis)
        if (response.demo_remaining === 0) {
          setError(`Demo limit reached! You have used all 3 free detections. Please login or register to continue.`)
        } else if (response.demo_remaining <= 1) {
          setError(`Warning: ${response.demo_remaining} free detection${response.demo_remaining > 1 ? 's' : ''} remaining. Login for unlimited access!`)
        }
      } else {
        setResult(response)
      }
    } catch (err) {
      if (err.response?.data?.limit_exceeded) {
        setError(`Demo limit exceeded! You've used all 3 free detections. Please login or register for unlimited access.`)
      } else {
        setError(err.response?.data?.error || 'Failed to analyze audio. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            Audio <span className="gradient-text">Deepfake Detection</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload an audio file to analyze if it's real or AI-generated using our advanced deep learning model
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="card-dark p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <HiUpload className="mr-3 text-accent-blue" />
                Upload Audio
              </h2>
              
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-accent-blue bg-blue-500/10'
                    : 'border-navy-700 hover:border-accent-blue hover:bg-navy-700/50'
                }`}
              >
                <input {...getInputProps()} />
                <HiUpload className="text-6xl text-accent-blue mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-lg">Drop the audio file here...</p>
                ) : (
                  <div>
                    <p className="text-lg mb-2">
                      Drag & drop an audio file here, or click to select
                    </p>
                    <p className="text-sm text-gray-400">
                      Supported formats: WAV, MP3, FLAC, OGG, M4A (Max 50MB)
                    </p>
                  </div>
                )}
              </div>
              
              {/* Selected File */}
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-navy-700 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <HiCheckCircle className="text-accent-green text-2xl" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <HiX className="text-2xl" />
                  </button>
                </motion.div>
              )}
              
              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className={`w-full mt-6 py-4 rounded-lg font-bold text-lg transition-all ${
                  !file || loading
                    ? 'bg-navy-700 text-gray-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Audio'
                )}
              </button>
              
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start space-x-3"
                >
                  <HiXCircle className="text-accent-red text-2xl flex-shrink-0 mt-0.5" />
                  <p className="text-red-400">{error}</p>
                </motion.div>
              )}
              
              {/* Info */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <HiInformationCircle className="text-accent-blue text-2xl flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-semibold mb-2">How it works:</p>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Upload an audio file (max 50MB)</li>
                      <li>• Our advanced deep learning model analyzes the audio</li>
                      <li>• Get real-time results with confidence scores</li>
                      <li>• View detailed feature analysis and attention heatmaps</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Result Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {result ? (
              <ResultCard result={result} onReset={handleReset} />
            ) : (
              <div className="card-dark p-8 h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <HiInformationCircle className="text-6xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    Upload and analyze an audio file to see results here
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DetectionPage
