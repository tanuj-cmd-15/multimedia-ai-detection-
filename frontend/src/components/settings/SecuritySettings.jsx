import React, { useState } from 'react'
import { HiShieldCheck, HiLockClosed, HiDeviceMobile, HiKey, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi'

const SecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const sessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      ip: '203.0.113.42',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Delhi, India',
      ip: '198.51.100.78',
      lastActive: '2 hours ago',
      current: false
    },
    {
      id: 3,
      device: 'Firefox on macOS',
      location: 'Bangalore, India',
      ip: '192.0.2.146',
      lastActive: '1 day ago',
      current: false
    }
  ]

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match!')
      return
    }
    if (passwords.new.length < 8) {
      alert('Password must be at least 8 characters!')
      return
    }
    alert('Password changed successfully!')
    setShowPasswordForm(false)
    setPasswords({ current: '', new: '', confirm: '' })
  }

  return (
    <div className="space-y-6">
      {/* Password */}
      <div className="card-dark p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Password</h3>
            <p className="text-gray-400 text-sm">
              Last changed 3 months ago
            </p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="btn-primary"
          >
            Change Password
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4 p-4 bg-navy-700 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="input-field"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                At least 8 characters, including uppercase, lowercase, and numbers
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Update Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false)
                  setPasswords({ current: '', new: '', confirm: '' })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <HiShieldCheck className="text-accent-blue text-xl flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Password Strength Tips</p>
              <ul className="space-y-1 text-gray-400">
                <li>• Use at least 12 characters</li>
                <li>• Mix uppercase and lowercase letters</li>
                <li>• Include numbers and special characters</li>
                <li>• Avoid common words and patterns</li>
                <li>• Don't reuse passwords from other sites</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="card-dark p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold">Two-Factor Authentication (2FA)</h3>
              {twoFactorEnabled && (
                <span className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  <HiCheckCircle className="text-sm" />
                  <span>Enabled</span>
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm">
              Add an extra layer of security to your account. We'll ask for a code when you sign in.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent-blue"></div>
          </label>
        </div>

        {twoFactorEnabled && (
          <div className="space-y-4 mt-6">
            <div className="p-4 bg-navy-700 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <HiDeviceMobile className="text-2xl text-accent-blue" />
                <div>
                  <h4 className="font-semibold">Authenticator App</h4>
                  <p className="text-sm text-gray-400">
                    Use an app like Google Authenticator or Authy
                  </p>
                </div>
              </div>
              <button className="text-accent-blue text-sm hover:underline">
                Setup Authenticator →
              </button>
            </div>

            <div className="p-4 bg-navy-700 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <HiKey className="text-2xl text-accent-blue" />
                <div>
                  <h4 className="font-semibold">Backup Codes</h4>
                  <p className="text-sm text-gray-400">
                    Recovery codes in case you lose access to your authenticator
                  </p>
                </div>
              </div>
              <button className="text-accent-blue text-sm hover:underline">
                Generate Backup Codes →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Active Sessions</h3>
        <p className="text-gray-400 text-sm mb-6">
          Manage and sign out of your active sessions on other devices.
        </p>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 bg-navy-700 rounded-lg flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold">{session.device}</h4>
                  {session.current && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>{session.location} • {session.ip}</p>
                  <p>Last active: {session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <button className="px-3 py-1.5 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                  Sign Out
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="mt-4 text-red-400 text-sm hover:underline">
          Sign out of all other sessions
        </button>
      </div>

      {/* Login History */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Recent Login Activity</h3>
        <div className="space-y-3">
          {[
            { date: 'Today, 10:30 AM', location: 'Mumbai, India', status: 'success' },
            { date: 'Yesterday, 8:15 PM', location: 'Mumbai, India', status: 'success' },
            { date: 'Nov 28, 2:45 PM', location: 'Delhi, India', status: 'success' },
            { date: 'Nov 27, 6:20 AM', location: 'Unknown Location', status: 'failed' }
          ].map((login, index) => (
            <div
              key={index}
              className="p-3 bg-navy-700 rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm">{login.date}</p>
                <p className="text-xs text-gray-400">{login.location}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  login.status === 'success'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {login.status === 'success' ? 'Success' : 'Failed'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="card-dark p-6 border border-yellow-500/50">
        <div className="flex items-start space-x-3">
          <HiExclamationCircle className="text-yellow-500 text-2xl flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xl font-bold mb-2">Security Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-0.5">⚠</span>
                <span>Enable two-factor authentication for better security</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Your password was changed recently</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-0.5">⚠</span>
                <span>Review active sessions and sign out unused devices</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings
