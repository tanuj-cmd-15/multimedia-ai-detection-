import React from 'react'
import { HiCode, HiPlus } from 'react-icons/hi'

const IntegrationSettings = () => {
  const integrations = [
    {
      name: 'Slack',
      description: 'Get notifications in your Slack workspace',
      logo: '💬',
      connected: true
    },
    {
      name: 'Webhook',
      description: 'Send data to your custom endpoints',
      logo: '🔗',
      connected: true
    },
    {
      name: 'Zapier',
      description: 'Connect with 3,000+ apps',
      logo: '⚡',
      connected: false
    },
    {
      name: 'Discord',
      description: 'Bot notifications in Discord',
      logo: '🎮',
      connected: false
    }
  ]

  return (
    <div className="space-y-6">
      {/* Integrations */}
      <div className="card-dark p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Connected Integrations</h3>
            <p className="text-gray-400 text-sm">Manage third-party integrations and webhooks</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <HiPlus />
            <span>Add Integration</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div key={integration.name} className="p-5 bg-navy-700 rounded-lg border border-navy-600 hover:border-accent-blue/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{integration.logo}</div>
                  <div>
                    <h4 className="font-semibold text-lg">{integration.name}</h4>
                    <p className="text-sm text-gray-400">{integration.description}</p>
                  </div>
                </div>
                {integration.connected && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    Connected
                  </span>
                )}
              </div>
              <button className={`w-full py-2 rounded-lg font-semibold text-sm ${
                integration.connected
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  : 'bg-accent-blue hover:bg-blue-600 text-white'
              }`}>
                {integration.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Webhook Endpoints</h3>
        <div className="space-y-3 mb-4">
          <div className="p-4 bg-navy-700 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-mono text-sm mb-1">https://api.example.com/webhook</p>
                <p className="text-xs text-gray-400">Events: detection.completed, detection.failed</p>
              </div>
              <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
            </div>
            <span className="inline-flex px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Active</span>
          </div>
        </div>
        <button className="btn-secondary">+ Add Webhook</button>
      </div>

      {/* API Keys for Integrations */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">OAuth Applications</h3>
        <p className="text-gray-400 text-sm mb-4">
          Manage OAuth applications that have access to your account
        </p>
        <p className="text-gray-500 text-sm">No OAuth applications authorized</p>
      </div>
    </div>
  )
}

export default IntegrationSettings
