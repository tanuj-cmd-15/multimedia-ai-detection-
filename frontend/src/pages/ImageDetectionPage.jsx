import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { HiUpload, HiX, HiCheckCircle, HiXCircle, HiInformationCircle, HiPhotograph } from 'react-icons/hi'
import { analyzeImage } from '../services/api'

const ImageDetectionPage = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }
  
  const onDrop = useCallback((e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      handleFileSelect(droppedFile)
    }
  }, [])
  
  const onDragOver = (e) => {
    e.preventDefault()
  }
  
  const handleAnalyze = async () => {
    if (!file) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await analyzeImage(file)
      // If response contains analysis wrapper from backend
      const analysisData = response.analysis || response
      setResult(analysisData)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze image. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }
  
  const isReal = result?.prediction === 'REAL'
  
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
            AI-Generated <span className="gradient-text">Image Detection</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload an image to check if it's real or AI-generated using our advanced deep learning model with Grad-CAM visualization
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
                <HiPhotograph className="mr-3 text-accent-blue" />
                Upload Image
              </h2>
              
              {/* Dropzone */}
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all border-navy-700 hover:border-accent-blue hover:bg-navy-700/50"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <HiUpload className="text-6xl text-accent-blue mx-auto mb-4" />
                  <p className="text-lg mb-2">
                    Drag & drop an image here, or click to select
                  </p>
                  <p className="text-sm text-gray-400">
                    Supported formats: JPG, JPEG, PNG (Max 10MB)
                  </p>
                </label>
              </div>
              
              {/* Image Preview */}
              {preview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className="bg-navy-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
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
                    </div>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full rounded-lg"
                    />
                  </div>
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
                  'Analyze Image'
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
                      <li>• Upload an image (max 10MB)</li>
                      <li>• Advanced deep learning model analyzes the image</li>
                      <li>• Get real-time results with confidence scores</li>
                      <li>• View Grad-CAM heatmap visualization</li>
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
              <div className="card-dark p-8 space-y-6">
                {/* Prediction */}
                <div className={`p-6 rounded-lg border ${
                  isReal
                    ? 'bg-green-500/10 border-green-500/50'
                    : 'bg-red-500/10 border-red-500/50'
                }`}>
                  <div className="flex items-center space-x-4 mb-4">
                    {isReal ? (
                      <HiCheckCircle className="text-5xl text-accent-green" />
                    ) : (
                      <HiXCircle className="text-5xl text-accent-red" />
                    )}
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Prediction</p>
                      <p className={`text-3xl font-bold ${
                        isReal ? 'text-accent-green' : 'text-accent-red'
                      }`}>
                        {result.prediction}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Confidence</span>
                    <span className="text-2xl font-bold">{result.confidence}%</span>
                  </div>
                </div>
                
                {/* Scores */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold mb-3">Detailed Scores</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Real Image</span>
                      <span className="font-semibold">{result.scores.real}%</span>
                    </div>
                    <div className="w-full bg-navy-700 rounded-full h-2">
                      <div
                        className="bg-accent-green h-2 rounded-full transition-all duration-500"
                        style={{ width: `${result.scores.real}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">AI-Generated</span>
                      <span className="font-semibold">{result.scores.fake}%</span>
                    </div>
                    <div className="w-full bg-navy-700 rounded-full h-2">
                      <div
                        className="bg-accent-red h-2 rounded-full transition-all duration-500"
                        style={{ width: `${result.scores.fake}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Grad-CAM Heatmap */}
                {result.heatmap && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Grad-CAM Heatmap</h3>
                    <div className="bg-navy-700 rounded-lg p-4">
                      <img
                        src={`data:image/png;base64,${result.heatmap}`}
                        alt="Grad-CAM Heatmap"
                        className="w-full rounded-lg"
                      />
                      <p className="text-sm text-gray-400 mt-3">
                        The highlighted regions indicate areas that most influenced the model's prediction.
                        Red/Yellow = High contribution, Blue = Low contribution.
                      </p>
                    </div>
                  </div>
                )}
                

                {/* Interpretation */}
                <div className={`p-4 rounded-lg border ${
                  isReal
                    ? 'bg-green-500/10 border-green-500/50'
                    : 'bg-red-500/10 border-red-500/50'
                }`}>
                  <p className="text-sm font-semibold mb-2">Interpretation</p>
                  <p className="text-sm text-gray-300">
                    {isReal ? (
                      <>
                        ✅ This image is classified as <span className="font-bold text-accent-green">REAL</span>. 
                        The model detected natural patterns and artifacts typical of camera-captured images.
                      </>
                    ) : (
                      <>
                        ⚠️ This image is classified as <span className="font-bold text-accent-red">AI-GENERATED</span>. 
                        The model detected patterns and artifacts typical of synthetically generated images.
                      </>
                    )}
                  </p>
                </div>
                
                <button
                  onClick={handleReset}
                  className="w-full py-3 bg-navy-700 hover:bg-navy-600 rounded-lg transition-colors font-semibold"
                >
                  Analyze Another Image
                </button>
              </div>
            ) : (
              <div className="card-dark p-8 h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <HiInformationCircle className="text-6xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    Upload and analyze an image to see results here
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

export default ImageDetectionPage
