import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HiChartBar, HiExclamationCircle, HiInformationCircle } from 'react-icons/hi'

const DetailedAnalysis = ({ result }) => {
  const [activeTab, setActiveTab] = useState('overview')

  // Parse suspicious regions if available
  const suspiciousRegions = result.suspiciousRegions 
    ? JSON.parse(result.suspiciousRegions)
    : []

  // Parse attention weights if available
  const attentionWeights = result.attentionWeights
    ? JSON.parse(result.attentionWeights)
    : []

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'suspicious', label: 'Suspicious Regions' },
    { id: 'attention', label: 'Attention Analysis' },
    { id: 'features', label: 'Features' }
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-navy-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-accent-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-navy-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Prediction</p>
                <p className="text-2xl font-bold">{result.prediction}</p>
              </div>
              <div className="bg-navy-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Confidence</p>
                <p className="text-2xl font-bold text-accent-blue">{result.confidence}%</p>
              </div>
              <div className="bg-navy-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Real Score</p>
                <p className="text-2xl font-bold text-accent-green">{result.scores.real}%</p>
              </div>
              <div className="bg-navy-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Fake Score</p>
                <p className="text-2xl font-bold text-accent-red">{result.scores.fake}%</p>
              </div>
            </div>

            <div className="bg-navy-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <HiInformationCircle className="mr-2 text-accent-blue" />
                Audio Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="font-medium">{result.audioInfo.duration}s</p>
                </div>
                <div>
                  <p className="text-gray-400">Sample Rate</p>
                  <p className="font-medium">{result.audioInfo.sampleRate} Hz</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suspicious' && (
          <div className="space-y-4">
            {suspiciousRegions.length === 0 ? (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6 text-center">
                <HiInformationCircle className="text-5xl text-accent-green mx-auto mb-3" />
                <p className="text-lg font-semibold text-green-400 mb-2">
                  No Suspicious Regions Detected
                </p>
                <p className="text-gray-400">
                  The audio appears consistent throughout with no significant anomalies.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <HiExclamationCircle className="text-orange-400 text-2xl flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                      <p className="font-semibold mb-1">Suspicious regions detected</p>
                      <p className="text-gray-400">
                        These time segments show unusual patterns that may indicate manipulation or synthesis.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {suspiciousRegions.map((region, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-navy-700 p-4 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            region.suspicion_level === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-orange-500/20 text-orange-400'
                          }`}>
                            {region.suspicion_level.toUpperCase()}
                          </span>
                          <span className="font-semibold">
                            Region {index + 1}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">
                          Intensity: {region.intensity.toFixed(3)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <span className="font-mono">
                          {region.start_time}s - {region.end_time}s
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          Duration: {(region.end_time - region.start_time).toFixed(2)}s
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'attention' && (
          <div className="space-y-4">
            <div className="bg-navy-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Attention Heatmap</h3>
              <p className="text-sm text-gray-400 mb-4">
                The model's attention weights over time. Higher values indicate regions the model focused on when making its prediction.
              </p>
              
              {attentionWeights.length > 0 ? (
                <div className="bg-navy-800 p-4 rounded-lg">
                  <div className="flex items-end space-x-1 h-32">
                    {attentionWeights.map((point, index) => {
                      const height = (point.weight / Math.max(...attentionWeights.map(p => p.weight))) * 100
                      return (
                        <div
                          key={index}
                          className="flex-1 bg-gradient-to-t from-accent-blue to-blue-400 rounded-t transition-all hover:opacity-80"
                          style={{ height: `${height}%` }}
                          title={`Time: ${point.time}s, Weight: ${point.weight.toFixed(4)}`}
                        />
                      )
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0s</span>
                    <span>{result.audioInfo.duration}s</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Attention data not available
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-navy-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Peak Frame</p>
                <p className="text-xl font-bold">{result.features.attentionPeakFrame}</p>
              </div>
              <div className="bg-navy-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Concentration</p>
                <p className="text-xl font-bold">{result.features.attentionConcentration.toFixed(4)}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-4">
            <div className="bg-navy-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <HiChartBar className="mr-2 text-accent-blue" />
                Acoustic Features
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Mel Spectrogram Mean</span>
                  <span className="font-mono text-sm">{result.features.melMean.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Mel Spectrogram Std Dev</span>
                  <span className="font-mono text-sm">{result.features.melStd.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Attention Peak Frame</span>
                  <span className="font-mono text-sm">{result.features.attentionPeakFrame}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Attention Concentration</span>
                  <span className="font-mono text-sm">{result.features.attentionConcentration.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {result.modelInfo && (
              <div className="bg-navy-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Model Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Architecture</span>
                    <span className="font-medium">{result.modelInfo.architecture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Validation EER</span>
                    <span className="font-medium text-accent-green">{result.modelInfo.validationEer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Validation Accuracy</span>
                    <span className="font-medium text-accent-green">{result.modelInfo.validationAccuracy}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default DetailedAnalysis
