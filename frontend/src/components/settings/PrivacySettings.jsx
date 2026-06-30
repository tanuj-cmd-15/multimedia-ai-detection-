import React from 'react'
import { HiLockClosed, HiShieldCheck } from 'react-icons/hi'

const PrivacySettings = () => {
  return (
    <div className="space-y-6">
      {/* Data Collection */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Data Collection & Usage</h3>
        <div className="space-y-4">
          {[
            { label: 'Analytics & Performance', description: 'Help improve our service by sharing usage data' },
            { label: 'Personalization', description: 'Allow us to personalize your experience' },
            { label: 'Marketing Communications', description: 'Receive tips, updates, and promotional content' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-navy-700 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{item.label}</h4>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={i === 0} />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Data Retention */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Data Retention</h3>
        <div className="space-y-3">
          <p className="text-gray-400 text-sm">Control how long we keep your data</p>
          <div className="p-4 bg-navy-700 rounded-lg">
            <label className="block text-sm font-medium mb-2">Analysis History</label>
            <select className="input-field">
              <option>Keep for 90 days</option>
              <option>Keep for 6 months</option>
              <option>Keep for 1 year</option>
              <option>Keep forever</option>
            </select>
          </div>
          <div className="p-4 bg-navy-700 rounded-lg">
            <label className="block text-sm font-medium mb-2">Audit Logs</label>
            <select className="input-field">
              <option>Keep for 1 year</option>
              <option>Keep for 2 years</option>
              <option>Keep for 5 years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Privacy Settings</h3>
        <div className="space-y-3">
          <div className="p-4 bg-navy-700 rounded-lg">
            <h4 className="font-semibold mb-2">Profile Visibility</h4>
            <select className="input-field">
              <option>Public</option>
              <option>Organization Only</option>
              <option>Private</option>
            </select>
          </div>
          <div className="p-4 bg-navy-700 rounded-lg">
            <h4 className="font-semibold mb-2">Activity Status</h4>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Show when you're online</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary">Save Privacy Settings</button>
      </div>
    </div>
  )
}

export default PrivacySettings
