import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiClipboardList, HiCheckCircle, HiXCircle, HiClock } from 'react-icons/hi'
import { getRecentAnalyses } from '../services/api'

const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchAnalyses()
  }, [])
  
  const fetchAnalyses = async () => {
    try {
      const data = await getRecentAnalyses()
      setAnalyses(data)
    } catch (err) {
      setError('Failed to load analysis history')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 flex items-center">
            <HiClipboardList className="mr-4 text-accent-blue" />
            Analysis <span className="gradient-text ml-3">History</span>
          </h1>
          <p className="text-xl text-gray-400">
            View your recent audio deepfake detection analyses
          </p>
        </motion.div>
        
        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-accent-blue mx-auto mb-4" viewBox="0 0 24 24">
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
              <p className="text-gray-400">Loading analyses...</p>
            </div>
          </div>
        ) : error ? (
          <div className="card-dark p-8 text-center">
            <HiXCircle className="text-6xl text-accent-red mx-auto mb-4" />
            <p className="text-xl text-gray-400">{error}</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="card-dark p-12 text-center">
            <HiClipboardList className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-2">No analyses yet</p>
            <p className="text-gray-500">Upload an audio file to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis, index) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-dark p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {analysis.prediction === 'REAL' ? (
                      <HiCheckCircle className="text-4xl text-accent-green flex-shrink-0" />
                    ) : (
                      <HiXCircle className="text-4xl text-accent-red flex-shrink-0" />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold">
                          {analysis.prediction}
                        </h3>
                        <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue text-sm font-semibold rounded-full">
                          {analysis.confidence}% confidence
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Duration</p>
                          <p className="font-medium text-white">{analysis.audioInfo.duration}s</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Sample Rate</p>
                          <p className="font-medium text-white">{analysis.audioInfo.sampleRate} Hz</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Real Score</p>
                          <p className="font-medium text-accent-green">{analysis.scores.real}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Fake Score</p>
                          <p className="font-medium text-accent-red">{analysis.scores.fake}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500 flex items-center ml-4">
                    <HiClock className="mr-2" />
                    <span>Just now</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
