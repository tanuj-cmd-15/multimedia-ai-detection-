import React, { useState } from 'react'
import { HiKey, HiClipboard, HiCheckCircle, HiEye, HiEyeOff, HiPlus, HiTrash, HiExclamationCircle } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

const APISettings = () => {
  const { user } = useAuth()
  const [copied, setCopied] = useState(null)
  const [showKeys, setShowKeys] = useState({})
  
  const apiKeys = [
    {
      id: 1,
      name: 'Production API Key',
      key: user?.apiKey || 'sk_prod_xxxxxxxxxxxxxxxxxxxxxxxxxx',
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      requests: '1.2M',
      status: 'active'
    },
    {
      id: 2,
      name: 'Development API Key',
      key: 'sk_dev_yyyyyyyyyyyyyyyyyyyyyyyyyyyy',
      created: '2024-02-20',
      lastUsed: '5 minutes ago',
      requests: '450K',
      status: 'active'
    },
    {
      id: 3,
      name: 'Testing API Key',
      key: 'sk_test_zzzzzzzzzzzzzzzzzzzzzzzzzzzz',
      created: '2024-03-10',
      lastUsed: 'Never',
      requests: '0',
      status: 'inactive'
    }
  ]

  const copyToClipboard = (key, id) => {
    navigator.clipboard.writeText(key)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const maskApiKey = (key) => {
    const prefix = key.substring(0, 12)
    const suffix = key.substring(key.length - 4)
    return `${prefix}${'•'.repeat(16)}${suffix}`
  }

  const toggleShowKey = (id) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      {/* API Keys List */}
      <div className="card-dark p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">API Keys</h3>
            <p className="text-gray-400 text-sm">
              Manage your API keys for programmatic access
            </p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <HiPlus />
            <span>Create New Key</span>
          </button>
        </div>

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="p-5 bg-navy-700 rounded-lg border border-navy-600 hover:border-accent-blue/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-lg">{apiKey.name}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        apiKey.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {apiKey.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Created: {new Date(apiKey.created).toLocaleDateString()}</p>
                    <p>Last used: {apiKey.lastUsed}</p>
                    <p>Total requests: {apiKey.requests}</p>
                  </div>
                </div>
                <button
                  onClick={() => {}}
                  className="text-red-400 hover:text-red-300 transition-colors p-2"
                  title="Delete API Key"
                >
                  <HiTrash className="text-xl" />
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-navy-800 px-4 py-2.5 rounded-lg font-mono text-sm">
                  {showKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                </div>
                <button
                  onClick={() => toggleShowKey(apiKey.id)}
                  className="px-3 py-2.5 bg-navy-600 hover:bg-navy-500 rounded-lg transition-colors"
                  title={showKeys[apiKey.id] ? 'Hide' : 'Show'}
                >
                  {showKeys[apiKey.id] ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
                </button>
                <button
                  onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                  className="px-3 py-2.5 bg-accent-blue hover:bg-blue-600 rounded-lg transition-colors"
                  title="Copy"
                >
                  {copied === apiKey.id ? (
                    <HiCheckCircle className="text-lg" />
                  ) : (
                    <HiClipboard className="text-lg" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Usage Statistics */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-6">API Usage Statistics</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-navy-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-accent-blue">1.65M</p>
            <p className="text-xs text-green-400 mt-1">↑ 12% this month</p>
          </div>
          <div className="p-4 bg-navy-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-green-400">99.8%</p>
            <p className="text-xs text-gray-400 mt-1">Excellent</p>
          </div>
          <div className="p-4 bg-navy-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Avg Response</p>
            <p className="text-2xl font-bold text-purple-400">45ms</p>
            <p className="text-xs text-green-400 mt-1">↓ 5ms faster</p>
          </div>
          <div className="p-4 bg-navy-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Error Rate</p>
            <p className="text-2xl font-bold text-red-400">0.2%</p>
            <p className="text-xs text-gray-400 mt-1">Within limits</p>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Rate Limits</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Audio Detection API</span>
              <span className="text-sm font-semibold">850 / 1,000 requests/hour</span>
            </div>
            <div className="w-full bg-navy-700 rounded-full h-2">
              <div
                className="bg-accent-blue h-2 rounded-full"
                style={{ width: '85%' }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Image Detection API</span>
              <span className="text-sm font-semibold">320 / 500 requests/hour</span>
            </div>
            <div className="w-full bg-navy-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: '64%' }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Daily Quota</span>
              <span className="text-sm font-semibold">18.5K / 25K requests/day</span>
            </div>
            <div className="w-full bg-navy-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: '74%' }}
              />
            </div>
          </div>
        </div>
        <button className="mt-4 text-accent-blue text-sm hover:underline">
          Request rate limit increase →
        </button>
      </div>

      {/* Webhook Settings */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Webhook Endpoints</h3>
        <p className="text-gray-400 text-sm mb-4">
          Configure webhooks to receive real-time notifications about API events
        </p>
        <div className="space-y-3">
          <div className="p-4 bg-navy-700 rounded-lg flex items-center justify-between">
            <div className="flex-1">
              <p className="font-mono text-sm mb-1">https://api.yourapp.com/webhooks/detection</p>
              <p className="text-xs text-gray-400">Events: detection.completed, detection.failed</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                Active
              </span>
              <button className="text-red-400 hover:text-red-300">
                <HiTrash />
              </button>
            </div>
          </div>
        </div>
        <button className="mt-4 btn-secondary">
          + Add Webhook
        </button>
      </div>

      {/* API Documentation */}
      <div className="card-dark p-6 border border-blue-500/50">
        <div className="flex items-start space-x-3">
          <HiExclamationCircle className="text-accent-blue text-2xl flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold mb-2">API Documentation</h3>
            <p className="text-sm text-gray-400 mb-3">
              Check out our comprehensive API documentation for integration guides, code examples, and best practices.
            </p>
            <a href="/docs" className="text-accent-blue hover:underline text-sm">
              View API Documentation →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default APISettings
