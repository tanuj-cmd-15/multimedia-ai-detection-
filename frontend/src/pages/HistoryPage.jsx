import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiClipboardList, HiCheckCircle, HiXCircle, HiClock, HiMusicNote, HiPhotograph, HiVideoCamera } from 'react-icons/hi'
import { getRecentAnalyses, getRecentImageAnalyses } from '../services/api'

const HistoryPage = () => {
  const [audioAnalyses, setAudioAnalyses] = useState([])
  const [imageAnalyses, setImageAnalyses] = useState([])
  const [videoAnalyses, setVideoAnalyses] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchAnalyses()
  }, [])
  
  const fetchAnalyses = async () => {
    try {
      // Fetch audio analyses
      const audioData = await getRecentAnalyses()
      setAudioAnalyses(audioData)
      
      // Fetch image analyses from backend
      const imageData = await getRecentImageAnalyses()
      setImageAnalyses(imageData)
      
      // Fetch video analyses from local storage (temporary until video service is ready)
      const storedVideoAnalyses = JSON.parse(localStorage.getItem('videoAnalyses') || '[]')
      setVideoAnalyses(storedVideoAnalyses)
    } catch (err) {
      setError('Failed to load analysis history')
    } finally {
      setLoading(false)
    }
  }
  
  const allAnalyses = [
    ...audioAnalyses.map(a => ({ ...a, type: 'audio' })),
    ...imageAnalyses.map(a => ({ ...a, type: 'image' })),
    ...videoAnalyses.map(a => ({ ...a, type: 'video' }))
  ].sort((a, b) => new Date(b.analyzedAt || b.timestamp) - new Date(a.analyzedAt || a.timestamp))
  
  const getFilteredAnalyses = () => {
    switch(activeTab) {
      case 'audio': return audioAnalyses.map(a => ({ ...a, type: 'audio' }))
      case 'image': return imageAnalyses.map(a => ({ ...a, type: 'image' }))
      case 'video': return videoAnalyses.map(a => ({ ...a, type: 'video' }))
      default: return allAnalyses
    }
  }
  
  const filteredAnalyses = getFilteredAnalyses()
  
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
            View your recent detection analyses across all modalities
          </p>
        </motion.div>
        
        {/* Tabs */}
        <div className="mb-8 flex space-x-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All', icon: HiClipboardList, count: allAnalyses.length },
            { id: 'audio', label: 'Audio', icon: HiMusicNote, count: audioAnalyses.length },
            { id: 'image', label: 'Images', icon: HiPhotograph, count: imageAnalyses.length },
            { id: 'video', label: 'Videos', icon: HiVideoCamera, count: videoAnalyses.length }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-accent-blue text-white shadow-lg'
                    : 'bg-navy-800 text-gray-400 hover:bg-navy-700 hover:text-white'
                }`}
              >
                <Icon className="text-xl" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-navy-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
        
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
        ) : filteredAnalyses.length === 0 ? (
          <div className="card-dark p-12 text-center">
            <HiClipboardList className="text-6xl text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-2">No {activeTab !== 'all' ? activeTab : ''} analyses yet</p>
            <p className="text-gray-500">
              {activeTab === 'audio' && 'Upload an audio file to get started'}
              {activeTab === 'image' && 'Upload an image to get started'}
              {activeTab === 'video' && 'Upload a video to get started'}
              {activeTab === 'all' && 'Upload audio, images, or videos to get started'}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filteredAnalyses.map((analysis, index) => (
                <motion.div
                  key={`${analysis.type}-${analysis.id || index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-dark p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Type Icon */}
                      <div className="flex-shrink-0">
                        {analysis.type === 'audio' && <HiMusicNote className="text-3xl text-purple-400" />}
                        {analysis.type === 'image' && <HiPhotograph className="text-3xl text-blue-400" />}
                        {analysis.type === 'video' && <HiVideoCamera className="text-3xl text-pink-400" />}
                      </div>
                      
                      {/* Result Icon */}
                      {analysis.prediction === 'REAL' ? (
                        <HiCheckCircle className="text-4xl text-accent-green flex-shrink-0" />
                      ) : (
                        <HiXCircle className="text-4xl text-accent-red flex-shrink-0" />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="px-2 py-1 bg-navy-700 text-xs font-semibold rounded uppercase">
                            {analysis.type}
                          </span>
                          <h3 className="text-xl font-bold">
                            {analysis.prediction}
                          </h3>
                          <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue text-sm font-semibold rounded-full">
                            {analysis.confidence}% confidence
                          </span>
                        </div>
                        
                        {/* Audio specific info */}
                        {analysis.type === 'audio' && analysis.audioInfo && (
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
                        )}
                        
                        {/* Image specific info */}
                        {analysis.type === 'image' && analysis.image_info && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Dimensions</p>
                              <p className="font-medium text-white">{analysis.image_info.width}×{analysis.image_info.height}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Format</p>
                              <p className="font-medium text-white">{analysis.image_info.format}</p>
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
                        )}
                        
                        {/* Video specific info */}
                        {analysis.type === 'video' && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Duration</p>
                              <p className="font-medium text-white">{analysis.duration || 'N/A'}s</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Resolution</p>
                              <p className="font-medium text-white">{analysis.resolution || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Real Score</p>
                              <p className="font-medium text-accent-green">{analysis.scores?.real || 0}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Fake Score</p>
                              <p className="font-medium text-accent-red">{analysis.scores?.fake || 0}%</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right text-sm text-gray-500 flex items-center ml-4">
                      <HiClock className="mr-2" />
                      <span>{formatTimestamp(analysis.analyzedAt || analysis.timestamp)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default HistoryPage
