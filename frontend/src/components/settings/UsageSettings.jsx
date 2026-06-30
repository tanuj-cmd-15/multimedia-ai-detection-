import React from 'react'
import { HiChartBar, HiTrendingUp } from 'react-icons/hi'

const UsageSettings = () => {
  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-6">Usage Overview</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-navy-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">API Calls (Month)</p>
            <p className="text-2xl font-bold">18.5K</p>
            <p className="text-xs text-green-400 mt-1">↑ 12% from last month</p>
          </div>
          <div className="p-4 bg-navy-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Audio Analyzed</p>
            <p className="text-2xl font-bold">12.3K</p>
            <p className="text-xs text-accent-blue mt-1">45 hours total</p>
          </div>
          <div className="p-4 bg-navy-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Images Analyzed</p>
            <p className="text-2xl font-bold">6.2K</p>
            <p className="text-xs text-purple-400 mt-1">Avg 200/day</p>
          </div>
          <div className="p-4 bg-navy-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Storage Used</p>
            <p className="text-2xl font-bold">2.4GB</p>
            <p className="text-xs text-gray-400 mt-1">of 10GB limit</p>
          </div>
        </div>
      </div>

      {/* Quota Limits */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Current Quotas & Limits</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Daily API Calls</span>
              <span className="text-sm font-semibold">850 / 1,000</span>
            </div>
            <div className="w-full bg-navy-700 rounded-full h-2">
              <div className="bg-accent-blue h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Monthly Bandwidth</span>
              <span className="text-sm font-semibold">45GB / 100GB</span>
            </div>
            <div className="w-full bg-navy-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Storage</span>
              <span className="text-sm font-semibold">2.4GB / 10GB</span>
            </div>
            <div className="w-full bg-navy-700 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage History Chart */}
      <div className="card-dark p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Usage History</h3>
          <select className="input-field w-32">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
        <div className="h-64 flex items-end justify-between space-x-2">
          {[65, 85, 72, 90, 78, 95, 88].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-accent-blue to-purple-500 rounded-t hover:opacity-80 transition-opacity cursor-pointer"
                style={{ height: `${height}%` }}
                title={`${height}% usage`}
              ></div>
              <span className="text-xs text-gray-400 mt-2">Day {i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Endpoints */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Top API Endpoints</h3>
        <div className="space-y-3">
          {[
            { endpoint: '/api/analyze (Audio)', calls: '12.3K', percentage: 66 },
            { endpoint: '/api/predict (Image)', calls: '6.2K', percentage: 34 }
          ].map((item, i) => (
            <div key={i} className="p-3 bg-navy-700 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-mono text-sm">{item.endpoint}</span>
                <span className="text-sm font-semibold">{item.calls}</span>
              </div>
              <div className="w-full bg-navy-800 rounded-full h-1.5">
                <div
                  className="bg-accent-blue h-1.5 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UsageSettings
