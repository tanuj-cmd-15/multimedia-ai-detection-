import React, { useState } from 'react'
import { HiBell, HiMail, HiDeviceMobile } from 'react-icons/hi'

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailDetectionComplete: true,
    emailWeeklySummary: true,
    emailSecurityAlerts: true,
    emailMarketing: false,
    pushDetectionComplete: true,
    pushUsageAlerts: true,
    pushSecurityAlerts: true,
    smsSecurityAlerts: false
  })

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
    </label>
  )

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="card-dark p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HiMail className="text-2xl text-accent-blue" />
          <h3 className="text-xl font-bold">Email Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: 'emailDetectionComplete', label: 'Detection Complete', description: 'Get notified when your audio/image analysis is complete' },
            { key: 'emailWeeklySummary', label: 'Weekly Summary', description: 'Receive weekly reports of your detection activity' },
            { key: 'emailSecurityAlerts', label: 'Security Alerts', description: 'Important notifications about your account security' },
            { key: 'emailMarketing', label: 'Marketing & Updates', description: 'Product updates, tips, and promotional content' }
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between p-4 bg-navy-700 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{item.label}</h4>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <Toggle
                checked={notifications[item.key]}
                onChange={() => handleToggle(item.key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="card-dark p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HiDeviceMobile className="text-2xl text-accent-blue" />
          <h3 className="text-xl font-bold">Push Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: 'pushDetectionComplete', label: 'Detection Complete', description: 'Real-time notifications for completed analyses' },
            { key: 'pushUsageAlerts', label: 'Usage Alerts', description: 'Alerts when approaching rate limits or quotas' },
            { key: 'pushSecurityAlerts', label: 'Security Alerts', description: 'Critical security notifications' }
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between p-4 bg-navy-700 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{item.label}</h4>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <Toggle
                checked={notifications[item.key]}
                onChange={() => handleToggle(item.key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="card-dark p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HiBell className="text-2xl text-accent-blue" />
          <h3 className="text-xl font-bold">SMS Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 bg-navy-700 rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Security Alerts</h4>
              <p className="text-sm text-gray-400">Critical security alerts via SMS</p>
            </div>
            <Toggle
              checked={notifications.smsSecurityAlerts}
              onChange={() => handleToggle('smsSecurityAlerts')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary">Save Preferences</button>
      </div>
    </div>
  )
}

export default NotificationSettings
