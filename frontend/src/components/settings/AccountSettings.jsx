import React, { useState } from 'react'
import { HiPencil, HiCheck, HiX, HiCamera, HiTrash } from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

const AccountSettings = () => {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.organizationName || '',
    jobTitle: user?.jobTitle || '',
    timezone: user?.timezone || 'Asia/Kolkata',
    language: user?.language || 'en'
  })
  const [profileImage, setProfileImage] = useState(null)

  const handleSave = () => {
    // Update user profile
    updateUser({ ...user, ...formData })
    setEditing(false)
    alert('Profile updated successfully!')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Profile Picture</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-blue to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-2 bg-accent-blue rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
              <HiCamera className="text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Upload new picture</h4>
            <p className="text-sm text-gray-400 mb-3">
              JPG, PNG or GIF. Max size 5MB. Recommended 400x400px.
            </p>
            <div className="flex space-x-3">
              <label className="btn-secondary cursor-pointer">
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
              {profileImage && (
                <button
                  onClick={() => setProfileImage(null)}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card-dark p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Personal Information</h3>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center space-x-2 text-accent-blue hover:text-blue-400 transition-colors"
            >
              <HiPencil />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-accent-green text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <HiCheck />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    company: user?.organizationName || '',
                    jobTitle: user?.jobTitle || '',
                    timezone: user?.timezone || 'Asia/Kolkata',
                    language: user?.language || 'en'
                  })
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <HiX />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="text-white font-medium">{formData.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email Address
            </label>
            {editing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
            ) : (
              <p className="text-white font-medium">{formData.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Phone Number
            </label>
            {editing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                placeholder="+91 98765 43210"
              />
            ) : (
              <p className="text-white font-medium">{formData.phone || 'Not provided'}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Company / Organization
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="input-field"
                placeholder="Your Company"
              />
            ) : (
              <p className="text-white font-medium">{formData.company || user?.userType}</p>
            )}
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Job Title
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="input-field"
                placeholder="Software Engineer"
              />
            ) : (
              <p className="text-white font-medium">{formData.jobTitle || 'Not provided'}</p>
            )}
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Timezone
            </label>
            {editing ? (
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="input-field"
              >
                <option value="Asia/Kolkata">India (IST - UTC+5:30)</option>
                <option value="America/New_York">New York (EST - UTC-5)</option>
                <option value="America/Los_Angeles">Los Angeles (PST - UTC-8)</option>
                <option value="Europe/London">London (GMT - UTC+0)</option>
                <option value="Europe/Paris">Paris (CET - UTC+1)</option>
                <option value="Asia/Tokyo">Tokyo (JST - UTC+9)</option>
                <option value="Asia/Dubai">Dubai (GST - UTC+4)</option>
                <option value="Australia/Sydney">Sydney (AEDT - UTC+11)</option>
              </select>
            ) : (
              <p className="text-white font-medium">{formData.timezone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card-dark p-6">
        <h3 className="text-xl font-bold mb-4">Account Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              User ID
            </label>
            <p className="text-white font-mono text-sm">{user?.userId || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Account Type
            </label>
            <span className="inline-flex px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-full text-sm font-medium">
              {user?.userType}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Member Since
            </label>
            <p className="text-white font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'N/A'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Last Login
            </label>
            <p className="text-white font-medium">
              {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card-dark p-6 border border-red-500/50">
        <h3 className="text-xl font-bold mb-4 text-red-400">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg">
            <div>
              <h4 className="font-semibold text-white mb-1">Deactivate Account</h4>
              <p className="text-sm text-gray-400">
                Temporarily disable your account. You can reactivate it anytime.
              </p>
            </div>
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
              Deactivate
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg">
            <div>
              <h4 className="font-semibold text-white mb-1">Delete Account</h4>
              <p className="text-sm text-gray-400">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
