import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HiKey, HiClipboard, HiRefresh, HiCheckCircle, HiInformationCircle } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { regenerateApiKey } from '../services/api'
import { useNavigate } from 'react-router-dom'

const ApiKeysPage = () => {
  const { user, isAuthenticated, updateUser } = useAuth()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerateKey = async () => {
    if (!window.confirm('Are you sure you want to regenerate your API key? The old key will stop working immediately.')) {
      return
    }

    setLoading(true)
    try {
      const response = await regenerateApiKey(user.userId)
      updateUser({ ...user, apiKey: response.apiKey })
      alert('API key regenerated successfully!')
    } catch (err) {
      alert('Failed to regenerate API key. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 flex items-center">
            <HiKey className="mr-4 text-accent-blue" />
            API <span className="gradient-text ml-3">Keys</span>
          </h1>
          <p className="text-xl text-gray-400">
            Use your API key to programmatically access the SwarParikshan detection API
          </p>
        </motion.div>

        {/* API Key Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-dark p-8 mb-6"
        >
          <h2 className="text-2xl font-bold mb-4">Your API Key</h2>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex-1 bg-navy-700 px-4 py-3 rounded-lg font-mono text-sm">
              {user.apiKey}
            </div>
            <button
              onClick={copyToClipboard}
              className="px-4 py-3 bg-accent-blue hover:bg-blue-600 rounded-lg transition-colors flex items-center space-x-2"
            >
              {copied ? (
                <>
                  <HiCheckCircle className="text-xl" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <HiClipboard className="text-xl" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleRegenerateKey}
            disabled={loading}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <HiRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Regenerating...' : 'Regenerate API Key'}</span>
          </button>
        </motion.div>

        {/* Usage Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-dark p-8 mb-6"
        >
          <h2 className="text-2xl font-bold mb-4">API Usage</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-navy-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Account Type</p>
              <p className="text-2xl font-bold">{user.userType}</p>
            </div>
            <div className="bg-navy-700 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">API Calls</p>
              <p className="text-2xl font-bold text-accent-green">Unlimited</p>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 flex items-start space-x-3">
            <HiInformationCircle className="text-accent-blue text-2xl flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-semibold mb-2">Keep your API key secure:</p>
              <ul className="space-y-1 text-gray-400">
                <li>• Never share your API key publicly</li>
                <li>• Don't commit it to version control</li>
                <li>• Regenerate immediately if compromised</li>
                <li>• Use environment variables in your code</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* API Documentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-dark p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          
          <div className="space-y-6">
            {/* Python Example */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-accent-blue">Python Example</h3>
              <pre className="bg-navy-700 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`import requests

api_key = "${user.apiKey}"
url = "http://localhost:8081/api/analyze"

with open("audio.wav", "rb") as f:
    files = {"audio": f}
    headers = {"X-API-Key": api_key}
    response = requests.post(url, files=files, headers=headers)
    
print(response.json())`}</code>
              </pre>
            </div>

            {/* cURL Example */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-accent-blue">cURL Example</h3>
              <pre className="bg-navy-700 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`curl -X POST http://localhost:8081/api/analyze \\
  -H "X-API-Key: ${user.apiKey}" \\
  -F "audio=@audio.wav"`}</code>
              </pre>
            </div>

            {/* JavaScript Example */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-accent-blue">JavaScript Example</h3>
              <pre className="bg-navy-700 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`const formData = new FormData();
formData.append('audio', audioFile);

fetch('http://localhost:8081/api/analyze', {
  method: 'POST',
  headers: {
    'X-API-Key': '${user.apiKey}'
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));`}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ApiKeysPage
