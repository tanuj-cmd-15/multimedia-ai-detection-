import React from 'react'
import { HiDocumentText, HiDownload } from 'react-icons/hi'

const AuditLogSettings = () => {
  const auditLogs = [
    { timestamp: '2024-06-30 10:30:25', event: 'Login', ip: '203.0.113.42', details: 'Successful login from Chrome on Windows', severity: 'info' },
    { timestamp: '2024-06-30 09:15:10', event: 'API Key Created', ip: '203.0.113.42', details: 'New API key "Production Key" created', severity: 'warning' },
    { timestamp: '2024-06-29 18:45:33', event: 'Password Changed', ip: '198.51.100.78', details: 'Password updated successfully', severity: 'warning' },
    { timestamp: '2024-06-29 14:22:18', event: 'Audio Analysis', ip: '203.0.113.42', details: 'Analyzed audio file: sample.wav', severity: 'info' },
    { timestamp: '2024-06-29 12:10:05', event: 'Failed Login', ip: '192.0.2.146', details: 'Failed login attempt - invalid password', severity: 'error' }
  ]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card-dark p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Audit Logs</h3>
          <button className="btn-secondary flex items-center space-x-2">
            <HiDownload />
            <span>Export Logs</span>
          </button>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <select className="input-field">
            <option>All Events</option>
            <option>Login Events</option>
            <option>API Events</option>
            <option>Security Events</option>
          </select>
          <select className="input-field">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Custom Range</option>
          </select>
          <select className="input-field">
            <option>All Severities</option>
            <option>Info</option>
            <option>Warning</option>
            <option>Error</option>
          </select>
          <input type="text" placeholder="Search..." className="input-field" />
        </div>
      </div>

      {/* Logs Table */}
      <div className="card-dark p-6">
        <div className="space-y-2">
          {auditLogs.map((log, i) => (
            <div key={i} className="p-4 bg-navy-700 rounded-lg hover:bg-navy-600 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`w-2 h-2 rounded-full ${
                    log.severity === 'error' ? 'bg-red-400' :
                    log.severity === 'warning' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></span>
                  <div>
                    <p className="font-semibold">{log.event}</p>
                    <p className="text-sm text-gray-400">{log.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-gray-400">{log.timestamp}</p>
                  <p className="text-xs text-gray-500">{log.ip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retention Policy */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Log Retention Policy</h3>
        <p className="text-gray-400 text-sm mb-4">
          Audit logs are retained for <span className="font-semibold text-white">1 year</span>. After this period, logs are automatically archived and deleted.
        </p>
        <button className="text-accent-blue hover:underline text-sm">
          Change retention policy →
        </button>
      </div>
    </div>
  )
}

export default AuditLogSettings
