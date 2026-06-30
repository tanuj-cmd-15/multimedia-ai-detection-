import React from 'react'
import { HiDatabase, HiDownload, HiUpload, HiTrash, HiExclamationCircle } from 'react-icons/hi'

const DataManagementSettings = () => {
  return (
    <div className="space-y-6">
      {/* Export Data */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <HiDownload className="text-accent-blue" />
          <span>Export Your Data</span>
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Download a copy of your data in JSON or CSV format
        </p>
        <div className="space-y-3">
          <button className="w-full p-4 bg-navy-700 rounded-lg hover:bg-navy-600 transition-colors text-left flex items-center justify-between">
            <div>
              <p className="font-semibold">Analysis History</p>
              <p className="text-sm text-gray-400">All your audio and image detection results</p>
            </div>
            <HiDownload className="text-xl text-accent-blue" />
          </button>
          <button className="w-full p-4 bg-navy-700 rounded-lg hover:bg-navy-600 transition-colors text-left flex items-center justify-between">
            <div>
              <p className="font-semibold">Account Information</p>
              <p className="text-sm text-gray-400">Profile, settings, and preferences</p>
            </div>
            <HiDownload className="text-xl text-accent-blue" />
          </button>
          <button className="w-full p-4 bg-navy-700 rounded-lg hover:bg-navy-600 transition-colors text-left flex items-center justify-between">
            <div>
              <p className="font-semibold">API Usage Logs</p>
              <p className="text-sm text-gray-400">Complete API request history</p>
            </div>
            <HiDownload className="text-xl text-accent-blue" />
          </button>
        </div>
        <button className="mt-4 btn-primary w-full">
          Export All Data
        </button>
      </div>

      {/* Import Data */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <HiUpload className="text-accent-blue" />
          <span>Import Data</span>
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Import your data from another account or service
        </p>
        <div className="border-2 border-dashed border-navy-600 rounded-lg p-8 text-center hover:border-accent-blue transition-colors cursor-pointer">
          <HiUpload className="text-4xl text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">Drag and drop your export file here</p>
          <p className="text-sm text-gray-500">or click to browse</p>
        </div>
      </div>

      {/* Data Storage */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Data Storage</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-navy-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Total Storage</p>
            <p className="text-2xl font-bold">2.4 GB</p>
            <p className="text-xs text-gray-400 mt-1">of 10 GB</p>
          </div>
          <div className="p-4 bg-navy-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Audio Files</p>
            <p className="text-2xl font-bold">1.8 GB</p>
            <p className="text-xs text-gray-400 mt-1">12,340 files</p>
          </div>
          <div className="p-4 bg-navy-700 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Image Files</p>
            <p className="text-2xl font-bold">600 MB</p>
            <p className="text-xs text-gray-400 mt-1">6,200 files</p>
          </div>
        </div>
        <button className="mt-4 text-accent-blue hover:underline text-sm">
          Manage storage →
        </button>
      </div>

      {/* Delete Data */}
      <div className="card-dark p-6 border border-red-500/50">
        <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center space-x-2">
          <HiTrash />
          <span>Delete Data</span>
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 rounded-lg">
            <div className="flex items-start space-x-3 mb-3">
              <HiExclamationCircle className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white mb-1">Delete Analysis History</p>
                <p className="text-sm text-gray-400">
                  Permanently delete all your detection results. This action cannot be undone.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
              Delete History
            </button>
          </div>
          <div className="p-4 bg-red-500/10 rounded-lg">
            <div className="flex items-start space-x-3 mb-3">
              <HiExclamationCircle className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white mb-1">Delete All Data</p>
                <p className="text-sm text-gray-400">
                  Permanently delete your entire account and all associated data. This action cannot be undone.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Delete Account & Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataManagementSettings
