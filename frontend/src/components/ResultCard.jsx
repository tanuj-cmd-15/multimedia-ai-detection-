import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiRefresh, HiInformationCircle, HiChartBar } from 'react-icons/hi'
import DetailedAnalysis from './DetailedAnalysis'

const ResultCard = ({ result, onReset }) => {
  const [showDetails, setShowDetails] = useState(false)
  const isReal = result.prediction === 'REAL'
  const iconColor = isReal ? 'text-accent-green' : 'text-accent-red'
  const bgColor = isReal ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-dark p-8 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analysis Result</h2>
        <button
          onClick={onReset}
          className="flex items-center space-x-2 text-accent-blue hover:text-blue-400 transition-colors"
        >
          <HiRefresh className="text-xl" />
          <span>New Analysis</span>
        </button>
      </div>
      
      {/* Prediction */}
      <div className={`p-6 rounded-lg border ${bgColor}`}>
        <div className="flex items-center space-x-4 mb-4">
          {isReal ? (
            <HiCheckCircle className={`text-5xl ${iconColor}`} />
          ) : (
            <HiXCircle className={`text-5xl ${iconColor}`} />
          )}
          <div>
            <p className="text-sm text-gray-400 mb-1">Prediction</p>
            <p className={`text-3xl font-bold ${iconColor}`}>
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
            <span className="text-gray-400">Real Audio</span>
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
      
      {/* Detailed Analysis Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-accent-blue hover:bg-blue-600 rounded-lg transition-colors"
      >
        <HiChartBar className="text-xl" />
        <span className="font-semibold">
          {showDetails ? 'Hide' : 'Show'} Detailed Analysis
        </span>
      </button>

      {/* Detailed Analysis Section */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <DetailedAnalysis result={result} />
        </motion.div>
      )}
      
      {/* Interpretation */}
      <div className={`p-4 rounded-lg border ${bgColor}`}>
        <p className="text-sm font-semibold mb-2">Interpretation</p>
        <p className="text-sm text-gray-300">
          {isReal ? (
            <>
              ✅ This audio is classified as <span className="font-bold text-accent-green">REAL/GENUINE</span>. 
              The model detected natural spectral variations and consistent patterns typical of human speech.
            </>
          ) : (
            <>
              ⚠️ This audio is classified as <span className="font-bold text-accent-red">AI-GENERATED/DEEPFAKE</span>. 
              The model detected unusual spectral patterns and artifacts typical of synthetic audio generation.
            </>
          )}
        </p>
      </div>
      
      {/* Model Info */}
      {result.modelInfo && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <HiInformationCircle className="text-accent-blue text-xl flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-2">Model Information</p>
              <div className="space-y-1 text-gray-400">
                <p>Architecture: {result.modelInfo.architecture}</p>
                <p>Validation EER: {result.modelInfo.validationEer}</p>
                <p>Validation Accuracy: {result.modelInfo.validationAccuracy}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ResultCard
